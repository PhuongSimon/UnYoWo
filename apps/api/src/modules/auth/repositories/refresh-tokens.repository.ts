import type { CreateRefreshTokenData, RefreshToken } from '../entities/refresh-token.entity.js';

export abstract class RefreshTokensRepository {
  abstract create(data: CreateRefreshTokenData): Promise<RefreshToken>;
  abstract findByHash(tokenHash: string): Promise<RefreshToken | null>;
  abstract revoke(id: string): Promise<void>;
  abstract revokeByHash(tokenHash: string): Promise<void>;
  abstract revokeAllForUser(userId: string): Promise<void>;
}
