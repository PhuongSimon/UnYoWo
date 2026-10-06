import { Injectable } from '@nestjs/common';
import type { Prisma } from '../../../generated/prisma/client.js';
import { TransactionHost } from '../../../infrastructure/database/transaction-host.js';
import { MASTERED_LEVEL } from '../../progress/mastery.js';
import type {
  ContentSourceView,
  LanguageSummary,
  LearningItemView,
  LearningSetSummary,
  PracticeItem,
  SetProgress,
  WordLookup,
  WordMatch,
} from '../entities/content.entity.js';
import { toAttributes, toLocalized, toMeaning } from '../localized.js';
import { ContentRepository } from './content.repository.js';

const setSelect = {
  id: true,
  languageCode: true,
  slug: true,
  kind: true,
  script: true,
  category: true,
  part: true,
  title: true,
  proficiencyLevel: { select: { code: true, framework: true, title: true, sortOrder: true } },
  vocabularyTopic: { select: { slug: true, title: true, emoji: true } },
  _count: { select: { items: true } },
  // One item with parts is enough to know the set can be built.
  items: { where: { components: { some: {} } }, select: { id: true }, take: 1 },
} satisfies Prisma.LearningSetSelect;

type SetRow = Prisma.LearningSetGetPayload<{ select: typeof setSelect }>;

function toSetSummary({ _count, title, items, proficiencyLevel, vocabularyTopic, ...set }: SetRow): LearningSetSummary {
  return {
    ...set,
    level: proficiencyLevel ? { ...proficiencyLevel, title: toLocalized(proficiencyLevel.title) } : null,
    topic: vocabularyTopic ? { ...vocabularyTopic, title: toLocalized(vocabularyTopic.title) } : null,
    title: toLocalized(title),
    itemCount: _count.items,
    buildable: items.length > 0,
  };
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
          meaning: true,
          partOfSpeech: true,
          attributes: true,
          audioUrl: true,
          concept: { select: { gloss: true, emoji: true } },
          components: { orderBy: { position: 'asc' }, select: { role: true, text: true } },
        },
      }),
      this.db.learningItem.count({ where: { setId } }),
    ]);

    const items = rows.map(({ concept, attributes, meaning, ...item }): LearningItemView => ({
      ...item,
      meaning: toMeaning(meaning, concept?.gloss),
      emoji: concept?.emoji ?? null,
      attributes: toAttributes(attributes),
    }));
    return { items, total };
  }

  async findPracticeItems(filter: { setIds: string[] } | { ids: string[] }): Promise<PracticeItem[]> {
    const rows = await this.db.learningItem.findMany({
      where: 'ids' in filter ? { id: { in: filter.ids } } : { setId: { in: filter.setIds } },
      orderBy: { sortOrder: 'asc' },
      select: {
        id: true,
        setId: true,
        type: true,
        text: true,
        reading: true,
        romanization: true,
        acceptedAnswers: true,
        meaning: true,
        partOfSpeech: true,
        attributes: true,
        audioUrl: true,
        sortOrder: true,
        set: { select: { languageCode: true } },
        components: { orderBy: { position: 'asc' }, select: { role: true, text: true } },
        concept: { select: { gloss: true, emoji: true } },
        relations: { where: { kind: 'CONFUSABLE' }, select: { relatedItemId: true } },
      },
    });

    return rows.map(({ set, concept, relations, attributes, meaning, ...item }) => ({
      ...item,
      attributes: toAttributes(attributes),
      languageCode: set.languageCode,
      meaning: toMeaning(meaning, concept?.gloss),
      emoji: concept?.emoji ?? null,
      confusableIds: relations.map((relation) => relation.relatedItemId),
    }));
  }

  findSources(languageCode: string): Promise<ContentSourceView[]> {
    return this.db.contentSource.findMany({
      where: { items: { some: { set: { languageCode } } } },
      orderBy: { id: 'asc' },
      select: { id: true, name: true, url: true, license: true, attribution: true },
    });
  }

  async lookupWords(lookup: WordLookup, limit: number): Promise<WordMatch[]> {
    const ids = 'meaning' in lookup ? await this.idsByMeaning(lookup, limit) : await this.idsByText(lookup, limit);
    if (ids.length === 0) return [];

    const rows = await this.db.learningItem.findMany({
      where: { id: { in: ids } },
      select: {
        id: true,
        setId: true,
        text: true,
        reading: true,
        romanization: true,
        meaning: true,
        partOfSpeech: true,
        attributes: true,
        concept: { select: { gloss: true } },
        set: { select: { languageCode: true, level: true } },
      },
    });
    const byId = new Map(rows.map((row) => [row.id, row]));
    return ids.flatMap((id) => {
      const row = byId.get(id);
      if (!row) return [];
      const { id: itemId, set, concept, meaning, attributes, ...word } = row;
      return [{ ...word, itemId, language: set.languageCode, level: set.level, meaning: toMeaning(meaning, concept?.gloss), attributes: toAttributes(attributes) }];
    });
  }

  /** 猫, ねこ, Katze or "die Katze": the written form, the kana reading, or a German noun with its article. */
  private async idsByText({ language, text }: { language: string; text: string }, limit: number) {
    const forms = [...new Set([text, text.replace(/^(der|die|das)\s+/i, '')])];
    const rows = await this.db.learningItem.findMany({
      where: {
        set: { languageCode: language, kind: 'VOCABULARY' },
        OR: forms.flatMap((form) => [{ text: { equals: form, mode: 'insensitive' as const } }, { reading: form }]),
      },
      orderBy: [{ difficulty: 'asc' }, { sortOrder: 'asc' }],
      take: limit,
      select: { id: true },
    });
    return rows.map((row) => row.id);
  }

  /**
   * "con mèo" → 猫: a meaning is a list of alternatives ("đẹp, sạch"), each compared whole, with
   * notes in brackets ignored, so "mèo" does not match every animal with "mèo" in its name.
   */
  private async idsByMeaning({ language, meaning, meaningLanguage }: { language: string; meaning: string; meaningLanguage: 'vi' | 'en' }, limit: number) {
    const rows = await this.db.$queryRaw<{ id: string }[]>`
      SELECT i.id
      FROM learning_items i
      JOIN learning_sets s ON s.id = i.set_id
      LEFT JOIN concepts c ON c.id = i.concept_id
      WHERE s.language_code = ${language}
        AND s.kind = 'VOCABULARY'
        AND lower(${meaning.trim()}) = ANY (
          SELECT trim(alternative)
          FROM regexp_split_to_table(
            lower(regexp_replace(coalesce(i.meaning ->> ${meaningLanguage}, c.gloss ->> ${meaningLanguage}, ''), '\\([^)]*\\)', '', 'g')),
            '[,;]'
          ) AS alternative
        )
      ORDER BY i.difficulty, i.sort_order
      LIMIT ${limit}`;
    return rows.map((row) => row.id);
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
