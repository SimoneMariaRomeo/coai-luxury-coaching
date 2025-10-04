import { NextRequest, NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'
import OpenAI from 'openai'
import { LANGUAGE_PROMPT_LABELS, type Language } from '@/lib/language-constants'
import { UI_COPY } from '@/lib/translations'

let cachedApiKey: string | null | undefined
const RETRYABLE_ERROR_CODES = new Set(['ETIMEDOUT', 'ECONNRESET', 'EAI_AGAIN'])
const MAX_COMPLETION_RETRIES = 2
const RETRY_DELAY_MS = 600

const DEFAULT_CHAT_MODEL = process.env.OPENAI_CHAT_MODEL?.trim()
  || process.env.OPENAI_MODEL?.trim()
  || process.env.NEXT_PUBLIC_OPENAI_CHAT_MODEL?.trim()
  || 'gpt-4o-mini'

function normalizeLanguage(input: unknown): Language {
  return input === 'zh' ? 'zh' : 'en'
}

function resolveOpenAIKey() {
  if (typeof cachedApiKey !== 'undefined') {
    return cachedApiKey
  }

  const directKey = process.env.OPENAI_API_KEY?.trim()
  if (directKey) {
    cachedApiKey = directKey
    return cachedApiKey
  }

  try {
    const secretsPath = join(process.cwd(), 'secrets.env')
    const file = readFileSync(secretsPath, 'utf-8')
    const lines = file.split(/\r?\n/)

    for (const line of lines) {
      const match = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.+)\s*$/)
      if (!match) {
        continue
      }
      const [, key, rawValue] = match
      if (key !== 'OPENAI_API_KEY') {
        continue
      }
      const cleaned = rawValue.replace(/^['"]|['"]$/g, '').trim()
      if (cleaned) {
        cachedApiKey = cleaned
        return cachedApiKey
      }
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'unknown error'
    console.warn(`Unable to read secrets.env for OPENAI_API_KEY: ${message}`)
  }

  cachedApiKey = null
  return cachedApiKey
}

function extractGuidance(prompt: string) {
  const bulletPattern = /^[-*]\s+/
  const numberedPattern = /^\d+[.)]?\s+/

  const lines = prompt
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)

  const candidate =
    lines.find((line) => bulletPattern.test(line)) ||
    lines.find((line) => numberedPattern.test(line)) ||
    lines.find((line) => line.length > 25) ||
    lines[0] ||
    'Take a moment to note what you hope to gain from this session.'

  let cleaned = candidate.replace(bulletPattern, '')
  cleaned = cleaned.replace(numberedPattern, '')

  return cleaned.trim()
}

function buildFallbackStartResponse(sessionPrompt: string, language: Language) {
  const copy = UI_COPY[language] ?? UI_COPY.en
  const guidance = extractGuidance(sessionPrompt)
  return [
    copy.fallback.startIntro,
    `${copy.fallback.focusPrefix} ${guidance}`,
    copy.fallback.offlineNote,
  ].join('\n\n')
}

function buildFallbackFollowUpResponse(sessionPrompt: string, _userMessage: string, language: Language) {
  const copy = UI_COPY[language] ?? UI_COPY.en
  const guidance = extractGuidance(sessionPrompt)
  return [
    copy.fallback.followThanks,
    `${copy.fallback.followFocusPrefix} ${guidance}`,
    copy.fallback.followCapture,
    copy.fallback.offlineNote,
  ].join('\n\n')
}

function buildSystemPrompt(stylePrompt: string, sessionPrompt: string, language: Language) {
  const promptLanguage = LANGUAGE_PROMPT_LABELS[language] ?? LANGUAGE_PROMPT_LABELS.en
  const cleanedStyle = stylePrompt.trim()
  const cleanedSession = sessionPrompt.trim()
  const parts = [
    cleanedStyle,
    cleanedSession,
    `Write in ${promptLanguage} unless the user asks differently.`,
  ].filter(Boolean)

  return parts.join('\n\n')
}

async function createCompletion(openai: OpenAI | null, payload: Parameters<OpenAI['chat']['completions']['create']>[0], attempt = 0): Promise<string | null> {
  if (!openai) {
    return null
  }

  try {
    const completion = await openai.chat.completions.create({
      ...payload,
      stream: false,
    })

    const choice = (completion as { choices?: Array<{ message?: { content?: string } }> }).choices?.[0]
    return choice?.message?.content ?? null
  } catch (error) {
    const errorCode = typeof error === 'object' && error !== null && 'code' in error ? String((error as any).code) : undefined

    if (errorCode && RETRYABLE_ERROR_CODES.has(errorCode) && attempt < MAX_COMPLETION_RETRIES) {
      console.warn(`OpenAI completion attempt ${attempt + 1} failed with ${errorCode}. Retrying...`)
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS * (attempt + 1)))
      return createCompletion(openai, payload, attempt + 1)
    }

    console.error('OpenAI completion failed:', error)
    return null
  }
}

function getOpenAI() {
  const apiKey = resolveOpenAIKey()
  if (!apiKey) {
    console.warn('OPENAI_API_KEY is not configured. Falling back to offline prompts.')
    return null
  }

  const baseURL = process.env.OPENAI_BASE_URL?.trim()
  const clientOptions: ConstructorParameters<typeof OpenAI>[0] = { apiKey }

  if (baseURL) {
    clientOptions.baseURL = baseURL
  }

  return new OpenAI(clientOptions)
}

export async function POST(request: NextRequest) {
  try {
    const { topicId, sessionId, action, message, messages, language } = await request.json()
    const normalizedLanguage = normalizeLanguage(language)

    if (action === 'start') {
      // Load session prompt
      let sessionPromptPath
      if (topicId === 'generic-coaching') {
        sessionPromptPath = join(process.cwd(), 'src', 'system-prompts', 'general-coaching.txt')
      } else {
        sessionPromptPath = join(process.cwd(), 'src', 'system-prompts', topicId, `${sessionId}.txt`)
      }
      const stylePromptPath = join(process.cwd(), 'src', 'styles', 'coaching.txt') // Default to coaching
      
      let sessionPrompt = ''
      let stylePrompt = ''

      try {
        sessionPrompt = readFileSync(sessionPromptPath, 'utf-8')
      } catch (error) {
        console.error('Error reading session prompt:', error)
        return NextResponse.json({ error: 'Session prompt not found' }, { status: 404 })
      }

      try {
        stylePrompt = readFileSync(stylePromptPath, 'utf-8')
      } catch (error) {
        console.error('Error reading style prompt:', error)
        // Continue without style prompt
      }

      const systemPrompt = buildSystemPrompt(stylePrompt, sessionPrompt, normalizedLanguage)

      const openai = getOpenAI()
      const aiResponse = await createCompletion(openai, {
        model: DEFAULT_CHAT_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: "Hello, I'm ready to start this session." },
        ],
        max_tokens: 1000,
        temperature: 0.7,
      })

      const messageText = aiResponse ?? buildFallbackStartResponse(sessionPrompt, normalizedLanguage)

      return NextResponse.json({
        message: messageText,
        fallback: aiResponse === null,
      })

    } else if (action === 'message') {
      // Continue conversation
      let sessionPromptPath
      if (topicId === 'generic-coaching') {
        sessionPromptPath = join(process.cwd(), 'src', 'system-prompts', 'general-coaching.txt')
      } else {
        sessionPromptPath = join(process.cwd(), 'src', 'system-prompts', topicId, `${sessionId}.txt`)
      }
      const stylePromptPath = join(process.cwd(), 'src', 'styles', 'coaching.txt')
      
      let sessionPrompt = ''
      let stylePrompt = ''

      try {
        sessionPrompt = readFileSync(sessionPromptPath, 'utf-8')
      } catch (error) {
        console.error('Error reading session prompt:', error)
        return NextResponse.json({ error: 'Session prompt not found' }, { status: 404 })
      }

      try {
        stylePrompt = readFileSync(stylePromptPath, 'utf-8')
      } catch (error) {
        console.error('Error reading style prompt:', error)
      }

      const systemPrompt = buildSystemPrompt(stylePrompt, sessionPrompt, normalizedLanguage)

      const safeMessages = Array.isArray(messages) ? messages : []
      const openaiMessages = [
        { role: 'system', content: systemPrompt },
        ...safeMessages.map((msg: any) => ({
          role: msg.role,
          content: msg.content,
        })),
      ]

      const openai = getOpenAI()
      const aiResponse = await createCompletion(openai, {
        model: DEFAULT_CHAT_MODEL,
        messages: openaiMessages,
        max_tokens: 1000,
        temperature: 0.7,
      })

      const messageText = aiResponse ?? buildFallbackFollowUpResponse(sessionPrompt, message ?? '', normalizedLanguage)

      return NextResponse.json({
        message: messageText,
        fallback: aiResponse === null,
      })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })

  } catch (error) {
    console.error('Error in chat API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}


