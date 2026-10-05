import type { GameType } from '../../generated/prisma/enums.js';
import { generateFlashcard, generateMultipleChoice, type QuestionGenerator } from './questions/generators.js';

export interface GameDefinition {
  questionCount: number;
  /** An unfinished session can be resumed for this long */
  ttlMinutes: number;
  pointsPerCorrect: number;
  /** Flashcards keep the learning order (due, then new); quizzes are shuffled. */
  shuffleItems: boolean;
  generate: QuestionGenerator;
}

/** Adding a game = one entry here (+ a generator if it asks a new kind of question) + its screen in the web app. */
export const GAME_DEFINITIONS: Record<GameType, GameDefinition> = {
  FLASHCARD: { questionCount: 15, ttlMinutes: 60, pointsPerCorrect: 10, shuffleItems: false, generate: generateFlashcard },
  MULTIPLE_CHOICE: {
    questionCount: 10,
    ttlMinutes: 60,
    pointsPerCorrect: 10,
    shuffleItems: true,
    generate: generateMultipleChoice,
  },
};
