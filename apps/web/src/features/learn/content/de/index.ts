import type { StudyContent } from '../../types'
import { ex, glyph, l, table, word } from '../helpers'
import grammar from './grammar'

const alphabet = [
  glyph('A a', '[aː]', { sounds: '[a] · [aː]', example: word('Apfel', l('quả táo', 'apple'), { ipa: '[ˈapfl̩]' }), speak: 'A' }),
  glyph('B b', '[beː]', { sounds: '[b] · [p]', example: word('Buch', l('quyển sách', 'book'), { ipa: '[buːx]' }), tip: l('Cuối từ đọc [p]: gelb [ɡɛlp].', 'At the end of a word it says [p]: gelb [ɡɛlp].'), speak: 'B' }),
  glyph('C c', '[tseː]', { sounds: '[k] · [ts]', example: word('Café', l('quán cà phê', 'café'), { ipa: '[kaˈfeː]' }), tip: l('Gần như chỉ gặp trong ch, ck, sch và từ mượn.', 'Almost only found in ch, ck, sch and loanwords.'), speak: 'C' }),
  glyph('D d', '[deː]', { sounds: '[d] · [t]', example: word('Danke', l('cảm ơn', 'thank you'), { ipa: '[ˈdaŋkə]' }), tip: l('Cuối từ đọc [t]: Hund [hʊnt].', 'At the end of a word it says [t]: Hund [hʊnt].'), speak: 'D' }),
  glyph('E e', '[eː]', { sounds: '[eː] · [ɛ] · [ə]', example: word('Essen', l('đồ ăn', 'food'), { ipa: '[ˈɛsn̩]' }), tip: l('e cuối từ, không nhấn đọc rất nhẹ [ə]: bitte.', 'An unstressed final e is a light [ə]: bitte.'), speak: 'E' }),
  glyph('F f', '[ɛf]', { sounds: '[f]', example: word('Fisch', l('con cá', 'fish'), { ipa: '[fɪʃ]' }), speak: 'F' }),
  glyph('G g', '[ɡeː]', { sounds: '[ɡ] · [k]', example: word('gut', l('tốt', 'good'), { ipa: '[ɡuːt]' }), tip: l('-ig cuối từ đọc [ɪç]: billig, König.', 'Final -ig says [ɪç]: billig, König.'), speak: 'G' }),
  glyph('H h', '[haː]', { sounds: '[h]', example: word('Haus', l('ngôi nhà', 'house'), { ipa: '[haʊ̯s]' }), tip: l('h sau nguyên âm không đọc, chỉ báo nguyên âm dài: gehen, Bahn.', 'After a vowel, h is silent and just marks a long vowel: gehen, Bahn.'), speak: 'H' }),
  glyph('I i', '[iː]', { sounds: '[ɪ] · [iː]', example: word('Insel', l('hòn đảo', 'island'), { ipa: '[ˈɪnzl̩]' }), tip: l('ie đọc [iː] dài: Liebe.', 'ie is a long [iː]: Liebe.'), speak: 'I' }),
  glyph('J j', '[jɔt]', { sounds: '[j]', example: word('ja', l('vâng, có', 'yes'), { ipa: '[jaː]' }), tip: l('Đọc như "d" giọng miền Nam: ja ≈ "da".', 'Like English y: ja ≈ "yah".'), speak: 'J' }),
  glyph('K k', '[kaː]', { sounds: '[k]', example: word('Kind', l('đứa trẻ', 'child'), { ipa: '[kɪnt]' }), speak: 'K' }),
  glyph('L l', '[ɛl]', { sounds: '[l]', example: word('Liebe', l('tình yêu', 'love'), { ipa: '[ˈliːbə]' }), speak: 'L' }),
  glyph('M m', '[ɛm]', { sounds: '[m]', example: word('Mutter', l('mẹ', 'mother'), { ipa: '[ˈmʊtɐ]' }), speak: 'M' }),
  glyph('N n', '[ɛn]', { sounds: '[n]', example: word('Nacht', l('đêm', 'night'), { ipa: '[naxt]' }), speak: 'N' }),
  glyph('O o', '[oː]', { sounds: '[ɔ] · [oː]', example: word('Oma', l('bà', 'grandma'), { ipa: '[ˈoːma]' }), speak: 'O' }),
  glyph('P p', '[peː]', { sounds: '[p]', example: word('Post', l('bưu điện', 'post office'), { ipa: '[pɔst]' }), tip: l('pf đọc [pf] liền một hơi: Apfel.', 'pf is one quick [pf]: Apfel.'), speak: 'P' }),
  glyph('Q q', '[kuː]', { sounds: '[kv]', example: word('Quelle', l('nguồn, suối', 'source, spring'), { ipa: '[ˈkvɛlə]' }), tip: l('qu đọc [kv], không phải [kw].', 'qu says [kv], not [kw].'), speak: 'Q' }),
  glyph('R r', '[ɛʁ]', { sounds: '[ʁ] · [ɐ]', example: word('rot', l('màu đỏ', 'red'), { ipa: '[ʁoːt]' }), tip: l('r đầu âm tiết phát ra ở cuống họng, nghe gần "g/gh" khàn. Sau nguyên âm (der, Vater) gần như thành "a" nhẹ.', 'At the start of a syllable it is made in the throat; after a vowel (der, Vater) it softens into a light "a".'), speak: 'R' }),
  glyph('S s', '[ɛs]', { sounds: '[z] · [s] · [ʃ]', example: word('Sonne', l('mặt trời', 'sun'), { ipa: '[ˈzɔnə]' }), tip: l('Trước nguyên âm đọc [z]; sp-, st- đầu từ đọc [ʃp], [ʃt].', 'Before a vowel it says [z]; initial sp-, st- say [ʃp], [ʃt].'), speak: 'S' }),
  glyph('T t', '[teː]', { sounds: '[t]', example: word('Tag', l('ngày', 'day'), { ipa: '[taːk]' }), speak: 'T' }),
  glyph('U u', '[uː]', { sounds: '[ʊ] · [uː]', example: word('Uhr', l('đồng hồ, giờ', 'clock, o’clock'), { ipa: '[uːɐ̯]' }), speak: 'U' }),
  glyph('V v', '[faʊ̯]', { sounds: '[f] · [v]', example: word('Vater', l('bố', 'father'), { ipa: '[ˈfaːtɐ]' }), tip: l('Từ gốc Đức đọc [f]: Vogel; từ mượn đọc [v]: Vase.', 'Native words say [f]: Vogel; loanwords say [v]: Vase.'), speak: 'V' }),
  glyph('W w', '[veː]', { sounds: '[v]', example: word('Wasser', l('nước', 'water'), { ipa: '[ˈvasɐ]' }), tip: l('Đọc như "v" tiếng Việt.', 'Like English v.'), speak: 'W' }),
  glyph('X x', '[ɪks]', { sounds: '[ks]', example: word('Taxi', l('taxi', 'taxi'), { ipa: '[ˈtaksi]' }), speak: 'X' }),
  glyph('Y y', '[ˈʏpsilɔn]', { sounds: '[ʏ] · [yː]', example: word('Typ', l('kiểu, anh chàng', 'type, guy'), { ipa: '[tyːp]' }), tip: l('Hiếm, chủ yếu trong từ mượn.', 'Rare; mostly in loanwords.'), speak: 'Y' }),
  glyph('Z z', '[tsɛt]', { sounds: '[ts]', example: word('Zeit', l('thời gian', 'time'), { ipa: '[tsaɪ̯t]' }), tip: l('Luôn đọc [ts] như "ts" liền nhau.', 'Always [ts], as in "cats".'), speak: 'Z' }),
  glyph('Ä ä', '[ɛː]', { sounds: '[ɛ] · [ɛː]', example: word('Mädchen', l('cô gái', 'girl'), { ipa: '[ˈmɛːtçən]' }), tip: l('Giống "e" tiếng Việt.', 'Like the e in "bed".'), speak: 'Ä' }),
  glyph('Ö ö', '[øː]', { sounds: '[œ] · [øː]', example: word('schön', l('đẹp', 'beautiful'), { ipa: '[ʃøːn]' }), tip: l('Để lưỡi như đọc "ê" nhưng tròn môi như "ô".', 'Tongue as for "e", lips rounded as for "o".'), speak: 'Ö' }),
  glyph('Ü ü', '[yː]', { sounds: '[ʏ] · [yː]', example: word('über', l('ở trên, về', 'over, about'), { ipa: '[ˈyːbɐ]' }), tip: l('Để lưỡi như đọc "i" nhưng tròn môi như "u".', 'Tongue as for "ee", lips rounded as for "oo".'), speak: 'Ü' }),
  glyph('ß', '[ɛsˈtsɛt]', { sounds: '[s]', example: word('Straße', l('đường phố', 'street'), { ipa: '[ˈʃtʁaːsə]' }), tip: l('Đọc [s], chỉ đứng sau nguyên âm dài hoặc nguyên âm đôi. Không có phím ß thì viết ss.', 'Says [s] and follows long vowels or diphthongs. Write ss if you cannot type ß.'), speak: 'Straße' }),
]

const combinations = [
  glyph('ch', '[ç] · [x]', { example: word('ich · Buch', l('tôi · sách', 'I · book'), { ipa: '[ɪç] · [buːx]' }), tip: l('Sau a, o, u, au đọc [x] như "kh"; còn lại đọc [ç], như "h" xì nhẹ trong "hi".', 'After a, o, u, au it is a harsh [x]; elsewhere a soft hissing [ç].'), speak: 'ich, Buch' }),
  glyph('sch', '[ʃ]', { example: word('Schule', l('trường học', 'school'), { ipa: '[ˈʃuːlə]' }) }),
  glyph('tsch', '[tʃ]', { example: word('Deutsch', l('tiếng Đức', 'German'), { ipa: '[dɔʏ̯tʃ]' }) }),
  glyph('ei · ai', '[aɪ̯]', { example: word('mein', l('của tôi', 'my'), { ipa: '[maɪ̯n]' }), tip: l('ei đọc "ai", không phải "ây".', 'ei sounds like "eye".') }),
  glyph('ie', '[iː]', { example: word('Liebe', l('tình yêu', 'love'), { ipa: '[ˈliːbə]' }) }),
  glyph('eu · äu', '[ɔʏ̯]', { example: word('heute · Häuser', l('hôm nay · những ngôi nhà', 'today · houses'), { ipa: '[ˈhɔʏ̯tə]' }), tip: l('Nghe như "oi".', 'Sounds like "oy".'), speak: 'heute, Häuser' }),
  glyph('au', '[aʊ̯]', { example: word('Haus', l('ngôi nhà', 'house'), { ipa: '[haʊ̯s]' }) }),
  glyph('sp · st', '[ʃp] · [ʃt]', { example: word('Sport · Stadt', l('thể thao · thành phố', 'sport · city'), { ipa: '[ʃpɔʁt] · [ʃtat]' }), tip: l('Chỉ ở đầu từ (hoặc đầu thành phần từ ghép). Giữa từ: Fenster [st].', 'Only at the start of a word or word part. Inside a word: Fenster [st].'), speak: 'Sport, Stadt' }),
  glyph('pf', '[pf]', { example: word('Apfel', l('quả táo', 'apple'), { ipa: '[ˈapfl̩]' }) }),
  glyph('ck', '[k]', { example: word('Zucker', l('đường', 'sugar'), { ipa: '[ˈtsʊkɐ]' }), tip: l('Báo hiệu nguyên âm đứng trước ngắn.', 'Shows the vowel before it is short.') }),
  glyph('tz', '[ts]', { example: word('Katze', l('con mèo', 'cat'), { ipa: '[ˈkatsə]' }) }),
  glyph('ng', '[ŋ]', { example: word('lang', l('dài', 'long'), { ipa: '[laŋ]' }), tip: l('Như "ng" tiếng Việt, không đọc thêm [ɡ].', 'Like "ng" in "sing", no extra [g].') }),
  glyph('chs', '[ks]', { example: word('sechs', l('số sáu', 'six'), { ipa: '[zɛks]' }) }),
  glyph('-er', '[ɐ]', { example: word('Lehrer', l('giáo viên', 'teacher'), { ipa: '[ˈleːʁɐ]' }), tip: l('Đuôi -er đọc như "a" nhẹ, không uốn lưỡi.', 'Final -er is a light "uh", with no r.') }),
  glyph('-ig', '[ɪç]', { example: word('richtig', l('đúng', 'correct'), { ipa: '[ˈʁɪçtɪç]' }) }),
]

const longVowels = [
  { ipa: 'aː', examples: ['V**a**ter', 'B**ah**n'], tip: l('"a" dài, miệng mở to.', 'A long, open "ah".') },
  { ipa: 'eː', examples: ['T**ee**', 'g**e**hen'], tip: l('"ê" dài và căng, khoé môi kéo sang hai bên.', 'A long, tense "ay" without gliding.') },
  { ipa: 'iː', examples: ['L**ie**be', 'w**i**r'], tip: l('"i" dài.', 'A long "ee".') },
  { ipa: 'oː', examples: ['B**oo**t', 'r**o**t'], tip: l('"ô" dài, môi tròn, không trượt thành "ôu".', 'A long, pure "oh" with no glide.') },
  { ipa: 'uː', examples: ['g**u**t', 'Sch**uh**'], tip: l('"u" dài, môi chu tròn.', 'A long "oo".') },
  { ipa: 'ɛː', examples: ['K**ä**se', 'sp**ä**t'], tip: l('"e" kéo dài.', 'A long "e" as in "bed".') },
  { ipa: 'øː', examples: ['sch**ö**n', 'h**ö**ren'], tip: l('Lưỡi như "ê", môi tròn như "ô", giữ lâu.', 'Tongue for "ay", lips for "oh", held long.') },
  { ipa: 'yː', examples: ['**ü**ber', 'm**ü**de'], tip: l('Lưỡi như "i", môi tròn như "u", giữ lâu.', 'Tongue for "ee", lips for "oo", held long.') },
]

const shortVowels = [
  { ipa: 'a', examples: ['M**a**nn', 'S**a**tz'], tip: l('"a" ngắn.', 'A short "a".') },
  { ipa: 'ɛ', examples: ['B**e**tt', '**Ä**pfel'], tip: l('"e" ngắn.', 'A short "e".') },
  { ipa: 'ɪ', examples: ['b**i**tte', 'K**i**nd'], tip: l('"i" ngắn, thả lỏng.', 'A short, relaxed "i".') },
  { ipa: 'ɔ', examples: ['k**o**mmen', 'S**o**nne'], tip: l('"o" ngắn, miệng mở hơn [oː].', 'A short, open "o".') },
  { ipa: 'ʊ', examples: ['M**u**tter', 'H**u**nd'], tip: l('"u" ngắn.', 'A short "u".') },
  { ipa: 'œ', examples: ['k**ö**nnen', 'z**wö**lf'], tip: l('Như [øː] nhưng ngắn và mở hơn.', 'A short, more open [øː].') },
  { ipa: 'ʏ', examples: ['Gl**ü**ck', 'f**ü**nf'], tip: l('Như [yː] nhưng ngắn.', 'A short [yː].') },
  { ipa: 'ə', examples: ['bitt**e**', 'hab**e**n'], tip: l('"ơ" rất nhẹ ở âm tiết không nhấn.', 'A weak "uh" in unstressed syllables.') },
  { ipa: 'ɐ', examples: ['Vat**er**', 'bess**er**'], tip: l('Đuôi -er: như "a" nhẹ, không có r.', 'The -er ending: a light "uh" with no r.') },
]

const diphthongs = [
  { ipa: 'aɪ̯', examples: ['m**ei**n', 'M**ai**'], tip: l('Đọc "ai". Người mới hay đọc nhầm ei thành "ây".', 'Like "eye". Do not read ei as "ay".') },
  { ipa: 'aʊ̯', examples: ['H**au**s', '**au**ch'], tip: l('Đọc "ao".', 'Like "ow" in "house".') },
  { ipa: 'ɔʏ̯', examples: ['h**eu**te', 'H**äu**ser'], tip: l('Đọc "oi".', 'Like "oy" in "boy".') },
]

const consonants = [
  { ipa: 'ç', examples: ['i**ch**', 'Mil**ch**'], tip: l('Như "h" trong "hi" nhưng xì hơi qua lưỡi. Không đọc thành "ch" hay "s".', 'A soft hiss, like the h in "huge".') },
  { ipa: 'x', examples: ['Ba**ch**', 'Bu**ch**'], tip: l('Như "kh" tiếng Việt, chỉ sau a, o, u, au.', 'A harsh sound at the back of the mouth, only after a, o, u, au.') },
  { ipa: 'ʃ', examples: ['**Sch**ule', '**St**adt'], tip: l('Như "s" uốn lưỡi, môi tròn.', 'Like English "sh".') },
  { ipa: 'ts', examples: ['**Z**eit', 'Ka**tz**e'], tip: l('"t" và "s" liền một hơi.', '"t" and "s" together.') },
  { ipa: 'pf', examples: ['A**pf**el', '**Pf**erd'], tip: l('"p" rồi "f" thật nhanh, môi dưới chạm răng trên.', 'A quick "p" sliding into "f".') },
  { ipa: 'ʁ', examples: ['**r**ot', 'T**r**aum'], tip: l('Phát âm ở cuống họng, gần "g/gh" khàn và nhẹ. Không rung đầu lưỡi.', 'Made at the back of the throat; do not trill with the tongue tip.') },
  { ipa: 'v', examples: ['**W**asser', '**V**ase'], tip: l('Chữ w (và v trong từ mượn) đọc như "v".', 'The letter w (and v in loanwords).') },
  { ipa: 'f', examples: ['**F**isch', '**V**ater'], tip: l('Chữ f và chữ v trong từ gốc Đức.', 'The letter f, and v in native words.') },
  { ipa: 'z', examples: ['**S**onne', 'Ro**s**e'], tip: l('s trước nguyên âm đọc như "d" giọng miền Bắc ("z").', 's before a vowel buzzes like English z.') },
  { ipa: 's', examples: ['Hau**s**', 'Stra**ß**e'], tip: l('s cuối từ, ss và ß.', 'Final s, ss and ß.') },
  { ipa: 'j', examples: ['**j**a', '**J**ahr'], tip: l('Chữ j đọc như "y".', 'The letter j sounds like English y.') },
  { ipa: 'ŋ', examples: ['la**ng**', 'Zeitu**ng**'], tip: l('Như "ng".', 'Like "ng" in "sing".') },
  { ipa: 'kv', examples: ['**Qu**elle', 'be**qu**em'], tip: l('qu = [kv].', 'qu = [kv].') },
]

const content: StudyContent = {
  overview: l(
    'Tiếng Đức dùng 26 chữ Latin cộng **ä, ö, ü và ß**. Tin vui: tiếng Đức **đọc gần như đúng như viết**, nắm quy tắc là đọc được mọi từ. Thử thách nằm ở ngữ pháp: mỗi danh từ có **giống** (der/die/das), mạo từ đổi theo **4 cách**, và động từ phải đứng **ở vị trí thứ hai** trong câu.',
    'German uses the 26 Latin letters plus **ä, ö, ü and ß**. The good news: German is **read almost exactly as it is written**. The challenge is grammar: every noun has a **gender** (der/die/das), articles change across **4 cases**, and the verb always sits **in second position**.',
  ),
  tips: [
    l('Luôn học danh từ **kèm mạo từ và số nhiều**: der Tisch, die Tische. Đừng bao giờ học "Tisch" trơn.', 'Always learn nouns **with their article and plural**: der Tisch, die Tische.'),
    l('Dùng màu để nhớ giống: xanh cho der, đỏ cho die, xanh lá cho das.', 'Colour-code genders: blue for der, red for die, green for das.'),
    l('Đọc to theo quy tắc chính tả; sau vài tuần bạn sẽ đọc được cả từ chưa gặp.', 'Read aloud using the spelling rules; after a few weeks you can read words you have never seen.'),
    l('Học bảng chia của **sein, haben, werden** và 6 động từ khuyết thiếu trước tiên. Chúng xuất hiện trong gần như mọi câu.', 'Master **sein, haben, werden** and the six modal verbs first; they appear in almost every sentence.'),
    l('Chú ý vị trí động từ: câu chính động từ đứng thứ hai, câu phụ động từ cuối câu.', 'Watch the verb: second in main clauses, last in subordinate clauses.'),
  ],
  writing: {
    intro: l(
      'Bảng chữ cái tiếng Đức có 26 chữ cái cơ bản, 3 nguyên âm biến âm (**ä, ö, ü**) và chữ **ß**. Mọi **danh từ** đều viết hoa chữ cái đầu: der **H**und, die **L**iebe. Bấm vào ô để nghe.',
      'The German alphabet has the 26 basic letters, three umlauts (**ä, ö, ü**) and **ß**. Every **noun** is capitalised: der **H**und, die **L**iebe. Tap a card to hear it.',
    ),
    charts: [
      {
        id: 'alphabet',
        title: l('Bảng chữ cái', 'The alphabet'),
        intro: l('Phiên âm lớn là **tên chữ** khi đánh vần; dòng nhỏ là các **âm** mà chữ đó tạo ra.', 'The large transcription is the **letter name**; the small line lists the **sounds** it makes.'),
        kind: 'cards',
        glyphs: alphabet,
        notes: [
          l('Đánh vần tên mình: "Wie schreibt man das?" – "L-A-N" [ɛl – aː – ɛn].', 'Spelling your name: "Wie schreibt man das?" – "L-A-N" [ɛl – aː – ɛn].'),
          l('Không gõ được ä, ö, ü thì viết ae, oe, ue: Mueller = Müller.', 'If you cannot type umlauts, write ae, oe, ue: Mueller = Müller.'),
        ],
      },
      {
        id: 'combinations',
        title: l('Tổ hợp chữ quan trọng', 'Key letter combinations'),
        intro: l('Nắm 15 tổ hợp này là đọc được hầu hết từ tiếng Đức.', 'Learn these 15 combinations and you can read most German words.'),
        kind: 'cards',
        glyphs: combinations,
      },
    ],
  },
  pronunciation: {
    intro: l(
      'Tiếng Đức phân biệt rõ **nguyên âm dài và ngắn**, có 3 âm **ä, ö, ü** mà tiếng Việt không có, và vài phụ âm đặc biệt như **ch** và **r**. Bấm vào ô để nghe ví dụ.',
      'German clearly separates **long and short vowels**, has the umlaut sounds **ä, ö, ü**, and a few special consonants like **ch** and **r**. Tap a card to hear an example.',
    ),
    groups: [
      { id: 'long-vowels', title: l('Nguyên âm dài', 'Long vowels'), intro: l('Thường đứng trước một phụ âm, trước h, hoặc là nguyên âm đôi chữ (aa, ee, oo, ie).', 'Usually before a single consonant, before h, or written double (aa, ee, oo, ie).'), sounds: longVowels },
      { id: 'short-vowels', title: l('Nguyên âm ngắn', 'Short vowels'), intro: l('Thường đứng trước phụ âm đôi (mm, tt, ck) hoặc cụm phụ âm.', 'Usually before double consonants (mm, tt, ck) or consonant clusters.'), sounds: shortVowels },
      { id: 'diphthongs', title: l('Nguyên âm đôi', 'Diphthongs'), sounds: diphthongs },
      { id: 'consonants', title: l('Phụ âm đặc biệt', 'Special consonants'), intro: l('Những phụ âm khác với tiếng Anh và tiếng Việt.', 'Consonants that differ from English.'), sounds: consonants },
    ],
    rules: [
      {
        id: 'vowel-length',
        title: l('Nguyên âm dài hay ngắn?', 'Long or short vowel?'),
        body: l(
          'Nhìn chữ là đoán được độ dài: nguyên âm **dài** khi theo sau là h, khi viết đôi, hoặc khi chỉ có một phụ âm; **ngắn** khi theo sau là phụ âm đôi hoặc nhiều phụ âm.',
          'Spelling tells you the length: a vowel is **long** before h, when doubled, or before one consonant; **short** before a double consonant or a cluster.',
        ),
        table: table(
          [l('Dài', 'Long'), l('Ngắn', 'Short')],
          [
            ['Bahn [baːn]', 'Bann [ban]'],
            ['Staat [ʃtaːt]', 'Stadt [ʃtat]'],
            ['ihn [iːn]', 'in [ɪn]'],
            ['Ofen [ˈoːfn̩]', 'offen [ˈɔfn̩]'],
            ['Hüte [ˈhyːtə]', 'Hütte [ˈhʏtə]'],
          ],
        ),
      },
      {
        id: 'final-devoicing',
        title: l('Phụ âm cuối "câm hoá"', 'Final devoicing'),
        body: l(
          'Ở cuối từ hoặc cuối âm tiết, **b, d, g** đọc thành **p, t, k**. Khi thêm đuôi thì âm gốc trở lại.',
          'At the end of a word or syllable, **b, d, g** sound like **p, t, k**. Add an ending and the original sound comes back.',
        ),
        table: table(
          [l('Cuối từ', 'Word-final'), l('Có đuôi', 'With ending')],
          [
            ['Hund [hʊnt]', 'Hunde [ˈhʊndə]'],
            ['Tag [taːk]', 'Tage [ˈtaːɡə]'],
            ['gelb [ɡɛlp]', 'gelbe [ˈɡɛlbə]'],
          ],
        ),
      },
      {
        id: 'ich-ach',
        title: l('Hai cách đọc ch', 'The two ch sounds'),
        body: l(
          '**ach-Laut [x]** sau a, o, u, au (như "kh"). **ich-Laut [ç]** sau e, i, ä, ö, ü, ei, eu, sau phụ âm và trong đuôi -chen (như "h" xì nhẹ).',
          'The **ach-sound [x]** follows a, o, u, au. The **ich-sound [ç]** follows e, i, ä, ö, ü, ei, eu, consonants and appears in -chen.',
        ),
        table: table(
          ['[x]', '[ç]'],
          [
            ['acht, Nacht', 'ich, nicht'],
            ['Buch, kochen', 'Bücher, Köche'],
            ['auch, Bauch', 'Milch, Mädchen'],
          ],
        ),
      },
      {
        id: 's-sounds',
        title: l('s, ss, ß, sp, st', 's, ss, ß, sp, st'),
        body: l(
          's **trước nguyên âm** đọc [z]: Sonne, lesen. **s cuối từ, ss, ß** đọc [s]. **sp, st ở đầu từ** đọc [ʃp], [ʃt]. ß đứng sau nguyên âm dài (Straße, Fuß), ss đứng sau nguyên âm ngắn (Wasser, Kuss).',
          's **before a vowel** is [z]: Sonne, lesen. **Final s, ss, ß** are [s]. **Initial sp, st** are [ʃp], [ʃt]. ß follows long vowels (Straße, Fuß), ss short ones (Wasser, Kuss).',
        ),
        examples: [ex('Sie sitzt in der Sonne.', 'Cô ấy ngồi dưới nắng.', 'She is sitting in the sun.'), ex('Wir spielen Fußball auf der Straße.', 'Chúng tôi chơi bóng đá trên đường.', 'We play football in the street.')],
      },
      {
        id: 'r-sound',
        title: l('Âm r', 'The r sound'),
        body: l(
          'Đầu âm tiết, r phát âm ở **cuống họng** [ʁ]: rot, Reis, Straße. **Sau nguyên âm** r gần như biến thành "a" nhẹ: der [deːɐ̯], vier [fiːɐ̯]. Đuôi **-er** đọc [ɐ]: Lehrer, besser.',
          'At the start of a syllable, r is made **in the throat** [ʁ]: rot, Reis. **After a vowel** it turns into a light "a": der [deːɐ̯], vier [fiːɐ̯]. The **-er** ending is [ɐ]: Lehrer, besser.',
        ),
      },
      {
        id: 'stress',
        title: l('Trọng âm', 'Word stress'),
        body: l(
          'Trọng âm thường rơi vào **âm tiết đầu của gốc từ**: ˈSprache, ˈarbeiten. Các tiền tố **be-, ge-, er-, ver-, zer-, ent-** không bao giờ nhận trọng âm (beˈsuchen, verˈstehen), còn tiền tố tách được thì có (ˈanrufen). Nhiều từ mượn nhấn ở cuối: Uniˈversität, Informaˈtion.',
          'Stress usually falls on the **first syllable of the stem**: ˈSprache, ˈarbeiten. The prefixes **be-, ge-, er-, ver-, zer-, ent-** are never stressed (beˈsuchen, verˈstehen); separable prefixes are (ˈanrufen). Many loanwords stress the end: Uniˈversität, Informaˈtion.',
        ),
      },
      {
        id: 'capitals',
        title: l('Viết hoa danh từ', 'Capitalised nouns'),
        body: l(
          'Mọi **danh từ** viết hoa, kể cả giữa câu, và danh từ hoá từ động từ (das **E**ssen). Đại từ lịch sự **Sie** cũng viết hoa. Nhờ vậy khi đọc bạn nhận ra ngay đâu là danh từ.',
          'Every **noun** is capitalised, even mid-sentence, as are nouns made from verbs (das **E**ssen) and the polite **Sie**. It makes nouns easy to spot.',
        ),
        examples: [ex('Der Hund spielt mit dem Ball.', 'Con chó chơi với quả bóng.', 'The dog is playing with the ball.')],
      },
    ],
  },
  grammar,
}

export default content
