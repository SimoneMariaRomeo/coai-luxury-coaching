﻿'use client'

import { useMemo } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useSession } from '@supabase/auth-helpers-react'
import toast from 'react-hot-toast'
import config from '@/lib/config.json'
import { useProgressStore } from '@/lib/store'
import { useLanguageStore } from '@/lib/language'
import { UI_COPY, getLocalizedTopic, getSessionTypeLabel } from '@/lib/translations'

type TopicKey = keyof typeof config.topics

export default function TopicPage() {
  const params = useParams()
  const topicId = params.topic as TopicKey
  const topicProgress = useProgressStore((state) => state.progress[topicId] ?? {})
  const router = useRouter()
  const session = useSession()
  const isAuthenticated = Boolean(session?.user)
  const language = useLanguageStore((state) => state.language)
  const copy = UI_COPY[language]

  const topic = useMemo(() => {
    if (!topicId) {
      return null
    }
    return getLocalizedTopic(topicId, language)
  }, [topicId, language])

  const handleSessionNavigation = (targetSessionId: string) => {
    if (!topic) {
      return
    }

    const destination = `/topics/${topicId}/sessions/${targetSessionId}`

    if (!isAuthenticated) {
      toast.error(copy.common.signInToStartSpecific)
      router.push(`/login?redirect=${encodeURIComponent(destination)}`)
      return
    }

    router.push(destination)
  }

  if (!topic) {
    return (
      <div className="min-h-screen luxury-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-luxury-gold mx-auto mb-4"></div>
          <p className="text-luxury-text-light">{copy.common.loading}</p>
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
            {copy.common.home}
          </Link>
          <span className="mx-2 text-luxury-text-muted">{'>'}</span>
          <span className="text-luxury-text-light">{topic.title}</span>
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
          className="w-full max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-3xl font-playfair font-semibold text-center mb-8 text-luxury-text">
            {copy.topic.learningObjectives}
          </h2>
          <motion.ol
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            {topic.objectives.map((objective: string, index: number) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.05 * index }}
              >
                <div className="flex items-start gap-4 rounded-2xl border border-luxury-light-gray/30 bg-white/85 px-5 py-4 shadow-sm backdrop-blur">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-luxury-gold text-luxury-dark font-semibold">
                    {index + 1}
                  </span>
                  <p className="text-base leading-relaxed text-luxury-text">{objective}</p>
                </div>
              </motion.li>
            ))}
          </motion.ol>
        </motion.div>

        {/* Start Journey CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-center w-full max-w-4xl mx-auto mb-12"
        >
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-luxury-gold text-luxury-dark px-12 py-4 rounded-lg text-xl font-semibold luxury-shadow hover:shadow-2xl transition-all duration-300"
            onClick={() => {
              const firstSessionId = topic.sessions[0]?.id
              if (firstSessionId) {
                handleSessionNavigation(firstSessionId)
              }
            }}
          >
            {copy.topic.startJourney}
          </motion.button>
          {!isAuthenticated && (
            <p className="mt-4 text-sm text-luxury-text-light">
              {copy.topic.signInHint}
            </p>
          )}
        </motion.div>

        {/* Sessions Overview */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="w-full max-w-4xl mx-auto mb-16"
        >
          <h2 className="text-3xl font-playfair font-semibold text-center mb-8 text-luxury-text">
            {copy.topic.journeyTitle}
          </h2>
          <div className="space-y-4">
            {topic.sessions.map((sessionItem: any, index: number) => {
              const previousSessionId = index > 0 ? topic.sessions[index - 1].id : null
              const previousProgress = previousSessionId ? topicProgress[previousSessionId] : undefined
              const sessionProgress = topicProgress[sessionItem.id] ?? { started: false, completed: false }
              const isUnlocked = index === 0 || Boolean(previousProgress?.started || previousProgress?.completed)
              const isStarted = Boolean(sessionProgress.started)
              const isCompleted = Boolean(sessionProgress.completed)
              const cardClasses = [
                'glass-effect rounded-xl p-6 transition-all duration-300 border',
                isUnlocked ? 'luxury-shadow hover:shadow-2xl bg-white/80' : 'bg-white/60 opacity-60 saturate-50',
                isCompleted ? 'border-luxury-gold bg-white/90' : 'border-transparent',
              ].join(' ')
              const primaryButtonClass = isStarted || isCompleted
                ? 'bg-luxury-gold text-luxury-dark border border-luxury-gold px-6 py-3 rounded-lg font-semibold luxury-shadow hover:shadow-2xl transition-all duration-300'
                : 'bg-luxury-gold/20 text-luxury-gold border border-luxury-gold px-6 py-3 rounded-lg font-semibold hover:bg-luxury-gold hover:text-luxury-dark transition-all duration-300'
              const buttonLabel = isCompleted ? copy.topic.review : isStarted ? copy.topic.continue : copy.topic.start
              const actionableButtonClass = isAuthenticated
                ? primaryButtonClass
                : 'bg-luxury-gold/20 text-luxury-gold border border-luxury-gold px-6 py-3 rounded-lg font-semibold transition-all duration-300 opacity-80'
              const sessionTypeLabel = getSessionTypeLabel(sessionItem.type, language)
              const indicatorClasses = isCompleted
                ? 'w-12 h-12 rounded-lg bg-luxury-gold text-luxury-dark flex items-center justify-center'
                : 'w-12 h-12 rounded-lg bg-luxury-gold/20 text-luxury-gold flex items-center justify-center'
              const indicatorLabel = isCompleted ? '\u2713' : String(index + 1)

              return (
                <motion.div
                  key={sessionItem.id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className={cardClasses}
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start space-x-4">
                      <div className={indicatorClasses}>
                        <span className="text-lg font-bold">{indicatorLabel}</span>
                      </div>
                      <div>
                        <h3 className={`text-xl font-playfair font-semibold ${isUnlocked ? 'text-luxury-text' : 'text-luxury-text-muted'}`}>
                          {sessionItem.title}
                        </h3>
                        <p className={`text-sm ${isUnlocked ? 'text-luxury-text-muted' : 'text-luxury-text-muted/70'}`}>
                          {sessionTypeLabel}
                        </p>
                      </div>
                    </div>
                    {isUnlocked ? (
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={actionableButtonClass}
                        onClick={() => handleSessionNavigation(sessionItem.id)}
                      >
                        {buttonLabel}
                      </motion.button>
                    ) : (
                      <span className="inline-flex items-center px-6 py-3 rounded-lg font-semibold border border-dashed border-luxury-text-muted/40 text-luxury-text-muted/80 cursor-not-allowed">
                        {copy.topic.locked}
                      </span>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

      </div>
    </div>
  )
}

