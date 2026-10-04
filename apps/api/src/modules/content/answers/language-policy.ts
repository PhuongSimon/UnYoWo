/**
 * How a typed answer is cleaned up before it is compared. The policy is picked by the
 * script the answer is written in, not by the item's language: "shi" for し uses the
 * Latin policy, "さくら" uses the Japanese one.
 */
export interface LanguagePolicy {
  normalize(text: string): string;
}

const collapseSpaces = (text: string) => text.trim().replace(/\s+/g, ' ');

/** Latin script (English, German, romanization, and any new language by default): case is ignored. */
export const latinPolicy: LanguagePolicy = {
  normalize: (text) => collapseSpaces(text.normalize('NFC')).toLowerCase(),
};

/**
 * Japanese: NFKC folds half-width katakana (ｶ → カ) and full-width spaces. Kana has no
 * case, and hiragana is never folded into katakana: か is a wrong answer for カ.
 * Japanese is written without spaces, so stray ones are dropped.
 */
export const japanesePolicy: LanguagePolicy = {
  normalize: (text) => text.normalize('NFKC').replace(/\s+/g, ''),
};

/** Korean: NFC joins decomposed jamo sequences into syllable blocks; spaces separate words, so they are kept. */
export const koreanPolicy: LanguagePolicy = {
  normalize: (text) => collapseSpaces(text.normalize('NFC')),
};

const POLICIES: Record<string, LanguagePolicy> = { ja: japanesePolicy, ko: koreanPolicy };

/** Languages without a dedicated policy use the Latin one, so adding Spanish or French needs no code. */
export function languagePolicy(languageCode: string): LanguagePolicy {
  return POLICIES[languageCode] ?? latinPolicy;
}

export function isAcceptedAnswer(given: string, accepted: string[], policy: LanguagePolicy): boolean {
  const answer = policy.normalize(given);
  return answer.length > 0 && accepted.some((candidate) => policy.normalize(candidate) === answer);
}
