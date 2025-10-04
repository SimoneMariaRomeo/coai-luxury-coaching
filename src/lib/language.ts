import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Language } from './language-constants'
import {
  LANGUAGE_LABELS,
  LANGUAGE_PROMPT_LABELS,
  LANGUAGE_HTML_TAG,
  LANGUAGE_LOCALES,
} from './language-constants'

interface LanguageState {
  language: Language
  setLanguage: (language: Language) => void
}

export { LANGUAGE_LABELS, LANGUAGE_PROMPT_LABELS, LANGUAGE_HTML_TAG, LANGUAGE_LOCALES }
export type { Language }

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      language: 'en',
      setLanguage: (language) => set({ language }),
    }),
    {
      name: 'coai-language',
      version: 1,
    }
  )
)
