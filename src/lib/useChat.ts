import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { useLanguageStore } from './language'
import { UI_COPY } from './translations'

interface AssistantCommand {
  command: string
  labels?: Record<string, string>
}

interface Message {
  role: 'user' | 'assistant'
  content: string
  command?: AssistantCommand
}

interface UseChatOptions {
  enabled?: boolean
}

function parseAssistantPayload(raw: unknown): { content: string; command?: AssistantCommand } {
  if (typeof raw !== 'string') {
    return { content: '' }
  }

  const trimmed = raw.replace(/\s+$/, '')
  const segments = trimmed.split(/\r?\n/)
  let command: AssistantCommand | undefined
  let content = trimmed

  if (segments.length > 0) {
    const candidate = segments[segments.length - 1].trim()
    if (candidate.startsWith('{') && candidate.endsWith('}')) {
      try {
        const parsed = JSON.parse(candidate) as Record<string, unknown>
        if (parsed && typeof parsed.command === 'string') {
          command = { command: parsed.command }

          if (parsed.labels && typeof parsed.labels === 'object' && parsed.labels !== null) {
            const entries = Object.entries(parsed.labels as Record<string, unknown>).filter((entry): entry is [string, string] => {
              const [key, value] = entry
              return typeof key === 'string' && typeof value === 'string'
            })
            if (entries.length > 0) {
              command.labels = Object.fromEntries(entries)
            }
          }

          segments.pop()
          content = segments.join('\n').replace(/\s+$/, '')
        }
      } catch (error) {
        console.debug('Unable to parse assistant command payload:', error)
      }
    }
  }

  return {
    content,
    command,
  }
}

function mapHistoryForRequest(history: Message[]): Array<{ role: Message['role']; content: string }> {
  return history.map((entry) => ({
    role: entry.role,
    content: entry.content,
  }))
}

export function useChat(topicId: string, sessionId: string, options?: UseChatOptions) {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const enabled = options?.enabled ?? true
  const language = useLanguageStore((state) => state.language)
  const copy = UI_COPY[language]

  useEffect(() => {
    if (!enabled) {
      setMessages([])
      return
    }

    loadSessionPrompt()
    // intentionally disable exhaustive-deps because loadSessionPrompt is stable within this scope
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topicId, sessionId, enabled, language])

  const loadSessionPrompt = async () => {
    if (!enabled) {
      return
    }

    try {
      setIsLoading(true)

      const response = await fetch(`/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topicId,
          sessionId,
          action: 'start',
          language,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to load session')
      }

      const data = await response.json()
      const isFallback = data.fallback === true

      const parsed = parseAssistantPayload(data.message)
      setMessages([
        {
          role: 'assistant',
          content: parsed.content,
          command: parsed.command,
        },
      ])

      toast.success(isFallback ? copy.chat.offlineLoaded : copy.chat.loaded)
    } catch (error) {
      console.error('Error loading session:', error)
      toast.error(copy.chat.loadFailed)
    } finally {
      setIsLoading(false)
    }
  }

  const sendMessage = async (content: string) => {
    if (!enabled) {
      toast.error(copy.chat.signInRequired)
      return
    }

    if (!content.trim()) {
      return
    }

    const userMessage: Message = { role: 'user', content }
    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    try {
      const response = await fetch(`/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topicId,
          sessionId,
          action: 'message',
          message: content,
          messages: mapHistoryForRequest([...messages, userMessage]),
          language,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      const data = await response.json()
      const isFallback = data.fallback === true
      const parsed = parseAssistantPayload(data.message)

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: parsed.content,
          command: parsed.command,
        },
      ])

      if (isFallback) {
        toast(copy.chat.offlineFallbackToast, { icon: '!' })
      }
    } catch (error) {
      console.error('Error sending message:', error)
      toast.error(copy.chat.sendFailed)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    messages,
    sendMessage,
    isLoading,
  }
}



