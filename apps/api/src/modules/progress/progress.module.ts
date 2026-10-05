import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { MistakesController } from './mistakes.controller.js';
import { MistakesService } from './mistakes.service.js';
import { ProgressService } from './progress.service.js';
import { PrismaProgressRepository } from './repositories/prisma-progress.repository.js';
import { ProgressRepository } from './repositories/progress.repository.js';
import { ReviewScheduler } from './review-scheduler.js';
import { SimpleIntervalScheduler } from './simple-interval.scheduler.js';

/** Progress + Review engine: per-item progress, the answer log, review scheduling and mistakes. */
@Module({
  imports: [AuthModule],
  controllers: [MistakesController],
  providers: [
    ProgressService,
    MistakesService,
    { provide: ProgressRepository, useClass: PrismaProgressRepository },
    { provide: ReviewScheduler, useClass: SimpleIntervalScheduler },
  ],
  exports: [ProgressService, ProgressRepository],
})
export class ProgressModule {}
