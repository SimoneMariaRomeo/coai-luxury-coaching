import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ProgressState {
  progress: Record<string, Record<string, boolean>>
  updateProgress: (topicId: string, sessionId: string, completed: boolean) => void
  getProgress: (topicId: string, sessionId: string) => boolean
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      progress: {},
      updateProgress: (topicId: string, sessionId: string, completed: boolean) => {
        set((state) => ({
          progress: {
            ...state.progress,
            [topicId]: {
              ...state.progress[topicId],
              [sessionId]: completed
            }
          }
        }))
      },
      getProgress: (topicId: string, sessionId: string) => {
        return get().progress[topicId]?.[sessionId] || false
      }
    }),
    {
      name: 'coai-progress',
    }
  )
)

