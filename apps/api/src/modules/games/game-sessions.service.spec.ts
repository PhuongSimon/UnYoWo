import type { TransactionHost } from '../../infrastructure/database/transaction-host.js';
import type { PracticeItem } from '../content/entities/content.entity.js';
import type { Attempt, CreateAttemptData, ItemProgress } from '../progress/entities/progress.entity.js';
import { ProgressService } from '../progress/progress.service.js';
import { ProgressRepository } from '../progress/repositories/progress.repository.js';
import { SimpleIntervalScheduler } from '../progress/simple-interval.scheduler.js';
import type {
  CompleteSessionData,
  CreateGameSessionData,
  GameSessionRecord,
} from './entities/game-session.entity.js';
import { GameSessionsService } from './game-sessions.service.js';
import type { ItemSelector } from './item-selector.js';
import { GameSessionsRepository } from './repositories/game-sessions.repository.js';

class InMemoryGameSessionsRepository extends GameSessionsRepository {
  sessions: GameSessionRecord[] = [];

  constructor(private readonly log: InMemoryProgressRepository) {
    super();
  }

  async create({ questions, ...data }: CreateGameSessionData) {
    const id = `session-${this.sessions.length + 1}`;
    const session: GameSessionRecord = {
      ...data,
      id,
      status: 'ACTIVE',
      startedAt: new Date(),
      completedAt: null,
      score: 0,
      correctCount: 0,
      incorrectCount: 0,
      maxCombo: 0,
      attempts: [],
      questions: questions.map((question) => ({
        ...question,
        id: `${id}-q${question.position}`,
        answeredAt: null,
        isCorrect: null,
      })),
    };
    this.sessions.push(session);
    return session;
  }
  async findOwned(id: string, userId: string) {
    const session = this.sessions.find((s) => s.id === id && s.userId === userId);
    if (!session) return null;
    const attempts = this.log.attempts.filter((a) => a.sessionId === id);
    return structuredClone({ ...session, attempts });
  }
  async markAnswered(questionId: string, isCorrect: boolean, answeredAt: Date) {
    const question = this.sessions.flatMap((s) => s.questions).find((q) => q.id === questionId);
    if (!question || question.answeredAt) return false;
    Object.assign(question, { isCorrect, answeredAt });
    return true;
  }
  async complete(id: string, data: CompleteSessionData) {
    const session = this.sessions.find((s) => s.id === id);
    if (!session || session.status !== 'ACTIVE') return false;
    Object.assign(session, data, { status: 'COMPLETED' });
    return true;
  }
}

class InMemoryProgressRepository extends ProgressRepository {
  rows = new Map<string, ItemProgress>();
  attempts: Attempt[] = [];

  async findOne(userId: string, itemId: string) {
    return this.rows.get(`${userId}/${itemId}`) ?? null;
  }
  async findMany() {
    return [...this.rows.values()];
  }
  async findDueItemIds() {
    return [];
  }
  async save(progress: ItemProgress) {
    this.rows.set(`${progress.userId}/${progress.itemId}`, progress);
    return progress;
  }
  async findAttemptByKey(userId: string, key: string) {
    return this.attempts.find((a) => a.userId === userId && a.idempotencyKey === key) ?? null;
  }
  async createAttempt(data: CreateAttemptData) {
    const attempt: Attempt = { ...data, id: `attempt-${this.attempts.length + 1}`, createdAt: new Date() };
    this.attempts.push(attempt);
    return attempt;
  }
}

const kana = (id: string, text: string, romanization: string): PracticeItem => ({
  id,
  setId: 'set-1',
  languageCode: 'ja',
  type: 'CHARACTER',
  text,
  reading: null,
  romanization,
  acceptedAnswers: [],
  meaning: null,
  emoji: null,
  attributes: null,
  sortOrder: 0,
  confusableIds: [],
});

const pool = [kana('a', 'あ', 'a'), kana('i', 'い', 'i'), kana('u', 'う', 'u'), kana('e', 'え', 'e')];
const KEY = (n: number) => `00000000-0000-4000-8000-${String(n).padStart(12, '0')}`;

describe('GameSessionsService', () => {
  let sessions: InMemoryGameSessionsRepository;
  let progress: InMemoryProgressRepository;
  let service: GameSessionsService;

  beforeEach(() => {
    progress = new InMemoryProgressRepository();
    sessions = new InMemoryGameSessionsRepository(progress);
    const selector = { select: async () => ({ items: pool, pool }) } as unknown as ItemSelector;
    const transaction = { run: <T>(fn: () => Promise<T>) => fn() } as unknown as TransactionHost;
    service = new GameSessionsService(
      sessions,
      selector,
      new ProgressService(progress, new SimpleIntervalScheduler()),
      progress,
      transaction,
      { next: () => 0.5 },
    );
  });

  const start = (gameType: 'MULTIPLE_CHOICE' | 'FLASHCARD' | 'MATCHING' | 'TYPING' = 'MULTIPLE_CHOICE') =>
    service.create('user-1', { gameType, language: 'ja', source: 'SET', setId: 'set-1' }, 'en');

  const options = (session: GameSessionRecord, index: number) => {
    const question = session.questions[index];
    const wrong = question.options?.find((option) => option.id !== question.correctOptionId);
    return { question, right: question.correctOptionId ?? '', wrong: wrong?.id ?? '' };
  };

  it('never sends the right answer of an unanswered question', async () => {
    const view = await start();
    expect(view.questions).toHaveLength(4);
    for (const question of view.questions) {
      expect(question.reveal).toBeNull();
      expect(question.result).toBeNull();
      expect(JSON.stringify(question)).not.toContain('itemId');
      expect(JSON.stringify(question)).not.toContain('correctOptionId');
    }
  });

  it('grades a choice, records the attempt and updates progress', async () => {
    await start();
    const { question, wrong } = options(sessions.sessions[0], 0);

    const result = await service.answer('user-1', 'session-1', { questionId: question.id, idempotencyKey: KEY(1), optionId: wrong });

    expect(result).toMatchObject({ isCorrect: false, correctOptionId: question.correctOptionId, combo: 0 });
    expect(progress.attempts).toHaveLength(1);
    expect(progress.attempts[0]).toMatchObject({ itemId: question.itemId, isCorrect: false, rating: 'AGAIN' });
    expect(progress.attempts[0].confusedWithItemId).toBe(question.options?.find((o) => o.id === wrong)?.itemId);
    expect(await progress.findOne('user-1', question.itemId)).toMatchObject({ attemptCount: 1, correctCount: 0, intervalMinutes: 10 });
  });

  it('counts consecutive correct answers as a combo', async () => {
    await start();
    for (const index of [0, 1]) {
      const { question, right } = options(sessions.sessions[0], index);
      const result = await service.answer('user-1', 'session-1', { questionId: question.id, idempotencyKey: KEY(index), optionId: right });
      expect(result.combo).toBe(index + 1);
    }
  });

  it('returns the first result again when the same request is retried', async () => {
    await start();
    const { question, right } = options(sessions.sessions[0], 0);
    const body = { questionId: question.id, idempotencyKey: KEY(7), optionId: right };

    const first = await service.answer('user-1', 'session-1', body);
    const retried = await service.answer('user-1', 'session-1', body);

    expect(retried).toEqual(first);
    expect(progress.attempts).toHaveLength(1);
  });

  it('refuses a second, different answer to the same question', async () => {
    await start();
    const { question, right, wrong } = options(sessions.sessions[0], 0);
    await service.answer('user-1', 'session-1', { questionId: question.id, idempotencyKey: KEY(1), optionId: right });

    await expect(
      service.answer('user-1', 'session-1', { questionId: question.id, idempotencyKey: KEY(2), optionId: wrong }),
    ).rejects.toMatchObject({ response: { code: 'QUESTION_ALREADY_ANSWERED' } });
  });

  it("hides other users' sessions behind the same 404 as missing ones", async () => {
    await start();
    const { question, right } = options(sessions.sessions[0], 0);

    await expect(service.get('user-2', 'session-1')).rejects.toMatchObject({ response: { code: 'GAME_SESSION_NOT_FOUND' } });
    await expect(
      service.answer('user-2', 'session-1', { questionId: question.id, idempotencyKey: KEY(1), optionId: right }),
    ).rejects.toMatchObject({ response: { code: 'GAME_SESSION_NOT_FOUND' } });
  });

  it('rejects options that are not part of the question', async () => {
    await start();
    const { question } = options(sessions.sessions[0], 0);
    await expect(
      service.answer('user-1', 'session-1', { questionId: question.id, idempotencyKey: KEY(1), optionId: '99' }),
    ).rejects.toMatchObject({ response: { code: 'INVALID_ANSWER' } });
  });

  it('rejects answers after the session expired', async () => {
    await start();
    sessions.sessions[0].expiresAt = new Date(Date.now() - 1000);
    const { question, right } = options(sessions.sessions[0], 0);

    await expect(
      service.answer('user-1', 'session-1', { questionId: question.id, idempotencyKey: KEY(1), optionId: right }),
    ).rejects.toMatchObject({ response: { code: 'GAME_SESSION_EXPIRED', statusCode: 410 } });
    expect((await service.get('user-1', 'session-1')).status).toBe('EXPIRED');
  });

  it('uses the flashcard rating to schedule the next review', async () => {
    const view = await start('FLASHCARD');
    expect(view.questions[0].reveal).not.toBeNull();

    const question = sessions.sessions[0].questions[0];
    const result = await service.answer('user-1', 'session-1', { questionId: question.id, idempotencyKey: KEY(1), rating: 'EASY' });

    expect(result.isCorrect).toBe(true);
    expect(await progress.findOne('user-1', question.itemId)).toMatchObject({ intervalMinutes: 7 * 24 * 60 });
    await expect(
      service.answer('user-1', 'session-1', { questionId: sessions.sessions[0].questions[1].id, idempotencyKey: KEY(2) }),
    ).rejects.toMatchObject({ response: { code: 'INVALID_ANSWER' } });
  });

  it('scores the session on the server and completes it only once', async () => {
    await start();
    const { question, right } = options(sessions.sessions[0], 0);
    await service.answer('user-1', 'session-1', { questionId: question.id, idempotencyKey: KEY(1), optionId: right });

    const summary = await service.complete('user-1', 'session-1');
    expect(summary).toMatchObject({
      score: 10,
      correctCount: 1,
      incorrectCount: 0,
      mistakeCount: 0,
      answeredCount: 1,
      questionCount: 4,
      maxCombo: 1,
    });
    expect(await service.complete('user-1', 'session-1')).toEqual(summary);

    const next = options(sessions.sessions[0], 1);
    await expect(
      service.answer('user-1', 'session-1', { questionId: next.question.id, idempotencyKey: KEY(2), optionId: next.right }),
    ).rejects.toMatchObject({ response: { code: 'GAME_SESSION_COMPLETED' } });
  });

  it('keeps a matching pair open after a wrong card and counts it as a mistake', async () => {
    const view = await start('MATCHING');
    expect(view.questions).toHaveLength(4);
    expect(new Set(view.questions.map((q) => JSON.stringify(q.options))).size).toBe(1);

    const { question, right, wrong } = options(sessions.sessions[0], 0);
    const miss = await service.answer('user-1', 'session-1', { questionId: question.id, idempotencyKey: KEY(1), optionId: wrong });
    expect(miss).toMatchObject({ isCorrect: false, questionCompleted: false, correctOptionId: null, reveal: null });

    const hit = await service.answer('user-1', 'session-1', { questionId: question.id, idempotencyKey: KEY(2), optionId: right });
    expect(hit).toMatchObject({ isCorrect: true, questionCompleted: true, correctOptionId: right, combo: 1 });
    expect(sessions.sessions[0].questions[0]).toMatchObject({ isCorrect: false });

    const second = options(sessions.sessions[0], 1);
    await service.answer('user-1', 'session-1', { questionId: second.question.id, idempotencyKey: KEY(3), optionId: second.right });

    const summary = await service.complete('user-1', 'session-1');
    expect(summary).toMatchObject({ answeredCount: 2, correctCount: 1, incorrectCount: 1, mistakeCount: 1, maxCombo: 2, score: 10 + 12 });
  });

  it('grades a typed answer on the server, ignoring case and spacing', async () => {
    await start('TYPING');
    const question = sessions.sessions[0].questions[0];
    expect(question.acceptedAnswers).toEqual([question.reveal.romanization]);

    const result = await service.answer('user-1', 'session-1', {
      questionId: question.id,
      idempotencyKey: KEY(1),
      text: ` ${question.reveal.romanization?.toUpperCase()} `,
    });
    expect(result).toMatchObject({ isCorrect: true, questionCompleted: true, reveal: question.reveal });

    const next = sessions.sessions[0].questions[1];
    const skipped = await service.answer('user-1', 'session-1', { questionId: next.id, idempotencyKey: KEY(2), text: '' });
    expect(skipped.isCorrect).toBe(false);
    expect(progress.attempts[1]).toMatchObject({ givenAnswer: null, rating: 'AGAIN' });

    const view = await service.get('user-1', 'session-1');
    expect(JSON.stringify(view.questions[2])).not.toContain('acceptedAnswers');
    expect(view.questions[0].result?.givenAnswer).toBe(question.reveal.romanization?.toUpperCase());
  });
});
