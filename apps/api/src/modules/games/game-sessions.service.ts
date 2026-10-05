import { HttpStatus, Injectable } from '@nestjs/common';
import { ApiError } from '../../common/api-error.js';
import { TransactionHost } from '../../infrastructure/database/transaction-host.js';
import { GamificationService } from '../gamification/gamification.service.js';
import { XP_POLICY } from '../gamification/xp-policy.js';
import type { Attempt, ItemProgress } from '../progress/entities/progress.entity.js';
import { ProgressService } from '../progress/progress.service.js';
import { ProgressRepository } from '../progress/repositories/progress.repository.js';
import type { CreateGameSessionDto, SubmitAnswerDto } from './dto/game-session.dto.js';
import type {
  AnswerResultView,
  CompletedSessionSummary,
  GameQuestionRecord,
  GameSessionRecord,
  GameSessionView,
  SessionAttempt,
  UiLocale,
} from './entities/game-session.entity.js';
import { GAME_DEFINITIONS } from './game-definitions.js';
import { isExpired, toSessionView } from './game-session.mapper.js';
import { gradeAnswer } from './grading.js';
import { ItemSelector } from './item-selector.js';
import { Random, shuffle } from './random.js';
import { GameSessionsRepository } from './repositories/game-sessions.repository.js';
import { comboStats, summarize } from './scoring.js';

const toSessionAttempt = ({ questionId, isCorrect, givenAnswer, rating, createdAt }: Attempt): SessionAttempt => ({
  questionId,
  isCorrect,
  givenAnswer,
  rating,
  createdAt,
});

@Injectable()
export class GameSessionsService {
  constructor(
    private readonly sessions: GameSessionsRepository,
    private readonly selector: ItemSelector,
    private readonly progress: ProgressService,
    private readonly progressRecords: ProgressRepository,
    private readonly transaction: TransactionHost,
    private readonly random: Random,
    private readonly gamification: GamificationService,
  ) {}

  async create(userId: string, dto: CreateGameSessionDto, locale: UiLocale): Promise<GameSessionView> {
    const definition = GAME_DEFINITIONS[dto.gameType];
    const now = new Date();
    const { items, pool } = await this.selector.select({
      userId,
      languageCode: dto.language,
      source: dto.source,
      setId: dto.setId,
      count: definition.selectCount,
      now,
    });

    const ordered = definition.shuffleItems ? shuffle(items, this.random) : items;
    const questions = definition.generate(ordered, { pool, locale, random: this.random, count: definition.questionCount });
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
    const now = new Date();
    const session = await this.findOwned(userId, sessionId);
    const rewards = session.status === 'COMPLETED' ? await this.gamification.rewardsFor(userId, session.id, now) : null;
    return toSessionView(session, now, rewards);
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
        const progress = await this.progressRecords.findOne(userId, question.itemId);
        // XP is granted once per question, so a right answer that closed it earned exactly this.
        const xpGained = replayed.isCorrect && question.answeredAt ? XP_POLICY.correctAnswer : 0;
        return this.answerResult(session.attempts, question, replayed.isCorrect, progress, xpGained);
      }

      this.assertPlayable(session, now);
      if (question.answeredAt) throw new ApiError(HttpStatus.CONFLICT, 'QUESTION_ALREADY_ANSWERED');

      const graded = gradeAnswer(GAME_DEFINITIONS[session.gameType].answerMode, question, dto, session.languageCode);
      // A matching pair found after a wrong try is completed, but not "right first time".
      const firstTry = !session.attempts.some((attempt) => attempt.questionId === question.id);
      const closed: GameQuestionRecord = graded.closesQuestion
        ? { ...question, answeredAt: now, isCorrect: graded.isCorrect && firstTry }
        : question;

      // Conditional update: of two concurrent answers to one question, only the first counts.
      if (graded.closesQuestion && !(await this.sessions.markAnswered(question.id, closed.isCorrect === true, now))) {
        throw new ApiError(HttpStatus.CONFLICT, 'QUESTION_ALREADY_ANSWERED');
      }

      const { attempt, progress, isNewItem } = await this.progress.recordAnswer({
        userId,
        itemId: question.itemId,
        sessionId: session.id,
        questionId: question.id,
        idempotencyKey: dto.idempotencyKey,
        isCorrect: graded.isCorrect,
        rating: graded.rating,
        givenAnswer: graded.givenAnswer,
        confusedWithItemId: graded.confusedWithItemId,
        responseMs: dto.responseMs ?? null,
        now,
      });

      const { xpGained } = await this.gamification.recordAnswer({
        userId,
        languageCode: session.languageCode,
        sessionId: session.id,
        questionId: question.id,
        isCorrect: graded.isCorrect,
        questionCompleted: closed.answeredAt !== null,
        isNewItem,
        now,
      });

      return this.answerResult([...session.attempts, toSessionAttempt(attempt)], closed, graded.isCorrect, progress, xpGained);
    });
  }

  /** Idempotent: completing twice returns the same summary. Unanswered questions simply do not count. */
  complete(userId: string, sessionId: string): Promise<CompletedSessionSummary> {
    return this.transaction.run(async () => {
      const now = new Date();
      const session = await this.findOwned(userId, sessionId);
      const { pointsPerCorrect } = GAME_DEFINITIONS[session.gameType];

      if (session.status === 'COMPLETED' && session.completedAt) {
        const summary = summarize(session.questions, session.attempts, pointsPerCorrect, session.startedAt, session.completedAt);
        return { ...summary, rewards: await this.gamification.rewardsFor(userId, session.id, now) };
      }

      const summary = summarize(session.questions, session.attempts, pointsPerCorrect, session.startedAt, now);
      const justCompleted = await this.sessions.complete(session.id, {
        completedAt: now,
        score: summary.score,
        correctCount: summary.correctCount,
        incorrectCount: summary.incorrectCount,
        maxCombo: summary.maxCombo,
      });
      // Only the request that actually completed the session hands out its rewards.
      if (justCompleted) {
        await this.gamification.recordSessionCompleted({
          userId,
          languageCode: session.languageCode,
          sessionId: session.id,
          answeredCount: summary.answeredCount,
          questionCount: summary.questionCount,
          mistakeCount: summary.mistakeCount,
          now,
        });
      }
      return { ...summary, rewards: await this.gamification.rewardsFor(userId, session.id, now) };
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

  private answerResult(
    attempts: SessionAttempt[],
    question: GameQuestionRecord,
    isCorrect: boolean,
    progress: ItemProgress | null,
    xpGained: number,
  ): AnswerResultView {
    const completed = question.answeredAt !== null;
    return {
      questionId: question.id,
      isCorrect,
      questionCompleted: completed,
      correctOptionId: completed ? question.correctOptionId : null,
      reveal: completed ? question.reveal : null,
      combo: comboStats(attempts.map((attempt) => attempt.isCorrect)).current,
      xpGained,
      progress: { masteryLevel: progress?.masteryLevel ?? 0, dueAt: progress?.dueAt ?? null },
    };
  }
}
