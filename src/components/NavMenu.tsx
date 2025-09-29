'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import config from '@/lib/config.json'
import { useProgressStore } from '@/lib/store'

const topics = Object.entries(config.topics).map(([id, topic]) => ({
  id,
  title: topic.title,
}))

const formatDate = (isoDate?: string) => {
  if (!isoDate) {
    return ''
  }

  try {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
    }).format(new Date(isoDate))
  } catch (error) {
    return ''
  }
}

export function NavMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)
  const recentSessions = useProgressStore((state) => state.recentSessions)

  useEffect(() => {
    const handleClickAway = (event: MouseEvent) => {
      if (!menuRef.current) {
        return
      }

      if (!menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickAway)
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickAway)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-6 right-6 z-[60]"
      ref={menuRef}
    >
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen((open) => !open)}
        className="bg-white/80 backdrop-blur-sm text-luxury-text px-4 py-2 rounded-lg font-semibold luxury-shadow"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        Menu
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-12 right-0 w-[320px] max-w-[90vw] bg-white/95 backdrop-blur-lg rounded-xl luxury-shadow overflow-hidden"
          >
            <div className="px-5 py-4 border-b border-luxury-light-gray/30">
              <p className="text-xs uppercase tracking-wide text-luxury-text-muted mb-3">Learning Journeys</p>
              <div className="space-y-2">
                {topics.map((topic) => (
                  <Link key={topic.id} href={`/topics/${topic.id}`}>
                    <div className="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-luxury-text hover:bg-luxury-accent/10 transition-colors">
                      <span>{topic.title}</span>
                      <span className="text-luxury-gold text-xs">Explore</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="px-5 py-4">
              <p className="text-xs uppercase tracking-wide text-luxury-text-muted mb-3">My Latest Sessions</p>
              {recentSessions.length === 0 ? (
                <p className="text-sm text-luxury-text-muted">Start a session to see it appear here.</p>
              ) : (
                <div className="space-y-2">
                  {recentSessions.map((session) => (
                    <Link
                      key={`${session.topicId}-${session.sessionId}`}
                      href={`/topics/${session.topicId}/sessions/${session.sessionId}`}
                    >
                      <div className="rounded-lg px-3 py-2 text-sm text-luxury-text hover:bg-luxury-accent/10 transition-colors">
                        <p className="font-medium leading-tight">{session.sessionTitle}</p>
                        <p className="text-xs text-luxury-text-muted mt-1 flex items-center justify-between">
                          <span>{session.topicTitle}</span>
                          <span>{formatDate(session.startedAt)}</span>
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

export default NavMenu
