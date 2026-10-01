import type { GrammarTopic } from '../../types'
import { ex, l, table } from '../helpers'

const FORM = l('Thể', 'Form')
const AFF = l('Khẳng định', 'Affirmative')
const NEG = l('Phủ định', 'Negative')
const QUE = l('Nghi vấn', 'Question')
const USE = l('Cách dùng', 'When to use it')
const STRUCTURE = l('Cấu trúc', 'Form')

const grammar: GrammarTopic[] = [
  {
    id: 'sentence-structure',
    level: 'A1',
    title: l('Cấu trúc câu cơ bản', 'Basic sentence structure'),
    summary: l('Câu tiếng Anh theo trật tự Chủ ngữ + Động từ + Tân ngữ (S + V + O).', 'English sentences follow Subject + Verb + Object (S + V + O).'),
    sections: [
      {
        title: l('Trật tự S + V + O', 'S + V + O order'),
        body: l(
          'Mỗi câu đầy đủ cần **chủ ngữ** và **động từ**. Các thành phần khác thường theo thứ tự: **Ai – Làm gì – Cái gì – Ở đâu – Khi nào**.',
          'Every full sentence needs a **subject** and a **verb**. The rest usually follows this order: **Who – Does – What – Where – When**.',
        ),
        table: table(
          [l('Chủ ngữ', 'Subject'), l('Động từ', 'Verb'), l('Tân ngữ', 'Object'), l('Nơi chốn', 'Place'), l('Thời gian', 'Time')],
          [
            ['I', 'play', 'football', 'in the park', 'on Sundays.'],
            ['She', 'reads', 'books', 'at home', 'every evening.'],
          ],
        ),
      },
      {
        title: l('Tính từ đứng trước danh từ', 'Adjectives go before nouns'),
        body: l(
          'Ngược với tiếng Việt ("quả táo **đỏ**"), tiếng Anh đặt tính từ **trước** danh từ: a **red** apple. Tính từ không bao giờ thêm -s.',
          'Adjectives go **before** the noun and never take a plural -s.',
        ),
        examples: [ex('I have a **red** car.', 'Tôi có một chiếc ô tô màu đỏ.'), ex('She has two **small** dogs.', 'Cô ấy có hai con chó nhỏ.')],
      },
      {
        title: l('Câu luôn cần chủ ngữ', 'Sentences always need a subject'),
        body: l(
          'Tiếng Việt nói "Đang mưa." nhưng tiếng Anh bắt buộc có chủ ngữ, kể cả chủ ngữ giả **it** (thời tiết, thời gian, khoảng cách) và **there** (sự tồn tại).',
          'English always needs a subject, even an empty one: **it** for weather, time and distance, and **there** for existence.',
        ),
        examples: [
          ex('**It** is raining.', 'Trời đang mưa.'),
          ex("**It**'s seven o'clock.", 'Bây giờ là bảy giờ.'),
          ex('**There** is a cat in the garden.', 'Có một con mèo trong vườn.'),
        ],
      },
    ],
    tips: [
      l('Đừng bỏ động từ: "I **am** happy", không phải "I happy".', 'Never drop the verb: "I **am** happy", not "I happy".'),
      l('Trạng từ chỉ thời gian có thể đứng đầu câu để nhấn mạnh: "On Sundays, I play football."', 'Time expressions can move to the front for emphasis: "On Sundays, I play football."'),
    ],
  },
  {
    id: 'plural-nouns',
    level: 'A1',
    title: l('Danh từ số ít và số nhiều', 'Singular and plural nouns'),
    summary: l('Thêm -s/-es để tạo số nhiều và học thuộc các danh từ bất quy tắc.', 'Add -s/-es to make plurals and learn the irregular ones.'),
    sections: [
      {
        title: l('Quy tắc thêm -s / -es', 'Adding -s / -es'),
        table: table(
          [l('Quy tắc', 'Rule'), l('Số ít', 'Singular'), l('Số nhiều', 'Plural')],
          [
            [l('Đa số danh từ: thêm -s', 'Most nouns: add -s'), 'book, car, girl', 'books, cars, girls'],
            [l('Tận cùng -s, -ss, -sh, -ch, -x, -o: thêm -es', 'Ending in -s, -ss, -sh, -ch, -x, -o: add -es'), 'bus, glass, dish, watch, box, tomato', 'buses, glasses, dishes, watches, boxes, tomatoes'],
            [l('Phụ âm + y: đổi y thành -ies', 'Consonant + y: change y to -ies'), 'baby, city, country', 'babies, cities, countries'],
            [l('Nguyên âm + y: chỉ thêm -s', 'Vowel + y: just add -s'), 'day, boy, key', 'days, boys, keys'],
            [l('-f / -fe: đổi thành -ves', '-f / -fe: change to -ves'), 'leaf, knife, wife', 'leaves, knives, wives'],
          ],
        ),
      },
      {
        title: l('Danh từ bất quy tắc', 'Irregular plurals'),
        table: table(
          [l('Số ít', 'Singular'), l('Số nhiều', 'Plural'), l('Nghĩa', 'Meaning')],
          [
            ['man', 'men', l('đàn ông', 'man')],
            ['woman', 'women', l('phụ nữ', 'woman')],
            ['child', 'children', l('trẻ em', 'child')],
            ['person', 'people', l('người', 'person')],
            ['foot', 'feet', l('bàn chân', 'foot')],
            ['tooth', 'teeth', l('răng', 'tooth')],
            ['mouse', 'mice', l('con chuột', 'mouse')],
            ['sheep / fish', 'sheep / fish', l('cừu / cá (không đổi)', 'sheep / fish (no change)')],
          ],
        ),
        examples: [
          ex('I have two **brothers**.', 'Tôi có hai anh trai.'),
          ex('There are three **children** in the room.', 'Có ba đứa trẻ trong phòng.'),
          ex('Those **people** are teachers.', 'Những người kia là giáo viên.'),
        ],
      },
    ],
    tips: [
      l('Sau số từ hai trở lên, danh từ đếm được luôn ở số nhiều: two cat**s**, không phải two cat.', 'After any number above one, countable nouns are plural: two cat**s**, not two cat.'),
      l('Một số từ tận cùng -o chỉ thêm -s: photos, pianos, radios.', 'Some -o words only add -s: photos, pianos, radios.'),
    ],
  },
  {
    id: 'articles',
    level: 'A1',
    title: l('Mạo từ a / an / the', 'Articles: a / an / the'),
    summary: l('a/an cho vật chưa xác định, the cho vật đã xác định, và khi nào không cần mạo từ.', 'a/an for something not specific, the for something specific, and when to use no article.'),
    sections: [
      {
        title: l('a và an', 'a and an'),
        body: l(
          'Dùng **a/an** với danh từ **đếm được, số ít**, khi nhắc đến lần đầu hoặc nói chung chung (nghề nghiệp, một vật bất kỳ). Chọn a hay an theo **âm** đầu tiên, không theo chữ cái.',
          'Use **a/an** with **singular countable** nouns when you mention something for the first time or talk about any one of its kind (including jobs). Choose by the first **sound**, not the letter.',
        ),
        table: table(
          [l('Mạo từ', 'Article'), l('Đứng trước', 'Before'), l('Ví dụ', 'Examples')],
          [
            ['a', l('âm phụ âm', 'a consonant sound'), 'a book, a university /juː/, a one-way ticket /w/'],
            ['an', l('âm nguyên âm', 'a vowel sound'), 'an apple, an hour /aʊə/, an MP3 /em/'],
          ],
        ),
        examples: [ex('I have **a** brother and **an** older sister.', 'Tôi có một anh trai và một chị gái.'), ex('She is **an** engineer.', 'Cô ấy là kỹ sư.')],
      },
      {
        title: l('Khi nào dùng the', 'When to use the'),
        bullets: [
          l('Vật đã nhắc đến trước đó: I saw a dog. **The** dog was huge.', 'Something already mentioned: I saw a dog. **The** dog was huge.'),
          l('Vật duy nhất: **the** sun, **the** moon, **the** internet.', 'Unique things: **the** sun, **the** moon, **the** internet.'),
          l('Người nghe biết rõ là cái nào: Close **the** door, please.', 'Both speakers know which one: Close **the** door, please.'),
          l('So sánh nhất và số thứ tự: **the** best, **the** first.', 'Superlatives and ordinals: **the** best, **the** first.'),
          l('Nhạc cụ, đại dương, sông, dãy núi: play **the** piano, **the** Mekong.', 'Instruments, oceans, rivers, mountain ranges: play **the** piano, **the** Mekong.'),
        ],
      },
      {
        title: l('Không dùng mạo từ', 'No article'),
        bullets: [
          l('Danh từ số nhiều hoặc không đếm được khi nói chung: I like **cats**. **Water** is important.', 'Plural or uncountable nouns in general: I like **cats**. **Water** is important.'),
          l('Bữa ăn, môn học, ngôn ngữ, môn thể thao: have **breakfast**, study **English**, play **football**.', 'Meals, subjects, languages, sports: have **breakfast**, study **English**, play **football**.'),
          l('Tên người, hầu hết tên nước và thành phố: **Vietnam**, **Hanoi** (nhưng **the** USA, **the** UK).', 'Names, most countries and cities: **Vietnam**, **Hanoi** (but **the** USA, **the** UK).'),
        ],
        examples: [ex('**The** book on the table is mine.', 'Quyển sách trên bàn là của tôi.'), ex('She plays **the** guitar.', 'Cô ấy chơi đàn guitar.'), ex('I love music.', 'Tôi yêu âm nhạc.')],
      },
    ],
    tips: [
      l('Xét âm chứ không xét chữ: **a** uniform /ˈjuː/, **an** honest man /ˈɒn/.', 'It is the sound that counts: **a** uniform, **an** honest man.'),
      l('Nghề nghiệp cần a/an: "He is **a** doctor", không phải "He is doctor".', 'Jobs need a/an: "He is **a** doctor", not "He is doctor".'),
    ],
  },
  {
    id: 'pronouns',
    level: 'A1',
    title: l('Đại từ nhân xưng và sở hữu', 'Pronouns and possessives'),
    summary: l('Chọn dạng đại từ theo vị trí trong câu: chủ ngữ, tân ngữ, sở hữu hay phản thân.', 'Pick the form by its job: subject, object, possessive or reflexive.'),
    sections: [
      {
        table: table(
          [l('Chủ ngữ', 'Subject'), l('Tân ngữ', 'Object'), l('Tính từ sở hữu', 'Possessive adj.'), l('Đại từ sở hữu', 'Possessive pron.'), l('Phản thân', 'Reflexive')],
          [
            ['I', 'me', 'my', 'mine', 'myself'],
            ['you', 'you', 'your', 'yours', 'yourself'],
            ['he', 'him', 'his', 'his', 'himself'],
            ['she', 'her', 'her', 'hers', 'herself'],
            ['it', 'it', 'its', '—', 'itself'],
            ['we', 'us', 'our', 'ours', 'ourselves'],
            [l('you (số nhiều)', 'you (plural)'), 'you', 'your', 'yours', 'yourselves'],
            ['they', 'them', 'their', 'theirs', 'themselves'],
          ],
        ),
      },
      {
        title: USE,
        bullets: [
          l('**Chủ ngữ** đứng trước động từ: **She** works here.', '**Subject** pronouns come before the verb: **She** works here.'),
          l('**Tân ngữ** đứng sau động từ hoặc giới từ: I love **her**. Come with **me**.', '**Object** pronouns come after a verb or preposition: I love **her**. Come with **me**.'),
          l('**Tính từ sở hữu** luôn đi kèm danh từ: **my** phone.', '**Possessive adjectives** always come with a noun: **my** phone.'),
          l('**Đại từ sở hữu** đứng một mình, thay cho cả cụm: This phone is **mine**.', '**Possessive pronouns** stand alone: This phone is **mine**.'),
          l('**Phản thân** khi chủ ngữ và tân ngữ là một: He hurt **himself**.', '**Reflexives** when subject and object are the same person: He hurt **himself**.'),
        ],
        examples: [
          ex('**She** loves **him**.', 'Cô ấy yêu anh ấy.'),
          ex('This is **my** bag. That one is **yours**.', 'Đây là túi của tôi. Cái kia là của bạn.'),
          ex('**They** invited **us** to **their** party.', 'Họ mời chúng tôi đến bữa tiệc của họ.'),
          ex('He taught **himself** English.', 'Anh ấy tự học tiếng Anh.'),
        ],
      },
    ],
    tips: [
      l('**it\'s** = it is; **its** = của nó: "The dog wagged **its** tail."', '**it\'s** = it is; **its** = belonging to it: "The dog wagged **its** tail."'),
      l('Dùng he/she cho người; it cho đồ vật và con vật nói chung.', 'Use he/she for people and it for things and most animals.'),
    ],
  },
  {
    id: 'verb-to-be',
    level: 'A1',
    title: l('Động từ to be: am / is / are', 'The verb to be: am / is / are'),
    summary: l('"Là / thì / ở": giới thiệu bản thân, mô tả tính chất, tuổi, cảm xúc và vị trí.', 'Use it to introduce yourself and to describe qualities, age, feelings and location.'),
    sections: [
      {
        title: STRUCTURE,
        table: table(
          [l('Chủ ngữ', 'Subject'), AFF, NEG, QUE],
          [
            ['I', "I am (I'm)", "I am not (I'm not)", 'Am I…?'],
            ['he / she / it', "she is (she's)", "she is not (isn't)", 'Is she…?'],
            ['you / we / they', "they are (they're)", "they are not (aren't)", 'Are they…?'],
          ],
        ),
      },
      {
        title: USE,
        bullets: [
          l('Tên, nghề nghiệp, quốc tịch: I **am** Lan. She **is** a nurse.', 'Name, job, nationality: I **am** Lan. She **is** a nurse.'),
          l('Tuổi: He **is** 20 (years old).', 'Age: He **is** 20 (years old).'),
          l('Tính chất, cảm xúc: We **are** tired. The film **is** boring.', 'Qualities and feelings: We **are** tired. The film **is** boring.'),
          l('Vị trí: The keys **are** on the table.', 'Location: The keys **are** on the table.'),
        ],
        examples: [
          ex('I **am** a student.', 'Tôi là sinh viên.'),
          ex('She **is** 25 years old.', 'Cô ấy 25 tuổi.'),
          ex('We **are** hungry.', 'Chúng tôi đói.'),
          ex('**Are** you from Vietnam? – Yes, I **am**.', 'Bạn đến từ Việt Nam phải không? – Đúng vậy.'),
          ex("The keys **aren't** in my bag.", 'Chìa khoá không có trong túi của tôi.'),
        ],
      },
    ],
    tips: [
      l('Nói tuổi bằng be: "I **am** 20", không nói "I have 20 years".', 'Use be for age: "I **am** 20", not "I have 20 years".'),
      l('Trả lời ngắn dạng khẳng định không viết tắt: "Yes, I am" (không phải "Yes, I\'m").', 'Never contract a short affirmative answer: "Yes, I am", not "Yes, I\'m".'),
    ],
  },
  {
    id: 'present-simple',
    level: 'A1',
    title: l('Thì hiện tại đơn', 'Present simple'),
    summary: l('Thói quen, sự thật hiển nhiên và lịch trình cố định.', 'Habits, general truths and fixed timetables.'),
    sections: [
      {
        title: STRUCTURE,
        table: table(
          [FORM, 'I / you / we / they', 'he / she / it'],
          [
            [AFF, 'I work.', 'She work**s**.'],
            [NEG, "I don't work.", "She doesn't work."],
            [QUE, 'Do you work?', 'Does she work?'],
          ],
        ),
      },
      {
        title: l('Chính tả khi thêm -s', 'Spelling of the -s form'),
        bullets: [
          l('Đa số động từ thêm -s: work → works, play → plays.', 'Most verbs add -s: work → works, play → plays.'),
          l('Tận cùng s, sh, ch, x, o thêm -es: watch → watches, go → goes, do → does.', 'After s, sh, ch, x, o add -es: watch → watches, go → goes, do → does.'),
          l('Phụ âm + y đổi thành -ies: study → studies.', 'Consonant + y becomes -ies: study → studies.'),
          l('Bất quy tắc: have → **has**.', 'Irregular: have → **has**.'),
        ],
      },
      {
        title: USE,
        bullets: [
          l('Thói quen, việc lặp lại: I drink coffee every morning.', 'Habits and routines: I drink coffee every morning.'),
          l('Sự thật, điều luôn đúng: Water boils at 100°C.', 'Facts: Water boils at 100°C.'),
          l('Lịch trình, thời gian biểu: The train leaves at 8:15.', 'Timetables: The train leaves at 8:15.'),
          l('Động từ chỉ trạng thái: like, love, know, want, need, believe.', 'State verbs: like, love, know, want, need, believe.'),
        ],
        examples: [
          ex('I **get up** at 6 every morning.', 'Tôi thức dậy lúc 6 giờ mỗi sáng.'),
          ex('She **works** in a hospital.', 'Cô ấy làm việc ở bệnh viện.'),
          ex("He **doesn't eat** meat.", 'Anh ấy không ăn thịt.'),
          ex('**Do** you **speak** Korean?', 'Bạn có nói tiếng Hàn không?'),
          ex('The sun **rises** in the east.', 'Mặt trời mọc ở hướng đông.'),
        ],
      },
    ],
    tips: [
      l('Dấu hiệu: always, usually, often, sometimes, never, every day, on Mondays.', 'Signal words: always, usually, often, sometimes, never, every day, on Mondays.'),
      l('Sau do/does/don\'t/doesn\'t, động từ về nguyên mẫu: "Does she **work**?", không phải "Does she works?".', 'After do/does, use the base verb: "Does she **work**?", not "Does she works?".'),
      l('Lỗi phổ biến nhất: quên -s với he/she/it.', 'The most common mistake: forgetting the -s with he/she/it.'),
    ],
  },
  {
    id: 'present-continuous',
    level: 'A1',
    title: l('Thì hiện tại tiếp diễn', 'Present continuous'),
    summary: l('Việc đang diễn ra lúc nói, việc tạm thời và kế hoạch đã sắp xếp.', 'Actions happening now, temporary situations and fixed future arrangements.'),
    sections: [
      {
        title: STRUCTURE,
        body: l('**am / is / are + V-ing**', '**am / is / are + verb-ing**'),
        table: table(
          [FORM, 'I', 'he / she / it', 'you / we / they'],
          [
            [AFF, "I'm working.", "She's working.", "They're working."],
            [NEG, "I'm not working.", "She isn't working.", "They aren't working."],
            [QUE, 'Am I working?', 'Is she working?', 'Are they working?'],
          ],
        ),
      },
      {
        title: l('Chính tả đuôi -ing', 'Spelling of -ing'),
        bullets: [
          l('Bỏ e câm: make → making, write → writing.', 'Drop a silent e: make → making, write → writing.'),
          l('Một nguyên âm + một phụ âm ở âm tiết nhấn: gấp đôi phụ âm: sit → sitting, run → running.', 'One vowel + one consonant in a stressed syllable: double it: sit → sitting, run → running.'),
          l('-ie đổi thành -ying: lie → lying, die → dying.', '-ie becomes -ying: lie → lying, die → dying.'),
        ],
      },
      {
        title: USE,
        bullets: [
          l('Đang xảy ra ngay lúc nói (now, at the moment, Look!, Listen!).', 'Happening right now (now, at the moment, Look!, Listen!).'),
          l('Tạm thời, trong giai đoạn này (this week, these days).', 'Temporary situations (this week, these days).'),
          l('Kế hoạch tương lai đã sắp xếp chắc chắn (có thời gian cụ thể).', 'Future arrangements with a fixed time.'),
        ],
        examples: [
          ex("I**'m studying** English now.", 'Bây giờ tôi đang học tiếng Anh.'),
          ex("Look! It**'s snowing**.", 'Nhìn kìa! Tuyết đang rơi.'),
          ex("She **isn't working** this week.", 'Tuần này cô ấy không đi làm.'),
          ex('What **are** you **doing**?', 'Bạn đang làm gì vậy?'),
          ex("We**'re flying** to Seoul tomorrow.", 'Ngày mai chúng tôi bay đi Seoul.'),
        ],
      },
    ],
    tips: [
      l('Động từ trạng thái (know, like, want, need, understand…) không dùng ở dạng tiếp diễn: "I **know**", không phải "I am knowing".', 'State verbs (know, like, want, need, understand…) are not used in the continuous: "I **know**", not "I am knowing".'),
    ],
  },
  {
    id: 'there-is-are',
    level: 'A1',
    title: l('There is / There are', 'There is / There are'),
    summary: l('Nói "có" một vật hay một người ở đâu đó.', 'Say that something exists or is somewhere.'),
    sections: [
      {
        title: STRUCTURE,
        table: table(
          [FORM, l('Số ít / không đếm được', 'Singular / uncountable'), l('Số nhiều', 'Plural')],
          [
            [AFF, "There is (There's) a book.", 'There are two books.'],
            [NEG, "There isn't any milk.", "There aren't any chairs."],
            [QUE, 'Is there a bank near here?', 'Are there any eggs?'],
            [l('Quá khứ', 'Past'), 'There was a problem.', 'There were many people.'],
          ],
        ),
        body: l(
          'Khi liệt kê, chia động từ theo **danh từ đầu tiên**: There **is** a pen and two books.',
          'In a list, the verb agrees with the **first** noun: There **is** a pen and two books.',
        ),
        examples: [
          ex('**There is** a cat on the sofa.', 'Có một con mèo trên ghế sofa.'),
          ex('**There are** 30 students in my class.', 'Lớp tôi có 30 học sinh.'),
          ex("**There isn't** any sugar.", 'Không còn chút đường nào.'),
          ex('**Is there** a pharmacy near here? – Yes, **there is**.', 'Gần đây có hiệu thuốc không? – Có.'),
          ex('**There were** many people at the party.', 'Có rất nhiều người ở bữa tiệc.'),
        ],
      },
    ],
    tips: [
      l('Không dùng have để nói "có" ở đâu: "**There is** a park near my house", không phải "Have a park near my house".', 'Do not use have for existence: "**There is** a park near my house".'),
    ],
  },
  {
    id: 'demonstratives',
    level: 'A1',
    title: l('This / that / these / those', 'This / that / these / those'),
    summary: l('Chỉ vật ở gần hay ở xa, số ít hay số nhiều.', 'Point to things near or far, singular or plural.'),
    sections: [
      {
        table: table(
          ['', l('Số ít', 'Singular'), l('Số nhiều', 'Plural')],
          [
            [l('Gần (đây)', 'Near (here)'), 'this', 'these'],
            [l('Xa (kia)', 'Far (there)'), 'that', 'those'],
          ],
        ),
        body: l(
          'Có thể đứng một mình như đại từ (**This** is my sister) hoặc đi trước danh từ (**this** book). Dùng **one / ones** để khỏi lặp danh từ.',
          'They can stand alone (**This** is my sister) or come before a noun (**this** book). Use **one / ones** to avoid repeating the noun.',
        ),
        examples: [
          ex('**This** is my phone.', 'Đây là điện thoại của tôi.'),
          ex('**Those** shoes are expensive.', 'Đôi giày kia đắt.'),
          ex('Who is **that**?', 'Người kia là ai?'),
          ex('I like **these** photos.', 'Tôi thích những bức ảnh này.'),
          ex('Do you want this cake or **that one**?', 'Bạn muốn cái bánh này hay cái kia?'),
        ],
      },
    ],
  },
  {
    id: 'possessive-s',
    level: 'A1',
    title: l("Sở hữu cách 's và of", "Possessive 's and of"),
    summary: l("Nói một vật thuộc về ai: Lan's bag, the end of the film.", "Say who something belongs to: Lan's bag, the end of the film."),
    sections: [
      {
        bullets: [
          l("Người và con vật: thêm **'s**: Lan**'s** bag, my dog**'s** name.", "People and animals: add **'s**: Lan**'s** bag, my dog**'s** name."),
          l("Danh từ số nhiều tận cùng -s: chỉ thêm **'**: my parents**'** house.", "Plural nouns ending in -s: add only **'**: my parents**'** house."),
          l("Số nhiều bất quy tắc: thêm **'s**: the children**'s** toys.", "Irregular plurals: add **'s**: the children**'s** toys."),
          l('Đồ vật, ý tưởng: thường dùng **of**: the door **of** the car, the end **of** the film.', 'Things and ideas: usually **of**: the door **of** the car, the end **of** the film.'),
          l('Hỏi sở hữu bằng **whose**: **Whose** bag is this?', 'Ask with **whose**: **Whose** bag is this?'),
        ],
        examples: [
          ex("This is **Minh's** laptop.", 'Đây là máy tính xách tay của Minh.'),
          ex("My **sister's** husband is Korean.", 'Chồng của chị gái tôi là người Hàn.'),
          ex("The **students'** books are on the desk.", 'Sách của các học sinh ở trên bàn.'),
          ex('I love the colour **of** this room.', 'Tôi thích màu sắc của căn phòng này.'),
          ex("**Whose** keys are these? – They're **Tom's**.", 'Chìa khoá này của ai? – Của Tom.'),
        ],
      },
    ],
  },
  {
    id: 'questions',
    level: 'A1',
    title: l('Câu hỏi Yes/No và Wh-', 'Yes/No and Wh- questions'),
    summary: l('Đảo trợ động từ lên trước chủ ngữ; thêm từ để hỏi ở đầu câu.', 'Put the auxiliary before the subject; add a question word at the front.'),
    sections: [
      {
        title: l('Câu hỏi Yes/No', 'Yes/No questions'),
        body: l(
          'Đưa **be**, **can** hoặc trợ động từ **do/does/did** lên trước chủ ngữ. Trả lời ngắn bằng chính trợ động từ đó.',
          'Move **be**, **can** or the auxiliary **do/does/did** before the subject. Answer with the same auxiliary.',
        ),
        examples: [
          ex('**Are** you tired? – Yes, I am.', 'Bạn mệt à? – Ừ, mệt.'),
          ex('**Can** she swim? – No, she can\'t.', 'Cô ấy biết bơi không? – Không.'),
          ex('**Do** they live here? – Yes, they do.', 'Họ sống ở đây à? – Đúng vậy.'),
        ],
      },
      {
        title: l('Từ để hỏi', 'Question words'),
        table: table(
          [l('Từ', 'Word'), l('Nghĩa', 'Meaning'), l('Ví dụ', 'Example')],
          [
            ['what', l('cái gì', 'thing'), 'What is your name?'],
            ['who', l('ai', 'person'), 'Who is that man?'],
            ['where', l('ở đâu', 'place'), 'Where do you live?'],
            ['when', l('khi nào', 'time'), 'When is your birthday?'],
            ['why', l('tại sao', 'reason'), 'Why are you late?'],
            ['how', l('như thế nào', 'way'), 'How do you go to work?'],
            ['which', l('cái nào (có lựa chọn)', 'choice'), 'Which colour do you like?'],
            ['whose', l('của ai', 'owner'), 'Whose phone is this?'],
            ['how much / many', l('bao nhiêu', 'quantity'), 'How many brothers do you have?'],
            ['how old / often / long', l('bao nhiêu tuổi / thường xuyên / bao lâu', 'age / frequency / duration'), 'How often do you swim?'],
          ],
        ),
      },
      {
        title: l('Trật tự từ', 'Word order'),
        body: l(
          '**Từ để hỏi + trợ động từ + chủ ngữ + động từ chính**. Riêng khi hỏi về **chủ ngữ** (who, what làm chủ ngữ) thì không cần do/does.',
          '**Question word + auxiliary + subject + main verb**. When the question word is the **subject**, there is no do/does.',
        ),
        examples: [
          ex('Where **do** you work?', 'Bạn làm việc ở đâu?'),
          ex('What time **does** the film start?', 'Phim bắt đầu lúc mấy giờ?'),
          ex('**Who called** you?', 'Ai đã gọi cho bạn? (who là chủ ngữ)'),
          ex('Who **did** you call?', 'Bạn đã gọi cho ai? (who là tân ngữ)'),
        ],
      },
    ],
  },
  {
    id: 'can',
    level: 'A1',
    title: l('Can / can’t / could', 'Can / can’t / could'),
    summary: l('Khả năng, sự cho phép và lời đề nghị.', 'Ability, permission and requests.'),
    sections: [
      {
        title: STRUCTURE,
        body: l(
          '**can + động từ nguyên mẫu** cho mọi chủ ngữ: không thêm -s, không thêm to. Phủ định: **can\'t / cannot**. Quá khứ: **could / couldn\'t**.',
          '**can + base verb** for every subject: no -s and no to. Negative: **can\'t / cannot**. Past: **could / couldn\'t**.',
        ),
        table: table(
          [FORM, l('Ví dụ', 'Example')],
          [
            [AFF, 'She can swim.'],
            [NEG, "She can't swim."],
            [QUE, 'Can she swim? – Yes, she can. / No, she can\'t.'],
          ],
        ),
      },
      {
        title: USE,
        bullets: [
          l('Khả năng: I **can** speak three languages.', 'Ability: I **can** speak three languages.'),
          l('Xin phép / cho phép: **Can** I open the window? You **can** sit here.', 'Permission: **Can** I open the window? You **can** sit here.'),
          l('Nhờ vả: **Can** you help me? **Could** you help me? (lịch sự hơn)', 'Requests: **Can** you help me? **Could** you help me? (more polite)'),
          l('Khả năng trong quá khứ: I **could** read when I was four.', 'Past ability: I **could** read when I was four.'),
        ],
        examples: [
          ex('I **can** play the piano.', 'Tôi biết chơi piano.'),
          ex("My grandmother **can't** use a smartphone.", 'Bà tôi không biết dùng điện thoại thông minh.'),
          ex('**Could** you speak more slowly, please?', 'Bạn có thể nói chậm hơn được không?'),
          ex("I **couldn't** sleep last night.", 'Tối qua tôi không ngủ được.'),
        ],
      },
    ],
    tips: [l('Sai: "She can **to** swim" / "She can **swims**". Đúng: "She can **swim**".', 'Wrong: "She can **to** swim" / "She can **swims**". Right: "She can **swim**".')],
  },
  {
    id: 'imperatives',
    level: 'A1',
    title: l('Câu mệnh lệnh và Let’s', 'Imperatives and Let’s'),
    summary: l('Ra lệnh, hướng dẫn, khuyên và rủ rê.', 'Give orders, instructions and advice, and make suggestions.'),
    sections: [
      {
        bullets: [
          l('Khẳng định: dùng **động từ nguyên mẫu**, không có chủ ngữ: **Open** your books.', 'Affirmative: the **base verb**, with no subject: **Open** your books.'),
          l('Phủ định: **Don\'t + động từ**: **Don\'t touch** that!', 'Negative: **Don\'t + verb**: **Don\'t touch** that!'),
          l('Thêm **please** cho lịch sự: Please sit down.', 'Add **please** to be polite: Please sit down.'),
          l('Rủ rê: **Let\'s + động từ**: **Let\'s go**! / **Let\'s not** wait.', 'Suggestions: **Let\'s + verb**: **Let\'s go**! / **Let\'s not** wait.'),
        ],
        examples: [
          ex('**Turn** left at the traffic lights.', 'Rẽ trái ở đèn giao thông.'),
          ex("**Don't be** late!", 'Đừng đến muộn nhé!'),
          ex('Please **close** the door.', 'Làm ơn đóng cửa lại.'),
          ex("**Let's have** lunch together.", 'Chúng ta cùng ăn trưa đi.'),
        ],
      },
    ],
  },
  {
    id: 'prepositions-time',
    level: 'A1',
    title: l('Giới từ chỉ thời gian: in / on / at', 'Prepositions of time: in / on / at'),
    summary: l('in cho khoảng thời gian dài, on cho ngày, at cho thời điểm.', 'in for longer periods, on for days, at for exact times.'),
    sections: [
      {
        table: table(
          [l('Giới từ', 'Preposition'), l('Dùng với', 'Used with'), l('Ví dụ', 'Examples')],
          [
            ['in', l('tháng, năm, mùa, thế kỷ, buổi trong ngày', 'months, years, seasons, centuries, parts of the day'), 'in May, in 2025, in summer, in the morning'],
            ['on', l('thứ, ngày tháng, ngày lễ cụ thể', 'days, dates, specific holidays'), 'on Monday, on 2 September, on my birthday'],
            ['at', l('giờ, thời điểm, dịp', 'clock times, moments, festivals'), "at 7 o'clock, at night, at noon, at Christmas"],
          ],
        ),
        body: l(
          'Không dùng giới từ trước **this, next, last, every, tomorrow, yesterday**: I\'ll see you **next week** (không phải "in next week").',
          'No preposition before **this, next, last, every, tomorrow, yesterday**: I\'ll see you **next week**.',
        ),
        examples: [
          ex('I was born **in** 1998.', 'Tôi sinh năm 1998.'),
          ex('We have English **on** Tuesdays.', 'Chúng tôi học tiếng Anh vào thứ Ba.'),
          ex('The class starts **at** 8:30.', 'Lớp học bắt đầu lúc 8 giờ 30.'),
          ex('I usually read **in** the evening.', 'Tôi thường đọc sách vào buổi tối.'),
        ],
      },
    ],
    tips: [l('Nhớ: **at** night nhưng **in** the morning / afternoon / evening.', 'Remember: **at** night but **in** the morning / afternoon / evening.')],
  },
  {
    id: 'prepositions-place',
    level: 'A1',
    title: l('Giới từ chỉ nơi chốn', 'Prepositions of place'),
    summary: l('in, on, at và các giới từ chỉ vị trí như under, next to, between.', 'in, on, at and position words like under, next to, between.'),
    sections: [
      {
        table: table(
          [l('Giới từ', 'Preposition'), l('Nghĩa', 'Meaning'), l('Ví dụ', 'Example')],
          [
            ['in', l('bên trong', 'inside'), 'in the box, in Hanoi'],
            ['on', l('trên bề mặt', 'on a surface'), 'on the table, on the wall'],
            ['at', l('tại một điểm, địa điểm', 'at a point or place'), 'at the bus stop, at home, at school'],
            ['under', l('bên dưới', 'below'), 'under the bed'],
            ['next to', l('bên cạnh', 'beside'), 'next to the bank'],
            ['between', l('ở giữa (hai vật)', 'between two things'), 'between the café and the shop'],
            ['behind / in front of', l('phía sau / phía trước', 'behind / in front of'), 'behind the door, in front of the house'],
            ['opposite', l('đối diện', 'across from'), 'opposite the station'],
            ['above / below', l('phía trên / phía dưới (không chạm)', 'higher / lower (not touching)'), 'above the sofa'],
          ],
        ),
        examples: [
          ex('My phone is **on** the desk.', 'Điện thoại của tôi ở trên bàn.'),
          ex('The cat is **under** the chair.', 'Con mèo ở dưới ghế.'),
          ex("I'm **at** the airport.", 'Tôi đang ở sân bay.'),
          ex('The pharmacy is **between** the bank and the supermarket.', 'Hiệu thuốc ở giữa ngân hàng và siêu thị.'),
        ],
      },
    ],
  },
  {
    id: 'countable-uncountable',
    level: 'A1',
    title: l('Danh từ đếm được, không đếm được; some / any / much / many', 'Countable and uncountable; some / any / much / many'),
    summary: l('Chọn đúng từ chỉ số lượng cho từng loại danh từ.', 'Use the right quantity word for each kind of noun.'),
    sections: [
      {
        title: l('Hai loại danh từ', 'Two kinds of nouns'),
        body: l(
          '**Đếm được** có số ít và số nhiều: an apple, two apples. **Không đếm được** không có số nhiều và không đi với a/an: water, rice, money, bread, information, advice, furniture, homework.',
          '**Countable** nouns have singular and plural forms: an apple, two apples. **Uncountable** nouns have no plural and no a/an: water, rice, money, bread, information, advice, furniture, homework.',
        ),
      },
      {
        title: l('Từ chỉ số lượng', 'Quantity words'),
        table: table(
          ['', l('Đếm được (số nhiều)', 'Countable (plural)'), l('Không đếm được', 'Uncountable')],
          [
            [l('Khẳng định', 'Affirmative'), 'some apples, a lot of apples, a few apples', 'some water, a lot of water, a little water'],
            [l('Phủ định / câu hỏi', 'Negative / question'), "any apples, not many apples", "any water, not much water"],
            [l('Hỏi số lượng', 'Asking about quantity'), 'How many apples?', 'How much water?'],
          ],
        ),
        examples: [
          ex('I need **some** eggs and **some** milk.', 'Tôi cần một ít trứng và một ít sữa.'),
          ex("There aren't **any** chairs.", 'Không có cái ghế nào.'),
          ex("I don't have **much** time.", 'Tôi không có nhiều thời gian.'),
          ex('**How many** languages do you speak?', 'Bạn nói được bao nhiêu thứ tiếng?'),
          ex('Can I have **some** water, please?', 'Cho tôi xin chút nước được không? (lời mời, nhờ vả dùng some)'),
        ],
      },
    ],
    tips: [
      l('Không nói "rices", "informations", "advices", "furnitures". Muốn đếm thì dùng đơn vị: a bowl of rice, a piece of advice.', 'Never say "rices", "informations", "advices". Use a unit to count them: a bowl of rice, a piece of advice.'),
    ],
  },
  {
    id: 'adverbs-frequency',
    level: 'A1',
    title: l('Trạng từ chỉ tần suất', 'Adverbs of frequency'),
    summary: l('always, usually, often, sometimes, rarely, never và vị trí của chúng trong câu.', 'always, usually, often, sometimes, rarely, never and where they go.'),
    sections: [
      {
        table: table(
          [l('Trạng từ', 'Adverb'), l('Mức độ', 'How often'), l('Nghĩa', 'Meaning')],
          [
            ['always', '100%', l('luôn luôn', 'every time')],
            ['usually', '≈ 90%', l('thường thường', 'usually')],
            ['often', '≈ 70%', l('thường xuyên', 'often')],
            ['sometimes', '≈ 50%', l('thỉnh thoảng', 'sometimes')],
            ['rarely / seldom', '≈ 10%', l('hiếm khi', 'rarely')],
            ['never', '0%', l('không bao giờ', 'never')],
          ],
        ),
      },
      {
        title: l('Vị trí', 'Position'),
        body: l(
          'Đứng **trước động từ thường** nhưng **sau to be** (và sau can, will…). Hỏi tần suất bằng **How often…?**',
          'They go **before main verbs** but **after be** (and after can, will…). Ask with **How often…?**',
        ),
        examples: [
          ex('I **usually** walk to work.', 'Tôi thường đi bộ đi làm.'),
          ex('She is **always** late.', 'Cô ấy luôn đến muộn.'),
          ex('We **never** eat fast food.', 'Chúng tôi không bao giờ ăn đồ ăn nhanh.'),
          ex('**How often** do you exercise? – Three times a week.', 'Bạn tập thể dục thường xuyên như thế nào? – Ba lần một tuần.'),
        ],
      },
    ],
    tips: [l('never đã mang nghĩa phủ định: "I **never** drink coffee", không phải "I don\'t never drink".', 'never is already negative: "I **never** drink coffee", not "I don\'t never drink".')],
  },
  {
    id: 'past-be',
    level: 'A1',
    title: l('Quá khứ của to be: was / were', 'Past of be: was / were'),
    summary: l('Nói ai đó ở đâu, như thế nào trong quá khứ.', 'Say where or how someone was in the past.'),
    sections: [
      {
        table: table(
          [l('Chủ ngữ', 'Subject'), AFF, NEG, QUE],
          [
            ['I / he / she / it', 'I was', "I wasn't", 'Was I…?'],
            ['you / we / they', 'they were', "they weren't", 'Were they…?'],
          ],
        ),
        body: l('Dấu hiệu: yesterday, last night / week / year, … ago, in 2010.', 'Signal words: yesterday, last night / week / year, … ago, in 2010.'),
        examples: [
          ex('I **was** at home yesterday.', 'Hôm qua tôi ở nhà.'),
          ex('They **were** very happy.', 'Họ đã rất vui.'),
          ex("The test **wasn't** difficult.", 'Bài kiểm tra không khó.'),
          ex('**Were** you tired last night? – Yes, I **was**.', 'Tối qua bạn mệt à? – Ừ, mệt.'),
        ],
      },
    ],
  },
  {
    id: 'past-simple',
    level: 'A1',
    title: l('Thì quá khứ đơn', 'Past simple'),
    summary: l('Hành động đã xảy ra và kết thúc tại một thời điểm xác định trong quá khứ.', 'Finished actions at a specific time in the past.'),
    sections: [
      {
        title: STRUCTURE,
        table: table(
          [FORM, l('Ví dụ', 'Example')],
          [
            [AFF, 'I worked. / I went.'],
            [NEG, "I didn't work. / I didn't go."],
            [QUE, 'Did you work? / Did you go?'],
          ],
        ),
        body: l(
          'Động từ có quy tắc thêm **-ed**: work → worked, live → lived, stop → stopped, study → studied. Phủ định và câu hỏi dùng **did + động từ nguyên mẫu** cho mọi chủ ngữ.',
          'Regular verbs add **-ed**: work → worked, live → lived, stop → stopped, study → studied. Negatives and questions use **did + base verb** for every subject.',
        ),
      },
      {
        title: l('Động từ bất quy tắc thông dụng', 'Common irregular verbs'),
        table: table(
          [l('Nguyên mẫu', 'Base'), l('Quá khứ', 'Past'), l('Nguyên mẫu', 'Base'), l('Quá khứ', 'Past')],
          [
            ['be', 'was / were', 'go', 'went'],
            ['have', 'had', 'do', 'did'],
            ['see', 'saw', 'eat', 'ate'],
            ['buy', 'bought', 'take', 'took'],
            ['make', 'made', 'come', 'came'],
            ['get', 'got', 'say', 'said'],
            ['think', 'thought', 'write', 'wrote'],
            ['give', 'gave', 'meet', 'met'],
          ],
        ),
        examples: [
          ex('I **visited** my grandparents last weekend.', 'Cuối tuần trước tôi đã về thăm ông bà.'),
          ex('She **went** to Japan in 2023.', 'Cô ấy đã đi Nhật năm 2023.'),
          ex("We **didn't watch** TV yesterday.", 'Hôm qua chúng tôi không xem TV.'),
          ex('**Did** you **finish** your homework?', 'Bạn đã làm xong bài tập về nhà chưa?'),
          ex('What **did** you **eat** for dinner?', 'Bạn đã ăn gì vào bữa tối?'),
        ],
      },
    ],
    tips: [
      l('Sau did dùng nguyên mẫu: "Did you **go**?", không phải "Did you went?".', 'After did, use the base verb: "Did you **go**?", not "Did you went?".'),
      l('Nhớ cách đọc đuôi -ed: /t/, /d/ hoặc /ɪd/ (xem phần Phát âm).', 'Remember the three -ed pronunciations: /t/, /d/ or /ɪd/ (see Pronunciation).'),
    ],
  },
  {
    id: 'future',
    level: 'A2',
    title: l('Tương lai: will và be going to', 'The future: will and be going to'),
    summary: l('will cho quyết định tức thời và dự đoán; be going to cho kế hoạch và điều sắp xảy ra.', 'will for instant decisions and predictions; be going to for plans and things about to happen.'),
    sections: [
      {
        title: STRUCTURE,
        table: table(
          [FORM, 'will', 'be going to'],
          [
            [AFF, "I'll (will) help you.", "I'm going to study."],
            [NEG, "I won't (will not) tell.", "She isn't going to come."],
            [QUE, 'Will you come?', 'Are you going to buy it?'],
          ],
        ),
      },
      {
        title: USE,
        table: table(
          ['will', 'be going to'],
          [
            [l('Quyết định ngay lúc nói: The phone\'s ringing. I\'ll get it.', 'A decision made now: The phone\'s ringing. I\'ll get it.'), l('Kế hoạch đã quyết định từ trước: I\'m going to learn Japanese.', 'A plan decided earlier: I\'m going to learn Japanese.')],
            [l('Dự đoán theo ý kiến: I think it will rain.', 'A prediction from opinion: I think it will rain.'), l('Dự đoán có bằng chứng: Look at those clouds! It\'s going to rain.', 'A prediction from evidence: Look at those clouds! It\'s going to rain.')],
            [l('Hứa hẹn, đề nghị: I\'ll call you tonight.', 'Promises and offers: I\'ll call you tonight.'), ''],
          ],
        ),
        examples: [
          ex("I'm tired. I **think I'll go** to bed.", 'Tôi mệt rồi. Chắc tôi đi ngủ đây.'),
          ex("We**'re going to move** to Da Nang next year.", 'Năm sau chúng tôi sẽ chuyển đến Đà Nẵng.'),
          ex("Don't worry, I **won't forget**.", 'Đừng lo, tôi sẽ không quên đâu.'),
          ex('**Will** you **marry** me?', 'Em sẽ lấy anh chứ?'),
        ],
      },
    ],
    tips: [
      l('Với lịch hẹn đã sắp xếp có thời gian cụ thể, người bản ngữ hay dùng hiện tại tiếp diễn: I\'m meeting Tom at 6.', 'For fixed arrangements, natives often use the present continuous: I\'m meeting Tom at 6.'),
    ],
  },
  {
    id: 'present-perfect',
    level: 'A2',
    title: l('Thì hiện tại hoàn thành', 'Present perfect'),
    summary: l('Nối quá khứ với hiện tại: kinh nghiệm, kết quả còn ảnh hưởng, việc kéo dài đến nay.', 'Links past and present: experiences, present results and situations continuing until now.'),
    sections: [
      {
        title: STRUCTURE,
        body: l('**have / has + V3 (quá khứ phân từ)**', '**have / has + past participle**'),
        table: table(
          [FORM, l('Ví dụ', 'Example')],
          [
            [AFF, "I've (have) seen it. / She's (has) finished."],
            [NEG, "I haven't seen it. / She hasn't finished."],
            [QUE, 'Have you seen it? / Has she finished?'],
          ],
        ),
      },
      {
        title: USE,
        bullets: [
          l('Kinh nghiệm (không nói khi nào): **Have** you **ever been** to Korea?', 'Experience (no specific time): **Have** you **ever been** to Korea?'),
          l('Kết quả còn ở hiện tại: I**\'ve lost** my keys (bây giờ vẫn chưa tìm thấy).', 'A result now: I**\'ve lost** my keys (I still don\'t have them).'),
          l('Kéo dài đến hiện tại với **for** (khoảng thời gian) và **since** (mốc thời gian): I\'ve lived here **for** five years / **since** 2020.', 'Up to now, with **for** (a period) and **since** (a starting point): I\'ve lived here **for** five years / **since** 2020.'),
          l('Với **just, already, yet**: I\'ve **just** eaten. Have you finished **yet**?', 'With **just, already, yet**: I\'ve **just** eaten. Have you finished **yet**?'),
        ],
        examples: [
          ex("I**'ve never eaten** sushi.", 'Tôi chưa bao giờ ăn sushi.'),
          ex('She **has worked** here since 2019.', 'Cô ấy làm việc ở đây từ năm 2019.'),
          ex("We **haven't decided** yet.", 'Chúng tôi vẫn chưa quyết định.'),
          ex('**Have** you **finished** your report? – Yes, I**\'ve just finished** it.', 'Bạn làm xong báo cáo chưa? – Rồi, tôi vừa xong.'),
        ],
      },
      {
        title: l('So với quá khứ đơn', 'Compared with the past simple'),
        body: l(
          'Có thời gian cụ thể đã kết thúc (yesterday, in 2010, last week) thì dùng **quá khứ đơn**. Không nói thời gian, hoặc thời gian chưa kết thúc (today, this year) thì dùng **hiện tại hoàn thành**.',
          'With a finished time (yesterday, in 2010, last week) use the **past simple**. With no time, or an unfinished one (today, this year), use the **present perfect**.',
        ),
        examples: [ex("I**'ve been** to Paris. I **went** there in 2019.", 'Tôi đã từng đến Paris. Tôi đến đó vào năm 2019.')],
      },
    ],
    tips: [
      l('V3 thông dụng: be → been, go → gone/been, do → done, see → seen, eat → eaten, write → written, take → taken.', 'Common participles: be → been, go → gone/been, do → done, see → seen, eat → eaten, write → written, take → taken.'),
      l('Sai: "I have seen him yesterday". Đúng: "I **saw** him yesterday".', 'Wrong: "I have seen him yesterday". Right: "I **saw** him yesterday".'),
    ],
  },
  {
    id: 'past-continuous',
    level: 'A2',
    title: l('Thì quá khứ tiếp diễn', 'Past continuous'),
    summary: l('Hành động đang diễn ra tại một thời điểm trong quá khứ, hoặc bị một việc khác xen vào.', 'An action in progress at a past moment, or interrupted by another action.'),
    sections: [
      {
        title: STRUCTURE,
        body: l('**was / were + V-ing**', '**was / were + verb-ing**'),
        bullets: [
          l('Đang làm gì lúc nào đó: At 8 pm yesterday, I **was cooking**.', 'In progress at a past time: At 8 pm yesterday, I **was cooking**.'),
          l('Việc dài bị việc ngắn (quá khứ đơn) xen vào, dùng **when**: I **was walking** home **when** it **started** to rain.', 'A longer action interrupted by a shorter one with **when**: I **was walking** home **when** it **started** to rain.'),
          l('Hai việc đang diễn ra song song, dùng **while**: **While** I was cooking, my sister was reading.', 'Two actions at the same time with **while**: **While** I was cooking, my sister was reading.'),
        ],
        examples: [
          ex('What **were** you **doing** at 10 last night?', 'Bạn đang làm gì lúc 10 giờ tối qua?'),
          ex('She **was sleeping** when the phone **rang**.', 'Cô ấy đang ngủ thì điện thoại reo.'),
          ex("They **weren't listening** to the teacher.", 'Họ đã không nghe giáo viên giảng.'),
        ],
      },
    ],
  },
  {
    id: 'comparatives-superlatives',
    level: 'A2',
    title: l('So sánh hơn và so sánh nhất', 'Comparatives and superlatives'),
    summary: l('taller / the tallest, more beautiful / the most beautiful, as … as.', 'taller / the tallest, more beautiful / the most beautiful, as … as.'),
    sections: [
      {
        table: table(
          [l('Tính từ', 'Adjective'), l('So sánh hơn', 'Comparative'), l('So sánh nhất', 'Superlative')],
          [
            [l('1 âm tiết: tall', 'One syllable: tall'), 'taller', 'the tallest'],
            [l('Tận cùng -e: large', 'Ending in -e: large'), 'larger', 'the largest'],
            [l('Phụ âm-nguyên âm-phụ âm: big', 'Consonant-vowel-consonant: big'), 'bigger', 'the biggest'],
            [l('Tận cùng -y: happy', 'Ending in -y: happy'), 'happier', 'the happiest'],
            [l('2 âm tiết trở lên: beautiful', 'Two or more syllables: beautiful'), 'more beautiful', 'the most beautiful'],
            [l('Bất quy tắc: good / bad / far', 'Irregular: good / bad / far'), 'better / worse / further', 'the best / the worst / the furthest'],
          ],
        ),
      },
      {
        title: l('Mẫu câu', 'Patterns'),
        bullets: [
          l('So sánh hơn: A is **taller than** B.', 'Comparative: A is **taller than** B.'),
          l('So sánh nhất: A is **the tallest** (in the class / of all).', 'Superlative: A is **the tallest** (in the class / of all).'),
          l('So sánh bằng: A is **as tall as** B; A is **not as** tall **as** B.', 'Equality: A is **as tall as** B; A is **not as** tall **as** B.'),
        ],
        examples: [
          ex('My brother is **taller than** me.', 'Anh trai tôi cao hơn tôi.'),
          ex('This is **the most beautiful** beach in Vietnam.', 'Đây là bãi biển đẹp nhất Việt Nam.'),
          ex('Today is **better than** yesterday.', 'Hôm nay tốt hơn hôm qua.'),
          ex('Korean is **not as difficult as** I thought.', 'Tiếng Hàn không khó như tôi nghĩ.'),
        ],
      },
    ],
    tips: [l('Không dùng hai lần so sánh: "more bigger" là sai, chỉ nói "bigger".', 'Never double up: "more bigger" is wrong; say "bigger".')],
  },
  {
    id: 'modals-obligation',
    level: 'A2',
    title: l('should / must / have to', 'should / must / have to'),
    summary: l('Lời khuyên, sự bắt buộc, sự cấm đoán và việc không cần thiết.', 'Advice, obligation, prohibition and lack of necessity.'),
    sections: [
      {
        table: table(
          [l('Động từ', 'Verb'), l('Ý nghĩa', 'Meaning'), l('Ví dụ', 'Example')],
          [
            ['should / shouldn\'t', l('nên / không nên (lời khuyên)', 'advice'), 'You should drink more water.'],
            ['must', l('phải (người nói thấy cần, quy định)', 'strong obligation, the speaker\'s view'), 'I must call my mum.'],
            ['have to / has to', l('phải (do hoàn cảnh, luật bên ngoài)', 'external obligation'), 'I have to wear a uniform.'],
            ['mustn\'t', l('cấm, không được', 'prohibition'), "You mustn't smoke here."],
            ['don\'t have to', l('không cần (có thể làm nếu muốn)', 'not necessary'), "You don't have to come."],
          ],
        ),
        examples: [
          ex('You **should** see a doctor.', 'Bạn nên đi khám bác sĩ.'),
          ex('Students **must** switch off their phones.', 'Học sinh phải tắt điện thoại.'),
          ex('She **has to** get up at 5 for work.', 'Cô ấy phải dậy lúc 5 giờ để đi làm.'),
          ex("It's Sunday. I **don't have to** work.", 'Hôm nay Chủ nhật. Tôi không phải đi làm.'),
        ],
      },
    ],
    tips: [
      l('**mustn\'t** (cấm) khác hẳn **don\'t have to** (không cần).', '**mustn\'t** (forbidden) is very different from **don\'t have to** (not necessary).'),
      l('Quá khứ của must/have to là **had to**: I had to work late yesterday.', 'The past of must/have to is **had to**: I had to work late yesterday.'),
    ],
  },
  {
    id: 'gerunds-infinitives',
    level: 'A2',
    title: l('V-ing và to V', 'Gerunds and infinitives'),
    summary: l('Sau một số động từ dùng V-ing, sau một số khác dùng to + V.', 'Some verbs are followed by -ing, others by to + verb.'),
    sections: [
      {
        table: table(
          [l('Theo sau là V-ing', 'Followed by -ing'), l('Theo sau là to V', 'Followed by to + verb')],
          [
            ['enjoy, finish, mind, avoid, suggest, keep, practise', 'want, need, hope, decide, plan, learn, promise, agree'],
            [l('like, love, hate (dùng cả hai đều được)', 'like, love, hate (both are possible)'), l('would like, would love (luôn dùng to V)', 'would like, would love (always to + verb)')],
          ],
        ),
        bullets: [
          l('Sau **giới từ** luôn dùng V-ing: I\'m interested **in learning** Japanese.', 'After **prepositions** always use -ing: I\'m interested **in learning** Japanese.'),
          l('V-ing làm **chủ ngữ**: **Swimming** is good for you.', '-ing as a **subject**: **Swimming** is good for you.'),
          l('**to V** chỉ **mục đích**: I went to the shop **to buy** milk.', '**to + verb** for **purpose**: I went to the shop **to buy** milk.'),
        ],
        examples: [
          ex('I **enjoy cooking**.', 'Tôi thích nấu ăn.'),
          ex('She **wants to become** a pilot.', 'Cô ấy muốn trở thành phi công.'),
          ex('**Would** you **like to come** with us?', 'Bạn có muốn đi cùng chúng tôi không?'),
          ex("He **finished writing** the report.", 'Anh ấy đã viết xong báo cáo.'),
          ex('Thank you **for helping** me.', 'Cảm ơn bạn đã giúp tôi.'),
        ],
      },
    ],
  },
  {
    id: 'conditionals',
    level: 'A2',
    title: l('Câu điều kiện loại 0, 1 và 2', 'Zero, first and second conditionals'),
    summary: l('Sự thật, khả năng có thật trong tương lai và giả định không có thật.', 'Facts, real future possibilities and imaginary situations.'),
    sections: [
      {
        table: table(
          [l('Loại', 'Type'), l('Mệnh đề If', 'If clause'), l('Mệnh đề chính', 'Main clause'), l('Dùng cho', 'Use')],
          [
            ['0', 'If + present simple', 'present simple', l('sự thật, quy luật', 'facts, rules')],
            ['1', 'If + present simple', 'will + V', l('có thể xảy ra trong tương lai', 'real future possibility')],
            ['2', 'If + past simple', 'would + V', l('giả định, không có thật ở hiện tại', 'unreal or imaginary present')],
          ],
        ),
        examples: [
          ex('If you **heat** ice, it **melts**.', 'Nếu bạn đun nóng đá, nó sẽ tan.'),
          ex("If it **rains** tomorrow, we**'ll stay** at home.", 'Nếu mai trời mưa, chúng ta sẽ ở nhà.'),
          ex('If I **had** more money, I **would travel** around the world.', 'Nếu tôi có nhiều tiền hơn, tôi sẽ đi du lịch vòng quanh thế giới.'),
          ex('If I **were** you, I **would take** the job.', 'Nếu tôi là bạn, tôi sẽ nhận công việc đó.'),
        ],
      },
    ],
    tips: [
      l('Không dùng will trong mệnh đề if: "If it **rains**", không phải "If it will rain".', 'No will in the if-clause: "If it **rains**", not "If it will rain".'),
      l('Loại 2 dùng **were** cho mọi chủ ngữ trong văn chuẩn: If I were…, If she were…', 'Type 2 uses **were** for every subject in careful English: If I were…, If she were…'),
      l('Mệnh đề if có thể đứng sau; khi đứng đầu thì có dấu phẩy.', 'The if-clause can come second; use a comma when it comes first.'),
    ],
  },
  {
    id: 'passive',
    level: 'A2',
    title: l('Câu bị động', 'The passive voice'),
    summary: l('be + V3: nhấn vào hành động hoặc đối tượng chịu tác động thay vì người làm.', 'be + past participle: focus on the action or what is affected, not who does it.'),
    sections: [
      {
        table: table(
          [l('Thì', 'Tense'), l('Chủ động', 'Active'), l('Bị động', 'Passive')],
          [
            [l('Hiện tại đơn', 'Present simple'), 'They make cars here.', 'Cars **are made** here.'],
            [l('Quá khứ đơn', 'Past simple'), 'Someone stole my bike.', 'My bike **was stolen**.'],
            [l('Hiện tại hoàn thành', 'Present perfect'), 'They have built a new bridge.', 'A new bridge **has been built**.'],
            ['will', 'They will open the shop.', 'The shop **will be opened**.'],
          ],
        ),
        body: l(
          'Thêm **by + người làm** chỉ khi thông tin đó quan trọng: The Mona Lisa was painted **by** Leonardo da Vinci.',
          'Add **by + agent** only when it matters: The Mona Lisa was painted **by** Leonardo da Vinci.',
        ),
        examples: [
          ex('English **is spoken** all over the world.', 'Tiếng Anh được nói trên khắp thế giới.'),
          ex('This house **was built** in 1950.', 'Ngôi nhà này được xây năm 1950.'),
          ex('The results **will be announced** tomorrow.', 'Kết quả sẽ được công bố vào ngày mai.'),
        ],
      },
    ],
  },
  {
    id: 'relative-clauses',
    level: 'A2',
    title: l('Mệnh đề quan hệ: who / which / that', 'Relative clauses: who / which / that'),
    summary: l('Bổ sung thông tin cho danh từ đứng trước.', 'Add information about a noun.'),
    sections: [
      {
        table: table(
          [l('Đại từ', 'Pronoun'), l('Thay cho', 'Refers to'), l('Ví dụ', 'Example')],
          [
            ['who', l('người', 'people'), 'the woman who lives next door'],
            ['which', l('vật, con vật', 'things, animals'), 'the book which I bought'],
            ['that', l('người hoặc vật (văn nói)', 'people or things (informal)'), 'the film that we watched'],
            ['whose', l('của người/vật đó', 'possession'), 'the boy whose dog is lost'],
            ['where', l('nơi chốn', 'places'), 'the town where I grew up'],
          ],
        ),
        body: l(
          'Khi đại từ quan hệ làm **tân ngữ**, có thể lược bỏ: the book (which) I bought.',
          'When the pronoun is the **object**, you can leave it out: the book (which) I bought.',
        ),
        examples: [
          ex('I have a friend **who** speaks five languages.', 'Tôi có một người bạn nói được năm thứ tiếng.'),
          ex('This is the phone **which** I told you about.', 'Đây là cái điện thoại mà tôi đã kể với bạn.'),
          ex('That\'s the café **where** we first met.', 'Đó là quán cà phê nơi chúng ta gặp nhau lần đầu.'),
          ex('The man **whose** car was stolen called the police.', 'Người đàn ông bị mất trộm xe đã gọi cảnh sát.'),
        ],
      },
    ],
  },
  {
    id: 'ed-ing-adjectives',
    level: 'A2',
    title: l('Tính từ đuôi -ed và -ing', '-ed and -ing adjectives'),
    summary: l('-ed tả cảm xúc của người; -ing tả tính chất của vật/sự việc gây ra cảm xúc.', '-ed describes how someone feels; -ing describes what causes the feeling.'),
    sections: [
      {
        table: table(
          [l('-ed (cảm thấy)', '-ed (feeling)'), l('-ing (gây ra)', '-ing (cause)')],
          [
            ['bored', 'boring'],
            ['interested', 'interesting'],
            ['tired', 'tiring'],
            ['excited', 'exciting'],
            ['surprised', 'surprising'],
            ['confused', 'confusing'],
          ],
        ),
        examples: [
          ex('I was **bored** because the film was **boring**.', 'Tôi chán vì bộ phim nhàm chán.'),
          ex("I'm **interested** in history. It's really **interesting**.", 'Tôi quan tâm đến lịch sử. Nó thật sự thú vị.'),
          ex('The long trip was **tiring**. We were all **tired**.', 'Chuyến đi dài thật mệt mỏi. Ai cũng mệt.'),
        ],
      },
    ],
    tips: [l('"I am boring" nghĩa là "Tôi là người nhàm chán", không phải "Tôi thấy chán".', '"I am boring" means you make others bored, not that you feel bored.')],
  },
  {
    id: 'used-to',
    level: 'A2',
    title: l('Used to', 'Used to'),
    summary: l('Thói quen hoặc trạng thái trong quá khứ, nay không còn nữa.', 'Past habits or states that are no longer true.'),
    sections: [
      {
        table: table(
          [FORM, l('Ví dụ', 'Example')],
          [
            [AFF, 'I used to play the guitar.'],
            [NEG, "I didn't use to like vegetables."],
            [QUE, 'Did you use to live here?'],
          ],
        ),
        examples: [
          ex('I **used to** live in Hue, but now I live in Hanoi.', 'Tôi từng sống ở Huế, nhưng giờ tôi sống ở Hà Nội.'),
          ex('She **used to** be very shy.', 'Cô ấy từng rất nhút nhát.'),
          ex("We **didn't use to** have a car.", 'Trước đây chúng tôi không có ô tô.'),
        ],
      },
    ],
    tips: [l('Sau did/didn\'t viết **use to** (không có d).', 'After did/didn\'t, write **use to** (no d).')],
  },
]

export default grammar
