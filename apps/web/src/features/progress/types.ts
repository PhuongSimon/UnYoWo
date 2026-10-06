import type { Localized } from '@/features/learn/types'

export interface DailyGoal {
  key: string
  target: number
  current: number
  xp: number
  completed: boolean
  /** For the "practise <language>" goal */
  languageCode: string | null
}

export interface ProgressSummary {
  totalXp: number
  streak: { current: number; longest: number; studiedToday: boolean }
  today: { xp: number; answers: number }
  dailyGoals: DailyGoal[]
}

export interface Achievement {
  key: string
  current: number
  target: number
  unlockedAt: string | null
}

export interface ItemSummary {
  id: string
  languageCode: string
  text: string
  reading: string | null
  romanization: string | null
  meaning: Localized | null
  emoji: string | null
}

export interface LanguageMistakes {
  languageCode: string
  dueCount: number
  weakCount: number
  weakItems: { item: ItemSummary; attemptCount: number; correctCount: number }[]
  confusions: { items: [ItemSummary, ItemSummary]; count: number }[]
}
