'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useProgressStore } from '@/lib/store'
import { useChat } from '@/lib/useChat'
import { Toaster } from 'react-hot-toast'
import config from '@/lib/config.json'

export default function SessionPage() {
  const params = useParams()
  const topicId = params.topic as string
  const sessionId = params.session as string
  const [topic, setTopic] = useState<any>(null)
  const [session, setSession] = useState<any>(null)
  const [sessionIndex, setSessionIndex] = useState(0)
  
  const { progress, updateProgress } = useProgressStore()
  const { messages, sendMessage, isLoading } = useChat(topicId, sessionId)

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

  if (!topic || !session) {
    return (
      <div className="min-h-screen luxury-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-luxury-gold mx-auto mb-4"></div>
          <p className="text-luxury-white/70">Loading session...</p>
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
            <span className="mx-2 text-luxury-white/50">›</span>
            <Link href={`/topics/${topicId}`} className="text-luxury-gold hover:text-luxury-gold-light transition-colors">
              {topic.title}
            </Link>
            <span className="mx-2 text-luxury-white/50">›</span>
            <span className="text-luxury-white/70">{session.title}</span>
          </nav>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-luxury-white/70">Session {sessionIndex + 1} of {topic.sessions.length}</span>
              <span className="text-sm text-luxury-gold">{Math.round(progressPercentage)}%</span>
            </div>
            <div className="w-full bg-luxury-white/10 rounded-full h-2">
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
            <p className="text-lg text-luxury-white/70 capitalize">
              {session.type} Session
            </p>
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="relative z-10 flex-1 px-4 pb-8">
        <div className="max-w-4xl mx-auto">
          <div className="glass-effect rounded-2xl p-8 luxury-shadow min-h-[600px] flex flex-col">
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
                      : 'bg-luxury-white/10 text-luxury-white'
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
                  <div className="bg-luxury-white/10 text-luxury-white p-4 rounded-2xl">
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
                placeholder="Type your response..."
                className="flex-1 bg-luxury-white/10 border border-luxury-white/20 rounded-lg px-4 py-3 text-luxury-white placeholder-luxury-white/50 focus:outline-none focus:ring-2 focus:ring-luxury-gold"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !isLoading) {
                    sendMessage(e.currentTarget.value)
                    e.currentTarget.value = ''
                  }
                }}
              />
              <button
                onClick={() => {
                  const input = document.querySelector('input')
                  if (input && !isLoading) {
                    sendMessage(input.value)
                    input.value = ''
                  }
                }}
                disabled={isLoading}
                className="bg-luxury-gold text-luxury-dark px-6 py-3 rounded-lg font-semibold hover:bg-luxury-gold-light transition-colors disabled:opacity-50"
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

