-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "GameType" ADD VALUE 'LISTENING';
ALTER TYPE "GameType" ADD VALUE 'SPEED';
ALTER TYPE "GameType" ADD VALUE 'BUILDER';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "QuestionKind" ADD VALUE 'AUDIO_TO_TEXT';
ALTER TYPE "QuestionKind" ADD VALUE 'AUDIO_TO_MEANING';
ALTER TYPE "QuestionKind" ADD VALUE 'BUILD';

-- AlterTable
ALTER TABLE "game_questions" ADD COLUMN     "audio_url" TEXT;

-- AlterTable
ALTER TABLE "game_sessions" ADD COLUMN     "time_limit_seconds" INTEGER,
ADD COLUMN     "timer_started_at" TIMESTAMP(3);
