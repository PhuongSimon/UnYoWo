import type { Localized, SeedConcept, SeedItem, SeedSet } from '../types.js';

// One row = one meaning in every study language, so games can ask "Apfel = ?" with
// options from the same meaning pool in any language.
// - de: nouns carry their article; the noun is stored without it.
// - ja: kana-only words have no `reading`; romaji is Hepburn with macrons, and the
//   "ou"/"oo" spelling learners type on a keyboard is accepted too.
// - ko: Revised Romanization.
// Items marked VERIFY are correct but have a nuance worth a native speaker's review.

type Article = 'der' | 'die' | 'das';
type GermanWord = string | [noun: string, article: Article];
type JapaneseWord = [text: string, romaji: string, reading?: string, accepted?: string[]];
type KoreanWord = [text: string, romanization: string];

interface ConceptRow {
  slug: string;
  emoji: string;
  gloss: Localized;
  en: string;
  de: GermanWord;
  ja: JapaneseWord;
  ko: KoreanWord;
  /** VERIFY note: shown in code review only, not seeded. */
  note?: string;
}

interface Category {
  category: string;
  title: Localized;
  concepts: ConceptRow[];
}

const CATEGORIES: Category[] = [
  {
    category: 'greetings',
    title: { en: 'Greetings', vi: 'Chào hỏi' },
    concepts: [
      { slug: 'hello', emoji: '👋', gloss: { en: 'hello', vi: 'xin chào' }, en: 'hello', de: 'hallo', ja: ['こんにちは', 'konnichiwa'], ko: ['안녕하세요', 'annyeonghaseyo'] },
      {
        slug: 'goodbye',
        emoji: '👋',
        gloss: { en: 'goodbye', vi: 'tạm biệt' },
        en: 'goodbye',
        de: 'auf Wiedersehen',
        ja: ['さようなら', 'sayōnara', undefined, ['sayounara']],
        ko: ['안녕히 가세요', 'annyeonghi gaseyo'],
        note: 'VERIFY ko: 안녕히 가세요 is said to the person leaving; 안녕히 계세요 to the one staying.',
      },
      { slug: 'thank-you', emoji: '🙏', gloss: { en: 'thank you', vi: 'cảm ơn' }, en: 'thank you', de: 'danke', ja: ['ありがとう', 'arigatō', undefined, ['arigatou']], ko: ['감사합니다', 'gamsahamnida'] },
      {
        slug: 'sorry',
        emoji: '🙇',
        gloss: { en: 'sorry; excuse me', vi: 'xin lỗi' },
        en: 'sorry',
        de: 'Entschuldigung',
        ja: ['すみません', 'sumimasen'],
        ko: ['미안합니다', 'mianhamnida'],
        note: 'VERIFY: すみません and Entschuldigung also mean "excuse me"; 미안합니다 is only an apology.',
      },
      { slug: 'yes', emoji: '✅', gloss: { en: 'yes', vi: 'vâng; có' }, en: 'yes', de: 'ja', ja: ['はい', 'hai'], ko: ['네', 'ne'] },
      { slug: 'no', emoji: '❌', gloss: { en: 'no', vi: 'không' }, en: 'no', de: 'nein', ja: ['いいえ', 'iie'], ko: ['아니요', 'aniyo'] },
    ],
  },
  {
    category: 'people',
    title: { en: 'People', vi: 'Con người' },
    concepts: [
      { slug: 'person', emoji: '🧑', gloss: { en: 'person', vi: 'người' }, en: 'person', de: ['Person', 'die'], ja: ['人', 'hito', 'ひと'], ko: ['사람', 'saram'] },
      { slug: 'man', emoji: '👨', gloss: { en: 'man', vi: 'đàn ông' }, en: 'man', de: ['Mann', 'der'], ja: ['男の人', 'otoko no hito', 'おとこのひと'], ko: ['남자', 'namja'] },
      { slug: 'woman', emoji: '👩', gloss: { en: 'woman', vi: 'phụ nữ' }, en: 'woman', de: ['Frau', 'die'], ja: ['女の人', 'onna no hito', 'おんなのひと'], ko: ['여자', 'yeoja'] },
      { slug: 'child', emoji: '🧒', gloss: { en: 'child', vi: 'trẻ em' }, en: 'child', de: ['Kind', 'das'], ja: ['子ども', 'kodomo', 'こども'], ko: ['아이', 'ai'] },
      { slug: 'friend', emoji: '🤝', gloss: { en: 'friend', vi: 'bạn bè' }, en: 'friend', de: ['Freund', 'der'], ja: ['友だち', 'tomodachi', 'ともだち'], ko: ['친구', 'chingu'] },
      { slug: 'teacher', emoji: '🧑‍🏫', gloss: { en: 'teacher', vi: 'giáo viên' }, en: 'teacher', de: ['Lehrer', 'der'], ja: ['先生', 'sensei', 'せんせい'], ko: ['선생님', 'seonsaengnim'] },
      { slug: 'student', emoji: '🧑‍🎓', gloss: { en: 'student', vi: 'học sinh; sinh viên' }, en: 'student', de: ['Student', 'der'], ja: ['学生', 'gakusei', 'がくせい'], ko: ['학생', 'haksaeng'] },
    ],
  },
  {
    category: 'family',
    title: { en: 'Family', vi: 'Gia đình' },
    concepts: [
      { slug: 'family', emoji: '👪', gloss: { en: 'family', vi: 'gia đình' }, en: 'family', de: ['Familie', 'die'], ja: ['家族', 'kazoku', 'かぞく'], ko: ['가족', 'gajok'] },
      { slug: 'mother', emoji: '👩', gloss: { en: 'mother', vi: 'mẹ' }, en: 'mother', de: ['Mutter', 'die'], ja: ['お母さん', 'okāsan', 'おかあさん', ['okaasan']], ko: ['어머니', 'eomeoni'] },
      { slug: 'father', emoji: '👨', gloss: { en: 'father', vi: 'bố' }, en: 'father', de: ['Vater', 'der'], ja: ['お父さん', 'otōsan', 'おとうさん', ['otousan']], ko: ['아버지', 'abeoji'] },
      { slug: 'son', emoji: '👦', gloss: { en: 'son', vi: 'con trai' }, en: 'son', de: ['Sohn', 'der'], ja: ['息子', 'musuko', 'むすこ'], ko: ['아들', 'adeul'] },
      { slug: 'daughter', emoji: '👧', gloss: { en: 'daughter', vi: 'con gái' }, en: 'daughter', de: ['Tochter', 'die'], ja: ['娘', 'musume', 'むすめ'], ko: ['딸', 'ttal'] },
    ],
  },
  {
    category: 'numbers',
    title: { en: 'Numbers', vi: 'Số đếm' },
    // Korean uses the Sino-Korean numbers (일, 이, 삼…), which pair with Japanese いち, に, さん.
    // VERIFY: native Korean numbers (하나, 둘, 셋…) are also correct and are used for counting things.
    concepts: [
      { slug: 'one', emoji: '1️⃣', gloss: { en: 'one', vi: 'một' }, en: 'one', de: 'eins', ja: ['一', 'ichi', 'いち'], ko: ['일', 'il'] },
      { slug: 'two', emoji: '2️⃣', gloss: { en: 'two', vi: 'hai' }, en: 'two', de: 'zwei', ja: ['二', 'ni', 'に'], ko: ['이', 'i'] },
      { slug: 'three', emoji: '3️⃣', gloss: { en: 'three', vi: 'ba' }, en: 'three', de: 'drei', ja: ['三', 'san', 'さん'], ko: ['삼', 'sam'] },
      { slug: 'four', emoji: '4️⃣', gloss: { en: 'four', vi: 'bốn' }, en: 'four', de: 'vier', ja: ['四', 'yon', 'よん', ['shi']], ko: ['사', 'sa'] },
      { slug: 'five', emoji: '5️⃣', gloss: { en: 'five', vi: 'năm' }, en: 'five', de: 'fünf', ja: ['五', 'go', 'ご'], ko: ['오', 'o'] },
      { slug: 'ten', emoji: '🔟', gloss: { en: 'ten', vi: 'mười' }, en: 'ten', de: 'zehn', ja: ['十', 'jū', 'じゅう', ['juu']], ko: ['십', 'sip'] },
    ],
  },
  {
    category: 'food',
    title: { en: 'Food & drink', vi: 'Đồ ăn & đồ uống' },
    concepts: [
      { slug: 'water', emoji: '💧', gloss: { en: 'water', vi: 'nước' }, en: 'water', de: ['Wasser', 'das'], ja: ['水', 'mizu', 'みず'], ko: ['물', 'mul'] },
      { slug: 'food', emoji: '🍽️', gloss: { en: 'food', vi: 'đồ ăn' }, en: 'food', de: ['Essen', 'das'], ja: ['食べ物', 'tabemono', 'たべもの'], ko: ['음식', 'eumsik'] },
      { slug: 'apple', emoji: '🍎', gloss: { en: 'apple', vi: 'quả táo' }, en: 'apple', de: ['Apfel', 'der'], ja: ['りんご', 'ringo'], ko: ['사과', 'sagwa'] },
      {
        slug: 'rice',
        emoji: '🍚',
        gloss: { en: 'rice (cooked)', vi: 'cơm' },
        en: 'rice',
        de: ['Reis', 'der'],
        ja: ['ご飯', 'gohan', 'ごはん'],
        ko: ['밥', 'bap'],
        note: 'VERIFY: ご飯 and 밥 also mean "a meal"; uncooked rice is 米 / 쌀.',
      },
      { slug: 'bread', emoji: '🍞', gloss: { en: 'bread', vi: 'bánh mì' }, en: 'bread', de: ['Brot', 'das'], ja: ['パン', 'pan'], ko: ['빵', 'ppang'] },
      { slug: 'milk', emoji: '🥛', gloss: { en: 'milk', vi: 'sữa' }, en: 'milk', de: ['Milch', 'die'], ja: ['牛乳', 'gyūnyū', 'ぎゅうにゅう', ['gyuunyuu']], ko: ['우유', 'uyu'] },
      { slug: 'coffee', emoji: '☕', gloss: { en: 'coffee', vi: 'cà phê' }, en: 'coffee', de: ['Kaffee', 'der'], ja: ['コーヒー', 'kōhī', undefined, ['koohii']], ko: ['커피', 'keopi'] },
    ],
  },
  {
    category: 'animals',
    title: { en: 'Animals', vi: 'Động vật' },
    concepts: [
      { slug: 'dog', emoji: '🐕', gloss: { en: 'dog', vi: 'con chó' }, en: 'dog', de: ['Hund', 'der'], ja: ['犬', 'inu', 'いぬ'], ko: ['개', 'gae'] },
      { slug: 'cat', emoji: '🐈', gloss: { en: 'cat', vi: 'con mèo' }, en: 'cat', de: ['Katze', 'die'], ja: ['猫', 'neko', 'ねこ'], ko: ['고양이', 'goyangi'] },
      { slug: 'bird', emoji: '🐦', gloss: { en: 'bird', vi: 'con chim' }, en: 'bird', de: ['Vogel', 'der'], ja: ['鳥', 'tori', 'とり'], ko: ['새', 'sae'] },
      { slug: 'fish', emoji: '🐟', gloss: { en: 'fish', vi: 'con cá' }, en: 'fish', de: ['Fisch', 'der'], ja: ['魚', 'sakana', 'さかな'], ko: ['물고기', 'mulgogi'] },
      { slug: 'horse', emoji: '🐎', gloss: { en: 'horse', vi: 'con ngựa' }, en: 'horse', de: ['Pferd', 'das'], ja: ['馬', 'uma', 'うま'], ko: ['말', 'mal'] },
      { slug: 'cow', emoji: '🐄', gloss: { en: 'cow', vi: 'con bò' }, en: 'cow', de: ['Kuh', 'die'], ja: ['牛', 'ushi', 'うし'], ko: ['소', 'so'] },
    ],
  },
  {
    category: 'places',
    title: { en: 'Places', vi: 'Địa điểm' },
    concepts: [
      { slug: 'house', emoji: '🏠', gloss: { en: 'house; home', vi: 'ngôi nhà' }, en: 'house', de: ['Haus', 'das'], ja: ['家', 'ie', 'いえ'], ko: ['집', 'jip'] },
      { slug: 'school', emoji: '🏫', gloss: { en: 'school', vi: 'trường học' }, en: 'school', de: ['Schule', 'die'], ja: ['学校', 'gakkō', 'がっこう', ['gakkou']], ko: ['학교', 'hakgyo'] },
      { slug: 'hospital', emoji: '🏥', gloss: { en: 'hospital', vi: 'bệnh viện' }, en: 'hospital', de: ['Krankenhaus', 'das'], ja: ['病院', 'byōin', 'びょういん', ['byouin']], ko: ['병원', 'byeongwon'] },
      { slug: 'station', emoji: '🚉', gloss: { en: 'station', vi: 'nhà ga' }, en: 'station', de: ['Bahnhof', 'der'], ja: ['駅', 'eki', 'えき'], ko: ['역', 'yeok'] },
      { slug: 'shop', emoji: '🏪', gloss: { en: 'shop', vi: 'cửa hàng' }, en: 'shop', de: ['Geschäft', 'das'], ja: ['店', 'mise', 'みせ'], ko: ['가게', 'gage'] },
      { slug: 'restaurant', emoji: '🍴', gloss: { en: 'restaurant', vi: 'nhà hàng' }, en: 'restaurant', de: ['Restaurant', 'das'], ja: ['レストラン', 'resutoran'], ko: ['식당', 'sikdang'] },
    ],
  },
  {
    category: 'transportation',
    title: { en: 'Transportation', vi: 'Phương tiện' },
    concepts: [
      { slug: 'car', emoji: '🚗', gloss: { en: 'car', vi: 'ô tô' }, en: 'car', de: ['Auto', 'das'], ja: ['車', 'kuruma', 'くるま'], ko: ['자동차', 'jadongcha'] },
      { slug: 'bus', emoji: '🚌', gloss: { en: 'bus', vi: 'xe buýt' }, en: 'bus', de: ['Bus', 'der'], ja: ['バス', 'basu'], ko: ['버스', 'beoseu'] },
      { slug: 'train', emoji: '🚆', gloss: { en: 'train', vi: 'tàu hoả' }, en: 'train', de: ['Zug', 'der'], ja: ['電車', 'densha', 'でんしゃ'], ko: ['기차', 'gicha'] },
      { slug: 'airplane', emoji: '✈️', gloss: { en: 'airplane', vi: 'máy bay' }, en: 'airplane', de: ['Flugzeug', 'das'], ja: ['飛行機', 'hikōki', 'ひこうき', ['hikouki']], ko: ['비행기', 'bihaenggi'] },
      { slug: 'bicycle', emoji: '🚲', gloss: { en: 'bicycle', vi: 'xe đạp' }, en: 'bicycle', de: ['Fahrrad', 'das'], ja: ['自転車', 'jitensha', 'じてんしゃ'], ko: ['자전거', 'jajeongeo'] },
    ],
  },
  {
    category: 'daily-life',
    title: { en: 'Daily life', vi: 'Đời sống hằng ngày' },
    concepts: [
      { slug: 'book', emoji: '📖', gloss: { en: 'book', vi: 'quyển sách' }, en: 'book', de: ['Buch', 'das'], ja: ['本', 'hon', 'ほん'], ko: ['책', 'chaek'] },
      { slug: 'phone', emoji: '📞', gloss: { en: 'phone', vi: 'điện thoại' }, en: 'phone', de: ['Telefon', 'das'], ja: ['電話', 'denwa', 'でんわ'], ko: ['전화', 'jeonhwa'] },
      { slug: 'money', emoji: '💰', gloss: { en: 'money', vi: 'tiền' }, en: 'money', de: ['Geld', 'das'], ja: ['お金', 'okane', 'おかね'], ko: ['돈', 'don'] },
      { slug: 'bed', emoji: '🛏️', gloss: { en: 'bed', vi: 'cái giường' }, en: 'bed', de: ['Bett', 'das'], ja: ['ベッド', 'beddo'], ko: ['침대', 'chimdae'] },
      { slug: 'door', emoji: '🚪', gloss: { en: 'door', vi: 'cửa' }, en: 'door', de: ['Tür', 'die'], ja: ['ドア', 'doa'], ko: ['문', 'mun'] },
      { slug: 'name', emoji: '🏷️', gloss: { en: 'name', vi: 'tên' }, en: 'name', de: ['Name', 'der'], ja: ['名前', 'namae', 'なまえ'], ko: ['이름', 'ireum'] },
    ],
  },
  {
    category: 'verbs',
    title: { en: 'Common verbs', vi: 'Động từ thông dụng' },
    concepts: [
      { slug: 'eat', emoji: '🍴', gloss: { en: 'to eat', vi: 'ăn' }, en: 'eat', de: 'essen', ja: ['食べる', 'taberu', 'たべる'], ko: ['먹다', 'meokda'] },
      { slug: 'drink', emoji: '🥤', gloss: { en: 'to drink', vi: 'uống' }, en: 'drink', de: 'trinken', ja: ['飲む', 'nomu', 'のむ'], ko: ['마시다', 'masida'] },
      { slug: 'go', emoji: '🚶', gloss: { en: 'to go', vi: 'đi' }, en: 'go', de: 'gehen', ja: ['行く', 'iku', 'いく'], ko: ['가다', 'gada'] },
      { slug: 'come', emoji: '🏃', gloss: { en: 'to come', vi: 'đến' }, en: 'come', de: 'kommen', ja: ['来る', 'kuru', 'くる'], ko: ['오다', 'oda'] },
      { slug: 'see', emoji: '👀', gloss: { en: 'to see; to watch', vi: 'nhìn; xem' }, en: 'see', de: 'sehen', ja: ['見る', 'miru', 'みる'], ko: ['보다', 'boda'] },
      { slug: 'read', emoji: '📚', gloss: { en: 'to read', vi: 'đọc' }, en: 'read', de: 'lesen', ja: ['読む', 'yomu', 'よむ'], ko: ['읽다', 'ikda'] },
      { slug: 'write', emoji: '✍️', gloss: { en: 'to write', vi: 'viết' }, en: 'write', de: 'schreiben', ja: ['書く', 'kaku', 'かく'], ko: ['쓰다', 'sseuda'] },
      { slug: 'sleep', emoji: '😴', gloss: { en: 'to sleep', vi: 'ngủ' }, en: 'sleep', de: 'schlafen', ja: ['寝る', 'neru', 'ねる'], ko: ['자다', 'jada'] },
    ],
  },
  {
    category: 'adjectives',
    title: { en: 'Common adjectives', vi: 'Tính từ thông dụng' },
    concepts: [
      { slug: 'big', emoji: '🐘', gloss: { en: 'big', vi: 'to; lớn' }, en: 'big', de: 'groß', ja: ['大きい', 'ōkii', 'おおきい', ['ookii']], ko: ['크다', 'keuda'] },
      { slug: 'small', emoji: '🐭', gloss: { en: 'small', vi: 'nhỏ' }, en: 'small', de: 'klein', ja: ['小さい', 'chiisai', 'ちいさい'], ko: ['작다', 'jakda'] },
      { slug: 'good', emoji: '👍', gloss: { en: 'good', vi: 'tốt' }, en: 'good', de: 'gut', ja: ['いい', 'ii'], ko: ['좋다', 'jota'] },
      { slug: 'bad', emoji: '👎', gloss: { en: 'bad', vi: 'xấu; tệ' }, en: 'bad', de: 'schlecht', ja: ['悪い', 'warui', 'わるい'], ko: ['나쁘다', 'nappeuda'] },
      {
        slug: 'hot',
        emoji: '🥵',
        gloss: { en: 'hot (weather)', vi: 'nóng (thời tiết)' },
        en: 'hot',
        de: 'heiß',
        ja: ['暑い', 'atsui', 'あつい'],
        ko: ['덥다', 'deopda'],
        note: 'VERIFY: 暑い / 덥다 are for weather; hot objects are 熱い / 뜨겁다. English and German use one word.',
      },
      {
        slug: 'cold',
        emoji: '🥶',
        gloss: { en: 'cold (weather)', vi: 'lạnh (thời tiết)' },
        en: 'cold',
        de: 'kalt',
        ja: ['寒い', 'samui', 'さむい'],
        ko: ['춥다', 'chupda'],
        note: 'VERIFY: 寒い / 춥다 are for weather; cold objects are 冷たい / 차갑다.',
      },
    ],
  },
  {
    category: 'time',
    title: { en: 'Time', vi: 'Thời gian' },
    concepts: [
      { slug: 'today', emoji: '📅', gloss: { en: 'today', vi: 'hôm nay' }, en: 'today', de: 'heute', ja: ['今日', 'kyō', 'きょう', ['kyou']], ko: ['오늘', 'oneul'] },
      { slug: 'tomorrow', emoji: '➡️', gloss: { en: 'tomorrow', vi: 'ngày mai' }, en: 'tomorrow', de: 'morgen', ja: ['明日', 'ashita', 'あした'], ko: ['내일', 'naeil'] },
      { slug: 'yesterday', emoji: '⬅️', gloss: { en: 'yesterday', vi: 'hôm qua' }, en: 'yesterday', de: 'gestern', ja: ['昨日', 'kinō', 'きのう', ['kinou']], ko: ['어제', 'eoje'] },
      { slug: 'now', emoji: '⏱️', gloss: { en: 'now', vi: 'bây giờ' }, en: 'now', de: 'jetzt', ja: ['今', 'ima', 'いま'], ko: ['지금', 'jigeum'] },
      { slug: 'time', emoji: '⏰', gloss: { en: 'time', vi: 'thời gian' }, en: 'time', de: ['Zeit', 'die'], ja: ['時間', 'jikan', 'じかん'], ko: ['시간', 'sigan'] },
    ],
  },
  {
    category: 'colors',
    title: { en: 'Colors', vi: 'Màu sắc' },
    concepts: [
      { slug: 'red', emoji: '🔴', gloss: { en: 'red', vi: 'màu đỏ' }, en: 'red', de: 'rot', ja: ['赤', 'aka', 'あか'], ko: ['빨간색', 'ppalgansaek'] },
      { slug: 'blue', emoji: '🔵', gloss: { en: 'blue', vi: 'màu xanh dương' }, en: 'blue', de: 'blau', ja: ['青', 'ao', 'あお'], ko: ['파란색', 'paransaek'] },
      { slug: 'white', emoji: '⚪', gloss: { en: 'white', vi: 'màu trắng' }, en: 'white', de: 'weiß', ja: ['白', 'shiro', 'しろ'], ko: ['흰색', 'huinsaek'] },
      { slug: 'black', emoji: '⚫', gloss: { en: 'black', vi: 'màu đen' }, en: 'black', de: 'schwarz', ja: ['黒', 'kuro', 'くろ'], ko: ['검은색', 'geomeunsaek'] },
      { slug: 'yellow', emoji: '🟡', gloss: { en: 'yellow', vi: 'màu vàng' }, en: 'yellow', de: 'gelb', ja: ['黄色', 'kiiro', 'きいろ'], ko: ['노란색', 'noransaek'] },
      { slug: 'green', emoji: '🟢', gloss: { en: 'green', vi: 'màu xanh lá' }, en: 'green', de: 'grün', ja: ['緑', 'midori', 'みどり'], ko: ['초록색', 'choroksaek'] },
    ],
  },
];

export const VOCABULARY_LANGUAGES = ['en', 'de', 'ja', 'ko'] as const;
type VocabularyLanguage = (typeof VOCABULARY_LANGUAGES)[number];

const GENDER: Record<Article, string> = { der: 'masculine', die: 'feminine', das: 'neuter' };

function toItem(language: VocabularyLanguage, row: ConceptRow): SeedItem {
  const base = { type: 'WORD' as const, concept: row.slug, difficulty: 1 };

  switch (language) {
    case 'en':
      return { ...base, text: row.en };
    case 'de': {
      if (typeof row.de === 'string') return { ...base, text: row.de };
      const [noun, article] = row.de;
      return { ...base, text: noun, attributes: { article, gender: GENDER[article] } };
    }
    case 'ja': {
      const [text, romaji, reading, accepted] = row.ja;
      return { ...base, text, reading, romanization: romaji, acceptedAnswers: accepted };
    }
    case 'ko': {
      const [text, romanization] = row.ko;
      return { ...base, text, romanization };
    }
  }
}

export function buildVocabulary(): { concepts: SeedConcept[]; sets: SeedSet[] } {
  const concepts = CATEGORIES.flatMap(({ concepts }) =>
    concepts.map(({ slug, emoji, gloss }): SeedConcept => ({ slug, emoji, gloss })),
  );

  const sets = VOCABULARY_LANGUAGES.flatMap((language) =>
    CATEGORIES.map(
      ({ category, title, concepts }): SeedSet => ({
        language,
        slug: `vocab-${category}`,
        kind: 'VOCABULARY',
        category,
        title,
        items: concepts.map((row) => toItem(language, row)),
      }),
    ),
  );

  return { concepts, sets };
}
