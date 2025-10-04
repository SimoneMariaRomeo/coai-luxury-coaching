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
    title: '\u9886\u5bfc\u529b\u5353\u8d8a',
    intro: '\u638c\u63e1\u60c5\u5883\u5f0f\u9886\u5bfc\u529b\uff0c\u7075\u6d3b\u8c03\u6574\u98ce\u683c\u4ee5\u5339\u914d\u56e2\u961f\u6210\u5458\u7684\u53d1\u5c55\u9636\u6bb5\u3002',
    objectives: [
      '\u7406\u89e3\u56db\u4e2a\u53d1\u5c55\u9636\u6bb5\u53ca\u5176\u7279\u5f81',
      '\u5b66\u4f1a\u8bc4\u4f30\u56e2\u961f\u6210\u5458\u7684\u5f53\u524d\u53d1\u5c55\u6c34\u5e73',
      '\u4e3a\u6bcf\u4e2a\u9636\u6bb5\u5339\u914d\u6070\u5f53\u7684\u9886\u5bfc\u98ce\u683c',
    ],
    sessions: {
      'reflect-ideal-leader': { title: '\u56de\u987e\u7406\u60f3\u9886\u5bfc\u8005' },
      'explain-situational-leadership': { title: '\u9610\u91ca\u60c5\u5883\u5f0f\u9886\u5bfc\u529b' },
      'spot-stakeholders': { title: '\u8bc6\u522b\u5173\u952e\u5229\u76ca\u76f8\u5173\u8005' },
      'explore-leadership-styles': { title: '\u63a2\u7d22\u9886\u5bfc\u98ce\u683c' },
      'reflect-strengths-weaknesses': { title: '\u53cd\u601d\u4f18\u52bf\u4e0e\u5f85\u63d0\u5347\u70b9' },
      'establish-partnership': { title: '\u4e0e\u56e2\u961f\u5efa\u7acb\u5408\u4f5c\u4f19\u4f34\u5173\u7cfb' },
      'define-action-plan': { title: '\u5236\u5b9a\u884c\u52a8\u8ba1\u5212' },
    },
  },
  feedback: {
    title: '\u53cd\u9988\u638c\u63a7',
    intro: '\u57f9\u517b\u6781\u81f4\u5766\u8bda\u80fd\u529b\uff0c\u63d0\u4f9b\u5e76\u63a5\u6536\u80fd\u591f\u63a8\u52a8\u6210\u957f\u7684\u53cd\u9988\u3002',
    objectives: [
      '\u638c\u63e1\u6781\u81f4\u5766\u8bda\u7684\u6838\u5fc3\u539f\u5219',
      '\u533a\u5206\u53cd\u9988\u4e2d\u7684\u4e8b\u5b9e\u4e0e\u5224\u65ad',
      '\u8fd0\u7528 SBI \u6a21\u578b\u63d0\u5347\u53cd\u9988\u6548\u679c',
    ],
    sessions: {
      'reflect-feedback-blocks': { title: '\u53cd\u601d\u53cd\u9988\u969c\u788d' },
      'rules-radical-candor': { title: '\u6781\u81f4\u5766\u8bda\u6cd5\u5219' },
      'recall-failed-feedback': { title: '\u56de\u987e\u4e00\u6b21\u5931\u8d25\u7684\u53cd\u9988' },
      'facts-vs-judgments': { title: '\u4e8b\u5b9e\u4e0e\u5224\u65ad' },
      'practice-facts-judgments': { title: '\u7ec3\u4e60\u533a\u5206\u4e8b\u5b9e\u4e0e\u5224\u65ad' },
      'learn-sbi-model': { title: '\u5b66\u4e60 SBI \u6a21\u578b' },
      'practice-feedback-delivery': { title: '\u7ec3\u4e60\u53cd\u9988\u8868\u8fbe' },
      'gear-shifting': { title: '\u5207\u6362\u6c9f\u901a\u6863\u4f4d\u6280\u5de7' },
      'define-feedback-action-plan': { title: '\u5236\u5b9a\u53cd\u9988\u884c\u52a8\u8ba1\u5212' },
    },
  },
}

const topicTranslations: Record<Language, Partial<Record<TopicId, TopicTranslation>>> = {
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
    markAsDone: string
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
      markAsDone: 'Mark as done',
    },
    sessionTypes: {
      Coaching: 'Coaching Session',
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
        description: "Master situational leadership to adapt your style to any team member's development stage.",
      },
      feedback: {
        description: 'Develop radical candor skills to give and receive feedback that drives growth.',
      },
    },
  },
  zh: {
    common: {
      home: '\u9996\u9875',
      loading: '\u52a0\u8f7d\u4e2d...',
      loadingSession: '\u6b63\u5728\u52a0\u8f7d\u4f1a\u8bdd...',
      signInToStart: '\u767b\u5f55\u540e\u5373\u53ef\u5f00\u59cb\u6559\u7ec3\u4f1a\u8bdd\u3002',
      signInToStartSpecific: '\u767b\u5f55\u5373\u53ef\u5f00\u59cb\u672c\u6b21\u6559\u7ec3\u4f1a\u8bdd\u3002',
      signInSyncNote: '\u767b\u5f55\u540e\u6211\u4eec\u4f1a\u540c\u6b65\u4f60\u7684\u53cd\u601d\u4e0e\u540e\u7eed\u884c\u52a8\u3002',
      signInSyncHistory: '\u767b\u5f55\u540e\u4f60\u7684\u8fdb\u5ea6\u4e0e\u5bf9\u8bdd\u8bb0\u5f55\u90fd\u4f1a\u4fdd\u6301\u540c\u6b65\u3002',
      goToSignIn: '\u524d\u5f80\u767b\u5f55',
      send: '\u53d1\u9001',
      typeResponse: '\u5728\u6b64\u8f93\u5165\u56de\u590d...',
      signInToRespond: '\u767b\u5f55\u540e\u5373\u53ef\u56de\u590d...',
    },
    nav: {
      menu: '\u83dc\u5355',
      account: '\u8d26\u6237',
      signingOut: '\u6b63\u5728\u9000\u51fa...',
      signOut: '\u9000\u51fa\u767b\u5f55',
      signIn: '\u767b\u5f55',
      createAccount: '\u521b\u5efa\u8d26\u6237',
      learningJourneys: '\u5b66\u4e60\u65c5\u7a0b',
      explore: '\u63a2\u7d22',
      latestSessions: '\u6211\u7684\u6700\u65b0\u4f1a\u8bdd',
      emptySessions: '\u5f00\u59cb\u4e00\u573a\u4f1a\u8bdd\u5373\u53ef\u5728\u6b64\u67e5\u770b\u3002',
      signOutSuccess: '\u5df2\u6210\u529f\u9000\u51fa\u3002',
      signOutError: '\u65e0\u6cd5\u9000\u51fa\u767b\u5f55\u3002',
    },
    home: {
      subtitle: '\u501f\u52a9\u4e2a\u6027\u5316 AI \u6559\u7ec3\uff0c\u7115\u65b0\u4f60\u7684\u9886\u5bfc\u529b',
      getCoached: '\u5f00\u59cb\u6559\u7ec3',
      explorePrefix: '\u6216\u63a2\u7d22',
      signInToast: '\u767b\u5f55\u540e\u5373\u53ef\u5f00\u59cb\u6559\u7ec3\u4f1a\u8bdd\u3002',
    },
    generic: {
      title: '\u901a\u7528\u6559\u7ec3\u4f1a\u8bdd',
      subtitle: '\u4e2a\u6027\u5316 AI \u6559\u7ec3\u4f1a\u8bdd',
    },
    topic: {
      learningObjectives: '\u5b66\u4e60\u76ee\u6807',
      startJourney: '\u5f00\u542f\u5b66\u4e60\u65c5\u7a0b',
      signInHint: '\u767b\u5f55\u540e\u5373\u53ef\u5f00\u59cb\u4e2a\u6027\u5316\u6559\u7ec3\u4f1a\u8bdd\u3002',
      journeyTitle: '\u4f60\u7684\u5b66\u4e60\u65c5\u7a0b',
      review: '\u56de\u987e\u4f1a\u8bdd',
      continue: '\u7ee7\u7eed\u4f1a\u8bdd',
      start: '\u5f00\u59cb\u4f1a\u8bdd',
      locked: '\u5df2\u9501\u5b9a',
    },
    session: {
      progress: (current: number, total: number) => `\u7b2c${current}\u8282 / \u5171${total}\u8282`,
      markAsDone: '\u6807\u8bb0\u4e3a\u5b8c\u6210',
    },
    sessionTypes: {
      Coaching: '\u6559\u7ec3\u4f1a\u8bdd',
    },
    chat: {
      offlineLoaded: '\u4f1a\u8bdd\u5df2\u5728\u79bb\u7ebf\u6a21\u5f0f\u52a0\u8f7d',
      loaded: '\u4f1a\u8bdd\u52a0\u8f7d\u6210\u529f',
      loadFailed: '\u4f1a\u8bdd\u52a0\u8f7d\u5931\u8d25\uff0c\u8bf7\u91cd\u8bd5\u3002',
      loadFailedShort: '\u52a0\u8f7d\u5931\u8d25',
      signInRequired: '\u8bf7\u767b\u5f55\u540e\u5f00\u59cb\u4f1a\u8bdd\u3002',
      sendFailed: '\u6d88\u606f\u53d1\u9001\u5931\u8d25\uff0c\u8bf7\u91cd\u8bd5\u3002',
      sendFailedShort: '\u53d1\u9001\u5931\u8d25',
      offlineFallbackToast: '\u8fde\u63a5\u4e2d\u65ad\uff0c\u6211\u4eec\u63d0\u4f9b\u79bb\u7ebf\u63d0\u793a\u52a9\u4f60\u7ee7\u7eed\u3002',
    },
    language: {
      label: '\u8bed\u8a00',
      english: '\u82f1\u8bed',
      chinese: '\u4e2d\u6587',
    },
    fallback: {
      offlineNote: '\u79bb\u7ebf\u6a21\u5f0f\uff1a\u6682\u65f6\u65e0\u6cd5\u63d0\u4f9b\u5b9e\u65f6\u6559\u7ec3\u56de\u590d\u3002',
      startIntro: '\u8fde\u63a5\u6062\u590d\u524d\uff0c\u5148\u4ece\u8fd9\u91cc\u5f00\u59cb\u3002',
      focusPrefix: '\u805a\u7126\u91cd\u70b9\uff1a',
      followThanks: '\u611f\u8c22\u4f60\u7684\u5206\u4eab\u3002',
      followFocusPrefix: '\u7ee7\u7eed\u601d\u8003\uff1a',
      followCapture: '\u5148\u8bb0\u5f55\u4e0b\u4f60\u7684\u60f3\u6cd5\uff0c\u8fde\u63a5\u6062\u590d\u540e\u6211\u4eec\u4f1a\u540c\u6b65\u3002',
    },
    homeTopics: {
      leadership: {
        description: '\u638c\u63e1\u60c5\u5883\u5f0f\u9886\u5bfc\u529b\uff0c\u968f\u6210\u5458\u53d1\u5c55\u9636\u6bb5\u8c03\u6574\u4f60\u7684\u9886\u5bfc\u65b9\u5f0f\u3002',
      },
      feedback: {
        description: '\u901a\u8fc7\u6781\u81f4\u5766\u8bda\u7ec3\u4e60\uff0c\u6253\u9020\u63a8\u52a8\u6210\u957f\u7684\u53cd\u9988\u6587\u5316\u3002',
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


