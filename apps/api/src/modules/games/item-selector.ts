import { HttpStatus, Injectable } from '@nestjs/common';
import { ApiError } from '../../common/api-error.js';
import type { SessionSource } from '../../generated/prisma/enums.js';
import type { PracticeItem } from '../content/entities/content.entity.js';
import { ContentRepository } from '../content/repositories/content.repository.js';
import type { ItemProgress } from '../progress/entities/progress.entity.js';
import { ProgressRepository } from '../progress/repositories/progress.repository.js';

export interface SelectItemsInput {
  userId: string;
  languageCode: string;
  source: SessionSource;
  setId?: string;
  count: number;
  now: Date;
}

/** Practice order inside a set: overdue reviews first, then new items in lesson order, then the rest. */
export function rankForPractice(items: PracticeItem[], progress: Map<string, ItemProgress>, now: Date): PracticeItem[] {
  const dueTime = (item: PracticeItem) => progress.get(item.id)?.dueAt?.getTime() ?? 0;
  const due: PracticeItem[] = [];
  const fresh: PracticeItem[] = [];
  const later: PracticeItem[] = [];

  for (const item of items) {
    const itemProgress = progress.get(item.id);
    if (!itemProgress) fresh.push(item);
    else if (!itemProgress.dueAt || itemProgress.dueAt <= now) due.push(item);
    else later.push(item);
  }

  return [
    ...due.sort((a, b) => dueTime(a) - dueTime(b)),
    ...fresh.sort((a, b) => a.sortOrder - b.sortOrder),
    ...later.sort((a, b) => dueTime(a) - dueTime(b)),
  ];
}

/**
 * Learning Engine entry point for games: decides which items a session asks about
 * (`items`) and which items wrong options may come from (`pool`).
 */
@Injectable()
export class ItemSelector {
  constructor(
    private readonly content: ContentRepository,
    private readonly progress: ProgressRepository,
  ) {}

  async select(input: SelectItemsInput): Promise<{ items: PracticeItem[]; pool: PracticeItem[] }> {
    switch (input.source) {
      case 'SET':
        return this.fromSet(input);
      case 'DUE':
        return this.dueReviews(input);
      case 'MISTAKES':
        return this.mistakes(input);
    }
  }

  private async fromSet({ userId, languageCode, setId, count, now }: SelectItemsInput) {
    const set = setId ? await this.content.findSetById(setId) : null;
    if (!set || set.languageCode !== languageCode) throw new ApiError(HttpStatus.NOT_FOUND, 'SET_NOT_FOUND');

    const pool = await this.content.findPracticeItems({ setIds: [set.id] });
    const progress = await this.progress.findMany(userId, pool.map((item) => item.id));
    const ranked = rankForPractice(pool, new Map(progress.map((row) => [row.itemId, row])), now);
    return { items: ranked.slice(0, count), pool };
  }

  private async dueReviews({ userId, languageCode, count, now }: SelectItemsInput) {
    if (!(await this.content.languageExists(languageCode))) throw new ApiError(HttpStatus.NOT_FOUND, 'LANGUAGE_NOT_FOUND');

    const dueIds = await this.progress.findDueItemIds(userId, languageCode, now, count);
    if (dueIds.length === 0) throw new ApiError(HttpStatus.UNPROCESSABLE_ENTITY, 'NOTHING_TO_REVIEW');

    return this.withPool(dueIds);
  }

  /**
   * Items the user keeps getting wrong. The items they mixed each one up with join its
   * curated look-alikes, so the quiz offers exactly those as wrong options (confusion training).
   */
  private async mistakes({ userId, languageCode, count }: SelectItemsInput) {
    if (!(await this.content.languageExists(languageCode))) throw new ApiError(HttpStatus.NOT_FOUND, 'LANGUAGE_NOT_FOUND');

    const weakIds = (await this.progress.findWeakItems(userId, languageCode, count)).map((weak) => weak.item.id);
    if (weakIds.length === 0) throw new ApiError(HttpStatus.UNPROCESSABLE_ENTITY, 'NO_MISTAKES');

    const partners = await this.progress.findConfusionPartners(userId, weakIds);
    const { items, pool } = await this.withPool(weakIds, [...new Set([...partners.values()].flat())]);
    const withPartners = (item: PracticeItem): PracticeItem => ({
      ...item,
      confusableIds: [...new Set([...(partners.get(item.id) ?? []), ...item.confusableIds])],
    });
    return { items: items.map(withPartners), pool };
  }

  /** The items in the given order, plus their sets (and any extra items) as the pool for wrong options. */
  private async withPool(itemIds: string[], extraIds: string[] = []) {
    const items = await this.content.findPracticeItems({ ids: itemIds });
    const pool = await this.content.findPracticeItems({ setIds: [...new Set(items.map((item) => item.setId))] });
    const inPool = new Set(pool.map((item) => item.id));
    const missing = extraIds.filter((id) => !inPool.has(id));
    const extras = missing.length > 0 ? await this.content.findPracticeItems({ ids: missing }) : [];

    const byId = new Map(items.map((item) => [item.id, item]));
    return { items: itemIds.flatMap((id) => byId.get(id) ?? []), pool: [...pool, ...extras] };
  }
}
