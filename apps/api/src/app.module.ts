import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { validateEnv } from './config/env.validation.js';
import { PrismaModule } from './infrastructure/database/prisma.module.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { ContentModule } from './modules/content/content.module.js';
import { GamesModule } from './modules/games/games.module.js';
import { DashboardModule } from './modules/dashboard/dashboard.module.js';
import { GamificationModule } from './modules/gamification/gamification.module.js';
import { ProgressModule } from './modules/progress/progress.module.js';
import { HealthModule } from './modules/health/health.module.js';
import { TranslationModule } from './modules/translation/translation.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validate: validateEnv }),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 100 }]),
    PrismaModule,
    HealthModule,
    AuthModule,
    ContentModule,
    GamesModule,
    ProgressModule,
    GamificationModule,
    DashboardModule,
    TranslationModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
