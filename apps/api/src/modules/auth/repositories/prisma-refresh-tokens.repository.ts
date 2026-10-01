import { Injectable } from '@nestjs/common';
import { TransactionHost } from '../../../infrastructure/database/transaction-host.js';
import type { CreateRefreshTokenData, RefreshToken } from '../entities/refresh-token.entity.js';
import { RefreshTokensRepository } from './refresh-tokens.repository.js';

@Injectable()
export class PrismaRefreshTokensRepository extends RefreshTokensRepository {
  constructor(private readonly tx: TransactionHost) {
    super();
  }

  private get db() {
    return this.tx.client;
  }

  create(data: CreateRefreshTokenData): Promise<RefreshToken> {
    return this.db.refreshToken.create({ data });
  }

  findByHash(tokenHash: string): Promise<RefreshToken | null> {
    return this.db.refreshToken.findUnique({ where: { tokenHash } });
  }

  async revoke(id: string) {
    await this.db.refreshToken.update({ where: { id }, data: { revokedAt: new Date() } });
  }

  async revokeByHash(tokenHash: string) {
    await this.db.refreshToken.updateMany({
      where: { tokenHash, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  async revokeAllForUser(userId: string) {
    await this.db.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }
}
