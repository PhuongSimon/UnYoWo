import type { StudyContent } from '../../types'
import { ex, glyph, l, table, word } from '../helpers'
import grammar from './grammar'

const alphabet = [
  glyph('A a', '/eɪ/', { sounds: '/æ/ · /eɪ/ · /ɑː/ · /ə/', example: word('apple', l('quả táo', 'apple'), { ipa: '/ˈæp.əl/' }), speak: 'A' }),
  glyph('B b', '/biː/', { sounds: '/b/', example: word('ball', l('quả bóng', 'ball'), { ipa: '/bɔːl/' }), tip: l('Câm trong climb, doubt.', 'Silent in climb, doubt.'), speak: 'B' }),
  glyph('C c', '/siː/', { sounds: '/k/ · /s/', example: word('cat', l('con mèo', 'cat'), { ipa: '/kæt/' }), tip: l('Đọc /s/ trước e, i, y: city, cycle.', 'Says /s/ before e, i, y: city, cycle.'), speak: 'C' }),
  glyph('D d', '/diː/', { sounds: '/d/', example: word('dog', l('con chó', 'dog'), { ipa: '/dɒɡ/' }), speak: 'D' }),
  glyph('E e', '/iː/', { sounds: '/e/ · /iː/ · /ə/', example: word('egg', l('quả trứng', 'egg'), { ipa: '/eɡ/' }), tip: l('E cuối từ thường câm và làm nguyên âm trước đọc "dài": make, time.', 'A final e is usually silent and makes the vowel before it "long": make, time.'), speak: 'E' }),
  glyph('F f', '/ef/', { sounds: '/f/', example: word('fish', l('con cá', 'fish'), { ipa: '/fɪʃ/' }), speak: 'F' }),
  glyph('G g', '/dʒiː/', { sounds: '/ɡ/ · /dʒ/', example: word('girl', l('cô gái', 'girl'), { ipa: '/ɡɜːl/' }), tip: l('Thường đọc /dʒ/ trước e, i, y: giant, age.', 'Often /dʒ/ before e, i, y: giant, age.'), speak: 'G' }),
  glyph('H h', '/eɪtʃ/', { sounds: '/h/', example: word('house', l('ngôi nhà', 'house'), { ipa: '/haʊs/' }), tip: l('Câm trong hour, honest.', 'Silent in hour, honest.'), speak: 'H' }),
  glyph('I i', '/aɪ/', { sounds: '/ɪ/ · /aɪ/', example: word('ice', l('nước đá', 'ice'), { ipa: '/aɪs/' }), speak: 'I' }),
  glyph('J j', '/dʒeɪ/', { sounds: '/dʒ/', example: word('juice', l('nước ép', 'juice'), { ipa: '/dʒuːs/' }), speak: 'J' }),
  glyph('K k', '/keɪ/', { sounds: '/k/', example: word('key', l('chìa khoá', 'key'), { ipa: '/kiː/' }), tip: l('Câm trước n: know, knife.', 'Silent before n: know, knife.'), speak: 'K' }),
  glyph('L l', '/el/', { sounds: '/l/', example: word('lion', l('sư tử', 'lion'), { ipa: '/ˈlaɪ.ən/' }), speak: 'L' }),
  glyph('M m', '/em/', { sounds: '/m/', example: word('moon', l('mặt trăng', 'moon'), { ipa: '/muːn/' }), speak: 'M' }),
  glyph('N n', '/en/', { sounds: '/n/ · /ŋ/', example: word('nose', l('cái mũi', 'nose'), { ipa: '/nəʊz/' }), tip: l('Đọc /ŋ/ trước k, g: think, finger.', 'Says /ŋ/ before k, g: think, finger.'), speak: 'N' }),
  glyph('O o', '/əʊ/', { sounds: '/ɒ/ · /əʊ/ · /ʌ/ · /uː/', example: word('orange', l('quả cam', 'orange'), { ipa: '/ˈɒr.ɪndʒ/' }), speak: 'O' }),
  glyph('P p', '/piː/', { sounds: '/p/', example: word('pen', l('cây bút', 'pen'), { ipa: '/pen/' }), tip: l('ph đọc là /f/: phone.', 'ph says /f/: phone.'), speak: 'P' }),
  glyph('Q q', '/kjuː/', { sounds: '/kw/', example: word('queen', l('nữ hoàng', 'queen'), { ipa: '/kwiːn/' }), tip: l('Gần như luôn đi với u: qu = /kw/.', 'Almost always followed by u: qu = /kw/.'), speak: 'Q' }),
  glyph('R r', '/ɑː/', { sounds: '/r/', example: word('rabbit', l('con thỏ', 'rabbit'), { ipa: '/ˈræb.ɪt/' }), tip: l('Giọng Anh không đọc r sau nguyên âm (car /kɑː/); giọng Mỹ có (/kɑːr/).', 'British English drops r after a vowel (car /kɑː/); American English keeps it (/kɑːr/).'), speak: 'R' }),
  glyph('S s', '/es/', { sounds: '/s/ · /z/ · /ʃ/', example: word('sun', l('mặt trời', 'sun'), { ipa: '/sʌn/' }), speak: 'S' }),
  glyph('T t', '/tiː/', { sounds: '/t/', example: word('tree', l('cái cây', 'tree'), { ipa: '/triː/' }), tip: l('th đọc /θ/ hoặc /ð/: think, this.', 'th says /θ/ or /ð/: think, this.'), speak: 'T' }),
  glyph('U u', '/juː/', { sounds: '/ʌ/ · /juː/ · /ʊ/', example: word('umbrella', l('cái ô', 'umbrella'), { ipa: '/ʌmˈbrel.ə/' }), speak: 'U' }),
  glyph('V v', '/viː/', { sounds: '/v/', example: word('van', l('xe tải nhỏ', 'van'), { ipa: '/væn/' }), speak: 'V' }),
  glyph('W w', '/ˈdʌb.əl.juː/', { sounds: '/w/', example: word('water', l('nước', 'water'), { ipa: '/ˈwɔː.tə/' }), tip: l('Câm trong write, who.', 'Silent in write, who.'), speak: 'W' }),
  glyph('X x', '/eks/', { sounds: '/ks/ · /ɡz/', example: word('box', l('cái hộp', 'box'), { ipa: '/bɒks/' }), speak: 'X' }),
  glyph('Y y', '/waɪ/', { sounds: '/j/ · /aɪ/ · /i/', example: word('yellow', l('màu vàng', 'yellow'), { ipa: '/ˈjel.əʊ/' }), speak: 'Y' }),
  glyph('Z z', '/zed/', { sounds: '/z/', example: word('zebra', l('ngựa vằn', 'zebra'), { ipa: '/ˈzeb.rə/' }), tip: l('Giọng Mỹ gọi là /ziː/.', 'Americans call it /ziː/.'), speak: 'Z' }),
]

const combinations = [
  glyph('sh', '/ʃ/', { example: word('ship', l('con tàu', 'ship'), { ipa: '/ʃɪp/' }) }),
  glyph('ch', '/tʃ/', { example: word('chair', l('cái ghế', 'chair'), { ipa: '/tʃeə/' }), tip: l('Đôi khi là /k/: school, Christmas.', 'Sometimes /k/: school, Christmas.') }),
  glyph('th', '/θ/ · /ð/', { example: word('think', l('nghĩ', 'think'), { ipa: '/θɪŋk/' }), tip: l('/ð/ trong các từ chức năng: the, this, that, they.', '/ð/ in function words: the, this, that, they.') }),
  glyph('ph', '/f/', { example: word('phone', l('điện thoại', 'phone'), { ipa: '/fəʊn/' }) }),
  glyph('wh', '/w/', { example: word('what', l('cái gì', 'what'), { ipa: '/wɒt/' }), tip: l('Trước o đọc /h/: who, whole.', 'Before o it says /h/: who, whole.') }),
  glyph('ck', '/k/', { example: word('back', l('phía sau', 'back'), { ipa: '/bæk/' }) }),
  glyph('ng', '/ŋ/', { example: word('sing', l('hát', 'sing'), { ipa: '/sɪŋ/' }) }),
  glyph('qu', '/kw/', { example: word('quick', l('nhanh', 'quick'), { ipa: '/kwɪk/' }) }),
  glyph('ee', '/iː/', { example: word('see', l('nhìn thấy', 'see'), { ipa: '/siː/' }) }),
  glyph('ea', '/iː/ · /e/', { example: word('eat', l('ăn', 'eat'), { ipa: '/iːt/' }), tip: l('Đọc /e/ trong head, bread.', 'Says /e/ in head, bread.') }),
  glyph('oo', '/uː/ · /ʊ/', { example: word('food', l('thức ăn', 'food'), { ipa: '/fuːd/' }), tip: l('Ngắn /ʊ/ trong book, good.', 'Short /ʊ/ in book, good.') }),
  glyph('ai · ay', '/eɪ/', { example: word('rain', l('mưa', 'rain'), { ipa: '/reɪn/' }) }),
  glyph('oa', '/əʊ/', { example: word('boat', l('con thuyền', 'boat'), { ipa: '/bəʊt/' }) }),
  glyph('ou · ow', '/aʊ/', { example: word('house', l('ngôi nhà', 'house'), { ipa: '/haʊs/' }), tip: l('ow cũng đọc /əʊ/: snow, slow.', 'ow can also say /əʊ/: snow, slow.') }),
  glyph('igh', '/aɪ/', { example: word('night', l('ban đêm', 'night'), { ipa: '/naɪt/' }) }),
  glyph('a_e · i_e · o_e', '/eɪ/ · /aɪ/ · /əʊ/', { example: word('make · time · home', l('làm · thời gian · nhà', 'make · time · home')), tip: l('"E câm" ở cuối làm nguyên âm đọc như tên chữ cái.', 'A silent final e makes the vowel say its letter name.'), speak: 'make, time, home' }),
]

const monophthongs = [
  { ipa: 'iː', examples: ['sh**ee**p', 'b**ea**ch', 'k**ey**'], tip: l('Giống "i" trong "đi" nhưng kéo dài; khoé môi kéo sang hai bên như đang cười.', 'A long "ee": spread your lips as if smiling.') },
  { ipa: 'ɪ', examples: ['sh**i**p', 'b**i**g', 'g**y**m'], tip: l('"i" ngắn và thả lỏng, nghe như lai giữa "i" và "ê". Đọc dài là ship thành sheep.', 'A short, relaxed "i" between "ee" and "e". Make it long and ship becomes sheep.') },
  { ipa: 'ʊ', examples: ['g**oo**d', 'b**oo**k', 'p**u**t'], tip: l('"u" ngắn, môi tròn nhẹ, không kéo dài.', 'A short "u" with lightly rounded lips.') },
  { ipa: 'uː', examples: ['f**oo**d', 'bl**ue**', 'tw**o**'], tip: l('Giống "u" trong "thu" nhưng kéo dài, môi chu tròn.', 'A long "oo" with rounded, pushed-out lips.') },
  { ipa: 'e', examples: ['b**e**d', 'h**ea**d', 'm**a**ny'], tip: l('Giữa "e" và "ê" tiếng Việt, miệng mở vừa.', 'Like the vowel in "bed", mouth half open.') },
  { ipa: 'ə', examples: ['**a**bout', 'teach**er**', 'ban**a**n**a**'], tip: l('Âm "ơ" rất nhẹ và ngắn, chỉ có ở âm tiết KHÔNG nhấn. Đây là âm xuất hiện nhiều nhất trong tiếng Anh.', 'The schwa: a very short, lazy "uh" in unstressed syllables, the most common sound in English.') },
  { ipa: 'ɜː', examples: ['b**ir**d', 'w**or**k', 'l**ear**n'], tip: l('"ơ" kéo dài. Giọng Mỹ uốn lưỡi thêm âm r.', 'A long "er". American English adds an r-colour.') },
  { ipa: 'ɔː', examples: ['d**oor**', 's**aw**', 't**al**k'], tip: l('"o" kéo dài, môi tròn.', 'A long "aw" with rounded lips.') },
  { ipa: 'æ', examples: ['c**a**t', 'bl**a**ck', 'h**a**ppy'], tip: l('Giữa "a" và "e": hạ hàm thật thấp, kéo khoé môi sang hai bên.', 'Between "a" and "e": drop the jaw and spread the lips.') },
  { ipa: 'ʌ', examples: ['c**u**p', 'l**o**ve', 'm**o**ney'], tip: l('Gần "ă" trong "ăn": ngắn, miệng mở vừa.', 'A short "uh", as in "cup".') },
  { ipa: 'ɑː', examples: ['c**ar**', 'f**a**ther', 'h**a**lf'], tip: l('"a" kéo dài, miệng mở to, lưỡi hạ thấp.', 'A long, open "ah".') },
  { ipa: 'ɒ', examples: ['h**o**t', 'd**o**g', 'wh**a**t'], tip: l('"o" ngắn, tròn môi (giọng Anh). Giọng Mỹ thường đọc thành /ɑː/.', 'A short, rounded "o" (British); Americans usually say /ɑː/.') },
]

const diphthongs = [
  { ipa: 'ɪə', examples: ['h**ere**', '**ear**', 'id**ea**'], tip: l('Trượt từ /ɪ/ sang /ə/, nghe như "ia".', 'Glide from /ɪ/ to /ə/.') },
  { ipa: 'eɪ', examples: ['d**ay**', 'c**a**ke', 'r**ai**n'], tip: l('Trượt từ /e/ sang /ɪ/, nghe như "ây".', 'Glide from /e/ to /ɪ/.') },
  { ipa: 'ʊə', examples: ['t**our**', 'p**ure**'], tip: l('Trượt từ /ʊ/ sang /ə/, nghe như "ua". Nhiều người bản ngữ nay đọc thành /ɔː/.', 'Glide from /ʊ/ to /ə/; many speakers now say /ɔː/.') },
  { ipa: 'ɔɪ', examples: ['b**oy**', 'c**oi**n', 'n**oi**se'], tip: l('Nghe như "oi".', 'As in "boy".') },
  { ipa: 'əʊ', examples: ['g**o**', 'h**o**me', 'sh**ow**'], tip: l('Trượt từ /ə/ sang /ʊ/, nghe như "âu". Giọng Mỹ: /oʊ/.', 'Glide from /ə/ to /ʊ/; American English says /oʊ/.') },
  { ipa: 'eə', examples: ['h**air**', 'c**are**', 'wh**ere**'], tip: l('Trượt từ /e/ sang /ə/, nghe như "e-ơ". Giọng Mỹ: /er/.', 'Glide from /e/ to /ə/; American English says /er/.') },
  { ipa: 'aɪ', examples: ['m**y**', 't**i**me', 'l**igh**t'], tip: l('Nghe như "ai".', 'As in "my".') },
  { ipa: 'aʊ', examples: ['n**ow**', 'h**ou**se', 'c**ow**'], tip: l('Nghe như "ao".', 'As in "now".') },
]

const consonants = [
  { ipa: 'p', examples: ['**p**en', 'a**pp**le'], tip: l('Như "p" nhưng bật mạnh một luồng hơi ở đầu từ (để tờ giấy trước miệng sẽ thấy rung).', 'Like "p" with a strong puff of air at the start of a word.') },
  { ipa: 'b', examples: ['**b**ad', 'ro**b**'], tip: l('Như "b" tiếng Việt, có rung dây thanh.', 'The voiced partner of /p/.') },
  { ipa: 't', examples: ['**t**ea', 'bu**tt**er'], tip: l('Đầu lưỡi chạm lợi trên (sau răng) và bật hơi, nên gần "th" của tiếng Việt hơn là "t".', 'Tongue tip on the ridge behind the teeth, with a puff of air.') },
  { ipa: 'd', examples: ['**d**og', 'ma**d**e'], tip: l('Như /t/ nhưng rung dây thanh, gần "đ".', 'The voiced partner of /t/.') },
  { ipa: 'k', examples: ['**c**at', 'ba**ck**'], tip: l('Như "c/k" nhưng bật hơi ở đầu từ.', 'Like "k" with a puff of air.') },
  { ipa: 'ɡ', examples: ['**g**et', 'bi**g**'], tip: l('Như "g" trong "ga".', 'The voiced partner of /k/.') },
  { ipa: 'f', examples: ['**f**all', '**ph**one', 'lau**gh**'], tip: l('Răng trên chạm môi dưới rồi thổi hơi, như "ph".', 'Top teeth on the lower lip, then blow.') },
  { ipa: 'v', examples: ['**v**an', 'ha**v**e'], tip: l('Như /f/ nhưng rung dây thanh, như "v" tiếng Việt.', 'The voiced partner of /f/.') },
  { ipa: 'θ', examples: ['**th**in', 'ba**th**'], tip: l('Đặt đầu lưỡi giữa hai hàm răng rồi thổi hơi, không rung dây thanh. Đừng đọc thành "th" hay "t" tiếng Việt.', 'Tongue tip between the teeth, blow air out with no voice.') },
  { ipa: 'ð', examples: ['**th**is', 'mo**th**er'], tip: l('Như /θ/ nhưng rung dây thanh. Đừng đọc thành "d" hay "đ".', 'Same position as /θ/, but voiced.') },
  { ipa: 's', examples: ['**s**ee', 'ri**c**e'], tip: l('Như "x" tiếng Việt: hơi thoát qua kẽ răng.', 'A hissing "s".') },
  { ipa: 'z', examples: ['**z**oo', 'ro**s**e'], tip: l('Như /s/ nhưng rung dây thanh, nghe như tiếng ong. Người Việt hay đọc nhầm thành /s/ ở cuối từ.', 'A buzzing, voiced "s". Keep the buzz at the end of words.') },
  { ipa: 'ʃ', examples: ['**sh**e', 'na**ti**on'], tip: l('Chu tròn môi, nâng lưỡi, như "s" uốn lưỡi.', '"Sh" with rounded lips.') },
  { ipa: 'ʒ', examples: ['vi**s**ion', 'mea**s**ure'], tip: l('Như /ʃ/ nhưng rung dây thanh.', 'The voiced partner of /ʃ/.') },
  { ipa: 'tʃ', examples: ['**ch**eck', 'wa**tch**'], tip: l('Như "ch" nhưng chu môi và bật hơi.', '"Ch" with rounded lips and a puff of air.') },
  { ipa: 'dʒ', examples: ['**j**am', 'a**g**e'], tip: l('Như /tʃ/ nhưng rung dây thanh.', 'The voiced partner of /tʃ/.') },
  { ipa: 'm', examples: ['**m**an', 'ho**m**e'], tip: l('Như "m".', 'As in "man".') },
  { ipa: 'n', examples: ['**n**o', 'te**n**'], tip: l('Như "n"; đọc rõ ở cuối từ.', 'As in "no"; say it clearly at the end.') },
  { ipa: 'ŋ', examples: ['si**ng**', 'thi**n**k'], tip: l('Như "ng"; trong -ing không đọc thêm /ɡ/.', 'As in "sing", with no extra /ɡ/.') },
  { ipa: 'h', examples: ['**h**at', 'be**h**ind'], tip: l('Chỉ là một luồng hơi nhẹ.', 'Just a breath of air.') },
  { ipa: 'l', examples: ['**l**eg', 'fee**l**'], tip: l('Đầu từ như "l"; cuối từ (feel) cuống lưỡi nâng lên, nghe hơi như "âu" (L tối).', 'Clear at the start; "dark" at the end of words (feel).') },
  { ipa: 'r', examples: ['**r**ed', 'so**rr**y'], tip: l('Cong đầu lưỡi về sau nhưng KHÔNG chạm vòm miệng, không rung lưỡi; môi hơi tròn.', 'Curl the tongue back without touching anything; lips slightly rounded.') },
  { ipa: 'w', examples: ['**w**et', 'q**u**een'], tip: l('Chu tròn môi rồi mở nhanh, như "oa" đọc nhanh.', 'Round the lips, then open quickly.') },
  { ipa: 'j', examples: ['**y**es', 'm**u**sic'], tip: l('Như "d" giọng miền Nam hoặc "y" trong "yêu".', 'As in "yes".') },
]

const content: StudyContent = {
  overview: l(
    'Tiếng Anh dùng 26 chữ cái Latin giống tiếng Việt, nhưng **một chữ có thể đọc nhiều cách** (a trong cat, cake, car). Vì vậy hãy học kèm **bảng phiên âm IPA** và tra phiên âm mỗi khi gặp từ mới. Ngữ pháp không chia giống hay chia cách phức tạp; trọng tâm cho người mới là **trật tự từ S + V + O** và **các thì**.',
    'English uses the same 26 Latin letters, but **one letter can spell several sounds** (the a in cat, cake, car). Learn the **IPA chart** and check the transcription of every new word. There is no grammatical gender or case system to worry about; for beginners the essentials are **S + V + O word order** and **the tenses**.',
  ),
  tips: [
    l('Học **IPA** trước: chính tả tiếng Anh không cho biết cách đọc, còn phiên âm thì có. Từ điển Cambridge và Oxford đều ghi phiên âm.', 'Learn **IPA** first: spelling does not tell you the pronunciation, the transcription does. Cambridge and Oxford dictionaries show it.'),
    l('Mỗi từ mới: học **trọng âm** và **âm cuối** cùng lúc với nghĩa.', 'For every new word, learn its **stress** and **final sound** together with its meaning.'),
    l('**Shadowing** 10 phút mỗi ngày: nghe một câu ngắn rồi nhại lại ngay, đúng cả ngữ điệu.', '**Shadow** for 10 minutes a day: listen to a short sentence and repeat it straight away, intonation included.'),
    l('Với mỗi điểm ngữ pháp, tự đặt **3 câu về chính bạn**. Câu có liên quan đến bản thân nhớ lâu hơn nhiều.', 'For every grammar point, write **3 sentences about yourself**. Personal sentences stick much longer.'),
    l('Học **cụm từ** thay vì từ đơn: make a decision, do homework, take a photo.', 'Learn **chunks**, not single words: make a decision, do homework, take a photo.'),
  ],
  writing: {
    intro: l(
      'Bảng chữ cái tiếng Anh có 26 chữ: 5 nguyên âm (a, e, i, o, u) và 21 phụ âm. Mỗi chữ có **tên chữ** (dùng khi đánh vần) và một hay nhiều **âm** khi đứng trong từ. Bấm vào ô để nghe.',
      'The English alphabet has 26 letters: 5 vowels (a, e, i, o, u) and 21 consonants. Each letter has a **name** (used when spelling) and one or more **sounds** inside words. Tap a card to hear it.',
    ),
    charts: [
      {
        id: 'alphabet',
        title: l('Bảng chữ cái', 'The alphabet'),
        intro: l('Phiên âm lớn là **tên chữ**; dòng bên dưới là các **âm** chữ đó thường tạo ra.', 'The large transcription is the **letter name**; the line below lists the **sounds** it usually spells.'),
        kind: 'cards',
        glyphs: alphabet,
        notes: [
          l('Đánh vần tên riêng bằng tên chữ: "My name is Lan: L-A-N" /el – eɪ – en/.', 'Spell names with letter names: "My name is Lan: L-A-N" /el – eɪ – en/.'),
          l('Chữ in hoa dùng ở đầu câu, tên riêng, ngày trong tuần, tháng, ngôn ngữ và đại từ "I".', 'Use capitals at the start of a sentence and for names, days, months, languages and the pronoun "I".'),
        ],
      },
      {
        id: 'combinations',
        title: l('Tổ hợp chữ thường gặp', 'Common letter combinations'),
        intro: l('Nhiều âm được viết bằng hai hoặc ba chữ cái. Nhận ra các tổ hợp này giúp bạn đoán cách đọc từ mới.', 'Many sounds are spelled with two or three letters. Spotting these helps you guess how new words sound.'),
        kind: 'cards',
        glyphs: combinations,
      },
    ],
  },
  pronunciation: {
    intro: l(
      'Tiếng Anh có **44 âm**: 12 nguyên âm đơn, 8 nguyên âm đôi và 24 phụ âm. Phiên âm ở đây theo giọng Anh – Anh (như sách giáo khoa ở Việt Nam), có ghi chú khi giọng Mỹ khác. Bấm vào ô để nghe từ ví dụ.',
      'English has **44 sounds**: 12 single vowels, 8 diphthongs and 24 consonants. Transcriptions follow British English, with notes where American English differs. Tap a card to hear the example word.',
    ),
    groups: [
      { id: 'monophthongs', title: l('Nguyên âm đơn', 'Single vowels'), intro: l('Dấu ː nghĩa là âm dài. Phân biệt âm dài và ngắn rất quan trọng: ship /ɪ/ khác sheep /iː/.', 'ː marks a long vowel. Long vs short matters: ship /ɪ/ is not sheep /iː/.'), sounds: monophthongs },
      { id: 'diphthongs', title: l('Nguyên âm đôi', 'Diphthongs'), intro: l('Hai nguyên âm lướt vào nhau trong một âm tiết; âm đầu mạnh và dài hơn.', 'Two vowels gliding together in one syllable; the first part is stronger.'), sounds: diphthongs },
      { id: 'consonants', title: l('Phụ âm', 'Consonants'), intro: l('Nhiều phụ âm đi theo cặp: một âm vô thanh (không rung dây thanh) và một âm hữu thanh (rung). Đặt tay lên cổ họng để cảm nhận.', 'Many consonants come in pairs: voiceless and voiced. Put your hand on your throat to feel the difference.'), sounds: consonants },
    ],
    rules: [
      {
        id: 'word-stress',
        title: l('Trọng âm từ', 'Word stress'),
        body: l(
          'Mỗi từ từ hai âm tiết trở lên có **một âm tiết được nhấn**: đọc to hơn, dài hơn và cao hơn. Từ điển đánh dấu bằng ˈ đặt trước âm tiết đó. Nhấn sai trọng âm làm người nghe khó hiểu hơn cả phát âm sai một âm.',
          'Every word of two or more syllables has **one stressed syllable**: louder, longer and higher. Dictionaries mark it with ˈ before that syllable. Wrong stress confuses listeners more than a wrong sound.',
        ),
        table: table(
          [l('Từ', 'Word'), 'IPA', l('Nhấn', 'Stress')],
          [
            ['photograph', '/ˈfəʊ.tə.ɡrɑːf/', 'PHO-to-graph'],
            ['photography', '/fəˈtɒɡ.rə.fi/', 'pho-TO-gra-phy'],
            ['photographic', '/ˌfəʊ.təˈɡræf.ɪk/', 'pho-to-GRA-phic'],
            [l('record (danh từ)', 'record (noun)'), '/ˈrek.ɔːd/', 'RE-cord'],
            [l('record (động từ)', 'record (verb)'), '/rɪˈkɔːd/', 're-CORD'],
          ],
        ),
      },
      {
        id: 'final-s',
        title: l('Cách đọc đuôi -s / -es', 'Pronouncing -s / -es endings'),
        body: l(
          'Đuôi -s của danh từ số nhiều, động từ ngôi thứ ba và sở hữu cách có **ba cách đọc**, tuỳ âm cuối của từ gốc (âm, không phải chữ).',
          'The -s of plurals, third-person verbs and possessives has **three pronunciations**, depending on the final sound of the base word.',
        ),
        table: table(
          [l('Đọc là', 'Sounds like'), l('Khi từ kết thúc bằng âm', 'After the sound'), l('Ví dụ', 'Examples')],
          [
            ['/s/', l('vô thanh /p t k f θ/', 'voiceless /p t k f θ/'), 'cats, books, laughs'],
            ['/z/', l('hữu thanh và nguyên âm', 'voiced sounds and vowels'), 'dogs, plays, pens'],
            ['/ɪz/', '/s z ʃ ʒ tʃ dʒ/', 'buses, watches, pages'],
          ],
        ),
      },
      {
        id: 'final-ed',
        title: l('Cách đọc đuôi -ed', 'Pronouncing -ed endings'),
        body: l('Đuôi -ed của động từ quá khứ cũng có **ba cách đọc**. Chỉ đọc thành một âm tiết riêng /ɪd/ sau /t/ và /d/.', 'The past -ed ending also has **three pronunciations**. It only adds a syllable /ɪd/ after /t/ and /d/.'),
        table: table(
          [l('Đọc là', 'Sounds like'), l('Khi từ kết thúc bằng âm', 'After the sound'), l('Ví dụ', 'Examples')],
          [
            ['/t/', l('vô thanh /p k f s ʃ tʃ θ/', 'voiceless /p k f s ʃ tʃ θ/'), 'stopped, worked, washed'],
            ['/d/', l('hữu thanh và nguyên âm', 'voiced sounds and vowels'), 'played, lived, cleaned'],
            ['/ɪd/', '/t/ /d/', 'wanted, needed, visited'],
          ],
        ),
      },
      {
        id: 'final-consonants',
        title: l('Đừng nuốt âm cuối', 'Do not drop final sounds'),
        body: l(
          'Người Việt hay bỏ hoặc đọc mờ âm cuối, trong khi tiếng Anh dùng âm cuối để **phân biệt nghĩa**. Hãy đọc rõ từng âm cuối, kể cả cụm phụ âm như /kst/ trong "next".',
          'Final consonants **change meaning** in English. Pronounce each one clearly, including clusters like /kst/ in "next".',
        ),
        examples: [
          ex('rice – right – ride – rise', 'gạo – đúng – cưỡi – tăng lên'),
          ex('sick – six', 'ốm – số sáu'),
          ex('fine – five – fight', 'tốt – số năm – đánh nhau'),
        ],
      },
      {
        id: 'long-short',
        title: l('Nguyên âm dài và ngắn', 'Long and short vowels'),
        body: l('Độ dài nguyên âm phân biệt nghĩa. Luyện theo cặp từ tối thiểu.', 'Vowel length changes meaning. Practise with minimal pairs.'),
        table: table(
          [l('Ngắn', 'Short'), l('Dài', 'Long')],
          [
            ['ship /ʃɪp/', 'sheep /ʃiːp/'],
            ['live /lɪv/', 'leave /liːv/'],
            ['full /fʊl/', 'fool /fuːl/'],
            ['cut /kʌt/', 'cart /kɑːt/'],
            ['shot /ʃɒt/', 'short /ʃɔːt/'],
          ],
        ),
      },
      {
        id: 'linking',
        title: l('Nối âm', 'Linking'),
        body: l(
          'Khi từ trước kết thúc bằng phụ âm và từ sau bắt đầu bằng nguyên âm, người bản ngữ **nối chúng thành một khối**. Biết điều này giúp bạn nghe hiểu tốt hơn rất nhiều.',
          'When a word ends in a consonant and the next begins with a vowel, native speakers **link them together**. Knowing this makes listening much easier.',
        ),
        examples: [
          ex('turn off → tur-noff', 'tắt'),
          ex('an apple → a-napple', 'một quả táo'),
          ex('pick it up → pi-ki-tup', 'nhặt nó lên'),
        ],
      },
      {
        id: 'weak-forms',
        title: l('Dạng yếu của từ chức năng', 'Weak forms'),
        body: l(
          'Các từ nhỏ như to, for, can, and, of, was thường **không được nhấn** và đọc với âm /ə/ khi nói nhanh.',
          'Small words like to, for, can, and, of, was are usually **unstressed** and use /ə/ in fast speech.',
        ),
        table: table(
          [l('Từ', 'Word'), l('Dạng mạnh', 'Strong'), l('Dạng yếu', 'Weak'), l('Ví dụ', 'Example')],
          [
            ['can', '/kæn/', '/kən/', 'I can swim.'],
            ['to', '/tuː/', '/tə/', 'I want to go.'],
            ['for', '/fɔː/', '/fə/', 'It’s for you.'],
            ['and', '/ænd/', '/ən/', 'fish and chips'],
            ['of', '/ɒv/', '/əv/', 'a cup of tea'],
          ],
        ),
      },
      {
        id: 'silent-letters',
        title: l('Chữ câm', 'Silent letters'),
        body: l('Một số chữ được viết nhưng không đọc. Hãy học thuộc các từ thông dụng.', 'Some letters are written but not pronounced. Learn the common ones.'),
        table: table(
          [l('Chữ câm', 'Silent letter'), l('Ví dụ', 'Examples')],
          [
            ['k', 'know, knife, knee'],
            ['w', 'write, wrong, answer'],
            ['h', 'hour, honest, what'],
            ['b', 'climb, lamb, doubt'],
            ['t', 'listen, castle, often'],
            ['l', 'half, talk, walk'],
            ['gh', 'night, daughter, though'],
          ],
        ),
      },
      {
        id: 'intonation',
        title: l('Ngữ điệu câu', 'Intonation'),
        body: l(
          'Câu hỏi Yes/No thường **lên giọng** ở cuối; câu hỏi có từ để hỏi (what, where…) và câu trần thuật thường **xuống giọng**.',
          'Yes/No questions usually **rise** at the end; Wh- questions and statements usually **fall**.',
        ),
        examples: [
          ex('Are you ready? ↗', 'Bạn sẵn sàng chưa? (lên giọng)'),
          ex('Where do you live? ↘', 'Bạn sống ở đâu? (xuống giọng)'),
          ex('I live in Hanoi. ↘', 'Tôi sống ở Hà Nội. (xuống giọng)'),
        ],
      },
    ],
  },
  grammar,
}

export default content
