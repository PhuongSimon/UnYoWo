import { Injectable } from '@nestjs/common';
import { Prisma } from '../../../generated/prisma/client.js';
import { TransactionHost } from '../../../infrastructure/database/transaction-host.js';
import type {
  ChoiceOption,
  CompleteSessionData,
  CreateGameSessionData,
  GameSessionRecord,
  QuestionReveal,
} from '../entities/game-session.entity.js';
import { GameSessionsRepository } from './game-sessions.repository.js';

const sessionInclude = {
  questions: {
    orderBy: { position: 'asc' },
    include: { attempts: { orderBy: { createdAt: 'desc' }, take: 1, select: { givenAnswer: true, rating: true } } },
  },
} satisfies Prisma.GameSessionInclude;

type SessionRow = Prisma.GameSessionGetPayload<{ include: typeof sessionInclude }>;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);
const stringOrNull = (value: unknown) => (typeof value === 'string' ? value : null);

function toOptions(value: Prisma.JsonValue | null): ChoiceOption[] | null {
  if (!Array.isArray(value)) return null;
  return value.flatMap((option: unknown) =>
    isRecord(option) ? [{ id: String(option.id), text: String(option.text), itemId: String(option.itemId) }] : [],
  );
}

function toReveal(value: Prisma.JsonValue): QuestionReveal {
  if (!isRecord(value) || typeof value.text !== 'string') throw new Error('Invalid question reveal');
  return {
    text: value.text,
    reading: stringOrNull(value.reading),
    romanization: stringOrNull(value.romanization),
    meaning: stringOrNull(value.meaning),
    emoji: stringOrNull(value.emoji),
  };
}

function toRecord({ questions, locale, ...session }: SessionRow): GameSessionRecord {
  return {
    ...session,
    locale: locale === 'vi' ? 'vi' : 'en',
    questions: questions.map(({ attempts, options, reveal, sessionId: _sessionId, ...question }) => ({
      ...question,
      options: toOptions(options),
      reveal: toReveal(reveal),
      lastAttempt: attempts[0] ?? null,
    })),
  };
}

@Injectable()
export class PrismaGameSessionsRepository extends GameSessionsRepository {
  constructor(private readonly tx: TransactionHost) {
    super();
  }

  private get db() {
    return this.tx.client;
  }

  async create({ questions, ...session }: CreateGameSessionData): Promise<GameSessionRecord> {
    const row = await this.db.gameSession.create({
      data: {
        ...session,
        questions: {
          create: questions.map(({ options, ...question }) => ({ ...question, options: options ?? Prisma.DbNull })),
        },
      },
      include: sessionInclude,
    });
    return toRecord(row);
  }

  async findOwned(id: string, userId: string): Promise<GameSessionRecord | null> {
    const row = await this.db.gameSession.findFirst({ where: { id, userId }, include: sessionInclude });
    return row ? toRecord(row) : null;
  }

  async markAnswered(questionId: string, isCorrect: boolean, answeredAt: Date): Promise<boolean> {
    const { count } = await this.db.gameQuestion.updateMany({
      where: { id: questionId, answeredAt: null },
      data: { answeredAt, isCorrect },
    });
    return count === 1;
  }

  async complete(id: string, data: CompleteSessionData): Promise<boolean> {
    const { count } = await this.db.gameSession.updateMany({
      where: { id, status: 'ACTIVE' },
      data: { ...data, status: 'COMPLETED' },
    });
    return count === 1;
  }
}
