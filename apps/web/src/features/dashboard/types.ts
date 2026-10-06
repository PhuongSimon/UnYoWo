import type { Localized } from "@/features/learn/types";
import type { GameType, SessionSource } from "@/features/practice/types";
import type { ProgressSummary } from "@/features/progress/types";

export interface LanguageStats {
  code: string;
  nativeName: string;
  total: number;
  seen: number;
  mastered: number;
  due: number;
  weak: number;
}

export type SuggestionKind =
  "REVIEW_DUE" | "FIX_MISTAKES" | "CONTINUE_SET" | "START_SET";

export interface Suggestion {
  kind: SuggestionKind;
  languageCode: string;
  setId: string | null;
  setTitle: Localized | null;
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
  completedAt: string;
}

export interface Dashboard extends ProgressSummary {
  languages: LanguageStats[];
  suggestions: Suggestion[];
  weakAreas: {
    setId: string;
    languageCode: string;
    setTitle: Localized;
    weak: number;
  }[];
  recentSessions: RecentSession[];
}
