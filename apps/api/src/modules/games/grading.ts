import { HttpStatus } from '@nestjs/common';
import { ApiError } from '../../common/api-error.js';
import type { ReviewRating } from '../../generated/prisma/enums.js';
import { isAcceptedTypedAnswer } from '../content/answers/language-policy.js';
import type { SubmitAnswerDto } from './dto/game-session.dto.js';
import type { GameQuestionRecord } from './entities/game-session.entity.js';

/** How a game is answered: rate yourself, pick one option, pair cards, or type. */
export type AnswerMode = 'rating' | 'choice' | 'match' | 'typing';

export interface GradedAnswer {
  isCorrect: boolean;
  /** What the review scheduler should treat the answer as */
  rating: ReviewRating;
  givenAnswer: string | null;
  /** The item whose card the user picked instead */
  confusedWithItemId: string | null;
  /** A wrong matching pair leaves the question open for another try */
  closesQuestion: boolean;
}

const invalid = () => new ApiError(HttpStatus.BAD_REQUEST, 'INVALID_ANSWER');

function gradeOption(question: GameQuestionRecord, optionId: string | undefined) {
  const option = question.options?.find((candidate) => candidate.id === optionId);
  if (!option) throw invalid();
  const isCorrect = option.id === question.correctOptionId;
  return {
    isCorrect,
    rating: isCorrect ? 'GOOD' : 'AGAIN',
    givenAnswer: option.text,
    confusedWithItemId: isCorrect ? null : option.itemId,
  } as const;
}

const GRADERS: Record<AnswerMode, (question: GameQuestionRecord, dto: SubmitAnswerDto, languageCode: string) => GradedAnswer> = {
  rating: (_question, { rating }) => {
    if (!rating) throw invalid();
    return { isCorrect: rating !== 'AGAIN', rating, givenAnswer: null, confusedWithItemId: null, closesQuestion: true };
  },

  choice: (question, { optionId }) => ({ ...gradeOption(question, optionId), closesQuestion: true }),

  match: (question, { optionId }) => {
    const graded = gradeOption(question, optionId);
    return { ...graded, closesQuestion: graded.isCorrect };
  },

  // An empty answer ("I don't know") is allowed and simply counts as wrong.
  typing: (question, { text }, languageCode) => {
    if (text === undefined) throw invalid();
    const isCorrect = isAcceptedTypedAnswer(text, question.acceptedAnswers, languageCode);
    return {
      isCorrect,
      rating: isCorrect ? 'GOOD' : 'AGAIN',
      givenAnswer: text.trim() || null,
      confusedWithItemId: null,
      closesQuestion: true,
    };
  },
};

export function gradeAnswer(mode: AnswerMode, question: GameQuestionRecord, dto: SubmitAnswerDto, languageCode: string) {
  return GRADERS[mode](question, dto, languageCode);
}
