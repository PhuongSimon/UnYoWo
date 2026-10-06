import { detectLanguage } from './languages.js';

describe('detectLanguage', () => {
  it.each([
    ['안녕하세요', 'ko'],
    ['こんにちは', 'ja'],
    ['先生', 'ja'],
    ['Tôi là sinh viên', 'vi'],
    ['đi', 'vi'],
    ['Ich heiße Müller', 'de'],
    ['Guten Tag', 'en'],
    ['hello world', 'en'],
  ])('%s → %s', (text, language) => {
    expect(detectLanguage(text)).toBe(language);
  });
});
