import type { GameType, SessionSource } from '../../generated/prisma/enums.js';
import type { Localized } from '../content/entities/content.entity.js';
import type { ProgressSummaryView } from '../gamification/entities/gamification.entity.js';

/** A user's progress on one learning set, the building block of the dashboard. */
export interface SetStats {
  setId: string;
  languageCode: string;
  title: Localized;
  sortOrder: number;
  total: number;
  seen: number;
  mastered: number;
  due: number;
  /** Items answered wrong and not yet right twice in a row */
  weak: number;
  lastStudiedAt: Date | null;
}

export interface LanguageStats {
  code: string;
  nativeName: string;
  total: number;
  seen: number;
  mastered: number;
  due: number;
  weak: number;
}

export type SuggestionKind = 'REVIEW_DUE' | 'FIX_MISTAKES' | 'CONTINUE_SET' | 'START_SET';

/** One thing to do today, with the game that does it. */
export interface Suggestion {
  kind: SuggestionKind;
  languageCode: string;
  setId: string | null;
  setTitle: Localized | null;
  /** Items due, items to fix, or items seen so far */
  count: number;
  total: number;
  gameType: GameType;
  source: SessionSource;
}

export interface RecentSession {
  id: string;
  gameType: GameType;
  languageCode: string;
  source: SessionSource;
  setTitle: Localized | null;
  score: number;
  correctCount: number;
  answeredCount: number;
  completedAt: Date;
}

export interface DashboardView extends ProgressSummaryView {
  languages: LanguageStats[];
  suggestions: Suggestion[];
  /** Sets with the most items to fix */
  weakAreas: { setId: string; languageCode: string; setTitle: Localized; weak: number }[];
  recentSessions: RecentSession[];
}
