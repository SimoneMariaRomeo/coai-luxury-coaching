import config from './config.json'
import type { Language } from './language-constants'

type TopicId = keyof typeof config.topics

type SessionId = string

interface SessionTranslation {
  title?: string
}

interface TopicTranslation {
  title?: string
  intro?: string
  objectives?: string[]
  sessions?: Record<SessionId, SessionTranslation>
}

const zhTopicTranslations: Record<TopicId, TopicTranslation> = {
  leadership: {
    title: '?????',
    intro: '???????,??????????????????????',
    objectives: [
      '????????????',
      '???????????????',
      '?????????????????',
    ],
    sessions: {
      'reflect-ideal-leader': { title: '???????????' },
      'explain-situational-leadership': { title: '???????' },
      'spot-stakeholders': { title: '?????????' },
      'explore-leadership-styles': { title: '??????' },
      'reflect-strengths-weaknesses': { title: '??????????' },
      'establish-partnership': { title: '???????????' },
      'define-action-plan': { title: '????????' },
    },
  },
  feedback: {
    title: '?????',
    intro: '????????,????????????',
    objectives: [
      '???????????',
      '???????????',
      '?? SBI ????????',
    ],
    sessions: {
      'reflect-feedback-blocks': { title: '?????????' },
      'rules-radical-candor': { title: '???????' },
      'recall-failed-feedback': { title: '?????????' },
      'facts-vs-judgments': { title: '????????' },
      'practice-facts-judgments': { title: '?????????' },
      'learn-sbi-model': { title: '?? SBI ????' },
      'practice-feedback-delivery': { title: '??????' },
      'gear-shifting': { title: '????????' },
      'define-feedback-action-plan': { title: '????????' },
    },
  },
}

const topicTranslations: Record<Language, Record<TopicId, TopicTranslation>> = {
  en: {},
  zh: zhTopicTranslations,
}

interface UiCopy {
  common: {
    home: string
    loading: string
    loadingSession: string
    signInToStart: string
    signInToStartSpecific: string
    signInSyncNote: string
    signInSyncHistory: string
    goToSignIn: string
    send: string
    typeResponse: string
    signInToRespond: string
  }
  nav: {
    menu: string
    account: string
    signingOut: string
    signOut: string
    signIn: string
    createAccount: string
    learningJourneys: string
    explore: string
    latestSessions: string
    emptySessions: string
    signOutSuccess: string
    signOutError: string
  }
  home: {
    subtitle: string
    getCoached: string
    explorePrefix: string
    signInToast: string
  }
  generic: {
    title: string
    subtitle: string
  }
  topic: {
    learningObjectives: string
    startJourney: string
    signInHint: string
    journeyTitle: string
    review: string
    continue: string
    start: string
    locked: string
  }
  session: {
    progress: (current: number, total: number) => string
  }
  sessionTypes: Record<string, string>
  chat: {
    offlineLoaded: string
    loaded: string
    loadFailed: string
    loadFailedShort: string
    signInRequired: string
    sendFailed: string
    sendFailedShort: string
    offlineFallbackToast: string
  }
  language: {
    label: string
    english: string
    chinese: string
  }
  fallback: {
    offlineNote: string
    startIntro: string
    focusPrefix: string
    followThanks: string
    followFocusPrefix: string
    followCapture: string
  }
  homeTopics: Record<TopicId, { description: string }>
}

export const UI_COPY: Record<Language, UiCopy> = {
  en: {
    common: {
      home: 'Home',
      loading: 'Loading...',
      loadingSession: 'Loading session...',
      signInToStart: 'Sign in to start a coaching session.',
      signInToStartSpecific: 'Sign in to start this coaching session.',
      signInSyncNote: 'Sign in so we can keep your reflections and follow-ups synced.',
      signInSyncHistory: 'Your progress and conversation history stay synced once you are logged in.',
      goToSignIn: 'Go to sign in',
      send: 'Send',
      typeResponse: 'Type your response...',
      signInToRespond: 'Sign in to respond...',
    },
    nav: {
      menu: 'Menu',
      account: 'Account',
      signingOut: 'Signing out...',
      signOut: 'Sign out',
      signIn: 'Sign in',
      createAccount: 'Create account',
      learningJourneys: 'Learning Journeys',
      explore: 'Explore',
      latestSessions: 'My Latest Sessions',
      emptySessions: 'Start a session to see it appear here.',
      signOutSuccess: 'Signed out successfully.',
      signOutError: 'Unable to sign out.',
    },
    home: {
      subtitle: 'Transform your leadership with personalized AI coaching and learning sessions',
      getCoached: 'Get Coached',
      explorePrefix: 'Or explore',
      signInToast: 'Sign in to start a coaching session.',
    },
    generic: {
      title: 'Generic Coaching Session',
      subtitle: 'Personalized AI coaching session',
    },
    topic: {
      learningObjectives: 'Learning Objectives',
      startJourney: 'Start Your Journey',
      signInHint: 'Sign in to begin personalized coaching sessions.',
      journeyTitle: 'Your Learning Journey',
      review: 'Review Session',
      continue: 'Continue Session',
      start: 'Start Session',
      locked: 'Locked',
    },
    session: {
      progress: (current: number, total: number) => `Session ${current} of ${total}`,
    },
    sessionTypes: {
      Coaching: 'Coaching Session',
      Socratic: 'Socratic Session',
    },
    chat: {
      offlineLoaded: 'Session loaded in offline mode',
      loaded: 'Session loaded successfully',
      loadFailed: 'Failed to load session. Please try again.',
      loadFailedShort: 'Failed to load session',
      signInRequired: 'Please sign in to start a session.',
      sendFailed: 'Failed to send message. Please try again.',
      sendFailedShort: 'Failed to send message',
      offlineFallbackToast: 'Connection dropped. Sharing offline reflection cues so you can keep going.',
    },
    language: {
      label: 'Language',
      english: 'English',
      chinese: 'Chinese',
    },
    fallback: {
      offlineNote: 'Offline mode: live coaching responses are temporarily unavailable.',
      startIntro: "Let's get started while we reconnect.",
      focusPrefix: 'Focus for now:',
      followThanks: 'Thanks for sharing that insight.',
      followFocusPrefix: 'Keep reflecting on:',
      followCapture: "Capture your thoughts locally and we'll sync once the connection returns.",
    },
    homeTopics: {
      leadership: {
        description: 'Master situational leadership to adapt your style to any team member\'s development stage.',
      },
      feedback: {
        description: 'Develop radical candor skills to give and receive feedback that drives growth.',
      },
    },
  },
  zh: {
    common: {
      home: '??',
      loading: '???...',
      loadingSession: '??????...',
      signInToStart: '????????????',
      signInToStartSpecific: '????????????',
      signInSyncNote: '?????????????????',
      signInSyncHistory: '????????????????',
      goToSignIn: '????',
      send: '??',
      typeResponse: '??????...',
      signInToRespond: '???????...',
    },
    nav: {
      menu: '??',
      account: '??',
      signingOut: '????...',
      signOut: '????',
      signIn: '??',
      createAccount: '????',
      learningJourneys: '????',
      explore: '??',
      latestSessions: '?????',
      emptySessions: '??????????????',
      signOutSuccess: '????????',
      signOutError: '???????',
    },
    home: {
      subtitle: '?????? AI ???????,??????????',
      getCoached: '??????',
      explorePrefix: '???????',
      signInToast: '????????????',
    },
    generic: {
      title: '??????',
      subtitle: '??? AI ????',
    },
    topic: {
      learningObjectives: '????',
      startJourney: '??????',
      signInHint: '??????????????',
      journeyTitle: '??????',
      review: '????',
      continue: '????',
      start: '????',
      locked: '???',
    },
    session: {
      progress: (current: number, total: number) => `?${current}? / ?${total}?`,
    },
    sessionTypes: {
      Coaching: '????',
      Socratic: '???????',
    },
    chat: {
      offlineLoaded: '??????????',
      loaded: '??????',
      loadFailed: '??????,????',
      loadFailedShort: '??????',
      signInRequired: '??????????',
      sendFailed: '??????,????',
      sendFailedShort: '??????',
      offlineFallbackToast: '????????????????,??????',
    },
    language: {
      label: '??',
      english: '??',
      chinese: '??',
    },
    fallback: {
      offlineNote: '????:???????????',
      startIntro: '????????,???????',
      focusPrefix: '??????:',
      followThanks: '?????????',
      followFocusPrefix: '????:',
      followCapture: '???????????,???????????',
    },
    homeTopics: {
      leadership: {
        description: '???????,??????????????????????',
      },
      feedback: {
        description: '????????,????????????',
      },
    },
  },
}

export function getLocalizedTopic(topicId: string, language: Language) {
  const baseTopic = config.topics[topicId as TopicId]
  if (!baseTopic) {
    return null
  }

  const translation = topicTranslations[language]?.[topicId as TopicId]

  return {
    ...baseTopic,
    title: translation?.title ?? baseTopic.title,
    intro: translation?.intro ?? baseTopic.intro,
    objectives: translation?.objectives ?? [...baseTopic.objectives],
    sessions: baseTopic.sessions.map((session) => {
      const sessionTranslation = translation?.sessions?.[session.id]
      return {
        ...session,
        title: sessionTranslation?.title ?? session.title,
      }
    }),
  }
}

export function getSessionTypeLabel(type: string, language: Language) {
  const labels = UI_COPY[language].sessionTypes
  return labels[type] ?? type
}

export function getSessionTitle(topicId: string, sessionId: string, language: Language) {
  const topic = getLocalizedTopic(topicId, language)
  const session = topic?.sessions.find((entry) => entry.id === sessionId)
  return session?.title ?? sessionId
}

export function getHomeTopicDescription(topicId: string, language: Language) {
  return UI_COPY[language].homeTopics[topicId as TopicId]?.description
}
