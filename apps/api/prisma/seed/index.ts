import { PrismaPg } from '@prisma/adapter-pg';
import { Prisma, PrismaClient } from '../../src/generated/prisma/client.js';
import { buildCatalog, refKey, type Catalog } from './catalog.js';
import type { ItemRef, SeedItem, SeedSet } from './types.js';

try {
  process.loadEnvFile();
} catch {
  // no .env file: rely on real environment variables (CI, production)
}

/** Stable JSON for comparing stored values with the catalog, whatever order Postgres keeps keys in. */
function stableJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableJson).join(',')}]`;
  if (value && typeof value === 'object') {
    return `{${Object.keys(value)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${stableJson((value as Record<string, unknown>)[key])}`)
      .join(',')}}`;
  }
  return JSON.stringify(value ?? null);
}

function itemData(item: SeedItem, conceptIds: Map<string, string>, sortOrder: number) {
  const conceptId = item.concept ? conceptIds.get(item.concept) : undefined;
  if (item.concept && !conceptId) throw new Error(`Unknown concept ${item.concept}`);

  return {
    type: item.type,
    reading: item.reading ?? null,
    romanization: item.romanization ?? null,
    ipa: item.ipa ?? null,
    acceptedAnswers: item.acceptedAnswers ?? [],
    conceptId: conceptId ?? null,
    meaning: item.meaning ?? Prisma.DbNull,
    partOfSpeech: item.partOfSpeech ?? null,
    sourceId: item.source ?? null,
    attributes: item.attributes ?? Prisma.DbNull,
    difficulty: item.difficulty ?? 1,
    sortOrder,
  };
}

const wordKey = (word: { text: string; reading: string | null; partOfSpeech: string | null; category: string | null }) =>
  [word.text, word.reading ?? '', word.partOfSpeech ?? '', word.category ?? ''].join('\u0000');

/**
 * Exam-level word lists. A word is matched to its stored row by text + reading + part of speech
 * + topic within the language and level (the topic tells homonyms apart: 눈 "eye" and 눈 "snow"),
 * not by set, so when the sets of a level are reorganised the word moves to its new set and keeps
 * its id (and every learner's progress on it). A word whose part of speech or topic was corrected
 * reuses the row with the same text already in its target set.
 *
 * Matching runs in memory first, then rows that left the list are deleted, and only then are rows
 * moved and created: a set holds each text once, so the old row must be gone before a new one lands.
 */
async function seedWordLists(db: Prisma.TransactionClient, sets: { set: SeedSet; setId: string }[], conceptIds: Map<string, string>) {
  const groups = new Map<string, { set: SeedSet; setId: string }[]>();
  for (const entry of sets) {
    const key = `${entry.set.language}/${entry.set.level}`;
    groups.set(key, [...(groups.get(key) ?? []), entry]);
  }

  let created = 0;
  let updated = 0;
  let removed = 0;
  for (const group of groups.values()) {
    const { language, level } = group[0].set;
    const existing = await db.learningItem.findMany({
      where: { set: { languageCode: language, level } },
      include: { set: { select: { category: true } } },
    });
    const byKey = new Map(existing.map(({ set, ...row }) => [wordKey({ ...row, category: set.category }), row]));
    const bySetAndText = new Map(existing.map(({ set: _set, ...row }) => [`${row.setId}\u0000${row.text}`, row]));
    const kept = new Set<string>();
    const toUpdate: { id: string; data: ReturnType<typeof itemData> & { setId: string } }[] = [];
    const toCreate: Prisma.LearningItemCreateManyInput[] = [];

    for (const { set, setId } of group) {
      for (const [sortOrder, item] of set.items.entries()) {
        const data = { setId, ...itemData(item, conceptIds, sortOrder) };
        const exact = byKey.get(
          wordKey({ text: item.text, reading: item.reading ?? null, partOfSpeech: item.partOfSpeech ?? null, category: set.category ?? null }),
        );
        const sameSlot = bySetAndText.get(`${setId}\u0000${item.text}`);
        const row = exact && !kept.has(exact.id) ? exact : sameSlot && !kept.has(sameSlot.id) ? sameSlot : undefined;
        if (!row) {
          toCreate.push({ text: item.text, ...data });
          continue;
        }
        kept.add(row.id);
        const stored = { ...row, meaning: row.meaning ?? Prisma.DbNull, attributes: row.attributes ?? Prisma.DbNull };
        const changed = (Object.keys(data) as (keyof typeof data)[]).some((field) => stableJson(stored[field]) !== stableJson(data[field]));
        if (changed) toUpdate.push({ id: row.id, data });
      }
    }

    // Words dropped from a list are deleted unless someone has practised them: their history stays.
    const gone = existing.filter((row) => !kept.has(row.id)).map((row) => row.id);
    if (gone.length > 0) {
      const result = await db.learningItem.deleteMany({ where: { id: { in: gone }, progress: { none: {} }, attempts: { none: {} } } });
      removed += result.count;
    }
    for (const { id, data } of toUpdate) await db.learningItem.update({ where: { id }, data });
    updated += toUpdate.length;
    await db.learningItem.createMany({ data: toCreate });
    created += toCreate.length;

    await db.learningSet.deleteMany({
      where: { languageCode: language, level, slug: { notIn: group.map(({ set }) => set.slug) }, items: { none: {} } },
    });
  }
  return { created, updated, removed };
}

/**
 * Idempotent: every row is upserted by its natural key (language code, set slug,
 * set + text, concept slug), so running the seed again only applies changes.
 * Items removed from the catalog are not deleted, because user progress may point at them
 * (word lists differ slightly: see seedWordLists).
 */
async function seed(db: Prisma.TransactionClient, catalog: Catalog) {
  for (const [sortOrder, { code, nativeName, speechLang }] of catalog.languages.entries()) {
    const data = { nativeName, speechLang, sortOrder };
    await db.language.upsert({ where: { code }, create: { code, ...data }, update: data });
  }

  for (const [sortOrder, { slug, emoji, title }] of catalog.categories.entries()) {
    const data = { emoji, title, sortOrder };
    await db.vocabularyCategory.upsert({ where: { slug }, create: { slug, ...data }, update: data });
  }

  for (const [sortOrder, { language, code, framework, title }] of catalog.levels.entries()) {
    const data = { framework, title, sortOrder };
    await db.proficiencyLevel.upsert({
      where: { languageCode_code: { languageCode: language, code } },
      create: { languageCode: language, code, ...data },
      update: data,
    });
  }

  for (const { id, ...source } of catalog.sources) {
    await db.contentSource.upsert({ where: { id }, create: { id, ...source }, update: source });
  }

  const conceptIds = new Map<string, string>();
  for (const { slug, emoji, gloss } of catalog.concepts) {
    const data = { gloss, emoji: emoji ?? null };
    const row = await db.concept.upsert({ where: { slug }, create: { slug, ...data }, update: data, select: { id: true } });
    conceptIds.set(slug, row.id);
  }

  const itemIds = new Map<string, string>();
  const wordListSets: { set: SeedSet; setId: string }[] = [];
  const setOrder = new Map<string, number>();
  for (const set of catalog.sets) {
    const sortOrder = setOrder.get(set.language) ?? 0;
    setOrder.set(set.language, sortOrder + 1);

    const setData = {
      kind: set.kind,
      script: set.script ?? null,
      category: set.category ?? null,
      level: set.level ?? null,
      title: set.title,
      sortOrder,
    };
    const { id: setId } = await db.learningSet.upsert({
      where: { languageCode_slug: { languageCode: set.language, slug: set.slug } },
      create: { languageCode: set.language, slug: set.slug, ...setData },
      update: setData,
      select: { id: true },
    });

    if (set.level) {
      wordListSets.push({ set, setId });
      continue;
    }
    for (const [itemOrder, item] of set.items.entries()) {
      const data = itemData(item, conceptIds, itemOrder);
      const row = await db.learningItem.upsert({
        where: { setId_text: { setId, text: item.text } },
        create: { setId, text: item.text, ...data },
        update: data,
        select: { id: true },
      });
      itemIds.set(refKey({ language: set.language, set: set.slug, text: item.text }), row.id);
    }
  }

  const words = await seedWordLists(db, wordListSets, conceptIds);

  const idOf = (ref: ItemRef) => {
    const id = itemIds.get(refKey(ref));
    if (!id) throw new Error(`Unknown item ${refKey(ref)}`);
    return id;
  };

  const components = catalog.sets.flatMap((set) =>
    set.items.flatMap((item) =>
      (item.components ?? []).map((component, position) => ({
        itemId: idOf({ language: set.language, set: set.slug, text: item.text }),
        position,
        role: component.role,
        text: component.text,
        componentItemId: component.ref ? idOf(component.ref) : null,
      })),
    ),
  );
  // Components are fully owned by their item, so replacing them is simpler than diffing.
  await db.itemComponent.deleteMany({ where: { itemId: { in: [...new Set(components.map((c) => c.itemId))] } } });
  await db.itemComponent.createMany({ data: components });

  await db.itemRelation.createMany({
    data: catalog.relations.map(({ from, to, kind }) => ({ itemId: idOf(from), relatedItemId: idOf(to), kind })),
    skipDuplicates: true,
  });

  return { items: itemIds.size, words, components: components.length, relations: catalog.relations.length };
}

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error('DATABASE_URL is not set');

  const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: databaseUrl }) });
  try {
    const catalog = buildCatalog();
    const counts = await prisma.$transaction((tx) => seed(tx, catalog), { timeout: 300_000 });
    console.log(
      `Seeded ${catalog.languages.length} languages, ${catalog.levels.length} levels, ${catalog.categories.length} topics, ` +
        `${catalog.concepts.length} concepts, ${catalog.sets.length} sets, ${counts.items} alphabet/starter items, ` +
        `${counts.components} components, ${counts.relations} relations.\n` +
        `Word lists: ${counts.words.created} created, ${counts.words.updated} updated, ${counts.words.removed} removed.`,
    );
  } finally {
    await prisma.$disconnect();
  }
}

await main();
