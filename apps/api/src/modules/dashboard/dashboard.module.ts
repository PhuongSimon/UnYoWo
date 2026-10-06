import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { ContentModule } from '../content/content.module.js';
import { GamificationModule } from '../gamification/gamification.module.js';
import { DashboardController } from './dashboard.controller.js';
import { DashboardService } from './dashboard.service.js';
import { DashboardRepository } from './repositories/dashboard.repository.js';
import { PrismaDashboardRepository } from './repositories/prisma-dashboard.repository.js';

/** Read-only overview for the home screen, composed from the other engines. */
@Module({
  imports: [AuthModule, ContentModule, GamificationModule],
  controllers: [DashboardController],
  providers: [DashboardService, { provide: DashboardRepository, useClass: PrismaDashboardRepository }],
})
export class DashboardModule {}
