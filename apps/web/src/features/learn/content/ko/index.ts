import { composeSyllable, indexOfInitial, indexOfVowel, romanizeSyllable, syllableIpa } from '../../lib/hangul'
import type { GridRow, StudyContent } from '../../types'
import { ex, glyph, l, table, word } from '../helpers'
import grammar from './grammar'

const vowels = [
  glyph('ㅏ', '[a]', { roman: 'a', example: word('아빠', l('bố', 'dad'), { roman: 'appa' }), tip: l('Như "a" tiếng Việt.', 'Like "a" in "father".'), speak: '아' }),
  glyph('ㅑ', '[ja]', { roman: 'ya', example: word('야구', l('bóng chày', 'baseball'), { roman: 'yagu' }), tip: l('"ia" đọc lướt thành một âm.', 'Like "ya" in "yard".'), speak: '야' }),
  glyph('ㅓ', '[ʌ]', { roman: 'eo', example: word('어머니', l('mẹ', 'mother'), { roman: 'eomeoni' }), tip: l('Gần "ơ" nhưng mở miệng rộng hơn. Đừng đọc thành "e-o".', 'Like "u" in "cup"; never "e-o".'), speak: '어' }),
  glyph('ㅕ', '[jʌ]', { roman: 'yeo', example: word('여자', l('phụ nữ', 'woman'), { roman: 'yeoja' }), tip: l('ㅓ có thêm "i" lướt ở đầu: "iơ".', '"y" + ㅓ, like "yu" in "young".'), speak: '여' }),
  glyph('ㅗ', '[o]', { roman: 'o', example: word('오이', l('dưa chuột', 'cucumber'), { roman: 'oi' }), tip: l('Như "ô", tròn môi.', 'A pure "o" with rounded lips.'), speak: '오' }),
  glyph('ㅛ', '[jo]', { roman: 'yo', example: word('요리', l('món ăn, nấu ăn', 'cooking'), { roman: 'yori' }), tip: l('"iô" đọc liền.', 'Like "yo" in "yoga".'), speak: '요' }),
  glyph('ㅜ', '[u]', { roman: 'u', example: word('우유', l('sữa', 'milk'), { roman: 'uyu' }), tip: l('Như "u".', 'Like "oo" in "moon".'), speak: '우' }),
  glyph('ㅠ', '[ju]', { roman: 'yu', example: word('유리', l('thuỷ tinh', 'glass'), { roman: 'yuri' }), tip: l('"iu" đọc liền.', 'Like "you".'), speak: '유' }),
  glyph('ㅡ', '[ɯ]', { roman: 'eu', example: word('그림', l('bức tranh', 'picture'), { roman: 'geurim' }), tip: l('Chính là "ư" tiếng Việt — người Việt đọc âm này rất chuẩn!', 'Say "oo" with your lips spread flat.'), speak: '으' }),
  glyph('ㅣ', '[i]', { roman: 'i', example: word('이름', l('tên', 'name'), { roman: 'ireum' }), tip: l('Như "i".', 'Like "ee".'), speak: '이' }),
]

const consonants = [
  glyph('ㄱ', '[k] ~ [g]', {
    name: '기역',
    roman: 'g / k',
    example: word('가방', l('cái cặp', 'bag'), { roman: 'gabang' }),
    tip: l('Đầu từ: "c/k" nhẹ, không bật hơi; giữa hai nguyên âm: "g"; cuối âm tiết: "c" như trong "các".', 'A light k at the start, a g between vowels, an unreleased k at the end.'),
    speak: '기역',
  }),
  glyph('ㄴ', '[n]', { name: '니은', roman: 'n', example: word('나무', l('cái cây', 'tree'), { roman: 'namu' }), tip: l('Như "n".', 'Like "n".'), speak: '니은' }),
  glyph('ㄷ', '[t] ~ [d]', {
    name: '디귿',
    roman: 'd / t',
    example: word('다리', l('chân; cây cầu', 'leg; bridge'), { roman: 'dari' }),
    tip: l('Đầu từ: "t" nhẹ; giữa hai nguyên âm: gần "đ"; cuối âm tiết: "t" như trong "mát".', 'A light t at the start, a d between vowels, an unreleased t at the end.'),
    speak: '디귿',
  }),
  glyph('ㄹ', '[ɾ] ~ [l]', {
    name: '리을',
    roman: 'r / l',
    example: word('라면', l('mì gói', 'instant noodles'), { roman: 'ramyeon' }),
    tip: l('Giữa hai nguyên âm: "r" chạm lưỡi một lần, không rung; cuối âm tiết: "l".', 'A light tap between vowels; "l" at the end of a syllable.'),
    speak: '리을',
  }),
  glyph('ㅁ', '[m]', { name: '미음', roman: 'm', example: word('머리', l('đầu; tóc', 'head; hair'), { roman: 'meori' }), tip: l('Như "m".', 'Like "m".'), speak: '미음' }),
  glyph('ㅂ', '[p] ~ [b]', {
    name: '비읍',
    roman: 'b / p',
    example: word('바다', l('biển', 'sea'), { roman: 'bada' }),
    tip: l('Đầu từ: "p" nhẹ, không bật hơi; giữa hai nguyên âm: "b"; cuối âm tiết: "p" như trong "đáp".', 'A light p at the start, a b between vowels, an unreleased p at the end.'),
    speak: '비읍',
  }),
  glyph('ㅅ', '[s] ~ [ɕ]', {
    name: '시옷',
    roman: 's / t',
    example: word('사람', l('người', 'person'), { roman: 'saram' }),
    tip: l('Như "x" tiếng Việt; trước ㅣ đọc gần "shi" (시). Cuối âm tiết đọc "t".', 'Like "s"; before ㅣ it sounds like "sh" (시). At the end of a syllable it becomes t.'),
    speak: '시옷',
  }),
  glyph('ㅇ', '∅ ~ [ŋ]', {
    name: '이응',
    roman: '– / ng',
    example: word('아이', l('đứa trẻ', 'child'), { roman: 'ai' }),
    tip: l('Đầu âm tiết: **câm**, chỉ giữ chỗ cho nguyên âm. Cuối âm tiết: "ng".', 'At the start of a syllable it is **silent**, a placeholder. At the end it is "ng".'),
    speak: '이응',
  }),
  glyph('ㅈ', '[tɕ] ~ [dʑ]', {
    name: '지읒',
    roman: 'j / t',
    example: word('지도', l('bản đồ', 'map'), { roman: 'jido' }),
    tip: l('Giữa "ch" và "gi" tiếng Việt, không bật hơi.', 'Between "ch" and "j", with no puff of air.'),
    speak: '지읒',
  }),
  glyph('ㅊ', '[tɕʰ]', { name: '치읓', roman: 'ch / t', example: word('치마', l('cái váy', 'skirt'), { roman: 'chima' }), tip: l('"ch" bật mạnh hơi.', 'A "ch" with a strong puff of air.'), speak: '치읓' }),
  glyph('ㅋ', '[kʰ]', {
    name: '키읔',
    roman: 'k',
    example: word('커피', l('cà phê', 'coffee'), { roman: 'keopi' }),
    tip: l('"k" bật hơi mạnh như tiếng Anh "key". Không phải "kh" tiếng Việt.', 'A strongly aspirated k, as in "key".'),
    speak: '키읔',
  }),
  glyph('ㅌ', '[tʰ]', { name: '티읕', roman: 't', example: word('토끼', l('con thỏ', 'rabbit'), { roman: 'tokki' }), tip: l('Như "th" tiếng Việt — 토끼 nghe gần giống "thỏ"!', 'A strongly aspirated t, as in "top".'), speak: '티읕' }),
  glyph('ㅍ', '[pʰ]', {
    name: '피읖',
    roman: 'p',
    example: word('포도', l('quả nho', 'grapes'), { roman: 'podo' }),
    tip: l('"p" bật hơi mạnh như tiếng Anh "pen". Không phải "ph".', 'A strongly aspirated p, as in "pen". Not "f".'),
    speak: '피읖',
  }),
  glyph('ㅎ', '[h]', { name: '히읗', roman: 'h', example: word('하나', l('một', 'one'), { roman: 'hana' }), tip: l('Như "h"; thường yếu đi giữa các âm hữu thanh.', 'Like "h"; it often fades between voiced sounds.'), speak: '히읗' }),
]

const tenseConsonants = [
  glyph('ㄲ', '[k͈]', { name: '쌍기역', roman: 'kk', example: word('꼬리', l('cái đuôi', 'tail'), { roman: 'kkori' }), tip: l('Căng cổ họng, không có hơi — rất gần "c" trong "cá".', 'Tight throat, no breath — like the k in "sky".'), speak: '쌍기역' }),
  glyph('ㄸ', '[t͈]', { name: '쌍디귿', roman: 'tt', example: word('딸기', l('dâu tây', 'strawberry'), { roman: 'ttalgi' }), tip: l('Gần "t" tiếng Việt (tá), gọn và căng.', 'Like the t in "stop".'), speak: '쌍디귿' }),
  glyph('ㅃ', '[p͈]', { name: '쌍비읍', roman: 'pp', example: word('빵', l('bánh mì', 'bread'), { roman: 'ppang' }), tip: l('Mím chặt môi rồi bật gọn, không có hơi.', 'Like the p in "spin".'), speak: '쌍비읍' }),
  glyph('ㅆ', '[s͈]', { name: '쌍시옷', roman: 'ss', example: word('싸다', l('rẻ', 'cheap'), { roman: 'ssada' }), tip: l('"s" căng và sắc hơn ㅅ.', 'A tense, sharper s.'), speak: '쌍시옷' }),
  glyph('ㅉ', '[t͈ɕ]', { name: '쌍지읒', roman: 'jj', example: word('짜다', l('mặn', 'salty'), { roman: 'jjada' }), tip: l('"ch" căng, gọn, không có hơi.', 'A tense ch with no breath.'), speak: '쌍지읒' }),
]

const compoundVowels = [
  glyph('ㅐ', '[ɛ]', { roman: 'ae', example: word('개', l('con chó', 'dog'), { roman: 'gae' }), tip: l('Như "e" tiếng Việt; ngày nay đọc gần như ㅔ.', 'Like "e" in "bed"; today it sounds almost the same as ㅔ.'), speak: '애' }),
  glyph('ㅒ', '[jɛ]', { roman: 'yae', example: word('얘기', l('câu chuyện', 'chat, story'), { roman: 'yaegi' }), tip: l('Hiếm gặp; "ie" đọc liền.', 'Rare; "ye" as in "yes".'), speak: '얘' }),
  glyph('ㅔ', '[e]', { roman: 'e', example: word('네', l('vâng', 'yes'), { roman: 'ne' }), tip: l('Như "ê"; người Hàn hiện nay đọc ㅐ và ㅔ gần như giống nhau.', 'Like "e" in "bed"; most speakers no longer distinguish it from ㅐ.'), speak: '에' }),
  glyph('ㅖ', '[je]', { roman: 'ye', example: word('시계', l('đồng hồ', 'clock, watch'), { roman: 'sigye' }), tip: l('Sau phụ âm thường đọc như ㅔ: 시계 → [시게].', 'After a consonant it often sounds like ㅔ: 시계 → [시게].'), speak: '예' }),
  glyph('ㅘ', '[wa]', { roman: 'wa', example: word('과자', l('bánh kẹo', 'snack'), { roman: 'gwaja' }), tip: l('ㅗ + ㅏ: "oa".', 'ㅗ + ㅏ: "wa".'), speak: '와' }),
  glyph('ㅙ', '[wɛ]', { roman: 'wae', example: word('왜', l('tại sao', 'why'), { roman: 'wae' }), tip: l('ㅗ + ㅐ: "oe".', 'ㅗ + ㅐ: "we" as in "wet".'), speak: '왜' }),
  glyph('ㅚ', '[we]', { roman: 'oe', example: word('회사', l('công ty', 'company'), { roman: 'hoesa' }), tip: l('Viết ㅗ + ㅣ nhưng ngày nay đọc "uê", giống ㅙ và ㅞ.', 'Written ㅗ + ㅣ but pronounced "we" today, like ㅙ and ㅞ.'), speak: '외' }),
  glyph('ㅝ', '[wʌ]', { roman: 'wo', example: word('뭐', l('cái gì', 'what'), { roman: 'mwo' }), tip: l('ㅜ + ㅓ: "uơ".', 'ㅜ + ㅓ: "wo" as in "won".'), speak: '워' }),
  glyph('ㅞ', '[we]', { roman: 'we', example: word('웨이터', l('bồi bàn', 'waiter'), { roman: 'weiteo' }), tip: l('ㅜ + ㅔ: "uê"; hiếm gặp.', 'ㅜ + ㅔ: "we"; rare.'), speak: '웨' }),
  glyph('ㅟ', '[wi]', { roman: 'wi', example: word('귀', l('cái tai', 'ear'), { roman: 'gwi' }), tip: l('ㅜ + ㅣ: "uy".', 'ㅜ + ㅣ: "wee".'), speak: '위' }),
  glyph('ㅢ', '[ɰi]', { roman: 'ui', example: word('의자', l('cái ghế', 'chair'), { roman: 'uija' }), tip: l('Lướt nhanh "ư" + "i". Cách đọc thay đổi theo vị trí (xem phần Phát âm).', 'Glide from "eu" to "i". Its sound changes by position (see Pronunciation).'), speak: '의' }),
]

const syllableBlocks = [
  glyph('가', '[ka]', { roman: 'ga', example: word('가다', l('đi', 'to go'), { roman: 'gada' }), tip: l('ㄱ + ㅏ: nguyên âm **dọc** (ㅏ ㅑ ㅓ ㅕ ㅣ ㅐ ㅔ) viết bên **phải** phụ âm.', 'ㄱ + ㅏ: **vertical** vowels (ㅏ ㅑ ㅓ ㅕ ㅣ ㅐ ㅔ) go to the **right** of the consonant.') }),
  glyph('고', '[ko]', { roman: 'go', example: word('고기', l('thịt', 'meat'), { roman: 'gogi' }), tip: l('ㄱ + ㅗ: nguyên âm **ngang** (ㅗ ㅛ ㅜ ㅠ ㅡ) viết **bên dưới** phụ âm.', 'ㄱ + ㅗ: **horizontal** vowels (ㅗ ㅛ ㅜ ㅠ ㅡ) go **under** the consonant.') }),
  glyph('아', '[a]', { roman: 'a', example: word('아이', l('đứa trẻ', 'child'), { roman: 'ai' }), tip: l('Âm tiết bắt đầu bằng nguyên âm luôn có **ㅇ câm** đứng trước: ㅇ + ㅏ.', 'A syllable that starts with a vowel always gets a **silent ㅇ**: ㅇ + ㅏ.') }),
  glyph('과', '[kwa]', { roman: 'gwa', example: word('과일', l('hoa quả', 'fruit'), { roman: 'gwail' }), tip: l('ㄱ + ㅘ: nguyên âm ghép vừa nằm dưới vừa nằm bên phải phụ âm.', 'ㄱ + ㅘ: compound vowels wrap below and to the right.') }),
  glyph('한', '[han]', { roman: 'han', example: word('한국', l('Hàn Quốc', 'Korea'), { roman: 'Hanguk' }), tip: l('ㅎ + ㅏ + ㄴ: phụ âm cuối (**patchim**) luôn nằm ở **đáy** khối.', 'ㅎ + ㅏ + ㄴ: the final consonant (**batchim**) always sits at the **bottom**.') }),
  glyph('국', '[kuk̚]', { roman: 'guk', example: word('국', l('canh, súp', 'soup'), { roman: 'guk' }), tip: l('ㄱ + ㅜ + ㄱ: nguyên âm ngang và patchim xếp chồng từ trên xuống.', 'ㄱ + ㅜ + ㄱ: a horizontal vowel and a batchim stack from top to bottom.') }),
  glyph('닭', '[tak̚]', { roman: 'dak', example: word('닭', l('con gà', 'chicken'), { roman: 'dak' }), tip: l('ㄷ + ㅏ + ㄺ: **patchim kép**, thường chỉ đọc một phụ âm → [닥].', 'ㄷ + ㅏ + ㄺ: a **double batchim**; usually only one consonant is heard → [닥].') }),
]

const finals = [
  glyph('ㄱ', '[k̚]', { roman: '-k', sounds: 'ㄱ · ㅋ · ㄲ', example: word('책', l('quyển sách', 'book'), { roman: 'chaek' }), tip: l('Giống "c" cuối trong "các": chặn hơi, không bật ra. 부엌 → [부억].', 'An unreleased k, with no puff of air. 부엌 → [부억].'), speak: '책' }),
  glyph('ㄴ', '[n]', { roman: '-n', sounds: 'ㄴ', example: word('산', l('ngọn núi', 'mountain'), { roman: 'san' }), tip: l('Như "n" cuối.', 'Like a final "n".'), speak: '산' }),
  glyph('ㄷ', '[t̚]', {
    roman: '-t',
    sounds: 'ㄷ · ㅅ · ㅆ · ㅈ · ㅊ · ㅌ · ㅎ',
    example: word('옷', l('quần áo', 'clothes'), { roman: 'ot' }),
    tip: l('Bảy phụ âm cùng đọc "t" chặn hơi như trong "mát": 꽃 → [꼳], 있다 → [읻따].', 'Seven letters all become an unreleased t: 꽃 → [꼳], 있다 → [읻따].'),
    speak: '옷',
  }),
  glyph('ㄹ', '[l]', { roman: '-l', sounds: 'ㄹ', example: word('물', l('nước', 'water'), { roman: 'mul' }), tip: l('Đầu lưỡi đặt sau răng trên và giữ nguyên: "mul".', 'Keep the tongue tip behind the upper teeth: "mul".'), speak: '물' }),
  glyph('ㅁ', '[m]', { roman: '-m', sounds: 'ㅁ', example: word('밤', l('ban đêm; hạt dẻ', 'night; chestnut'), { roman: 'bam' }), tip: l('Như "m" cuối.', 'Like a final "m".'), speak: '밤' }),
  glyph('ㅂ', '[p̚]', { roman: '-p', sounds: 'ㅂ · ㅍ', example: word('밥', l('cơm', 'cooked rice'), { roman: 'bap' }), tip: l('Giống "p" cuối trong "đáp": mím môi, không bật hơi. 앞 → [압].', 'An unreleased p: close the lips without a puff. 앞 → [압].'), speak: '밥' }),
  glyph('ㅇ', '[ŋ]', { roman: '-ng', sounds: 'ㅇ', example: word('방', l('căn phòng', 'room'), { roman: 'bang' }), tip: l('Như "ng" cuối: "bang".', 'Like "ng" in "sing".'), speak: '방' }),
]

const GRID_INITIALS = ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅅ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ']
const GRID_VOWELS = ['ㅏ', 'ㅑ', 'ㅓ', 'ㅕ', 'ㅗ', 'ㅛ', 'ㅜ', 'ㅠ', 'ㅡ', 'ㅣ']

const syllableRows: GridRow[] = GRID_INITIALS.map((consonant) => {
  const initial = indexOfInitial(consonant)
  return {
    label: consonant,
    cells: GRID_VOWELS.map((vowelChar) => {
      const vowel = indexOfVowel(vowelChar)
      return { char: composeSyllable(initial, vowel), roman: romanizeSyllable(initial, vowel), ipa: syllableIpa(initial, vowel) }
    }),
  }
})

const vowelSounds = [
  { ipa: 'a', label: l('ㅏ', 'ㅏ'), examples: ['**아**빠 (appa)', '**가**방 (gabang)'], tip: l('Như "a" tiếng Việt.', 'Like "a" in "father".'), speak: '아빠' },
  { ipa: 'ʌ', label: l('ㅓ', 'ㅓ'), examples: ['**어**머니 (eomeoni)', '**머**리 (meori)'], tip: l('Gần "ơ" nhưng miệng mở rộng hơn; đừng đọc thành "o".', 'Like "u" in "cup"; do not round it into "o".'), speak: '어머니' },
  { ipa: 'o', label: l('ㅗ', 'ㅗ'), examples: ['**오**이 (oi)', '**고**기 (gogi)'], tip: l('"ô" tròn môi. Phân biệt rõ với ㅓ: 거 (geo) ≠ 고 (go).', 'A rounded "o". Keep it distinct from ㅓ: 거 ≠ 고.'), speak: '고기' },
  { ipa: 'u', label: l('ㅜ', 'ㅜ'), examples: ['**우**유 (uyu)', '**누**나 (nuna)'], tip: l('Như "u" tiếng Việt.', 'Like "oo" in "food".'), speak: '우유' },
  { ipa: 'ɯ', label: l('ㅡ', 'ㅡ'), examples: ['**그**림 (geurim)', '**크**다 (keuda)'], tip: l('Như "ư" tiếng Việt: môi dẹt, không tròn.', 'An "oo" with flat, unrounded lips.'), speak: '그림' },
  { ipa: 'i', label: l('ㅣ', 'ㅣ'), examples: ['**이**름 (ireum)', '**김**치 (gimchi)'], tip: l('Như "i".', 'Like "ee".'), speak: '김치' },
  { ipa: 'e', label: l('ㅐ · ㅔ', 'ㅐ · ㅔ'), examples: ['**개** (gae)', '**게** (ge)'], tip: l('Hầu hết người Hàn đọc ㅐ và ㅔ giống nhau, giữa "e" và "ê". Chỉ cần nhớ chính tả.', 'Most Koreans say ㅐ and ㅔ the same way. You just have to learn the spelling.'), speak: '개' },
  { ipa: 'ɰi', label: l('ㅢ', 'ㅢ'), examples: ['**의**사 (uisa)', '**의**자 (uija)'], tip: l('Lướt nhanh từ "ư" sang "i".', 'Glide quickly from "eu" to "i".'), speak: '의사' },
]

const tripletSounds = [
  { ipa: 'k', label: l('ㄱ — thường', 'ㄱ — plain'), examples: ['**가**방 (gabang)', '**고**기 (gogi)'], tip: l('Nhẹ, giữa "c" và "g", hơi thở ra vừa phải.', 'Light, between k and g, with a little breath.'), speak: '가방' },
  { ipa: 'kʰ', label: l('ㅋ — bật hơi', 'ㅋ — aspirated'), examples: ['**코** (ko)', '**커**피 (keopi)'], tip: l('"k" phả mạnh hơi như tiếng Anh "kite".', 'A strong puff of air, as in "kite".'), speak: '커피' },
  { ipa: 'k͈', label: l('ㄲ — căng', 'ㄲ — tense'), examples: ['**꼬**리 (kkori)', '**까**치 (kkachi)'], tip: l('Rất gần "c" trong "cá": căng, gọn, không có hơi.', 'Tight and breathless, like the k in "sky".'), speak: '꼬리' },
  { ipa: 't', label: l('ㄷ — thường', 'ㄷ — plain'), examples: ['**달** (dal)', '**다**리 (dari)'], tip: l('Nhẹ, gần "đ" khi ở giữa từ.', 'Light; close to d between vowels.'), speak: '달' },
  { ipa: 'tʰ', label: l('ㅌ — bật hơi', 'ㅌ — aspirated'), examples: ['**탈** (tal)', '**토**끼 (tokki)'], tip: l('Giống "th" tiếng Việt.', 'A strong puff of air, as in "top".'), speak: '탈' },
  { ipa: 't͈', label: l('ㄸ — căng', 'ㄸ — tense'), examples: ['**딸** (ttal)', '**딸**기 (ttalgi)'], tip: l('Giống "t" tiếng Việt (tá).', 'Like the t in "stop".'), speak: '딸' },
  { ipa: 'p', label: l('ㅂ — thường', 'ㅂ — plain'), examples: ['**불** (bul)', '**바**다 (bada)'], tip: l('Nhẹ, giữa "p" và "b".', 'Light, between p and b.'), speak: '불' },
  { ipa: 'pʰ', label: l('ㅍ — bật hơi', 'ㅍ — aspirated'), examples: ['**풀** (pul)', '**포**도 (podo)'], tip: l('"p" bật mạnh hơi như tiếng Anh "pen".', 'A strong puff of air, as in "pen".'), speak: '풀' },
  { ipa: 'p͈', label: l('ㅃ — căng', 'ㅃ — tense'), examples: ['**뿔** (ppul)', '**빵** (ppang)'], tip: l('Mím chặt môi, bật gọn, không có hơi.', 'Lips pressed tight, no breath, like the p in "spin".'), speak: '뿔' },
  { ipa: 'tɕ', label: l('ㅈ — thường', 'ㅈ — plain'), examples: ['**자**다 (jada)', '**지**도 (jido)'], tip: l('"ch" nhẹ, giữa "ch" và "gi".', 'A light ch, between ch and j.'), speak: '자다' },
  { ipa: 'tɕʰ', label: l('ㅊ — bật hơi', 'ㅊ — aspirated'), examples: ['**차**다 (chada)', '**치**마 (chima)'], tip: l('"ch" bật mạnh hơi.', 'A ch with a strong puff of air.'), speak: '차다' },
  { ipa: 't͈ɕ', label: l('ㅉ — căng', 'ㅉ — tense'), examples: ['**짜**다 (jjada)', '**찌**개 (jjigae)'], tip: l('"ch" căng, gọn như trong "chà".', 'A tight ch with no breath.'), speak: '짜다' },
  { ipa: 's', label: l('ㅅ — thường', 'ㅅ — plain'), examples: ['**사**다 (sada)', '**소** (so)'], tip: l('"s" nhẹ, có chút hơi.', 'A soft, slightly breathy s.'), speak: '사다' },
  { ipa: 's͈', label: l('ㅆ — căng', 'ㅆ — tense'), examples: ['**싸**다 (ssada)', '**쌀** (ssal)'], tip: l('"s" căng, sắc, rõ.', 'A sharp, tense s.'), speak: '싸다' },
]

const otherConsonants = [
  { ipa: 'ɾ', label: l('ㄹ giữa hai nguyên âm', 'ㄹ between vowels'), examples: ['나**라** (nara)', '사**랑** (sarang)'], tip: l('Đầu lưỡi chạm nhẹ một lần, gần "r" nhưng không rung.', 'One light tap of the tongue.'), speak: '사랑' },
  { ipa: 'l', label: l('ㄹ cuối âm tiết', 'ㄹ at the end'), examples: ['**물** (mul)', '서**울** (Seoul)'], tip: l('Lưỡi giữ ở lợi trên như "l". ㄹㄹ đọc là [l] dài: 빨리 (ppalli).', 'Tongue tip held up like "l". ㄹㄹ is a long [l]: 빨리 (ppalli).'), speak: '서울' },
  { ipa: 'ŋ', label: l('ㅇ cuối âm tiết', 'ㅇ at the end'), examples: ['**방** (bang)', '사**랑** (sarang)'], tip: l('Như "ng" tiếng Việt. Ở đầu âm tiết ㅇ câm.', 'Like "ng" in "sing". At the start of a syllable ㅇ is silent.'), speak: '방' },
  { ipa: 'ɕ', label: l('ㅅ trước ㅣ', 'ㅅ before ㅣ'), examples: ['**시**간 (sigan)', '**신**발 (sinbal)'], tip: l('ㅅ trước ㅣ đọc gần "shi": 시 [ɕi].', 'Before ㅣ, ㅅ sounds like "sh": 시 [ɕi].'), speak: '시간' },
  { ipa: 'h', label: l('ㅎ', 'ㅎ'), examples: ['**하**나 (hana)', '**한**국 (Hanguk)'], tip: l('Như "h"; giữa các âm hữu thanh thường gần như mất: 전화 → [저놔].', 'Like "h"; between voiced sounds it often fades: 전화 → [저놔].'), speak: '한국' },
]

const content: StudyContent = {
  overview: l(
    '**Hangul** là bảng chữ cái ghép âm rất khoa học: 14 phụ âm + 10 nguyên âm cơ bản, ghép thành **khối âm tiết** (ㅎ + ㅏ + ㄴ = 한). Bạn có thể đọc được chỉ sau vài ngày. Ngữ pháp giống tiếng Nhật: **động từ đứng cuối** (S – O – V), **tiểu từ** đứng sau danh từ (은/는, 이/가, 을/를) và **đuôi câu** thể hiện mức độ lịch sự. Khoảng 60% từ vựng là **từ Hán Hàn**, rất gần âm Hán Việt: 학생 (hak-saeng) = học sinh, 감사 (gam-sa) = cảm tạ.',
    '**Hangul** is a remarkably logical alphabet: 14 basic consonants and 10 basic vowels stacked into **syllable blocks** (ㅎ + ㅏ + ㄴ = 한). You can learn to read it in a few days. The grammar resembles Japanese: **the verb comes last** (S – O – V), **particles** follow nouns (은/는, 이/가, 을/를), and **sentence endings** show the level of politeness. About 60% of the vocabulary comes from Chinese.',
  ),
  tips: [
    l('Học Hangul trong **3–5 ngày**: nguyên âm, phụ âm rồi patchim. Bỏ phiên âm Latin càng sớm càng tốt.', 'Learn Hangul in **3–5 days**: vowels, consonants, then batchim. Drop the romanisation as soon as you can.'),
    l('Luyện tai phân biệt ba loại phụ âm: thường – bật hơi – căng (달 / 탈 / 딸).', 'Train your ear for the three consonant types: plain – aspirated – tense (달 / 탈 / 딸).'),
    l('Nắm thật chắc đuôi **-아요/어요**: đây là thể lịch sự dùng nhiều nhất trong hội thoại.', 'Master the **-아요/어요** ending first: it is the polite form you will use most.'),
    l('Khai thác **từ Hán Hàn**: 도서관 (đồ thư quán = thư viện), 운동 (vận động), 가족 (gia tộc).', 'Spot **Sino-Korean** roots: 도서관 (library), 운동 (exercise), 가족 (family) share patterns with Chinese.'),
    l('Học các quy tắc biến âm dần dần khi đã đọc trôi chảy; đừng cố thuộc tất cả từ đầu.', 'Pick up the sound-change rules gradually once you read fluently; don\'t try to memorise them all at once.'),
  ],
  writing: {
    intro: l(
      '**Hangul** (한글) được vua Sejong tạo ra năm 1443 và công bố năm 1446. Chữ cái được **ghép thành khối vuông**, mỗi khối là một âm tiết: ㅎ + ㅏ + ㄴ = **한**. Chỉ với 14 phụ âm và 10 nguyên âm cơ bản, bạn có thể đọc mọi chữ sau vài ngày luyện tập.',
      '**Hangul** (한글) was created by King Sejong in 1443 and published in 1446. Letters are **stacked into square blocks**, one block per syllable: ㅎ + ㅏ + ㄴ = **한**. With 14 basic consonants and 10 basic vowels you can read anything after a few days of practice.',
    ),
    charts: [
      {
        id: 'vowels',
        title: l('10 nguyên âm cơ bản', 'The 10 basic vowels'),
        intro: l(
          'Nguyên âm được tạo từ ba nét: chấm/gạch ngắn (trời), gạch ngang ㅡ (đất) và gạch đứng ㅣ (người). Thêm một nét ngắn là thêm âm "y": ㅏ → ㅑ.',
          'Vowels are built from three strokes: a short tick (heaven), a flat line ㅡ (earth) and an upright line ㅣ (person). An extra tick adds a "y": ㅏ → ㅑ.',
        ),
        kind: 'cards',
        glyphs: vowels,
      },
      {
        id: 'consonants',
        title: l('14 phụ âm cơ bản', 'The 14 basic consonants'),
        intro: l(
          'Hình dạng phụ âm mô phỏng **vị trí lưỡi và miệng** khi phát âm: ㄱ là lưỡi chạm vòm sau, ㄴ là lưỡi chạm lợi, ㅁ là đôi môi. Tên chữ nằm dưới mỗi chữ cái.',
          'Consonant shapes picture **the mouth and tongue**: ㄱ is the tongue touching the back of the mouth, ㄴ the tongue behind the teeth, ㅁ the lips. Each letter\'s name is shown underneath.',
        ),
        kind: 'cards',
        glyphs: consonants,
      },
      {
        id: 'syllable-blocks',
        title: l('Cách ghép khối âm tiết', 'How syllable blocks work'),
        intro: l(
          'Mỗi khối = **phụ âm đầu + nguyên âm (+ phụ âm cuối)**. Vị trí của nguyên âm quyết định hình dạng khối.',
          'Each block = **initial consonant + vowel (+ final consonant)**. The vowel\'s shape decides the layout.',
        ),
        kind: 'cards',
        glyphs: syllableBlocks,
      },
      {
        id: 'syllable-grid',
        title: l('Bảng ghép âm tiết cơ bản', 'Basic syllable chart'),
        intro: l('14 phụ âm × 10 nguyên âm. Bấm vào ô để nghe; đọc hết bảng là bạn đã đọc được phần lớn tiếng Hàn.', '14 consonants × 10 vowels. Tap a cell to listen; once you can read this chart, you can read most Korean.'),
        kind: 'grid',
        columns: GRID_VOWELS,
        rows: syllableRows,
      },
      {
        id: 'tense-consonants',
        title: l('5 phụ âm căng (phụ âm đôi)', 'The 5 tense (double) consonants'),
        intro: l('Viết đôi phụ âm thường để được âm **căng**: phát âm gọn, căng cổ họng và không có hơi.', 'Doubling a plain consonant makes it **tense**: short, tight and without a puff of air.'),
        kind: 'cards',
        glyphs: tenseConsonants,
      },
      {
        id: 'compound-vowels',
        title: l('11 nguyên âm ghép', 'The 11 compound vowels'),
        intro: l('Ghép hai nguyên âm cơ bản: ㅗ + ㅏ = ㅘ, ㅜ + ㅓ = ㅝ, ㅏ + ㅣ = ㅐ.', 'Two basic vowels combined: ㅗ + ㅏ = ㅘ, ㅜ + ㅓ = ㅝ, ㅏ + ㅣ = ㅐ.'),
        kind: 'cards',
        glyphs: compoundVowels,
      },
      {
        id: 'batchim',
        title: l('Patchim: 7 âm cuối', 'Batchim: the 7 final sounds'),
        intro: l(
          'Phụ âm ở đáy khối gọi là **patchim** (받침). Dù có nhiều chữ khác nhau, cuối âm tiết chỉ có **7 âm**. Mỗi thẻ cho biết âm đọc và những chữ cái cho ra âm đó.',
          'The consonant at the bottom of a block is the **batchim** (받침). Many letters can go there, but they make only **7 sounds**. Each card shows the sound and the letters that produce it.',
        ),
        kind: 'cards',
        glyphs: finals,
        notes: [
          l(
            '**Patchim kép** (ㄳ ㄵ ㄶ ㄺ ㄻ ㄼ ㄽ ㄾ ㄿ ㅀ ㅄ) thường chỉ đọc một phụ âm: 닭 → [닥], 삶 → [삼], 값 → [갑], 앉다 → [안따]. Khi có nguyên âm theo sau thì đọc cả hai: 읽어요 → [일거요].',
            'A **double batchim** (ㄳ ㄵ ㄶ ㄺ ㄻ ㄼ ㄽ ㄾ ㄿ ㅀ ㅄ) usually sounds like one consonant: 닭 → [닥], 삶 → [삼], 값 → [갑], 앉다 → [안따]. Before a vowel both are heard: 읽어요 → [일거요].',
          ),
        ],
      },
      {
        id: 'builder',
        title: l('Tự ghép chữ Hangul', 'Build your own syllable'),
        intro: l('Chọn phụ âm đầu, nguyên âm và patchim để xem khối âm tiết, phiên âm và nghe cách đọc.', 'Pick an initial consonant, a vowel and a batchim to see the block, its romanisation and hear it.'),
        kind: 'hangul-builder',
      },
    ],
  },
  pronunciation: {
    intro: l(
      'Tiếng Hàn **không có thanh điệu**, nhưng có ba loại phụ âm (thường – bật hơi – căng) và nhiều **quy tắc biến âm** khi các âm tiết đứng cạnh nhau. Người Việt có lợi thế với ㅡ (ư), ㅓ (ơ) và các âm cuối chặn hơi (các, mát, đáp).',
      'Korean has **no tones**, but it has three kinds of consonants (plain – aspirated – tense) and many **sound-change rules** between syllables. Tap a card to listen.',
    ),
    groups: [
      { id: 'vowels', title: l('Nguyên âm', 'Vowels'), intro: l('Chú ý cặp ㅓ – ㅗ và ㅡ – ㅜ: đọc lẫn là đổi nghĩa.', 'Watch ㅓ vs ㅗ and ㅡ vs ㅜ: mixing them up changes the word.'), sounds: vowelSounds },
      {
        id: 'triplets',
        title: l('Thường – bật hơi – căng', 'Plain – aspirated – tense'),
        intro: l(
          'Đặt một tờ giấy trước miệng: âm **bật hơi** làm giấy bay mạnh, âm **thường** làm giấy rung nhẹ, âm **căng** gần như không làm giấy động.',
          'Hold a sheet of paper in front of your mouth: **aspirated** sounds blow it hard, **plain** sounds move it a little, **tense** sounds barely move it.',
        ),
        sounds: tripletSounds,
      },
      { id: 'other-consonants', title: l('Các phụ âm khác', 'Other consonants'), sounds: otherConsonants },
    ],
    rules: [
      {
        id: 'three-way',
        title: l('Cặp từ chỉ khác một phụ âm', 'Words that differ by one consonant'),
        body: l('Nghe và lặp lại từng hàng để luyện tai: ba từ khác nhau hoàn toàn về nghĩa.', 'Listen and repeat each row to train your ear: the three words mean completely different things.'),
        table: table(
          [l('Thường', 'Plain'), l('Bật hơi', 'Aspirated'), l('Căng', 'Tense')],
          [
            [l('달 (dal) – mặt trăng', '달 (dal) – moon'), l('탈 (tal) – mặt nạ', '탈 (tal) – mask'), l('딸 (ttal) – con gái', '딸 (ttal) – daughter')],
            [l('불 (bul) – lửa', '불 (bul) – fire'), l('풀 (pul) – cỏ', '풀 (pul) – grass'), l('뿔 (ppul) – sừng', '뿔 (ppul) – horn')],
            [l('자다 (jada) – ngủ', '자다 (jada) – sleep'), l('차다 (chada) – đá; lạnh', '차다 (chada) – kick; cold'), l('짜다 (jjada) – mặn', '짜다 (jjada) – salty')],
            [l('개 (gae) – con chó', '개 (gae) – dog'), l('캐다 (kaeda) – đào', '캐다 (kaeda) – dig'), l('깨 (kkae) – hạt vừng', '깨 (kkae) – sesame')],
            [l('사다 (sada) – mua', '사다 (sada) – buy'), '—', l('싸다 (ssada) – rẻ', '싸다 (ssada) – cheap')],
          ],
        ),
      },
      {
        id: 'final-sounds',
        title: l('7 âm cuối (patchim)', 'The 7 final sounds'),
        body: l(
          'Cuối âm tiết chỉ có **7 âm**. ㄱ, ㄷ, ㅂ cuối âm tiết **không bật hơi**, giống "c", "t", "p" cuối trong tiếng Việt (các, mát, đáp).',
          'A syllable can end in only **7 sounds**. Final ㄱ, ㄷ and ㅂ are **unreleased**: the mouth closes without a puff of air.',
        ),
        table: table(
          [l('Âm đọc', 'Sound'), l('Chữ viết', 'Letters'), l('Ví dụ', 'Example')],
          [
            ['[k̚]', 'ㄱ ㅋ ㄲ', '부엌 → [부억]'],
            ['[n]', 'ㄴ', '산 [산]'],
            ['[t̚]', 'ㄷ ㅅ ㅆ ㅈ ㅊ ㅌ ㅎ', '옷 → [옫], 꽃 → [꼳]'],
            ['[l]', 'ㄹ', '물 [물]'],
            ['[m]', 'ㅁ', '밤 [밤]'],
            ['[p̚]', 'ㅂ ㅍ', '앞 → [압]'],
            ['[ŋ]', 'ㅇ', '강 [강]'],
          ],
        ),
      },
      {
        id: 'liaison',
        title: l('Nối âm (연음)', 'Linking (연음)'),
        body: l(
          'Khi âm tiết sau bắt đầu bằng **ㅇ câm**, phụ âm cuối của âm tiết trước **được đọc sang** âm tiết sau. Đây là quy tắc quan trọng nhất.',
          'When the next syllable starts with a **silent ㅇ**, the previous final consonant **moves over** to fill it. This is the most important rule.',
        ),
        examples: [
          ex('한국어 → [한구거]', 'tiếng Hàn', 'Korean (language)', 'hangugeo'),
          ex('음악 → [으막]', 'âm nhạc', 'music', 'eumak'),
          ex('옷이 → [오시]', 'quần áo (làm chủ ngữ)', 'clothes (as subject)', 'osi'),
          ex('읽어요 → [일거요]', 'đọc', 'read', 'ilgeoyo'),
        ],
      },
      {
        id: 'nasalization',
        title: l('Biến âm mũi (비음화)', 'Nasalisation (비음화)'),
        body: l(
          'Âm cuối **[k̚], [t̚], [p̚]** đứng trước **ㄴ, ㅁ** biến thành **ㅇ, ㄴ, ㅁ**. Đây là lý do 합니다 đọc là [함니다].',
          'Final **[k̚], [t̚], [p̚]** before **ㄴ or ㅁ** become **ㅇ, ㄴ, ㅁ**. That is why 합니다 is pronounced [함니다].',
        ),
        table: table(
          [l('Quy tắc', 'Rule'), l('Ví dụ', 'Example')],
          [
            ['ㄱ + ㄴ/ㅁ → ㅇ', '국물 → [궁물], 한국말 → [한궁말]'],
            ['ㄷ + ㄴ/ㅁ → ㄴ', '거짓말 → [거진말], 믿는다 → [민는다]'],
            ['ㅂ + ㄴ/ㅁ → ㅁ', '합니다 → [함니다], 십만 → [심만]'],
            ['ㅁ, ㅇ + ㄹ → ㄴ', '종로 → [종노], 음료 → [음뇨]'],
          ],
        ),
        examples: [ex('감사합니다 → [감사함니다]', 'Cảm ơn ạ.', 'Thank you.', 'gamsahamnida'), ex('입니다 → [임니다]', 'là (trang trọng)', 'is (formal)', 'imnida')],
      },
      {
        id: 'aspiration',
        title: l('Bật hơi hoá (격음화)', 'Aspiration (격음화)'),
        body: l('**ㅎ** gặp **ㄱ, ㄷ, ㅂ, ㅈ** (đứng trước hoặc sau) thì cả hai hợp lại thành âm bật hơi **ㅋ, ㅌ, ㅍ, ㅊ**.', '**ㅎ** next to **ㄱ, ㄷ, ㅂ, ㅈ** (before or after) merges with it into **ㅋ, ㅌ, ㅍ, ㅊ**.'),
        table: table(
          [l('Kết hợp', 'Combination'), l('Đọc', 'Becomes'), l('Ví dụ', 'Example')],
          [
            ['ㅎ + ㄱ · ㄱ + ㅎ', 'ㅋ', '좋고 → [조코], 축하 → [추카]'],
            ['ㅎ + ㄷ', 'ㅌ', '좋다 → [조타], 많다 → [만타]'],
            ['ㅂ + ㅎ', 'ㅍ', '입학 → [이팍]'],
            ['ㅎ + ㅈ · ㅈ + ㅎ', 'ㅊ', '그렇지 → [그러치], 맞히다 → [마치다]'],
          ],
        ),
        examples: [ex('축하해요 → [추카해요]', 'Chúc mừng nhé!', 'Congratulations!', 'chukahaeyo')],
      },
      {
        id: 'tensification',
        title: l('Căng hoá (경음화)', 'Tensing (경음화)'),
        body: l(
          'Sau âm cuối **[k̚], [t̚], [p̚]**, các phụ âm **ㄱ, ㄷ, ㅂ, ㅅ, ㅈ** đứng sau trở thành âm căng **ㄲ, ㄸ, ㅃ, ㅆ, ㅉ**.',
          'After a final **[k̚], [t̚] or [p̚]**, a following **ㄱ, ㄷ, ㅂ, ㅅ, ㅈ** becomes tense: **ㄲ, ㄸ, ㅃ, ㅆ, ㅉ**.',
        ),
        examples: [
          ex('학교 → [학꾜]', 'trường học', 'school', 'hakgyo'),
          ex('식당 → [식땅]', 'nhà ăn, quán ăn', 'restaurant', 'sikdang'),
          ex('잡지 → [잡찌]', 'tạp chí', 'magazine', 'japji'),
          ex('맛있다 → [마싣따]', 'ngon', 'tasty', 'masitda'),
        ],
      },
      {
        id: 'h-weakening',
        title: l('ㅎ bị lược bỏ', 'Silent ㅎ'),
        body: l(
          'ㅎ cuối âm tiết đứng trước nguyên âm thì **không đọc**. ㅎ đầu âm tiết đứng sau ㄴ, ㄹ, ㅁ, ㅇ cũng thường đọc rất nhẹ hoặc mất hẳn.',
          'A final ㅎ before a vowel is **silent**. An initial ㅎ after ㄴ, ㄹ, ㅁ or ㅇ is also often weak or dropped.',
        ),
        examples: [
          ex('좋아요 → [조아요]', 'tốt, thích', 'good, I like it', 'joayo'),
          ex('많이 → [마니]', 'nhiều', 'a lot', 'mani'),
          ex('괜찮아요 → [괜차나요]', 'không sao', 'it\'s OK', 'gwaenchanayo'),
          ex('싫어요 → [시러요]', 'không thích', 'I don\'t like it', 'sireoyo'),
        ],
      },
      {
        id: 'lateralization',
        title: l('Biến âm ㄹ (유음화)', 'ㄴ becomes ㄹ (유음화)'),
        body: l('**ㄴ** đứng cạnh **ㄹ** (trước hoặc sau) thì cũng đọc thành **ㄹ**.', '**ㄴ** next to **ㄹ** (before or after) is also pronounced **ㄹ**.'),
        examples: [
          ex('신라 → [실라]', 'Silla (vương quốc cổ)', 'Silla (ancient kingdom)', 'Silla'),
          ex('연락 → [열락]', 'liên lạc', 'contact', 'yeollak'),
          ex('설날 → [설랄]', 'Tết Nguyên đán', 'Lunar New Year', 'seollal'),
          ex('한류 → [할류]', 'làn sóng Hàn Quốc', 'the Korean Wave', 'hallyu'),
        ],
      },
      {
        id: 'palatalization',
        title: l('Vòm hoá (구개음화)', 'Palatalisation (구개음화)'),
        body: l('Patchim **ㄷ, ㅌ** gặp **이** thì đọc thành **지, 치**.', 'A final **ㄷ or ㅌ** before **이** is pronounced **지 or 치**.'),
        examples: [
          ex('같이 → [가치]', 'cùng nhau', 'together', 'gachi'),
          ex('굳이 → [구지]', 'nhất thiết, cố', 'deliberately', 'guji'),
          ex('해돋이 → [해도지]', 'bình minh', 'sunrise', 'haedoji'),
        ],
      },
      {
        id: 'ui',
        title: l('Cách đọc ㅢ', 'How to read ㅢ'),
        body: l('ㅢ có tới bốn cách đọc tuỳ vị trí.', 'ㅢ is read four different ways depending on where it appears.'),
        table: table(
          [l('Vị trí', 'Position'), l('Đọc', 'Sounds like'), l('Ví dụ', 'Example')],
          [
            [l('Đầu từ', 'Start of a word'), '[의]', '의사 [의사]'],
            [l('Sau phụ âm', 'After a consonant'), '[이]', '희망 → [히망]'],
            [l('Giữa / cuối từ', 'Inside a word'), l('[이] (hoặc [의])', '[이] (or [의])'), '회의 → [회이]'],
            [l('Tiểu từ sở hữu 의', 'Possessive particle 의'), l('[에] (hoặc [의])', '[에] (or [의])'), '나의 → [나에]'],
          ],
        ),
      },
      {
        id: 'intonation',
        title: l('Ngữ điệu câu hỏi', 'Question intonation'),
        body: l(
          'Đuôi **-아요/어요** dùng chung cho câu kể, câu hỏi, rủ rê và mệnh lệnh nhẹ. Chỉ có **ngữ điệu** phân biệt: lên giọng ↗ là câu hỏi, xuống giọng ↘ là câu kể.',
          'The **-아요/어요** ending is shared by statements, questions, suggestions and soft commands. Only the **intonation** tells them apart: rising ↗ for a question, falling ↘ for a statement.',
        ),
        examples: [
          ex('밥 먹어요. ↘', 'Tôi ăn cơm.', 'I\'m eating.', 'Bap meogeoyo.'),
          ex('밥 먹어요? ↗', 'Bạn ăn cơm chưa? / Bạn có ăn không?', 'Are you eating?', 'Bap meogeoyo?'),
          ex('같이 가요.', 'Cùng đi nào. (giọng đều)', 'Let\'s go together. (level tone)', 'Gachi gayo.'),
        ],
      },
    ],
  },
  grammar,
}

export default content
