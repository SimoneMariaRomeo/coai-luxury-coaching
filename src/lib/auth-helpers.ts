export function buildOAuthRedirect(nextPath?: string | null) {
  if (typeof window === 'undefined') {
    return undefined
  }

  const target = new URL('/auth/callback', window.location.origin)
  if (nextPath && nextPath !== '/') {
    target.searchParams.set('next', nextPath)
  }
  return target.toString()
}
