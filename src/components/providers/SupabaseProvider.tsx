'use client'

import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Session } from '@supabase/supabase-js'
import { useState, type ReactNode } from 'react'

interface SupabaseProviderProps {
  children: ReactNode
  initialSession?: Session | null
}

export function SupabaseProvider({ children, initialSession }: SupabaseProviderProps) {
  const hasSupabaseEnv = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  const [supabaseClient] = useState(() => {
    if (!hasSupabaseEnv) {
      return null
    }

    try {
      return createClientComponentClient()
    } catch (error) {
      console.warn('Supabase client initialization skipped:', error)
      return null
    }
  })

  if (!supabaseClient) {
    return <>{children}</>
  }

  return (
    <SessionContextProvider supabaseClient={supabaseClient} initialSession={initialSession}>
      {children}
    </SessionContextProvider>
  )
}

export default SupabaseProvider
