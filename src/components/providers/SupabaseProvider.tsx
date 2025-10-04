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
  const [supabaseClient] = useState(() => createClientComponentClient())

  return (
    <SessionContextProvider supabaseClient={supabaseClient} initialSession={initialSession}>
      {children}
    </SessionContextProvider>
  )
}

export default SupabaseProvider
