'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useSession } from '@supabase/auth-helpers-react'
import { useProgressStore } from '@/lib/store'
import { useChat } from '@/lib/useChat'
import { Toaster } from 'react-hot-toast'
import config from '@/lib/config.json'

export default function SessionPage() {
  const params = useParams()
  const router = useRouter()
  const topicId = params.topic as string
  const sessionId = params.session as string
  const [topic, setTopic] = useState<any>(null)
  const [session, setSession] = useState<any>(null)
  const [sessionIndex, setSessionIndex] = useState(0)

  const authSession = useSession()
  const isAuthenticated = Boolean(authSession?.user)
  const destinationPath = `/topics/${topicId}/sessions/${sessionId}`

  const markSessionStarted = useProgressStore((state) => state.markSessionStarted)
  const { messages, sendMessage, isLoading } = useChat(topicId, sessionId, { enabled: isAuthenticated })

  useEffect(() => {
    if (topicId && config.topics[topicId as keyof typeof config.topics]) {
      const topicData = config.topics[topicId as keyof typeof config.topics]
      setTopic(topicData)

      const sessionData = topicData.sessions.find((s: any) => s.id === sessionId)
      if (sessionData) {
        setSession(sessionData)
        setSessionIndex(topicData.sessions.findIndex((s: any) => s.id === sessionId))
      }
    }
  }, [topicId, sessionId])

  const hasMarkedStarted = useRef(false)

  useEffect(() => {
    if (hasMarkedStarted.current) {
      return
    }

    if (!topic || !session) {
      return
    }

    if (messages.length === 0) {
      return
    }

    markSessionStarted(topicId, sessionId, {
      sessionTitle: session.title,
      topicTitle: topic.title,
    })
    hasMarkedStarted.current = true
  }, [topicId, sessionId, topic, session, messages, markSessionStarted])

  const handleRequireAuth = () => {
    router.push(`/login?redirect=${encodeURIComponent(destinationPath)}`)
  }

  if (!topic || !session) {
    return (
      <div className="min-h-screen luxury-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-luxury-gold mx-auto mb-4"></div>
          <p className="text-luxury-text-light">Loading session...</p>
        </div>
      </div>
    )
  }

  const progressPercentage = ((sessionIndex + 1) / topic.sessions.length) * 100

  return (
    <div className="min-h-screen luxury-gradient relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-luxury-gold opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-luxury-gold opacity-10 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 pt-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumbs */}
          <nav className="mb-6">
            <Link href="/" className="text-luxury-gold hover:text-luxury-gold-light transition-colors">
              Home
            </Link>
            <span className="mx-2 text-luxury-text-muted">&rsaquo;</span>
            <Link href={`/topics/${topicId}`} className="text-luxury-gold hover:text-luxury-gold-light transition-colors">
              {topic.title}
            </Link>
            <span className="mx-2 text-luxury-text-muted">&rsaquo;</span>
            <span className="text-luxury-text-light">{session.title}</span>
          </nav>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-luxury-text-light">Session {sessionIndex + 1} of {topic.sessions.length}</span>
              <span className="text-sm text-luxury-gold">{Math.round(progressPercentage)}%</span>
            </div>
            <div className="w-full bg-luxury-text-muted/10 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 0.8 }}
                className="bg-luxury-gold h-2 rounded-full"
              />
            </div>
          </div>

          {/* Session Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-playfair font-bold mb-4">
              <span className="gold-text">{session.title}</span>
            </h1>
            <p className="text-lg text-luxury-text-light capitalize">
              {session.type} Session
            </p>
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="relative z-10 flex-1 px-4 pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="glass-effect rounded-2xl p-8 luxury-shadow min-h-[600px] flex flex-col">
            {!isAuthenticated && (
              <div className="mb-6 rounded-xl border border-luxury-text-muted/30 bg-white/70 px-5 py-4 text-luxury-text">
                <p className="text-base font-medium">Sign in to start this coaching session.</p>
                <p className="text-sm text-luxury-text-muted mt-2">
                  Your progress and conversation history stay synced once you are logged in.
                </p>
                <button
                  type="button"
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-luxury-gold px-4 py-2 text-sm font-semibold text-luxury-dark hover:bg-luxury-gold-light transition-colors"
                  onClick={handleRequireAuth}
                >
                  Go to sign in
                </button>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 space-y-6 mb-8 overflow-y-auto">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] p-4 rounded-2xl ${
                    message.role === 'user'
                      ? 'bg-luxury-gold text-luxury-dark'
                      : 'bg-luxury-text-muted/10 text-luxury-text'
                  }`}>
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-luxury-text-muted/10 text-luxury-text p-4 rounded-2xl">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-luxury-gold rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-luxury-gold rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-luxury-gold rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Input */}
            <div className="flex space-x-4">
              <input
                type="text"
                placeholder={isAuthenticated ? 'Type your response...' : 'Sign in to respond...'}
                className="flex-1 bg-luxury-text-muted/10 border border-luxury-text-muted/20 rounded-lg px-4 py-3 text-luxury-text placeholder-luxury-text-muted focus:outline-none focus:ring-2 focus:ring-luxury-gold disabled:cursor-not-allowed"
                disabled={!isAuthenticated || isLoading}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !isLoading) {
                    if (!isAuthenticated) {
                      handleRequireAuth()
                      return
                    }

                    sendMessage(e.currentTarget.value)
                    e.currentTarget.value = ''
                  }
                }}
              />
              <button
                onClick={() => {
                  const input = document.querySelector<HTMLInputElement>('input[type="text"]')
                  if (!input) {
                    return
                  }

                  if (!isAuthenticated) {
                    handleRequireAuth()
                    return
                  }

                  if (isLoading) {
                    return
                  }

                  sendMessage(input.value)
                  input.value = ''
                }}
                disabled={!isAuthenticated || isLoading}
                className="bg-luxury-gold text-luxury-dark px-6 py-3 rounded-lg font-semibold hover:bg-luxury-gold-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>

      <Toaster />
    </div>
  )
}
