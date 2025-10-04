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
    title: '领导力卓越',
    intro: '掌握情境式领导，根据团队成员的发展阶段灵活调整你的领导方式。',
    objectives: [
      '了解四种发展阶段及其特征',
      '学会评估团队成员当前的发展水平',
      '根据不同发展阶段运用匹配的领导风格',
    ],
    sessions: {
      'reflect-ideal-leader': { title: '思考你心中的理想领导者' },
      'explain-situational-leadership': { title: '阐述情境式领导' },
      'spot-stakeholders': { title: '识别你的利益相关者' },
      'explore-leadership-styles': { title: '探索领导风格' },
      'reflect-strengths-weaknesses': { title: '反思优势与待提高之处' },
      'establish-partnership': { title: '与团队建立合作伙伴关系' },
      'define-action-plan': { title: '制定你的行动计划' },
    },
  },
  feedback: {
    title: '反馈力精通',
    intro: '培养激进坦诚能力，提供并接收促成长的反馈。',
    objectives: [
      '掌握激进坦诚的核心原则',
      '区分反馈中的事实与判断',
      '运用 SBI 模型高效传达反馈',
    ],
    sessions: {
      'reflect-feedback-blocks': { title: '反思阻碍反馈的因素' },
      'rules-radical-candor': { title: '激进坦诚的原则' },
      'recall-failed-feedback': { title: '回顾一次失败的反馈' },
      'facts-vs-judgments': { title: '事实与判断的区分' },
      'practice-facts-judgments': { title: '练习辨别事实与判断' },
      'learn-sbi-model': { title: '学习 SBI 反馈模型' },
      'practice-feedback-delivery': { title: '练习反馈传达' },
      'gear-shifting': { title: '反馈节奏调整技巧' },
      'define-feedback-action-plan': { title: '制定反馈行动计划' },
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
        description: "Master situational leadership to adapt your style to any team member's development stage.",
      },
      feedback: {
        description: 'Develop radical candor skills to give and receive feedback that drives growth.',
      },
    },
  },
  zh: {
    common: {
      home: '首页',
      loading: '加载中...',
      loadingSession: '正在加载会话...',
      signInToStart: '请登录后再开始教练会话。',
      signInToStartSpecific: '请登录后开始此教练会话。',
      signInSyncNote: '登录后即可同步你的反思与后续行动。',
      signInSyncHistory: '登录即可同步你的进度与对话记录。',
      goToSignIn: '前往登录',
      send: '发送',
      typeResponse: '输入你的回复...',
      signInToRespond: '登录后即可回复...',
    },
    nav: {
      menu: '菜单',
      account: '账户',
      signingOut: '正在退出...',
      signOut: '退出登录',
      signIn: '登录',
      createAccount: '创建账户',
      learningJourneys: '学习旅程',
      explore: '探索',
      latestSessions: '最近的学习',
      emptySessions: '开始一次学习后会显示在此处。',
      signOutSuccess: '已成功退出登录。',
      signOutError: '无法退出登录。',
    },
    home: {
      subtitle: '借助个性化的 AI 教练与学习课程，全面提升你的领导力。',
      getCoached: '开始教练对话',
      explorePrefix: '或浏览以下主题',
      signInToast: '请登录后再开始教练会话。',
    },
    generic: {
      title: '通用教练会话',
      subtitle: '个性化 AI 教练会话',
    },
    topic: {
      learningObjectives: '学习目标',
      startJourney: '开启学习旅程',
      signInHint: '请登录后开启个性化教练会话。',
      journeyTitle: '你的学习路径',
      review: '回顾会话',
      continue: '继续会话',
      start: '开始会话',
      locked: '未解锁',
    },
    session: {
      progress: (current: number, total: number) => `第${current}节 / 共${total}节`,
    },
    sessionTypes: {
      Coaching: '教练会话',
      Socratic: '苏格拉底式会话',
    },
    chat: {
      offlineLoaded: '会话已在离线模式加载',
      loaded: '会话加载成功',
      loadFailed: '会话加载失败，请重试。',
      loadFailedShort: '加载会话失败',
      signInRequired: '请登录后再开始会话。',
      sendFailed: '消息发送失败，请重试。',
      sendFailedShort: '发送消息失败',
      offlineFallbackToast: '连接中断。已为你提供离线反思提示，方便你继续。',
    },
    language: {
      label: '语言',
      english: '英语',
      chinese: '中文',
    },
    fallback: {
      offlineNote: '离线模式：实时教练回复暂不可用。',
      startIntro: '在等待重新连接时，我们先开始吧。',
      focusPrefix: '暂时的关注点：',
      followThanks: '感谢你分享的洞察。',
      followFocusPrefix: '继续思考：',
      followCapture: '请先在本地记录你的想法，连接恢复后我们会同步。',
    },
    homeTopics: {
      leadership: {
        description: '掌握情境式领导，根据团队成员的发展阶段灵活调整你的领导方式。',
      },
      feedback: {
        description: '培养激进坦诚能力，提供并接收促成长的反馈。',
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
