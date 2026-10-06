import { toMeaning } from './localized.js';

describe('toMeaning', () => {
  it("prefers the word's own meaning and fills missing languages from the concept", () => {
    expect(toMeaning({ vi: 'bỏ rơi' }, null)).toEqual({ vi: 'bỏ rơi' });
    expect(toMeaning({ vi: 'con chó nhỏ' }, { en: 'dog', vi: 'con chó' })).toEqual({ en: 'dog', vi: 'con chó nhỏ' });
    expect(toMeaning(null, { en: 'dog', vi: 'con chó' })).toEqual({ en: 'dog', vi: 'con chó' });
  });

  it('returns null when there is no text at all', () => {
    expect(toMeaning(null, undefined)).toBeNull();
    expect(toMeaning({ vi: '' }, null)).toBeNull();
    expect(toMeaning([], 'oops')).toBeNull();
  });
});
