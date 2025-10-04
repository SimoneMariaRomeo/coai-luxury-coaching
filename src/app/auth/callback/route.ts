import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next') ?? '/'
  const errorDescription = requestUrl.searchParams.get('error_description')

  const supabase = createRouteHandlerClient({ cookies })

  if (code) {
    try {
      await supabase.auth.exchangeCodeForSession(code)
    } catch (error) {
      console.error('Supabase auth callback error:', error)
      const redirectPath = new URL('/login', requestUrl.origin)
      redirectPath.searchParams.set('error', 'callback_failed')
      return NextResponse.redirect(redirectPath)
    }
  }

  if (errorDescription) {
    const redirectPath = new URL('/login', requestUrl.origin)
    redirectPath.searchParams.set('error', errorDescription)
    return NextResponse.redirect(redirectPath)
  }

  return NextResponse.redirect(`${requestUrl.origin}${next}`)
}
