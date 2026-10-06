import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { UsersModule } from '../users/users.module.js';
import { GamificationController } from './gamification.controller.js';
import { GamificationService } from './gamification.service.js';
import { GamificationRepository } from './repositories/gamification.repository.js';
import { PrismaGamificationRepository } from './repositories/prisma-gamification.repository.js';

/** XP, streaks, daily goals and achievements, shared by every game. */
@Module({
  imports: [AuthModule, UsersModule],
  controllers: [GamificationController],
  providers: [GamificationService, { provide: GamificationRepository, useClass: PrismaGamificationRepository }],
  exports: [GamificationService],
})
export class GamificationModule {}
