import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { ContentModule } from '../content/content.module.js';
import { GamificationModule } from '../gamification/gamification.module.js';
import { ProgressModule } from '../progress/progress.module.js';
import { GameSessionsController } from './game-sessions.controller.js';
import { GameSessionsService } from './game-sessions.service.js';
import { ItemSelector } from './item-selector.js';
import { Random } from './random.js';
import { GameSessionsRepository } from './repositories/game-sessions.repository.js';
import { PrismaGameSessionsRepository } from './repositories/prisma-game-sessions.repository.js';

/** Game engine: sessions, question generation and grading on top of the content and progress engines. */
@Module({
  imports: [AuthModule, ContentModule, ProgressModule, GamificationModule],
  controllers: [GameSessionsController],
  providers: [
    GameSessionsService,
    ItemSelector,
    Random,
    { provide: GameSessionsRepository, useClass: PrismaGameSessionsRepository },
  ],
})
export class GamesModule {}
