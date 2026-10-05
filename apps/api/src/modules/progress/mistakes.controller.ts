import { Controller, Get, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/current-user.decorator.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import type { AccessTokenPayload } from '../auth/services/token.service.js';
import { MistakesService } from './mistakes.service.js';

@UseGuards(JwtAuthGuard)
@Controller('mistakes')
export class MistakesController {
  constructor(private readonly mistakes: MistakesService) {}

  @Get()
  overview(@CurrentUser() user: AccessTokenPayload) {
    return this.mistakes.overview(user.sub, new Date());
  }
}
