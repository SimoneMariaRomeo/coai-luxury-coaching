'use client'

import { useSession } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useChat } from '@/lib/useChat'
import { Toaster } from 'react-hot-toast'
import { useLanguageStore } from '@/lib/language'
import { UI_COPY } from '@/lib/translations'

export default function GenericCoachingPage() {
  const session = useSession()
  const router = useRouter()
  const isAuthenticated = Boolean(session?.user)
  const destinationPath = '/generic-coaching'
  const { messages, sendMessage, isLoading } = useChat('generic-coaching', 'general-coaching', { enabled: isAuthenticated })
  const language = useLanguageStore((state) => state.language)
  const copy = UI_COPY[language]

  const handleRequireAuth = () => {
    router.push(`/login?redirect=${encodeURIComponent(destinationPath)}`)
  }

  return (
    <div className="min-h-screen luxury-gradient relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-luxury-gold opacity-20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-luxury-gold opacity-20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-luxury-accent opacity-10 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 pt-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumbs */}
          <nav className="mb-6">
            <Link href="/" className="text-luxury-gold hover:text-luxury-gold-light transition-colors">
              {copy.common.home}
            </Link>
            <span className="mx-2 text-luxury-text-muted">�</span>
            <span className="text-luxury-text-light">{copy.generic.title}</span>
          </nav>

          {/* Session Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-playfair font-bold mb-4">
              <span className="gold-text">{copy.generic.title}</span>
            </h1>
            <p className="text-lg text-luxury-text-muted">
              {copy.generic.subtitle}
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
                <p className="text-base font-medium">{copy.common.signInToStart}</p>
                <p className="text-sm text-luxury-text-muted mt-2">
                  {copy.common.signInSyncNote}
                </p>
                <button
                  type="button"
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-luxury-gold px-4 py-2 text-sm font-semibold text-luxury-dark hover:bg-luxury-gold-light transition-colors"
                  onClick={handleRequireAuth}
                >
                  {copy.common.goToSignIn}
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
                placeholder={isAuthenticated ? copy.common.typeResponse : copy.common.signInToRespond}
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
                {copy.common.send}
              </button>
            </div>
          </div>
        </div>
      </div>

      <Toaster />
    </div>
  )
}

