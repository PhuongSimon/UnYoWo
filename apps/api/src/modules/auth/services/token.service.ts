import { createHash, randomBytes } from 'node:crypto';
import { HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ApiError } from '../../../common/api-error.js';
import { RefreshTokensRepository } from '../repositories/refresh-tokens.repository.js';

export interface AccessTokenPayload {
  sub: string;
  email: string;
}

interface ResetTokenPayload {
  sub: string;
  email: string;
  purpose: 'reset';
}

export interface ClientInfo {
  userAgent?: string;
  ipAddress?: string;
}

const sha256 = (value: string) => createHash('sha256').update(value).digest('hex');

@Injectable()
export class TokenService {
  private readonly refreshTtlDays: number;

  constructor(
    private readonly jwt: JwtService,
    private readonly refreshTokens: RefreshTokensRepository,
    private readonly config: ConfigService,
  ) {
    this.refreshTtlDays = Number(config.get('REFRESH_TOKEN_TTL_DAYS') ?? 30);
  }

  get refreshTtlMs() {
    return this.refreshTtlDays * 24 * 60 * 60 * 1000;
  }

  signAccessToken(payload: AccessTokenPayload) {
    return this.jwt.signAsync(payload);
  }

  verifyAccessToken(token: string) {
    return this.jwt.verifyAsync<AccessTokenPayload>(token);
  }

  async createRefreshToken(userId: string, client: ClientInfo) {
    const token = randomBytes(48).toString('base64url');
    await this.refreshTokens.create({
      userId,
      tokenHash: sha256(token),
      userAgent: client.userAgent?.slice(0, 255),
      ipAddress: client.ipAddress,
      expiresAt: new Date(Date.now() + this.refreshTtlMs),
    });
    return token;
  }

  /**
   * Refresh token rotation: every refresh revokes the old token and issues a new one.
   * If an already-revoked token is presented, it was probably stolen, so every
   * session of that user is revoked.
   */
  async rotateRefreshToken(token: string, client: ClientInfo) {
    const record = await this.refreshTokens.findByHash(sha256(token));
    if (!record) throw new ApiError(HttpStatus.UNAUTHORIZED, 'SESSION_EXPIRED');

    if (record.revokedAt) {
      await this.revokeAllForUser(record.userId);
      throw new ApiError(HttpStatus.UNAUTHORIZED, 'SESSION_EXPIRED');
    }
    if (record.expiresAt < new Date()) throw new ApiError(HttpStatus.UNAUTHORIZED, 'SESSION_EXPIRED');

    await this.refreshTokens.revoke(record.id);
    const newToken = await this.createRefreshToken(record.userId, client);
    return { userId: record.userId, refreshToken: newToken };
  }

  async revokeRefreshToken(token: string) {
    await this.refreshTokens.revokeByHash(sha256(token));
  }

  async revokeAllForUser(userId: string) {
    await this.refreshTokens.revokeAllForUser(userId);
  }

  signResetToken(otpId: string, email: string) {
    const payload: ResetTokenPayload = { sub: otpId, email, purpose: 'reset' };
    return this.jwt.signAsync(payload, {
      secret: this.config.getOrThrow<string>('JWT_RESET_SECRET'),
      expiresIn: '10m',
    });
  }

  async verifyResetToken(token: string) {
    try {
      const payload = await this.jwt.verifyAsync<ResetTokenPayload>(token, {
        secret: this.config.getOrThrow<string>('JWT_RESET_SECRET'),
      });
      if (payload.purpose !== 'reset') throw new Error('wrong purpose');
      return payload;
    } catch {
      throw new ApiError(HttpStatus.BAD_REQUEST, 'RESET_TOKEN_INVALID');
    }
  }
}
