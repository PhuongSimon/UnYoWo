import type { UsersRepository } from '../users/repositories/users.repository.js';
import type { LocalDate } from './calendar.js';
import {
  EMPTY_STATS,
  type ActivityIncrement,
  type DayActivity,
  type StreakFields,
  type UnlockedAchievement,
  type UserStatsRecord,
  type XpAward,
} from './entities/gamification.entity.js';
import { GamificationService, type AnswerRecorded } from './gamification.service.js';
import { GamificationRepository } from './repositories/gamification.repository.js';

class InMemoryGamificationRepository extends GamificationRepository {
  stats: UserStatsRecord | null = null;
  activity = new Map<string, DayActivity>();
  xp: (XpAward & { date: number })[] = [];
  unlocked: UnlockedAchievement[] = [];
  hiraganaDone = 0;

  async findStats() {
    return this.stats;
  }
  async saveStreaks(_userId: string, fields: StreakFields) {
    this.stats = { ...(this.stats ?? EMPTY_STATS), ...fields };
  }
  async addToStats(_userId: string, increment: { totalXp?: number; gamesCompleted?: number }) {
    const stats = this.stats ?? EMPTY_STATS;
    this.stats = {
      ...stats,
      totalXp: stats.totalXp + (increment.totalXp ?? 0),
      gamesCompleted: stats.gamesCompleted + (increment.gamesCompleted ?? 0),
    };
  }
  async incrementActivity(_userId: string, date: LocalDate, languageCode: string, increment: ActivityIncrement) {
    const key = `${date}/${languageCode}`;
    const row = this.activity.get(key) ?? { languageCode, xp: 0, attempts: 0, correct: 0, newItems: 0, reviews: 0, gamesCompleted: 0 };
    for (const [field, value] of Object.entries(increment) as [keyof ActivityIncrement, number][]) row[field] += value;
    this.activity.set(key, row);
  }
  async findActivity(_userId: string, date: LocalDate) {
    return [...this.activity].filter(([key]) => key.startsWith(`${date}/`)).map(([, row]) => row);
  }
  async findPreviousStudyDay() {
    return [];
  }
  async insertXpEvent(award: XpAward) {
    if (this.xp.some((event) => event.source === award.source && event.sourceKey === award.sourceKey)) return false;
    this.xp.push({ ...award, date: Date.now() });
    return true;
  }
  async findSessionXpEvents(_userId: string, sessionId: string) {
    return this.xp.filter((event) => event.sessionId === sessionId);
  }
  async findClaimedGoals(_userId: string, date: LocalDate) {
    return new Set(
      this.xp
        .filter((event) => event.source === 'DAILY_GOAL' && event.sourceKey.startsWith(`${date}:`))
        .map((event) => event.sourceKey.slice(date.length + 1)),
    );
  }
  async findAchievements() {
    return this.unlocked;
  }
  async unlockAchievements(_userId: string, keys: string[], sessionId: string | null) {
    this.unlocked.push(...keys.map((key) => ({ key, sessionId, unlockedAt: new Date() })));
  }
  async setCompletion(_userId: string, languageCode: string, slugs: string[]) {
    return languageCode === 'ja' && slugs.length === 1 && slugs[0] === 'hiragana-basic'
      ? { done: this.hiraganaDone, total: 46 }
      : { done: 0, total: 10 };
  }
  async countLanguages() {
    return { studied: 1, available: 4 };
  }
}

// 18:30 UTC on Oct 4 is already Oct 5 in Ho Chi Minh City.
const NOW = new Date('2026-10-04T18:30:00Z');

describe('GamificationService', () => {
  let records: InMemoryGamificationRepository;
  let service: GamificationService;

  beforeEach(() => {
    records = new InMemoryGamificationRepository();
    const users = { findById: async () => ({ timezone: 'Asia/Ho_Chi_Minh' }) } as unknown as UsersRepository;
    service = new GamificationService(records, users);
  });

  const answer = (overrides: Partial<AnswerRecorded> = {}) =>
    service.recordAnswer({
      userId: 'u1',
      languageCode: 'ja',
      sessionId: 's1',
      questionId: 'q1',
      isCorrect: true,
      questionCompleted: true,
      isNewItem: true,
      now: NOW,
      ...overrides,
    });

  const complete = (overrides: Partial<{ answeredCount: number; questionCount: number; mistakeCount: number }> = {}) =>
    service.recordSessionCompleted({
      userId: 'u1',
      languageCode: 'ja',
      sessionId: 's1',
      answeredCount: 10,
      questionCount: 10,
      mistakeCount: 1,
      now: NOW,
      ...overrides,
    });

  it('gives 5 XP for a right answer, once per question', async () => {
    expect(await answer()).toEqual({ xpGained: 5 });
    expect(await answer()).toEqual({ xpGained: 0 });
    expect(await answer({ questionId: 'q2', isCorrect: false })).toEqual({ xpGained: 0 });
    expect(await answer({ questionId: 'q3', questionCompleted: false, isCorrect: false })).toEqual({ xpGained: 0 });

    expect(records.stats?.totalXp).toBe(5);
    expect(records.activity.get('2026-10-05/ja')).toMatchObject({ xp: 5, attempts: 4, correct: 2, newItems: 4 });
  });

  it('counts the study day in the user timezone', async () => {
    await answer();
    expect(records.stats).toMatchObject({ currentStreak: 1, longestStreak: 1, lastStudyDate: '2026-10-05' });
  });

  it('tracks correct answers in a row across sessions', async () => {
    for (let i = 0; i < 3; i++) await answer({ questionId: `q${i}` });
    await answer({ questionId: 'wrong', isCorrect: false });
    await answer({ questionId: 'again' });
    expect(records.stats).toMatchObject({ answerStreak: 1, bestAnswerStreak: 3 });
  });

  it('pays the completion bonus only for a real round, and the perfect bonus for no mistakes', async () => {
    await complete({ answeredCount: 1, questionCount: 10 });
    expect(records.xp.map((event) => event.source)).not.toContain('SESSION_COMPLETE');

    records = new InMemoryGamificationRepository();
    service = new GamificationService(records, { findById: async () => ({ timezone: 'UTC' }) } as unknown as UsersRepository);
    await complete({ mistakeCount: 0 });
    expect(records.xp.filter((event) => event.source !== 'DAILY_GOAL').map(({ source, amount }) => [source, amount])).toEqual([
      ['SESSION_COMPLETE', 20],
      ['PERFECT_SESSION', 30],
    ]);
  });

  it('pays a daily goal once, when it is reached', async () => {
    await complete();
    await complete();
    const goals = records.xp.filter((event) => event.source === 'DAILY_GOAL');
    expect(goals).toEqual([expect.objectContaining({ sourceKey: '2026-10-05:PLAY_GAME', amount: 20, sessionId: 's1' })]);
  });

  it('unlocks reached achievements and credits them to the session', async () => {
    records.hiraganaDone = 46;
    await complete();

    expect(records.unlocked.map((achievement) => achievement.key).sort()).toEqual(['FIRST_STEPS', 'HIRAGANA_BEGINNER']);
    const rewards = await service.rewardsFor('u1', 's1', NOW);
    expect(rewards).toMatchObject({ achievements: expect.arrayContaining(['FIRST_STEPS', 'HIRAGANA_BEGINNER']), goals: ['PLAY_GAME'] });
    expect(rewards.xp).toBe(rewards.breakdown.reduce((sum, entry) => sum + entry.amount, 0));
  });

  it('reports progress towards every achievement', async () => {
    records.hiraganaDone = 20;
    const views = await service.achievements('u1');
    expect(views.find((view) => view.key === 'HIRAGANA_BEGINNER')).toMatchObject({ current: 20, target: 46, unlockedAt: null });
    expect(views.find((view) => view.key === 'POLYGLOT')).toMatchObject({ current: 1, target: 4 });
  });

  it('summarises XP, streak and goals for the dashboard', async () => {
    await answer();
    const summary = await service.summary('u1', NOW);
    expect(summary).toMatchObject({ totalXp: 5, streak: { current: 1, studiedToday: true }, today: { xp: 5, answers: 1 } });
    expect(summary.dailyGoals.map((goal) => goal.key)).toContain('PRACTICE_LANGUAGE');
  });
});
