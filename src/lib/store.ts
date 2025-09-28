import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type SessionProgress = {
  started: boolean
  completed: boolean
}

interface ProgressState {
  progress: Record<string, Record<string, SessionProgress>>
  markSessionStarted: (topicId: string, sessionId: string) => void
  markSessionCompleted: (topicId: string, sessionId: string, completed: boolean) => void
  hasStartedSession: (topicId: string, sessionId: string) => boolean
  isSessionCompleted: (topicId: string, sessionId: string) => boolean
}

const normalizeProgress = (value: SessionProgress | boolean | undefined): SessionProgress => {
  if (typeof value === 'boolean') {
    return { started: value, completed: value }
  }

  if (value && typeof value === 'object') {
    return {
      started: Boolean(value.started),
      completed: Boolean(value.completed)
    }
  }

  return { started: false, completed: false }
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      progress: {},
      markSessionStarted: (topicId, sessionId) => {
        set((state) => {
          const topicProgress = state.progress[topicId] ?? {}
          const currentSession = normalizeProgress(topicProgress[sessionId])

          return {
            progress: {
              ...state.progress,
              [topicId]: {
                ...topicProgress,
                [sessionId]: {
                  started: true,
                  completed: currentSession.completed
                }
              }
            }
          }
        })
      },
      markSessionCompleted: (topicId, sessionId, completed) => {
        set((state) => {
          const topicProgress = state.progress[topicId] ?? {}
          const currentSession = normalizeProgress(topicProgress[sessionId])

          return {
            progress: {
              ...state.progress,
              [topicId]: {
                ...topicProgress,
                [sessionId]: {
                  started: completed || currentSession.started,
                  completed
                }
              }
            }
          }
        })
      },
      hasStartedSession: (topicId, sessionId) => {
        const sessionProgress = normalizeProgress(get().progress[topicId]?.[sessionId])
        return sessionProgress.started
      },
      isSessionCompleted: (topicId, sessionId) => {
        const sessionProgress = normalizeProgress(get().progress[topicId]?.[sessionId])
        return sessionProgress.completed
      }
    }),
    {
      name: 'coai-progress',
    }
  )
)

