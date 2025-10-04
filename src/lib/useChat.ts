import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { useLanguageStore } from './language'
import { UI_COPY } from './translations'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface UseChatOptions {
  enabled?: boolean
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

      setMessages([
        {
          role: 'assistant',
          content: data.message,
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
          messages: [...messages, userMessage],
          language,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to send message')
      }

      const data = await response.json()
      const isFallback = data.fallback === true

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.message,
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

