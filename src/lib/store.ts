import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface SessionProgress {
  started: boolean
  completed: boolean
  startedAt?: string
  completedAt?: string
}

export interface RecentSession {
  topicId: string
  sessionId: string
  sessionTitle: string
  topicTitle: string
  startedAt: string
}

interface SessionMetadata {
  sessionTitle: string
  topicTitle: string
}

interface ProgressState {
  progress: Record<string, Record<string, SessionProgress>>
  recentSessions: RecentSession[]
  markSessionStarted: (topicId: string, sessionId: string, metadata?: SessionMetadata) => void
  markSessionCompleted: (topicId: string, sessionId: string) => void
  getSessionProgress: (topicId: string, sessionId: string) => SessionProgress
}

const RECENT_SESSIONS_LIMIT = 5

const createDefaultProgress = (): SessionProgress => ({
  started: false,
  completed: false,
})

const normalizeSessionValue = (value: unknown): SessionProgress => {
  if (typeof value === 'boolean') {
    return {
      started: value,
      completed: value,
    }
  }

  if (value && typeof value === 'object') {
    const session = value as Partial<SessionProgress>
    return {
      started: Boolean(session.started ?? session.completed ?? false),
      completed: Boolean(session.completed ?? session.started ?? false),
      startedAt: session.startedAt,
      completedAt: session.completedAt,
    }
  }

  return createDefaultProgress()
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      progress: {},
      recentSessions: [],
      markSessionStarted: (topicId, sessionId, metadata) => {
        const now = new Date().toISOString()

        set((state) => {
          const topicProgress = state.progress[topicId] ?? {}
          const existing = topicProgress[sessionId] ?? createDefaultProgress()
          const startedAt = existing.startedAt ?? now

          const updatedSession: SessionProgress = {
            ...existing,
            started: true,
            startedAt,
          }

          const updatedTopic = {
            ...topicProgress,
            [sessionId]: updatedSession,
          }

          let updatedRecent = state.recentSessions.filter(
            (entry) => !(entry.topicId === topicId && entry.sessionId === sessionId)
          )

          if (metadata?.sessionTitle) {
            updatedRecent = [
              {
                topicId,
                sessionId,
                sessionTitle: metadata.sessionTitle,
                topicTitle: metadata.topicTitle,
                startedAt,
              },
              ...updatedRecent,
            ].slice(0, RECENT_SESSIONS_LIMIT)
          }

          return {
            progress: {
              ...state.progress,
              [topicId]: updatedTopic,
            },
            recentSessions: updatedRecent,
          }
        })
      },
      markSessionCompleted: (topicId, sessionId) => {
        const now = new Date().toISOString()

        set((state) => {
          const topicProgress = state.progress[topicId] ?? {}
          const existing = topicProgress[sessionId] ?? createDefaultProgress()

          const updatedSession: SessionProgress = {
            ...existing,
            completed: true,
            started: true,
            startedAt: existing.startedAt ?? now,
            completedAt: now,
          }

          return {
            progress: {
              ...state.progress,
              [topicId]: {
                ...topicProgress,
                [sessionId]: updatedSession,
              },
            },
            recentSessions: state.recentSessions,
          }
        })
      },
      getSessionProgress: (topicId, sessionId) => {
        const topicProgress = get().progress[topicId]
        if (!topicProgress || !topicProgress[sessionId]) {
          return createDefaultProgress()
        }
        return topicProgress[sessionId]
      },
    }),
    {
      name: 'coai-progress',
      version: 1,
      migrate: (persistedState: any, _version) => {
        if (!persistedState) {
          return {
            progress: {},
            recentSessions: [],
          }
        }

        const rawProgress = persistedState.progress ?? {}
        const normalizedProgress: Record<string, Record<string, SessionProgress>> = {}

        Object.entries(rawProgress).forEach(([topicId, sessions]) => {
          const topicSessions = sessions as Record<string, unknown>
          normalizedProgress[topicId] = {}

          Object.entries(topicSessions).forEach(([sessionId, value]) => {
            normalizedProgress[topicId][sessionId] = normalizeSessionValue(value)
          })
        })

        const rawRecent = Array.isArray(persistedState.recentSessions)
          ? persistedState.recentSessions
          : []

        const normalizedRecent: RecentSession[] = rawRecent
          .map((entry: any): Partial<RecentSession> => ({
            topicId: entry.topicId,
            sessionId: entry.sessionId,
            sessionTitle: entry.sessionTitle,
            topicTitle: entry.topicTitle,
            startedAt: entry.startedAt,
          }))
          .filter((entry: Partial<RecentSession>): entry is RecentSession =>
            Boolean(entry.topicId && entry.sessionId && entry.sessionTitle && entry.topicTitle && entry.startedAt)
          )

        return {
          progress: normalizedProgress,
          recentSessions: normalizedRecent.slice(0, RECENT_SESSIONS_LIMIT),
        }
      },
    }
  )
)
