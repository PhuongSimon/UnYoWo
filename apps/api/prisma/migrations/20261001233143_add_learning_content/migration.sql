-- CreateEnum
CREATE TYPE "LearningSetKind" AS ENUM ('ALPHABET', 'VOCABULARY');

-- CreateEnum
CREATE TYPE "LearningItemType" AS ENUM ('CHARACTER', 'SYLLABLE', 'WORD');

-- CreateEnum
CREATE TYPE "ComponentRole" AS ENUM ('INITIAL', 'VOWEL', 'FINAL', 'BASE', 'SMALL', 'MARK');

-- CreateEnum
CREATE TYPE "ItemRelationKind" AS ENUM ('SCRIPT_COUNTERPART', 'VOICED', 'SEMI_VOICED', 'CONFUSABLE');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "timezone" TEXT NOT NULL DEFAULT 'UTC';

-- CreateTable
CREATE TABLE "languages" (
    "code" TEXT NOT NULL,
    "native_name" TEXT NOT NULL,
    "speech_lang" TEXT NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "languages_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "learning_sets" (
    "id" UUID NOT NULL,
    "language_code" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "kind" "LearningSetKind" NOT NULL,
    "script" TEXT,
    "category" TEXT,
    "title" JSONB NOT NULL,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "learning_sets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "concepts" (
    "id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "gloss" JSONB NOT NULL,
    "emoji" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "concepts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "learning_items" (
    "id" UUID NOT NULL,
    "set_id" UUID NOT NULL,
    "type" "LearningItemType" NOT NULL,
    "text" TEXT NOT NULL,
    "reading" TEXT,
    "romanization" TEXT,
    "ipa" TEXT,
    "accepted_answers" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "concept_id" UUID,
    "attributes" JSONB,
    "audio_url" TEXT,
    "difficulty" SMALLINT NOT NULL DEFAULT 1,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "learning_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "item_components" (
    "item_id" UUID NOT NULL,
    "position" SMALLINT NOT NULL,
    "role" "ComponentRole" NOT NULL,
    "text" TEXT NOT NULL,
    "component_item_id" UUID,

    CONSTRAINT "item_components_pkey" PRIMARY KEY ("item_id","position")
);

-- CreateTable
CREATE TABLE "item_relations" (
    "item_id" UUID NOT NULL,
    "related_item_id" UUID NOT NULL,
    "kind" "ItemRelationKind" NOT NULL,

    CONSTRAINT "item_relations_pkey" PRIMARY KEY ("item_id","related_item_id","kind")
);

-- CreateTable
CREATE TABLE "user_item_progress" (
    "user_id" UUID NOT NULL,
    "item_id" UUID NOT NULL,
    "attempt_count" INTEGER NOT NULL DEFAULT 0,
    "correct_count" INTEGER NOT NULL DEFAULT 0,
    "correct_streak" INTEGER NOT NULL DEFAULT 0,
    "mastery_level" SMALLINT NOT NULL DEFAULT 0,
    "interval_minutes" INTEGER NOT NULL DEFAULT 0,
    "last_reviewed_at" TIMESTAMP(3),
    "due_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_item_progress_pkey" PRIMARY KEY ("user_id","item_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "learning_sets_language_code_slug_key" ON "learning_sets"("language_code", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "concepts_slug_key" ON "concepts"("slug");

-- CreateIndex
CREATE INDEX "learning_items_concept_id_idx" ON "learning_items"("concept_id");

-- CreateIndex
CREATE UNIQUE INDEX "learning_items_set_id_text_key" ON "learning_items"("set_id", "text");

-- CreateIndex
CREATE INDEX "item_components_component_item_id_idx" ON "item_components"("component_item_id");

-- CreateIndex
CREATE INDEX "item_relations_related_item_id_idx" ON "item_relations"("related_item_id");

-- CreateIndex
CREATE INDEX "user_item_progress_user_id_due_at_idx" ON "user_item_progress"("user_id", "due_at");

-- CreateIndex
CREATE INDEX "user_item_progress_item_id_idx" ON "user_item_progress"("item_id");

-- AddForeignKey
ALTER TABLE "learning_sets" ADD CONSTRAINT "learning_sets_language_code_fkey" FOREIGN KEY ("language_code") REFERENCES "languages"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learning_items" ADD CONSTRAINT "learning_items_set_id_fkey" FOREIGN KEY ("set_id") REFERENCES "learning_sets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learning_items" ADD CONSTRAINT "learning_items_concept_id_fkey" FOREIGN KEY ("concept_id") REFERENCES "concepts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_components" ADD CONSTRAINT "item_components_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "learning_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_components" ADD CONSTRAINT "item_components_component_item_id_fkey" FOREIGN KEY ("component_item_id") REFERENCES "learning_items"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_relations" ADD CONSTRAINT "item_relations_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "learning_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "item_relations" ADD CONSTRAINT "item_relations_related_item_id_fkey" FOREIGN KEY ("related_item_id") REFERENCES "learning_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_item_progress" ADD CONSTRAINT "user_item_progress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_item_progress" ADD CONSTRAINT "user_item_progress_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "learning_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;
