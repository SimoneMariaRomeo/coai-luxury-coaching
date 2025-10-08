'use client'

import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import type { PointerEventHandler, MouseEventHandler } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useSession } from '@supabase/auth-helpers-react'
import toast from 'react-hot-toast'
import config from '@/lib/config.json'
import { useLanguageStore } from '@/lib/language'
import { UI_COPY, getLocalizedTopic } from '@/lib/translations'

type TopicKey = keyof typeof config.topics

const HERO_TOPIC_IDS: TopicKey[] = Object.keys(config.topics) as TopicKey[]
const ROTATION_INTERVAL = 3500
const LONG_PRESS_DURATION = 400
const SWIPE_THRESHOLD = 35

interface ManualState {
  timeoutId: ReturnType<typeof setTimeout> | null
  active: boolean
  pointerId: number | null
  lastY: number
  suppressClick: boolean
}

export default function HomePage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [listActivated, setListActivated] = useState(false)
  const manualRef = useRef<ManualState>({
    timeoutId: null,
    active: false,
    pointerId: null,
    lastY: 0,
    suppressClick: false,
  })

  const router = useRouter()
  const session = useSession()
  const isAuthenticated = Boolean(session?.user)
  const language = useLanguageStore((state) => state.language)
  const copy = UI_COPY[language]

  const heroTopics = useMemo(() => {
    return HERO_TOPIC_IDS.map((topicId) => {
      const topic = getLocalizedTopic(topicId, language)
      return {
        id: topicId,
        title: topic?.title ?? config.topics[topicId].title,
        intro:
          topic?.intro
            ?? config.topics[topicId].intro,
      }
    })
  }, [language])

  const currentTopic = heroTopics[currentIndex]

  useEffect(() => {
    setCurrentIndex(0)
  }, [language])

  const cycleTopic = useCallback(
    (step: number) => {
      if (heroTopics.length === 0) {
        return
      }
      setCurrentIndex((prev) => {
        const nextIndex = (prev + step + heroTopics.length) % heroTopics.length
        return nextIndex
      })
    },
    [heroTopics]
  )

  useEffect(() => {
    if (heroTopics.length === 0 || isPaused) {
      return
    }

    const interval = setInterval(() => {
      cycleTopic(1)
    }, ROTATION_INTERVAL)

    return () => clearInterval(interval)
  }, [heroTopics, isPaused, cycleTopic])

  const clearManualTimeout = () => {
    const state = manualRef.current
    if (state.timeoutId) {
      clearTimeout(state.timeoutId)
      state.timeoutId = null
    }
  }

  const handleGetCoached = () => {
    if (!isAuthenticated) {
      toast.error(copy.home.signInToast)
      router.push(`/login?redirect=${encodeURIComponent('/generic-coaching')}`)
      return
    }

    router.push('/generic-coaching')
  }

  const handleTopicPointerDown: PointerEventHandler<HTMLAnchorElement> = (event) => {
    if (event.pointerType === 'mouse') {
      return
    }

    const state = manualRef.current
    clearManualTimeout()
    state.active = false
    state.pointerId = event.pointerId
    state.lastY = event.clientY
    state.suppressClick = false
    setListActivated(true)
    state.timeoutId = setTimeout(() => {
      state.active = true
      state.suppressClick = true
      setIsPaused(true)
    }, LONG_PRESS_DURATION)

    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handleTopicPointerMove: PointerEventHandler<HTMLAnchorElement> = (event) => {
    const state = manualRef.current
    if (!state.active || event.pointerId !== state.pointerId) {
      return
    }

    const delta = event.clientY - state.lastY
    if (Math.abs(delta) >= SWIPE_THRESHOLD) {
      cycleTopic(delta > 0 ? -1 : 1)
      state.lastY = event.clientY
    }
  }

  const concludeManualInteraction: PointerEventHandler<HTMLAnchorElement> = (event) => {
    const state = manualRef.current
    if (event.pointerId !== state.pointerId) {
      return
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    const shouldSuppressClick = state.active || state.suppressClick
    clearManualTimeout()
    state.active = false
    state.pointerId = null
    state.lastY = 0
    state.suppressClick = shouldSuppressClick

    if (shouldSuppressClick) {
      event.preventDefault()
      setTimeout(() => {
        state.suppressClick = false
      }, 0)
      setTimeout(() => {
        setIsPaused(false)
      }, 600)
    }
  }

  const handleTopicClick: MouseEventHandler<HTMLAnchorElement> = (event) => {
    if (manualRef.current.suppressClick) {
      event.preventDefault()
      manualRef.current.suppressClick = false
    } else {
      setIsPaused(false)
    }
  }

  return (
    <div
      className="min-h-screen luxury-gradient text-luxury-text flex flex-col items-center px-6 relative overflow-hidden py-20"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => {
        setIsPaused(false)
      }}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-luxury-gold opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-luxury-gold opacity-20 blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-luxury-accent opacity-10 blur-3xl"></div>
      </div>

      <main className="relative z-10 flex w-full max-w-xl flex-col items-center gap-12 text-center select-none">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-6xl font-playfair font-bold tracking-tight"
        >
          <span className="gold-text">CoAI</span>
        </motion.h1>

        <motion.button
          type="button"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className="rounded-full border border-luxury-gold px-12 py-4 text-lg font-semibold text-luxury-dark bg-luxury-gold transition-colors hover:bg-luxury-gold-light"
          onClick={handleGetCoached}
        >
          {copy.home.getCoached}
        </motion.button>

        <div className="relative flex w-full flex-col items-center gap-6">
          <span className="text-xs uppercase tracking-[0.35em] text-luxury-text-light">
            {copy.home.explorePrefix}
          </span>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTopic?.id ?? currentIndex}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
            >
              {currentTopic ? (
                <Link
                  href={`/topics/${currentTopic.id}`}
                  className="inline-block text-3xl font-playfair font-semibold text-luxury-text hover:text-luxury-gold transition-colors"
                  style={{ touchAction: 'none' }}
                  data-topic-id={currentTopic.id}
                  onPointerDown={handleTopicPointerDown}
                  onPointerMove={handleTopicPointerMove}
                  onPointerUp={concludeManualInteraction}
                  onPointerCancel={concludeManualInteraction}
                  onClick={handleTopicClick}
                  onMouseEnter={() => setListActivated(true)}
                  onFocus={() => setListActivated(true)}
                >
                  {currentTopic.title}
                </Link>
              ) : null}
            </motion.div>
          </AnimatePresence>

          <div className="mt-12 w-full max-w-2xl space-y-4" onMouseEnter={() => setListActivated(true)}>
            <motion.p
              className="text-center text-sm uppercase tracking-[0.3em] text-luxury-text-muted"
              initial={{ opacity: 1, y: 0 }}
              animate={{ opacity: listActivated ? 0 : 1, y: listActivated ? -10 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {copy.home.hoverHint}
            </motion.p>
            {heroTopics.map((topic, index) => (
              <motion.div
                key={topic.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: listActivated ? 1 : 0,
                  y: listActivated ? 0 : 20,
                }}
                transition={{ duration: 0.45, delay: listActivated ? index * 0.08 : 0 }}
              >
                <Link
                  href={`/topics/${topic.id}`}
                  className="group block rounded-2xl border border-white/55 bg-white/90 px-6 py-5 text-left shadow-[0_12px_32px_rgba(15,23,42,0.12)] transition-all duration-200 hover:border-luxury-gold/60 hover:bg-luxury-gold/18 hover:shadow-[0_18px_40px_rgba(212,175,55,0.25)]"
                  tabIndex={listActivated ? 0 : -1}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-base font-playfair font-semibold text-luxury-text">
                      {topic.title}
                    </span>
                    <span className="text-sm text-luxury-gold/80 transition-transform duration-200 group-hover:translate-x-1">
                      →
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-luxury-text-muted">
                    {topic.intro}
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
