-- One set per topic and level instead of parts of at most 30 words: a game session takes at most
-- 15 words in learning order anyway, and the word list now pages and searches the whole topic.
--
-- The words of parts 2, 3… move into part 1, which keeps its id (links, game history and personal
-- bests stay). Words keep their ids too, so every learner's progress stays. The seed rewrites the
-- word order afterwards; the offset only keeps lesson order until then.
UPDATE "learning_items" AS item
SET "set_id" = first."id",
    "sort_order" = item."sort_order" + (part."part" - 1) * 1000
FROM "learning_sets" AS part
JOIN "learning_sets" AS first
  ON first."language_code" = part."language_code"
 AND first."level" = part."level"
 AND first."category" = part."category"
 AND first."part" = 1
WHERE item."set_id" = part."id"
  AND part."level" IS NOT NULL
  AND part."part" > 1;

-- Now empty. Game sessions played on them keep their history with no set (ON DELETE SET NULL).
DELETE FROM "learning_sets" WHERE "level" IS NOT NULL AND "part" > 1;

-- "n5-food-1" → "n5-food", "Food & drink 1" → the topic's own title.
UPDATE "learning_sets" AS topic_set
SET "slug" = regexp_replace(topic_set."slug", '-1$', ''),
    "title" = category."title"
FROM "vocabulary_categories" AS category
WHERE topic_set."category" = category."slug"
  AND topic_set."level" IS NOT NULL;

-- AlterTable
ALTER TABLE "learning_sets" DROP COLUMN "part";
