import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/current-user.decorator.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import type { AccessTokenPayload } from '../auth/services/token.service.js';
import { ContentService } from './content.service.js';

@UseGuards(JwtAuthGuard)
@Controller('languages')
export class LanguagesController {
  constructor(private readonly content: ContentService) {}

  @Get()
  list() {
    return this.content.listLanguages();
  }

  @Get(':code/sets')
  listSets(@Param('code') code: string, @CurrentUser() user: AccessTokenPayload) {
    return this.content.listSets(code, user.sub);
  }

  /** Credits for the datasets this language's words came from */
  @Get(':code/sources')
  listSources(@Param('code') code: string) {
    return this.content.listSources(code);
  }
}
