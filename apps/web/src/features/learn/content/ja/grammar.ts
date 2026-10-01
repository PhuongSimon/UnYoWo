import type { GrammarTopic } from '../../types'
import { ex, l, table } from '../helpers'

const GROUP = l('Nhóm', 'Group')
const G1 = l('Nhóm 1', 'Group 1')
const G2 = l('Nhóm 2', 'Group 2')
const G3 = l('Nhóm 3', 'Group 3')
const RULE = l('Quy tắc', 'Rule')
const EXAMPLE = l('Ví dụ', 'Example')
const MEANING = l('Nghĩa', 'Meaning')
const PATTERN = l('Mẫu', 'Pattern')
const USE = l('Cách dùng', 'Use')
const FORM = l('Dạng', 'Form')
const IRREGULAR = l('Bất quy tắc', 'Irregular')

const grammar: GrammarTopic[] = [
  {
    id: 'sentence-structure',
    level: 'A1',
    title: l('Cấu trúc câu cơ bản', 'Basic sentence structure'),
    summary: l('Động từ luôn đứng cuối câu; trợ từ đứng sau danh từ để chỉ vai trò của nó.', 'The verb always comes last; particles follow nouns to show their role.'),
    sections: [
      {
        title: l('Chủ ngữ – Tân ngữ – Động từ', 'Subject – Object – Verb'),
        body: l(
          'Tiếng Việt nói "Tôi **ăn** bánh mì", tiếng Nhật nói "Tôi bánh mì **ăn**". Vị ngữ (động từ, tính từ hoặc です) **luôn đứng cuối câu**. Vai trò của mỗi danh từ được đánh dấu bằng **trợ từ** đứng ngay sau nó, nên thứ tự các cụm danh từ khá linh hoạt.',
          'English says "I **eat** bread", Japanese says "I bread **eat**". The predicate (verb, adjective or です) **always comes last**. Each noun is marked by a **particle** right after it, so the order of the noun phrases is fairly flexible.',
        ),
        table: table(
          [l('Chủ đề', 'Topic'), l('Tân ngữ', 'Object'), l('Động từ', 'Verb')],
          [
            ['私は (watashi wa)', 'パンを (pan o)', '食べます (tabemasu)'],
            [l('tôi thì', 'as for me'), l('bánh mì', 'bread'), l('ăn', 'eat')],
          ],
        ),
        examples: [
          ex('私**は**パン**を**食べます。', 'Tôi ăn bánh mì.', 'I eat bread.', 'Watashi wa pan o tabemasu.'),
          ex('田中さん**は**毎朝コーヒー**を**飲みます。', 'Anh Tanaka mỗi sáng đều uống cà phê.', 'Mr Tanaka drinks coffee every morning.', 'Tanaka-san wa maiasa kōhī o nomimasu.'),
          ex('あした、東京**に**行きます。', 'Ngày mai tôi đi Tokyo.', 'I am going to Tokyo tomorrow.', 'Ashita, Tōkyō ni ikimasu.'),
        ],
      },
      {
        title: l('Lược bỏ chủ ngữ', 'Dropping the subject'),
        body: l(
          'Khi ngữ cảnh đã rõ, người Nhật **thường bỏ chủ ngữ**, nhất là "tôi" và "bạn". Lặp lại 私は liên tục nghe rất thiếu tự nhiên.',
          'When the context is clear, Japanese **usually drops the subject**, especially "I" and "you". Repeating 私は sounds unnatural.',
        ),
        examples: [
          ex('学生です。', '(Tôi) là sinh viên.', '(I) am a student.', 'Gakusei desu.'),
          ex('どこへ行きますか。', '(Bạn) đi đâu thế?', 'Where are (you) going?', 'Doko e ikimasu ka.'),
        ],
      },
      {
        title: l('Không mạo từ, không số nhiều, không chia theo ngôi', 'No articles, no plurals, no person endings'),
        body: l(
          'Danh từ không có "a/the" và không đổi theo số ít hay số nhiều: 本 có thể là "một quyển sách" hoặc "nhiều quyển sách". Động từ **không chia theo ngôi**: 食べます dùng cho tôi, bạn, anh ấy hay họ đều được.',
          'Nouns have no articles and no plural form: 本 can be "a book" or "books". Verbs **do not change for person**: 食べます works for I, you, he, she and they.',
        ),
      },
      {
        title: l('Lịch sự hay thân mật?', 'Polite or casual?'),
        body: l(
          'Hãy học **thể lịch sự** (đuôi です / ます) trước: dùng được với người lạ, thầy cô, đồng nghiệp. **Thể thông thường** chỉ dùng với bạn bè và người trong gia đình.',
          'Learn the **polite style** (ending in です / ます) first: it is safe with strangers, teachers and colleagues. The **plain style** is for friends and family.',
        ),
      },
    ],
    tips: [
      l('Hậu tố **さん** đặt sau tên người khác (田中さん), **không bao giờ** dùng cho chính mình.', 'Add **さん** after other people\'s names (田中さん) but **never** after your own.'),
      l('Hạn chế dùng あなた (bạn) khi nói chuyện: gọi bằng tên + さん lịch sự và tự nhiên hơn.', 'Avoid あなた ("you") in conversation: the person\'s name + さん is more polite and natural.'),
    ],
  },
  {
    id: 'desu',
    level: 'A1',
    title: l('Danh từ + です', 'Noun + です'),
    summary: l('"Là": khẳng định, phủ định, quá khứ và câu hỏi với です.', '"To be": affirmative, negative, past and questions with です.'),
    sections: [
      {
        table: table(
          [FORM, l('Lịch sự', 'Polite'), l('Thông thường', 'Plain'), MEANING],
          [
            [l('Hiện tại', 'Present'), '学生**です**', '学生**だ**', l('là sinh viên', 'is a student')],
            [l('Phủ định', 'Negative'), '学生**じゃありません**', '学生**じゃない**', l('không phải là sinh viên', 'is not a student')],
            [l('Quá khứ', 'Past'), '学生**でした**', '学生**だった**', l('đã là sinh viên', 'was a student')],
            [l('Quá khứ phủ định', 'Past negative'), '学生**じゃありませんでした**', '学生**じゃなかった**', l('đã không phải là sinh viên', 'was not a student')],
          ],
        ),
      },
      {
        title: l('Câu hỏi với か', 'Questions with か'),
        body: l(
          'Thêm **か** vào cuối câu để tạo câu hỏi, không cần đảo trật tự từ. Trả lời: **はい**、そうです (vâng, đúng vậy) hoặc **いいえ**、ちがいます (không, không phải).',
          'Add **か** at the end to make a question; the word order stays the same. Answer with **はい**、そうです (yes, that\'s right) or **いいえ**、ちがいます (no, it isn\'t).',
        ),
        examples: [
          ex('私はリンです。ベトナム人**です**。', 'Tôi là Linh. Tôi là người Việt Nam.', 'I am Linh. I am Vietnamese.', 'Watashi wa Rin desu. Betonamujin desu.'),
          ex('田中さんは先生**ですか**。', 'Anh Tanaka là giáo viên phải không?', 'Is Mr Tanaka a teacher?', 'Tanaka-san wa sensei desu ka.'),
          ex('いいえ、先生**じゃありません**。医者です。', 'Không, anh ấy không phải là giáo viên. Anh ấy là bác sĩ.', 'No, he is not a teacher. He is a doctor.', 'Iie, sensei ja arimasen. Isha desu.'),
          ex('きのうは日曜日**でした**。', 'Hôm qua là chủ nhật.', 'Yesterday was Sunday.', 'Kinō wa nichiyōbi deshita.'),
        ],
      },
      {
        title: l('Ghi chú', 'Notes'),
        bullets: [
          l('**じゃありません** là văn nói; văn viết, trang trọng dùng **ではありません**. Cũng hay nghe **じゃないです**.', '**じゃありません** is spoken; formal writing uses **ではありません**. You will also hear **じゃないです**.'),
          l('Thay は bằng **も** để nói "cũng": ミンさん**も**学生です (Minh cũng là sinh viên).', 'Replace は with **も** for "also": ミンさん**も**学生です (Minh is a student too).'),
        ],
      },
    ],
    tips: [l('です ở cuối câu đọc gần như "des" vì âm u bị lướt.', 'です at the end of a sentence sounds like "des" because the u is devoiced.')],
  },
  {
    id: 'wa-ga',
    level: 'A1',
    title: l('は và が', 'は vs が'),
    summary: l('は giới thiệu chủ đề ("còn … thì"); が nhấn mạnh hoặc giới thiệu chủ ngữ mới.', 'は marks the topic ("as for…"); が highlights or introduces the subject.'),
    sections: [
      {
        title: l('は: chủ đề của câu', 'は: the topic'),
        body: l(
          '**は** (đọc "wa") đánh dấu **điều mà câu đang nói đến**, giống "còn … thì". Thông tin quan trọng nằm ở phần **sau** は.',
          '**は** (read "wa") marks **what the sentence is about**, like "as for…". The important information comes **after** は.',
        ),
        examples: [
          ex('私**は**会社員です。', 'Tôi là nhân viên công ty.', 'I am an office worker.', 'Watashi wa kaishain desu.'),
          ex('今日**は**暑いですね。', 'Hôm nay nóng nhỉ.', 'It\'s hot today, isn\'t it?', 'Kyō wa atsui desu ne.'),
        ],
      },
      {
        title: l('が: chủ ngữ được nhấn mạnh hoặc thông tin mới', 'が: the highlighted or new subject'),
        body: l(
          '**が** đặt trọng tâm vào **chính danh từ đứng trước nó**. Dùng が khi trả lời câu hỏi "ai / cái gì", sau **từ để hỏi** làm chủ ngữ, khi mô tả điều vừa nhìn thấy, và trong mệnh đề phụ.',
          '**が** puts the focus on **the noun right before it**. Use が to answer "who / what", after **question words** acting as subjects, when describing something you just noticed, and inside sub-clauses.',
        ),
        examples: [
          ex('だれ**が**来ましたか。― 田中さん**が**来ました。', 'Ai đã đến? ― Anh Tanaka đã đến.', 'Who came? ― Mr Tanaka did.', 'Dare ga kimashita ka. ― Tanaka-san ga kimashita.'),
          ex('あ、雨**が**降っています。', 'Ồ, trời đang mưa.', 'Oh, it\'s raining.', 'A, ame ga futte imasu.'),
          ex('どれ**が**あなたのかばんですか。', 'Cái nào là cặp của bạn?', 'Which one is your bag?', 'Dore ga anata no kaban desu ka.'),
        ],
      },
      {
        title: l('が với một số từ cố định', 'が with certain words'),
        body: l(
          'Đối tượng của các từ chỉ **sở thích, năng lực, sở hữu, mong muốn** dùng **が** chứ không dùng を: 好き, きらい, 上手, 下手, 分かる, ある, ほしい.',
          'The object of words for **likes, skills, possession and wants** takes **が**, not を: 好き, きらい, 上手, 下手, 分かる, ある, ほしい.',
        ),
        examples: [
          ex('私は猫**が**好きです。', 'Tôi thích mèo.', 'I like cats.', 'Watashi wa neko ga suki desu.'),
          ex('ミンさんは日本語**が**分かります。', 'Minh hiểu tiếng Nhật.', 'Minh understands Japanese.', 'Min-san wa Nihongo ga wakarimasu.'),
          ex('私は車**が**ほしいです。', 'Tôi muốn có ô tô.', 'I want a car.', 'Watashi wa kuruma ga hoshii desu.'),
        ],
      },
      {
        title: l('は để đối chiếu', 'は for contrast'),
        body: l('は còn dùng để **so sánh, đối lập** hai sự việc.', 'は also sets up a **contrast** between two things.'),
        examples: [ex('肉**は**食べますが、魚**は**食べません。', 'Thịt thì tôi ăn, nhưng cá thì không.', 'I eat meat, but I don\'t eat fish.', 'Niku wa tabemasu ga, sakana wa tabemasen.')],
      },
    ],
    tips: [
      l('Mẹo nhớ: hỏi bằng **だれが / なにが** thì trả lời bằng **が**; hỏi bằng **は** thì trả lời bằng **は**.', 'Rule of thumb: a question with **だれが / なにが** is answered with **が**; a question with **は** is answered with **は**.'),
      l('Từ để hỏi không bao giờ đi với は: nói **だれが**, không nói "だれは".', 'A question word never takes は: say **だれが**, not "だれは".'),
    ],
  },
  {
    id: 'particle-no',
    level: 'A1',
    title: l('Trợ từ の', 'The particle の'),
    summary: l('Nối hai danh từ: sở hữu ("của"), xuất xứ, thuộc tính.', 'Links two nouns: possession, origin, description.'),
    sections: [
      {
        body: l(
          '**A の B**: A bổ nghĩa cho B. Thứ tự **ngược với tiếng Việt**: 私**の**本 = sách **của tôi**.',
          '**A の B**: A describes B, like English "A\'s B": 私**の**本 = **my** book.',
        ),
        table: table(
          [USE, EXAMPLE, MEANING],
          [
            [l('Sở hữu', 'Possession'), '私**の**かばん', l('cặp của tôi', 'my bag')],
            [l('Xuất xứ', 'Origin'), '日本**の**車', l('ô tô của Nhật', 'a Japanese car')],
            [l('Thuộc tổ chức', 'Belonging'), 'ABC銀行**の**山田さん', l('anh Yamada của ngân hàng ABC', 'Mr Yamada of ABC Bank')],
            [l('Nội dung, chủng loại', 'Content, kind'), '日本語**の**本', l('sách tiếng Nhật', 'a Japanese-language book')],
            [l('Vị trí', 'Position'), '机**の**上', l('trên bàn', 'on the desk')],
          ],
        ),
      },
      {
        title: l('の thay cho danh từ', 'の replacing a noun'),
        body: l(
          'Khi danh từ đã rõ, có thể bỏ nó và chỉ giữ の: このかさは私**の**です (cái ô này là của tôi).',
          'When the noun is obvious, drop it and keep の: このかさは私**の**です (this umbrella is mine).',
        ),
        examples: [
          ex('これは私**の**かさです。', 'Đây là ô của tôi.', 'This is my umbrella.', 'Kore wa watashi no kasa desu.'),
          ex('ミンさんは東京大学**の**学生です。', 'Minh là sinh viên Đại học Tokyo.', 'Minh is a student at the University of Tokyo.', 'Min-san wa Tōkyō Daigaku no gakusei desu.'),
          ex('そのかばんはだれ**の**ですか。', 'Cái cặp đó là của ai?', 'Whose bag is that?', 'Sono kaban wa dare no desu ka.'),
          ex('私**の**友だち**の**お姉さん', 'chị gái của bạn tôi', 'my friend\'s older sister', 'watashi no tomodachi no onēsan'),
        ],
      },
    ],
    tips: [l('Có thể nối nhiều の liên tiếp; khi dịch sang tiếng Việt, hãy đọc từ cuối lên.', 'You can chain several の; when translating into Vietnamese, read from the end.')],
  },
  {
    id: 'kosoado',
    level: 'A1',
    title: l('こ・そ・あ・ど: này, đó, kia, nào', 'こ・そ・あ・ど: this, that, that over there, which'),
    summary: l('Hệ thống từ chỉ định theo khoảng cách với người nói và người nghe.', 'Demonstratives based on distance from the speaker and the listener.'),
    sections: [
      {
        body: l(
          '**こ** = gần người nói, **そ** = gần người nghe, **あ** = xa cả hai, **ど** = từ để hỏi.',
          '**こ** = near the speaker, **そ** = near the listener, **あ** = far from both, **ど** = the question word.',
        ),
        table: table(
          ['', 'こ', 'そ', 'あ', 'ど'],
          [
            [l('Vật (đứng một mình)', 'Thing (on its own)'), 'これ', 'それ', 'あれ', 'どれ'],
            [l('+ danh từ', '+ noun'), 'この本', 'その本', 'あの本', 'どの本'],
            [l('Nơi chốn', 'Place'), 'ここ', 'そこ', 'あそこ', 'どこ'],
            [l('Hướng (lịch sự)', 'Direction (polite)'), 'こちら', 'そちら', 'あちら', 'どちら'],
            [l('Cách thức', 'Manner'), 'こう', 'そう', 'ああ', 'どう'],
          ],
        ),
      },
      {
        title: l('これ hay この?', 'これ or この?'),
        body: l(
          '**これ / それ / あれ** đứng một mình như danh từ. **この / その / あの** bắt buộc đi kèm một danh từ phía sau.',
          '**これ / それ / あれ** stand alone as nouns. **この / その / あの** must come before a noun.',
        ),
        examples: [
          ex('**これ**は何ですか。', 'Cái này là cái gì?', 'What is this?', 'Kore wa nan desu ka.'),
          ex('**この**かばんはいくらですか。', 'Cái cặp này giá bao nhiêu?', 'How much is this bag?', 'Kono kaban wa ikura desu ka.'),
          ex('トイレは**どこ**ですか。― **あそこ**です。', 'Nhà vệ sinh ở đâu? ― Ở đằng kia.', 'Where is the toilet? ― Over there.', 'Toire wa doko desu ka. ― Asoko desu.'),
          ex('**こちら**は田中さんです。', 'Đây là anh Tanaka. (giới thiệu lịch sự)', 'This is Mr Tanaka. (polite introduction)', 'Kochira wa Tanaka-san desu.'),
        ],
      },
    ],
    tips: [
      l(
        '**こちら / そちら / あちら / どちら** là dạng lịch sự của ここ / そこ / あそこ / どこ, hay gặp trong cửa hàng và khi giới thiệu.',
        '**こちら / そちら / あちら / どちら** are polite versions of ここ / そこ / あそこ / どこ, common in shops and introductions.',
      ),
    ],
  },
  {
    id: 'question-words',
    level: 'A1',
    title: l('Câu hỏi và từ để hỏi', 'Questions and question words'),
    summary: l('Thêm か vào cuối câu; đặt なに, だれ, どこ, いつ… vào đúng chỗ cần hỏi.', 'Add か at the end; put なに, だれ, どこ, いつ… where the answer would go.'),
    sections: [
      {
        body: l(
          'Câu hỏi giữ nguyên trật tự từ: chỉ cần **thêm か** vào cuối và lên giọng. Từ để hỏi đứng **đúng vị trí** của thông tin cần hỏi.',
          'Questions keep the normal word order: just **add か** at the end and raise your voice. The question word sits **where the answer would go**.',
        ),
        table: table(
          [l('Từ', 'Word'), MEANING, EXAMPLE],
          [
            ['なに / なん', l('cái gì', 'what'), 'これは**なん**ですか。'],
            ['だれ / どなた', l('ai / vị nào (lịch sự)', 'who / who (polite)'), 'あの人は**だれ**ですか。'],
            ['どこ', l('ở đâu', 'where'), 'トイレは**どこ**ですか。'],
            ['いつ', l('khi nào', 'when'), '誕生日は**いつ**ですか。'],
            ['なんじ', l('mấy giờ', 'what time'), '今、**なんじ**ですか。'],
            ['いくら', l('bao nhiêu tiền', 'how much'), 'これは**いくら**ですか。'],
            ['いくつ', l('mấy cái; mấy tuổi', 'how many; how old'), 'りんごは**いくつ**ありますか。'],
            ['どう', l('thế nào', 'how'), '日本の生活は**どう**ですか。'],
            ['どんな', l('như thế nào (+ danh từ)', 'what kind of'), '**どんな**音楽が好きですか。'],
            ['どうして / なぜ', l('tại sao', 'why'), '**どうして**来ませんでしたか。'],
            ['どれ / どの', l('cái nào', 'which'), '**どれ**がいいですか。'],
            ['どちら', l('cái nào (trong hai); hướng nào', 'which (of two); which way'), 'コーヒーと紅茶と**どちら**がいいですか。'],
          ],
        ),
      },
      {
        title: l('なに hay なん?', 'なに or なん?'),
        body: l(
          'Đọc **なん** trước です, trước các âm t / n / d và trước trợ số từ (なんじ, なんにん). Các trường hợp còn lại đọc **なに** (なにを食べますか).',
          'Say **なん** before です, before t / n / d sounds and before counters (なんじ, なんにん). Otherwise say **なに** (なにを食べますか).',
        ),
      },
      {
        title: l('Từ để hỏi + か / も', 'Question word + か / も'),
        body: l(
          'Từ để hỏi + **か** = "một … nào đó". Từ để hỏi + **も** + động từ phủ định = "không … nào cả".',
          'Question word + **か** = "some…". Question word + **も** + negative verb = "no… at all".',
        ),
        examples: [
          ex('**何か**飲みますか。', 'Bạn có uống gì không?', 'Would you like something to drink?', 'Nanika nomimasu ka.'),
          ex('きのうは**どこへも**行きませんでした。', 'Hôm qua tôi không đi đâu cả.', 'I didn\'t go anywhere yesterday.', 'Kinō wa doko e mo ikimasen deshita.'),
          ex('部屋に**だれか**いますか。― いいえ、**だれも**いません。', 'Trong phòng có ai không? ― Không, không có ai cả.', 'Is anyone in the room? ― No, nobody.', 'Heya ni dareka imasu ka. ― Iie, dare mo imasen.'),
        ],
      },
    ],
    tips: [l('Câu hỏi lịch sự khi viết thường kết thúc bằng "。" thay vì "?"; văn viết thân mật mới dùng "?".', 'Polite written questions usually end with "。" rather than "?"; casual writing uses "?".')],
  },
  {
    id: 'ne-yo',
    level: 'A1',
    title: l('Trợ từ cuối câu: ね, よ', 'Sentence-ending particles: ね and よ'),
    summary: l('ね tìm sự đồng tình ("… nhỉ"), よ báo cho người nghe điều họ chưa biết ("… đấy").', 'ね seeks agreement ("…, isn\'t it?"), よ tells the listener something new ("…, you know").'),
    sections: [
      {
        table: table(
          [l('Trợ từ', 'Particle'), l('Sắc thái', 'Nuance'), EXAMPLE],
          [
            ['ね', l('"… nhỉ / nhé": tìm sự đồng tình, xác nhận', '"…, isn\'t it?": seeks agreement or confirmation'), 'いい天気です**ね**。'],
            ['よ', l('"… đấy / mà": báo thông tin mới, nhấn mạnh', '"…, you know": gives new information, adds emphasis'), 'このパン、おいしいです**よ**。'],
            ['よね', l('"… phải không nhỉ": kiểm tra điều mình nghĩ là đúng', '"…, right?": checks something you believe'), 'あしたは休みです**よね**。'],
          ],
        ),
        examples: [
          ex('暑いです**ね**。― そうです**ね**。', 'Nóng nhỉ. ― Ừ, nóng thật.', 'It\'s hot, isn\'t it? ― It sure is.', 'Atsui desu ne. ― Sō desu ne.'),
          ex('あ、かさを忘れました**よ**。', 'Ơ, anh quên ô kìa.', 'Oh, you\'ve forgotten your umbrella.', 'A, kasa o wasuremashita yo.'),
          ex('じゃ、また**ね**。', 'Thôi, hẹn gặp lại nhé.', 'See you later, then.', 'Ja, mata ne.'),
        ],
      },
    ],
    tips: [l('Dùng よ quá nhiều với người trên có thể nghe như đang dạy đời.', 'Overusing よ with superiors can sound pushy.')],
  },
  {
    id: 'aru-iru',
    level: 'A1',
    title: l('あります / います: có, ở', 'あります / います: there is, to be somewhere'),
    summary: l('あります cho đồ vật, cây cối, sự kiện; います cho người và động vật.', 'あります for things, plants and events; います for people and animals.'),
    sections: [
      {
        table: table(
          ['', l('Đồ vật, cây cối, sự kiện', 'Things, plants, events'), l('Người, động vật', 'People, animals')],
          [
            [l('Có / ở', 'There is'), 'あります', 'います'],
            [l('Không có', 'There is not'), 'ありません', 'いません'],
            [l('Thông thường', 'Plain'), 'ある / ない', 'いる / いない'],
          ],
        ),
      },
      {
        title: l('Hai mẫu câu', 'Two patterns'),
        bullets: [
          l('**Nơi chốn に N が あります / います**: ở … có … (giới thiệu điều mới).', '**Place に N が あります / います**: there is N in a place (introducing something new).'),
          l('**N は nơi chốn に あります / います**: N ở … (N đã được nhắc đến).', '**N は place に あります / います**: N is in a place (N is already known).'),
        ],
        examples: [
          ex('机の上**に**本**が**あります。', 'Trên bàn có quyển sách.', 'There is a book on the desk.', 'Tsukue no ue ni hon ga arimasu.'),
          ex('公園**に**子どもがたくさん**います**。', 'Trong công viên có nhiều trẻ em.', 'There are lots of children in the park.', 'Kōen ni kodomo ga takusan imasu.'),
          ex('田中さん**は**会議室**に**います。', 'Anh Tanaka đang ở phòng họp.', 'Mr Tanaka is in the meeting room.', 'Tanaka-san wa kaigishitsu ni imasu.'),
          ex('あした、テスト**が**あります。', 'Ngày mai có bài kiểm tra.', 'There is a test tomorrow.', 'Ashita, tesuto ga arimasu.'),
          ex('私は兄弟**が**いません。', 'Tôi không có anh chị em.', 'I have no brothers or sisters.', 'Watashi wa kyōdai ga imasen.'),
        ],
      },
      {
        title: l('Từ chỉ vị trí', 'Position words'),
        body: l(
          'Dùng mẫu **N の + vị trí**: 上 (trên), 下 (dưới), 前 (trước), うしろ (sau), 中 (trong), 外 (ngoài), となり (bên cạnh), 近く (gần), 右 (phải), 左 (trái), 間 (giữa).',
          'Use **N の + position**: 上 (on, above), 下 (under), 前 (in front), うしろ (behind), 中 (inside), 外 (outside), となり (next to), 近く (near), 右 (right), 左 (left), 間 (between).',
        ),
        examples: [ex('銀行は駅**の前に**あります。', 'Ngân hàng ở trước nhà ga.', 'The bank is in front of the station.', 'Ginkō wa eki no mae ni arimasu.')],
      },
    ],
    tips: [
      l('あります còn có nghĩa "có (sở hữu)" và "diễn ra": お金があります (có tiền), 会議があります (có cuộc họp).', 'あります also means "to have" and "to take place": お金があります (I have money), 会議があります (there is a meeting).'),
    ],
  },
  {
    id: 'particle-o',
    level: 'A1',
    title: l('Trợ từ を', 'The particle を'),
    summary: l('Đánh dấu tân ngữ trực tiếp: ăn **cái gì**, xem **cái gì**.', 'Marks the direct object: eat **what**, watch **what**.'),
    sections: [
      {
        body: l('**を** (đọc "o") đứng sau **đối tượng chịu tác động** của động từ.', '**を** (read "o") follows **the thing the action is done to**.'),
        examples: [
          ex('毎朝パン**を**食べます。', 'Mỗi sáng tôi ăn bánh mì.', 'I eat bread every morning.', 'Maiasa pan o tabemasu.'),
          ex('テレビ**を**見ます。', 'Tôi xem tivi.', 'I watch TV.', 'Terebi o mimasu.'),
          ex('日本語**を**勉強しています。', 'Tôi đang học tiếng Nhật.', 'I am studying Japanese.', 'Nihongo o benkyō shite imasu.'),
          ex('何**を**買いましたか。', 'Bạn đã mua gì?', 'What did you buy?', 'Nani o kaimashita ka.'),
        ],
      },
      {
        title: l('を với động từ di chuyển', 'を with movement verbs'),
        body: l('Với động từ di chuyển, を chỉ **nơi đi qua** hoặc **nơi rời khỏi**.', 'With movement verbs, を marks **the place you move through** or **the place you leave**.'),
        examples: [
          ex('公園**を**散歩します。', 'Tôi đi dạo trong công viên.', 'I take a walk in the park.', 'Kōen o sanpo shimasu.'),
          ex('この道**を**まっすぐ行ってください。', 'Hãy đi thẳng theo con đường này.', 'Go straight along this road.', 'Kono michi o massugu itte kudasai.'),
          ex('7時に家**を**出ます。', 'Tôi ra khỏi nhà lúc 7 giờ.', 'I leave home at 7.', 'Shichiji ni ie o demasu.'),
          ex('電車**を**降ります。', 'Tôi xuống tàu.', 'I get off the train.', 'Densha o orimasu.'),
        ],
      },
    ],
    tips: [l('Động từ dạng danh từ + する có thể chen を vào giữa: 勉強する = 勉強**を**する (học).', 'Noun + する verbs can take を in between: 勉強する = 勉強**を**する (study).')],
  },
  {
    id: 'particle-ni-e',
    level: 'A1',
    title: l('Trợ từ に và へ', 'The particles に and へ'),
    summary: l('に: thời điểm, đích đến, nơi tồn tại, người nhận. へ: hướng di chuyển.', 'に: time, destination, location of existence, recipient. へ: direction.'),
    sections: [
      {
        table: table(
          [USE, EXAMPLE, MEANING],
          [
            [l('Thời điểm cụ thể', 'Specific time'), '7時**に**起きます。', l('Tôi dậy lúc 7 giờ.', 'I get up at 7.')],
            [l('Đích đến', 'Destination'), '学校**に**行きます。', l('Tôi đến trường.', 'I go to school.')],
            [l('Nơi tồn tại', 'Location of existence'), '部屋**に**猫がいます。', l('Trong phòng có con mèo.', 'There is a cat in the room.')],
            [l('Người nhận', 'Recipient'), '母**に**電話します。', l('Tôi gọi điện cho mẹ.', 'I phone my mother.')],
            [l('Mục đích', 'Purpose'), '買い物**に**行きます。', l('Tôi đi mua sắm.', 'I go shopping.')],
            [l('Lên xe, vào trong', 'Getting on, into'), 'バス**に**乗ります。', l('Tôi lên xe buýt.', 'I get on the bus.')],
            [l('Tần suất', 'Frequency'), '1週間**に**2回', l('2 lần một tuần', 'twice a week')],
          ],
        ),
      },
      {
        title: l('Thời gian: khi nào dùng に?', 'Time: when do you need に?'),
        body: l(
          'Dùng に với **giờ, ngày, tháng, năm cụ thể** (3時に, 5月に, 2025年に) và với thứ (月曜日に). **Không dùng** に với từ chỉ thời gian tương đối: 今日, あした, きのう, 毎日, 今週, 来年.',
          'Use に with **specific clock times, dates, months and years** (3時に, 5月に, 2025年に) and with weekdays (月曜日に). **No** に with relative time words: 今日, あした, きのう, 毎日, 今週, 来年.',
        ),
        examples: [
          ex('日曜日**に**映画を見ました。', 'Chủ nhật tôi đã xem phim.', 'I watched a film on Sunday.', 'Nichiyōbi ni eiga o mimashita.'),
          ex('あした京都へ行きます。', 'Ngày mai tôi đi Kyoto. (あした không đi với に)', 'I\'m going to Kyoto tomorrow. (no に after あした)', 'Ashita Kyōto e ikimasu.'),
        ],
      },
      {
        title: l('へ: hướng đi', 'へ: direction'),
        body: l(
          '**へ** (đọc "e") nhấn mạnh **hướng** di chuyển. Với 行く, 来る, 帰る, に và へ gần như thay thế được cho nhau.',
          '**へ** (read "e") stresses the **direction** of movement. With 行く, 来る and 帰る, に and へ are almost interchangeable.',
        ),
        examples: [
          ex('来月、日本**へ**行きます。', 'Tháng sau tôi đi Nhật.', 'I\'m going to Japan next month.', 'Raigetsu, Nihon e ikimasu.'),
          ex('何時にうち**へ**帰りますか。', 'Mấy giờ bạn về nhà?', 'What time do you go home?', 'Nanji ni uchi e kaerimasu ka.'),
          ex('友だち**に**メールを送りました。', 'Tôi đã gửi email cho bạn.', 'I sent an email to a friend.', 'Tomodachi ni mēru o okurimashita.'),
        ],
      },
    ],
    tips: [l('Mẫu **V (bỏ ます) + に行きます** = đi để làm gì: 映画を見**に**行きます (đi xem phim).', 'Pattern **verb stem + に行きます** = go to do something: 映画を見**に**行きます (go to see a film).')],
  },
  {
    id: 'particle-de',
    level: 'A1',
    title: l('Trợ từ で', 'The particle で'),
    summary: l('Nơi diễn ra hành động, phương tiện, công cụ, ngôn ngữ, phạm vi.', 'Where an action happens, means, tools, language, scope.'),
    sections: [
      {
        table: table(
          [USE, EXAMPLE, MEANING],
          [
            [l('Nơi diễn ra hành động', 'Place of action'), '図書館**で**勉強します。', l('Tôi học ở thư viện.', 'I study at the library.')],
            [l('Phương tiện', 'Means of transport'), 'バス**で**会社へ行きます。', l('Tôi đi làm bằng xe buýt.', 'I go to work by bus.')],
            [l('Công cụ', 'Tool'), 'はし**で**食べます。', l('Tôi ăn bằng đũa.', 'I eat with chopsticks.')],
            [l('Ngôn ngữ', 'Language'), '日本語**で**話してください。', l('Hãy nói bằng tiếng Nhật.', 'Please speak in Japanese.')],
            [l('Phạm vi', 'Scope'), '日本**で**一番高い山', l('ngọn núi cao nhất ở Nhật', 'the highest mountain in Japan')],
            [l('Nguyên nhân (danh từ)', 'Cause (noun)'), 'かぜ**で**学校を休みました。', l('Tôi nghỉ học vì bị cảm.', 'I missed school because of a cold.')],
            [l('Tổng cộng', 'Total'), '三つ**で**500円です。', l('Ba cái tổng cộng 500 yên.', 'Three for 500 yen.')],
          ],
        ),
      },
      {
        title: l('で hay に?', 'で or に?'),
        body: l(
          '**に** chỉ nơi **tồn tại** (いる, ある, 住む) hoặc **đích đến**. **で** chỉ nơi **hành động diễn ra** (ăn, học, làm việc, mua).',
          '**に** marks where something **exists** (いる, ある, 住む) or a **destination**. **で** marks where an **action takes place** (eat, study, work, buy).',
        ),
        examples: [
          ex('東京**に**住んでいます。', 'Tôi sống ở Tokyo.', 'I live in Tokyo.', 'Tōkyō ni sunde imasu.'),
          ex('東京**で**働いています。', 'Tôi làm việc ở Tokyo.', 'I work in Tokyo.', 'Tōkyō de hataraite imasu.'),
          ex('レストラン**で**晩ごはんを食べました。', 'Tôi đã ăn tối ở nhà hàng.', 'I had dinner at a restaurant.', 'Resutoran de bangohan o tabemashita.'),
        ],
      },
    ],
    tips: [l('"Đi bộ" là **歩いて** (aruite), không nói "足で".', '"On foot" is **歩いて** (aruite), not "足で".')],
  },
  {
    id: 'particle-to-ya-mo',
    level: 'A1',
    title: l('と, や, も', 'と, や and も'),
    summary: l('と: "và" (liệt kê đủ) hoặc "cùng với"; や: "và… vân vân"; も: "cũng".', 'と: "and" (complete list) or "with"; や: "and… among others"; も: "also".'),
    sections: [
      {
        title: l('と: và; cùng với', 'と: and; with'),
        body: l('**と** nối các danh từ khi **liệt kê đầy đủ**. Đứng sau người thì có nghĩa "cùng với".', '**と** joins nouns in a **complete list**. After a person it means "with".'),
        examples: [
          ex('パン**と**牛乳を買いました。', 'Tôi đã mua bánh mì và sữa.', 'I bought bread and milk.', 'Pan to gyūnyū o kaimashita.'),
          ex('友だち**と**映画を見ます。', 'Tôi xem phim cùng bạn.', 'I watch a film with a friend.', 'Tomodachi to eiga o mimasu.'),
        ],
      },
      {
        title: l('や: và… vân vân', 'や: and… among others'),
        body: l('**や** liệt kê **vài ví dụ tiêu biểu**, ngụ ý còn thứ khác. Thường kết thúc bằng **など** (vân vân).', '**や** lists **a few examples**, implying there are more. It often ends with **など** (etc.).'),
        examples: [ex('かばんの中に本**や**ノート**など**があります。', 'Trong cặp có sách, vở, v.v.', 'In the bag there are books, notebooks and so on.', 'Kaban no naka ni hon ya nōto nado ga arimasu.')],
      },
      {
        title: l('も: cũng', 'も: also, too'),
        body: l(
          '**も** thay thế cho は, が, を. Với các trợ từ khác (に, で, へ, と), も đứng **sau** chúng: にも, でも, とも.',
          '**も** replaces は, が and を. With other particles (に, で, へ, と) it comes **after** them: にも, でも, とも.',
        ),
        examples: [
          ex('私**も**学生です。', 'Tôi cũng là sinh viên.', 'I am a student too.', 'Watashi mo gakusei desu.'),
          ex('コーヒー**も**飲みます。', 'Tôi cũng uống cà phê.', 'I drink coffee too.', 'Kōhī mo nomimasu.'),
          ex('大阪**にも**行きました。', 'Tôi cũng đã đi Osaka.', 'I went to Osaka too.', 'Ōsaka ni mo ikimashita.'),
        ],
      },
    ],
    tips: [l('と chỉ nối **danh từ**, không nối hai câu hay hai động từ (muốn nối động từ thì dùng thể て).', 'と only joins **nouns**, never clauses or verbs (use the て form for verbs).')],
  },
  {
    id: 'kara-made',
    level: 'A1',
    title: l('から và まで', 'から and まで'),
    summary: l('"Từ … đến …" cho thời gian và nơi chốn; までに: "trước, chậm nhất là".', '"From… to…" for time and place; までに: "by" a deadline.'),
    sections: [
      {
        body: l(
          '**から** = từ (điểm bắt đầu), **まで** = đến (điểm kết thúc). Dùng được cho cả thời gian lẫn địa điểm.',
          '**から** = from (starting point), **まで** = until / to (end point). Works for both time and place.',
        ),
        examples: [
          ex('銀行は9時**から**3時**まで**です。', 'Ngân hàng mở cửa từ 9 giờ đến 3 giờ.', 'The bank is open from 9 to 3.', 'Ginkō wa kuji kara sanji made desu.'),
          ex('うち**から**駅**まで**歩いて10分です。', 'Từ nhà đến ga đi bộ mất 10 phút.', 'It\'s a 10-minute walk from home to the station.', 'Uchi kara eki made aruite juppun desu.'),
          ex('月曜日**から**金曜日**まで**働きます。', 'Tôi làm việc từ thứ Hai đến thứ Sáu.', 'I work from Monday to Friday.', 'Getsuyōbi kara kin\'yōbi made hatarakimasu.'),
        ],
      },
      {
        title: l('まで và までに', 'まで vs までに'),
        body: l(
          '**まで**: hành động **kéo dài liên tục** đến thời điểm đó. **までに**: hành động xảy ra **trước hoặc đúng** hạn chót.',
          '**まで**: the action **continues until** that time. **までに**: the action happens **by** that deadline.',
        ),
        examples: [
          ex('5時**まで**待ちます。', 'Tôi sẽ đợi đến 5 giờ.', 'I\'ll wait until 5.', 'Goji made machimasu.'),
          ex('5時**までに**帰ります。', 'Tôi sẽ về trước 5 giờ.', 'I\'ll be back by 5.', 'Goji made ni kaerimasu.'),
        ],
      },
      {
        title: l('から: "từ" ai đó', 'から: from someone'),
        examples: [ex('これは母**から**の手紙です。', 'Đây là thư mẹ gửi cho tôi.', 'This is a letter from my mother.', 'Kore wa haha kara no tegami desu.')],
      },
    ],
    tips: [l('から đứng sau **cả một câu** lại mang nghĩa "vì" (xem bài Lý do: から và ので).', 'After **a whole clause**, から means "because" (see the lesson on から and ので).')],
  },
  {
    id: 'numbers-counters',
    level: 'A1',
    title: l('Số đếm và trợ số từ', 'Numbers and counters'),
    summary: l('Số từ 1 đến hàng triệu, cách đếm đồ vật với 〜つ và các trợ số từ thông dụng.', 'Numbers into the millions, counting things with 〜つ and common counters.'),
    sections: [
      {
        title: l('Số đếm', 'Numbers'),
        table: table(
          [l('Số', 'Number'), l('Cách đọc', 'Reading'), l('Đếm đồ vật (〜つ)', 'Things (〜つ)')],
          [
            ['1 一', 'いち (ichi)', 'ひとつ'],
            ['2 二', 'に (ni)', 'ふたつ'],
            ['3 三', 'さん (san)', 'みっつ'],
            ['4 四', 'よん / し (yon / shi)', 'よっつ'],
            ['5 五', 'ご (go)', 'いつつ'],
            ['6 六', 'ろく (roku)', 'むっつ'],
            ['7 七', 'なな / しち (nana / shichi)', 'ななつ'],
            ['8 八', 'はち (hachi)', 'やっつ'],
            ['9 九', 'きゅう / く (kyū / ku)', 'ここのつ'],
            ['10 十', 'じゅう (jū)', 'とお'],
          ],
        ),
      },
      {
        title: l('Số lớn', 'Bigger numbers'),
        body: l(
          'Ghép số giống tiếng Việt: 11 = 十一 (じゅういち), 20 = 二十 (にじゅう), 35 = 三十五 (さんじゅうご). 100 = 百 (ひゃく), 1.000 = 千 (せん), **10.000 = 一万 (いちまん)**. Người Nhật đếm số lớn theo **vạn** (4 chữ số) chứ không theo nghìn: 100.000 = 十万 (mười vạn).',
          'Numbers combine logically: 11 = 十一 (jūichi), 20 = 二十 (nijū), 35 = 三十五 (sanjūgo). 100 = 百 (hyaku), 1,000 = 千 (sen), **10,000 = 一万 (ichiman)**. Big numbers are grouped by **ten thousands**, not thousands: 100,000 = 十万 (ten "man").',
        ),
        table: table(
          [l('Số', 'Number'), l('Cách đọc', 'Reading')],
          [
            ['300', 'さんびゃく (sanbyaku)'],
            ['600', 'ろっぴゃく (roppyaku)'],
            ['800', 'はっぴゃく (happyaku)'],
            [l('3.000', '3,000'), 'さんぜん (sanzen)'],
            [l('8.000', '8,000'), 'はっせん (hassen)'],
            [l('10.000', '10,000'), 'いちまん (ichiman)'],
            [l('1.000.000', '1,000,000'), 'ひゃくまん (hyakuman)'],
          ],
        ),
      },
      {
        title: l('Trợ số từ thông dụng', 'Common counters'),
        body: l(
          'Khi đếm, tiếng Nhật thêm **trợ số từ** tuỳ loại vật, giống "cái, con, tờ" trong tiếng Việt. Vị trí thường gặp: **N を + số lượng + động từ**.',
          'When counting, Japanese adds a **counter** that depends on the kind of thing, like "a sheet of" or "a cup of" in English. Typical order: **N を + amount + verb**.',
        ),
        table: table(
          [l('Trợ số từ', 'Counter'), l('Dùng cho', 'Used for'), '1', '2', '3'],
          [
            ['〜人 (にん)', l('người', 'people'), 'ひとり', 'ふたり', 'さんにん'],
            ['〜枚 (まい)', l('vật mỏng, phẳng: giấy, áo, vé', 'flat things: paper, shirts, tickets'), 'いちまい', 'にまい', 'さんまい'],
            ['〜本 (ほん)', l('vật dài: bút, chai, cây', 'long things: pens, bottles, trees'), 'いっぽん', 'にほん', 'さんぼん'],
            ['〜匹 (ひき)', l('động vật nhỏ', 'small animals'), 'いっぴき', 'にひき', 'さんびき'],
            ['〜冊 (さつ)', l('sách, vở', 'books'), 'いっさつ', 'にさつ', 'さんさつ'],
            ['〜台 (だい)', l('máy móc, xe cộ', 'machines, vehicles'), 'いちだい', 'にだい', 'さんだい'],
            ['〜個 (こ)', l('vật nhỏ', 'small objects'), 'いっこ', 'にこ', 'さんこ'],
            ['〜杯 (はい)', l('cốc, chén, bát', 'cups, glasses, bowls'), 'いっぱい', 'にはい', 'さんばい'],
            ['〜回 (かい)', l('số lần', 'times'), 'いっかい', 'にかい', 'さんかい'],
            ['〜歳 (さい)', l('tuổi', 'years of age'), 'いっさい', 'にさい', 'さんさい'],
          ],
        ),
        examples: [
          ex('りんごを**三つ**買いました。', 'Tôi đã mua ba quả táo.', 'I bought three apples.', 'Ringo o mittsu kaimashita.'),
          ex('家族は**四人**です。', 'Gia đình tôi có bốn người.', 'There are four people in my family.', 'Kazoku wa yonin desu.'),
          ex('切手を**五枚**ください。', 'Cho tôi năm con tem.', 'Five stamps, please.', 'Kitte o gomai kudasai.'),
          ex('ビールを**二本**飲みました。', 'Tôi đã uống hai chai bia.', 'I drank two bottles of beer.', 'Bīru o nihon nomimashita.'),
        ],
      },
    ],
    tips: [
      l('Chú ý biến âm: số 1, 6, 8, 10 hay thêm **っ** (いっぽん, ろっぽん, はっぽん, じゅっぽん) và h đổi thành b / p (さんぼん).', 'Watch the sound changes: 1, 6, 8 and 10 often take **っ** (いっぽん, ろっぽん, はっぽん, じゅっぽん), and h turns into b / p (さんぼん).'),
      l('Không biết dùng trợ số từ nào thì dùng **〜つ** (tối đa 10) cho đồ vật.', 'When unsure, count objects with **〜つ** (up to ten).'),
    ],
  },
  {
    id: 'time-dates',
    level: 'A1',
    title: l('Giờ, thứ, ngày tháng', 'Time, days and dates'),
    summary: l('Nói giờ (〜時〜分), các thứ trong tuần, tháng và ngày với những cách đọc đặc biệt.', 'Telling the time (〜時〜分), weekdays, months and dates with their irregular readings.'),
    sections: [
      {
        title: l('Giờ và phút', 'Hours and minutes'),
        body: l(
          '**〜時 (じ)** = giờ, **〜分 (ふん / ぷん)** = phút, **半 (はん)** = rưỡi, **午前 (ごぜん)** = buổi sáng (AM), **午後 (ごご)** = buổi chiều (PM).',
          '**〜時 (ji)** = o\'clock, **〜分 (fun / pun)** = minutes, **半 (han)** = half past, **午前 (gozen)** = a.m., **午後 (gogo)** = p.m.',
        ),
        table: table(
          [l('Giờ', 'Hour'), l('Cách đọc', 'Reading'), l('Phút', 'Minutes'), l('Cách đọc', 'Reading')],
          [
            ['4時', 'よじ', '1分', 'いっぷん'],
            ['7時', 'しちじ', '3分', 'さんぷん'],
            ['9時', 'くじ', '5分', 'ごふん'],
            ['10時', 'じゅうじ', '10分', 'じゅっぷん'],
            ['12時', 'じゅうにじ', '30分', 'さんじゅっぷん'],
          ],
        ),
        examples: [
          ex('今、**何時**ですか。― **午後3時半**です。', 'Bây giờ là mấy giờ? ― 3 giờ rưỡi chiều.', 'What time is it now? ― Half past three in the afternoon.', 'Ima, nanji desu ka. ― Gogo sanji han desu.'),
          ex('毎朝**6時15分**に起きます。', 'Mỗi sáng tôi dậy lúc 6 giờ 15.', 'I get up at 6:15 every morning.', 'Maiasa rokuji jūgofun ni okimasu.'),
        ],
      },
      {
        title: l('Thứ trong tuần', 'Days of the week'),
        table: table(
          [l('Thứ', 'Day'), l('Tiếng Nhật', 'Japanese'), l('Cách đọc', 'Reading')],
          [
            [l('Thứ Hai', 'Monday'), '月曜日', 'げつようび'],
            [l('Thứ Ba', 'Tuesday'), '火曜日', 'かようび'],
            [l('Thứ Tư', 'Wednesday'), '水曜日', 'すいようび'],
            [l('Thứ Năm', 'Thursday'), '木曜日', 'もくようび'],
            [l('Thứ Sáu', 'Friday'), '金曜日', 'きんようび'],
            [l('Thứ Bảy', 'Saturday'), '土曜日', 'どようび'],
            [l('Chủ nhật', 'Sunday'), '日曜日', 'にちようび'],
          ],
        ),
      },
      {
        title: l('Tháng và ngày', 'Months and dates'),
        body: l(
          'Tháng = số + **月 (がつ)**: 1月 いちがつ… Chú ý **4月 しがつ, 7月 しちがつ, 9月 くがつ**. Ngày = số + **日 (にち)**, nhưng ngày 1–10, 14, 20 và 24 có cách đọc riêng.',
          'Months are number + **月 (gatsu)**: 1月 ichigatsu… Note **4月 shigatsu, 7月 shichigatsu, 9月 kugatsu**. Dates are number + **日 (nichi)**, but the 1st–10th, 14th, 20th and 24th are irregular.',
        ),
        table: table(
          [l('Ngày', 'Date'), l('Cách đọc', 'Reading'), l('Ngày', 'Date'), l('Cách đọc', 'Reading')],
          [
            ['1日', 'ついたち', '6日', 'むいか'],
            ['2日', 'ふつか', '7日', 'なのか'],
            ['3日', 'みっか', '8日', 'ようか'],
            ['4日', 'よっか', '9日', 'ここのか'],
            ['5日', 'いつか', '10日', 'とおか'],
            ['14日', 'じゅうよっか', '20日', 'はつか'],
            ['24日', 'にじゅうよっか', '11日', 'じゅういちにち'],
          ],
        ),
        examples: [ex('誕生日は**5月3日**です。', 'Sinh nhật tôi là ngày 3 tháng 5.', 'My birthday is on 3 May.', 'Tanjōbi wa gogatsu mikka desu.')],
      },
    ],
    tips: [l('Ngày tháng viết theo thứ tự **năm → tháng → ngày**: 2025年8月20日.', 'Dates are written **year → month → day**: 2025年8月20日.')],
  },
  {
    id: 'i-adjectives',
    level: 'A1',
    title: l('Tính từ đuôi い', 'い-adjectives'),
    summary: l('Tính từ tận cùng bằng い, tự chia phủ định và quá khứ.', 'Adjectives ending in い that conjugate for negative and past.'),
    sections: [
      {
        body: l(
          'Tính từ đuôi い (高い, 大きい, おいしい…) **tự chia** bằng cách thay đuôi い. です phía sau chỉ để thêm lịch sự.',
          'い-adjectives (高い, 大きい, おいしい…) **conjugate themselves** by changing the final い. The です after them only adds politeness.',
        ),
        table: table(
          [FORM, RULE, l('高い (đắt)', '高い (expensive)'), l('いい (tốt)', 'いい (good)')],
          [
            [l('Hiện tại', 'Present'), '〜い です', '高い です', 'いい です'],
            [l('Phủ định', 'Negative'), '〜**くない** です', '高**くない** です', '**よくない** です'],
            [l('Quá khứ', 'Past'), '〜**かった** です', '高**かった** です', '**よかった** です'],
            [l('Quá khứ phủ định', 'Past negative'), '〜**くなかった** です', '高**くなかった** です', '**よくなかった** です'],
          ],
        ),
      },
      {
        title: l('Bổ nghĩa cho danh từ', 'Before a noun'),
        body: l('Đặt tính từ **trước** danh từ và giữ nguyên い: 高い山 (núi cao), おいしいりんご (táo ngon).', 'Put the adjective **before** the noun and keep the い: 高い山 (a high mountain).'),
        examples: [
          ex('このラーメンは**おいしい**です。', 'Món ramen này ngon.', 'This ramen is delicious.', 'Kono rāmen wa oishii desu.'),
          ex('きのうは**寒かった**です。', 'Hôm qua trời lạnh.', 'It was cold yesterday.', 'Kinō wa samukatta desu.'),
          ex('この本はあまり**おもしろくない**です。', 'Quyển sách này không thú vị lắm.', 'This book is not very interesting.', 'Kono hon wa amari omoshirokunai desu.'),
          ex('旅行は**楽しかった**です。', 'Chuyến du lịch rất vui.', 'The trip was fun.', 'Ryokō wa tanoshikatta desu.'),
          ex('**大きい**かばんがほしいです。', 'Tôi muốn có một cái cặp to.', 'I want a big bag.', 'Ōkii kaban ga hoshii desu.'),
        ],
      },
      {
        title: l('Nối hai tính từ', 'Joining two adjectives'),
        body: l('Đổi い thành **くて** để nối: 安**くて**おいしい (rẻ và ngon).', 'Change い to **くて** to join them: 安**くて**おいしい (cheap and tasty).'),
      },
      {
        title: l('Tính từ thông dụng', 'Common adjectives'),
        table: table(
          [l('Tính từ', 'Adjective'), MEANING, l('Tính từ', 'Adjective'), MEANING],
          [
            ['大きい', l('to', 'big'), '小さい', l('nhỏ', 'small')],
            ['高い', l('cao; đắt', 'tall; expensive'), '安い', l('rẻ', 'cheap')],
            ['新しい', l('mới', 'new'), '古い', l('cũ', 'old')],
            ['暑い', l('nóng (thời tiết)', 'hot (weather)'), '寒い', l('lạnh (thời tiết)', 'cold (weather)')],
            ['おいしい', l('ngon', 'tasty'), 'まずい', l('dở', 'bad-tasting')],
            ['おもしろい', l('thú vị', 'interesting'), 'つまらない', l('chán', 'boring')],
            ['忙しい', l('bận', 'busy'), '楽しい', l('vui', 'fun')],
            ['近い', l('gần', 'near'), '遠い', l('xa', 'far')],
          ],
        ),
      },
    ],
    tips: [
      l('Lỗi hay gặp: **không** nói "高いでした". Quá khứ là 高**かった**です.', 'Common mistake: **not** "高いでした". The past is 高**かった**です.'),
      l('**いい** (tốt) chia theo gốc **よ-**: よくない, よかった.', '**いい** (good) conjugates from **よ-**: よくない, よかった.'),
      l('きれい (đẹp) và きらい (ghét) tận cùng bằng い nhưng là **tính từ đuôi な**.', 'きれい (pretty) and きらい (disliked) end in い but are **な-adjectives**.'),
    ],
  },
  {
    id: 'na-adjectives',
    level: 'A1',
    title: l('Tính từ đuôi な', 'な-adjectives'),
    summary: l('Tính từ chia giống danh từ và cần な khi đứng trước danh từ.', 'Adjectives that conjugate like nouns and need な before a noun.'),
    sections: [
      {
        body: l(
          'Tính từ đuôi な (静か, 元気, 有名, 好き…) **chia giống danh từ + です**. Khi đứng trước danh từ thì thêm **な**.',
          'な-adjectives (静か, 元気, 有名, 好き…) **conjugate like noun + です**. Before a noun, add **な**.',
        ),
        table: table(
          [FORM, RULE, l('静か (yên tĩnh)', '静か (quiet)')],
          [
            [l('Hiện tại', 'Present'), '〜 です', '静か**です**'],
            [l('Phủ định', 'Negative'), '〜 じゃありません', '静か**じゃありません**'],
            [l('Quá khứ', 'Past'), '〜 でした', '静か**でした**'],
            [l('Quá khứ phủ định', 'Past negative'), '〜 じゃありませんでした', '静か**じゃありませんでした**'],
            [l('Trước danh từ', 'Before a noun'), '〜 **な** + N', '静か**な**町'],
            [l('Nối câu', 'Joining'), '〜 **で**', '静か**で**きれい'],
          ],
        ),
        examples: [
          ex('この町は**静か**です。', 'Thị trấn này yên tĩnh.', 'This town is quiet.', 'Kono machi wa shizuka desu.'),
          ex('富士山は**有名な**山です。', 'Núi Phú Sĩ là ngọn núi nổi tiếng.', 'Mount Fuji is a famous mountain.', 'Fujisan wa yūmei na yama desu.'),
          ex('きのうは**ひまじゃありませんでした**。', 'Hôm qua tôi không rảnh.', 'I wasn\'t free yesterday.', 'Kinō wa hima ja arimasen deshita.'),
          ex('この部屋は**きれいで**、広いです。', 'Căn phòng này sạch đẹp và rộng.', 'This room is clean and spacious.', 'Kono heya wa kirei de, hiroi desu.'),
        ],
      },
      {
        title: l('Tính từ thông dụng', 'Common adjectives'),
        table: table(
          [l('Tính từ', 'Adjective'), MEANING, l('Tính từ', 'Adjective'), MEANING],
          [
            ['きれい', l('đẹp; sạch', 'pretty; clean'), '静か', l('yên tĩnh', 'quiet')],
            ['にぎやか', l('náo nhiệt', 'lively'), '有名', l('nổi tiếng', 'famous')],
            ['元気', l('khoẻ', 'healthy, well'), 'ひま', l('rảnh', 'free')],
            ['好き', l('thích', 'liked'), 'きらい', l('ghét', 'disliked')],
            ['上手', l('giỏi', 'good at'), '下手', l('kém', 'bad at')],
            ['便利', l('tiện lợi', 'convenient'), '親切', l('tử tế', 'kind')],
          ],
        ),
      },
    ],
    tips: [l('Với 好き và きらい, đối tượng dùng **が**: 私は音楽**が**好きです.', 'With 好き and きらい the object takes **が**: 私は音楽**が**好きです.')],
  },
  {
    id: 'verb-groups',
    level: 'A1',
    title: l('Ba nhóm động từ', 'The three verb groups'),
    summary: l('Cách nhận biết nhóm 1, nhóm 2 và nhóm 3 — nền tảng của mọi cách chia động từ.', 'How to tell groups 1, 2 and 3 apart — the basis of every conjugation.'),
    sections: [
      {
        table: table(
          [GROUP, l('Nhận biết', 'How to spot it'), l('Ví dụ', 'Examples')],
          [
            [
              l('Nhóm 1 (động từ う)', 'Group 1 (u-verbs)'),
              l('Thể từ điển tận cùng bằng âm **-u**: う, く, ぐ, す, つ, ぬ, ぶ, む, る (trừ nhóm 2)', 'Dictionary form ends in a **-u** sound: う, く, ぐ, す, つ, ぬ, ぶ, む, る (except group 2)'),
              '買う, 書く, 泳ぐ, 話す, 待つ, 死ぬ, 遊ぶ, 読む, 帰る',
            ],
            [l('Nhóm 2 (động từ る)', 'Group 2 (ru-verbs)'), l('Tận cùng bằng **-iru** hoặc **-eru**', 'Ends in **-iru** or **-eru**'), '見る, 起きる, 食べる, 寝る, 教える'],
            [l('Nhóm 3 (bất quy tắc)', 'Group 3 (irregular)'), l('Chỉ có **する** và **来る**', 'Only **する** and **来る**'), 'する, 来る, 勉強する, 電話する'],
          ],
        ),
      },
      {
        title: l('Ngoại lệ cần nhớ', 'Exceptions to remember'),
        body: l(
          'Một số động từ tận cùng -iru / -eru nhưng thuộc **nhóm 1**: 帰る (về), 入る (vào), 走る (chạy), 知る (biết), 切る (cắt), 要る (cần).',
          'Some verbs ending in -iru / -eru are actually **group 1**: 帰る (return), 入る (enter), 走る (run), 知る (know), 切る (cut), 要る (need).',
        ),
      },
      {
        title: l('Danh từ + する', 'Noun + する'),
        body: l(
          'Rất nhiều danh từ gốc Hán thêm **する** thành động từ nhóm 3: 勉強する (học), 練習する (luyện tập), 電話する (gọi điện), 結婚する (kết hôn).',
          'Many Sino-Japanese nouns become group 3 verbs with **する**: 勉強する (study), 練習する (practise), 電話する (phone), 結婚する (marry).',
        ),
        examples: [
          ex('毎日日本語を**勉強します**。', 'Mỗi ngày tôi học tiếng Nhật.', 'I study Japanese every day.', 'Mainichi Nihongo o benkyō shimasu.'),
          ex('7時にうちへ**帰ります**。', 'Tôi về nhà lúc 7 giờ. (帰る thuộc nhóm 1)', 'I go home at 7. (帰る is group 1)', 'Shichiji ni uchi e kaerimasu.'),
        ],
      },
    ],
    tips: [l('Từ điển thường ghi **godan** (nhóm 1) và **ichidan** (nhóm 2).', 'Dictionaries label verbs **godan** (group 1) or **ichidan** (group 2).')],
  },
  {
    id: 'masu-form',
    level: 'A1',
    title: l('Thể ます (lịch sự)', 'The polite ます form'),
    summary: l('ます, ません, ました, ませんでした: hiện tại, phủ định, quá khứ.', 'ます, ません, ました, ませんでした: present, negative, past.'),
    sections: [
      {
        title: l('Cách tạo thể ます', 'Making the ます form'),
        table: table(
          [GROUP, RULE, EXAMPLE],
          [
            [G1, l('Đổi âm cuối -u → **-i** rồi thêm ます', 'Change the final -u to **-i**, then add ます'), '書く → 書**き**ます, 飲む → 飲**み**ます, 買う → 買**い**ます'],
            [G2, l('Bỏ る, thêm ます', 'Drop る, add ます'), '食べる → 食べます, 見る → 見ます'],
            [G3, l('Học thuộc', 'Memorise'), 'する → します, 来る → 来(き)ます'],
          ],
        ),
      },
      {
        title: l('Bốn dạng cơ bản', 'The four basic forms'),
        table: table(
          [FORM, l('Đuôi', 'Ending'), l('飲む (uống)', '飲む (drink)')],
          [
            [l('Hiện tại / tương lai', 'Present / future'), '〜ます', '飲みます'],
            [l('Phủ định', 'Negative'), '〜ません', '飲みません'],
            [l('Quá khứ', 'Past'), '〜ました', '飲みました'],
            [l('Quá khứ phủ định', 'Past negative'), '〜ませんでした', '飲みませんでした'],
          ],
        ),
      },
      {
        body: l(
          'Tiếng Nhật **không có thì tương lai riêng**: 〜ます dùng cho cả thói quen hiện tại lẫn việc sắp làm.',
          'Japanese has **no separate future tense**: 〜ます covers both habits and things you are going to do.',
        ),
        examples: [
          ex('毎日コーヒーを**飲みます**。', 'Mỗi ngày tôi uống cà phê.', 'I drink coffee every day.', 'Mainichi kōhī o nomimasu.'),
          ex('あした、映画を**見ます**。', 'Ngày mai tôi sẽ xem phim.', 'I\'ll watch a film tomorrow.', 'Ashita, eiga o mimasu.'),
          ex('お酒を**飲みません**。', 'Tôi không uống rượu.', 'I don\'t drink alcohol.', 'Osake o nomimasen.'),
          ex('きのう、友だちに**会いました**。', 'Hôm qua tôi đã gặp bạn.', 'I met a friend yesterday.', 'Kinō, tomodachi ni aimashita.'),
          ex('けさは何も**食べませんでした**。', 'Sáng nay tôi không ăn gì cả.', 'I didn\'t eat anything this morning.', 'Kesa wa nani mo tabemasen deshita.'),
        ],
      },
    ],
    tips: [
      l(
        'Phần đứng trước ます (書き, 食べ, し) gọi là **gốc động từ**, dùng trong rất nhiều mẫu: 〜たい, 〜ましょう, 〜に行きます, 〜ながら.',
        'The part before ます (書き, 食べ, し) is the **verb stem**, used in many patterns: 〜たい, 〜ましょう, 〜に行きます, 〜ながら.',
      ),
    ],
  },
  {
    id: 'frequency-adverbs',
    level: 'A1',
    title: l('Trạng từ tần suất, もう và まだ', 'Frequency adverbs, もう and まだ'),
    summary: l('いつも, よく, ときどき, あまり〜ない, ぜんぜん〜ない; もう (đã… rồi) và まだ (vẫn / chưa).', 'いつも, よく, ときどき, あまり〜ない, ぜんぜん〜ない; もう (already) and まだ (still / not yet).'),
    sections: [
      {
        table: table(
          [l('Trạng từ', 'Adverb'), MEANING, l('Động từ đi kèm', 'Verb form')],
          [
            ['いつも', l('luôn luôn', 'always'), l('khẳng định', 'affirmative')],
            ['よく', l('thường', 'often'), l('khẳng định', 'affirmative')],
            ['ときどき', l('thỉnh thoảng', 'sometimes'), l('khẳng định', 'affirmative')],
            ['あまり', l('không … lắm', 'not very / not often'), l('**phủ định**', '**negative**')],
            ['ぜんぜん', l('hoàn toàn không', 'not at all'), l('**phủ định**', '**negative**')],
          ],
        ),
        examples: [
          ex('**よく**映画を見ます。', 'Tôi thường xem phim.', 'I often watch films.', 'Yoku eiga o mimasu.'),
          ex('**ときどき**料理をします。', 'Thỉnh thoảng tôi nấu ăn.', 'I sometimes cook.', 'Tokidoki ryōri o shimasu.'),
          ex('お酒は**あまり**飲み**ません**。', 'Tôi không uống rượu nhiều lắm.', 'I don\'t drink much alcohol.', 'Osake wa amari nomimasen.'),
          ex('韓国語は**ぜんぜん**分かり**ません**。', 'Tôi hoàn toàn không hiểu tiếng Hàn.', 'I don\'t understand Korean at all.', 'Kankokugo wa zenzen wakarimasen.'),
        ],
      },
      {
        title: l('もう và まだ', 'もう and まだ'),
        bullets: [
          l('**もう** + khẳng định: đã … rồi.', '**もう** + affirmative: already.'),
          l('**まだ** + phủ định: vẫn chưa. Trả lời ngắn: いいえ、まだです.', '**まだ** + negative: not yet. Short answer: いいえ、まだです.'),
          l('**まだ** + khẳng định: vẫn còn. まだ雨が降っています (trời vẫn đang mưa).', '**まだ** + affirmative: still. まだ雨が降っています (it\'s still raining).'),
        ],
        examples: [
          ex('**もう**昼ごはんを食べましたか。― いいえ、**まだ**です。', 'Bạn ăn trưa chưa? ― Chưa.', 'Have you had lunch yet? ― Not yet.', 'Mō hirugohan o tabemashita ka. ― Iie, mada desu.'),
          ex('**まだ**宿題をしていません。', 'Tôi vẫn chưa làm bài tập.', 'I haven\'t done my homework yet.', 'Mada shukudai o shite imasen.'),
        ],
      },
    ],
    tips: [l('"Chưa làm" nói là **まだ〜ていません**, không dùng 〜ませんでした (nghĩa là "đã không làm").', 'For "not yet", say **まだ〜ていません**, not 〜ませんでした (which means "didn\'t").')],
  },
  {
    id: 'invitations',
    level: 'A1',
    title: l('Rủ rê và đề nghị: ませんか, ましょう', 'Invitations and suggestions: ませんか, ましょう'),
    summary: l('〜ませんか (… không?), 〜ましょう (cùng … nào), 〜ましょうか (để tôi … nhé?).', '〜ませんか (won\'t you…?), 〜ましょう (let\'s…), 〜ましょうか (shall I / shall we…?).'),
    sections: [
      {
        table: table(
          [PATTERN, MEANING, EXAMPLE],
          [
            ['V-ませんか', l('Mời, rủ lịch sự: "… cùng không?"', 'Polite invitation: "won\'t you…?"'), 'いっしょに昼ごはんを食べ**ませんか**。'],
            ['V-ましょう', l('Đề nghị, hưởng ứng: "cùng … nào"', 'Suggestion: "let\'s…"'), '駅で会い**ましょう**。'],
            ['V-ましょうか', l('Đề nghị giúp hoặc hỏi ý: "để tôi … nhé?"', 'Offer or proposal: "shall I…? / shall we…?"'), '窓を開け**ましょうか**。'],
          ],
        ),
        examples: [
          ex(
            '週末、いっしょに映画を見**ませんか**。― いいですね。見**ましょう**。',
            'Cuối tuần đi xem phim cùng nhau không? ― Hay đấy. Đi xem nhé.',
            'Would you like to see a film this weekend? ― Sounds good. Let\'s.',
            'Shūmatsu, issho ni eiga o mimasen ka. ― Ii desu ne. Mimashō.',
          ),
          ex('ちょっと休み**ましょう**。', 'Nghỉ một chút nào.', 'Let\'s take a short break.', 'Chotto yasumimashō.'),
          ex('荷物を持ち**ましょうか**。― ありがとうございます。', 'Để tôi xách đồ giúp nhé? ― Cảm ơn anh.', 'Shall I carry your bags? ― Thank you.', 'Nimotsu o mochimashō ka. ― Arigatō gozaimasu.'),
        ],
      },
      {
        title: l('Từ chối khéo', 'Declining politely'),
        body: l(
          'Người Nhật hiếm khi nói thẳng "không". Hãy dùng **〜はちょっと…** (… thì hơi…) và bỏ lửng câu.',
          'Japanese people rarely give a flat "no". Use **〜はちょっと…** ("… is a bit…") and let the sentence trail off.',
        ),
        examples: [ex('あしたはちょっと…。', 'Ngày mai thì hơi… (không tiện).', 'Tomorrow is a bit… (difficult).', 'Ashita wa chotto….')],
      },
    ],
    tips: [l('Khi mời người khác, 〜ませんか lịch sự và mềm mỏng hơn 〜ましょう.', 'When inviting someone, 〜ませんか is softer and more polite than 〜ましょう.')],
  },
  {
    id: 'te-form',
    level: 'A1',
    title: l('Thể て', 'The て form'),
    summary: l('Thể quan trọng nhất: nhờ vả (てください), nối các hành động và là gốc của nhiều mẫu câu.', 'The most useful form: requests (てください), linking actions, and the base of many patterns.'),
    sections: [
      {
        title: l('Nhóm 1: chia theo âm cuối', 'Group 1: depends on the last sound'),
        table: table(
          [l('Đuôi', 'Ending'), l('Thành', 'Becomes'), EXAMPLE],
          [
            ['う・つ・る', '**って**', '買う → 買**って**, 待つ → 待**って**, 帰る → 帰**って**'],
            ['む・ぶ・ぬ', '**んで**', '読む → 読**んで**, 遊ぶ → 遊**んで**, 死ぬ → 死**んで**'],
            ['く', '**いて**', '書く → 書**いて**'],
            ['ぐ', '**いで**', '泳ぐ → 泳**いで**'],
            ['す', '**して**', '話す → 話**して**'],
            [l('Ngoại lệ', 'Exception'), '**って**', '行く → 行**って**'],
          ],
        ),
      },
      {
        title: l('Nhóm 2 và nhóm 3', 'Groups 2 and 3'),
        bullets: [
          l('Nhóm 2: bỏ る, thêm **て**: 食べる → 食べ**て**, 見る → 見**て**.', 'Group 2: drop る, add **て**: 食べる → 食べ**て**, 見る → 見**て**.'),
          l('Nhóm 3: する → **して**, 来る → **来て (きて)**.', 'Group 3: する → **して**, 来る → **来て (kite)**.'),
        ],
      },
      {
        title: l('Nhờ vả: 〜てください', 'Requests: 〜てください'),
        examples: [
          ex('ちょっと**待ってください**。', 'Xin chờ một chút.', 'Please wait a moment.', 'Chotto matte kudasai.'),
          ex('もう一度**言ってください**。', 'Xin nói lại một lần nữa.', 'Please say it again.', 'Mō ichido itte kudasai.'),
          ex('ここに名前を**書いてください**。', 'Hãy viết tên vào đây.', 'Please write your name here.', 'Koko ni namae o kaite kudasai.'),
        ],
      },
      {
        title: l('Nối các hành động theo thứ tự', 'Linking actions in order'),
        body: l(
          '**V1 て、V2 て、V3 ます**: làm V1, rồi V2, rồi V3. Thì của cả câu do **động từ cuối** quyết định.',
          '**V1 て、V2 て、V3 ます**: do V1, then V2, then V3. The **last verb** sets the tense of the whole sentence.',
        ),
        examples: [
          ex('朝起き**て**、シャワーを浴び**て**、会社へ行きます。', 'Buổi sáng tôi dậy, tắm rồi đi làm.', 'In the morning I get up, shower and go to work.', 'Asa okite, shawā o abite, kaisha e ikimasu.'),
          ex('きのうは渋谷へ行っ**て**、買い物しました。', 'Hôm qua tôi đến Shibuya và mua sắm.', 'Yesterday I went to Shibuya and did some shopping.', 'Kinō wa Shibuya e itte, kaimono shimashita.'),
          ex('手を洗っ**てから**、食べます。', 'Rửa tay xong rồi mới ăn.', 'I eat after washing my hands.', 'Te o aratte kara, tabemasu.'),
        ],
      },
    ],
    tips: [
      l(
        'Đọc thành nhịp như một câu hát: "う つ る って, む ぶ ぬ んで, く いて, ぐ いで, す して, 行く 行って" — rất nhiều người học nhớ quy tắc theo cách này.',
        'Chant it like a song: "う つ る って, む ぶ ぬ んで, く いて, ぐ いで, す して, 行く 行って" — many learners memorise the rules this way.',
      ),
    ],
  },
  {
    id: 'te-iru',
    level: 'A1',
    title: l('〜ています', '〜ています'),
    summary: l('Đang làm gì đó, trạng thái kéo dài, thói quen và nghề nghiệp.', 'Actions in progress, ongoing states, habits and jobs.'),
    sections: [
      {
        table: table(
          [USE, EXAMPLE, MEANING],
          [
            [l('Đang diễn ra', 'In progress'), '今、雨が降っ**ています**。', l('Bây giờ trời đang mưa.', 'It is raining now.')],
            [l('Trạng thái (kết quả của hành động)', 'State (result of an action)'), '結婚し**ています**。', l('Tôi đã có gia đình.', 'I am married.')],
            [l('Thói quen, nghề nghiệp', 'Habit, job'), '銀行で働い**ています**。', l('Tôi làm việc ở ngân hàng.', 'I work at a bank.')],
          ],
        ),
      },
      {
        title: l('Động từ chỉ trạng thái', 'State verbs'),
        body: l(
          'Với các động từ như 住む (sống), 知る (biết), 持つ (có, cầm), 結婚する (kết hôn), 〜ています diễn tả **trạng thái hiện tại**, không phải "đang làm".',
          'With verbs such as 住む (live), 知る (know), 持つ (have, hold) and 結婚する (marry), 〜ています describes a **current state**, not an action in progress.',
        ),
        examples: [
          ex('大阪に**住んでいます**。', 'Tôi sống ở Osaka.', 'I live in Osaka.', 'Ōsaka ni sunde imasu.'),
          ex(
            '田中さんの電話番号を**知っていますか**。― いいえ、**知りません**。',
            'Bạn có biết số điện thoại của anh Tanaka không? ― Không, tôi không biết.',
            'Do you know Mr Tanaka\'s phone number? ― No, I don\'t.',
            'Tanaka-san no denwa bangō o shitte imasu ka. ― Iie, shirimasen.',
          ),
          ex('子どもたちは公園で**遊んでいます**。', 'Bọn trẻ đang chơi ở công viên.', 'The children are playing in the park.', 'Kodomotachi wa kōen de asonde imasu.'),
          ex('窓が**開いています**。', 'Cửa sổ đang mở.', 'The window is open.', 'Mado ga aite imasu.'),
        ],
      },
    ],
    tips: [
      l('Phủ định của 知っています là **知りません**, không phải "知っていません".', 'The negative of 知っています is **知りません**, not "知っていません".'),
      l('Văn nói thường bỏ い: 食べ**てる**, 知っ**てる**.', 'Casual speech often drops the い: 食べ**てる**, 知っ**てる**.'),
    ],
  },
  {
    id: 'permission',
    level: 'A1',
    title: l('Cho phép và cấm đoán', 'Permission and prohibition'),
    summary: l('〜てもいいです (được phép), 〜てもいいですか (xin phép), 〜てはいけません (cấm).', '〜てもいいです (may), 〜てもいいですか (may I?), 〜てはいけません (must not).'),
    sections: [
      {
        table: table(
          [PATTERN, MEANING],
          [
            ['V-て**もいいです**', l('được phép làm V', 'you may do V')],
            ['V-て**もいいですか**', l('tôi làm V có được không?', 'may I do V?')],
            ['V-て**はいけません**', l('không được làm V (cấm)', 'you must not do V')],
          ],
        ),
        examples: [
          ex('写真を撮っ**てもいいですか**。― ええ、いいですよ。', 'Tôi chụp ảnh được không? ― Vâng, được chứ.', 'May I take a photo? ― Sure, go ahead.', 'Shashin o tottemo ii desu ka. ― Ee, ii desu yo.'),
          ex('窓を開け**てもいいですか**。― すみません、ちょっと…。', 'Tôi mở cửa sổ được không? ― Xin lỗi, hơi…', 'May I open the window? ― Sorry, I\'d rather you didn\'t.', 'Mado o aketemo ii desu ka. ― Sumimasen, chotto….'),
          ex('ここでたばこを吸っ**てはいけません**。', 'Không được hút thuốc ở đây.', 'You must not smoke here.', 'Koko de tabako o sutte wa ikemasen.'),
        ],
      },
      {
        title: l('Văn nói', 'Casual speech'),
        body: l('Bạn bè thường nói **〜てもいい?** và **〜ちゃだめ** (= 〜てはだめ).', 'Friends say **〜てもいい?** and **〜ちゃだめ** (= 〜てはだめ).'),
        examples: [ex('これ、食べてもいい？― だめ！', 'Cái này ăn được không? ― Không được!', 'Can I eat this? ― No!', 'Kore, tabetemo ii? ― Dame!')],
      },
    ],
    tips: [l('〜てはいけません nghe khá nặng (luật lệ, cấm đoán). Khi từ chối người khác, dùng **すみません、ちょっと…** cho nhẹ nhàng.', '〜てはいけません sounds strong (rules, bans). To turn someone down gently, say **すみません、ちょっと…**.')],
  },
  {
    id: 'nai-form',
    level: 'A1',
    title: l('Thể ない', 'The ない form'),
    summary: l('Phủ định thông thường, và các mẫu ないでください, なければなりません, なくてもいいです.', 'The plain negative, plus ないでください, なければなりません and なくてもいいです.'),
    sections: [
      {
        title: l('Cách chia', 'How to form it'),
        table: table(
          [GROUP, RULE, EXAMPLE],
          [
            [G1, l('-u → **-a** + ない (riêng う → **わ**ない)', '-u → **-a** + ない (but う → **わ**ない)'), '書く → 書**か**ない, 飲む → 飲**ま**ない, 買う → 買**わ**ない'],
            [G2, l('Bỏ る + ない', 'Drop る + ない'), '食べる → 食べない, 見る → 見ない'],
            [G3, IRREGULAR, 'する → しない, 来る → 来(こ)ない'],
            [l('Đặc biệt', 'Special'), 'ある', '→ **ない**'],
          ],
        ),
      },
      {
        title: l('Ba mẫu câu thông dụng', 'Three useful patterns'),
        table: table(
          [PATTERN, MEANING, EXAMPLE],
          [
            ['V-ない**でください**', l('xin đừng làm V', 'please don\'t do V'), 'ここに車を止め**ないでください**。'],
            ['V-な**ければなりません**', l('phải làm V', 'must do V'), '薬を飲ま**なければなりません**。'],
            ['V-な**くてもいいです**', l('không cần làm V', 'don\'t have to do V'), 'あしたは来**なくてもいいです**。'],
          ],
        ),
        examples: [
          ex('心配し**ないでください**。', 'Xin đừng lo lắng.', 'Please don\'t worry.', 'Shinpai shinaide kudasai.'),
          ex('毎日、日本語を勉強し**なければなりません**。', 'Mỗi ngày tôi phải học tiếng Nhật.', 'I have to study Japanese every day.', 'Mainichi, Nihongo o benkyō shinakereba narimasen.'),
          ex('靴を脱が**なくてもいいです**。', 'Không cần cởi giày.', 'You don\'t have to take your shoes off.', 'Kutsu o nuganakute mo ii desu.'),
        ],
      },
    ],
    tips: [l('Văn nói rút gọn 〜なければならない thành **〜なきゃ** hoặc 〜なくちゃ: もう帰らなきゃ (phải về thôi).', 'Casual speech shortens 〜なければならない to **〜なきゃ** or 〜なくちゃ: もう帰らなきゃ (I have to go home).')],
  },
  {
    id: 'plain-form',
    level: 'A1',
    title: l('Thể thông thường (thể ngắn)', 'Plain (short) forms'),
    summary: l('Thể từ điển, ない, た, なかった: dùng khi nói thân mật và trong rất nhiều mẫu ngữ pháp.', 'Dictionary, ない, た and なかった forms: casual speech and the base of many patterns.'),
    sections: [
      {
        body: l(
          'Mỗi động từ có 4 dạng thông thường tương ứng với 4 dạng ます. Thể **た** chia **giống hệt thể て**, chỉ đổi て → た, で → だ.',
          'Each verb has four plain forms matching the four ます forms. The **た** form follows **exactly the same rules as the て form**: just change て → た and で → だ.',
        ),
        table: table(
          [FORM, '書く', '食べる', 'する', '来る'],
          [
            [l('Từ điển (= 〜ます)', 'Dictionary (= 〜ます)'), '書く', '食べる', 'する', '来(く)る'],
            [l('ない (= 〜ません)', 'ない (= 〜ません)'), '書かない', '食べない', 'しない', '来(こ)ない'],
            [l('た (= 〜ました)', 'た (= 〜ました)'), '書いた', '食べた', 'した', '来(き)た'],
            [l('なかった (= 〜ませんでした)', 'なかった (= 〜ませんでした)'), '書かなかった', '食べなかった', 'しなかった', '来(こ)なかった'],
          ],
        ),
      },
      {
        title: l('Tính từ và danh từ', 'Adjectives and nouns'),
        table: table(
          ['', l('Tính từ い (高い)', 'い-adj (高い)'), l('Tính từ な (静か)', 'な-adj (静か)'), l('Danh từ (雨)', 'Noun (雨)')],
          [
            [l('Hiện tại', 'Present'), '高い', '静か**だ**', '雨**だ**'],
            [l('Phủ định', 'Negative'), '高くない', '静か**じゃない**', '雨**じゃない**'],
            [l('Quá khứ', 'Past'), '高かった', '静か**だった**', '雨**だった**'],
            [l('Quá khứ phủ định', 'Past negative'), '高くなかった', '静か**じゃなかった**', '雨**じゃなかった**'],
          ],
        ),
      },
      {
        title: l('Hội thoại thân mật', 'Casual conversation'),
        body: l('Với bạn bè, người Nhật bỏ です / ます, lược bớt trợ từ, và thường bỏ だ trong câu hỏi.', 'With friends, people drop です / ます, leave out many particles, and usually drop だ in questions.'),
        examples: [
          ex('あした、ひま？― うん、ひま**だ**よ。', 'Mai rảnh không? ― Ừ, rảnh.', 'Free tomorrow? ― Yeah, I am.', 'Ashita, hima? ― Un, hima da yo.'),
          ex('もう昼ごはん**食べた**？― ううん、まだ。', 'Ăn trưa chưa? ― Chưa.', 'Had lunch yet? ― No, not yet.', 'Mō hirugohan tabeta? ― Uun, mada.'),
          ex('きのう、どこ**行った**？', 'Hôm qua đi đâu thế?', 'Where did you go yesterday?', 'Kinō, doko itta?'),
        ],
      },
    ],
    tips: [l('Đừng dùng thể thông thường với người lớn tuổi, cấp trên hay người mới quen.', 'Do not use plain forms with older people, superiors or people you have just met.')],
  },
  {
    id: 'tai-hoshii',
    level: 'A1',
    title: l('Mong muốn: 〜たい, ほしい', 'Wants: 〜たい and ほしい'),
    summary: l('〜たいです: muốn làm gì; N がほしいです: muốn có cái gì.', '〜たいです: want to do; N がほしいです: want to have something.'),
    sections: [
      {
        title: l('V-たい: muốn làm', 'Verb stem + たい: want to do'),
        body: l(
          'Gốc động từ (bỏ ます) + **たい**. 〜たい chia giống **tính từ đuôi い**: 〜たくない, 〜たかった.',
          'Verb stem + **たい**. 〜たい conjugates like an **い-adjective**: 〜たくない, 〜たかった.',
        ),
        examples: [
          ex('日本へ**行きたい**です。', 'Tôi muốn đi Nhật.', 'I want to go to Japan.', 'Nihon e ikitai desu.'),
          ex('何が**食べたい**ですか。― すしが**食べたい**です。', 'Bạn muốn ăn gì? ― Tôi muốn ăn sushi.', 'What do you want to eat? ― I want sushi.', 'Nani ga tabetai desu ka. ― Sushi ga tabetai desu.'),
          ex('今日はどこへも**行きたくない**です。', 'Hôm nay tôi không muốn đi đâu cả.', 'I don\'t want to go anywhere today.', 'Kyō wa doko e mo ikitakunai desu.'),
        ],
      },
      {
        title: l('N が ほしい: muốn có', 'N が ほしい: want something'),
        body: l('**ほしい** là tính từ đuôi い; thứ mình muốn có đi với **が**.', '**ほしい** is an い-adjective; the thing you want takes **が**.'),
        examples: [
          ex('新しいパソコン**がほしい**です。', 'Tôi muốn có máy tính mới.', 'I want a new computer.', 'Atarashii pasokon ga hoshii desu.'),
          ex('今、何**がほしい**ですか。', 'Bây giờ bạn muốn có gì?', 'What do you want right now?', 'Ima, nani ga hoshii desu ka.'),
        ],
      },
      {
        title: l('Nói về người khác', 'Talking about other people'),
        body: l(
          '〜たい và ほしい chỉ dùng cho **bản thân** (hoặc để hỏi người nghe). Nói về người thứ ba dùng **〜たがっています / ほしがっています**.',
          '〜たい and ほしい are for **yourself** (or for asking the listener). For a third person, use **〜たがっています / ほしがっています**.',
        ),
        examples: [ex('弟は犬を**ほしがっています**。', 'Em trai tôi muốn có một con chó.', 'My younger brother wants a dog.', 'Otōto wa inu o hoshigatte imasu.')],
      },
    ],
    tips: [l('Đừng mời cấp trên bằng 〜たいですか vì nghe đường đột; hãy dùng **〜ませんか**.', 'Don\'t invite a superior with 〜たいですか; it sounds blunt. Use **〜ませんか**.')],
  },
  {
    id: 'comparison',
    level: 'A1',
    title: l('So sánh', 'Comparisons'),
    summary: l('AはBより〜, BよりAのほうが〜, và so sánh nhất 〜の中で〜がいちばん〜.', 'AはBより〜, BよりAのほうが〜 and superlatives with いちばん.'),
    sections: [
      {
        table: table(
          [PATTERN, MEANING],
          [
            ['A は B **より** Adj', l('A … hơn B', 'A is more Adj than B')],
            ['A と B と **どちら**が Adj ですか', l('A và B, cái nào … hơn?', 'Which is more Adj, A or B?')],
            ['B **より** A **のほうが** Adj', l('A … hơn B (câu trả lời)', 'A is more Adj than B (answer)')],
            ['N **の中で** X が **いちばん** Adj', l('Trong N, X là … nhất', 'Of all N, X is the most Adj')],
          ],
        ),
        examples: [
          ex('東京**は**大阪**より**大きいです。', 'Tokyo lớn hơn Osaka.', 'Tokyo is bigger than Osaka.', 'Tōkyō wa Ōsaka yori ōkii desu.'),
          ex(
            'コーヒーと紅茶と**どちら**が好きですか。― 紅茶**のほうが**好きです。',
            'Cà phê và trà, bạn thích cái nào hơn? ― Tôi thích trà hơn.',
            'Which do you like better, coffee or tea? ― I prefer tea.',
            'Kōhī to kōcha to dochira ga suki desu ka. ― Kōcha no hō ga suki desu.',
          ),
          ex(
            '果物**の中で**何が**いちばん**好きですか。― いちごが**いちばん**好きです。',
            'Trong các loại hoa quả, bạn thích gì nhất? ― Tôi thích dâu tây nhất.',
            'Which fruit do you like best? ― I like strawberries best.',
            'Kudamono no naka de nani ga ichiban suki desu ka. ― Ichigo ga ichiban suki desu.',
          ),
          ex('日本で**いちばん**高い山は富士山です。', 'Ngọn núi cao nhất Nhật Bản là núi Phú Sĩ.', 'The highest mountain in Japan is Mount Fuji.', 'Nihon de ichiban takai yama wa Fujisan desu.'),
        ],
      },
      {
        title: l('Bằng nhau và không bằng', 'Equal and not as… as'),
        bullets: [
          l('**同じくらい**: bằng nhau: 兄と同じくらい背が高いです (cao bằng anh trai).', '**同じくらい**: about the same: 兄と同じくらい背が高いです (as tall as my brother).'),
          l('A は B **ほど** Adj-**ない**: A không … bằng B: 今日はきのう**ほど**寒く**ない**です.', 'A は B **ほど** Adj-**ない**: A is not as Adj as B: 今日はきのう**ほど**寒く**ない**です.'),
        ],
      },
    ],
    tips: [l('Tính từ tiếng Nhật **không đổi dạng** khi so sánh: より, ほう và いちばん làm hết nhiệm vụ.', 'Japanese adjectives **do not change** in comparisons (no "-er / -est"): より, ほう and いちばん do the work.')],
  },
  {
    id: 'naru',
    level: 'A1',
    title: l('Trở nên: 〜くなる, 〜になる', 'Becoming: 〜くなる and 〜になる'),
    summary: l('Diễn tả sự thay đổi với tính từ và danh từ; 〜くする / 〜にする: làm cho.', 'Describing change with adjectives and nouns; 〜くする / 〜にする: making something so.'),
    sections: [
      {
        table: table(
          [l('Loại từ', 'Word type'), RULE, EXAMPLE],
          [
            [l('Tính từ い', 'い-adjective'), '〜い → 〜**くなる**', '寒い → 寒**くなる**'],
            [l('Tính từ な', 'な-adjective'), '〜 + **になる**', '元気 → 元気**になる**'],
            [l('Danh từ', 'Noun'), 'N + **になる**', '医者 → 医者**になる**'],
          ],
        ),
        examples: [
          ex('だんだん寒**くなりました**ね。', 'Trời lạnh dần rồi nhỉ.', 'It\'s getting colder, isn\'t it?', 'Dandan samuku narimashita ne.'),
          ex('日本語が上手**になりました**ね。', 'Tiếng Nhật của bạn giỏi lên rồi đấy.', 'Your Japanese has got really good.', 'Nihongo ga jōzu ni narimashita ne.'),
          ex('将来、医者**になりたい**です。', 'Sau này tôi muốn trở thành bác sĩ.', 'I want to become a doctor in the future.', 'Shōrai, isha ni naritai desu.'),
        ],
      },
      {
        title: l('Làm cho: 〜くする, 〜にする', 'Making: 〜くする and 〜にする'),
        body: l(
          'Dùng する thay cho なる khi **có người chủ động gây ra thay đổi**: 部屋をきれい**にします** (dọn phòng sạch sẽ), 音を小さ**くしてください** (vặn nhỏ tiếng).',
          'Use する instead of なる when **someone causes the change**: 部屋をきれい**にします** (tidy the room), 音を小さ**くしてください** (turn the volume down).',
        ),
        examples: [ex('私はコーヒー**にします**。', 'Tôi chọn cà phê. (khi gọi món)', 'I\'ll have coffee. (when ordering)', 'Watashi wa kōhī ni shimasu.')],
      },
    ],
  },
  {
    id: 'potential',
    level: 'A2',
    title: l('Thể khả năng', 'The potential form'),
    summary: l('Có thể làm gì: 〜える / 〜られる và 〜ことができる.', 'Being able to do something: 〜える / 〜られる and 〜ことができる.'),
    sections: [
      {
        table: table(
          [GROUP, RULE, EXAMPLE],
          [
            [G1, l('-u → **-e** + る', '-u → **-e** + る'), '話す → 話**せる**, 書く → 書**ける**, 読む → 読**める**'],
            [G2, l('Bỏ る + **られる**', 'Drop る + **られる**'), '食べる → 食べ**られる**, 見る → 見**られる**'],
            [G3, IRREGULAR, 'する → **できる**, 来る → **来(こ)られる**'],
          ],
        ),
      },
      {
        body: l(
          'Thể khả năng là một động từ **nhóm 2** mới: 話せます, 話せません, 話せました… Đối tượng thường đi với **が** thay cho を.',
          'The potential form is a new **group 2** verb: 話せます, 話せません, 話せました… The object usually takes **が** instead of を.',
        ),
        examples: [
          ex('日本語**が**少し**話せます**。', 'Tôi nói được một chút tiếng Nhật.', 'I can speak a little Japanese.', 'Nihongo ga sukoshi hanasemasu.'),
          ex('漢字が**読めません**。', 'Tôi không đọc được chữ Hán.', 'I can\'t read kanji.', 'Kanji ga yomemasen.'),
          ex('さしみが**食べられますか**。', 'Bạn ăn được sashimi không?', 'Can you eat sashimi?', 'Sashimi ga taberaremasu ka.'),
        ],
      },
      {
        title: l('Vる + ことができます', 'Dictionary form + ことができます'),
        body: l(
          'Cách nói trang trọng hơn với cùng nghĩa: **thể từ điển + ことができます**. Với danh từ: **N ができます**.',
          'A more formal way to say the same thing: **dictionary form + ことができます**. With nouns: **N ができます**.',
        ),
        examples: [
          ex('カードで払う**ことができます**。', 'Có thể thanh toán bằng thẻ.', 'You can pay by card.', 'Kādo de harau koto ga dekimasu.'),
          ex('ミンさんはピアノ**ができます**。', 'Minh biết chơi piano.', 'Minh can play the piano.', 'Min-san wa piano ga dekimasu.'),
        ],
      },
    ],
    tips: [
      l(
        '見える / 聞こえる (tự nhiên nhìn thấy, nghe thấy) khác 見られる / 聞ける (có điều kiện để xem, để nghe): ここから富士山が**見えます** (từ đây nhìn thấy núi Phú Sĩ).',
        '見える / 聞こえる (be visible / audible) differ from 見られる / 聞ける (be able to watch / listen): ここから富士山が**見えます** (you can see Mount Fuji from here).',
      ),
      l('Văn nói hay bỏ ら ở nhóm 2: 食べれる, 見れる. Nghe hiểu được, nhưng khi viết nên dùng dạng chuẩn.', 'In speech people often drop the ら: 食べれる, 見れる. Understand it, but write the standard form.'),
    ],
  },
  {
    id: 'giving-receiving',
    level: 'A2',
    title: l('Cho và nhận: あげる, もらう, くれる', 'Giving and receiving: あげる, もらう, くれる'),
    summary: l('Ba động từ cho / nhận phụ thuộc vào hướng: từ tôi ra ngoài, hay từ người khác đến tôi.', 'Three verbs chosen by direction: from me outward, or from others to me.'),
    sections: [
      {
        table: table(
          [l('Động từ', 'Verb'), l('Hướng', 'Direction'), PATTERN],
          [
            ['あげる', l('Tôi (hoặc người khác) → người khác', 'Me (or others) → others'), 'A は B に N を あげる'],
            ['もらう', l('Người nhận nói: nhận từ ai', 'From the receiver\'s side: get from someone'), 'A は B に / から N を もらう'],
            ['くれる', l('Người khác → **tôi** (hoặc người nhà tôi)', 'Others → **me** (or my family)'), 'B は（私に）N を くれる'],
          ],
        ),
        examples: [
          ex('私は友だち**に**花を**あげました**。', 'Tôi đã tặng hoa cho bạn.', 'I gave my friend flowers.', 'Watashi wa tomodachi ni hana o agemashita.'),
          ex('私は母**に**時計を**もらいました**。', 'Tôi được mẹ tặng đồng hồ.', 'I got a watch from my mother.', 'Watashi wa haha ni tokei o moraimashita.'),
          ex('母が時計を**くれました**。', 'Mẹ đã tặng tôi đồng hồ.', 'My mother gave me a watch.', 'Haha ga tokei o kuremashita.'),
        ],
      },
      {
        title: l('Làm giúp: 〜てあげる / 〜てもらう / 〜てくれる', 'Favours: 〜てあげる / 〜てもらう / 〜てくれる'),
        body: l(
          'Gắn vào thể て để nói ai **làm giúp** ai. 〜てくれる / 〜てもらう thể hiện **lòng biết ơn** của người nói.',
          'Attach them to the て form to say who **does a favour** for whom. 〜てくれる / 〜てもらう show the speaker\'s **gratitude**.',
        ),
        examples: [
          ex('友だちが駅まで送っ**てくれました**。', 'Bạn tôi đã đưa tôi ra ga.', 'My friend took me to the station.', 'Tomodachi ga eki made okutte kuremashita.'),
          ex('先生に作文を直し**てもらいました**。', 'Tôi được thầy sửa bài văn cho.', 'I had my teacher correct my essay.', 'Sensei ni sakubun o naoshite moraimashita.'),
          ex('妹に本を読ん**であげました**。', 'Tôi đã đọc sách cho em gái nghe.', 'I read a book to my little sister.', 'Imōto ni hon o yonde agemashita.'),
        ],
      },
    ],
    tips: [
      l('Không bao giờ nói "người khác が 私に あげる": hướng về phía mình luôn dùng **くれる**.', 'Never say "someone が 私に あげる": giving toward you is always **くれる**.'),
      l('Với người trên dùng dạng kính ngữ: さしあげる (cho), いただく (nhận), くださる (cho mình).', 'With superiors use the keigo forms: さしあげる (give), いただく (receive), くださる (give me).'),
      l('Tránh nói 〜てあげる với người trên vì nghe như đang ban ơn.', 'Avoid 〜てあげる toward superiors; it sounds condescending.'),
    ],
  },
  {
    id: 'reason',
    level: 'A2',
    title: l('Lý do: から và ので', 'Reasons: から and ので'),
    summary: l('"Vì … nên …": から trực tiếp, chủ quan; ので khách quan và lịch sự hơn.', '"Because…": から is direct and subjective; ので is softer and more polite.'),
    sections: [
      {
        table: table(
          [l('Loại từ', 'Word type'), '〜から', '〜ので'],
          [
            [l('Động từ', 'Verb'), '行く**から** / 行きます**から**', '行く**ので**'],
            [l('Tính từ い', 'い-adjective'), '高い**から**', '高い**ので**'],
            [l('Tính từ な', 'な-adjective'), '静か**だから**', '静か**なので**'],
            [l('Danh từ', 'Noun'), '雨**だから**', '雨**なので**'],
          ],
        ),
      },
      {
        body: l(
          'Lý do đứng **trước** から / ので, kết quả đứng sau. Trả lời câu hỏi どうして bằng **〜からです**.',
          'The reason comes **before** から / ので and the result after it. Answer どうして with **〜からです**.',
        ),
        examples: [
          ex('時間がない**から**、タクシーで行きましょう。', 'Vì không có thời gian nên đi taxi thôi.', 'We don\'t have time, so let\'s take a taxi.', 'Jikan ga nai kara, takushī de ikimashō.'),
          ex('頭が痛い**ので**、早く帰ってもいいですか。', 'Tôi bị đau đầu nên cho tôi về sớm được không ạ?', 'I have a headache, so may I go home early?', 'Atama ga itai node, hayaku kaettemo ii desu ka.'),
          ex('どうして遅れましたか。― 電車が遅れた**からです**。', 'Sao bạn đến muộn? ― Vì tàu bị trễ.', 'Why were you late? ― Because the train was delayed.', 'Dōshite okuremashita ka. ― Densha ga okureta kara desu.'),
          ex('あしたは休み**なので**、ゆっくり寝ます。', 'Ngày mai được nghỉ nên tôi sẽ ngủ thoải mái.', 'Tomorrow is a day off, so I\'ll sleep in.', 'Ashita wa yasumi na node, yukkuri nemasu.'),
        ],
      },
    ],
    tips: [
      l('Khi xin phép hay xin lỗi, **ので** nghe nhẹ nhàng, lịch sự hơn から.', 'When asking permission or apologising, **ので** sounds gentler than から.'),
      l('Thể て cũng có thể nêu lý do: 雨が降っ**て**、行けませんでした (vì mưa nên không đi được).', 'A て form can also give a reason: 雨が降っ**て**、行けませんでした (it rained, so I couldn\'t go).'),
    ],
  },
  {
    id: 'to-omou-to-iu',
    level: 'A2',
    title: l('と思います, と言いました', 'と思います and と言いました'),
    summary: l('Nêu ý kiến, phỏng đoán và thuật lại lời người khác.', 'Giving opinions, guessing and reporting what someone said.'),
    sections: [
      {
        title: l('Thể thông thường + と思います', 'Plain form + と思います'),
        body: l(
          '**Tôi nghĩ là…**: nêu ý kiến hoặc phỏng đoán. Trước と dùng **thể thông thường**; danh từ và tính từ な cần **だ**.',
          '**I think that…**: for opinions and guesses. Use the **plain form** before と; nouns and な-adjectives need **だ**.',
        ),
        examples: [
          ex('あしたは雨が降る**と思います**。', 'Tôi nghĩ ngày mai trời sẽ mưa.', 'I think it will rain tomorrow.', 'Ashita wa ame ga furu to omoimasu.'),
          ex('田中さんはもう帰った**と思います**。', 'Tôi nghĩ anh Tanaka đã về rồi.', 'I think Mr Tanaka has already gone home.', 'Tanaka-san wa mō kaetta to omoimasu.'),
          ex('日本の電車は便利**だと思います**。', 'Tôi nghĩ tàu điện ở Nhật rất tiện.', 'I think Japanese trains are convenient.', 'Nihon no densha wa benri da to omoimasu.'),
          ex('日本の食べ物について**どう思いますか**。', 'Bạn nghĩ gì về đồ ăn Nhật?', 'What do you think of Japanese food?', 'Nihon no tabemono ni tsuite dō omoimasu ka.'),
        ],
      },
      {
        title: l('と言いました: thuật lại lời nói', 'と言いました: reporting speech'),
        body: l('Trích nguyên văn: 「…」と言いました. Thuật lại gián tiếp: **thể thông thường + と言いました**.', 'Direct quote: 「…」と言いました. Indirect: **plain form + と言いました**.'),
        examples: [
          ex('寝る前に「おやすみなさい」**と言います**。', 'Trước khi đi ngủ, người ta nói "Oyasuminasai".', 'Before going to bed, you say "Oyasuminasai".', 'Neru mae ni "oyasuminasai" to iimasu.'),
          ex('ミンさんはあしたは休みだ**と言いました**。', 'Minh nói là ngày mai được nghỉ.', 'Minh said tomorrow is a day off.', 'Min-san wa ashita wa yasumi da to iimashita.'),
        ],
      },
    ],
    tips: [
      l(
        'Muốn nói "tôi **không** nghĩ là…", tiếng Nhật thường phủ định vế bên trong: 雨は降らないと思います (tôi nghĩ trời sẽ không mưa).',
        'For "I don\'t think…", Japanese usually negates the inner clause: 雨は降らないと思います (I think it won\'t rain).',
      ),
    ],
  },
  {
    id: 'volitional',
    level: 'A2',
    title: l('Thể ý chí và dự định', 'Volitional form and plans'),
    summary: l('〜よう / 〜おう (cùng … nào), 〜ようと思っています, つもりです và 予定です.', '〜よう / 〜おう (let\'s…), 〜ようと思っています, つもりです and 予定です.'),
    sections: [
      {
        table: table(
          [GROUP, RULE, EXAMPLE],
          [
            [G1, l('-u → **-ō**', '-u → **-ō**'), '行く → 行**こう**, 飲む → 飲**もう**, 帰る → 帰**ろう**'],
            [G2, l('Bỏ る + **よう**', 'Drop る + **よう**'), '食べる → 食べ**よう**, 見る → 見**よう**'],
            [G3, IRREGULAR, 'する → **しよう**, 来る → **来(こ)よう**'],
          ],
        ),
      },
      {
        title: l('Cách dùng', 'How to use it'),
        bullets: [
          l('Đứng một mình = **〜ましょう** dạng thân mật: いっしょに行こう! (cùng đi nào!).', 'On its own it is the casual **〜ましょう**: いっしょに行こう! (let\'s go together!).'),
          l('**〜ようと思っています**: đang định làm (ý định đã có từ trước).', '**〜ようと思っています**: I\'m thinking of doing (a plan you have had for a while).'),
          l('**Vる / Vない + つもりです**: dự định chắc chắn hơn.', '**Dictionary / ない form + つもりです**: a firmer intention.'),
          l('**Vる + 予定です**: kế hoạch đã được sắp xếp.', '**Dictionary form + 予定です**: an arranged schedule.'),
        ],
        examples: [
          ex('ちょっと休**もう**。', 'Nghỉ chút đi.', 'Let\'s take a break.', 'Chotto yasumō.'),
          ex('夏休みに国へ帰**ろうと思っています**。', 'Tôi đang định về nước vào kỳ nghỉ hè.', 'I\'m thinking of going back to my country for the summer holidays.', 'Natsuyasumi ni kuni e kaerō to omotte imasu.'),
          ex('来年、日本の大学で勉強する**つもりです**。', 'Năm sau tôi dự định học ở một trường đại học Nhật.', 'I intend to study at a Japanese university next year.', 'Rainen, Nihon no daigaku de benkyō suru tsumori desu.'),
          ex('もうたばこは吸わない**つもりです**。', 'Tôi định sẽ không hút thuốc nữa.', 'I don\'t intend to smoke any more.', 'Mō tabako wa suwanai tsumori desu.'),
          ex('会議は3時に始まる**予定です**。', 'Cuộc họp dự kiến bắt đầu lúc 3 giờ.', 'The meeting is scheduled to start at 3.', 'Kaigi wa sanji ni hajimaru yotei desu.'),
        ],
      },
    ],
  },
  {
    id: 'experience-tari',
    level: 'A2',
    title: l('Kinh nghiệm và liệt kê: 〜たことがある, 〜たり〜たり', 'Experience and examples: 〜たことがある, 〜たり〜たり'),
    summary: l('Đã từng làm gì chưa; liệt kê vài hành động tiêu biểu.', 'Whether you have ever done something; listing a few typical actions.'),
    sections: [
      {
        title: l('V-た + ことがあります', 'た form + ことがあります'),
        body: l(
          'Diễn tả **kinh nghiệm**: đã từng làm gì (ít nhất một lần). Phủ định: **〜たことがありません** (chưa từng).',
          'Expresses **experience**: having done something at least once. Negative: **〜たことがありません** (have never).',
        ),
        examples: [
          ex('富士山に登っ**たことがありますか**。― はい、一度あります。', 'Bạn đã từng leo núi Phú Sĩ chưa? ― Có, một lần rồi.', 'Have you ever climbed Mount Fuji? ― Yes, once.', 'Fujisan ni nobotta koto ga arimasu ka. ― Hai, ichido arimasu.'),
          ex('納豆を食べ**たことがありません**。', 'Tôi chưa từng ăn natto.', 'I have never eaten natto.', 'Nattō o tabeta koto ga arimasen.'),
        ],
      },
      {
        title: l('V1-たり V2-たり します', 'V1-たり V2-たり します'),
        body: l(
          'Liệt kê **vài hành động tiêu biểu** (không đầy đủ), như "nào là … nào là …". Thì của câu nằm ở します cuối câu.',
          'Lists **a few typical actions** (not all of them), like "things like… and…". The tense goes on the final します.',
        ),
        examples: [
          ex('週末は本を読ん**だり**、映画を見**たり**します。', 'Cuối tuần tôi đọc sách, xem phim, v.v.', 'At weekends I read books, watch films and so on.', 'Shūmatsu wa hon o yondari, eiga o mitari shimasu.'),
          ex('きのうは掃除し**たり**、洗濯し**たり**しました。', 'Hôm qua tôi dọn dẹp, giặt giũ…', 'Yesterday I did things like cleaning and laundry.', 'Kinō wa sōji shitari, sentaku shitari shimashita.'),
        ],
      },
    ],
    tips: [l('〜たことがあります chỉ dùng cho **trải nghiệm**, không dùng cho việc vừa làm hôm qua hay việc thường ngày.', '〜たことがあります is only for **experiences**, not for yesterday\'s actions or daily routines.')],
  },
  {
    id: 'conditionals',
    level: 'A2',
    title: l('Câu điều kiện: たら, と, ば, なら', 'Conditionals: たら, と, ば and なら'),
    summary: l('Bốn cách nói "nếu": たら dùng được nhiều nhất; と cho kết quả tất yếu; ば cho giả định; なら đáp lại ngữ cảnh.', 'Four ways to say "if": たら is the most versatile; と is for automatic results; ば is hypothetical; なら picks up context.'),
    sections: [
      {
        table: table(
          [PATTERN, l('Cách tạo', 'Form'), l('Dùng khi', 'Use')],
          [
            [
              '〜たら',
              l('thể た + ら: 行ったら, 安かったら, 雨だったら', 'た form + ら: 行ったら, 安かったら, 雨だったら'),
              l('"Nếu / khi" — dùng được hầu hết mọi trường hợp, kể cả khi vế sau là nhờ vả hay ý định', '"If / when" — works almost everywhere, even before requests and intentions'),
            ],
            ['〜と', l('thể từ điển + と: 押すと', 'dictionary form + と: 押すと'), l('Hễ … thì (kết quả tự nhiên, tất yếu): máy móc, chỉ đường, quy luật', 'Whenever… (natural, automatic results): machines, directions, facts')],
            [
              '〜ば',
              l('nhóm 1: -u → -eba (行けば); nhóm 2: -reba (食べれば); tính từ い: -kereba (安ければ)', 'group 1: -u → -eba (行けば); group 2: -reba (食べれば); い-adj: -kereba (安ければ)'),
              l('Nếu (điều kiện giả định); hay dùng trong lời khuyên', 'If (hypothetical); common in advice'),
            ],
            ['〜なら', l('thể thông thường / danh từ + なら', 'plain form / noun + なら'), l('Nếu là … thì (đáp lại điều người khác vừa nói)', 'If it\'s… then (responding to what someone just said)')],
          ],
        ),
        examples: [
          ex('駅に着い**たら**、電話してください。', 'Khi đến ga thì gọi cho tôi nhé.', 'Call me when you get to the station.', 'Eki ni tsuitara, denwa shite kudasai.'),
          ex('雨が降っ**たら**、行きません。', 'Nếu trời mưa thì tôi không đi.', 'If it rains, I won\'t go.', 'Ame ga futtara, ikimasen.'),
          ex('このボタンを押す**と**、お釣りが出ます。', 'Ấn nút này thì tiền thừa sẽ ra.', 'Press this button and your change comes out.', 'Kono botan o osu to, otsuri ga demasu.'),
          ex('春になる**と**、桜が咲きます。', 'Cứ đến mùa xuân là hoa anh đào nở.', 'When spring comes, the cherry blossoms bloom.', 'Haru ni naru to, sakura ga sakimasu.'),
          ex('安けれ**ば**、買います。', 'Nếu rẻ thì tôi mua.', 'If it\'s cheap, I\'ll buy it.', 'Yasukereba, kaimasu.'),
          ex('京都へ行く**なら**、金閣寺がおすすめです。', 'Nếu bạn đi Kyoto thì tôi gợi ý chùa Vàng Kinkaku-ji.', 'If you\'re going to Kyoto, I recommend Kinkaku-ji.', 'Kyōto e iku nara, Kinkakuji ga osusume desu.'),
        ],
      },
    ],
    tips: [
      l('Không chắc dùng mẫu nào thì chọn **〜たら**: đúng trong hầu hết các trường hợp.', 'When unsure, choose **〜たら**: it is correct in most situations.'),
      l('Vế sau của **と** không được là nhờ vả, rủ rê hay ý định của người nói.', 'The clause after **と** cannot be a request, an invitation or the speaker\'s intention.'),
    ],
  },
  {
    id: 'time-clauses',
    level: 'A2',
    title: l('Trước, sau, khi, trong khi', 'Before, after, when and while'),
    summary: l('〜前に, 〜た後で, 〜時, 〜ながら: sắp xếp các hành động theo thời gian.', '〜前に, 〜た後で, 〜時 and 〜ながら: ordering actions in time.'),
    sections: [
      {
        table: table(
          [PATTERN, MEANING, EXAMPLE],
          [
            [l('Vる / N の + **前に**', 'Dictionary form / N の + **前に**'), l('trước khi', 'before'), '寝る**前に**歯を磨きます。'],
            [l('Vた / N の + **後で**', 'た form / N の + **後で**'), l('sau khi', 'after'), '仕事の**後で**飲みに行きます。'],
            [l('Thể thông thường / N の + **時**', 'Plain form / N の + **時**'), l('khi', 'when'), '子どもの**時**、大阪に住んでいました。'],
            [l('Gốc động từ + **ながら**', 'Verb stem + **ながら**'), l('vừa … vừa …', 'while (doing two things at once)'), '音楽を聞き**ながら**勉強します。'],
          ],
        ),
        examples: [
          ex('食べる**前に**、「いただきます」と言います。', 'Trước khi ăn, người ta nói "Itadakimasu".', 'Before eating, people say "Itadakimasu".', 'Taberu mae ni, "itadakimasu" to iimasu.'),
          ex('授業が終わった**後で**、図書館へ行きます。', 'Sau khi tan học, tôi đến thư viện.', 'After class, I go to the library.', 'Jugyō ga owatta ato de, toshokan e ikimasu.'),
          ex('ひまな**時**、何をしますか。', 'Lúc rảnh bạn làm gì?', 'What do you do when you\'re free?', 'Hima na toki, nani o shimasu ka.'),
          ex('歩き**ながら**スマホを見ないでください。', 'Đừng vừa đi vừa xem điện thoại.', 'Please don\'t look at your phone while walking.', 'Arukinagara sumaho o minaide kudasai.'),
        ],
      },
    ],
    tips: [
      l('前に luôn đi với **thể từ điển**, kể cả khi nói về quá khứ: 日本へ来る前に (trước khi đến Nhật).', '前に always takes the **dictionary form**, even about the past: 日本へ来る前に (before coming to Japan).'),
      l('Với ながら, hành động chính là động từ **cuối câu**.', 'With ながら, the main action is the **final verb**.'),
    ],
  },
  {
    id: 'noun-modifying',
    level: 'A2',
    title: l('Mệnh đề bổ nghĩa cho danh từ', 'Clauses that describe nouns'),
    summary: l('Đặt cả một câu ở thể thông thường **trước** danh từ: "quyển sách (mà) tôi mua hôm qua".', 'Put a whole plain-form clause **before** a noun: "the book I bought yesterday".'),
    sections: [
      {
        body: l(
          'Tiếng Nhật **không có** từ tương đương "mà / who / which". Chỉ cần đặt mệnh đề ở **thể thông thường** ngay trước danh từ. Chủ ngữ trong mệnh đề dùng **が**, không dùng は.',
          'Japanese has **no** word for "who / which / that". Simply put a **plain-form** clause right before the noun. The subject inside the clause takes **が**, never は.',
        ),
        table: table(
          [l('Mệnh đề', 'Clause'), l('Danh từ', 'Noun'), MEANING],
          [
            ['きのう買った', '本', l('quyển sách tôi mua hôm qua', 'the book I bought yesterday')],
            ['めがねをかけている', '人', l('người đang đeo kính', 'the person wearing glasses')],
            ['母が作った', '料理', l('món ăn mẹ nấu', 'the food my mother made')],
            ['日本語を教える', '仕事', l('công việc dạy tiếng Nhật', 'a job teaching Japanese')],
          ],
        ),
        examples: [
          ex('これは**きのう買った**本です。', 'Đây là quyển sách tôi mua hôm qua.', 'This is the book I bought yesterday.', 'Kore wa kinō katta hon desu.'),
          ex('**あそこで新聞を読んでいる**人はだれですか。', 'Người đang đọc báo ở đằng kia là ai?', 'Who is the person reading a newspaper over there?', 'Asoko de shinbun o yonde iru hito wa dare desu ka.'),
          ex('**田中さんが住んでいる**町は静かです。', 'Thị trấn nơi anh Tanaka sống rất yên tĩnh.', 'The town where Mr Tanaka lives is quiet.', 'Tanaka-san ga sunde iru machi wa shizuka desu.'),
          ex('**日本へ行く**時間がありません。', 'Tôi không có thời gian để đi Nhật.', 'I don\'t have time to go to Japan.', 'Nihon e iku jikan ga arimasen.'),
        ],
      },
    ],
    tips: [l('Mẹo dịch: đọc danh từ trước, rồi thêm "mà …" với phần mệnh đề đứng trước nó.', 'Translation trick: read the noun first, then add the clause before it as "that / who…".')],
  },
  {
    id: 'te-auxiliaries',
    level: 'A2',
    title: l('〜てみる, 〜てしまう, 〜ておく', '〜てみる, 〜てしまう, 〜ておく'),
    summary: l('Thử làm; làm xong hết hoặc lỡ làm; làm sẵn để chuẩn bị.', 'Try doing; finish completely or do by accident; do in advance.'),
    sections: [
      {
        table: table(
          [PATTERN, MEANING, l('Văn nói', 'Casual')],
          [
            ['〜てみる', l('thử làm (để xem thế nào)', 'try doing (and see)'), '—'],
            ['〜てしまう', l('làm xong hết; lỡ làm (tiếc nuối)', 'finish completely; do by accident (regret)'), '〜ちゃう / 〜じゃう'],
            ['〜ておく', l('làm sẵn để chuẩn bị; để nguyên như vậy', 'do in advance; leave as it is'), '〜とく'],
          ],
        ),
        examples: [
          ex('この服、着**てみても**いいですか。', 'Tôi mặc thử bộ đồ này được không?', 'May I try this on?', 'Kono fuku, kite mitemo ii desu ka.'),
          ex('一度、すしを作っ**てみたい**です。', 'Tôi muốn thử làm sushi một lần.', 'I\'d like to try making sushi once.', 'Ichido, sushi o tsukutte mitai desu.'),
          ex('宿題をもう全部やっ**てしまいました**。', 'Tôi đã làm xong hết bài tập rồi.', 'I\'ve already finished all my homework.', 'Shukudai o mō zenbu yatte shimaimashita.'),
          ex('電車に傘を忘れ**てしまいました**。', 'Tôi lỡ để quên ô trên tàu.', 'I left my umbrella on the train.', 'Densha ni kasa o wasurete shimaimashita.'),
          ex('旅行の前に、ホテルを予約し**ておきます**。', 'Trước chuyến đi, tôi đặt khách sạn sẵn.', 'I\'ll book the hotel before the trip.', 'Ryokō no mae ni, hoteru o yoyaku shite okimasu.'),
          ex('窓を開け**ておいて**ください。', 'Cứ để cửa sổ mở nhé.', 'Please leave the window open.', 'Mado o akete oite kudasai.'),
        ],
      },
    ],
  },
  {
    id: 'advice',
    level: 'A2',
    title: l('Lời khuyên: 〜ほうがいい', 'Advice: 〜ほうがいい'),
    summary: l('Vた + ほうがいいです: nên làm; Vない + ほうがいいです: không nên làm.', 'た form + ほうがいいです: you should; ない form + ほうがいいです: you shouldn\'t.'),
    sections: [
      {
        body: l(
          'Khuyên **nên làm**: thể **た** + ほうがいいです. Khuyên **không nên**: thể **ない** + ほうがいいです.',
          'To say you **should**, use the **た** form + ほうがいいです. To say you **shouldn\'t**, use the **ない** form + ほうがいいです.',
        ),
        examples: [
          ex('熱があるなら、病院へ行っ**たほうがいい**ですよ。', 'Nếu bị sốt thì nên đi bệnh viện đấy.', 'If you have a fever, you should see a doctor.', 'Netsu ga aru nara, byōin e itta hō ga ii desu yo.'),
          ex('夜遅くまでゲームをし**ないほうがいい**です。', 'Không nên chơi game đến khuya.', 'You shouldn\'t play games until late at night.', 'Yoru osoku made gēmu o shinai hō ga ii desu.'),
          ex('傘を持っていっ**たほうがいい**と思います。', 'Tôi nghĩ bạn nên mang theo ô.', 'I think you should take an umbrella.', 'Kasa o motte itta hō ga ii to omoimasu.'),
        ],
      },
      {
        title: l('Các cách khuyên khác', 'Other ways to give advice'),
        bullets: [
          l('**〜たらどうですか**: thử … xem sao? (gợi ý nhẹ nhàng).', '**〜たらどうですか**: why don\'t you…? (gentle suggestion).'),
          l('**〜ばいいです**: chỉ cần … là được.', '**〜ばいいです**: you just need to….'),
        ],
      },
    ],
    tips: [l('〜ほうがいい khá thẳng; với người trên, thêm と思います hoặc dùng 〜たらどうですか cho mềm hơn.', '〜ほうがいい is fairly direct; with superiors, add と思います or use 〜たらどうですか.')],
  },
  {
    id: 'appearance-hearsay',
    level: 'A2',
    title: l('Có vẻ và nghe nói: そうです, ようです, みたいです', 'Looks like and I hear: そうです, ようです, みたいです'),
    summary: l('Hai nghĩa của そうです (trông có vẻ / nghe nói) và ようです・みたいです (hình như).', 'The two meanings of そうです (looks like / I hear) and ようです・みたいです (it seems).'),
    sections: [
      {
        table: table(
          [PATTERN, MEANING, EXAMPLE],
          [
            [l('Gốc động từ / tính từ bỏ い, な + **そうです**', 'Verb stem / adjective minus い, な + **そうです**'), l('Trông có vẻ (dựa vào những gì nhìn thấy)', 'Looks like (from what you see)'), 'おいし**そうです**ね。'],
            [l('Thể thông thường + **そうです**', 'Plain form + **そうです**'), l('Nghe nói (truyền đạt thông tin)', 'I hear that (passing on information)'), 'あしたは雨が降る**そうです**。'],
            [l('Thể thông thường + **ようです / みたいです**', 'Plain form + **ようです / みたいです**'), l('Hình như (suy đoán từ dấu hiệu)', 'It seems (inferred from evidence)'), 'だれもいない**ようです**。'],
          ],
        ),
        examples: [
          ex('このケーキ、おいし**そう**！', 'Cái bánh này trông ngon quá!', 'This cake looks delicious!', 'Kono kēki, oishisō!'),
          ex('雨が降り**そうです**。', 'Trời có vẻ sắp mưa.', 'It looks like it\'s going to rain.', 'Ame ga furisō desu.'),
          ex('ニュースによると、台風が来る**そうです**。', 'Theo tin tức thì bão sắp đến.', 'According to the news, a typhoon is coming.', 'Nyūsu ni yoru to, taifū ga kuru sō desu.'),
          ex('田中さんはかぜを引いた**みたいです**。', 'Hình như anh Tanaka bị cảm.', 'It seems Mr Tanaka has caught a cold.', 'Tanaka-san wa kaze o hiita mitai desu.'),
        ],
      },
    ],
    tips: [
      l('Dạng đặc biệt: いい → **よさそう**, ない → **なさそう**.', 'Special forms: いい → **よさそう**, ない → **なさそう**.'),
      l('Cẩn thận: **かわいそう** nghĩa là "tội nghiệp", không phải "trông dễ thương".', 'Careful: **かわいそう** means "poor thing", not "looks cute".'),
    ],
  },
  {
    id: 'probability',
    level: 'A2',
    title: l('Phỏng đoán: でしょう, かもしれません', 'Probability: でしょう and かもしれません'),
    summary: l('でしょう: có lẽ (khá chắc chắn); かもしれません: có thể (khoảng 50%).', 'でしょう: probably (fairly sure); かもしれません: maybe (about 50%).'),
    sections: [
      {
        body: l(
          'Cả hai đứng sau **thể thông thường**; với danh từ và tính từ な thì **bỏ だ**: 雨でしょう, ひまかもしれません.',
          'Both follow the **plain form**; with nouns and な-adjectives, **drop だ**: 雨でしょう, ひまかもしれません.',
        ),
        table: table(
          [l('Mức độ chắc chắn', 'Certainty'), PATTERN, EXAMPLE],
          [
            ['~100%', '〜ます / 〜です', '雨が降ります。'],
            ['~80%', '〜でしょう', '雨が降る**でしょう**。'],
            ['~50%', '〜かもしれません', '雨が降る**かもしれません**。'],
          ],
        ),
        examples: [
          ex('あしたは晴れる**でしょう**。', 'Ngày mai có lẽ trời nắng.', 'It will probably be sunny tomorrow.', 'Ashita wa hareru deshō.'),
          ex('道が込んでいるから、遅れる**かもしれません**。', 'Đường đang tắc nên có thể tôi sẽ đến muộn.', 'The roads are busy, so I might be late.', 'Michi ga konde iru kara, okureru kamoshiremasen.'),
          ex('あの人は先生**かもしれません**。', 'Người kia có thể là giáo viên.', 'That person might be a teacher.', 'Ano hito wa sensei kamoshiremasen.'),
          ex('疲れた**でしょう**。少し休んでください。', 'Chắc là mệt rồi nhỉ. Nghỉ một chút đi.', 'You must be tired. Have a little rest.', 'Tsukareta deshō. Sukoshi yasunde kudasai.'),
        ],
      },
    ],
    tips: [l('Lên giọng ở cuối, **でしょう？** (thân mật: **でしょ？ / だろう？**) dùng để xác nhận: "… đúng không?"', 'With rising intonation, **でしょう？** (casual **でしょ？ / だろう？**) asks for agreement: "…, right?"')],
  },
  {
    id: 'n-desu',
    level: 'A2',
    title: l('〜んです: giải thích và hỏi lý do', '〜んです: explaining and asking'),
    summary: l('Thêm sắc thái giải thích, nêu hoàn cảnh hoặc tò mò muốn biết.', 'Adds a nuance of explanation, background or curiosity.'),
    sections: [
      {
        body: l(
          '**Thể thông thường + んです** (văn viết: のです). Danh từ và tính từ な dùng **なんです**. Người Nhật dùng んです rất nhiều trong hội thoại để giải thích tình huống.',
          '**Plain form + んです** (written: のです). Nouns and な-adjectives take **なんです**. It is everywhere in conversation, explaining the situation.',
        ),
        table: table(
          [USE, EXAMPLE, MEANING],
          [
            [l('Hỏi khi thấy điều gì đó lạ', 'Asking about something you notice'), 'どうした**んですか**。', l('Có chuyện gì vậy?', 'What\'s wrong?')],
            [l('Giải thích lý do', 'Explaining a reason'), '頭が痛い**んです**。', l('Tôi bị đau đầu (nên…).', 'It\'s just that I have a headache.')],
            [l('Mở đầu lời nhờ vả', 'Leading into a request'), '駅へ行きたい**んですが**、…', l('Tôi muốn đến ga, (không biết…)', 'I\'d like to get to the station, (and I was wondering…)')],
          ],
        ),
        examples: [
          ex('どうして食べない**んですか**。― おなかがいっぱいな**んです**。', 'Sao bạn không ăn? ― Tôi no rồi.', 'Why aren\'t you eating? ― I\'m full.', 'Dōshite tabenai n desu ka. ― Onaka ga ippai na n desu.'),
          ex(
            'すみません、駅へ行きたい**んですが**、道を教えていただけませんか。',
            'Xin lỗi, tôi muốn đến ga, anh chỉ đường giúp tôi được không ạ?',
            'Excuse me, I\'d like to get to the station. Could you tell me the way?',
            'Sumimasen, eki e ikitai n desu ga, michi o oshiete itadakemasen ka.',
          ),
          ex('すてきなかばんですね。どこで買った**んですか**。', 'Cái cặp đẹp quá. Bạn mua ở đâu vậy?', 'What a lovely bag. Where did you buy it?', 'Suteki na kaban desu ne. Doko de katta n desu ka.'),
        ],
      },
    ],
    tips: [l('Đừng lạm dụng んです khi chỉ nêu sự thật đơn giản: 私は学生なんです nghe như đang phân trần.', 'Don\'t overuse んです for simple facts: 私は学生なんです sounds like you are justifying yourself.')],
  },
  {
    id: 'passive',
    level: 'A2',
    title: l('Thể bị động', 'The passive'),
    summary: l('〜れる / 〜られる: bị, được ai làm gì; cả bị động "chịu phiền".', '〜れる / 〜られる: being acted upon, including the "suffering" passive.'),
    sections: [
      {
        table: table(
          [GROUP, RULE, EXAMPLE],
          [
            [G1, l('-u → **-a** + れる (riêng う → わ)', '-u → **-a** + れる (but う → わ)'), '書く → 書**かれる**, 言う → 言**われる**, 踏む → 踏**まれる**'],
            [G2, l('Bỏ る + **られる**', 'Drop る + **られる**'), '食べる → 食べ**られる**, 見る → 見**られる**'],
            [G3, IRREGULAR, 'する → **される**, 来る → **来(こ)られる**'],
          ],
        ),
      },
      {
        body: l('Mẫu: **A は B に V-(ら)れる** = A bị / được B làm V. Người thực hiện hành động đi với **に**.', 'Pattern: **A は B に V-(ら)れる** = A is V-ed by B. The doer takes **に**.'),
        examples: [
          ex('私は先生に**ほめられました**。', 'Tôi được thầy khen.', 'I was praised by my teacher.', 'Watashi wa sensei ni homeraremashita.'),
          ex('電車で足を**踏まれました**。', 'Tôi bị giẫm vào chân trên tàu.', 'Someone stepped on my foot on the train.', 'Densha de ashi o fumaremashita.'),
          ex('このお寺は800年前に**建てられました**。', 'Ngôi chùa này được xây cách đây 800 năm.', 'This temple was built 800 years ago.', 'Kono otera wa happyakunen mae ni tateraremashita.'),
        ],
      },
      {
        title: l('Bị động "chịu phiền"', 'The "suffering" passive'),
        body: l(
          'Tiếng Nhật dùng bị động cả với **động từ không có tân ngữ** để diễn tả người nói **bị làm phiền**: 雨に降られた (bị mắc mưa), 子どもに泣かれた (bị đứa bé khóc làm cho khổ sở).',
          'Japanese even uses the passive with **intransitive verbs** to show the speaker was **inconvenienced**: 雨に降られた (got caught in the rain), 子どもに泣かれた (the baby cried on me).',
        ),
        examples: [ex('雨に**降られて**、ぬれてしまいました。', 'Bị mắc mưa nên ướt hết.', 'I got caught in the rain and got soaked.', 'Ame ni furarete, nurete shimaimashita.')],
      },
    ],
    tips: [l('Bị động của nhóm 2 giống hệt thể khả năng (食べられる); ngữ cảnh sẽ cho biết nghĩa nào.', 'The group 2 passive looks the same as the potential (食べられる); context tells you which.')],
  },
  {
    id: 'causative',
    level: 'A2',
    title: l('Thể sai khiến', 'The causative'),
    summary: l('〜せる / 〜させる: bắt hoặc cho phép ai làm gì; 〜させてください: xin cho phép tôi.', '〜せる / 〜させる: make or let someone do something; 〜させてください: please let me.'),
    sections: [
      {
        table: table(
          [GROUP, RULE, EXAMPLE],
          [
            [G1, l('-u → **-a** + せる (riêng う → わ)', '-u → **-a** + せる (but う → わ)'), '行く → 行**かせる**, 読む → 読**ませる**, 買う → 買**わせる**'],
            [G2, l('Bỏ る + **させる**', 'Drop る + **させる**'), '食べる → 食べ**させる**, 見る → 見**させる**'],
            [G3, IRREGULAR, 'する → **させる**, 来る → **来(こ)させる**'],
          ],
        ),
      },
      {
        body: l(
          'Người bị bắt / được cho phép đi với **に** (khi câu đã có tân ngữ を) hoặc **を** (với động từ không có tân ngữ).',
          'The person made or allowed to act takes **に** (when the sentence already has an object with を) or **を** (with intransitive verbs).',
        ),
        examples: [
          ex('母は弟**に**野菜を**食べさせました**。', 'Mẹ bắt em trai tôi ăn rau.', 'My mother made my little brother eat vegetables.', 'Haha wa otōto ni yasai o tabesasemashita.'),
          ex('部長は田中さん**を**大阪へ**行かせました**。', 'Trưởng phòng cử anh Tanaka đi Osaka.', 'The manager sent Mr Tanaka to Osaka.', 'Buchō wa Tanaka-san o Ōsaka e ikasemashita.'),
          ex('子どもを公園で**遊ばせます**。', 'Tôi cho bọn trẻ chơi ở công viên.', 'I let the children play in the park.', 'Kodomo o kōen de asobasemasu.'),
        ],
      },
      {
        title: l('〜させてください: xin phép lịch sự', '〜させてください: asking politely to do something'),
        examples: [
          ex('少し**考えさせてください**。', 'Xin cho tôi suy nghĩ một chút.', 'Please let me think about it a little.', 'Sukoshi kangaesasete kudasai.'),
          ex('今日は早く**帰らせて**いただけませんか。', 'Hôm nay cho phép tôi về sớm được không ạ?', 'Would you let me go home early today?', 'Kyō wa hayaku kaerasete itadakemasen ka.'),
        ],
      },
    ],
    tips: [
      l('Bị động sai khiến **〜させられる** = bị bắt làm: 母に野菜を食べさせられた (tôi bị mẹ bắt ăn rau).', 'The causative passive **〜させられる** means "be made to": 母に野菜を食べさせられた (I was made to eat vegetables by my mother).'),
    ],
  },
  {
    id: 'keigo',
    level: 'A2',
    title: l('Kính ngữ cơ bản', 'Keigo basics'),
    summary: l('Tôn kính ngữ (nâng người khác) và khiêm nhường ngữ (hạ mình) thường gặp.', 'Respectful language (raising others) and humble language (lowering yourself).'),
    sections: [
      {
        body: l(
          'Kính ngữ dùng với khách hàng, cấp trên, người lớn tuổi. **Tôn kính ngữ** (尊敬語) nâng hành động của người khác; **khiêm nhường ngữ** (謙譲語) hạ thấp hành động của mình.',
          'Keigo is used with customers, superiors and elders. **Respectful language** (尊敬語) raises other people\'s actions; **humble language** (謙譲語) lowers your own.',
        ),
        table: table(
          [l('Động từ', 'Verb'), l('Tôn kính (người khác)', 'Respectful (others)'), l('Khiêm nhường (mình)', 'Humble (yourself)')],
          [
            ['行く・来る', 'いらっしゃる', 'まいる'],
            ['いる', 'いらっしゃる', 'おる'],
            ['言う', 'おっしゃる', 'もうす'],
            ['食べる・飲む', 'めしあがる', 'いただく'],
            ['見る', 'ごらんになる', 'はいけんする'],
            ['する', 'なさる', 'いたす'],
            ['知っている', 'ごぞんじだ', 'ぞんじている'],
          ],
        ),
      },
      {
        title: l('Công thức chung', 'General formulas'),
        bullets: [
          l('Tôn kính: **お + gốc động từ + になります**: お待ちになります, お帰りになります.', 'Respectful: **お + verb stem + になります**: お待ちになります, お帰りになります.'),
          l('Khiêm nhường: **お + gốc động từ + します**: お持ちします, お送りします.', 'Humble: **お + verb stem + します**: お持ちします, お送りします.'),
          l('Nhờ vả lịch sự: **お + gốc động từ + ください**: お待ちください.', 'Polite request: **お + verb stem + ください**: お待ちください.'),
        ],
        examples: [
          ex('社長は何時に**いらっしゃいますか**。', 'Giám đốc mấy giờ sẽ đến ạ?', 'What time will the company president arrive?', 'Shachō wa nanji ni irasshaimasu ka.'),
          ex('少々**お待ちください**。', 'Xin quý khách vui lòng đợi một chút.', 'Please wait a moment.', 'Shōshō omachi kudasai.'),
          ex('私がお荷物を**お持ちします**。', 'Để tôi xách hành lý giúp quý khách.', 'Let me carry your luggage.', 'Watashi ga onimotsu o omochi shimasu.'),
          ex('はじめまして。リンと**申します**。', 'Rất hân hạnh được gặp. Tôi tên là Linh.', 'Nice to meet you. My name is Linh.', 'Hajimemashite. Rin to mōshimasu.'),
        ],
      },
    ],
    tips: [l('Không dùng tôn kính ngữ cho bản thân hay người nhà mình khi nói với người ngoài.', 'Never use respectful forms for yourself or your own family when talking to outsiders.')],
  },
]

export default grammar
