import { Injectable } from '@nestjs/common';
import { Prisma } from '../../../generated/prisma/client.js';
import type { ComponentRole, GameType } from '../../../generated/prisma/enums.js';
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
  questions: { orderBy: { position: 'asc' } },
  attempts: {
    orderBy: { createdAt: 'asc' },
    select: { questionId: true, isCorrect: true, givenAnswer: true, rating: true, createdAt: true },
  },
} satisfies Prisma.GameSessionInclude;

type SessionRow = Prisma.GameSessionGetPayload<{ include: typeof sessionInclude }>;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);
const stringOrNull = (value: unknown) => (typeof value === 'string' ? value : null);

const ROLES = new Set<string>(['INITIAL', 'VOWEL', 'FINAL', 'BASE', 'SMALL', 'MARK']);
const isRole = (value: unknown): value is ComponentRole => typeof value === 'string' && ROLES.has(value);

function toOptions(value: Prisma.JsonValue | null): ChoiceOption[] | null {
  if (!Array.isArray(value)) return null;
  return value.flatMap((option: unknown) => {
    if (!isRecord(option)) return [];
    return [
      {
        id: String(option.id),
        text: String(option.text),
        itemId: stringOrNull(option.itemId),
        ...(typeof option.slot === 'number' ? { slot: option.slot } : {}),
        ...(isRole(option.role) ? { role: option.role } : {}),
      },
    ];
  });
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
    questions: questions.map(({ options, reveal, sessionId: _sessionId, ...question }) => ({
      ...question,
      options: toOptions(options),
      reveal: toReveal(reveal),
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

  async startTimer(id: string, at: Date): Promise<Date> {
    await this.db.gameSession.updateMany({ where: { id, timerStartedAt: null }, data: { timerStartedAt: at } });
    const row = await this.db.gameSession.findUniqueOrThrow({ where: { id }, select: { timerStartedAt: true } });
    return row.timerStartedAt ?? at;
  }

  async findBestScore(
    userId: string,
    { gameType, languageCode, setId }: { gameType: GameType; languageCode: string; setId: string | null },
    excludeId: string,
  ): Promise<number | null> {
    const { _max } = await this.db.gameSession.aggregate({
      where: { userId, gameType, languageCode, setId, status: 'COMPLETED', id: { not: excludeId } },
      _max: { score: true },
    });
    return _max.score;
  }

  async complete(id: string, data: CompleteSessionData): Promise<boolean> {
    const { count } = await this.db.gameSession.updateMany({
      where: { id, status: 'ACTIVE' },
      data: { ...data, status: 'COMPLETED' },
    });
    return count === 1;
  }
}
