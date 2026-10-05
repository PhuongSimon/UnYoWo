import { Injectable } from '@nestjs/common';
import type { ItemSummary, WeakItem } from './entities/progress.entity.js';
import { ProgressRepository } from './repositories/progress.repository.js';

/** A pair has to be mixed up at least this often, within the window, to count as "often confused". */
export const CONFUSION_MIN_COUNT = 2;
const CONFUSION_WINDOW_DAYS = 60;
const WEAK_ITEMS_PER_LANGUAGE = 8;
const CONFUSIONS_PER_LANGUAGE = 6;

export interface LanguageMistakesView {
  languageCode: string;
  dueCount: number;
  weakCount: number;
  weakItems: WeakItem[];
  confusions: { items: [ItemSummary, ItemSummary]; count: number }[];
}

/** Everything to review, per language: items due, items often missed, and pairs often mixed up. */
@Injectable()
export class MistakesService {
  constructor(private readonly progress: ProgressRepository) {}

  async overview(userId: string, now: Date): Promise<LanguageMistakesView[]> {
    const dueCounts = await this.progress.countDueByLanguage(userId, now);
    const weakCounts = await this.progress.countWeakByLanguage(userId);
    const weakItems = await this.progress.findWeakItems(userId, null, 200);
    const since = new Date(now.getTime() - CONFUSION_WINDOW_DAYS * 24 * 60 * 60_000);
    const pairs = await this.progress.findConfusions(userId, since, CONFUSION_MIN_COUNT, 50);

    const summaries = new Map(
      (await this.progress.findItemSummaries([...new Set(pairs.flatMap((pair) => pair.itemIds))])).map((item) => [item.id, item]),
    );
    const languages = [...new Set([...dueCounts.keys(), ...weakCounts.keys()])].sort();

    return languages.map((languageCode) => ({
      languageCode,
      dueCount: dueCounts.get(languageCode) ?? 0,
      weakCount: weakCounts.get(languageCode) ?? 0,
      weakItems: weakItems.filter((weak) => weak.item.languageCode === languageCode).slice(0, WEAK_ITEMS_PER_LANGUAGE),
      confusions: pairs
        .filter((pair) => pair.languageCode === languageCode)
        .slice(0, CONFUSIONS_PER_LANGUAGE)
        .flatMap(({ itemIds: [first, second], count }) => {
          const a = summaries.get(first);
          const b = summaries.get(second);
          if (!a || !b) return [];
          const items: [ItemSummary, ItemSummary] = [a, b];
          return [{ items, count }];
        }),
    }));
  }
}
