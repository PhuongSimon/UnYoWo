import type { SeedCategory, SeedLevel, SeedSource } from '../types.js';

/**
 * Topics shared by every language, in display order. The first thirteen are the topics the
 * starter sets already used; the rest arrived with the exam-level word lists.
 */
export const CATEGORIES: SeedCategory[] = [
  { slug: 'greetings', emoji: '👋', title: { en: 'Greetings & phrases', vi: 'Chào hỏi & mẫu câu' } },
  { slug: 'people', emoji: '🧑', title: { en: 'People', vi: 'Con người' } },
  { slug: 'family', emoji: '👪', title: { en: 'Family', vi: 'Gia đình' } },
  { slug: 'body-health', emoji: '💪', title: { en: 'Body & health', vi: 'Cơ thể & sức khoẻ' } },
  { slug: 'feelings', emoji: '😊', title: { en: 'Feelings & personality', vi: 'Cảm xúc & tính cách' } },
  { slug: 'food', emoji: '🍽️', title: { en: 'Food & drink', vi: 'Đồ ăn & đồ uống' } },
  { slug: 'clothing', emoji: '👕', title: { en: 'Clothing & beauty', vi: 'Quần áo & làm đẹp' } },
  { slug: 'daily-life', emoji: '🏠', title: { en: 'Daily life & home', vi: 'Đời sống & nhà cửa' } },
  { slug: 'places', emoji: '🏙️', title: { en: 'Places', vi: 'Địa điểm' } },
  { slug: 'transportation', emoji: '🚆', title: { en: 'Transport & travel', vi: 'Giao thông & du lịch' } },
  { slug: 'shopping', emoji: '🛒', title: { en: 'Shopping & money', vi: 'Mua sắm & tiền bạc' } },
  { slug: 'school', emoji: '🎒', title: { en: 'School & study', vi: 'Trường học & học tập' } },
  { slug: 'work', emoji: '💼', title: { en: 'Work & jobs', vi: 'Công việc & nghề nghiệp' } },
  { slug: 'hobbies', emoji: '🎨', title: { en: 'Hobbies & leisure', vi: 'Sở thích & giải trí' } },
  { slug: 'communication', emoji: '📱', title: { en: 'Communication & media', vi: 'Giao tiếp & truyền thông' } },
  { slug: 'nature', emoji: '🌤️', title: { en: 'Nature & weather', vi: 'Thiên nhiên & thời tiết' } },
  { slug: 'animals', emoji: '🐾', title: { en: 'Animals', vi: 'Động vật' } },
  { slug: 'society', emoji: '🏛️', title: { en: 'Society', vi: 'Xã hội' } },
  { slug: 'science-tech', emoji: '🔬', title: { en: 'Science & technology', vi: 'Khoa học & công nghệ' } },
  { slug: 'countries', emoji: '🌍', title: { en: 'Countries & languages', vi: 'Quốc gia & ngôn ngữ' } },
  { slug: 'time', emoji: '⏰', title: { en: 'Time', vi: 'Thời gian' } },
  { slug: 'numbers', emoji: '🔢', title: { en: 'Numbers & quantities', vi: 'Số & số lượng' } },
  { slug: 'colors', emoji: '🌈', title: { en: 'Colors', vi: 'Màu sắc' } },
  { slug: 'position', emoji: '🧭', title: { en: 'Position & direction', vi: 'Vị trí & phương hướng' } },
  { slug: 'verbs', emoji: '🏃', title: { en: 'Common verbs', vi: 'Động từ thông dụng' } },
  { slug: 'adjectives', emoji: '✨', title: { en: 'Common adjectives', vi: 'Tính từ thông dụng' } },
  { slug: 'adverbs', emoji: '⚡', title: { en: 'Adverbs', vi: 'Trạng từ' } },
  { slug: 'function-words', emoji: '🔗', title: { en: 'Function words', vi: 'Từ chức năng' } },
  { slug: 'ideas', emoji: '💡', title: { en: 'General concepts', vi: 'Khái niệm chung' } },
];

/** The beginner target of each language, easiest first. `difficulty` is copied to every item of the level. */
export const LEVELS: SeedLevel[] = [
  { language: 'en', code: 'B1', framework: 'CEFR', difficulty: 3, title: { en: 'B1 · Intermediate', vi: 'B1 · Trung cấp' } },
  { language: 'en', code: 'B2', framework: 'CEFR', difficulty: 4, title: { en: 'B2 · Upper intermediate', vi: 'B2 · Trung cao cấp' } },
  { language: 'de', code: 'A1', framework: 'CEFR', difficulty: 1, title: { en: 'A1 · Beginner', vi: 'A1 · Sơ cấp' } },
  { language: 'de', code: 'A2', framework: 'CEFR', difficulty: 2, title: { en: 'A2 · Elementary', vi: 'A2 · Sơ trung cấp' } },
  { language: 'ja', code: 'N5', framework: 'JLPT', difficulty: 1, title: { en: 'N5 · Beginner', vi: 'N5 · Sơ cấp 1' } },
  { language: 'ja', code: 'N4', framework: 'JLPT', difficulty: 2, title: { en: 'N4 · Elementary', vi: 'N4 · Sơ cấp 2' } },
  { language: 'ko', code: 'TOPIK1', framework: 'TOPIK', difficulty: 1, title: { en: 'TOPIK I · Beginner', vi: 'TOPIK I · Sơ cấp' } },
];

/** Every dataset the word lists were built from. Learners see these credits in the app. */
export const SOURCES: SeedSource[] = [
  {
    id: 'cefrj',
    name: 'CEFR-J Wordlist 1.5',
    url: 'https://github.com/openlanguageprofiles/olp-en-cefrj',
    license: 'Free for research and commercial use with citation',
    attribution: 'The CEFR-J Wordlist Version 1.5. Compiled by Yukio Tono, Tokyo University of Foreign Studies.',
  },
  {
    id: 'goethe',
    name: 'Goethe-Zertifikat A1/A2 Wortliste',
    url: 'https://www.goethe.de/de/spr/kup/prf/prf.html',
    license: 'Headwords only; meanings written for UnYoWo',
    attribution: 'Word selection follows the Goethe-Institut A1 and A2 word lists.',
  },
  {
    id: 'jlpt-waller',
    name: 'JLPT vocabulary lists (Jonathan Waller)',
    url: 'https://www.tanos.co.uk/jlpt/',
    license: 'CC BY',
    attribution: 'JLPT N5/N4 word lists by Jonathan Waller (tanos.co.uk), via open-anki-jlpt-decks.',
  },
  {
    id: 'minna',
    name: 'Minna no Nihongo I vocabulary (user list)',
    url: 'https://www.3anet.co.jp/',
    license: 'Provided by the project owner',
    attribution: 'Vietnamese meanings and Sino-Vietnamese readings from the project owner\'s Minna no Nihongo I list.',
  },
  {
    id: 'krdict',
    name: '한국어기초사전 (Basic Korean Dictionary)',
    url: 'https://krdict.korean.go.kr',
    license: 'CC BY-SA 2.0 KR',
    attribution: '국립국어원 한국어기초사전 (National Institute of Korean Language), CC BY-SA 2.0 KR.',
  },
  {
    id: 'unyowo',
    name: 'UnYoWo editors',
    url: 'https://github.com/PhuongSimon/UnYoWo',
    license: 'Project content',
    attribution: 'Meanings and topics written and reviewed for UnYoWo.',
  },
];
