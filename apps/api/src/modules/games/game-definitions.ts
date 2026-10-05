import type { GameType } from '../../generated/prisma/enums.js';
import type { AnswerMode } from './grading.js';
import {
  cycling,
  eachItem,
  generateBuilder,
  generateFlashcard,
  generateListening,
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
  /** Timed games: the round lasts this long once the player presses Start */
  timeLimitSeconds?: number;
  /** Results compare the score with the player's best on the same set */
  tracksPersonalBest?: boolean;
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
  LISTENING: {
    questionCount: 10,
    selectCount: 10,
    ttlMinutes: 60,
    pointsPerCorrect: 10,
    shuffleItems: true,
    answerMode: 'choice',
    generate: eachItem(generateListening),
  },
  SPEED: {
    // More questions than anyone answers in a minute: the clock, not the list, ends the round.
    questionCount: 60,
    selectCount: 30,
    ttlMinutes: 15,
    pointsPerCorrect: 10,
    shuffleItems: true,
    answerMode: 'choice',
    generate: cycling(generateMultipleChoice),
    timeLimitSeconds: 60,
    tracksPersonalBest: true,
  },
  BUILDER: {
    questionCount: 8,
    selectCount: 14,
    ttlMinutes: 60,
    pointsPerCorrect: 10,
    shuffleItems: true,
    answerMode: 'build',
    generate: eachItem(generateBuilder),
  },
};
