import type { GameType } from '../../generated/prisma/enums.js';
import type { AnswerMode } from './grading.js';
import {
  eachItem,
  generateFlashcard,
  generateMatchingBoard,
  generateMultipleChoice,
  generateTyping,
  type SessionGenerator,
} from './questions/generators.js';

export interface GameDefinition {
  questionCount: number;
  /** Items fetched for the session; more than questionCount when some may be skipped */
  selectCount: number;
  /** An unfinished session can be resumed for this long */
  ttlMinutes: number;
  pointsPerCorrect: number;
  /** Flashcards keep the learning order (due, then new); quizzes are shuffled. */
  shuffleItems: boolean;
  answerMode: AnswerMode;
  generate: SessionGenerator;
}

/** Adding a game = one entry here (+ a generator if it asks a new kind of question) + its screen in the web app. */
export const GAME_DEFINITIONS: Record<GameType, GameDefinition> = {
  FLASHCARD: {
    questionCount: 15,
    selectCount: 15,
    ttlMinutes: 60,
    pointsPerCorrect: 10,
    shuffleItems: false,
    answerMode: 'rating',
    generate: eachItem(generateFlashcard),
  },
  MULTIPLE_CHOICE: {
    questionCount: 10,
    selectCount: 10,
    ttlMinutes: 60,
    pointsPerCorrect: 10,
    shuffleItems: true,
    answerMode: 'choice',
    generate: eachItem(generateMultipleChoice),
  },
  MATCHING: {
    questionCount: 6,
    // Extra items so the board can skip duplicates (じ and ぢ are both "ji").
    selectCount: 10,
    ttlMinutes: 60,
    pointsPerCorrect: 10,
    shuffleItems: true,
    answerMode: 'match',
    generate: generateMatchingBoard,
  },
  TYPING: {
    questionCount: 10,
    selectCount: 10,
    ttlMinutes: 60,
    pointsPerCorrect: 10,
    shuffleItems: true,
    answerMode: 'typing',
    generate: eachItem(generateTyping),
  },
};
