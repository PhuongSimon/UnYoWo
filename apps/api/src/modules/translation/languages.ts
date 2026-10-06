/** Languages the translator accepts: the four study languages plus Vietnamese, the main UI language. */
export const TRANSLATION_LANGUAGES = ['vi', 'en', 'de', 'ja', 'ko'] as const;
export type TranslationLanguage = (typeof TRANSLATION_LANGUAGES)[number];

const HANGUL = /[ᄀ-ᇿ㄰-㆏가-힯]/;
const KANA = /[぀-ヿ]/;
const HAN = /[一-鿿]/;
// Vowels with Vietnamese tone marks, plus đ, ă, ơ, ư: German and English text has none of them.
const VIETNAMESE = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i;
const GERMAN = /[äöüß]/i;

/**
 * Guesses the language from the script, which is enough to tell these five apart in most cases:
 * Hangul → Korean, kana or kanji → Japanese (Chinese is not supported), Vietnamese and German by
 * their special letters, anything else in Latin script → English.
 */
export function detectLanguage(text: string): TranslationLanguage {
  if (HANGUL.test(text)) return 'ko';
  if (KANA.test(text) || HAN.test(text)) return 'ja';
  if (VIETNAMESE.test(text)) return 'vi';
  if (GERMAN.test(text)) return 'de';
  return 'en';
}
