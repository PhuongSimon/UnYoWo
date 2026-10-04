import { PrismaPg } from '@prisma/adapter-pg';
import { Prisma, PrismaClient } from '../../src/generated/prisma/client.js';
import { buildCatalog, refKey, type Catalog } from './catalog.js';
import type { ItemRef } from './types.js';

try {
  process.loadEnvFile();
} catch {
  // no .env file: rely on real environment variables (CI, production)
}

/**
 * Idempotent: every row is upserted by its natural key (language code, set slug,
 * set + text, concept slug), so running the seed again only applies changes.
 * Items removed from the catalog are not deleted, because user progress may point at them.
 */
async function seed(db: Prisma.TransactionClient, catalog: Catalog) {
  for (const [sortOrder, { code, nativeName, speechLang }] of catalog.languages.entries()) {
    const data = { nativeName, speechLang, sortOrder };
    await db.language.upsert({ where: { code }, create: { code, ...data }, update: data });
  }

  const conceptIds = new Map<string, string>();
  for (const { slug, emoji, gloss } of catalog.concepts) {
    const data = { gloss, emoji: emoji ?? null };
    const row = await db.concept.upsert({ where: { slug }, create: { slug, ...data }, update: data, select: { id: true } });
    conceptIds.set(slug, row.id);
  }

  const itemIds = new Map<string, string>();
  const setOrder = new Map<string, number>();
  for (const set of catalog.sets) {
    const sortOrder = setOrder.get(set.language) ?? 0;
    setOrder.set(set.language, sortOrder + 1);

    const setData = { kind: set.kind, script: set.script ?? null, category: set.category ?? null, title: set.title, sortOrder };
    const { id: setId } = await db.learningSet.upsert({
      where: { languageCode_slug: { languageCode: set.language, slug: set.slug } },
      create: { languageCode: set.language, slug: set.slug, ...setData },
      update: setData,
      select: { id: true },
    });

    for (const [itemOrder, item] of set.items.entries()) {
      const conceptId = item.concept ? conceptIds.get(item.concept) : undefined;
      if (item.concept && !conceptId) throw new Error(`Unknown concept ${item.concept}`);

      const data = {
        type: item.type,
        reading: item.reading ?? null,
        romanization: item.romanization ?? null,
        ipa: item.ipa ?? null,
        acceptedAnswers: item.acceptedAnswers ?? [],
        conceptId: conceptId ?? null,
        attributes: item.attributes ?? Prisma.DbNull,
        difficulty: item.difficulty ?? 1,
        sortOrder: itemOrder,
      };
      const row = await db.learningItem.upsert({
        where: { setId_text: { setId, text: item.text } },
        create: { setId, text: item.text, ...data },
        update: data,
        select: { id: true },
      });
      itemIds.set(refKey({ language: set.language, set: set.slug, text: item.text }), row.id);
    }
  }

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

  return { items: itemIds.size, components: components.length, relations: catalog.relations.length };
}

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error('DATABASE_URL is not set');

  const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: databaseUrl }) });
  try {
    const catalog = buildCatalog();
    const counts = await prisma.$transaction((tx) => seed(tx, catalog), { timeout: 120_000 });
    console.log(
      `Seeded ${catalog.languages.length} languages, ${catalog.concepts.length} concepts, ${catalog.sets.length} sets, ` +
        `${counts.items} items, ${counts.components} components, ${counts.relations} relations.`,
    );
  } finally {
    await prisma.$disconnect();
  }
}

await main();
