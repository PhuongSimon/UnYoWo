import type { GameType } from '../../../generated/prisma/enums.js';
import type {
  CompleteSessionData,
  CreateGameSessionData,
  GameSessionRecord,
} from '../entities/game-session.entity.js';

export abstract class GameSessionsRepository {
  abstract create(data: CreateGameSessionData): Promise<GameSessionRecord>;
  /** Null when the session does not exist or belongs to another user. */
  abstract findOwned(id: string, userId: string): Promise<GameSessionRecord | null>;
  /** Marks the question answered unless it already was; false means someone else got there first. */
  abstract markAnswered(questionId: string, isCorrect: boolean, answeredAt: Date): Promise<boolean>;
  /** Completes an ACTIVE session; false if it was already completed. */
  abstract complete(id: string, data: CompleteSessionData): Promise<boolean>;
  /** Starts the countdown of a timed session unless it already runs; returns when it started. */
  abstract startTimer(id: string, at: Date): Promise<Date>;
  /** Best completed score on the same game, language and set, not counting `excludeId` */
  abstract findBestScore(
    userId: string,
    game: { gameType: GameType; languageCode: string; setId: string | null },
    excludeId: string,
  ): Promise<number | null>;
}
