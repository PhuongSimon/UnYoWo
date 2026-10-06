import type { Glyph, GlyphExample, GridRow, ScriptChart, StudyContent } from '../../types'
import { ex, glyph, l, table, word } from '../helpers'
import grammar from './grammar'
import { DAKUTEN, GOJUON, YOON, type Kana } from './kana'

function rows(source: [string, Kana[]][], script: 0 | 1): GridRow[] {
  return source.map(([label, cells]) => ({
    label,
    cells: cells.map((kana): Glyph | null => (kana ? { char: kana[script], roman: kana[2], ipa: kana[3] } : null)),
  }))
}

const VOWEL_COLUMNS = ['a', 'i', 'u', 'e', 'o']
const YOON_COLUMNS = ['ya', 'yu', 'yo']

function kanaCharts(script: 0 | 1, name: string): ScriptChart[] {
  const id = name.toLowerCase()
  return [
    {
      id: `${id}-basic`,
      title: l(`${name}: 46 chữ cơ bản`, `${name}: the 46 basic characters`),
      intro: l(
        'Đọc theo hàng (phụ âm) ghép với cột (nguyên âm). Bấm vào ô để nghe.',
        'Read each row (consonant) with each column (vowel). Tap a cell to hear it.',
      ),
      kind: 'grid',
      columns: VOWEL_COLUMNS,
      rows: rows(GOJUON, script),
    },
    {
      id: `${id}-dakuten`,
      title: l(`${name}: âm đục (゛) và bán đục (゜)`, `${name}: voiced (゛) and p-sounds (゜)`),
      intro: l(
        'Thêm dấu ゛ (dakuten) biến k → g, s → z, t → d, h → b; thêm dấu ゜ (handakuten) biến h → p.',
        'The ゛ mark (dakuten) turns k → g, s → z, t → d, h → b; the ゜ mark (handakuten) turns h → p.',
      ),
      kind: 'grid',
      columns: VOWEL_COLUMNS,
      rows: rows(DAKUTEN, script),
    },
    {
      id: `${id}-yoon`,
      title: l(`${name}: âm ghép (ゃ ゅ ょ nhỏ)`, `${name}: combinations (small ゃ ゅ ょ)`),
      intro: l(
        'Một chữ cột i ghép với ya, yu, yo viết nhỏ thành một âm tiết: き + ゃ = きゃ (kya). Chữ nhỏ không đọc thành nhịp riêng.',
        'An i-column character plus a small ya, yu or yo makes one syllable: き + ゃ = きゃ (kya). The small character is not a separate beat.',
      ),
      kind: 'grid',
      columns: YOON_COLUMNS,
      rows: rows(YOON, script),
    },
  ]
}

const extendedKatakana = [
  glyph('ファ', '[ɸa]', { roman: 'fa', example: word('ファイル', l('tệp, tập hồ sơ', 'file'), { roman: 'fairu' }) }),
  glyph('フィ', '[ɸi]', { roman: 'fi', example: word('フィルム', l('cuộn phim', 'film'), { roman: 'firumu' }) }),
  glyph('フェ', '[ɸe]', { roman: 'fe', example: word('カフェ', l('quán cà phê', 'café'), { roman: 'kafe' }) }),
  glyph('フォ', '[ɸo]', { roman: 'fo', example: word('フォーク', l('cái nĩa', 'fork'), { roman: 'fōku' }) }),
  glyph('ティ', '[ti]', { roman: 'ti', example: word('パーティー', l('bữa tiệc', 'party'), { roman: 'pātī' }) }),
  glyph('ディ', '[di]', { roman: 'di', example: word('ディズニー', l('Disney', 'Disney'), { roman: 'Dizunī' }) }),
  glyph('トゥ', '[tɯ]', { roman: 'tu', example: word('タトゥー', l('hình xăm', 'tattoo'), { roman: 'tatū' }) }),
  glyph('ウィ', '[wi]', { roman: 'wi', example: word('ウィンドウ', l('cửa sổ (máy tính)', 'window (computer)'), { roman: 'windō' }) }),
  glyph('ウェ', '[we]', { roman: 'we', example: word('ウェブ', l('web', 'web'), { roman: 'webu' }) }),
  glyph('ウォ', '[wo]', { roman: 'wo', example: word('ウォーキング', l('đi bộ (thể dục)', 'walking'), { roman: 'wōkingu' }) }),
  glyph('シェ', '[ɕe]', { roman: 'she', example: word('シェフ', l('đầu bếp', 'chef'), { roman: 'shefu' }) }),
  glyph('ジェ', '[dʑe]', { roman: 'je', example: word('ジェット', l('máy bay phản lực', 'jet'), { roman: 'jetto' }) }),
  glyph('チェ', '[tɕe]', { roman: 'che', example: word('チェック', l('kiểm tra', 'check'), { roman: 'chekku' }) }),
  glyph('ヴ', '[vɯ] ~ [bɯ]', { roman: 'vu', example: word('ヴァイオリン', l('đàn vi-ô-lông', 'violin'), { roman: 'vaiorin' }), tip: l('Nhiều người Nhật đọc như bu; cũng viết バイオリン.', 'Many speakers say "bu"; also written バイオリン.') }),
  glyph('ー', '[ː]', {
    roman: '—',
    example: word('コーヒー', l('cà phê', 'coffee'), { roman: 'kōhī' }),
    tip: l('Gạch ngang kéo dài nguyên âm trước nó thêm một nhịp.', 'The bar lengthens the vowel before it by one beat.'),
    speak: 'コーヒー',
  }),
]

// Starter kanji: [character, On, Kun, romaji, Hán Việt, English meaning, example word]
function kanjiCard(char: string, on: string, kun: string, roman: string, hanViet: string, meaning: string, example: GlyphExample): Glyph {
  return { char, roman, readings: { on, kun }, example, tip: l(`Hán Việt: ${hanViet}`, `Meaning: ${meaning}`) }
}

const kanji: Glyph[] = [
  kanjiCard('一', 'イチ', 'ひと(つ)', 'ichi · hito', 'NHẤT', 'one', word('一つ', l('một cái', 'one (thing)'), { roman: 'hitotsu' })),
  kanjiCard('二', 'ニ', 'ふた(つ)', 'ni · futa', 'NHỊ', 'two', word('二人', l('hai người', 'two people'), { roman: 'futari' })),
  kanjiCard('三', 'サン', 'みっ(つ)', 'san · mittsu', 'TAM', 'three', word('三月', l('tháng Ba', 'March'), { roman: 'sangatsu' })),
  kanjiCard('四', 'シ', 'よん・よ', 'shi · yon', 'TỨ', 'four', word('四時', l('4 giờ', 'four o’clock'), { roman: 'yoji' })),
  kanjiCard('五', 'ゴ', 'いつ(つ)', 'go · itsutsu', 'NGŨ', 'five', word('五分', l('5 phút', 'five minutes'), { roman: 'gofun' })),
  kanjiCard('六', 'ロク', 'むっ(つ)', 'roku · muttsu', 'LỤC', 'six', word('六百', l('sáu trăm', 'six hundred'), { roman: 'roppyaku' })),
  kanjiCard('七', 'シチ', 'なな', 'shichi · nana', 'THẤT', 'seven', word('七月', l('tháng Bảy', 'July'), { roman: 'shichigatsu' })),
  kanjiCard('八', 'ハチ', 'やっ(つ)', 'hachi · yattsu', 'BÁT', 'eight', word('八時', l('8 giờ', 'eight o’clock'), { roman: 'hachiji' })),
  kanjiCard('九', 'キュウ・ク', 'ここの(つ)', 'kyū, ku · kokonotsu', 'CỬU', 'nine', word('九月', l('tháng Chín', 'September'), { roman: 'kugatsu' })),
  kanjiCard('十', 'ジュウ', 'とお', 'jū · tō', 'THẬP', 'ten', word('十円', l('10 yên', '10 yen'), { roman: 'jūen' })),
  kanjiCard('百', 'ヒャク', '', 'hyaku', 'BÁCH', 'hundred', word('百円', l('100 yên', '100 yen'), { roman: 'hyakuen' })),
  kanjiCard('千', 'セン', 'ち', 'sen', 'THIÊN', 'thousand', word('千円', l('1.000 yên', '1,000 yen'), { roman: 'sen’en' })),
  kanjiCard('万', 'マン', '', 'man', 'VẠN', 'ten thousand', word('一万円', l('10.000 yên', '10,000 yen'), { roman: 'ichiman’en' })),
  kanjiCard('円', 'エン', 'まる(い)', 'en · marui', 'VIÊN', 'yen; circle', word('五百円', l('500 yên', '500 yen'), { roman: 'gohyakuen' })),
  kanjiCard('人', 'ジン・ニン', 'ひと', 'jin, nin · hito', 'NHÂN', 'person', word('日本人', l('người Nhật', 'Japanese person'), { roman: 'Nihonjin' })),
  kanjiCard('日', 'ニチ・ジツ', 'ひ・か', 'nichi · hi, ka', 'NHẬT', 'sun; day', word('日本', l('Nhật Bản', 'Japan'), { roman: 'Nihon' })),
  kanjiCard('月', 'ゲツ・ガツ', 'つき', 'getsu, gatsu · tsuki', 'NGUYỆT', 'moon; month', word('月曜日', l('thứ Hai', 'Monday'), { roman: 'getsuyōbi' })),
  kanjiCard('火', 'カ', 'ひ', 'ka · hi', 'HOẢ', 'fire', word('火曜日', l('thứ Ba', 'Tuesday'), { roman: 'kayōbi' })),
  kanjiCard('水', 'スイ', 'みず', 'sui · mizu', 'THUỶ', 'water', word('水曜日', l('thứ Tư', 'Wednesday'), { roman: 'suiyōbi' })),
  kanjiCard('木', 'モク・ボク', 'き', 'moku · ki', 'MỘC', 'tree; wood', word('木曜日', l('thứ Năm', 'Thursday'), { roman: 'mokuyōbi' })),
  kanjiCard('金', 'キン', 'かね', 'kin · kane', 'KIM', 'gold; money', word('金曜日', l('thứ Sáu', 'Friday'), { roman: 'kin’yōbi' })),
  kanjiCard('土', 'ド', 'つち', 'do · tsuchi', 'THỔ', 'earth; soil', word('土曜日', l('thứ Bảy', 'Saturday'), { roman: 'doyōbi' })),
  kanjiCard('山', 'サン', 'やま', 'san · yama', 'SƠN', 'mountain', word('富士山', l('núi Phú Sĩ', 'Mount Fuji'), { roman: 'Fujisan' })),
  kanjiCard('川', 'セン', 'かわ', 'sen · kawa', 'XUYÊN', 'river', word('川', l('con sông', 'river'), { roman: 'kawa' })),
  kanjiCard('大', 'ダイ・タイ', 'おお(きい)', 'dai · ōkii', 'ĐẠI', 'big', word('大学', l('đại học', 'university'), { roman: 'daigaku' })),
  kanjiCard('小', 'ショウ', 'ちい(さい)・こ', 'shō · chiisai', 'TIỂU', 'small', word('小学校', l('trường tiểu học', 'primary school'), { roman: 'shōgakkō' })),
  kanjiCard('中', 'チュウ', 'なか', 'chū · naka', 'TRUNG', 'middle; inside', word('中国', l('Trung Quốc', 'China'), { roman: 'Chūgoku' })),
  kanjiCard('上', 'ジョウ', 'うえ', 'jō · ue', 'THƯỢNG', 'up; above', word('上手', l('giỏi', 'good at'), { roman: 'jōzu' })),
  kanjiCard('下', 'カ・ゲ', 'した', 'ka, ge · shita', 'HẠ', 'down; below', word('地下鉄', l('tàu điện ngầm', 'subway'), { roman: 'chikatetsu' })),
  kanjiCard('口', 'コウ', 'くち', 'kō · kuchi', 'KHẨU', 'mouth', word('入口', l('lối vào', 'entrance'), { roman: 'iriguchi' })),
  kanjiCard('目', 'モク', 'め', 'moku · me', 'MỤC', 'eye', word('目', l('con mắt', 'eye'), { roman: 'me' })),
  kanjiCard('学', 'ガク', 'まな(ぶ)', 'gaku · manabu', 'HỌC', 'study', word('学生', l('học sinh, sinh viên', 'student'), { roman: 'gakusei' })),
  kanjiCard('生', 'セイ・ショウ', 'い(きる)・う(まれる)', 'sei · ikiru, umareru', 'SINH', 'life; birth', word('先生', l('giáo viên', 'teacher'), { roman: 'sensei' })),
  kanjiCard('先', 'セン', 'さき', 'sen · saki', 'TIÊN', 'ahead; previous', word('先週', l('tuần trước', 'last week'), { roman: 'senshū' })),
  kanjiCard('年', 'ネン', 'とし', 'nen · toshi', 'NIÊN', 'year', word('今年', l('năm nay', 'this year'), { roman: 'kotoshi' })),
  kanjiCard('時', 'ジ', 'とき', 'ji · toki', 'THỜI', 'time; hour', word('時間', l('thời gian', 'time'), { roman: 'jikan' })),
  kanjiCard('何', '', 'なに・なん', 'nani, nan', 'HÀ', 'what', word('何時', l('mấy giờ', 'what time'), { roman: 'nanji' })),
  kanjiCard('本', 'ホン', 'もと', 'hon · moto', 'BẢN', 'book; origin', word('本', l('quyển sách', 'book'), { roman: 'hon' })),
  kanjiCard('行', 'コウ', 'い(く)', 'kō · iku', 'HÀNH', 'go', word('行く', l('đi', 'to go'), { roman: 'iku' })),
  kanjiCard('来', 'ライ', 'く(る)', 'rai · kuru', 'LAI', 'come', word('来年', l('năm sau', 'next year'), { roman: 'rainen' })),
  kanjiCard('食', 'ショク', 'た(べる)', 'shoku · taberu', 'THỰC', 'eat', word('食べる', l('ăn', 'to eat'), { roman: 'taberu' })),
  kanjiCard('見', 'ケン', 'み(る)', 'ken · miru', 'KIẾN', 'see', word('見る', l('nhìn, xem', 'to see, to watch'), { roman: 'miru' })),
  kanjiCard('男', 'ダン', 'おとこ', 'dan · otoko', 'NAM', 'man', word('男の人', l('người đàn ông', 'man'), { roman: 'otoko no hito' })),
  kanjiCard('女', 'ジョ', 'おんな', 'jo · onna', 'NỮ', 'woman', word('女の人', l('người phụ nữ', 'woman'), { roman: 'onna no hito' })),
  kanjiCard('子', 'シ', 'こ', 'shi · ko', 'TỬ', 'child', word('子ども', l('trẻ em', 'child'), { roman: 'kodomo' })),
  kanjiCard('今', 'コン', 'いま', 'kon · ima', 'KIM', 'now', word('今週', l('tuần này', 'this week'), { roman: 'konshū' })),
  kanjiCard('分', 'ブン・フン', 'わ(かる)', 'bun, fun · wakaru', 'PHÂN', 'minute; part', word('分かる', l('hiểu', 'to understand'), { roman: 'wakaru' })),
  kanjiCard('半', 'ハン', 'なか(ば)', 'han', 'BÁN', 'half', word('三時半', l('3 giờ rưỡi', 'half past three'), { roman: 'sanji han' })),
  kanjiCard('国', 'コク', 'くに', 'koku · kuni', 'QUỐC', 'country', word('外国', l('nước ngoài', 'foreign country'), { roman: 'gaikoku' })),
  kanjiCard('語', 'ゴ', 'かた(る)', 'go · kataru', 'NGỮ', 'language; word', word('日本語', l('tiếng Nhật', 'Japanese (language)'), { roman: 'Nihongo' })),
]

const vowels = [
  { ipa: 'a', examples: ['**あ**め (ame)', '**あ**さ (asa)'], tip: l('Như "a" tiếng Việt.', 'Like "a" in "father", but short.'), speak: 'あめ' },
  { ipa: 'i', examples: ['**い**ぬ (inu)', '**い**す (isu)'], tip: l('Như "i" tiếng Việt.', 'Like "ee", but short.'), speak: 'いぬ' },
  { ipa: 'ɯ', examples: ['**う**み (umi)', 'す**う**じ (sūji)'], tip: l('Gần "ư" tiếng Việt, môi hơi thả lỏng, không chu tròn như "u".', 'An "oo" without rounding the lips.'), speak: 'うみ' },
  { ipa: 'e', examples: ['**え**き (eki)', '**え**いが (eiga)'], tip: l('Như "ê" tiếng Việt.', 'Like "e" in "bed".'), speak: 'えき' },
  { ipa: 'o', examples: ['**お**かね (okane)', '**お**ちゃ (ocha)'], tip: l('Như "ô" tiếng Việt, ngắn.', 'A short, pure "o".'), speak: 'おかね' },
]

const consonants = [
  { ipa: 'ɕ', label: l('し', 'し'), examples: ['**し**お (shio)', '**しゃ**しん (shashin)'], tip: l('Giữa "s" và "x": lưỡi nâng lên sát vòm, môi không chu. Romaji viết "shi".', 'Softer than English "sh", lips not rounded. Written "shi".'), speak: 'しお' },
  { ipa: 'tɕ', label: l('ち', 'ち'), examples: ['**ち**ず (chizu)', 'お**ちゃ** (ocha)'], tip: l('Rất gần "ch" tiếng Việt (như trong "chi").', 'Like a soft English "ch".'), speak: 'ちず' },
  { ipa: 'ts', label: l('つ', 'つ'), examples: ['**つ**くえ (tsukue)', 'な**つ** (natsu)'], tip: l('"t" và "s" liền một hơi như "ts". Người Việt hay đọc nhầm thành "chư".', '"t" and "s" together, as in "cats".'), speak: 'つくえ' },
  { ipa: 'ɸ', label: l('ふ', 'ふ'), examples: ['**ふ**じさん (Fujisan)', '**ふ**ね (fune)'], tip: l('Thổi hơi qua hai môi khép hờ như thổi nến; răng không chạm môi như "ph".', 'Blow between the lips as if cooling soup; teeth do not touch the lip.'), speak: 'ふじさん' },
  { ipa: 'ç', label: l('ひ', 'ひ'), examples: ['**ひ**と (hito)', '**ひゃ**く (hyaku)'], tip: l('Như "h" nhưng xì hơi giữa lưỡi và vòm miệng.', 'An "h" with a light hiss, as in "huge".'), speak: 'ひと' },
  { ipa: 'ɾ', label: l('ら・り・る・れ・ろ', 'ra ri ru re ro'), examples: ['さく**ら** (sakura)', '**り**んご (ringo)'], tip: l('Đầu lưỡi chạm nhẹ một lần vào lợi trên, nghe lai giữa "r", "l" và "đ". Không rung lưỡi.', 'One quick tap of the tongue, between r, l and d. No trill.'), speak: 'さくら' },
  { ipa: 'dʑ', label: l('じ・ぢ', 'じ・ぢ'), examples: ['**じ**かん (jikan)', 'か**じ** (kaji)'], tip: l('Như "gi" tiếng Việt, mềm.', 'A soft "j".'), speak: 'じかん' },
  { ipa: 'z', label: l('ず・づ', 'ず・づ'), examples: ['み**ず** (mizu)', '**ず**っと (zutto)'], tip: l('ず và づ đọc giống nhau. Đầu từ thường nghe như "dz".', 'ず and づ sound the same; often "dz" at the start of a word.'), speak: 'みず' },
  { ipa: 'ɴ', label: l('ん', 'ん'), examples: ['ほ**ん** (hon)', 'し**ん**ぶん (shinbun)'], tip: l('Âm mũi đứng riêng một nhịp; đọc thành m, n hay ng tuỳ âm đứng sau.', 'A nasal that counts as its own beat; it becomes m, n or ng depending on what follows.'), speak: 'ほん' },
]

const content: StudyContent = {
  overview: l(
    'Tiếng Nhật dùng **3 bộ chữ cùng lúc**: **Hiragana** (ngữ pháp, từ thuần Nhật), **Katakana** (từ mượn, tên nước ngoài) và **Kanji** (chữ Hán mang nghĩa). Hãy học Hiragana trước (1–2 tuần), rồi Katakana, rồi Kanji dần dần. Phát âm khá dễ với người Việt: chỉ **5 nguyên âm**, mỗi chữ là một nhịp. Ngữ pháp: **động từ đứng cuối câu** (S – O – V) và **trợ từ** (は, を, に…) đứng sau danh từ để chỉ vai trò của nó.',
    'Japanese mixes **three scripts**: **hiragana** (grammar and native words), **katakana** (loanwords and foreign names) and **kanji** (Chinese characters that carry meaning). Learn hiragana first (1–2 weeks), then katakana, then kanji over time. Pronunciation is easy: only **5 vowels**, one beat per character. Grammar: **the verb comes last** (S – O – V) and **particles** (は, を, に…) follow nouns to mark their role.',
  ),
  tips: [
    l('Học **Hiragana trong 1–2 tuần** bằng cách viết tay và flashcard; đừng dựa vào romaji lâu dài.', 'Learn **hiragana in 1–2 weeks** by writing and flashcards; do not rely on romaji for long.'),
    l('Đọc to theo **nhịp**: mỗi kana một phách; chú ý âm dài (ー, おう…) và っ nhỏ.', 'Read aloud in **beats**: one kana per beat; watch long vowels (ー, おう…) and the small っ.'),
    l('Người Việt có lợi thế **âm Hán Việt**: 学生 (học sinh), 時間 (thời gian). Hãy học Kanji qua từ vựng.', 'Vietnamese speakers can lean on **Sino-Vietnamese**: 学生 (học sinh), 時間 (thời gian). Learn kanji through words.'),
    l('Nắm thật chắc **trợ từ** は, が, を, に, で: phần lớn lỗi của người mới nằm ở đây.', 'Master the **particles** は, が, を, に, で: most beginner mistakes are here.'),
    l('Học **thể lịch sự です/ます** trước, sau đó mới học thể thông thường.', 'Learn the **polite です/ます forms** first, then the casual forms.'),
  ],
  writing: {
    intro: l(
      'Hiragana và Katakana là hai bảng chữ ghi âm, **mỗi chữ là một âm tiết** (một nhịp). Hai bảng đọc giống hệt nhau, chỉ khác hình dạng và mục đích sử dụng. Kanji là chữ Hán; bắt đầu với các chữ thông dụng nhất bên dưới.',
      'Hiragana and katakana are syllabaries: **each character is one syllable** (one beat). Both read the same, they just look different and are used for different words. Kanji are Chinese characters; start with the most common ones below.',
    ),
    charts: [
      ...kanaCharts(0, 'Hiragana'),
      ...kanaCharts(1, 'Katakana'),
      {
        id: 'katakana-extended',
        title: l('Katakana mở rộng cho từ mượn', 'Extended katakana for loanwords'),
        intro: l('Các tổ hợp với chữ nhỏ ァ ィ ゥ ェ ォ dùng để ghi âm tiếng nước ngoài.', 'Combinations with small ァ ィ ゥ ェ ォ spell foreign sounds.'),
        kind: 'cards',
        glyphs: extendedKatakana,
      },
      {
        id: 'kanji-starter',
        title: l('50 Kanji nhập môn', '50 starter kanji'),
        intro: l(
          'Mỗi Kanji thường có **âm On** (gốc Hán, viết bằng katakana) và **âm Kun** (thuần Nhật, viết bằng hiragana). Âm **Hán Việt** giúp bạn đoán nghĩa rất nhanh: 学生 = học sinh, 大学 = đại học. Phần trong ngoặc là okurigana, viết bằng hiragana sau Kanji.',
          'Most kanji have an **On reading** (Chinese-derived, shown in katakana) and a **Kun reading** (native, in hiragana). The part in brackets is okurigana, written in hiragana after the kanji.',
        ),
        kind: 'cards',
        glyphs: kanji,
      },
    ],
  },
  pronunciation: {
    intro: l(
      'Âm tiếng Nhật đơn giản: **5 nguyên âm** và một ít phụ âm. Điều quan trọng nhất là **nhịp**: mỗi kana (kể cả ん, っ và âm dài) chiếm đúng một phách. Bấm vào ô để nghe.',
      'Japanese has a simple sound system: **5 vowels** and a small set of consonants. What matters most is **rhythm**: every kana (including ん, っ and long vowels) takes exactly one beat. Tap a card to listen.',
    ),
    groups: [
      { id: 'vowels', title: l('5 nguyên âm', 'The 5 vowels'), intro: l('Luôn đọc ngắn, rõ và không trượt như nguyên âm đôi tiếng Anh.', 'Always short, clear and without the gliding of English vowels.'), sounds: vowels },
      { id: 'consonants', title: l('Phụ âm cần chú ý', 'Consonants to watch'), intro: l('Đa số phụ âm giống tiếng Việt; đây là những âm hay đọc sai.', 'Most consonants are straightforward; these are the tricky ones.'), sounds: consonants },
    ],
    rules: [
      {
        id: 'mora',
        title: l('Nhịp (mora)', 'Rhythm: the mora'),
        body: l(
          'Mỗi kana là **một nhịp đều nhau**. ん, っ nhỏ và âm kéo dài cũng tính là một nhịp. Hãy vỗ tay theo nhịp khi đọc.',
          'Every kana is **one even beat**. ん, the small っ and long vowels each count as a beat too. Clap along as you read.',
        ),
        table: table(
          [l('Từ', 'Word'), l('Nhịp', 'Beats'), l('Số nhịp', 'Count')],
          [
            ['ありがとう', 'a-ri-ga-to-o', '5'],
            ['にほん', 'ni-ho-n', '3'],
            ['きって', 'ki-t-te', '3'],
            ['とうきょう', 'to-o-kyo-o', '4'],
          ],
        ),
      },
      {
        id: 'long-vowels',
        title: l('Nguyên âm dài', 'Long vowels'),
        body: l(
          'Nguyên âm dài **kéo thêm một nhịp** và có thể **đổi nghĩa** của từ. Cách viết: あ+あ, い+い, う+う, **え+い** (せんせい), **お+う** (おとうさん); Katakana dùng **ー**.',
          'A long vowel **adds one beat** and can **change the meaning**. Spellings: あ+あ, い+い, う+う, **え+い** (せんせい), **お+う** (おとうさん); katakana uses **ー**.',
        ),
        table: table(
          [l('Ngắn', 'Short'), l('Dài', 'Long')],
          [
            [l('おばさん (obasan) – cô, dì', 'おばさん (obasan) – aunt'), l('おばあさん (obāsan) – bà', 'おばあさん (obāsan) – grandmother')],
            [l('おじさん (ojisan) – chú, bác', 'おじさん (ojisan) – uncle'), l('おじいさん (ojiisan) – ông', 'おじいさん (ojiisan) – grandfather')],
            [l('ゆき (yuki) – tuyết', 'ゆき (yuki) – snow'), l('ゆうき (yūki) – dũng khí', 'ゆうき (yūki) – courage')],
          ],
        ),
      },
      {
        id: 'small-tsu',
        title: l('っ nhỏ: ngắt hơi một nhịp', 'Small っ: a one-beat pause'),
        body: l(
          'っ nhỏ (sokuon) làm **dừng một nhịp** trước phụ âm sau nó, romaji viết gấp đôi phụ âm. Bỏ っ có thể đổi nghĩa hoàn toàn.',
          'The small っ (sokuon) is **a one-beat pause** before the next consonant; romaji doubles the consonant. Dropping it can change the meaning.',
        ),
        table: table(
          [l('Không có っ', 'Without っ'), l('Có っ', 'With っ')],
          [
            [l('きて (kite) – hãy đến', 'きて (kite) – come'), l('きって (kitte) – con tem', 'きって (kitte) – stamp')],
            [l('いた (ita) – đã ở', 'いた (ita) – was (there)'), l('いった (itta) – đã đi', 'いった (itta) – went')],
            [l('さか (saka) – con dốc', 'さか (saka) – slope'), l('さっか (sakka) – nhà văn', 'さっか (sakka) – writer')],
          ],
        ),
      },
      {
        id: 'n-sound',
        title: l('Cách đọc ん', 'How ん changes'),
        body: l(
          'ん đổi cách đọc theo âm đứng sau: trước **m, b, p** đọc [m]; trước **n, t, d, r** đọc [n]; trước **k, g** đọc [ŋ] (ng); ở cuối từ là âm mũi [ɴ].',
          'ん adapts to the next sound: [m] before **m, b, p**; [n] before **n, t, d, r**; [ŋ] before **k, g**; a back nasal [ɴ] at the end of a word.',
        ),
        table: table(
          [l('Trước', 'Before'), l('Đọc', 'Sounds'), l('Ví dụ', 'Example')],
          [
            ['m · b · p', '[m]', 'しんぶん (shimbun), さんぽ (sampo)'],
            ['n · t · d · r', '[n]', 'こんにちは, ほんとう'],
            ['k · g', '[ŋ]', 'りんご, げんき'],
            [l('cuối từ', 'word end'), '[ɴ]', 'ほん, にほん'],
          ],
        ),
      },
      {
        id: 'devoicing',
        title: l('Nguyên âm bị lướt', 'Devoiced vowels'),
        body: l(
          'i và u nằm giữa hai phụ âm vô thanh, hoặc ở cuối câu sau phụ âm vô thanh, thường **gần như không đọc ra**.',
          'i and u between voiceless consonants, or at the end after a voiceless consonant, are often **almost silent**.',
        ),
        examples: [
          ex('です → "des"', 'です đọc gần như "đét"', 'です sounds like "des"', 'desu'),
          ex('します → "shimas"', 'します đọc gần như "shi-mát"', 'します sounds like "shimas"', 'shimasu'),
          ex('すき → "ski"', 'すき (thích) đọc gần như "ski"', 'すき (like) sounds like "ski"', 'suki'),
        ],
      },
      {
        id: 'particles-reading',
        title: l('Trợ từ は, へ, を đọc khác', 'The particles は, へ, を'),
        body: l(
          'Khi làm **trợ từ**: は đọc **wa**, へ đọc **e**, を đọc **o**. Trong từ thường vẫn đọc ha, he: はな (hana), へや (heya).',
          'As **particles**, は is read **wa**, へ is **e** and を is **o**. Inside normal words they keep ha, he: はな (hana), へや (heya).',
        ),
        examples: [
          ex('わたし**は**がくせいです。', 'Tôi là sinh viên. (は đọc "wa")', 'I am a student. (は read "wa")', 'Watashi wa gakusei desu.'),
          ex('がっこう**へ**いきます。', 'Tôi đi đến trường. (へ đọc "e")', 'I go to school. (へ read "e")', 'Gakkō e ikimasu.'),
          ex('パン**を**たべます。', 'Tôi ăn bánh mì. (を đọc "o")', 'I eat bread. (を read "o")', 'Pan o tabemasu.'),
        ],
      },
      {
        id: 'pitch-accent',
        title: l('Trọng âm cao độ', 'Pitch accent'),
        body: l(
          'Tiếng Nhật không nhấn mạnh bằng độ to mà bằng **cao độ** (cao – thấp). Một số từ chỉ khác nhau ở cao độ. Người mới không cần quá lo vì ngữ cảnh thường đủ rõ, nhưng hãy bắt chước giọng người bản ngữ.',
          'Japanese marks words with **pitch** (high – low) rather than loudness. Some words differ only in pitch. Beginners need not worry much, as context usually helps, but imitate native speakers.',
        ),
        table: table(
          [l('Từ', 'Word'), l('Cao – thấp', 'Pitch'), l('Nghĩa', 'Meaning')],
          [
            ['はし (箸)', 'HA-shi ↘', l('đôi đũa', 'chopsticks')],
            ['はし (橋)', 'ha-SHI ↗', l('cây cầu', 'bridge')],
            ['あめ (雨)', 'A-me ↘', l('mưa', 'rain')],
            ['あめ (飴)', 'a-ME ↗', l('kẹo', 'candy')],
          ],
        ),
      },
    ],
  },
  grammar,
}

export default content
