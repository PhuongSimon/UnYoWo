import { Injectable } from '@nestjs/common';
import type { Prisma } from '../../../generated/prisma/client.js';
import { TransactionHost } from '../../../infrastructure/database/transaction-host.js';
import { MASTERED_LEVEL } from '../../progress/mastery.js';
import type { LanguageSummary, LearningItemView, LearningSetSummary, Localized, SetProgress } from '../entities/content.entity.js';
import { ContentRepository } from './content.repository.js';

const setSelect = {
  id: true,
  languageCode: true,
  slug: true,
  kind: true,
  script: true,
  category: true,
  title: true,
  _count: { select: { items: true } },
} satisfies Prisma.LearningSetSelect;

type SetRow = Prisma.LearningSetGetPayload<{ select: typeof setSelect }>;

function toLocalized(value: Prisma.JsonValue): Localized {
  if (value && typeof value === 'object' && !Array.isArray(value) && typeof value.en === 'string' && typeof value.vi === 'string') {
    return { en: value.en, vi: value.vi };
  }
  throw new Error(`Expected a { en, vi } object, got ${JSON.stringify(value)}`);
}

function toAttributes(value: Prisma.JsonValue | null): Record<string, string> | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  return Object.fromEntries(Object.entries(value).filter((entry): entry is [string, string] => typeof entry[1] === 'string'));
}

function toSetSummary({ _count, title, ...set }: SetRow): LearningSetSummary {
  return { ...set, title: toLocalized(title), itemCount: _count.items };
}

@Injectable()
export class PrismaContentRepository extends ContentRepository {
  constructor(private readonly tx: TransactionHost) {
    super();
  }

  private get db() {
    return this.tx.client;
  }

  async findLanguages(): Promise<LanguageSummary[]> {
    const languages = await this.db.language.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      select: { code: true, nativeName: true, speechLang: true, sets: { select: { _count: { select: { items: true } } } } },
    });
    return languages.map(({ sets, ...language }) => ({
      ...language,
      setCount: sets.length,
      itemCount: sets.reduce((sum, set) => sum + set._count.items, 0),
    }));
  }

  async languageExists(code: string): Promise<boolean> {
    return (await this.db.language.count({ where: { code, isActive: true } })) > 0;
  }

  async findSets(languageCode: string): Promise<LearningSetSummary[]> {
    const sets = await this.db.learningSet.findMany({ where: { languageCode }, orderBy: { sortOrder: 'asc' }, select: setSelect });
    return sets.map(toSetSummary);
  }

  async findSetById(id: string): Promise<LearningSetSummary | null> {
    const set = await this.db.learningSet.findUnique({ where: { id }, select: setSelect });
    return set ? toSetSummary(set) : null;
  }

  async findItems(setId: string, { skip, take }: { skip: number; take: number }) {
    const [rows, total] = await Promise.all([
      this.db.learningItem.findMany({
        where: { setId },
        orderBy: { sortOrder: 'asc' },
        skip,
        take,
        select: {
          id: true,
          type: true,
          text: true,
          reading: true,
          romanization: true,
          ipa: true,
          attributes: true,
          audioUrl: true,
          concept: { select: { gloss: true, emoji: true } },
          components: { orderBy: { position: 'asc' }, select: { role: true, text: true } },
        },
      }),
      this.db.learningItem.count({ where: { setId } }),
    ]);

    const items = rows.map(({ concept, attributes, ...item }): LearningItemView => ({
      ...item,
      meaning: concept ? toLocalized(concept.gloss) : null,
      emoji: concept?.emoji ?? null,
      attributes: toAttributes(attributes),
    }));
    return { items, total };
  }

  // Prisma's groupBy cannot group by a relation's column (item → set), so this one is SQL.
  async countSetProgress(userId: string, languageCode: string, now: Date): Promise<Map<string, SetProgress>> {
    const rows = await this.db.$queryRaw<({ setId: string } & SetProgress)[]>`
      SELECT i.set_id AS "setId",
             COUNT(*)::int AS "seen",
             COUNT(*) FILTER (WHERE p.mastery_level >= ${MASTERED_LEVEL})::int AS "mastered",
             COUNT(*) FILTER (WHERE p.due_at <= ${now})::int AS "due"
      FROM user_item_progress p
      JOIN learning_items i ON i.id = p.item_id
      JOIN learning_sets s ON s.id = i.set_id
      WHERE p.user_id = ${userId}::uuid AND s.language_code = ${languageCode}
      GROUP BY i.set_id`;
    return new Map(rows.map(({ setId, ...progress }) => [setId, progress]));
  }
}
