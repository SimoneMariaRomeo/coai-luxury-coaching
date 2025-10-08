'use client'

import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import type { PointerEventHandler, MouseEventHandler, WheelEventHandler } from 'react'
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

  const handleWheel: WheelEventHandler<HTMLDivElement> = (event) => {
    if (heroTopics.length === 0) {
      return
    }
    event.preventDefault()
    if (!isPaused) {
      setIsPaused(true)
    }
    if (event.deltaY > 0) {
      cycleTopic(1)
    } else if (event.deltaY < 0) {
      cycleTopic(-1)
    }
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
      className="min-h-screen luxury-gradient text-luxury-text flex items-center justify-center px-6 relative overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onWheel={handleWheel}
    >
      <main className="flex w-full max-w-xl flex-col items-center gap-12 text-center select-none">
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
          className="rounded-full border border-luxury-gold px-10 py-3 text-lg font-semibold text-luxury-dark bg-luxury-gold transition-colors hover:bg-luxury-gold-light"
          onClick={handleGetCoached}
        >
          {copy.home.getCoached}
        </motion.button>

        <div className="flex flex-col items-center gap-6">
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
                  onPointerDown={handleTopicPointerDown}
                  onPointerMove={handleTopicPointerMove}
                  onPointerUp={concludeManualInteraction}
                  onPointerCancel={concludeManualInteraction}
                  onClick={handleTopicClick}
                >
                  {currentTopic.title}
                </Link>
              ) : null}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}
