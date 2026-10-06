import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { ContentService } from './content.service.js';
import { LanguagesController } from './languages.controller.js';
import { LearningSetsController } from './learning-sets.controller.js';
import { ContentRepository } from './repositories/content.repository.js';
import { PrismaContentRepository } from './repositories/prisma-content.repository.js';

/** Learning Engine (content side): languages, sets and items shared by every game. */
@Module({
  imports: [AuthModule],
  controllers: [LanguagesController, LearningSetsController],
  providers: [ContentService, { provide: ContentRepository, useClass: PrismaContentRepository }],
  exports: [ContentService, ContentRepository],
})
export class ContentModule {}
