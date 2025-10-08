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
  'adaptability-resilience': {
    title: '\u9002\u5e94\u529b\u4e0e\u97e7\u6027',
    intro: '\u7075\u6d3b\u5e94\u5bf9\u53d8\u5316\uff0c\u6108\u632b\u6108\u52c7\u3002',
    objectives: [
      '\u4ee5\u7075\u6d3b\u601d\u7ef4\u62e5\u62b1\u53d8\u5316\uff0c\u5c06\u4e0d\u786e\u5b9a\u89c6\u4e3a\u673a\u9047\u800c\u975e\u5a01\u80c1',
      '\u901a\u8fc7\u57f9\u517b\u4e50\u89c2\u3001\u652f\u6301\u7f51\u7edc\u4e0e\u81ea\u4fe1\u5fc3\u6253\u9020\u4e2a\u4eba\u97e7\u6027\uff0c\u8de8\u8d8a\u632b\u6298',
      '\u501f\u52a9\u5065\u5eb7\u7684\u5e94\u5bf9\u7b56\u7565\u4e0e\u60c5\u7eea\u89c9\u5bdf\uff0c\u5728\u538b\u529b\u4e0b\u4fdd\u6301\u5e73\u8861',
    ],
  },
  'networking-personal-branding': {
    title: '\u4eba\u8109\u4e0e\u4e2a\u4eba\u54c1\u724c',
    intro: '\u4eba\u8109\u4e0e\u58f0\u8a89\u52a0\u901f\u4f60\u7684\u804c\u4e1a\u53d1\u5c55\u3002',
    objectives: [
      '\u8ba4\u77e5\u4ec5\u6709\u7ee9\u6548\u4e0d\u8db3\u4ee5\u6210\u529f\uff0c\u4e3b\u52a8\u7ba1\u7406\u5728\u7ec4\u7ec7\u4e2d\u7684\u5f62\u8c61\u4e0e\u66dd\u5149\u5ea6',
      '\u6253\u9020\u4ee5\u53ef\u4fe1\u5ea6\u3001\u4e92\u60e0\u4e0e\u7a33\u56fa\u4eba\u9645\u7f51\u7edc\u4e3a\u57fa\u7840\u7684\u4e2a\u4eba\u54c1\u724c',
      '\u4ee5\u771f\u8bda\u5173\u7cfb\u4e0e\u4ef7\u503c\u4ea4\u6362\u62d3\u5c55\u80fd\u89c1\u5ea6\u5e76\u63d0\u5347\u5f71\u54cd\u529b',
    ],
  },
  'interpersonal-communication-influence': {
    title: '\u4eba\u9645\u6c9f\u901a\u4e0e\u5f71\u54cd\u529b',
    intro: '\u4e0e\u4efb\u4f55\u4eba\u5efa\u7acb\u8fde\u7ed3\uff0c\u5e76\u4ee5\u5c0a\u91cd\u7684\u65b9\u5f0f\u5f71\u54cd\u7ed3\u679c\u3002',
    objectives: [
      '\u8fa8\u8bc6\u591a\u5143\u6c9f\u901a\u98ce\u683c\u4e0e\u4eba\u683c\u7c7b\u578b\uff0c\u66f4\u597d\u7406\u89e3\u540c\u4e8b\u4e0e\u5ba2\u6237',
      '\u8c03\u6574\u81ea\u8eab\u6c9f\u901a\u65b9\u5f0f\u4ee5\u4e0e\u4e0d\u540c\u793e\u4ea4\u98ce\u683c\u5efa\u7acb\u878d\u6d3d\u5173\u7cfb',
      '\u8fd0\u7528\u8bf4\u670d\u5f0f\u6c9f\u901a\u6280\u5de7\u5e76\u4ece\u5bb9\u5904\u7406\u5f02\u8bae\uff0c\u5b9e\u73b0\u53cc\u8d62\u89e3\u51b3\u65b9\u6848',
    ],
  },
  'emotional-intelligence-empathy': {
    title: '\u60c5\u7eea\u667a\u80fd\u4e0e\u540c\u7406\u5fc3',
    intro: '\u6d1e\u6089\u60c5\u7eea\u3001\u5f3a\u5316\u5173\u7cfb\u3001\u667a\u6167\u9886\u5bfc\u3002',
    objectives: [
      '\u63d0\u5347\u5bf9\u81ea\u8eab\u60c5\u7eea\u3001\u89e6\u53d1\u70b9\u4e0e\u4e60\u60ef\u7684\u89c9\u5bdf\uff0c\u66f4\u597d\u5bfc\u822a\u5185\u5728\u60c5\u611f',
      '\u7ec3\u4e60\u81ea\u6211\u8c03\u8282\u4e0e\u538b\u529b\u7ba1\u7406\u6280\u5de7\uff0c\u5728\u538b\u529b\u4e0b\u4f9d\u7136\u6c89\u7740\u79ef\u6781',
      '\u5f3a\u5316\u793e\u4f1a\u89c9\u5bdf\u4e0e\u540c\u7406\u56de\u5e94\uff0c\u6070\u5f53\u56de\u5e94\u4ed6\u4eba\u611f\u53d7\u5e76\u4fc3\u8fdb\u56e2\u961f\u5408\u4f5c',
    ],
  },
  'conflict-resolution-skills': {
    title: '\u51b2\u7a81\u89e3\u51b3\u6280\u5de7',
    intro: '\u5c06\u51b2\u7a81\u5316\u4e3a\u534f\u4f5c\u4e0e\u8fdb\u6b65\u3002',
    objectives: [
      '\u5c06\u51b2\u7a81\u91cd\u65b0\u6846\u5b9a\u4e3a\u5efa\u8bbe\u529b\u91cf\uff0c\u5e76\u7406\u89e3\u4e0d\u540c\u51b2\u7a81\u98ce\u683c\u6216\u8def\u5f84',
      '\u57f9\u517b\u7b56\u7565\u4ee5\u6d1e\u5bdf\u6f5c\u5728\u9700\u6c42\uff0c\u5728\u5206\u6b67\u4e2d\u6253\u9020\u53cc\u8d62\u65b9\u6848',
      '\u638c\u63e1\u964d\u6e29\u3001\u5e94\u5bf9\u68d8\u624b\u4e2a\u6027\u4e0e\u6709\u6548\u6c9f\u901a\u7684\u6280\u5de7',
    ],
  },
  'time-management-effectiveness': {
    title: '\u65f6\u95f4\u7ba1\u7406\u4e0e\u4e2a\u4eba\u6548\u80fd',
    intro: '\u628a\u7cbe\u529b\u805a\u7126\u5728\u6700\u91cd\u8981\u7684\u4e8b\u60c5\u4e0a\u3002',
    objectives: [
      '\u8bc6\u522b\u4e2a\u4eba\u751f\u4ea7\u529b\u98ce\u683c\uff0c\u8c03\u6574\u4e60\u60ef\u4ee5\u66f4\u9ad8\u6548\u66f4\u4e13\u6ce8',
      '\u638c\u63e1\u4f18\u5148\u7ea7\u4e0e\u65f6\u95f4\u7ba1\u7406\u6280\u5de7\uff0c\u7b56\u7565\u6027\u5904\u7406\u4efb\u52a1\u800c\u975e\u4e34\u65f6\u5e94\u5bf9',
      '\u5b9e\u8df5\u538b\u529b\u7ba1\u7406\u4e0e\u5de5\u4f5c\u751f\u6d3b\u5e73\u8861\u65b9\u6cd5\uff0c\u7ef4\u6301\u9ad8\u6548\u8868\u73b0\u907f\u514d\u5026\u6020',
    ],
  },
  'sales-negotiation-skills': {
    title: '\u9500\u552e\u4e0e\u8c08\u5224\u6280\u5de7',
    intro: '\u521b\u9020\u4ef7\u503c\uff0c\u5904\u7406\u5f02\u8bae\uff0c\u81ea\u4fe1\u6210\u4ea4\u3002',
    objectives: [
      '\u7406\u89e3\u7aef\u5230\u7aef\u9500\u552e\u6d41\u7a0b\u53ca\u5404\u9636\u6bb5\u5efa\u7acb\u5ba2\u6237\u4fe1\u4efb\u6240\u9700\u7684\u987e\u95ee\u5f0f\u6280\u80fd',
      '\u638c\u63e1\u6d1e\u5bdf\u5ba2\u6237\u771f\u5b9e\u9700\u6c42\u5e76\u4ee5\u5438\u5f15\u65b9\u6848\u56de\u5e94\u7684\u6280\u5de7',
      '\u53d1\u5c55\u8c08\u5224\u7b56\u7565\u4e0e\u6218\u672f\uff0c\u5728\u7ef4\u62a4\u5173\u7cfb\u7684\u540c\u65f6\u5b9e\u73b0\u4e92\u5229\u7ed3\u679c',
    ],
  },
  'customer-experience-loyalty': {
    title: '\u5ba2\u6237\u4f53\u9a8c\u4e0e\u5fe0\u8bda\u5ea6',
    intro: '\u6253\u52a8\u5ba2\u6237\uff0c\u8d62\u5f97\u6301\u4e45\u62e5\u62a4\u3002',
    objectives: [
      '\u5b66\u4e60\u901a\u8fc7\u989d\u5916\u4ef7\u503c\u8d85\u8d8a\u5ba2\u6237\u671f\u5f85\uff0c\u4e0e\u7ade\u4e89\u8005\u533a\u9694',
      '\u8de8\u6e20\u9053\u4e0e\u5ba2\u6237\u4fdd\u6301\u4e00\u81f4\u4e14\u9ad8\u8d28\u91cf\u7684\u6c9f\u901a\u4e92\u52a8',
      '\u8fd0\u7528\u4e2a\u6027\u5316\u4e0e\u540c\u7406\u5fc3\u6784\u5efa\u7262\u56fa\u5173\u7cfb\uff0c\u9a71\u52a8\u590d\u8d2d\u4e0e\u8f6c\u4ecb',
    ],
  },
  'personal-values-self-leadership': {
    title: '\u4e2a\u4eba\u4ef7\u503c\u89c2\u4e0e\u81ea\u6211\u9886\u5bfc\u529b',
    intro: '\u8ba9\u5de5\u4f5c\u4e0e\u4ef7\u503c\u89c2\u5bf9\u9f50\uff0c\u9a71\u52a8\u81ea\u6211\u6210\u957f\u3002',
    objectives: [
      '\u6f84\u6e05\u4e2a\u4eba\u4ef7\u503c\u89c2\u4e0e\u4f7f\u547d\uff0c\u5e76\u7406\u89e3\u5176\u4e0e\u89d2\u8272\u53ca\u516c\u53f8\u76ee\u6807\u7684\u8fde\u7ed3',
      '\u6fc0\u53d1\u5185\u5728\u52a8\u673a\u5e76\u627e\u5230\u5fc3\u6d41\uff0c\u5f3a\u5316\u81ea\u6211\u9a71\u52a8\u529b',
      '\u5b9e\u8df5\u53cd\u601d\u3001\u76ee\u6807\u8bbe\u5b9a\u4e0e\u771f\u8bda\u6c9f\u901a\u7b49\u81ea\u6211\u9886\u5bfc\u4e60\u60ef\uff0c\u4f7f\u884c\u4e3a\u4e0e\u4ef7\u503c\u89c2\u4e00\u81f4',
    ],
  },
  'inspiring-coaching-others': {
    title: '\u6fc0\u52b1\u4e0e\u6559\u7ec3\u4ed6\u4eba',
    intro: '\u4ee5\u793a\u8303\u4e0e\u6559\u7ec3\u653e\u5927\u4f60\u7684\u5f71\u54cd\u529b\u3002',
    objectives: [
      '\u4ee5\u8eab\u4f5c\u5219\u5c55\u73b0\u671f\u671b\u884c\u4e3a\uff0c\u8fd0\u7528\u793a\u8303\u529b\u91cf\u5f71\u54cd\u5e76\u6fc0\u52b1\u5468\u56f4\u4eba',
      '\u53d1\u5c55\u6559\u7ec3\u4e0e\u503e\u542c\u6280\u5de7\uff0c\u5728\u4e0d\u5fae\u89c2\u7ba1\u7406\u7684\u60c5\u51b5\u4e0b\u652f\u6301\u4ed6\u4eba\u6210\u957f',
      '\u5b66\u4f1a\u63d0\u51fa\u6709\u529b\u95ee\u9898\uff0c\u5f15\u5bfc\u4ed6\u4eba\u627e\u5230\u81ea\u5df1\u7684\u65b9\u6848\u4e0e\u76ee\u6807',
    ],
  },
  'accountability-growth-mindset': {
    title: '\u8d23\u4efb\u611f\u4e0e\u6210\u957f\u578b\u601d\u7ef4',
    intro: '\u627f\u62c5\u7ed3\u679c\uff0c\u5feb\u901f\u5b66\u4e60\uff0c\u8ffd\u6c42\u66f4\u9ad8\u3002',
    objectives: [
      '\u57f9\u517b\u4e3b\u4eba\u7fc1\u7cbe\u795e\u4e0e\u524d\u77bb\u884c\u52a8\uff0c\u805a\u7126\u53ef\u63a7\u4e4b\u4e8b\u800c\u975e\u5f52\u548e\u73af\u5883',
      '\u62e5\u62b1\u7ec8\u8eab\u5b66\u4e60\u4e0e\u6210\u957f\u578b\u601d\u7ef4\uff0c\u5c06\u52aa\u529b\u4e0e\u53cd\u9988\u89c6\u4e3a\u7cbe\u8fdb\u4e4b\u9053',
      '\u901a\u8fc7\u5efa\u7acb\u4fe1\u4efb\u4e0e\u5171\u540c\u613f\u666f\u5f3a\u5316\u56e2\u961f\u5408\u4f5c\uff0c\u9f50\u5fc3\u5b9e\u73b0\u660e\u786e\u76ee\u6807',
    ],
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
      'adaptability-resilience': {
        description: 'Bend, adapt, and bounce back stronger when change hits.',
      },
      'networking-personal-branding': {
        description: 'Connections and reputation accelerate your career inside any organization.',
      },
      'interpersonal-communication-influence': {
        description: 'Connect with anyone and influence outcomes respectfully.',
      },
      'emotional-intelligence-empathy': {
        description: 'Understand emotions, strengthen relationships, and lead wisely.',
      },
      'conflict-resolution-skills': {
        description: 'Turn clashes into collaboration and progress.',
      },
      'time-management-effectiveness': {
        description: 'Focus your energy where it matters most.',
      },
      'sales-negotiation-skills': {
        description: 'Create value, handle objections, and close confidently.',
      },
      'customer-experience-loyalty': {
        description: 'Delight customers and earn lasting advocacy.',
      },
      'personal-values-self-leadership': {
        description: 'Align work with your values and drive your own growth.',
      },
      'inspiring-coaching-others': {
        description: 'Model excellence and coach others to multiply impact.',
      },
      'accountability-growth-mindset': {
        description: 'Own outcomes, learn fast, and aim higher.',
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
      'adaptability-resilience': {
        description: '\u7075\u6d3b\u5e94\u5bf9\u53d8\u5316\uff0c\u6108\u632b\u6108\u52c7\u3002',
      },
      'networking-personal-branding': {
        description: '\u4eba\u8109\u4e0e\u58f0\u8a89\u52a0\u901f\u4f60\u7684\u804c\u4e1a\u53d1\u5c55\u3002',
      },
      'interpersonal-communication-influence': {
        description: '\u4e0e\u4efb\u4f55\u4eba\u5efa\u7acb\u8fde\u7ed3\uff0c\u5e76\u4ee5\u5c0a\u91cd\u7684\u65b9\u5f0f\u5f71\u54cd\u7ed3\u679c\u3002',
      },
      'emotional-intelligence-empathy': {
        description: '\u6d1e\u6089\u60c5\u7eea\u3001\u5f3a\u5316\u5173\u7cfb\u3001\u667a\u6167\u9886\u5bfc\u3002',
      },
      'conflict-resolution-skills': {
        description: '\u5c06\u51b2\u7a81\u5316\u4e3a\u534f\u4f5c\u4e0e\u8fdb\u6b65\u3002',
      },
      'time-management-effectiveness': {
        description: '\u628a\u7cbe\u529b\u805a\u7126\u5728\u6700\u91cd\u8981\u7684\u4e8b\u60c5\u4e0a\u3002',
      },
      'sales-negotiation-skills': {
        description: '\u521b\u9020\u4ef7\u503c\uff0c\u5904\u7406\u5f02\u8bae\uff0c\u81ea\u4fe1\u6210\u4ea4\u3002',
      },
      'customer-experience-loyalty': {
        description: '\u6253\u52a8\u5ba2\u6237\uff0c\u8d62\u5f97\u6301\u4e45\u62e5\u62a4\u3002',
      },
      'personal-values-self-leadership': {
        description: '\u8ba9\u5de5\u4f5c\u4e0e\u4ef7\u503c\u89c2\u5bf9\u9f50\uff0c\u9a71\u52a8\u81ea\u6211\u6210\u957f\u3002',
      },
      'inspiring-coaching-others': {
        description: '\u4ee5\u793a\u8303\u4e0e\u6559\u7ec3\u653e\u5927\u4f60\u7684\u5f71\u54cd\u529b\u3002',
      },
      'accountability-growth-mindset': {
        description: '\u627f\u62c5\u7ed3\u679c\uff0c\u5feb\u901f\u5b66\u4e60\uff0c\u8ffd\u6c42\u66f4\u9ad8\u3002',
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


