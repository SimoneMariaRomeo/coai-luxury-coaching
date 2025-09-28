'use client'

import { useState, useEffect, useMemo } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import config from '@/lib/config.json'
import { useProgressStore } from '@/lib/store'

type SessionState = {
  session: any
  index: number
  isCompleted: boolean
  isLocked: boolean
  isCurrent: boolean
  hasStarted: boolean
}

export default function TopicPage() {
  const params = useParams()
  const topicId = params.topic as string
  const [topic, setTopic] = useState<any>(null)
  const progress = useProgressStore((state) => state.progress)
  const hasStartedSession = useProgressStore((state) => state.hasStartedSession)
  const isSessionCompleted = useProgressStore((state) => state.isSessionCompleted)

  useEffect(() => {
    if (topicId && config.topics[topicId as keyof typeof config.topics]) {
      setTopic(config.topics[topicId as keyof typeof config.topics])
    }
  }, [topicId])

  const sessionStates: SessionState[] = useMemo(() => {
    if (!topic) return []

    return topic.sessions.map((session: any, index: number) => {
      const isCompleted = isSessionCompleted(topicId, session.id)
      const previousCompleted = index === 0 ? true : isSessionCompleted(topicId, topic.sessions[index - 1].id)
      const isLocked = !previousCompleted
      const isCurrent = !isCompleted && !isLocked
      const hasStarted = hasStartedSession(topicId, session.id)

      return {
        session,
        index,
        isCompleted,
        isLocked,
        isCurrent,
        hasStarted
      }
    })
  }, [topic, topicId, isSessionCompleted, hasStartedSession, progress])

  if (!topic) {
    return (
      <div className="min-h-screen luxury-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-luxury-gold mx-auto mb-4"></div>
          <p className="text-luxury-text-light">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen luxury-gradient relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-luxury-gold opacity-10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-luxury-gold opacity-10 rounded-full blur-3xl"></div>
      </div>

      {/* Breadcrumbs */}
      <div className="relative z-10 pt-8 px-4">
        <nav className="max-w-6xl mx-auto">
          <Link href="/" className="text-luxury-gold hover:text-luxury-gold-light transition-colors">
            Home
          </Link>
          <span className="mx-2 text-luxury-text-muted">›</span>
          <span className="text-luxury-text-light capitalize">{topicId}</span>
        </nav>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-20">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto mb-16"
        >
          <h1 className="text-5xl md:text-7xl font-playfair font-bold mb-6">
            <span className="gold-text">{topic.title}</span>
          </h1>
          <p className="text-xl md:text-2xl text-luxury-text-light mb-8 font-light">
            {topic.intro}
          </p>
        </motion.div>

        {/* Learning Objectives */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="w-full max-w-5xl mx-auto mb-12"
        >
          <div className="glass-effect rounded-3xl p-8 md:p-12 luxury-shadow">
            <h2 className="text-3xl font-playfair font-semibold text-center mb-8 text-luxury-text">
              Learning Objectives
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {topic.objectives.map((objective: string, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.08 * index }}
                  className="rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 p-6 text-left"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-luxury-gold/15 text-luxury-gold flex items-center justify-center font-semibold text-xl">
                      {index + 1}
                    </div>
                    <div className="h-1 w-16 rounded-full bg-luxury-gold/40"></div>
                  </div>
                  <p className="text-sm md:text-base text-luxury-text-light leading-relaxed">
                    {objective}
                  </p>
                </motion.div>
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link href={`/topics/${topicId}/sessions/${topic.sessions[0].id}`}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-luxury-gold text-luxury-dark px-10 py-3 md:px-12 md:py-4 rounded-lg text-lg md:text-xl font-semibold luxury-shadow hover:shadow-2xl transition-all duration-300"
                >
                  Start Your Journey
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Sessions Overview */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="w-full max-w-4xl mx-auto mb-16"
        >
          <h2 className="text-3xl font-playfair font-semibold text-center mb-8 text-luxury-text">
            Your Learning Journey
          </h2>
          <div className="space-y-4">
            {sessionStates.map(({ session, index, isCompleted, isLocked, isCurrent, hasStarted }) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className={`glass-effect rounded-xl p-6 luxury-shadow transition-all duration-300 ${
                  isLocked ? 'opacity-60 saturate-75' : 'hover:shadow-2xl'
                } ${isCompleted ? 'border border-luxury-gold/40 bg-luxury-gold/10' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-lg bg-luxury-gold/20 text-luxury-gold flex items-center justify-center">
                      <span className="text-lg font-bold">{index + 1}</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-playfair font-semibold text-luxury-text">
                        {session.title}
                      </h3>
                      <p className="text-luxury-text-muted capitalize">
                        {session.type} Session
                      </p>
                      <p className="text-sm mt-1 text-luxury-text-muted/80">
                        {isCompleted
                          ? 'Completed'
                          : isLocked
                            ? 'Unlock by completing the previous step'
                            : hasStarted
                              ? 'In progress'
                              : 'Ready to begin'}
                      </p>
                    </div>
                  </div>
                  {isLocked ? (
                    <button
                      disabled
                      className="bg-luxury-text-muted/20 text-luxury-text-muted border border-luxury-text-muted/30 px-6 py-3 rounded-lg font-semibold cursor-not-allowed"
                    >
                      Locked
                    </button>
                  ) : (
                    <Link href={`/topics/${topicId}/sessions/${session.id}`}>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 border ${
                          isCompleted
                            ? 'bg-transparent text-luxury-gold border-luxury-gold hover:bg-luxury-gold/20'
                            : 'bg-luxury-gold/20 text-luxury-gold border-luxury-gold hover:bg-luxury-gold hover:text-luxury-dark'
                        }`}
                      >
                        {isCompleted ? 'Review Session' : isCurrent ? 'Continue Session' : 'Start Session'}
                      </motion.button>
                    </Link>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

