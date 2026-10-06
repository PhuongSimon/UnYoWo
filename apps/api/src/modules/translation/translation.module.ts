import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module.js';
import { ContentModule } from '../content/content.module.js';
import { buildTranslationProviders, TRANSLATION_PROVIDERS } from './providers/build-providers.js';
import { PrismaTranslationCacheRepository } from './repositories/prisma-translation-cache.repository.js';
import { TranslationCacheRepository } from './repositories/translation-cache.repository.js';
import { TranslationController } from './translation.controller.js';
import { TranslationService } from './translation.service.js';

/** Machine translation between Vietnamese and the study languages, plus lookups in the word lists. */
@Module({
  imports: [AuthModule, ContentModule],
  controllers: [TranslationController],
  providers: [
    TranslationService,
    { provide: TranslationCacheRepository, useClass: PrismaTranslationCacheRepository },
    { provide: TRANSLATION_PROVIDERS, useFactory: buildTranslationProviders, inject: [ConfigService] },
  ],
})
export class TranslationModule {}
