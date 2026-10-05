import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ApiError } from '../../common/api-error.js';
import { RequestLang, type Lang } from '../../common/lang.decorator.js';
import { CurrentUser } from '../auth/current-user.decorator.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import type { AccessTokenPayload } from '../auth/services/token.service.js';
import { CreateGameSessionDto, SubmitAnswerDto } from './dto/game-session.dto.js';
import { GameSessionsService } from './game-sessions.service.js';

const sessionIdPipe = new ParseUUIDPipe({
  exceptionFactory: () => new ApiError(HttpStatus.NOT_FOUND, 'GAME_SESSION_NOT_FOUND'),
});

// Quick games send an answer every second or two, well above the global limit.
@Throttle({ default: { limit: 300, ttl: 60_000 } })
@UseGuards(JwtAuthGuard)
@Controller('game-sessions')
export class GameSessionsController {
  constructor(private readonly sessions: GameSessionsService) {}

  @Throttle({ default: { limit: 30, ttl: 60_000 } })
  @Post()
  create(@CurrentUser() user: AccessTokenPayload, @Body() dto: CreateGameSessionDto, @RequestLang() lang: Lang) {
    return this.sessions.create(user.sub, dto, lang);
  }

  @Get(':id')
  get(@CurrentUser() user: AccessTokenPayload, @Param('id', sessionIdPipe) id: string) {
    return this.sessions.get(user.sub, id);
  }

  @Post(':id/answers')
  @HttpCode(HttpStatus.OK)
  answer(@CurrentUser() user: AccessTokenPayload, @Param('id', sessionIdPipe) id: string, @Body() dto: SubmitAnswerDto) {
    return this.sessions.answer(user.sub, id, dto);
  }

  @Post(':id/complete')
  @HttpCode(HttpStatus.OK)
  complete(@CurrentUser() user: AccessTokenPayload, @Param('id', sessionIdPipe) id: string) {
    return this.sessions.complete(user.sub, id);
  }
}
