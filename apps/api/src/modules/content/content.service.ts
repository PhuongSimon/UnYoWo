import { HttpStatus, Injectable } from '@nestjs/common';
import { ApiError } from '../../common/api-error.js';
import type { LearningItemView, LearningSetSummary, LearningSetWithProgress, Page } from './entities/content.entity.js';
import { ContentRepository } from './repositories/content.repository.js';

const NOT_STARTED = { seen: 0, mastered: 0, due: 0 };

@Injectable()
export class ContentService {
  constructor(private readonly content: ContentRepository) {}

  listLanguages() {
    return this.content.findLanguages();
  }

  async listSets(languageCode: string, userId: string): Promise<LearningSetWithProgress[]> {
    if (!(await this.content.languageExists(languageCode))) {
      throw new ApiError(HttpStatus.NOT_FOUND, 'LANGUAGE_NOT_FOUND');
    }

    const [sets, progress] = await Promise.all([
      this.content.findSets(languageCode),
      this.content.countSetProgress(userId, languageCode, new Date()),
    ]);
    return sets.map((set) => ({ ...set, progress: progress.get(set.id) ?? NOT_STARTED }));
  }

  async listSources(languageCode: string) {
    if (!(await this.content.languageExists(languageCode))) {
      throw new ApiError(HttpStatus.NOT_FOUND, 'LANGUAGE_NOT_FOUND');
    }
    return this.content.findSources(languageCode);
  }

  async listItems(setId: string, page: number, pageSize: number): Promise<{ set: LearningSetSummary } & Page<LearningItemView>> {
    const set = await this.content.findSetById(setId);
    if (!set) throw new ApiError(HttpStatus.NOT_FOUND, 'SET_NOT_FOUND');

    const { items, total } = await this.content.findItems(setId, { skip: (page - 1) * pageSize, take: pageSize });
    return { set, items, page, pageSize, total };
  }
}
