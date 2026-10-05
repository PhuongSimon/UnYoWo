-- CreateEnum
CREATE TYPE "ReviewRating" AS ENUM ('AGAIN', 'HARD', 'GOOD', 'EASY');

-- CreateEnum
CREATE TYPE "GameType" AS ENUM ('FLASHCARD', 'MULTIPLE_CHOICE');

-- CreateEnum
CREATE TYPE "SessionSource" AS ENUM ('SET', 'DUE');

-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('ACTIVE', 'COMPLETED');

-- CreateEnum
CREATE TYPE "QuestionKind" AS ENUM ('FLASHCARD', 'TEXT_TO_ROMANIZATION', 'ROMANIZATION_TO_TEXT', 'TEXT_TO_MEANING', 'MEANING_TO_TEXT', 'EMOJI_TO_TEXT');

-- CreateTable
CREATE TABLE "learning_attempts" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "item_id" UUID NOT NULL,
    "session_id" UUID,
    "question_id" UUID,
    "idempotency_key" UUID NOT NULL,
    "given_answer" TEXT,
    "is_correct" BOOLEAN NOT NULL,
    "confused_with_item_id" UUID,
    "rating" "ReviewRating" NOT NULL,
    "response_ms" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "learning_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "game_sessions" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "game_type" "GameType" NOT NULL,
    "language_code" TEXT NOT NULL,
    "source" "SessionSource" NOT NULL,
    "set_id" UUID,
    "locale" TEXT NOT NULL,
    "status" "SessionStatus" NOT NULL DEFAULT 'ACTIVE',
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "completed_at" TIMESTAMP(3),
    "score" INTEGER NOT NULL DEFAULT 0,
    "correct_count" INTEGER NOT NULL DEFAULT 0,
    "incorrect_count" INTEGER NOT NULL DEFAULT 0,
    "max_combo" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "game_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "game_questions" (
    "id" UUID NOT NULL,
    "session_id" UUID NOT NULL,
    "position" SMALLINT NOT NULL,
    "item_id" UUID NOT NULL,
    "kind" "QuestionKind" NOT NULL,
    "prompt" TEXT NOT NULL,
    "options" JSONB,
    "correct_option_id" TEXT,
    "reveal" JSONB NOT NULL,
    "answered_at" TIMESTAMP(3),
    "is_correct" BOOLEAN,

    CONSTRAINT "game_questions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "learning_attempts_user_id_created_at_idx" ON "learning_attempts"("user_id", "created_at");

-- CreateIndex
CREATE INDEX "learning_attempts_user_id_item_id_idx" ON "learning_attempts"("user_id", "item_id");

-- CreateIndex
CREATE INDEX "learning_attempts_question_id_idx" ON "learning_attempts"("question_id");

-- CreateIndex
CREATE UNIQUE INDEX "learning_attempts_user_id_idempotency_key_key" ON "learning_attempts"("user_id", "idempotency_key");

-- CreateIndex
CREATE INDEX "game_sessions_user_id_started_at_idx" ON "game_sessions"("user_id", "started_at");

-- CreateIndex
CREATE INDEX "game_sessions_user_id_game_type_language_code_status_idx" ON "game_sessions"("user_id", "game_type", "language_code", "status");

-- CreateIndex
CREATE UNIQUE INDEX "game_questions_session_id_position_key" ON "game_questions"("session_id", "position");

-- AddForeignKey
ALTER TABLE "learning_attempts" ADD CONSTRAINT "learning_attempts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learning_attempts" ADD CONSTRAINT "learning_attempts_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "learning_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learning_attempts" ADD CONSTRAINT "learning_attempts_confused_with_item_id_fkey" FOREIGN KEY ("confused_with_item_id") REFERENCES "learning_items"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learning_attempts" ADD CONSTRAINT "learning_attempts_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "game_sessions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "learning_attempts" ADD CONSTRAINT "learning_attempts_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "game_questions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game_sessions" ADD CONSTRAINT "game_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game_sessions" ADD CONSTRAINT "game_sessions_language_code_fkey" FOREIGN KEY ("language_code") REFERENCES "languages"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game_sessions" ADD CONSTRAINT "game_sessions_set_id_fkey" FOREIGN KEY ("set_id") REFERENCES "learning_sets"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game_questions" ADD CONSTRAINT "game_questions_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "game_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "game_questions" ADD CONSTRAINT "game_questions_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "learning_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;
