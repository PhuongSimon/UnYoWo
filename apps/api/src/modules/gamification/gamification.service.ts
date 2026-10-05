import { Injectable } from '@nestjs/common';
import type { XpSource } from '../../generated/prisma/enums.js';
import { UsersRepository } from '../users/repositories/users.repository.js';
import { ACHIEVEMENTS, isReached, type AchievementContext } from './achievements.js';
import { localDate, type LocalDate } from './calendar.js';
import { DAILY_GOALS, evaluateGoals, focusLanguage } from './daily-goals.js';
import {
  EMPTY_STATS,
  type AchievementView,
  type DailyGoalView,
  type ProgressSummaryView,
  type SessionRewards,
  type UserStatsRecord,
} from './entities/gamification.entity.js';
import { GamificationRepository } from './repositories/gamification.repository.js';
import { displayedStreak, recordStudyDay } from './streak.js';
import { XP_POLICY } from './xp-policy.js';

export interface AnswerRecorded {
  userId: string;
  languageCode: string;
  sessionId: string;
  questionId: string;
  isCorrect: boolean;
  /** False for a wrong matching pair, which stays open */
  questionCompleted: boolean;
  /** First answer ever on this item */
  isNewItem: boolean;
  now: Date;
}

export interface SessionCompleted {
  userId: string;
  languageCode: string;
  sessionId: string;
  answeredCount: number;
  questionCount: number;
  mistakeCount: number;
  now: Date;
}

/**
 * XP, streaks, daily goals and achievements. Games only report what happened
 * (an answer, a finished session); every reward is decided here.
 */
@Injectable()
export class GamificationService {
  constructor(
    private readonly records: GamificationRepository,
    private readonly users: UsersRepository,
  ) {}

  /** Call inside the answer transaction. Returns the XP the answer itself earned. */
  async recordAnswer(event: AnswerRecorded): Promise<{ xpGained: number }> {
    const { userId, languageCode, isCorrect, now } = event;
    const today = await this.today(userId, now);
    const stats = (await this.records.findStats(userId)) ?? EMPTY_STATS;

    const streak = recordStudyDay(
      { current: stats.currentStreak, longest: stats.longestStreak, lastStudyDate: stats.lastStudyDate },
      today,
    );
    const answerStreak = isCorrect ? stats.answerStreak + 1 : 0;
    await this.records.saveStreaks(userId, {
      currentStreak: streak.current,
      longestStreak: streak.longest,
      lastStudyDate: streak.lastStudyDate,
      answerStreak,
      bestAnswerStreak: Math.max(stats.bestAnswerStreak, answerStreak),
    });

    await this.records.incrementActivity(userId, today, languageCode, {
      attempts: 1,
      correct: isCorrect ? 1 : 0,
      newItems: event.isNewItem ? 1 : 0,
      reviews: event.isNewItem ? 0 : 1,
    });

    // Keyed by question: answering it again, or replaying the request, cannot earn twice.
    const xpGained =
      isCorrect && event.questionCompleted
        ? await this.award(userId, today, {
            amount: XP_POLICY.correctAnswer,
            source: 'ANSWER',
            sourceKey: event.questionId,
            sessionId: event.sessionId,
            languageCode,
          })
        : 0;

    await this.claimGoals(userId, today, event.sessionId, languageCode);
    return { xpGained };
  }

  /** Call once, when the session turns COMPLETED. */
  async recordSessionCompleted(event: SessionCompleted): Promise<void> {
    const { userId, languageCode, sessionId } = event;
    const today = await this.today(userId, event.now);

    await this.records.incrementActivity(userId, today, languageCode, { gamesCompleted: 1 });
    await this.records.addToStats(userId, { gamesCompleted: 1 });

    // Opening a round and finishing it straight away must not pay out.
    if (event.answeredCount >= Math.min(XP_POLICY.minAnswersForSessionBonus, event.questionCount)) {
      await this.award(userId, today, { amount: XP_POLICY.sessionComplete, source: 'SESSION_COMPLETE', sourceKey: sessionId, sessionId, languageCode });
    }
    const perfect =
      event.questionCount >= XP_POLICY.minQuestionsForPerfect &&
      event.answeredCount === event.questionCount &&
      event.mistakeCount === 0;
    if (perfect) {
      await this.award(userId, today, { amount: XP_POLICY.perfectSession, source: 'PERFECT_SESSION', sourceKey: sessionId, sessionId, languageCode });
    }

    await this.claimGoals(userId, today, sessionId, languageCode);
    await this.unlockAchievements(userId, sessionId);
  }

  async rewardsFor(userId: string, sessionId: string, now: Date): Promise<SessionRewards> {
    const events = await this.records.findSessionXpEvents(userId, sessionId);
    const unlocked = await this.records.findAchievements(userId);
    const stats = (await this.records.findStats(userId)) ?? EMPTY_STATS;

    const breakdown = new Map<XpSource, { source: XpSource; amount: number; count: number }>();
    for (const { source, amount } of events) {
      const entry = breakdown.get(source) ?? { source, amount: 0, count: 0 };
      breakdown.set(source, { source, amount: entry.amount + amount, count: entry.count + 1 });
    }

    return {
      xp: events.reduce((sum, event) => sum + event.amount, 0),
      breakdown: [...breakdown.values()],
      goals: events.filter((event) => event.source === 'DAILY_GOAL').map((event) => event.sourceKey.split(':')[1]),
      achievements: unlocked.filter((achievement) => achievement.sessionId === sessionId).map((achievement) => achievement.key),
      streak: displayedStreak(this.streakOf(stats), await this.today(userId, now)),
      totalXp: stats.totalXp,
    };
  }

  async summary(userId: string, now: Date): Promise<ProgressSummaryView> {
    const today = await this.today(userId, now);
    const stats = (await this.records.findStats(userId)) ?? EMPTY_STATS;
    const activity = await this.records.findActivity(userId, today);

    return {
      totalXp: stats.totalXp,
      streak: {
        current: displayedStreak(this.streakOf(stats), today),
        longest: stats.longestStreak,
        studiedToday: stats.lastStudyDate === today,
      },
      today: {
        xp: activity.reduce((sum, row) => sum + row.xp, 0),
        answers: activity.reduce((sum, row) => sum + row.attempts, 0),
      },
      dailyGoals: await this.goals(userId, today),
    };
  }

  async achievements(userId: string): Promise<AchievementView[]> {
    const context = await this.achievementContext(userId);
    const unlocked = new Map((await this.records.findAchievements(userId)).map((a) => [a.key, a.unlockedAt]));

    const views: AchievementView[] = [];
    for (const definition of ACHIEVEMENTS) {
      const { current, target } = await definition.progress(context);
      const unlockedAt = unlocked.get(definition.key) ?? null;
      // Once unlocked, an achievement stays complete even if its target grows (e.g. a new language).
      views.push({ key: definition.key, current: unlockedAt ? target : current, target, unlockedAt });
    }
    return views;
  }

  private async award(
    userId: string,
    today: LocalDate,
    award: { amount: number; source: XpSource; sourceKey: string; sessionId: string | null; languageCode: string },
  ): Promise<number> {
    if (!(await this.records.insertXpEvent({ userId, ...award }))) return 0;
    await this.records.addToStats(userId, { totalXp: award.amount });
    await this.records.incrementActivity(userId, today, award.languageCode, { xp: award.amount });
    return award.amount;
  }

  private async goals(userId: string, today: LocalDate): Promise<DailyGoalView[]> {
    const todayRows = await this.records.findActivity(userId, today);
    const previous = await this.records.findPreviousStudyDay(userId, today);
    const claimed = await this.records.findClaimedGoals(userId, today);
    return evaluateGoals(todayRows, focusLanguage(previous, todayRows), claimed);
  }

  /** Pays out every goal that reached its target today and has not been paid yet. */
  private async claimGoals(userId: string, today: LocalDate, sessionId: string, languageCode: string) {
    const claimed = await this.records.findClaimedGoals(userId, today);
    for (const goal of await this.goals(userId, today)) {
      if (!goal.completed || claimed.has(goal.key)) continue;
      const xp = DAILY_GOALS.find((definition) => definition.key === goal.key)?.xp ?? 0;
      await this.award(userId, today, {
        amount: xp,
        source: 'DAILY_GOAL',
        sourceKey: `${today}:${goal.key}`,
        sessionId,
        languageCode: goal.languageCode ?? languageCode,
      });
    }
  }

  private async unlockAchievements(userId: string, sessionId: string) {
    const unlocked = new Set((await this.records.findAchievements(userId)).map((achievement) => achievement.key));
    const context = await this.achievementContext(userId);

    const reached: string[] = [];
    for (const definition of ACHIEVEMENTS) {
      if (!unlocked.has(definition.key) && isReached(await definition.progress(context))) reached.push(definition.key);
    }
    if (reached.length > 0) await this.records.unlockAchievements(userId, reached, sessionId);
  }

  private async achievementContext(userId: string): Promise<AchievementContext> {
    const stats = (await this.records.findStats(userId)) ?? EMPTY_STATS;
    return {
      stats,
      setCompletion: (languageCode, slugs, criterion) => this.records.setCompletion(userId, languageCode, slugs, criterion),
      languages: () => this.records.countLanguages(userId),
    };
  }

  private streakOf(stats: UserStatsRecord) {
    return { current: stats.currentStreak, longest: stats.longestStreak, lastStudyDate: stats.lastStudyDate };
  }

  private async today(userId: string, now: Date): Promise<LocalDate> {
    const user = await this.users.findById(userId);
    return localDate(now, user?.timezone ?? 'UTC');
  }
}
