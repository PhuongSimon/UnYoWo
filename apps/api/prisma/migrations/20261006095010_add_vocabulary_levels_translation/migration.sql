-- CreateEnum
CREATE TYPE "PartOfSpeech" AS ENUM ('NOUN', 'VERB', 'ADJECTIVE', 'ADVERB', 'PRONOUN', 'DETERMINER', 'NUMERAL', 'COUNTER', 'PREPOSITION', 'CONJUNCTION', 'PARTICLE', 'INTERJECTION', 'PHRASE', 'AFFIX');

-- AlterTable
ALTER TABLE "learning_items" ADD COLUMN     "meaning" JSONB,
ADD COLUMN     "part_of_speech" "PartOfSpeech",
ADD COLUMN     "source_id" TEXT;

-- AlterTable
ALTER TABLE "learning_sets" ADD COLUMN     "level" TEXT,
ADD COLUMN     "part" SMALLINT;

-- CreateTable
CREATE TABLE "proficiency_levels" (
    "language_code" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "framework" TEXT NOT NULL,
    "title" JSONB NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "proficiency_levels_pkey" PRIMARY KEY ("language_code","code")
);

-- CreateTable
CREATE TABLE "vocabulary_categories" (
    "slug" TEXT NOT NULL,
    "title" JSONB NOT NULL,
    "emoji" TEXT,
    "sort_order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "vocabulary_categories_pkey" PRIMARY KEY ("slug")
);

-- CreateTable
CREATE TABLE "content_sources" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "license" TEXT NOT NULL,
    "attribution" TEXT NOT NULL,

    CONSTRAINT "content_sources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "translation_cache" (
    "id" UUID NOT NULL,
    "source_lang" TEXT NOT NULL,
    "target_lang" TEXT NOT NULL,
    "source_text" TEXT NOT NULL,
    "translated_text" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "hits" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_used_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "translation_cache_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "translation_cache_source_lang_target_lang_source_text_key" ON "translation_cache"("source_lang", "target_lang", "source_text");

-- CreateIndex
CREATE INDEX "learning_items_text_idx" ON "learning_items"("text");

-- CreateIndex
CREATE INDEX "learning_sets_language_code_level_idx" ON "learning_sets"("language_code", "level");

-- AddForeignKey
ALTER TABLE "proficiency_levels" ADD CONSTRAINT "proficiency_levels_language_code_fkey" FOREIGN KEY ("language_code") REFERENCES "languages"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Existing vocabulary sets already name their topic: register those slugs so the new foreign key holds.
-- The seed fills in the real titles.
INSERT INTO "vocabulary_categories" ("slug", "title")
SELECT DISTINCT "category", jsonb_build_object('en', "category", 'vi', "category")
FROM "learning_sets"
WHERE "category" IS NOT NULL;

-- AddForeignKey
ALTER TABLE "learning_sets" ADD CONSTRAINT "learning_sets_category_fkey" FOREIGN KEY ("category") REFERENCES "vocabulary_categories"("slug") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learning_sets" ADD CONSTRAINT "learning_sets_language_code_level_fkey" FOREIGN KEY ("language_code", "level") REFERENCES "proficiency_levels"("language_code", "code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learning_items" ADD CONSTRAINT "learning_items_source_id_fkey" FOREIGN KEY ("source_id") REFERENCES "content_sources"("id") ON DELETE SET NULL ON UPDATE CASCADE;
