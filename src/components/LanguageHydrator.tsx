'use client'

import { useEffect } from 'react'
import { useLanguageStore, LANGUAGE_HTML_TAG } from '@/lib/language'

export function LanguageHydrator() {
  const language = useLanguageStore((state) => state.language)

  useEffect(() => {
    if (typeof document === 'undefined') {
      return
    }

    const langTag = LANGUAGE_HTML_TAG[language] ?? 'en'
    document.documentElement.lang = langTag
  }, [language])

  return null
}

export default LanguageHydrator
