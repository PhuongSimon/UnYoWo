import type { ComponentRole, LearningItemType, LearningSetKind } from '../../../generated/prisma/enums.js';

/** Learning content text in each UI language; the web app picks one. */
export type Localized = { en: string; vi: string };

export interface LanguageSummary {
  code: string;
  nativeName: string;
  speechLang: string;
  setCount: number;
  itemCount: number;
}

export interface LearningSetSummary {
  id: string;
  languageCode: string;
  slug: string;
  kind: LearningSetKind;
  script: string | null;
  category: string | null;
  title: Localized;
  itemCount: number;
}

export interface SetProgress {
  /** Items the user has answered at least once */
  seen: number;
  mastered: number;
  /** Items whose next review time has passed */
  due: number;
}

export interface LearningSetWithProgress extends LearningSetSummary {
  progress: SetProgress;
}

export interface LearningItemView {
  id: string;
  type: LearningItemType;
  text: string;
  reading: string | null;
  romanization: string | null;
  ipa: string | null;
  meaning: Localized | null;
  emoji: string | null;
  attributes: Record<string, string> | null;
  audioUrl: string | null;
  components: { role: ComponentRole; text: string }[];
}

export interface Page<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
}
