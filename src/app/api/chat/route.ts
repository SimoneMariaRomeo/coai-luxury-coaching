import { NextRequest, NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'
import OpenAI from 'openai'

const FALLBACK_NOTE = 'Offline mode: live coaching responses are temporarily unavailable.'

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

function buildFallbackStartResponse(sessionPrompt: string) {
  const guidance = extractGuidance(sessionPrompt)
  return [
    "Let's get started while we reconnect.",
    `Focus for now: ${guidance}`,
    FALLBACK_NOTE,
  ].join('\n\n')
}

function buildFallbackFollowUpResponse(sessionPrompt: string, userMessage: string) {
  const guidance = extractGuidance(sessionPrompt)
  return [
    "Thanks for sharing that insight.",
    `Keep reflecting on: ${guidance}`,
    "Capture your thoughts locally and we'll sync once the connection returns.",
    FALLBACK_NOTE,
  ].join('\n\n')
}

async function createCompletion(openai: OpenAI | null, payload: Parameters<OpenAI['chat']['completions']['create']>[0]) {
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
    console.error('OpenAI completion failed:', error)
    return null
  }
}

function getOpenAI() {
  const apiKey = process.env.OPENAI_API_KEY

  if (!apiKey) {
    console.warn('OPENAI_API_KEY environment variable is not set. Falling back to offline prompts.')
    return null
  }

  return new OpenAI({
    apiKey,
  })
}

export async function POST(request: NextRequest) {
  try {
    const { topicId, sessionId, action, message, messages } = await request.json()

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

      // Combine prompts
      const systemPrompt = `${stylePrompt}\n\n${sessionPrompt}`

      const openai = getOpenAI()
      const aiResponse = await createCompletion(openai, {
        model: 'gpt-5-nano',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: "Hello, I'm ready to start this session." },
        ],
        max_tokens: 1000,
        temperature: 0.7,
      })

      const messageText = aiResponse ?? buildFallbackStartResponse(sessionPrompt)

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

      const systemPrompt = `${stylePrompt}\n\n${sessionPrompt}`

      // Convert messages to OpenAI format
      const openaiMessages = [
        { role: 'system', content: systemPrompt },
        ...messages.map((msg: any) => ({
          role: msg.role,
          content: msg.content
        }))
      ]

      const openai = getOpenAI()
      const aiResponse = await createCompletion(openai, {
        model: 'gpt-5-nano',
        messages: openaiMessages,
        max_tokens: 1000,
        temperature: 0.7,
      })

      const messageText = aiResponse ?? buildFallbackFollowUpResponse(sessionPrompt, message ?? '')

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

