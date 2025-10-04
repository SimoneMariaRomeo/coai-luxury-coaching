'use client'

import { useEffect, useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react'
import { buildOAuthRedirect } from '@/lib/auth-helpers'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const supabase = useSupabaseClient()
  const session = useSession()
  const router = useRouter()

  const [redirectTarget, setRedirectTarget] = useState('/')
  const [callbackError, setCallbackError] = useState<string | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const params = new URLSearchParams(window.location.search)
    setRedirectTarget(params.get('redirect') ?? '/')
    setCallbackError(params.get('error'))
  }, [])

  useEffect(() => {
    if (session) {
      router.replace(redirectTarget || '/')
    }
  }, [session, router, redirectTarget])

  useEffect(() => {
    if (callbackError) {
      setFormError(callbackError)
    }
  }, [callbackError])

  const handlePasswordSignIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)
    setFormError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })

    if (error) {
      setFormError(error.message)
      setLoading(false)
      return
    }

    toast.success('Welcome back!')
    router.replace(redirectTarget || '/')
  }

  const handleOAuthSignIn = async (provider: 'google' | 'github') => {
    setLoading(true)
    setFormError(null)

    const redirectTo = buildOAuthRedirect(redirectTarget)

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo,
      },
    })

    if (error) {
      setFormError(error.message)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-luxury-dark text-luxury-text flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-8 shadow-xl">
        <h1 className="text-3xl font-playfair font-semibold mb-2">Sign in to CoAI</h1>
        <p className="text-sm text-luxury-text-light mb-6">
          Continue your personalized coaching journey.
        </p>
        {formError && (
          <div className="mb-4 rounded-lg border border-luxury-error/40 bg-luxury-error/10 px-3 py-2 text-sm text-luxury-error">
            {formError}
          </div>
        )}
        <form onSubmit={handlePasswordSignIn} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-luxury-text-light">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-1 w-full rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-sm text-luxury-text placeholder:text-luxury-text-muted focus:border-luxury-gold focus:outline-none focus:ring-2 focus:ring-luxury-gold/40"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-luxury-text-light">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-1 w-full rounded-lg border border-white/10 bg-white/10 px-3 py-2 text-sm text-luxury-text placeholder:text-luxury-text-muted focus:border-luxury-gold focus:outline-none focus:ring-2 focus:ring-luxury-gold/40"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-luxury-gold px-4 py-2 text-sm font-semibold text-luxury-dark transition hover:bg-luxury-gold/90 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        <div className="mt-6">
          <p className="text-xs uppercase tracking-wider text-white/60 mb-3 text-center">Or continue with</p>
          <div className="grid grid-cols-1 gap-3">
            <button
              type="button"
              onClick={() => handleOAuthSignIn('google')}
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <span className="font-semibold">G</span>
              <span>Google</span>
            </button>
            <button
              type="button"
              onClick={() => handleOAuthSignIn('github')}
              disabled={loading}
              className="flex items-center justify-center gap-2 rounded-lg border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <span className="font-semibold">GH</span>
              <span>GitHub</span>
            </button>
          </div>
        </div>
        <p className="mt-6 text-sm text-center text-white/70">
          New here?{' '}
          <Link
            href={
              redirectTarget && redirectTarget !== '/'
                ? `/signup?redirect=${encodeURIComponent(redirectTarget)}`
                : '/signup'
            }
            className="text-luxury-gold hover:text-luxury-gold/80"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  )
}
