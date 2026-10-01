import type { GrammarTopic } from '../../types'
import { ex, l, table } from '../helpers'

const PRONOUN = l('Đại từ', 'Pronoun')
const USE = l('Cách dùng', 'When to use it')
const STRUCTURE = l('Cấu trúc', 'Form')

const grammar: GrammarTopic[] = [
  {
    id: 'personal-pronouns',
    level: 'A1',
    title: l('Đại từ nhân xưng, du và Sie', 'Personal pronouns, du and Sie'),
    summary: l('ich, du, er, sie, es… và khi nào xưng "du" (thân mật) hay "Sie" (lịch sự).', 'ich, du, er, sie, es… and when to say "du" (informal) or "Sie" (formal).'),
    sections: [
      {
        table: table(
          [PRONOUN, l('Nghĩa', 'Meaning')],
          [
            ['ich', l('tôi', 'I')],
            ['du', l('bạn (thân mật, số ít)', 'you (informal, singular)')],
            ['er / sie / es', l('anh ấy / cô ấy / nó', 'he / she / it')],
            ['wir', l('chúng tôi, chúng ta', 'we')],
            ['ihr', l('các bạn (thân mật, số nhiều)', 'you (informal, plural)')],
            ['sie', l('họ', 'they')],
            ['Sie', l('ông, bà, anh, chị (lịch sự, số ít và số nhiều)', 'you (formal, singular and plural)')],
          ],
        ),
      },
      {
        title: l('du hay Sie?', 'du or Sie?'),
        body: l(
          'Dùng **du** với gia đình, bạn bè, trẻ em, bạn cùng lớp. Dùng **Sie** với người lạ, ở công sở, với nhân viên phục vụ và cơ quan. **Sie** luôn viết hoa và chia động từ giống **sie** (họ).',
          'Use **du** with family, friends, children and classmates. Use **Sie** with strangers, at work, in shops and offices. **Sie** is always capitalised and takes the same verb form as **sie** (they).',
        ),
      },
      {
        title: l('er / sie / es thay cho đồ vật', 'er / sie / es for things'),
        body: l(
          'Đại từ chọn theo **giống ngữ pháp** của danh từ, không theo nghĩa: der Tisch → **er**, die Lampe → **sie**, das Buch → **es**.',
          'The pronoun follows the noun\'s **grammatical gender**, not its meaning: der Tisch → **er**, die Lampe → **sie**, das Buch → **es**.',
        ),
        examples: [
          ex('**Ich** heiße Lan.', 'Tôi tên là Lan.', 'My name is Lan.'),
          ex('Woher kommst **du**?', 'Bạn đến từ đâu?', 'Where are you from?'),
          ex('Wie heißen **Sie**?', 'Ông/bà tên là gì?', 'What is your name? (formal)'),
          ex('Der Tisch ist neu. **Er** ist sehr schön.', 'Cái bàn mới. Nó rất đẹp.', 'The table is new. It is very nice.'),
        ],
      },
    ],
    tips: [l('Không chắc thì cứ dùng **Sie**; người Đức sẽ đề nghị chuyển sang du ("Wir können uns duzen").', 'When in doubt, use **Sie**; people will offer to switch to du ("Wir können uns duzen").')],
  },
  {
    id: 'sein-haben',
    level: 'A1',
    title: l('sein và haben', 'sein and haben'),
    summary: l('Hai động từ quan trọng nhất: "là / thì / ở" và "có".', 'The two most important verbs: "to be" and "to have".'),
    sections: [
      {
        table: table(
          [PRONOUN, 'sein', 'haben'],
          [
            ['ich', 'bin', 'habe'],
            ['du', 'bist', 'hast'],
            ['er / sie / es', 'ist', 'hat'],
            ['wir', 'sind', 'haben'],
            ['ihr', 'seid', 'habt'],
            ['sie / Sie', 'sind', 'haben'],
          ],
        ),
      },
      {
        title: USE,
        bullets: [
          l('**sein**: tên, quốc tịch, nghề nghiệp, tuổi, tính chất, nơi chốn.', '**sein**: name, nationality, job, age, qualities, location.'),
          l('**haben**: sở hữu, gia đình, và các cụm Hunger/Durst/Zeit/Angst haben (đói/khát/rảnh/sợ).', '**haben**: possession, family, and Hunger/Durst/Zeit/Angst haben (be hungry/thirsty/free/afraid).'),
        ],
        examples: [
          ex('Ich **bin** Student.', 'Tôi là sinh viên.', 'I am a student.'),
          ex('Ich **bin** 25 Jahre alt.', 'Tôi 25 tuổi.', 'I am 25 years old.'),
          ex('Wir **sind** müde.', 'Chúng tôi mệt.', 'We are tired.'),
          ex('Er **hat** zwei Kinder.', 'Anh ấy có hai con.', 'He has two children.'),
          ex('**Hast** du heute Zeit?', 'Hôm nay bạn có rảnh không?', 'Are you free today?'),
          ex('Ich **habe** Hunger.', 'Tôi đói.', 'I am hungry.'),
        ],
      },
    ],
    tips: [
      l('Nghề nghiệp không dùng mạo từ: Ich bin **Ärztin** (không phải "eine Ärztin").', 'No article with jobs: Ich bin **Ärztin**, not "eine Ärztin".'),
      l('Đói, khát dùng haben: Ich **habe** Durst (không nói "Ich bin durstig" trong giao tiếp thường ngày).', 'Hunger and thirst use haben: Ich **habe** Durst.'),
    ],
  },
  {
    id: 'present-tense',
    level: 'A1',
    title: l('Chia động từ thì hiện tại', 'Present tense conjugation'),
    summary: l('Đuôi -e, -st, -t, -en, -t, -en và các động từ đổi nguyên âm.', 'The endings -e, -st, -t, -en, -t, -en and verbs with a vowel change.'),
    sections: [
      {
        title: l('Động từ có quy tắc', 'Regular verbs'),
        body: l('Bỏ đuôi **-en** của động từ nguyên mẫu để lấy gốc, rồi thêm đuôi theo ngôi.', 'Remove **-en** from the infinitive to get the stem, then add the ending.'),
        table: table(
          [PRONOUN, l('Đuôi', 'Ending'), 'machen', 'wohnen'],
          [
            ['ich', '-e', 'mache', 'wohne'],
            ['du', '-st', 'machst', 'wohnst'],
            ['er / sie / es', '-t', 'macht', 'wohnt'],
            ['wir', '-en', 'machen', 'wohnen'],
            ['ihr', '-t', 'macht', 'wohnt'],
            ['sie / Sie', '-en', 'machen', 'wohnen'],
          ],
        ),
      },
      {
        title: l('Trường hợp đặc biệt', 'Special cases'),
        bullets: [
          l('Gốc tận cùng **-t / -d**: thêm **e** để dễ đọc: arbeiten → du arbeit**e**st, er arbeit**e**t; finden → du find**e**st.', 'Stems ending in **-t / -d** add an **e**: arbeiten → du arbeit**e**st, er arbeit**e**t.'),
          l('Gốc tận cùng **-s, -ß, -z**: ngôi du chỉ thêm **-t**: heißen → du heißt, tanzen → du tanzt.', 'Stems ending in **-s, -ß, -z** add only **-t** for du: heißen → du heißt.'),
        ],
      },
      {
        title: l('Động từ đổi nguyên âm (chỉ ở ngôi du và er/sie/es)', 'Vowel-changing verbs (du and er/sie/es only)'),
        table: table(
          [l('Nguyên mẫu', 'Infinitive'), 'du', 'er / sie / es', l('Kiểu đổi', 'Change')],
          [
            ['fahren', 'fährst', 'fährt', 'a → ä'],
            ['schlafen', 'schläfst', 'schläft', 'a → ä'],
            ['essen', 'isst', 'isst', 'e → i'],
            ['sprechen', 'sprichst', 'spricht', 'e → i'],
            ['geben', 'gibst', 'gibt', 'e → i'],
            ['nehmen', 'nimmst', 'nimmt', l('bất quy tắc', 'irregular')],
            ['lesen', 'liest', 'liest', 'e → ie'],
            ['sehen', 'siehst', 'sieht', 'e → ie'],
          ],
        ),
        examples: [
          ex('Ich **wohne** in Hanoi.', 'Tôi sống ở Hà Nội.', 'I live in Hanoi.'),
          ex('Was **machst** du?', 'Bạn đang làm gì?', 'What are you doing?'),
          ex('Er **arbeitet** bei Siemens.', 'Anh ấy làm việc ở Siemens.', 'He works at Siemens.'),
          ex('Sie **spricht** sehr gut Deutsch.', 'Cô ấy nói tiếng Đức rất giỏi.', 'She speaks German very well.'),
          ex('**Fährst** du morgen nach Berlin?', 'Mai bạn đi Berlin à?', 'Are you going to Berlin tomorrow?'),
        ],
      },
    ],
    tips: [
      l('Tiếng Đức không có thì tiếp diễn: "Ich lerne" vừa là "tôi học" vừa là "tôi đang học".', 'German has no continuous tense: "Ich lerne" means both "I learn" and "I am learning".'),
      l('Hiện tại cũng dùng cho tương lai gần: **Morgen fahre ich** nach Berlin.', 'The present also covers the near future: **Morgen fahre ich** nach Berlin.'),
    ],
  },
  {
    id: 'word-order',
    level: 'A1',
    title: l('Trật tự từ: động từ ở vị trí thứ hai', 'Word order: the verb comes second'),
    summary: l('Quy tắc V2, đảo ngữ, khung câu và thứ tự thời gian – cách thức – nơi chốn.', 'The V2 rule, inversion, the sentence bracket and time – manner – place.'),
    sections: [
      {
        title: l('Quy tắc V2', 'The V2 rule'),
        body: l(
          'Trong câu trần thuật, **động từ chia luôn ở vị trí thứ hai**. Vị trí đầu có thể là chủ ngữ, thời gian hoặc tân ngữ; nếu không phải chủ ngữ thì chủ ngữ đứng **ngay sau** động từ (đảo ngữ).',
          'In statements, **the conjugated verb is always second**. The first slot can be the subject, a time or an object; if it is not the subject, the subject comes **right after** the verb.',
        ),
        table: table(
          [l('Vị trí 1', 'Position 1'), l('Động từ (2)', 'Verb (2)'), l('Phần còn lại', 'Rest')],
          [
            ['Ich', 'lerne', 'heute Deutsch.'],
            ['Heute', 'lerne', 'ich Deutsch.'],
            ['Deutsch', 'lerne', 'ich heute.'],
          ],
        ),
      },
      {
        title: l('Khung câu', 'The sentence bracket'),
        body: l(
          'Khi có động từ khuyết thiếu hoặc trợ động từ, phần chia đứng ở vị trí 2, còn **động từ nguyên mẫu hoặc phân từ đứng cuối câu**.',
          'With a modal or auxiliary verb, it takes position 2 and **the infinitive or participle goes to the very end**.',
        ),
        examples: [
          ex('Ich **kann** heute nicht **kommen**.', 'Hôm nay tôi không đến được.', 'I can\'t come today.'),
          ex('Ich **habe** gestern Pizza **gegessen**.', 'Hôm qua tôi đã ăn pizza.', 'I ate pizza yesterday.'),
        ],
      },
      {
        title: l('Thời gian – Cách thức – Nơi chốn', 'Time – Manner – Place'),
        body: l('Các trạng ngữ thường xếp theo thứ tự **khi nào – vì sao – thế nào – ở đâu** (TeKaMoLo).', 'Adverbials usually follow **when – why – how – where** (TeKaMoLo).'),
        examples: [ex('Ich fahre **morgen mit dem Zug nach Berlin**.', 'Ngày mai tôi đi tàu đến Berlin.', 'Tomorrow I am taking the train to Berlin.')],
      },
    ],
    tips: [l('Sai: "Heute ich lerne Deutsch". Đúng: "Heute **lerne ich** Deutsch".', 'Wrong: "Heute ich lerne Deutsch". Right: "Heute **lerne ich** Deutsch".')],
  },
  {
    id: 'questions',
    level: 'A1',
    title: l('Câu hỏi W- và câu hỏi Ja/Nein', 'W-questions and yes/no questions'),
    summary: l('Từ để hỏi bắt đầu bằng W; câu hỏi có/không đưa động từ lên đầu.', 'Question words start with W; yes/no questions put the verb first.'),
    sections: [
      {
        title: l('Từ để hỏi', 'Question words'),
        table: table(
          [l('Từ', 'Word'), l('Nghĩa', 'Meaning'), l('Ví dụ', 'Example')],
          [
            ['wer', l('ai', 'who'), 'Wer ist das?'],
            ['was', l('cái gì', 'what'), 'Was machst du?'],
            ['wo', l('ở đâu', 'where'), 'Wo wohnst du?'],
            ['woher', l('từ đâu', 'where from'), 'Woher kommen Sie?'],
            ['wohin', l('đi đâu', 'where to'), 'Wohin fährst du?'],
            ['wann', l('khi nào', 'when'), 'Wann beginnt der Kurs?'],
            ['wie', l('như thế nào', 'how'), 'Wie geht es dir?'],
            ['warum', l('tại sao', 'why'), 'Warum lernst du Deutsch?'],
            ['wie viel / wie viele', l('bao nhiêu', 'how much / many'), 'Wie viel kostet das?'],
            ['welcher / welche / welches', l('cái nào', 'which'), 'Welche Farbe magst du?'],
          ],
        ),
        body: l('Trật tự: **từ để hỏi + động từ + chủ ngữ…**', 'Order: **question word + verb + subject…**'),
      },
      {
        title: l('Câu hỏi Ja/Nein', 'Yes/no questions'),
        body: l(
          '**Động từ đứng đầu câu**. Trả lời **ja** (có), **nein** (không), và **doch** (có chứ!) khi trả lời khẳng định cho câu hỏi phủ định.',
          '**The verb comes first**. Answer **ja**, **nein**, or **doch** to contradict a negative question.',
        ),
        examples: [
          ex('**Kommst** du heute? – Ja, gern.', 'Hôm nay bạn đến không? – Có, sẵn lòng.', 'Are you coming today? – Yes, gladly.'),
          ex('**Sprechen** Sie Englisch? – Nein, leider nicht.', 'Ông có nói tiếng Anh không? – Rất tiếc là không.', 'Do you speak English? – No, unfortunately not.'),
          ex('Hast du keinen Hunger? – **Doch**!', 'Bạn không đói à? – Có chứ!', 'Aren\'t you hungry? – Yes, I am!'),
        ],
      },
    ],
  },
  {
    id: 'gender-articles',
    level: 'A1',
    title: l('Giống của danh từ và mạo từ', 'Noun gender and articles'),
    summary: l('der (giống đực), die (giống cái), das (giống trung) và mẹo đoán giống.', 'der (masculine), die (feminine), das (neuter) and tips for guessing gender.'),
    sections: [
      {
        table: table(
          [l('Giống', 'Gender'), l('Xác định', 'Definite'), l('Không xác định', 'Indefinite'), l('Phủ định', 'Negative')],
          [
            [l('đực (m)', 'masculine'), 'der Tisch', 'ein Tisch', 'kein Tisch'],
            [l('cái (f)', 'feminine'), 'die Lampe', 'eine Lampe', 'keine Lampe'],
            [l('trung (n)', 'neuter'), 'das Buch', 'ein Buch', 'kein Buch'],
            [l('số nhiều', 'plural'), 'die Bücher', '—', 'keine Bücher'],
          ],
        ),
      },
      {
        title: l('Mẹo đoán giống theo đuôi từ', 'Guessing gender from the ending'),
        table: table(
          [l('Giống', 'Gender'), l('Đuôi / nhóm', 'Ending / group'), l('Ví dụ', 'Examples')],
          [
            ['die', l('-ung, -heit, -keit, -schaft, -ion, -tät, -ie, đa số -e', '-ung, -heit, -keit, -schaft, -ion, -tät, -ie, most -e'), 'die Zeitung, die Freiheit, die Information, die Blume'],
            ['der', l('-er (người, dụng cụ), -ling, -ismus, ngày, tháng, mùa', '-er (people, tools), -ling, -ismus, days, months, seasons'), 'der Lehrer, der Montag, der Winter'],
            ['das', l('-chen, -lein, -ment, -um, động từ danh hoá', '-chen, -lein, -ment, -um, verbs used as nouns'), 'das Mädchen, das Dokument, das Museum, das Essen'],
          ],
        ),
        body: l(
          'Từ ghép lấy giống của **từ cuối cùng**: das Haus + die Tür = **die** Haustür.',
          'Compound nouns take the gender of the **last** word: das Haus + die Tür = **die** Haustür.',
        ),
        examples: [
          ex('Das ist **ein** Tisch. **Der** Tisch ist groß.', 'Đây là một cái bàn. Cái bàn to.', 'This is a table. The table is big.'),
          ex('Das ist **eine** Lampe. **Die** Lampe ist neu.', 'Đây là một cái đèn. Cái đèn mới.', 'This is a lamp. The lamp is new.'),
          ex('Hier ist **ein** Buch. **Das** Buch ist interessant.', 'Đây là một quyển sách. Quyển sách thú vị.', 'Here is a book. The book is interesting.'),
        ],
      },
    ],
    tips: [
      l('**das** Mädchen (cô gái) là giống trung vì đuôi -chen, ngữ pháp thắng nghĩa.', '**das** Mädchen (girl) is neuter because of -chen: grammar beats meaning.'),
      l('Số nhiều luôn dùng **die**, bất kể giống.', 'The plural is always **die**, whatever the gender.'),
    ],
  },
  {
    id: 'plural',
    level: 'A1',
    title: l('Số nhiều của danh từ', 'Plural nouns'),
    summary: l('Năm kiểu số nhiều chính; hãy học số nhiều cùng với từ.', 'The five main plural patterns; learn each plural with the word.'),
    sections: [
      {
        table: table(
          [l('Kiểu', 'Pattern'), l('Ví dụ', 'Examples')],
          [
            ['-e / ¨-e', 'der Tag → die Tage, der Stuhl → die Stühle, die Hand → die Hände'],
            ['-er / ¨-er', 'das Kind → die Kinder, das Buch → die Bücher, das Haus → die Häuser'],
            ['-(e)n', 'die Frau → die Frauen, die Blume → die Blumen, die Lampe → die Lampen'],
            ['-s', 'das Auto → die Autos, das Handy → die Handys, das Hotel → die Hotels'],
            [l('không đổi / ¨', 'no change / ¨'), 'der Lehrer → die Lehrer, das Zimmer → die Zimmer, der Vater → die Väter'],
          ],
        ),
        bullets: [
          l('Đa số danh từ giống cái thêm **-(e)n**.', 'Most feminine nouns add **-(e)n**.'),
          l('Từ mượn và từ tận cùng bằng nguyên âm (trừ -e) thường thêm **-s**.', 'Loanwords and nouns ending in a vowel (not -e) usually add **-s**.'),
          l('Danh từ giống đực/trung tận cùng **-er, -el, -en** thường không đổi.', 'Masculine/neuter nouns ending in **-er, -el, -en** often stay the same.'),
          l('Ở cách 3 (Dativ) số nhiều thêm **-n**: mit den Kinder**n** (trừ khi đã có -n hoặc -s).', 'In the dative plural add **-n**: mit den Kinder**n** (unless it already ends in -n or -s).'),
        ],
        examples: [
          ex('Ich habe zwei **Brüder** und drei **Schwestern**.', 'Tôi có hai anh em trai và ba chị em gái.', 'I have two brothers and three sisters.'),
          ex('Die **Kinder** spielen im Garten.', 'Bọn trẻ chơi trong vườn.', 'The children are playing in the garden.'),
          ex('Wir haben zwei **Autos**.', 'Chúng tôi có hai chiếc ô tô.', 'We have two cars.'),
        ],
      },
    ],
  },
  {
    id: 'negation',
    level: 'A1',
    title: l('Phủ định: nicht và kein', 'Negation: nicht and kein'),
    summary: l('kein phủ định danh từ; nicht phủ định mọi thứ còn lại.', 'kein negates nouns; nicht negates everything else.'),
    sections: [
      {
        title: l('kein', 'kein'),
        body: l(
          'Dùng **kein** thay cho **ein** hoặc khi danh từ không có mạo từ. kein chia đuôi giống ein: kein, keine, keinen…',
          'Use **kein** instead of **ein**, or with nouns that have no article. It takes the same endings as ein: kein, keine, keinen…',
        ),
        examples: [
          ex('Ich habe **kein** Auto.', 'Tôi không có ô tô.', 'I don\'t have a car.'),
          ex('Das ist **keine** Katze, das ist ein Hund.', 'Đó không phải con mèo, đó là con chó.', 'That isn\'t a cat, it\'s a dog.'),
          ex('Ich habe heute **keine** Zeit.', 'Hôm nay tôi không có thời gian.', 'I have no time today.'),
        ],
      },
      {
        title: l('nicht', 'nicht'),
        body: l(
          'Dùng **nicht** cho động từ, tính từ, trạng từ, danh từ có mạo từ xác định hoặc tính từ sở hữu, và tên riêng. nicht thường đứng **cuối câu**, nhưng đứng **trước** tính từ, cụm giới từ và phần động từ ở cuối khung câu.',
          'Use **nicht** for verbs, adjectives, adverbs, nouns with a definite article or possessive, and names. It usually goes **at the end**, but **before** adjectives, prepositional phrases and the final part of the verb bracket.',
        ),
        examples: [
          ex('Ich schlafe **nicht**.', 'Tôi không ngủ.', 'I am not sleeping.'),
          ex('Das ist **nicht** teuer.', 'Cái đó không đắt.', 'That isn\'t expensive.'),
          ex('Ich komme **nicht** aus Berlin.', 'Tôi không đến từ Berlin.', 'I am not from Berlin.'),
          ex('Ich kenne den Mann **nicht**.', 'Tôi không quen người đàn ông đó.', 'I don\'t know the man.'),
          ex('Ich kann **nicht** schwimmen.', 'Tôi không biết bơi.', 'I can\'t swim.'),
        ],
      },
    ],
  },
  {
    id: 'accusative',
    level: 'A1',
    title: l('Cách 4: Akkusativ', 'The accusative case'),
    summary: l('Tân ngữ trực tiếp: chỉ mạo từ giống đực thay đổi (der → den, ein → einen).', 'Direct objects: only the masculine changes (der → den, ein → einen).'),
    sections: [
      {
        body: l(
          'Akkusativ dùng cho **tân ngữ trực tiếp**, trả lời câu hỏi **wen?** (ai) hoặc **was?** (cái gì). Tin vui: chỉ **giống đực** thay đổi.',
          'The accusative marks the **direct object**, answering **wen?** (whom) or **was?** (what). Good news: only the **masculine** changes.',
        ),
        table: table(
          ['', 'm', 'f', 'n', 'pl'],
          [
            ['Nominativ', 'der / ein / kein', 'die / eine / keine', 'das / ein / kein', 'die / – / keine'],
            ['Akkusativ', '**den / einen / keinen**', 'die / eine / keine', 'das / ein / kein', 'die / – / keine'],
          ],
        ),
      },
      {
        title: l('Động từ thường đi với Akkusativ', 'Common verbs with the accusative'),
        body: l('haben, brauchen, kaufen, sehen, essen, trinken, suchen, möchten, lieben, besuchen, kennen và cụm **es gibt** (có).', 'haben, brauchen, kaufen, sehen, essen, trinken, suchen, möchten, lieben, besuchen, kennen and **es gibt** (there is/are).'),
        examples: [
          ex('Ich habe **einen** Bruder.', 'Tôi có một người anh trai.', 'I have a brother.'),
          ex('Ich brauche **den** Schlüssel.', 'Tôi cần chìa khoá.', 'I need the key.'),
          ex('Siehst du **die** Katze?', 'Bạn có thấy con mèo không?', 'Can you see the cat?'),
          ex('Hier gibt es **keinen** Supermarkt.', 'Ở đây không có siêu thị.', 'There is no supermarket here.'),
          ex('Ich möchte **einen** Kaffee, bitte.', 'Cho tôi một cốc cà phê.', 'I\'d like a coffee, please.'),
        ],
      },
    ],
  },
  {
    id: 'dative',
    level: 'A1',
    title: l('Cách 3: Dativ', 'The dative case'),
    summary: l('Tân ngữ gián tiếp (cho ai, với ai) và các động từ luôn đi với Dativ.', 'Indirect objects (to/for whom) and verbs that always take the dative.'),
    sections: [
      {
        body: l(
          'Dativ đánh dấu **tân ngữ gián tiếp**, trả lời câu hỏi **wem?** (cho ai, với ai). Số nhiều thêm **-n** vào danh từ.',
          'The dative marks the **indirect object**, answering **wem?** (to/for whom). Plural nouns add **-n**.',
        ),
        table: table(
          ['', 'm', 'f', 'n', 'pl'],
          [
            ['Nominativ', 'der / ein', 'die / eine', 'das / ein', 'die / –'],
            ['Dativ', '**dem / einem**', '**der / einer**', '**dem / einem**', '**den** + -n'],
          ],
        ),
      },
      {
        title: l('Động từ đi với Dativ', 'Dative verbs'),
        bullets: [
          l('Chỉ cần Dativ: **helfen, danken, gefallen, gehören, antworten, schmecken, passen, gratulieren**.', 'Dative only: **helfen, danken, gefallen, gehören, antworten, schmecken, passen, gratulieren**.'),
          l('Dativ (người) + Akkusativ (vật): **geben, schenken, zeigen, erklären, schreiben, bringen**. Danh từ Dativ thường đứng trước danh từ Akkusativ.', 'Dative (person) + accusative (thing): **geben, schenken, zeigen, erklären, schreiben, bringen**. The dative noun usually comes first.'),
        ],
        examples: [
          ex('Ich gebe **dem** Mann das Buch.', 'Tôi đưa quyển sách cho người đàn ông.', 'I give the man the book.'),
          ex('Ich schenke **meiner** Mutter Blumen.', 'Tôi tặng mẹ hoa.', 'I give my mother flowers.'),
          ex('Kannst du **mir** helfen?', 'Bạn giúp tôi được không?', 'Can you help me?'),
          ex('Das Kleid gefällt **mir**.', 'Tôi thích cái váy đó.', 'I like the dress.'),
          ex('Wem gehört das Handy? – Es gehört **dem** Lehrer.', 'Điện thoại này của ai? – Của thầy giáo.', 'Whose phone is this? – It belongs to the teacher.'),
        ],
      },
    ],
    tips: [l('"Gefallen" đảo chủ ngữ so với tiếng Việt: vật được thích là chủ ngữ, người thích ở Dativ: Der Film gefällt **mir**.', 'With "gefallen" the thing liked is the subject and the person is dative: Der Film gefällt **mir**.')],
  },
  {
    id: 'pronoun-cases',
    level: 'A1',
    title: l('Đại từ ở cách 1, 3, 4', 'Pronouns in nominative, accusative and dative'),
    summary: l('mich / mir, dich / dir, ihn / ihm… Đại từ đổi dạng theo cách.', 'mich / mir, dich / dir, ihn / ihm… Pronouns change with the case.'),
    sections: [
      {
        table: table(
          ['Nominativ', 'Akkusativ', 'Dativ'],
          [
            ['ich', 'mich', 'mir'],
            ['du', 'dich', 'dir'],
            ['er', 'ihn', 'ihm'],
            ['sie', 'sie', 'ihr'],
            ['es', 'es', 'ihm'],
            ['wir', 'uns', 'uns'],
            ['ihr', 'euch', 'euch'],
            ['sie / Sie', 'sie / Sie', 'ihnen / Ihnen'],
          ],
        ),
        examples: [
          ex('Ich liebe **dich**.', 'Anh yêu em.', 'I love you.'),
          ex('Er ruft **mich** morgen an.', 'Ngày mai anh ấy gọi cho tôi.', 'He will call me tomorrow.'),
          ex('Wie geht es **Ihnen**?', 'Ông/bà có khoẻ không?', 'How are you? (formal)'),
          ex('Kannst du **ihm** helfen?', 'Bạn giúp anh ấy được không?', 'Can you help him?'),
          ex('Das gefällt **uns** sehr.', 'Chúng tôi rất thích điều đó.', 'We like that a lot.'),
        ],
      },
    ],
    tips: [l('Câu hỏi thăm sức khoẻ dùng Dativ: Wie geht es **dir**? – Mir geht es gut.', 'Asking how someone is uses the dative: Wie geht es **dir**? – Mir geht es gut.')],
  },
  {
    id: 'possessive-articles',
    level: 'A1',
    title: l('Mạo từ sở hữu: mein, dein, sein…', 'Possessive articles: mein, dein, sein…'),
    summary: l('Của tôi, của bạn… chia đuôi giống như ein/kein.', 'my, your… take the same endings as ein/kein.'),
    sections: [
      {
        table: table(
          [PRONOUN, l('Sở hữu', 'Possessive'), l('Nghĩa', 'Meaning')],
          [
            ['ich', 'mein', l('của tôi', 'my')],
            ['du', 'dein', l('của bạn', 'your')],
            ['er / es', 'sein', l('của anh ấy / của nó', 'his / its')],
            ['sie', 'ihr', l('của cô ấy', 'her')],
            ['wir', 'unser', l('của chúng tôi', 'our')],
            ['ihr', 'euer', l('của các bạn', 'your (plural)')],
            ['sie', 'ihr', l('của họ', 'their')],
            ['Sie', 'Ihr', l('của ông/bà (lịch sự)', 'your (formal)')],
          ],
        ),
      },
      {
        title: l('Đuôi', 'Endings'),
        table: table(
          ['', 'm', 'f', 'n', 'pl'],
          [
            ['Nominativ', 'mein Vater', 'meine Mutter', 'mein Kind', 'meine Eltern'],
            ['Akkusativ', 'meinen Vater', 'meine Mutter', 'mein Kind', 'meine Eltern'],
            ['Dativ', 'meinem Vater', 'meiner Mutter', 'meinem Kind', 'meinen Eltern'],
          ],
        ),
        examples: [
          ex('Das ist **mein** Bruder.', 'Đây là anh trai tôi.', 'This is my brother.'),
          ex('Wo ist **deine** Tasche?', 'Túi của bạn đâu?', 'Where is your bag?'),
          ex('Ich besuche **meinen** Opa.', 'Tôi đi thăm ông.', 'I am visiting my grandpa.'),
          ex('**Unsere** Wohnung ist klein.', 'Căn hộ của chúng tôi nhỏ.', 'Our flat is small.'),
          ex('Ist das **Ihr** Auto?', 'Đây có phải xe của ông/bà không?', 'Is this your car? (formal)'),
        ],
      },
    ],
    tips: [l('euer bỏ chữ e khi thêm đuôi: **eure** Mutter, **euren** Vater.', 'euer drops an e with endings: **eure** Mutter, **euren** Vater.')],
  },
  {
    id: 'modal-verbs',
    level: 'A1',
    title: l('Động từ khuyết thiếu', 'Modal verbs'),
    summary: l('können, müssen, wollen, dürfen, sollen, mögen/möchten + động từ nguyên mẫu ở cuối câu.', 'können, müssen, wollen, dürfen, sollen, mögen/möchten + an infinitive at the end.'),
    sections: [
      {
        table: table(
          [PRONOUN, 'können', 'müssen', 'wollen', 'dürfen', 'sollen', 'möchten'],
          [
            ['ich', 'kann', 'muss', 'will', 'darf', 'soll', 'möchte'],
            ['du', 'kannst', 'musst', 'willst', 'darfst', 'sollst', 'möchtest'],
            ['er / sie / es', 'kann', 'muss', 'will', 'darf', 'soll', 'möchte'],
            ['wir', 'können', 'müssen', 'wollen', 'dürfen', 'sollen', 'möchten'],
            ['ihr', 'könnt', 'müsst', 'wollt', 'dürft', 'sollt', 'möchtet'],
            ['sie / Sie', 'können', 'müssen', 'wollen', 'dürfen', 'sollen', 'möchten'],
          ],
        ),
      },
      {
        title: l('Nghĩa', 'Meanings'),
        table: table(
          [l('Động từ', 'Verb'), l('Nghĩa', 'Meaning')],
          [
            ['können', l('có thể, biết (làm gì)', 'can, be able to')],
            ['müssen', l('phải', 'must, have to')],
            ['wollen', l('muốn, định', 'want to')],
            ['dürfen', l('được phép', 'may, be allowed to')],
            ['sollen', l('nên, được yêu cầu', 'should, be supposed to')],
            ['mögen', l('thích (+ danh từ)', 'like (+ noun)')],
            ['möchten', l('muốn (lịch sự)', 'would like')],
          ],
        ),
        body: l('Động từ khuyết thiếu ở **vị trí 2**, động từ chính **nguyên mẫu ở cuối câu**.', 'The modal goes in **position 2**, the main verb as an **infinitive at the end**.'),
        examples: [
          ex('Ich **kann** gut **schwimmen**.', 'Tôi bơi giỏi.', 'I can swim well.'),
          ex('Du **musst** jetzt **gehen**.', 'Bây giờ bạn phải đi rồi.', 'You have to go now.'),
          ex('Hier **darf** man nicht **rauchen**.', 'Ở đây không được hút thuốc.', 'Smoking is not allowed here.'),
          ex('Wir **wollen** nach Japan **reisen**.', 'Chúng tôi muốn đi du lịch Nhật Bản.', 'We want to travel to Japan.'),
          ex('Ich **möchte** ein Glas Wasser.', 'Tôi muốn một cốc nước.', 'I\'d like a glass of water.'),
          ex('**Soll** ich das Fenster **öffnen**?', 'Tôi có nên mở cửa sổ không?', 'Shall I open the window?'),
        ],
      },
    ],
    tips: [
      l('ich và er/sie/es có **cùng dạng** và không có đuôi: ich kann, er kann.', 'ich and er/sie/es share **the same form** with no ending: ich kann, er kann.'),
      l('**nicht müssen** = không cần; "không được" phải dùng **nicht dürfen**.', '**nicht müssen** means "don\'t have to"; "must not" is **nicht dürfen**.'),
    ],
  },
  {
    id: 'separable-verbs',
    level: 'A1',
    title: l('Động từ tách được', 'Separable verbs'),
    summary: l('aufstehen → Ich stehe auf: tiền tố tách ra và đứng cuối câu.', 'aufstehen → Ich stehe auf: the prefix splits off and goes to the end.'),
    sections: [
      {
        body: l(
          'Các tiền tố **an, auf, aus, ein, mit, zu, zurück, vor, fern, los…** tách khỏi động từ khi chia và **đứng cuối câu**. Tiền tố tách được luôn nhận trọng âm: ˈanrufen.',
          'Prefixes like **an, auf, aus, ein, mit, zu, zurück, vor, fern, los…** split off when conjugated and **go to the end**. They are always stressed: ˈanrufen.',
        ),
        table: table(
          [l('Nguyên mẫu', 'Infinitive'), l('Câu', 'Sentence'), l('Nghĩa', 'Meaning')],
          [
            ['aufstehen', 'Ich stehe um 7 Uhr auf.', l('thức dậy', 'get up')],
            ['einkaufen', 'Wir kaufen am Samstag ein.', l('đi mua sắm', 'go shopping')],
            ['anrufen', 'Ich rufe dich morgen an.', l('gọi điện', 'call')],
            ['fernsehen', 'Er sieht jeden Abend fern.', l('xem TV', 'watch TV')],
            ['mitkommen', 'Kommst du mit?', l('đi cùng', 'come along')],
            ['zumachen', 'Mach bitte die Tür zu!', l('đóng lại', 'close')],
          ],
        ),
      },
      {
        title: l('Khi nào không tách?', 'When do they stay together?'),
        bullets: [
          l('Sau động từ khuyết thiếu: Ich muss früh **aufstehen**.', 'After a modal: Ich muss früh **aufstehen**.'),
          l('Trong mệnh đề phụ: …, weil ich früh **aufstehe**.', 'In subordinate clauses: …, weil ich früh **aufstehe**.'),
          l('Phân từ II: ge chen vào giữa: auf**ge**standen, ein**ge**kauft.', 'In the participle, ge goes in the middle: auf**ge**standen, ein**ge**kauft.'),
        ],
      },
      {
        title: l('Tiền tố không tách được', 'Inseparable prefixes'),
        body: l(
          '**be-, ge-, er-, ver-, zer-, ent-, emp-, miss-** không bao giờ tách và không nhận trọng âm: besuchen, verstehen, bekommen, erklären.',
          '**be-, ge-, er-, ver-, zer-, ent-, emp-, miss-** never split and are never stressed: besuchen, verstehen, bekommen, erklären.',
        ),
        examples: [ex('Ich **verstehe** dich nicht.', 'Tôi không hiểu bạn.', 'I don\'t understand you.'), ex('Wir **bekommen** morgen Besuch.', 'Ngày mai nhà chúng tôi có khách.', 'We are getting visitors tomorrow.')],
      },
    ],
    tips: [l('**bekommen** nghĩa là "nhận được", không phải "become" trong tiếng Anh.', '**bekommen** means "to receive", not "to become".')],
  },
  {
    id: 'imperative',
    level: 'A1',
    title: l('Câu mệnh lệnh', 'The imperative'),
    summary: l('Ra lệnh, đề nghị với du, ihr và Sie.', 'Commands and requests for du, ihr and Sie.'),
    sections: [
      {
        table: table(
          [l('Nguyên mẫu', 'Infinitive'), 'du', 'ihr', 'Sie'],
          [
            ['kommen', 'Komm!', 'Kommt!', 'Kommen Sie!'],
            ['machen', 'Mach!', 'Macht!', 'Machen Sie!'],
            ['arbeiten', 'Arbeite!', 'Arbeitet!', 'Arbeiten Sie!'],
            ['nehmen', 'Nimm!', 'Nehmt!', 'Nehmen Sie!'],
            ['lesen', 'Lies!', 'Lest!', 'Lesen Sie!'],
            ['fahren', 'Fahr!', 'Fahrt!', 'Fahren Sie!'],
            ['sein', 'Sei!', 'Seid!', 'Seien Sie!'],
          ],
        ),
        bullets: [
          l('**du**: bỏ đuôi -st và đại từ: du kommst → Komm! Đổi e → i/ie vẫn giữ (Nimm!), nhưng a → ä thì không (Fahr!).', '**du**: drop -st and the pronoun: du kommst → Komm! e → i/ie stays (Nimm!), a → ä does not (Fahr!).'),
          l('**ihr**: giống dạng chia, bỏ đại từ: ihr kommt → Kommt!', '**ihr**: same as the verb form, without the pronoun: ihr kommt → Kommt!'),
          l('**Sie**: động từ đứng đầu, giữ Sie: Kommen Sie!', '**Sie**: verb first, keep Sie: Kommen Sie!'),
          l('Thêm **bitte, doch, mal** cho mềm hơn: Komm doch mal her!', 'Add **bitte, doch, mal** to soften: Komm doch mal her!'),
        ],
        examples: [
          ex('**Setzen Sie sich** bitte!', 'Mời ông/bà ngồi!', 'Please sit down! (formal)'),
          ex('**Sei** nicht traurig!', 'Đừng buồn nhé!', 'Don\'t be sad!'),
          ex('**Macht** bitte eure Bücher auf!', 'Các em mở sách ra nào!', 'Open your books, please! (to a group)'),
        ],
      },
    ],
  },
  {
    id: 'numbers-time',
    level: 'A1',
    title: l('Số đếm và giờ giấc', 'Numbers and telling the time'),
    summary: l('Số từ 0 đến 1000, cách đọc số "ngược" và nói giờ.', 'Numbers 0–1000, the "back-to-front" tens and telling the time.'),
    sections: [
      {
        title: l('Số đếm', 'Numbers'),
        table: table(
          [l('Số', 'Number'), l('Tiếng Đức', 'German'), l('Số', 'Number'), l('Tiếng Đức', 'German')],
          [
            ['0', 'null', '11', 'elf'],
            ['1', 'eins', '12', 'zwölf'],
            ['2', 'zwei', '13', 'dreizehn'],
            ['3', 'drei', '16', 'sechzehn'],
            ['4', 'vier', '17', 'siebzehn'],
            ['5', 'fünf', '20', 'zwanzig'],
            ['6', 'sechs', '30', 'dreißig'],
            ['7', 'sieben', '40 / 50', 'vierzig / fünfzig'],
            ['8', 'acht', '60 / 70', 'sechzig / siebzig'],
            ['9', 'neun', '80 / 90', 'achtzig / neunzig'],
            ['10', 'zehn', '100 / 1000', '(ein)hundert / (ein)tausend'],
          ],
        ),
        body: l(
          'Từ 21 đến 99 đọc **hàng đơn vị trước, rồi "und", rồi hàng chục**: 21 = **ein**und**zwanzig**, 45 = **fünf**und**vierzig**.',
          'From 21 to 99, say **the unit first, then "und", then the ten**: 21 = **ein**und**zwanzig**, 45 = **fünf**und**vierzig**.',
        ),
      },
      {
        title: l('Nói giờ', 'Telling the time'),
        table: table(
          [l('Giờ', 'Time'), l('Thân mật', 'Everyday'), l('Chính thức', 'Official')],
          [
            ['8:00', 'acht (Uhr)', 'acht Uhr'],
            ['8:10', 'zehn nach acht', 'acht Uhr zehn'],
            ['8:15', 'Viertel nach acht', 'acht Uhr fünfzehn'],
            ['8:30', '**halb neun**', 'acht Uhr dreißig'],
            ['8:45', 'Viertel vor neun', 'acht Uhr fünfundvierzig'],
            ['20:50', 'zehn vor neun', 'zwanzig Uhr fünfzig'],
          ],
        ),
        examples: [
          ex('Wie spät ist es? – Es ist halb drei.', 'Mấy giờ rồi? – Hai rưỡi.', 'What time is it? – Half past two.'),
          ex('Ich bin dreiundzwanzig Jahre alt.', 'Tôi 23 tuổi.', 'I am twenty-three years old.'),
          ex('Der Zug fährt um 14:20 Uhr ab.', 'Tàu khởi hành lúc 14 giờ 20.', 'The train leaves at 14:20.'),
        ],
      },
    ],
    tips: [
      l('**halb drei** là **2 giờ 30** (nửa giờ trước 3 giờ), không phải 3 giờ 30!', '**halb drei** is **2:30** (half way to three), not 3:30!'),
      l('Hỏi "lúc mấy giờ" dùng **um**: Um wie viel Uhr? – **Um** 8 Uhr.', 'Use **um** for "at": Um wie viel Uhr? – **Um** 8 Uhr.'),
    ],
  },
  {
    id: 'prepositions-accusative',
    level: 'A1',
    title: l('Giới từ đi với Akkusativ', 'Prepositions with the accusative'),
    summary: l('durch, für, gegen, ohne, um luôn đi với cách 4.', 'durch, für, gegen, ohne, um always take the accusative.'),
    sections: [
      {
        table: table(
          [l('Giới từ', 'Preposition'), l('Nghĩa', 'Meaning'), l('Ví dụ', 'Example')],
          [
            ['durch', l('xuyên qua, qua', 'through'), 'durch den Park'],
            ['für', l('cho, dành cho', 'for'), 'für meinen Vater'],
            ['gegen', l('chống lại, va vào; khoảng (giờ)', 'against; around (time)'), 'gegen den Baum, gegen 8 Uhr'],
            ['ohne', l('không có', 'without'), 'ohne Zucker'],
            ['um', l('quanh; lúc (giờ)', 'around; at (time)'), 'um den Tisch, um 9 Uhr'],
            ['bis', l('đến, cho đến', 'until, as far as'), 'bis Montag'],
          ],
        ),
        examples: [
          ex('Das Geschenk ist **für dich**.', 'Món quà này dành cho bạn.', 'The present is for you.'),
          ex('Wir gehen **durch den** Park.', 'Chúng tôi đi xuyên qua công viên.', 'We walk through the park.'),
          ex('Ich trinke Kaffee **ohne** Milch.', 'Tôi uống cà phê không sữa.', 'I drink coffee without milk.'),
          ex('Der Film beginnt **um** acht Uhr.', 'Phim bắt đầu lúc tám giờ.', 'The film starts at eight.'),
        ],
      },
    ],
    tips: [l('Mẹo nhớ: **DOGFU** = durch, ohne, gegen, für, um.', 'Memory trick: **DOGFU** = durch, ohne, gegen, für, um.')],
  },
  {
    id: 'prepositions-dative',
    level: 'A1',
    title: l('Giới từ đi với Dativ', 'Prepositions with the dative'),
    summary: l('aus, bei, mit, nach, seit, von, zu luôn đi với cách 3.', 'aus, bei, mit, nach, seit, von, zu always take the dative.'),
    sections: [
      {
        table: table(
          [l('Giới từ', 'Preposition'), l('Nghĩa', 'Meaning'), l('Ví dụ', 'Example')],
          [
            ['aus', l('từ (xuất xứ), ra khỏi', 'from (origin), out of'), 'aus Vietnam'],
            ['bei', l('ở chỗ ai, ở (công ty), gần', 'at someone\'s place, at (a company), near'), 'bei meinen Eltern'],
            ['mit', l('với, bằng (phương tiện)', 'with, by (transport)'), 'mit dem Bus'],
            ['nach', l('sau; đến (thành phố, nước)', 'after; to (cities, countries)'), 'nach dem Essen, nach Berlin'],
            ['seit', l('từ … đến nay', 'since, for'), 'seit drei Jahren'],
            ['von', l('từ, của', 'from, of'), 'von meiner Freundin'],
            ['zu', l('đến (người, nơi có mạo từ)', 'to (people, places with an article)'), 'zum Arzt, zur Schule'],
            ['gegenüber', l('đối diện', 'opposite'), 'gegenüber dem Bahnhof'],
          ],
        ),
        body: l(
          'Viết tắt thường gặp: **zum** = zu dem, **zur** = zu der, **beim** = bei dem, **vom** = von dem.',
          'Common contractions: **zum** = zu dem, **zur** = zu der, **beim** = bei dem, **vom** = von dem.',
        ),
        examples: [
          ex('Ich komme **aus** Vietnam.', 'Tôi đến từ Việt Nam.', 'I am from Vietnam.'),
          ex('Wir fahren **mit dem** Bus.', 'Chúng tôi đi bằng xe buýt.', 'We are going by bus.'),
          ex('Ich lerne **seit** drei Monaten Deutsch.', 'Tôi học tiếng Đức được ba tháng rồi.', 'I have been learning German for three months.'),
          ex('Ich gehe **zum** Arzt.', 'Tôi đi khám bác sĩ.', 'I am going to the doctor.'),
          ex('**Nach dem** Essen gehen wir spazieren.', 'Sau bữa ăn chúng tôi đi dạo.', 'After the meal we go for a walk.'),
        ],
      },
    ],
    tips: [
      l('**nach Hause** = về nhà (chuyển động); **zu Hause** = ở nhà (vị trí).', '**nach Hause** = (going) home; **zu Hause** = at home.'),
      l('**seit** đi với thì **hiện tại**: Ich wohne **seit** 2020 hier.', '**seit** takes the **present tense**: Ich wohne **seit** 2020 hier.'),
    ],
  },
  {
    id: 'two-way-prepositions',
    level: 'A2',
    title: l('Giới từ hai cách (Wechselpräpositionen)', 'Two-way prepositions'),
    summary: l('Wo? (ở đâu) → Dativ; Wohin? (đi đâu) → Akkusativ.', 'Wo? (where) → dative; Wohin? (where to) → accusative.'),
    sections: [
      {
        body: l(
          '9 giới từ **an, auf, hinter, in, neben, über, unter, vor, zwischen** đi với **Dativ** khi chỉ **vị trí** (trả lời Wo?) và **Akkusativ** khi chỉ **hướng chuyển động** (trả lời Wohin?).',
          'The 9 prepositions **an, auf, hinter, in, neben, über, unter, vor, zwischen** take the **dative** for **location** (Wo?) and the **accusative** for **direction** (Wohin?).',
        ),
        table: table(
          [l('Giới từ', 'Preposition'), l('Nghĩa', 'Meaning'), l('Wo? + Dativ', 'Wo? + dative'), l('Wohin? + Akkusativ', 'Wohin? + accusative')],
          [
            ['in', l('trong', 'in'), 'im Kino', 'ins Kino'],
            ['auf', l('trên (mặt phẳng ngang)', 'on (horizontal)'), 'auf dem Tisch', 'auf den Tisch'],
            ['an', l('bên cạnh, sát (mặt phẳng đứng)', 'at, on (vertical)'), 'an der Wand', 'an die Wand'],
            ['unter', l('dưới', 'under'), 'unter dem Bett', 'unter das Bett'],
            ['neben', l('bên cạnh', 'next to'), 'neben dem Sofa', 'neben das Sofa'],
          ],
        ),
      },
      {
        title: l('Cặp động từ vị trí / chuyển động', 'Position / movement verb pairs'),
        table: table(
          [l('Vị trí (Dativ)', 'Position (dative)'), l('Đặt vào (Akkusativ)', 'Placing (accusative)')],
          [
            [l('liegen (đang nằm)', 'liegen (to lie)'), l('legen (đặt nằm xuống)', 'legen (to lay)')],
            [l('stehen (đang đứng)', 'stehen (to stand)'), l('stellen (đặt đứng)', 'stellen (to put upright)')],
            [l('sitzen (đang ngồi)', 'sitzen (to sit)'), l('sich setzen (ngồi xuống)', 'sich setzen (to sit down)')],
            [l('hängen (đang treo)', 'hängen (to hang, be hanging)'), l('hängen (treo lên)', 'hängen (to hang something up)')],
          ],
        ),
        examples: [
          ex('Das Buch liegt **auf dem** Tisch.', 'Quyển sách nằm trên bàn.', 'The book is lying on the table.'),
          ex('Ich lege das Buch **auf den** Tisch.', 'Tôi đặt quyển sách lên bàn.', 'I put the book on the table.'),
          ex('Wir sind **im** Kino.', 'Chúng tôi đang ở rạp chiếu phim.', 'We are at the cinema.'),
          ex('Wir gehen **ins** Kino.', 'Chúng tôi đi xem phim.', 'We are going to the cinema.'),
          ex('Er hängt das Bild **an die** Wand.', 'Anh ấy treo bức tranh lên tường.', 'He hangs the picture on the wall.'),
        ],
      },
    ],
    tips: [l('Viết tắt: **im** = in dem, **ins** = in das, **am** = an dem, **ans** = an das.', 'Contractions: **im** = in dem, **ins** = in das, **am** = an dem, **ans** = an das.')],
  },
  {
    id: 'perfekt',
    level: 'A2',
    title: l('Thì quá khứ hoàn thành Perfekt', 'The perfect tense (Perfekt)'),
    summary: l('Thì quá khứ dùng nhiều nhất khi nói: haben/sein + Partizip II.', 'The main spoken past tense: haben/sein + past participle.'),
    sections: [
      {
        title: STRUCTURE,
        body: l('**haben / sein** (vị trí 2) **+ Partizip II** (cuối câu).', '**haben / sein** (position 2) **+ past participle** (end of the sentence).'),
        table: table(
          [l('Loại động từ', 'Verb type'), l('Quy tắc', 'Rule'), l('Ví dụ', 'Examples')],
          [
            [l('Có quy tắc', 'Regular'), 'ge- … -t', 'machen → gemacht, kaufen → gekauft, arbeiten → gearbeitet'],
            [l('Bất quy tắc', 'Irregular'), 'ge- … -en', 'sehen → gesehen, essen → gegessen, trinken → getrunken, schreiben → geschrieben'],
            [l('Tách được', 'Separable'), l('tiền tố + ge + …', 'prefix + ge + …'), 'aufstehen → aufgestanden, einkaufen → eingekauft, anrufen → angerufen'],
            [l('Không tách được, -ieren', 'Inseparable, -ieren'), l('không có ge-', 'no ge-'), 'besuchen → besucht, verstehen → verstanden, studieren → studiert'],
          ],
        ),
      },
      {
        title: l('haben hay sein?', 'haben or sein?'),
        body: l(
          'Đa số động từ dùng **haben**. Dùng **sein** với động từ **chuyển động từ A đến B** (gehen, fahren, fliegen, kommen), **thay đổi trạng thái** (aufstehen, einschlafen, werden, sterben), và **sein, bleiben, passieren**.',
          'Most verbs use **haben**. Use **sein** for **movement from A to B** (gehen, fahren, fliegen, kommen), **change of state** (aufstehen, einschlafen, werden, sterben), and **sein, bleiben, passieren**.',
        ),
        examples: [
          ex('Ich **habe** gestern einen Film **gesehen**.', 'Hôm qua tôi đã xem một bộ phim.', 'I watched a film yesterday.'),
          ex('Wir **sind** nach Berlin **gefahren**.', 'Chúng tôi đã đi Berlin.', 'We went to Berlin.'),
          ex('**Hast** du schon **gegessen**?', 'Bạn ăn chưa?', 'Have you eaten yet?'),
          ex('Er **ist** um 7 Uhr **aufgestanden**.', 'Anh ấy đã dậy lúc 7 giờ.', 'He got up at 7.'),
          ex('Was **ist passiert**?', 'Chuyện gì đã xảy ra?', 'What happened?'),
          ex('Sie **hat** Medizin **studiert**.', 'Cô ấy đã học ngành y.', 'She studied medicine.'),
        ],
      },
    ],
    tips: [l('Khi nói, người Đức dùng Perfekt cho gần như mọi việc trong quá khứ.', 'In speech, Germans use the Perfekt for almost every past event.')],
  },
  {
    id: 'praeteritum',
    level: 'A2',
    title: l('Präteritum của sein, haben và động từ khuyết thiếu', 'Präteritum of sein, haben and modals'),
    summary: l('war, hatte, konnte, musste… dạng quá khứ ngắn gọn dùng cả khi nói.', 'war, hatte, konnte, musste… the short past forms used even in speech.'),
    sections: [
      {
        table: table(
          [PRONOUN, 'sein', 'haben', 'können', 'müssen', 'wollen'],
          [
            ['ich', 'war', 'hatte', 'konnte', 'musste', 'wollte'],
            ['du', 'warst', 'hattest', 'konntest', 'musstest', 'wolltest'],
            ['er / sie / es', 'war', 'hatte', 'konnte', 'musste', 'wollte'],
            ['wir', 'waren', 'hatten', 'konnten', 'mussten', 'wollten'],
            ['ihr', 'wart', 'hattet', 'konntet', 'musstet', 'wolltet'],
            ['sie / Sie', 'waren', 'hatten', 'konnten', 'mussten', 'wollten'],
          ],
        ),
        body: l(
          'Với **sein, haben** và **động từ khuyết thiếu**, người Đức dùng Präteritum cả khi nói ("Ich war krank" tự nhiên hơn "Ich bin krank gewesen"). Tương tự: dürfen → durfte, sollen → sollte, mögen → mochte, es gibt → **es gab**. Văn viết kể chuyện dùng Präteritum cho mọi động từ (ging, kam, sah).',
          'For **sein, haben** and the **modals**, Germans use the Präteritum even in speech ("Ich war krank" sounds more natural than "Ich bin krank gewesen"). Also: dürfen → durfte, sollen → sollte, mögen → mochte, es gibt → **es gab**. Written narratives use it for every verb (ging, kam, sah).',
        ),
        examples: [
          ex('Gestern **war** ich sehr müde.', 'Hôm qua tôi rất mệt.', 'I was very tired yesterday.'),
          ex('Wir **hatten** keine Zeit.', 'Chúng tôi đã không có thời gian.', 'We had no time.'),
          ex('Als Kind **konnte** ich nicht schwimmen.', 'Hồi nhỏ tôi không biết bơi.', 'As a child I couldn\'t swim.'),
          ex('Ich **musste** lange warten.', 'Tôi đã phải đợi rất lâu.', 'I had to wait a long time.'),
          ex('Früher **gab es** hier ein Kino.', 'Trước đây ở đây có một rạp chiếu phim.', 'There used to be a cinema here.'),
        ],
      },
    ],
  },
  {
    id: 'adjective-endings',
    level: 'A2',
    title: l('Đuôi tính từ', 'Adjective endings'),
    summary: l('Tính từ đứng trước danh từ đổi đuôi theo mạo từ, giống và cách.', 'Adjectives before a noun change their ending with the article, gender and case.'),
    sections: [
      {
        body: l(
          'Tính từ đứng **sau** động từ (Das Auto ist **neu**) không đổi. Tính từ đứng **trước** danh từ phải thêm đuôi. Nguyên tắc: nếu mạo từ đã thể hiện rõ giống và cách (der, den, dem…) thì tính từ chỉ thêm **-e / -en**; nếu chưa (ein, không mạo từ) thì tính từ "gánh" phần đó (-er, -es…).',
          'Adjectives **after** a verb (Das Auto ist **neu**) take no ending. Adjectives **before** a noun do. Rule of thumb: if the article already shows gender and case (der, den, dem…), the adjective just takes **-e / -en**; if not (ein, no article), the adjective shows it (-er, -es…).',
        ),
      },
      {
        title: l('Sau mạo từ xác định (der, die, das)', 'After the definite article'),
        table: table(
          ['', 'm', 'f', 'n', 'pl'],
          [
            ['Nom.', 'der gute Mann', 'die gute Frau', 'das gute Kind', 'die guten Kinder'],
            ['Akk.', 'den guten Mann', 'die gute Frau', 'das gute Kind', 'die guten Kinder'],
            ['Dat.', 'dem guten Mann', 'der guten Frau', 'dem guten Kind', 'den guten Kindern'],
          ],
        ),
      },
      {
        title: l('Sau mạo từ không xác định (ein, kein, mein)', 'After the indefinite article (ein, kein, mein)'),
        table: table(
          ['', 'm', 'f', 'n', 'pl'],
          [
            ['Nom.', 'ein guter Mann', 'eine gute Frau', 'ein gutes Kind', 'keine guten Kinder'],
            ['Akk.', 'einen guten Mann', 'eine gute Frau', 'ein gutes Kind', 'keine guten Kinder'],
            ['Dat.', 'einem guten Mann', 'einer guten Frau', 'einem guten Kind', 'keinen guten Kindern'],
          ],
        ),
      },
      {
        title: l('Không có mạo từ', 'With no article'),
        table: table(
          ['', 'm', 'f', 'n', 'pl'],
          [
            ['Nom.', 'guter Wein', 'gute Milch', 'gutes Brot', 'gute Äpfel'],
            ['Akk.', 'guten Wein', 'gute Milch', 'gutes Brot', 'gute Äpfel'],
            ['Dat.', 'gutem Wein', 'guter Milch', 'gutem Brot', 'guten Äpfeln'],
          ],
        ),
        examples: [
          ex('Das ist ein **neues** Auto.', 'Đây là một chiếc ô tô mới.', 'This is a new car.'),
          ex('Ich kaufe den **roten** Pullover.', 'Tôi mua chiếc áo len màu đỏ.', 'I am buying the red jumper.'),
          ex('Sie wohnt in einer **kleinen** Wohnung.', 'Cô ấy sống trong một căn hộ nhỏ.', 'She lives in a small flat.'),
          ex('Ich trinke gern **kalten** Tee.', 'Tôi thích uống trà lạnh.', 'I like drinking cold tea.'),
        ],
      },
    ],
  },
  {
    id: 'comparison',
    level: 'A2',
    title: l('So sánh hơn và so sánh nhất', 'Comparatives and superlatives'),
    summary: l('-er + als, am -sten, so … wie và các dạng bất quy tắc.', '-er + als, am -sten, so … wie and the irregular forms.'),
    sections: [
      {
        table: table(
          [l('Nguyên dạng', 'Base'), l('So sánh hơn', 'Comparative'), l('So sánh nhất', 'Superlative')],
          [
            ['schnell', 'schneller', 'am schnellsten'],
            ['billig', 'billiger', 'am billigsten'],
            ['alt', 'älter', 'am ältesten'],
            ['jung', 'jünger', 'am jüngsten'],
            ['groß', 'größer', 'am größten'],
            ['gut', 'besser', 'am besten'],
            ['viel', 'mehr', 'am meisten'],
            ['gern', 'lieber', 'am liebsten'],
            ['hoch', 'höher', 'am höchsten'],
          ],
        ),
        bullets: [
          l('So sánh hơn + **als**: Berlin ist größer **als** München.', 'Comparative + **als**: Berlin ist größer **als** München.'),
          l('So sánh bằng **so … wie**: Er ist **so** groß **wie** ich.', 'Equality **so … wie**: Er ist **so** groß **wie** ich.'),
          l('Nhiều tính từ một âm tiết có a, o, u thêm Umlaut: alt → älter, groß → größer.', 'Many one-syllable adjectives with a, o, u add an umlaut: alt → älter, groß → größer.'),
        ],
        examples: [
          ex('Berlin ist **größer als** München.', 'Berlin lớn hơn München.', 'Berlin is bigger than Munich.'),
          ex('Mein Bruder ist **so groß wie** ich.', 'Anh trai tôi cao bằng tôi.', 'My brother is as tall as me.'),
          ex('Ich trinke **lieber** Tee **als** Kaffee.', 'Tôi thích uống trà hơn cà phê.', 'I prefer tea to coffee.'),
          ex('**Am liebsten** esse ich Pho.', 'Tôi thích ăn phở nhất.', 'Pho is my favourite food.'),
          ex('Die Zugspitze ist der **höchste** Berg Deutschlands.', 'Zugspitze là ngọn núi cao nhất nước Đức.', 'The Zugspitze is Germany\'s highest mountain.'),
        ],
      },
    ],
  },
  {
    id: 'subordinate-clauses',
    level: 'A2',
    title: l('Mệnh đề phụ: weil, dass, wenn, ob…', 'Subordinate clauses: weil, dass, wenn, ob…'),
    summary: l('Trong mệnh đề phụ, động từ chia chạy xuống cuối câu.', 'In subordinate clauses the conjugated verb moves to the end.'),
    sections: [
      {
        table: table(
          [l('Liên từ', 'Conjunction'), l('Nghĩa', 'Meaning'), l('Ví dụ', 'Example')],
          [
            ['weil', l('vì', 'because'), '…, weil ich müde bin.'],
            ['dass', l('rằng', 'that'), '…, dass er kommt.'],
            ['wenn', l('khi (lặp lại), nếu', 'when (repeated), if'), 'Wenn es regnet, …'],
            ['ob', l('liệu … có … không', 'whether'), '…, ob sie Zeit hat.'],
            ['als', l('khi (một lần trong quá khứ)', 'when (once in the past)'), 'Als ich Kind war, …'],
            ['obwohl', l('mặc dù', 'although'), '…, obwohl es kalt ist.'],
          ],
        ),
        bullets: [
          l('Động từ chia đứng **cuối** mệnh đề phụ; luôn có **dấu phẩy**.', 'The conjugated verb goes **last**; there is always a **comma**.'),
          l('Động từ tách được nhập lại: …, weil ich früh **aufstehe**.', 'Separable verbs rejoin: …, weil ich früh **aufstehe**.'),
          l('Mệnh đề phụ đứng đầu thì câu chính bắt đầu bằng **động từ**: Wenn es regnet, **bleibe** ich zu Hause.', 'If the subordinate clause comes first, the main clause starts with the **verb**: Wenn es regnet, **bleibe** ich zu Hause.'),
          l('**denn** (vì) không đổi trật tự từ: …, denn ich bin müde.', '**denn** (because) keeps normal order: …, denn ich bin müde.'),
        ],
        examples: [
          ex('Ich lerne Deutsch, weil ich in Deutschland **studieren möchte**.', 'Tôi học tiếng Đức vì tôi muốn du học ở Đức.', 'I am learning German because I want to study in Germany.'),
          ex('Ich glaube, dass er recht **hat**.', 'Tôi nghĩ rằng anh ấy đúng.', 'I think he is right.'),
          ex('Wenn es regnet, **bleibe** ich zu Hause.', 'Nếu trời mưa, tôi ở nhà.', 'If it rains, I stay at home.'),
          ex('Weißt du, ob sie heute **kommt**?', 'Bạn có biết hôm nay cô ấy có đến không?', 'Do you know whether she is coming today?'),
          ex('Als ich Kind **war**, wohnte ich auf dem Land.', 'Hồi nhỏ tôi sống ở nông thôn.', 'When I was a child, I lived in the countryside.'),
        ],
      },
    ],
  },
  {
    id: 'reflexive-verbs',
    level: 'A2',
    title: l('Động từ phản thân', 'Reflexive verbs'),
    summary: l('sich freuen, sich treffen… dùng đại từ phản thân mich, dich, sich…', 'sich freuen, sich treffen… with the reflexive pronouns mich, dich, sich…'),
    sections: [
      {
        table: table(
          [PRONOUN, 'Akkusativ', 'Dativ'],
          [
            ['ich', 'mich', 'mir'],
            ['du', 'dich', 'dir'],
            ['er / sie / es', 'sich', 'sich'],
            ['wir', 'uns', 'uns'],
            ['ihr', 'euch', 'euch'],
            ['sie / Sie', 'sich', 'sich'],
          ],
        ),
        body: l(
          'Động từ phản thân thường gặp: **sich freuen (auf/über)**, **sich interessieren (für)**, **sich treffen**, **sich beeilen**, **sich ausruhen**, **sich setzen**, **sich vorstellen**, **sich fühlen**. Khi câu đã có tân ngữ Akkusativ khác, đại từ phản thân chuyển sang Dativ: Ich wasche **mir** die Hände.',
          'Common reflexive verbs: **sich freuen (auf/über)**, **sich interessieren (für)**, **sich treffen**, **sich beeilen**, **sich ausruhen**, **sich setzen**, **sich vorstellen**, **sich fühlen**. If there is another accusative object, the reflexive becomes dative: Ich wasche **mir** die Hände.',
        ),
        examples: [
          ex('Ich freue **mich** auf das Wochenende.', 'Tôi mong đến cuối tuần.', 'I am looking forward to the weekend.'),
          ex('Interessierst du **dich** für Musik?', 'Bạn có quan tâm đến âm nhạc không?', 'Are you interested in music?'),
          ex('Wir treffen **uns** um 7 Uhr.', 'Chúng ta gặp nhau lúc 7 giờ.', 'We are meeting at 7.'),
          ex('Beeil **dich**!', 'Nhanh lên!', 'Hurry up!'),
          ex('Darf ich **mich** vorstellen?', 'Tôi xin tự giới thiệu được không?', 'May I introduce myself?'),
        ],
      },
    ],
  },
  {
    id: 'genitive',
    level: 'A2',
    title: l('Cách 2: Genitiv', 'The genitive case'),
    summary: l('Sở hữu "của": des Vaters, der Mutter, và giới từ wegen, trotz, während.', 'Possession "of": des Vaters, der Mutter, and the prepositions wegen, trotz, während.'),
    sections: [
      {
        table: table(
          ['', 'm', 'f', 'n', 'pl'],
          [
            [l('Xác định', 'Definite'), 'des Mannes', 'der Frau', 'des Kindes', 'der Kinder'],
            [l('Không xác định', 'Indefinite'), 'eines Mannes', 'einer Frau', 'eines Kindes', '—'],
          ],
        ),
        bullets: [
          l('Danh từ giống đực và trung thêm **-s** hoặc **-es** (từ một âm tiết): des Vater**s**, des Kind**es**.', 'Masculine and neuter nouns add **-s** or **-es** (one syllable): des Vater**s**, des Kind**es**.'),
          l('Tên riêng chỉ thêm -s, không có dấu nháy: **Annas** Buch.', 'Names just add -s with no apostrophe: **Annas** Buch.'),
          l('Văn nói thường thay bằng **von + Dativ**: das Auto **von meinem** Vater.', 'Speech often uses **von + dative** instead: das Auto **von meinem** Vater.'),
          l('Giới từ đi với Genitiv: **wegen** (vì), **trotz** (mặc dù), **während** (trong lúc), **statt** (thay vì).', 'Genitive prepositions: **wegen** (because of), **trotz** (despite), **während** (during), **statt** (instead of).'),
        ],
        examples: [
          ex('Das ist das Haus **meiner Eltern**.', 'Đây là nhà của bố mẹ tôi.', 'This is my parents\' house.'),
          ex('Der Name **des Hotels** ist schön.', 'Tên của khách sạn rất đẹp.', 'The hotel\'s name is lovely.'),
          ex('**Wegen des Regens** bleiben wir zu Hause.', 'Vì trời mưa nên chúng tôi ở nhà.', 'Because of the rain we are staying at home.'),
          ex('**Während der Woche** arbeite ich viel.', 'Trong tuần tôi làm việc nhiều.', 'During the week I work a lot.'),
        ],
      },
    ],
  },
  {
    id: 'future-werden',
    level: 'A2',
    title: l('Tương lai với werden', 'The future with werden'),
    summary: l('werden + động từ nguyên mẫu; và werden với nghĩa "trở thành".', 'werden + infinitive, and werden meaning "to become".'),
    sections: [
      {
        table: table(
          [PRONOUN, 'werden'],
          [
            ['ich', 'werde'],
            ['du', 'wirst'],
            ['er / sie / es', 'wird'],
            ['wir', 'werden'],
            ['ihr', 'werdet'],
            ['sie / Sie', 'werden'],
          ],
        ),
        bullets: [
          l('**Futur I**: werden (vị trí 2) + động từ nguyên mẫu (cuối câu). Dùng cho dự đoán, lời hứa, quyết tâm.', '**Futur I**: werden (position 2) + infinitive (end). Used for predictions, promises and resolutions.'),
          l('Với kế hoạch có mốc thời gian, người Đức thường chỉ dùng thì hiện tại: Nächstes Jahr **fahre** ich nach Deutschland.', 'For plans with a time expression, Germans usually just use the present: Nächstes Jahr **fahre** ich nach Deutschland.'),
          l('werden đứng một mình nghĩa là **trở thành**: Sie **wird** Lehrerin. Es **wird** dunkel.', 'On its own, werden means **to become**: Sie **wird** Lehrerin. Es **wird** dunkel.'),
        ],
        examples: [
          ex('Morgen **wird** es **regnen**.', 'Ngày mai trời sẽ mưa.', 'It will rain tomorrow.'),
          ex('Ich **werde** dich nie **vergessen**.', 'Anh sẽ không bao giờ quên em.', 'I will never forget you.'),
          ex('Sie **wird** Ärztin.', 'Cô ấy sẽ trở thành bác sĩ.', 'She is going to be a doctor.'),
        ],
      },
    ],
  },
]

export default grammar
