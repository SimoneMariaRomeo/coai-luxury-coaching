'use client'

import { useState, useEffect, useRef, useLayoutEffect, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useSession } from '@supabase/auth-helpers-react'
import toast from 'react-hot-toast'
import config from '@/lib/config.json'
import { useLanguageStore } from '@/lib/language'
import { UI_COPY, getLocalizedTopic, getHomeTopicDescription } from '@/lib/translations'

type TopicKey = keyof typeof config.topics

const HERO_TOPIC_IDS: TopicKey[] = ['leadership', 'feedback']

const DROPDOWN_HORIZONTAL_PADDING = 32

export default function HomePage() {
  const [currentExploreText, setCurrentExploreText] = useState(0)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const measurementContainerRef = useRef<HTMLDivElement | null>(null)
  const [dropdownWidth, setDropdownWidth] = useState<number | null>(null)
  const router = useRouter()
  const session = useSession()
  const isAuthenticated = Boolean(session?.user)
  const language = useLanguageStore((state) => state.language)
  const copy = UI_COPY[language]
  const dropdownCardWidth = dropdownWidth ? Math.min(Math.max(dropdownWidth, 320), 420) : 320

  const heroTopics = useMemo(() => {
    return HERO_TOPIC_IDS.map((topicId) => {
      const topic = getLocalizedTopic(topicId, language)
      return {
        id: topicId,
        title: topic?.title ?? config.topics[topicId].title,
        description:
          getHomeTopicDescription(topicId, language)
            ?? topic?.intro
            ?? config.topics[topicId].intro,
      }
    })
  }, [language])

  const exploreTexts = useMemo(() => heroTopics.map((topic) => topic.title), [heroTopics])

  useEffect(() => {
    setCurrentExploreText(0)
  }, [language])

  useEffect(() => {
    if (exploreTexts.length === 0) {
      return
    }

    const interval = setInterval(() => {
      setCurrentExploreText((prev) => (prev + 1) % exploreTexts.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [exploreTexts])

  const updateDropdownWidth = useCallback(() => {
    const measurementContainer = measurementContainerRef.current

    if (!measurementContainer) {
      return
    }

    const spans = Array.from(
      measurementContainer.querySelectorAll<HTMLSpanElement>('span')
    )

    const widestLabel = spans.reduce((maxWidth, span) => {
      const spanWidth = span.getBoundingClientRect().width
      return spanWidth > maxWidth ? spanWidth : maxWidth
    }, 0)

    if (widestLabel > 0) {
      const paddedWidth = Math.ceil(widestLabel + DROPDOWN_HORIZONTAL_PADDING)
      setDropdownWidth((currentWidth) => (currentWidth === paddedWidth ? currentWidth : paddedWidth))
    }
  }, [])

  useLayoutEffect(() => {
    updateDropdownWidth()

    const handleResize = () => updateDropdownWidth()
    window.addEventListener('resize', handleResize)

    let resizeObserver: ResizeObserver | null = null

    if (typeof ResizeObserver !== 'undefined') {
      const measurementContainer = measurementContainerRef.current

      if (measurementContainer) {
        resizeObserver = new ResizeObserver(() => {
          updateDropdownWidth()
        })

        resizeObserver.observe(measurementContainer)

        Array.from(measurementContainer.querySelectorAll('span')).forEach((span) => {
          resizeObserver?.observe(span)
        })
      }
    }

    if (typeof document !== 'undefined') {
      const fontSet = (document as Document & { fonts?: FontFaceSet }).fonts

      fontSet
        ?.ready
        .then(() => {
          updateDropdownWidth()
        })
        .catch(() => {
          /* ignore font loading errors */
        })
    }

    return () => {
      window.removeEventListener('resize', handleResize)
      resizeObserver?.disconnect()
    }
  }, [updateDropdownWidth, exploreTexts])

  return (
    <div className="min-h-screen luxury-gradient relative overflow-hidden">
      <div
        ref={measurementContainerRef}
        className="fixed top-0 left-0 -z-10 opacity-0 pointer-events-none select-none"
        aria-hidden="true"
      >
        {exploreTexts.map((label) => (
          <span
            key={label}
            className="text-3xl md:text-4xl font-playfair font-semibold whitespace-nowrap"
          >
            {label}
          </span>
        ))}
      </div>

      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-luxury-gold opacity-20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-luxury-gold opacity-20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-luxury-accent opacity-10 rounded-full blur-3xl"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-20">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-4xl mx-auto mb-16"
        >
          <h1 className="text-6xl md:text-8xl font-playfair font-bold mb-6">
            <span className="gold-text">CoAI</span>
          </h1>
          <p className="text-xl md:text-2xl text-luxury-text-light mb-8 font-light">
            {copy.home.subtitle}
          </p>
          
          {/* CTA Button */}
          <div className="mb-12">
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-luxury-gold text-luxury-dark px-12 py-4 rounded-lg text-xl font-semibold luxury-shadow hover:shadow-2xl transition-all duration-300"
              onClick={() => {
                if (!isAuthenticated) {
                  toast.error(copy.home.signInToast)
                  router.push(`/login?redirect=${encodeURIComponent('/generic-coaching')}`)
                  return
                }

                router.push('/generic-coaching')
              }}
            >
              {copy.home.getCoached}
            </motion.button>
          </div>
          
          {/* Rotating Explore Section */}
          <div className="mb-12">
            <div
              className="relative flex w-full flex-col items-center cursor-pointer"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-3xl md:text-4xl font-playfair font-semibold"
              >
                <div className="flex flex-col items-center gap-4 text-center">
                  <span className="text-luxury-text">{copy.home.explorePrefix}</span>
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={exploreTexts[currentExploreText] ?? currentExploreText}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                      className="inline-block bg-gradient-to-r from-luxury-accent to-luxury-accent-light bg-clip-text text-transparent whitespace-nowrap"
                    >
                      {exploreTexts[currentExploreText]}
                    </motion.span>
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="absolute top-full left-0 right-0 mt-6 flex justify-center z-10"
                  >
                    <div
                      className="w-full max-w-[420px] bg-white/95 backdrop-blur-sm rounded-xl luxury-shadow text-center"
                      style={{
                        width: `${dropdownCardWidth}px`,
                        maxWidth: 'calc(100vw - 3rem)',
                      }}
                    >
                      {heroTopics.map((topic) => (
                        <Link key={topic.id} href={`/topics/${topic.id}`}>
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="p-4 border-b border-luxury-light-gray/20 last:border-b-0 hover:bg-luxury-accent/10 transition-colors cursor-pointer text-center"
                          >
                            <h3 className="font-playfair font-semibold text-luxury-text text-center">
                              {topic.title}
                            </h3>
                            <p className="text-sm text-luxury-text-light mt-1 text-center">
                              {topic.description}
                            </p>
                          </motion.div>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  )
}





