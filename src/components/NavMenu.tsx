'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import toast from 'react-hot-toast'
import config from '@/lib/config.json'
import { useProgressStore } from '@/lib/store'
import { useLanguageStore, LANGUAGE_LOCALES } from '@/lib/language'
import { UI_COPY, getLocalizedTopic, getSessionTitle } from '@/lib/translations'
import type { Language } from '@/lib/language'


type TopicKey = keyof typeof config.topics

const topicKeys = Object.keys(config.topics) as TopicKey[]

export function NavMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const [signingOut, setSigningOut] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)
  const supabase = useSupabaseClient()
  const session = useSession()
  const recentSessions = useProgressStore((state) => state.recentSessions)
  const language = useLanguageStore((state) => state.language)
  const setLanguage = useLanguageStore((state) => state.setLanguage)
  const locale = LANGUAGE_LOCALES[language]
  const copy = UI_COPY[language]

  const localizedTopics = useMemo(() => {
    return topicKeys.map((topicId) => {
      const topic = getLocalizedTopic(topicId, language)
      return {
        id: topicId,
        title: topic?.title ?? config.topics[topicId].title,
      }
    })
  }, [language])

  const formatDate = (isoDate?: string) => {
    if (!isoDate) {
      return ''
    }

    try {
      return new Intl.DateTimeFormat(locale, {
        month: 'short',
        day: 'numeric',
      }).format(new Date(isoDate))
    } catch (error) {
      return ''
    }
  }

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

  const handleSignOut = async () => {
    setSigningOut(true)
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        throw error
      }
      toast.success(copy.nav.signOutSuccess)
    } catch (error) {
      const message = error instanceof Error ? error.message : copy.nav.signOutError
      toast.error(message)
    } finally {
      setSigningOut(false)
      setIsOpen(false)
    }
  }

  const closeMenu = () => setIsOpen(false)

  const languageOptions: Array<{ value: Language; label: string }> = [
    { value: 'en', label: copy.language.english },
    { value: 'zh', label: copy.language.chinese },
  ]

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
        {copy.nav.menu}
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
              <p className="text-xs uppercase tracking-wide text-luxury-text-muted mb-3">{copy.nav.account}</p>
              {session?.user ? (
                <div className="space-y-3">
                  <div className="rounded-lg bg-white px-3 py-2 text-sm font-medium text-luxury-text truncate">
                    {session.user.email}
                  </div>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    disabled={signingOut}
                    className="w-full rounded-lg border border-luxury-light-gray/40 bg-white/70 px-3 py-2 text-sm font-medium text-luxury-text transition hover:bg-luxury-accent/10 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {signingOut ? copy.nav.signingOut : copy.nav.signOut}
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link href="/login" onClick={closeMenu}>
                    <div className="rounded-lg px-3 py-2 text-sm font-medium text-luxury-text hover:bg-luxury-accent/10 transition-colors">
                      {copy.nav.signIn}
                    </div>
                  </Link>
                  <Link href="/signup" onClick={closeMenu}>
                    <div className="rounded-lg px-3 py-2 text-sm font-medium text-luxury-text hover:bg-luxury-accent/10 transition-colors">
                      {copy.nav.createAccount}
                    </div>
                  </Link>
                </div>
              )}
            </div>

            <div className="px-5 py-4 border-b border-luxury-light-gray/30">
              <p className="text-xs uppercase tracking-wide text-luxury-text-muted mb-3">{copy.language.label}</p>
              <div className="grid grid-cols-2 gap-2">
                {languageOptions.map((option) => {
                  const isActive = option.value === language
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setLanguage(option.value)}
                      className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${isActive ? 'bg-luxury-gold text-luxury-dark luxury-shadow' : 'bg-white/70 text-luxury-text hover:bg-luxury-accent/10'}`}
                      aria-pressed={isActive}
                    >
                      {option.label}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="px-5 py-4 border-b border-luxury-light-gray/30">
              <p className="text-xs uppercase tracking-wide text-luxury-text-muted mb-3">{copy.nav.learningJourneys}</p>
              <div className="space-y-2">
                {localizedTopics.map((topic) => (
                  <Link key={topic.id} href={`/topics/${topic.id}`} onClick={closeMenu}>
                    <div className="flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium text-luxury-text hover:bg-luxury-accent/10 transition-colors">
                      <span>{topic.title}</span>
                      <span className="text-luxury-gold text-xs">{copy.nav.explore}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="px-5 py-4">
              <p className="text-xs uppercase tracking-wide text-luxury-text-muted mb-3">{copy.nav.latestSessions}</p>
              {recentSessions.length === 0 ? (
                <p className="text-sm text-luxury-text-muted">{copy.nav.emptySessions}</p>
              ) : (
                <div className="space-y-2">
                  {recentSessions.map((sessionItem) => {
                    const topicTitle = getLocalizedTopic(sessionItem.topicId, language)?.title ?? sessionItem.topicTitle
                    const sessionTitle = getSessionTitle(sessionItem.topicId, sessionItem.sessionId, language)
                    return (
                      <Link
                        key={`${sessionItem.topicId}-${sessionItem.sessionId}`}
                        href={`/topics/${sessionItem.topicId}/sessions/${sessionItem.sessionId}`}
                        onClick={closeMenu}
                      >
                        <div className="rounded-lg px-3 py-2 text-sm text-luxury-text hover:bg-luxury-accent/10 transition-colors">
                          <p className="font-medium leading-tight">{sessionTitle}</p>
                          <p className="text-xs text-luxury-text-muted mt-1 flex items-center justify-between">
                            <span>{topicTitle}</span>
                            <span>{formatDate(sessionItem.startedAt)}</span>
                          </p>
                        </div>
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

export default NavMenu


