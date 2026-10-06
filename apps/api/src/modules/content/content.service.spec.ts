import { ApiError } from '../../common/api-error.js';
import { ContentService } from './content.service.js';
import type { LearningItemView, LearningSetSummary, SetProgress } from './entities/content.entity.js';
import { ContentRepository } from './repositories/content.repository.js';

const set = (id: string, slug: string): LearningSetSummary => ({
  id,
  languageCode: 'ja',
  slug,
  kind: 'ALPHABET',
  script: 'hiragana',
  category: null,
  level: null,
  part: null,
  topic: null,
  title: { en: slug, vi: slug },
  itemCount: 3,
  buildable: false,
});

const item = (text: string): LearningItemView => ({
  id: text,
  type: 'CHARACTER',
  text,
  reading: null,
  romanization: null,
  ipa: null,
  meaning: null,
  partOfSpeech: null,
  emoji: null,
  attributes: null,
  audioUrl: null,
  components: [],
});

class InMemoryContentRepository extends ContentRepository {
  sets = [set('s1', 'hiragana-basic'), set('s2', 'hiragana-dakuten')];
  items = ['あ', 'い', 'う'].map(item);
  progress = new Map<string, SetProgress>([['s1', { seen: 2, mastered: 1, due: 1 }]]);
  progressCalls: { userId: string; languageCode: string }[] = [];

  async findLanguages() {
    return [];
  }
  async languageExists(code: string) {
    return code === 'ja';
  }
  async findSets(languageCode: string) {
    return this.sets.filter((s) => s.languageCode === languageCode);
  }
  async findSetById(id: string) {
    return this.sets.find((s) => s.id === id) ?? null;
  }
  async findItems(_setId: string, { skip, take }: { skip: number; take: number }) {
    return { items: this.items.slice(skip, skip + take), total: this.items.length };
  }
  async findPracticeItems() {
    return [];
  }
  async lookupWords() {
    return [];
  }
  async findSources(languageCode: string) {
    return languageCode === 'ja' ? [{ id: 'jlpt-waller', name: 'JLPT', url: 'https://example.com', license: 'CC BY', attribution: 'Waller' }] : [];
  }
  async countSetProgress(userId: string, languageCode: string) {
    this.progressCalls.push({ userId, languageCode });
    return this.progress;
  }
}

describe('ContentService', () => {
  let repo: InMemoryContentRepository;
  let service: ContentService;

  beforeEach(() => {
    repo = new InMemoryContentRepository();
    service = new ContentService(repo);
  });

  it('merges the user progress into each set and fills untouched sets with zeros', async () => {
    const sets = await service.listSets('ja', 'user-1');

    expect(repo.progressCalls).toEqual([{ userId: 'user-1', languageCode: 'ja' }]);
    expect(sets.map((s) => [s.slug, s.progress])).toEqual([
      ['hiragana-basic', { seen: 2, mastered: 1, due: 1 }],
      ['hiragana-dakuten', { seen: 0, mastered: 0, due: 0 }],
    ]);
  });

  it('rejects an unknown language with a stable error code', async () => {
    await expect(service.listSets('xx', 'user-1')).rejects.toMatchObject({
      response: { code: 'LANGUAGE_NOT_FOUND', statusCode: 404 },
    });
    await expect(service.listSets('xx', 'user-1')).rejects.toBeInstanceOf(ApiError);
  });

  it('pages through the items of a set', async () => {
    const page = await service.listItems('s1', 2, 2);
    expect(page).toMatchObject({ page: 2, pageSize: 2, total: 3, set: { slug: 'hiragana-basic' } });
    expect(page.items.map((i) => i.text)).toEqual(['う']);
  });

  it('lists the data sources of a language for attribution', async () => {
    await expect(service.listSources('ja')).resolves.toEqual([expect.objectContaining({ id: 'jlpt-waller', license: 'CC BY' })]);
    await expect(service.listSources('xx')).rejects.toMatchObject({ response: { code: 'LANGUAGE_NOT_FOUND' } });
  });

  it('returns SET_NOT_FOUND for a set that does not exist', async () => {
    await expect(service.listItems('missing', 1, 50)).rejects.toMatchObject({ response: { code: 'SET_NOT_FOUND' } });
  });
});
