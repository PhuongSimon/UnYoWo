import { HttpStatus, Injectable } from '@nestjs/common';
import { ApiError } from '../../common/api-error.js';
import type { ReviewRating } from '../../generated/prisma/enums.js';
import { TransactionHost } from '../../infrastructure/database/transaction-host.js';
import type { ItemProgress } from '../progress/entities/progress.entity.js';
import { ProgressService } from '../progress/progress.service.js';
import { ProgressRepository } from '../progress/repositories/progress.repository.js';
import type { CreateGameSessionDto, SubmitAnswerDto } from './dto/game-session.dto.js';
import type {
  AnswerResultView,
  GameQuestionRecord,
  GameSessionRecord,
  GameSessionView,
  SessionSummary,
  UiLocale,
} from './entities/game-session.entity.js';
import { GAME_DEFINITIONS } from './game-definitions.js';
import { isExpired, toSessionView } from './game-session.mapper.js';
import { ItemSelector } from './item-selector.js';
import { Random, shuffle } from './random.js';
import { GameSessionsRepository } from './repositories/game-sessions.repository.js';
import { answeredResults, comboStats, summarize } from './scoring.js';

interface GradedAnswer {
  isCorrect: boolean;
  rating: ReviewRating;
  givenAnswer: string | null;
  confusedWithItemId: string | null;
}

@Injectable()
export class GameSessionsService {
  constructor(
    private readonly sessions: GameSessionsRepository,
    private readonly selector: ItemSelector,
    private readonly progress: ProgressService,
    private readonly progressRecords: ProgressRepository,
    private readonly transaction: TransactionHost,
    private readonly random: Random,
  ) {}

  async create(userId: string, dto: CreateGameSessionDto, locale: UiLocale): Promise<GameSessionView> {
    const definition = GAME_DEFINITIONS[dto.gameType];
    const now = new Date();
    const { items, pool } = await this.selector.select({
      userId,
      languageCode: dto.language,
      source: dto.source,
      setId: dto.setId,
      count: definition.questionCount,
      now,
    });

    const ordered = definition.shuffleItems ? shuffle(items, this.random) : items;
    const questions = ordered.flatMap((item) => definition.generate(item, { pool, locale, random: this.random }) ?? []);
    if (questions.length === 0) throw new ApiError(HttpStatus.UNPROCESSABLE_ENTITY, 'NOT_ENOUGH_ITEMS');

    const session = await this.sessions.create({
      userId,
      gameType: dto.gameType,
      languageCode: dto.language,
      source: dto.source,
      setId: dto.source === 'SET' ? (dto.setId ?? null) : null,
      locale,
      expiresAt: new Date(now.getTime() + definition.ttlMinutes * 60_000),
      questions: questions.map((question, position) => ({ ...question, position })),
    });
    return toSessionView(session, now);
  }

  async get(userId: string, sessionId: string): Promise<GameSessionView> {
    return toSessionView(await this.findOwned(userId, sessionId), new Date());
  }

  answer(userId: string, sessionId: string, dto: SubmitAnswerDto): Promise<AnswerResultView> {
    return this.transaction.run(async () => {
      const now = new Date();
      const session = await this.findOwned(userId, sessionId);
      const question = session.questions.find((q) => q.id === dto.questionId);
      if (!question) throw new ApiError(HttpStatus.NOT_FOUND, 'QUESTION_NOT_FOUND');

      // A retried request (same key, e.g. after a network drop) gets the original result.
      const replayed = await this.progressRecords.findAttemptByKey(userId, dto.idempotencyKey);
      if (replayed) {
        if (replayed.questionId !== question.id) throw new ApiError(HttpStatus.BAD_REQUEST, 'INVALID_ANSWER');
        return this.answerResult(session, question, await this.progressRecords.findOne(userId, question.itemId));
      }

      this.assertPlayable(session, now);
      if (question.answeredAt) throw new ApiError(HttpStatus.CONFLICT, 'QUESTION_ALREADY_ANSWERED');

      const graded = this.grade(question, dto);
      // Conditional update: of two concurrent answers to one question, only the first counts.
      if (!(await this.sessions.markAnswered(question.id, graded.isCorrect, now))) {
        throw new ApiError(HttpStatus.CONFLICT, 'QUESTION_ALREADY_ANSWERED');
      }

      const { progress } = await this.progress.recordAnswer({
        userId,
        itemId: question.itemId,
        sessionId: session.id,
        questionId: question.id,
        idempotencyKey: dto.idempotencyKey,
        responseMs: dto.responseMs ?? null,
        now,
        ...graded,
      });

      const answered: GameQuestionRecord = { ...question, answeredAt: now, isCorrect: graded.isCorrect };
      const questions = session.questions.map((q) => (q.id === question.id ? answered : q));
      return this.answerResult({ ...session, questions }, answered, progress);
    });
  }

  /** Idempotent: completing twice returns the same summary. Unanswered questions simply do not count. */
  complete(userId: string, sessionId: string): Promise<SessionSummary> {
    return this.transaction.run(async () => {
      const now = new Date();
      const session = await this.findOwned(userId, sessionId);
      const { pointsPerCorrect } = GAME_DEFINITIONS[session.gameType];

      if (session.status === 'COMPLETED' && session.completedAt) {
        return summarize(session.questions, pointsPerCorrect, session.startedAt, session.completedAt);
      }

      const summary = summarize(session.questions, pointsPerCorrect, session.startedAt, now);
      await this.sessions.complete(session.id, {
        completedAt: now,
        score: summary.score,
        correctCount: summary.correctCount,
        incorrectCount: summary.incorrectCount,
        maxCombo: summary.maxCombo,
      });
      return summary;
    });
  }

  /** Someone else's session gets the same 404 as a missing one, so ids cannot be probed. */
  private async findOwned(userId: string, sessionId: string): Promise<GameSessionRecord> {
    const session = await this.sessions.findOwned(sessionId, userId);
    if (!session) throw new ApiError(HttpStatus.NOT_FOUND, 'GAME_SESSION_NOT_FOUND');
    return session;
  }

  private assertPlayable(session: GameSessionRecord, now: Date) {
    if (session.status === 'COMPLETED') throw new ApiError(HttpStatus.CONFLICT, 'GAME_SESSION_COMPLETED');
    if (isExpired(session, now)) throw new ApiError(HttpStatus.GONE, 'GAME_SESSION_EXPIRED');
  }

  private grade(question: GameQuestionRecord, dto: SubmitAnswerDto): GradedAnswer {
    if (question.kind === 'FLASHCARD') {
      if (!dto.rating) throw new ApiError(HttpStatus.BAD_REQUEST, 'INVALID_ANSWER');
      return { isCorrect: dto.rating !== 'AGAIN', rating: dto.rating, givenAnswer: null, confusedWithItemId: null };
    }

    const option = question.options?.find((candidate) => candidate.id === dto.optionId);
    if (!option) throw new ApiError(HttpStatus.BAD_REQUEST, 'INVALID_ANSWER');

    const isCorrect = option.id === question.correctOptionId;
    return {
      isCorrect,
      rating: isCorrect ? 'GOOD' : 'AGAIN',
      givenAnswer: option.text,
      confusedWithItemId: isCorrect ? null : option.itemId,
    };
  }

  private answerResult(
    session: GameSessionRecord,
    question: GameQuestionRecord,
    progress: ItemProgress | null,
  ): AnswerResultView {
    return {
      questionId: question.id,
      isCorrect: question.isCorrect === true,
      correctOptionId: question.correctOptionId,
      reveal: question.reveal,
      combo: comboStats(answeredResults(session.questions)).current,
      progress: { masteryLevel: progress?.masteryLevel ?? 0, dueAt: progress?.dueAt ?? null },
    };
  }
}
