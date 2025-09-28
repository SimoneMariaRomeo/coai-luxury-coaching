'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

import config from '@/lib/config.json'
import { useProgressStore } from '@/lib/store'

type StartedSession = {
  topicId: string
  sessionId: string
  title: string
  topicTitle: string
}

const topics = Object.entries(config.topics).map(([id, topic]) => ({
  id,
  title: topic.title,
  sessions: topic.sessions
}))

export function NavigationMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const progress = useProgressStore((state) => state.progress)
  const hasStartedSession = useProgressStore((state) => state.hasStartedSession)
  const isSessionCompleted = useProgressStore((state) => state.isSessionCompleted)

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  const startedSessions = useMemo<StartedSession[]>(() => {
    return topics.flatMap((topic) => {
      return topic.sessions
        .filter((session: any) => hasStartedSession(topic.id, session.id))
        .map((session: any) => ({
          topicId: topic.id,
          sessionId: session.id,
          title: session.title,
          topicTitle: topic.title
        }))
    })
  }, [progress, hasStartedSession])

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-6 right-6 z-50"
    >
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen((open) => !open)}
        className="bg-white/80 backdrop-blur-sm text-luxury-text px-4 py-2 rounded-lg font-semibold luxury-shadow"
      >
        Menu
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="navigation-menu"
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute top-12 right-0 bg-white/95 backdrop-blur-sm rounded-xl p-5 luxury-shadow min-w-[240px]"
          >
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-luxury-text-muted/70">
                Learning journeys
              </p>
              <div className="space-y-2">
                {topics.map((topic) => {
                  const isActive = pathname.startsWith(`/topics/${topic.id}`)

                  return (
                    <Link key={topic.id} href={`/topics/${topic.id}`} onClick={() => setIsOpen(false)}>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        className={`py-2 px-3 rounded-md transition-colors cursor-pointer ${
                          isActive ? 'bg-luxury-gold/15 text-luxury-gold' : 'hover:bg-luxury-accent/10'
                        }`}
                      >
                        {topic.title}
                      </motion.div>
                    </Link>
                  )
                })}
              </div>
            </div>

            <div className="mt-5 border-t border-white/40 pt-4 space-y-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-luxury-text-muted/70">
                My sessions
              </p>
              {startedSessions.length === 0 ? (
                <p className="text-sm text-luxury-text-muted/80">No session</p>
              ) : (
                <div className="space-y-2">
                  {startedSessions.map((session) => {
                    const sessionPath = `/topics/${session.topicId}/sessions/${session.sessionId}`
                    const isActive = pathname === sessionPath
                    const completed = isSessionCompleted(session.topicId, session.sessionId)

                    return (
                      <Link key={`${session.topicId}-${session.sessionId}`} href={sessionPath} onClick={() => setIsOpen(false)}>
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          className={`py-2 px-3 rounded-md transition-colors cursor-pointer border border-transparent ${
                            isActive
                              ? 'bg-luxury-gold/15 text-luxury-gold border-luxury-gold/40'
                              : 'hover:bg-luxury-accent/10'
                          }`}
                        >
                          <p className="text-sm font-medium text-luxury-text">{session.title}</p>
                          <p className="text-xs text-luxury-text-muted/80">{session.topicTitle}</p>
                          {completed && <p className="text-[11px] text-luxury-gold mt-1">Completed</p>}
                        </motion.div>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

export default NavigationMenu
