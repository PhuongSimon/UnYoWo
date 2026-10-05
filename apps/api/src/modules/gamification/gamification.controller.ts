import { Controller, Get, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/current-user.decorator.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import type { AccessTokenPayload } from '../auth/services/token.service.js';
import { GamificationService } from './gamification.service.js';

@UseGuards(JwtAuthGuard)
@Controller()
export class GamificationController {
  constructor(private readonly gamification: GamificationService) {}

  /** XP, streak and today's goals: what the header and dashboard show. */
  @Get('progress/summary')
  summary(@CurrentUser() user: AccessTokenPayload) {
    return this.gamification.summary(user.sub, new Date());
  }

  @Get('achievements')
  achievements(@CurrentUser() user: AccessTokenPayload) {
    return this.gamification.achievements(user.sub);
  }
}
