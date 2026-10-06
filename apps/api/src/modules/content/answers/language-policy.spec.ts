import {
  isAcceptedAnswer,
  isAcceptedTypedAnswer,
  japanesePolicy,
  koreanPolicy,
  languagePolicy,
  latinPolicy,
} from './language-policy.js';

describe('language policies', () => {
  it('ignores case and extra spaces for Latin answers', () => {
    expect(isAcceptedAnswer('  Apple ', ['apple'], latinPolicy)).toBe(true);
    expect(isAcceptedAnswer('APFEL', ['Apfel'], languagePolicy('de'))).toBe(true);
    expect(isAcceptedAnswer('thank   you', ['thank you'], latinPolicy)).toBe(true);
  });

  it('accepts any listed romanization', () => {
    expect(isAcceptedAnswer('SI', ['shi', 'si'], latinPolicy)).toBe(true);
    expect(isAcceptedAnswer('su', ['shi', 'si'], latinPolicy)).toBe(false);
  });

  it('keeps German umlauts significant', () => {
    expect(isAcceptedAnswer('grun', ['grün'], languagePolicy('de'))).toBe(false);
    expect(isAcceptedAnswer('über', ['über'], languagePolicy('de'))).toBe(true);
  });

  it('folds half-width katakana but never treats hiragana as katakana', () => {
    expect(isAcceptedAnswer('ｶ', ['カ'], japanesePolicy)).toBe(true);
    expect(isAcceptedAnswer('か', ['カ'], japanesePolicy)).toBe(false);
    expect(isAcceptedAnswer('さくら ', ['さくら'], japanesePolicy)).toBe(true);
    expect(isAcceptedAnswer('おとこ　の ひと', ['おとこのひと'], japanesePolicy)).toBe(true);
  });

  it('composes decomposed Hangul into syllable blocks', () => {
    expect(isAcceptedAnswer('가', ['가'], koreanPolicy)).toBe(true);
    expect(isAcceptedAnswer('거', ['고'], koreanPolicy)).toBe(false);
  });

  it('never accepts an empty answer', () => {
    expect(isAcceptedAnswer('   ', [''], latinPolicy)).toBe(false);
  });

  it('falls back to the Latin policy for languages without their own', () => {
    expect(languagePolicy('es')).toBe(latinPolicy);
    expect(languagePolicy('ja')).toBe(japanesePolicy);
  });

  it('compares typed answers with the policy of each accepted spelling', () => {
    const sakura = ['さくら', 'sakura'];
    expect(isAcceptedTypedAnswer('Sakura ', sakura, 'ja')).toBe(true);
    expect(isAcceptedTypedAnswer('さくら', sakura, 'ja')).toBe(true);
    expect(isAcceptedTypedAnswer('サクラ', sakura, 'ja')).toBe(false);
    expect(isAcceptedTypedAnswer('DER APFEL', ['Apfel', 'der Apfel'], 'de')).toBe(true);
    expect(isAcceptedTypedAnswer('die Apfel', ['Apfel', 'der Apfel'], 'de')).toBe(false);
    expect(isAcceptedTypedAnswer('gakkou', ['学校', 'がっこう', 'gakkō', 'gakkou'], 'ja')).toBe(true);
    expect(isAcceptedTypedAnswer('사과', ['사과', 'sagwa'], 'ko')).toBe(true);
  });
});
