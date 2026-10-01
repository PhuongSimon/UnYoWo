import { CanActivate, ExecutionContext, HttpStatus, Injectable } from '@nestjs/common';
import type { Request } from 'express';
import { ApiError } from '../../common/api-error.js';
import { TokenService, type AccessTokenPayload } from './services/token.service.js';

export type AuthenticatedRequest = Request & { user: AccessTokenPayload };

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly tokens: TokenService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const [scheme, token] = request.headers.authorization?.split(' ') ?? [];
    if (scheme !== 'Bearer' || !token) throw new ApiError(HttpStatus.UNAUTHORIZED, 'UNAUTHORIZED');

    try {
      request.user = await this.tokens.verifyAccessToken(token);
      return true;
    } catch {
      throw new ApiError(HttpStatus.UNAUTHORIZED, 'UNAUTHORIZED');
    }
  }
}
