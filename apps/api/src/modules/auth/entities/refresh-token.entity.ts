export interface RefreshToken {
  id: string;
  userId: string;
  tokenHash: string;
  userAgent: string | null;
  ipAddress: string | null;
  expiresAt: Date;
  revokedAt: Date | null;
  createdAt: Date;
}

export interface CreateRefreshTokenData {
  userId: string;
  tokenHash: string;
  userAgent?: string;
  ipAddress?: string;
  expiresAt: Date;
}
