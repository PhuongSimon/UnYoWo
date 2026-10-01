import type { GrammarTopic } from '../../types'
import { ex, l, table } from '../helpers'

const RULE = l('Quy tắc', 'Rule')
const EXAMPLE = l('Ví dụ', 'Example')
const MEANING = l('Nghĩa', 'Meaning')
const PATTERN = l('Mẫu', 'Pattern')
const USE = l('Cách dùng', 'Use')
const ENDING = l('Đuôi', 'Ending')
const STEM = l('Gốc động từ', 'Stem')
const AFTER_CONSONANT = l('Sau phụ âm', 'After a consonant')
const AFTER_VOWEL = l('Sau nguyên âm', 'After a vowel')

const grammar: GrammarTopic[] = [
  {
    id: 'sentence-structure',
    level: 'A1',
    title: l('Cấu trúc câu cơ bản', 'Basic sentence structure'),
    summary: l('Động từ đứng cuối câu; tiểu từ đánh dấu vai trò của danh từ; đuôi câu thể hiện mức độ lịch sự.', 'The verb comes last; particles mark each noun\'s role; the ending shows how polite you are.'),
    sections: [
      {
        title: l('Chủ ngữ – Tân ngữ – Động từ', 'Subject – Object – Verb'),
        body: l(
          'Giống tiếng Nhật, tiếng Hàn đặt **động từ ở cuối câu**: "Tôi cơm **ăn**". Mỗi danh từ có một **tiểu từ** đứng sau để chỉ vai trò của nó (chủ đề, chủ ngữ, tân ngữ, nơi chốn…).',
          'Like Japanese, Korean puts **the verb at the end**: "I rice **eat**". Each noun is followed by a **particle** that shows its role (topic, subject, object, place…).',
        ),
        table: table(
          [l('Chủ đề', 'Topic'), l('Tân ngữ', 'Object'), l('Động từ', 'Verb')],
          [
            ['저는 (jeoneun)', '밥을 (babeul)', '먹어요 (meogeoyo)'],
            [l('tôi thì', 'as for me'), l('cơm', 'rice'), l('ăn', 'eat')],
          ],
        ),
        examples: [
          ex('저**는** 밥**을** 먹어요.', 'Tôi ăn cơm.', 'I eat rice.', 'Jeoneun babeul meogeoyo.'),
          ex('민수 씨**는** 학교**에** 가요.', 'Minsu đi đến trường.', 'Minsu goes to school.', 'Minsu ssineun hakgyoe gayo.'),
          ex('저는 커피**를** 좋아해요.', 'Tôi thích cà phê.', 'I like coffee.', 'Jeoneun keopireul joahaeyo.'),
        ],
      },
      {
        title: l('Lược bỏ chủ ngữ', 'Dropping the subject'),
        body: l('Khi ngữ cảnh đã rõ, người Hàn thường **bỏ chủ ngữ**, và cả tiểu từ trong văn nói.', 'When the context is clear, Koreans often **drop the subject**, and even particles in speech.'),
        examples: [ex('뭐 해요? ― 공부해요.', 'Bạn đang làm gì? ― (Tôi) đang học.', 'What are you doing? ― (I\'m) studying.', 'Mwo haeyo? ― Gongbuhaeyo.')],
      },
      {
        title: l('Mức độ lịch sự', 'Speech levels'),
        table: table(
          [ENDING, l('Khi nào dùng', 'When to use it'), EXAMPLE],
          [
            ['-아요/어요', l('Lịch sự, thân thiện: dùng nhiều nhất hằng ngày', 'Polite and friendly: the everyday default'), '가요'],
            ['-ㅂ니다/습니다', l('Trang trọng: tin tức, thuyết trình, công việc, chào hỏi lần đầu', 'Formal: news, presentations, work, first greetings'), '갑니다'],
            ['-아/어 (반말)', l('Thân mật: bạn thân, người nhỏ tuổi hơn', 'Casual: close friends, younger people'), '가'],
          ],
        ),
      },
      {
        title: l('Không mạo từ, không chia theo ngôi', 'No articles, no person endings'),
        body: l(
          'Danh từ không có "a/the" và thường không cần đánh dấu số nhiều. Động từ **không chia theo ngôi**: 가요 dùng cho tôi, bạn, anh ấy hay họ đều được.',
          'Nouns have no articles and usually need no plural. Verbs **do not change for person**: 가요 works for I, you, he, she and they.',
        ),
      },
    ],
    tips: [
      l('Gọi người khác bằng **tên + 씨** (민수 씨) hoặc chức danh (선생님 – thầy/cô). Tránh dùng 당신 (bạn) vì dễ gây mất lịch sự.', 'Address people with **name + 씨** (민수 씨) or a title (선생님 – teacher). Avoid 당신 ("you"), which can sound rude.'),
      l('**저** (tôi, khiêm tốn) dùng với người lạ và người trên; **나** (tôi) dùng với bạn bè.', '**저** (I, humble) is for strangers and superiors; **나** (I) is for friends.'),
    ],
  },
  {
    id: 'ieyo-yeyo',
    level: 'A1',
    title: l('Danh từ + 이에요/예요', 'Noun + 이에요/예요'),
    summary: l('"Là": 이에요/예요, phủ định 아니에요, và dạng trang trọng 입니다.', '"To be": 이에요/예요, the negative 아니에요 and the formal 입니다.'),
    sections: [
      {
        body: l(
          'Danh từ kết thúc bằng **phụ âm** (có patchim) + **이에요**; kết thúc bằng **nguyên âm** + **예요**.',
          'After a noun ending in a **consonant** use **이에요**; after a **vowel** use **예요**.',
        ),
        table: table(
          ['', l('Lịch sự', 'Polite'), l('Trang trọng', 'Formal'), MEANING],
          [
            [AFTER_CONSONANT, '학생**이에요**', '학생**입니다**', l('là học sinh', 'is a student')],
            [AFTER_VOWEL, '의사**예요**', '의사**입니다**', l('là bác sĩ', 'is a doctor')],
            [l('Phủ định', 'Negative'), '학생이 **아니에요**', '학생이 **아닙니다**', l('không phải là học sinh', 'is not a student')],
            [l('Câu hỏi', 'Question'), '학생이에요**?**', '학생**입니까?**', l('là học sinh phải không?', 'are you a student?')],
          ],
        ),
        examples: [
          ex('저는 베트남 사람**이에요**.', 'Tôi là người Việt Nam.', 'I am Vietnamese.', 'Jeoneun Beteunam saramieyo.'),
          ex('제 이름은 린**이에요**.', 'Tên tôi là Linh.', 'My name is Linh.', 'Je ireumeun Rinieyo.'),
          ex('이거 커피**예요**?', 'Cái này là cà phê à?', 'Is this coffee?', 'Igeo keopiyeyo?'),
          ex('아니요, 커피**가 아니에요**. 차**예요**.', 'Không, không phải cà phê. Là trà.', 'No, it isn\'t coffee. It\'s tea.', 'Aniyo, keopiga anieyo. Chayeyo.'),
          ex('처음 뵙겠습니다. 김민수**입니다**.', 'Rất hân hạnh được gặp. Tôi là Kim Minsu.', 'How do you do? I am Kim Minsu.', 'Cheoeum boepgetseumnida. Gim Minsu-imnida.'),
        ],
      },
      {
        title: l('Phủ định với 아니에요', 'The negative 아니에요'),
        body: l('Mẫu: **N이/가 아니에요**. Danh từ kết thúc bằng phụ âm dùng 이, bằng nguyên âm dùng 가.', 'Pattern: **N이/가 아니에요**. Use 이 after a consonant and 가 after a vowel.'),
      },
    ],
    tips: [l('"Vâng" là **네** (hoặc 예, trang trọng hơn); "không" là **아니요**.', '"Yes" is **네** (or the more formal 예); "no" is **아니요**.')],
  },
  {
    id: 'topic-subject',
    level: 'A1',
    title: l('은/는 và 이/가', '은/는 vs 이/가'),
    summary: l('은/는 đánh dấu chủ đề và sự đối chiếu; 이/가 đánh dấu chủ ngữ và thông tin mới.', '은/는 marks the topic and contrast; 이/가 marks the subject and new information.'),
    sections: [
      {
        table: table(
          [l('Tiểu từ', 'Particle'), AFTER_CONSONANT, AFTER_VOWEL],
          [
            [l('Chủ đề', 'Topic'), '은 (책은)', '는 (저는)'],
            [l('Chủ ngữ', 'Subject'), '이 (책이)', '가 (친구가)'],
          ],
        ),
      },
      {
        title: l('은/는: chủ đề, "còn … thì"', '은/는: the topic, "as for…"'),
        body: l('Giới thiệu **điều đang được nói đến** hoặc **đối chiếu** hai sự việc. Hay dùng khi tự giới thiệu.', 'Introduces **what the sentence is about** or **contrasts** two things. Common in self-introductions.'),
        examples: [
          ex('저**는** 학생이에요.', 'Tôi là học sinh.', 'I am a student.', 'Jeoneun haksaengieyo.'),
          ex('고기**는** 좋아해요. 그런데 생선**은** 안 좋아해요.', 'Thịt thì tôi thích. Nhưng cá thì không.', 'I like meat. But I don\'t like fish.', 'Gogineun joahaeyo. Geureonde saengseoneun an joahaeyo.'),
        ],
      },
      {
        title: l('이/가: chủ ngữ, thông tin mới', '이/가: the subject, new information'),
        body: l(
          'Nhấn mạnh **chính danh từ đó**: dùng khi trả lời "ai / cái gì", sau từ để hỏi làm chủ ngữ, và với 있다/없다, 좋다, 필요하다…',
          'Puts the focus on **the noun itself**: when answering "who / what", after question words as subjects, and with 있다/없다, 좋다, 필요하다…',
        ),
        examples: [
          ex('누**가** 왔어요? ― 민수 씨**가** 왔어요.', 'Ai đã đến? ― Minsu đã đến.', 'Who came? ― Minsu did.', 'Nuga wasseoyo? ― Minsu ssiga wasseoyo.'),
          ex('비**가** 와요.', 'Trời mưa.', 'It\'s raining.', 'Biga wayo.'),
          ex('시간**이** 없어요.', 'Tôi không có thời gian.', 'I don\'t have time.', 'Sigani eopseoyo.'),
        ],
      },
      {
        title: l('Dạng đặc biệt', 'Special forms'),
        bullets: [
          l('나 + 가 → **내가**, 저 + 가 → **제가**, 너 + 가 → **네가**.', '나 + 가 → **내가**, 저 + 가 → **제가**, 너 + 가 → **네가**.'),
          l('누구 + 가 → **누가** (ai).', '누구 + 가 → **누가** (who).'),
        ],
      },
    ],
    tips: [l('Mẹo: thông tin **mới** dùng 이/가; thông tin **đã biết** hoặc để đối chiếu dùng 은/는.', 'Rule of thumb: **new** information takes 이/가; **known** or contrasted information takes 은/는.')],
  },
  {
    id: 'object-particle',
    level: 'A1',
    title: l('Tiểu từ tân ngữ 을/를', 'The object particle 을/를'),
    summary: l('Đánh dấu tân ngữ trực tiếp: ăn **cái gì**, xem **cái gì**.', 'Marks the direct object: eat **what**, watch **what**.'),
    sections: [
      {
        body: l('Danh từ kết thúc bằng phụ âm + **을**, bằng nguyên âm + **를**.', 'Use **을** after a consonant and **를** after a vowel.'),
        examples: [
          ex('밥**을** 먹어요.', 'Tôi ăn cơm.', 'I eat rice.', 'Babeul meogeoyo.'),
          ex('영화**를** 봐요.', 'Tôi xem phim.', 'I watch a film.', 'Yeonghwareul bwayo.'),
          ex('한국어**를** 공부해요.', 'Tôi học tiếng Hàn.', 'I study Korean.', 'Hangugeoreul gongbuhaeyo.'),
          ex('뭘 사요? ― 사과**를** 사요.', 'Bạn mua gì? ― Tôi mua táo.', 'What are you buying? ― Apples.', 'Mwol sayo? ― Sagwareul sayo.'),
        ],
      },
      {
        title: l('Những trường hợp hay nhầm', 'Common traps'),
        bullets: [
          l('**좋아하다** (thích) dùng 을/를, nhưng **좋다** (tốt, ưa) dùng 이/가: 저는 커피**가** 좋아요.', '**좋아하다** (like) takes 을/를, but **좋다** (be good, be liked) takes 이/가: 저는 커피**가** 좋아요.'),
          l('**되다** (trở thành) và **아니다** dùng 이/가: 의사**가** 되고 싶어요.', '**되다** (become) and **아니다** take 이/가: 의사**가** 되고 싶어요.'),
          l('**만나다** (gặp) dùng 을/를: 친구**를** 만나요.', '**만나다** (meet) takes 을/를: 친구**를** 만나요.'),
        ],
      },
    ],
    tips: [l('Văn nói thường bỏ 을/를 hoặc rút gọn: 뭐를 → **뭘**, 나를 → **날**.', 'Speech often drops 을/를 or shortens it: 뭐를 → **뭘**, 나를 → **날**.')],
  },
  {
    id: 'e-eseo',
    level: 'A1',
    title: l('에 và 에서', '에 vs 에서'),
    summary: l('에: đích đến, thời điểm, nơi tồn tại. 에서: nơi diễn ra hành động, điểm xuất phát.', '에: destination, time, location of existence. 에서: where an action happens, starting point.'),
    sections: [
      {
        table: table(
          [USE, EXAMPLE, MEANING],
          [
            [l('Đích đến (에)', 'Destination (에)'), '학교**에** 가요.', l('Tôi đi đến trường.', 'I go to school.')],
            [l('Thời điểm (에)', 'Time (에)'), '세 시**에** 만나요.', l('Gặp nhau lúc 3 giờ nhé.', 'Let\'s meet at 3.')],
            [l('Nơi tồn tại (에)', 'Location of existence (에)'), '집**에** 있어요.', l('Tôi đang ở nhà.', 'I\'m at home.')],
            [l('Nơi diễn ra hành động (에서)', 'Place of action (에서)'), '도서관**에서** 공부해요.', l('Tôi học ở thư viện.', 'I study at the library.')],
            [l('Điểm xuất phát (에서)', 'Starting point (에서)'), '베트남**에서** 왔어요.', l('Tôi đến từ Việt Nam.', 'I\'m from Vietnam.')],
          ],
        ),
      },
      {
        title: l('Thời gian: khi nào dùng 에?', 'Time: when do you need 에?'),
        body: l(
          'Dùng 에 với giờ, thứ, ngày tháng, buổi trong ngày (월요일에, 아침에). **Không dùng** 에 với 오늘, 내일, 어제, 지금, 매일.',
          'Use 에 with clock times, weekdays, dates and parts of the day (월요일에, 아침에). **No** 에 with 오늘, 내일, 어제, 지금, 매일.',
        ),
        examples: [
          ex('주말**에** 뭐 해요?', 'Cuối tuần bạn làm gì?', 'What do you do at the weekend?', 'Jumare mwo haeyo?'),
          ex('내일 친구를 만나요.', 'Ngày mai tôi gặp bạn. (내일 không đi với 에)', 'I\'m meeting a friend tomorrow. (no 에 after 내일)', 'Naeil chingureul mannayo.'),
          ex('회사**에서** 일해요.', 'Tôi làm việc ở công ty.', 'I work at a company.', 'Hoesaeseo ilhaeyo.'),
          ex('서울**에** 살아요.', 'Tôi sống ở Seoul. (살다 dùng được cả 에 và 에서)', 'I live in Seoul. (살다 takes 에 or 에서)', 'Seoure sarayo.'),
        ],
      },
    ],
    tips: [
      l('Hỏi "ở đâu": hành động thì dùng **어디에서** (어디서), đi đâu thì dùng **어디에**: 어디에 가요? (bạn đi đâu?)', 'For "where": with actions use **어디에서** (어디서); for destinations use **어디에**: 어디에 가요? (where are you going?)'),
    ],
  },
  {
    id: 'possessive-also-only',
    level: 'A1',
    title: l('의, 도, 만', '의, 도 and 만'),
    summary: l('의: "của"; 도: "cũng"; 만: "chỉ".', '의: possession; 도: "also"; 만: "only".'),
    sections: [
      {
        title: l('의: sở hữu', '의: possession'),
        body: l(
          '**A의 B** = B của A (thứ tự ngược tiếng Việt). Khi là tiểu từ sở hữu, 의 thường đọc là **[에]**. Văn nói hay bỏ 의: 엄마 가방 (túi của mẹ).',
          '**A의 B** = A\'s B. As a possessive, 의 is usually pronounced **[에]**. Speech often drops it: 엄마 가방 (mum\'s bag).',
        ),
        table: table(
          [l('Đầy đủ', 'Full'), l('Rút gọn', 'Short'), MEANING],
          [
            ['저의', '**제**', l('của tôi (khiêm tốn)', 'my (humble)')],
            ['나의', '**내**', l('của tôi', 'my')],
            ['너의', '**네**', l('của bạn (thân mật)', 'your (casual)')],
          ],
        ),
        examples: [
          ex('이건 **제** 책이에요.', 'Đây là sách của tôi.', 'This is my book.', 'Igeon je chaegieyo.'),
          ex('친구**의** 동생', 'em của bạn tôi', 'my friend\'s younger sibling', 'chingue dongsaeng'),
        ],
      },
      {
        title: l('도: cũng', '도: also, too'),
        body: l('**도** thay thế 은/는, 이/가, 을/를; với các tiểu từ khác thì gắn phía sau: 에도, 에서도.', '**도** replaces 은/는, 이/가 and 을/를; with other particles it goes after them: 에도, 에서도.'),
        examples: [
          ex('저**도** 학생이에요.', 'Tôi cũng là học sinh.', 'I\'m a student too.', 'Jeodo haksaengieyo.'),
          ex('부산**에도** 가고 싶어요.', 'Tôi cũng muốn đi Busan.', 'I want to go to Busan too.', 'Busanedo gago sipeoyo.'),
        ],
      },
      {
        title: l('만: chỉ', '만: only'),
        examples: [
          ex('물**만** 마셔요.', 'Tôi chỉ uống nước.', 'I only drink water.', 'Mulman masyeoyo.'),
          ex('한 개**만** 주세요.', 'Cho tôi một cái thôi.', 'Just one, please.', 'Han gaeman juseyo.'),
        ],
      },
    ],
  },
  {
    id: 'and-with',
    level: 'A1',
    title: l('Và, cùng với: 와/과, 하고, (이)랑', 'And, with: 와/과, 하고, (이)랑'),
    summary: l('Ba cách nối danh từ, khác nhau ở mức độ trang trọng.', 'Three ways to join nouns, differing in formality.'),
    sections: [
      {
        table: table(
          [l('Tiểu từ', 'Particle'), AFTER_CONSONANT, AFTER_VOWEL, l('Văn phong', 'Style')],
          [
            ['와/과', '과 (빵과)', '와 (우유와)', l('viết, trang trọng', 'written, formal')],
            ['하고', '하고', '하고', l('nói, trung tính', 'spoken, neutral')],
            ['(이)랑', '이랑 (빵이랑)', '랑 (우유랑)', l('nói, thân mật', 'spoken, casual')],
          ],
        ),
        examples: [
          ex('빵**하고** 우유를 샀어요.', 'Tôi đã mua bánh mì và sữa.', 'I bought bread and milk.', 'Ppanghago uyureul sasseoyo.'),
          ex('친구**랑** 영화를 봤어요.', 'Tôi đã xem phim với bạn.', 'I watched a film with a friend.', 'Chingurang yeonghwareul bwasseoyo.'),
          ex('한국**과** 베트남은 가까워요.', 'Hàn Quốc và Việt Nam gần nhau.', 'Korea and Vietnam are close.', 'Hangukgwa Beteunameun gakkawoyo.'),
          ex('누구**하고** 같이 가요?', 'Bạn đi cùng với ai?', 'Who are you going with?', 'Nuguhago gachi gayo?'),
        ],
      },
    ],
    tips: [l('Các tiểu từ này chỉ nối **danh từ**. Muốn nối hai mệnh đề, dùng **-고** (xem bài Nối câu).', 'These particles join **nouns** only. To join clauses, use **-고** (see the lesson on joining clauses).')],
  },
  {
    id: 'more-particles',
    level: 'A1',
    title: l('에게/한테, 부터/까지, (으)로', '에게/한테, 부터/까지, (으)로'),
    summary: l('Cho ai (에게/한테), từ… đến… (부터/까지, 에서/까지), bằng / về hướng ((으)로).', 'To someone (에게/한테), from… to… (부터/까지, 에서/까지), by / toward ((으)로).'),
    sections: [
      {
        table: table(
          [l('Tiểu từ', 'Particle'), MEANING, EXAMPLE],
          [
            ['에게 / 한테', l('cho, với (người, động vật); 한테 dùng trong văn nói', 'to (people, animals); 한테 is spoken'), '친구**한테** 선물을 줬어요.'],
            ['께', l('cho (kính ngữ)', 'to (honorific)'), '선생님**께** 편지를 썼어요.'],
            ['에게서 / 한테서', l('từ (ai đó)', 'from (someone)'), '엄마**한테서** 전화가 왔어요.'],
            ['부터 … 까지', l('từ … đến … (thời gian)', 'from… until… (time)'), '9시**부터** 6시**까지** 일해요.'],
            ['에서 … 까지', l('từ … đến … (nơi chốn)', 'from… to… (place)'), '집**에서** 회사**까지** 30분 걸려요.'],
            ['(으)로', l('bằng (phương tiện, công cụ); về hướng', 'by (means, tool); toward'), '버스**로** 가요.'],
          ],
        ),
      },
      {
        title: l('(으)로: chọn 으로 hay 로?', '(으)로: 으로 or 로?'),
        body: l(
          'Sau phụ âm dùng **으로** (손으로); sau nguyên âm **và sau ㄹ** dùng **로** (버스로, 지하철로).',
          'After a consonant use **으로** (손으로); after a vowel **or ㄹ** use **로** (버스로, 지하철로).',
        ),
        examples: [
          ex('지하철**로** 학교에 가요.', 'Tôi đi học bằng tàu điện ngầm.', 'I go to school by subway.', 'Jihacheollo hakgyoe gayo.'),
          ex('젓가락**으로** 먹어요.', 'Tôi ăn bằng đũa.', 'I eat with chopsticks.', 'Jeotgarageuro meogeoyo.'),
          ex('한국어**로** 말해 주세요.', 'Hãy nói bằng tiếng Hàn giúp tôi.', 'Please say it in Korean.', 'Hangugeoro malhae juseyo.'),
          ex('오른쪽**으로** 가세요.', 'Hãy đi về bên phải.', 'Go to the right.', 'Oreunjjogeuro gaseyo.'),
        ],
      },
    ],
    tips: [l('에게/한테 chỉ dùng cho **người và động vật**; với đồ vật hay nơi chốn dùng **에**: 회사**에** 전화했어요.', '에게/한테 are only for **people and animals**; for things and places use **에**: 회사**에** 전화했어요.')],
  },
  {
    id: 'itda-eopda',
    level: 'A1',
    title: l('있다 / 없다: có, ở', '있다 / 없다: to have, to be somewhere'),
    summary: l('있어요 (có, ở) và 없어요 (không có, không ở) — dùng cho cả người lẫn vật.', '있어요 (there is, have, be at) and 없어요 (there isn\'t, don\'t have) — for people and things alike.'),
    sections: [
      {
        table: table(
          [MEANING, PATTERN, EXAMPLE],
          [
            [l('Có (sở hữu)', 'Have'), 'N이/가 있어요', '동생**이 있어요**.'],
            [l('Không có', 'Not have'), 'N이/가 없어요', '시간**이 없어요**.'],
            [l('Ở đâu đó', 'Be somewhere'), l('N은/는 [nơi chốn]에 있어요', 'N은/는 [place]에 있어요'), '화장실은 2층**에 있어요**.'],
          ],
        ),
      },
      {
        title: l('Từ chỉ vị trí', 'Position words'),
        body: l(
          '**N + vị trí + 에 있어요**: 위 (trên), 아래 / 밑 (dưới), 앞 (trước), 뒤 (sau), 안 (trong), 밖 (ngoài), 옆 (bên cạnh), 사이 (giữa).',
          '**N + position + 에 있어요**: 위 (on, above), 아래 / 밑 (under), 앞 (in front), 뒤 (behind), 안 (inside), 밖 (outside), 옆 (next to), 사이 (between).',
        ),
        examples: [
          ex('책상 **위에** 책이 있어요.', 'Trên bàn có quyển sách.', 'There is a book on the desk.', 'Chaeksang wie chaegi isseoyo.'),
          ex('은행은 우체국 **옆에** 있어요.', 'Ngân hàng ở bên cạnh bưu điện.', 'The bank is next to the post office.', 'Eunhaengeun ucheguk yeope isseoyo.'),
          ex('지금 집에 아무도 **없어요**.', 'Bây giờ ở nhà không có ai cả.', 'Nobody is at home now.', 'Jigeum jibe amudo eopseoyo.'),
        ],
      },
      {
        title: l('Từ ghép với 있다 / 없다', 'Words built with 있다 / 없다'),
        table: table(
          [l('Từ', 'Word'), MEANING],
          [
            ['맛있다 / 맛없다', l('ngon / dở', 'tasty / not tasty')],
            ['재미있다 / 재미없다', l('thú vị / chán', 'fun / boring')],
            ['멋있다', l('ngầu, phong cách', 'cool, stylish')],
          ],
        ),
      },
    ],
    tips: [l('Với người trên, 있다 (ở) đổi thành **계시다**: 할머니께서 집에 계세요.', 'For respected people, 있다 (be somewhere) becomes **계시다**: 할머니께서 집에 계세요.')],
  },
  {
    id: 'demonstratives',
    level: 'A1',
    title: l('이, 그, 저: này, đó, kia', '이, 그, 저: this, that, that over there'),
    summary: l('Từ chỉ định theo khoảng cách và các dạng rút gọn hay dùng.', 'Demonstratives by distance and their everyday short forms.'),
    sections: [
      {
        body: l(
          '**이** = gần người nói, **그** = gần người nghe (hoặc điều vừa nhắc đến), **저** = xa cả hai, **어느** = nào?',
          '**이** = near the speaker, **그** = near the listener (or just mentioned), **저** = far from both, **어느** = which?',
        ),
        table: table(
          ['', '이', '그', '저', l('Hỏi', 'Question')],
          [
            [l('+ danh từ', '+ noun'), '이 책', '그 책', '저 책', '어느 책'],
            [l('Đồ vật', 'Thing'), '이것 (이거)', '그것 (그거)', '저것 (저거)', '어느 것'],
            [l('Nơi chốn', 'Place'), '여기', '거기', '저기', '어디'],
          ],
        ),
      },
      {
        title: l('Dạng rút gọn trong văn nói', 'Spoken short forms'),
        table: table(
          [l('Đầy đủ', 'Full'), l('Rút gọn', 'Short')],
          [
            ['이것은', '이건'],
            ['이것이', '이게'],
            ['이것을', '이걸'],
          ],
        ),
        examples: [
          ex('**이거** 뭐예요?', 'Cái này là gì?', 'What is this?', 'Igeo mwoyeyo?'),
          ex('**저** 사람은 누구예요?', 'Người kia là ai?', 'Who is that person?', 'Jeo sarameun nuguyeyo?'),
          ex('화장실이 **어디**예요? ― **저기**예요.', 'Nhà vệ sinh ở đâu? ― Ở đằng kia.', 'Where is the toilet? ― Over there.', 'Hwajangsiri eodiyeyo? ― Jeogiyeyo.'),
          ex('**이** 가방 얼마예요?', 'Cái túi này bao nhiêu tiền?', 'How much is this bag?', 'I gabang eolmayeyo?'),
        ],
      },
    ],
  },
  {
    id: 'question-words',
    level: 'A1',
    title: l('Từ để hỏi', 'Question words'),
    summary: l('뭐, 누구, 어디, 언제, 왜, 어떻게, 얼마, 몇, 어느, 무슨, 어떤.', '뭐, 누구, 어디, 언제, 왜, 어떻게, 얼마, 몇, 어느, 무슨, 어떤.'),
    sections: [
      {
        body: l(
          'Câu hỏi giữ nguyên trật tự từ và **lên giọng ở cuối**. Từ để hỏi đứng ở vị trí của thông tin cần hỏi.',
          'Questions keep the normal word order and **rise at the end**. The question word goes where the answer would be.',
        ),
        table: table(
          [l('Từ', 'Word'), MEANING, EXAMPLE],
          [
            ['뭐 / 무엇', l('cái gì', 'what'), '이름이 **뭐**예요?'],
            ['누구', l('ai', 'who'), '저 사람은 **누구**예요?'],
            ['어디', l('ở đâu', 'where'), '집이 **어디**예요?'],
            ['언제', l('khi nào', 'when'), '생일이 **언제**예요?'],
            ['왜', l('tại sao', 'why'), '**왜** 안 와요?'],
            ['어떻게', l('như thế nào, bằng cách nào', 'how'), '**어떻게** 가요?'],
            ['얼마', l('bao nhiêu tiền', 'how much'), '이거 **얼마**예요?'],
            ['몇', l('mấy (+ đơn vị đếm)', 'how many (+ counter)'), '**몇** 살이에요?'],
            ['어느', l('nào (trong số đã biết)', 'which (of known options)'), '**어느** 나라 사람이에요?'],
            ['무슨', l('gì, loại gì', 'what (kind of)'), '**무슨** 음식을 좋아해요?'],
            ['어떤', l('như thế nào (tính chất)', 'what sort of'), '**어떤** 사람이에요?'],
          ],
        ),
        examples: [
          ex('이름이 **뭐**예요? ― 린이에요.', 'Bạn tên là gì? ― Mình là Linh.', 'What\'s your name? ― I\'m Linh.', 'Ireumi mwoyeyo? ― Rinieyo.'),
          ex('**어느** 나라 사람이에요? ― 베트남 사람이에요.', 'Bạn là người nước nào? ― Tôi là người Việt Nam.', 'Where are you from? ― I\'m Vietnamese.', 'Eoneu nara saramieyo? ― Beteunam saramieyo.'),
          ex('**몇** 살이에요? ― 스물다섯 살이에요.', 'Bạn bao nhiêu tuổi? ― Tôi 25 tuổi.', 'How old are you? ― I\'m 25.', 'Myeot sarieyo? ― Seumuldaseot sarieyo.'),
        ],
      },
    ],
    tips: [l('Khi "ai" làm chủ ngữ, dùng **누가** (= 누구 + 가): **누가** 왔어요? (ai đến vậy?)', 'When "who" is the subject, use **누가** (= 누구 + 가): **누가** 왔어요? (who came?)')],
  },
  {
    id: 'numbers-counters',
    level: 'A1',
    title: l('Hai hệ số đếm và đơn vị đếm', 'Two number systems and counters'),
    summary: l('Số Hán Hàn (일, 이, 삼…) và số thuần Hàn (하나, 둘, 셋…): dùng hệ nào cho việc gì.', 'Sino-Korean (일, 이, 삼…) and native Korean (하나, 둘, 셋…) numbers, and when to use each.'),
    sections: [
      {
        table: table(
          [l('Số', 'Number'), l('Hán Hàn', 'Sino-Korean'), l('Thuần Hàn', 'Native Korean'), l('Thuần Hàn + đơn vị', 'Native + counter')],
          [
            ['1', '일 (il)', '하나 (hana)', '**한** 개'],
            ['2', '이 (i)', '둘 (dul)', '**두** 개'],
            ['3', '삼 (sam)', '셋 (set)', '**세** 개'],
            ['4', '사 (sa)', '넷 (net)', '**네** 개'],
            ['5', '오 (o)', '다섯 (daseot)', '다섯 개'],
            ['6', '육 (yuk)', '여섯 (yeoseot)', '여섯 개'],
            ['7', '칠 (chil)', '일곱 (ilgop)', '일곱 개'],
            ['8', '팔 (pal)', '여덟 (yeodeol)', '여덟 개'],
            ['9', '구 (gu)', '아홉 (ahop)', '아홉 개'],
            ['10', '십 (sip)', '열 (yeol)', '열 개'],
            ['20', '이십 (isip)', '스물 (seumul)', '**스무** 개'],
            ['100', '백 (baek)', '—', '—'],
            [l('1.000', '1,000'), '천 (cheon)', '—', '—'],
            [l('10.000', '10,000'), '만 (man)', '—', '—'],
          ],
        ),
      },
      {
        title: l('Dùng hệ nào?', 'Which system?'),
        table: table(
          [l('Hệ số', 'System'), l('Dùng cho', 'Used for'), EXAMPLE],
          [
            [l('Hán Hàn', 'Sino-Korean'), l('tiền, số điện thoại, phút, ngày tháng năm, số tầng, số phòng', 'money, phone numbers, minutes, dates, floors, room numbers'), '오천 원, 십 분, 삼 층'],
            [l('Thuần Hàn', 'Native Korean'), l('đếm đồ vật, người, tuổi, giờ, số lần', 'counting things and people, age, hours, number of times'), '사과 두 개, 세 시, 스무 살'],
          ],
        ),
      },
      {
        title: l('Đơn vị đếm thông dụng', 'Common counters'),
        table: table(
          [l('Đơn vị', 'Counter'), l('Dùng cho', 'Used for'), EXAMPLE],
          [
            ['개', l('đồ vật nói chung', 'things in general'), '사과 세 **개**'],
            ['명 / 분', l('người / người (kính trọng)', 'people / people (honorific)'), '학생 다섯 **명**'],
            ['살', l('tuổi', 'years of age'), '스무 **살**'],
            ['마리', l('con vật', 'animals'), '고양이 두 **마리**'],
            ['권', l('quyển (sách, vở)', 'books'), '책 한 **권**'],
            ['잔', l('cốc, ly', 'cups, glasses'), '커피 한 **잔**'],
            ['병', l('chai', 'bottles'), '맥주 두 **병**'],
            ['장', l('tờ, tấm (giấy, vé)', 'sheets, tickets'), '표 세 **장**'],
            ['번', l('lần', 'times'), '두 **번**'],
            ['원', l('won (tiền) — dùng số Hán Hàn', 'won (money) — Sino-Korean numbers'), '만 **원**'],
          ],
        ),
        examples: [
          ex('사과 **두 개** 주세요.', 'Cho tôi hai quả táo.', 'Two apples, please.', 'Sagwa du gae juseyo.'),
          ex('커피 **한 잔**에 **사천오백 원**이에요.', 'Một cốc cà phê giá 4.500 won.', 'One coffee is 4,500 won.', 'Keopi han jane sacheonobaek wonieyo.'),
          ex('우리 가족은 **네 명**이에요.', 'Gia đình tôi có bốn người.', 'There are four people in my family.', 'Uri gajogeun ne myeongieyo.'),
        ],
      },
    ],
    tips: [
      l('하나, 둘, 셋, 넷, 스물 đứng trước đơn vị đếm thì rút gọn thành **한, 두, 세, 네, 스무**.', '하나, 둘, 셋, 넷 and 스물 shorten to **한, 두, 세, 네, 스무** before a counter.'),
      l('Số Hán Hàn rất giống âm Hán Việt: 삼 (tam), 오 (ngũ), 십 (thập), 백 (bách), 천 (thiên), 만 (vạn).', 'Sino-Korean numbers come from Chinese: 삼 (3), 오 (5), 십 (10), 백 (100), 천 (1,000), 만 (10,000).'),
    ],
  },
  {
    id: 'time-dates',
    level: 'A1',
    title: l('Giờ, thứ, ngày tháng', 'Time, days and dates'),
    summary: l('Giờ dùng số thuần Hàn, phút dùng số Hán Hàn; các thứ trong tuần; ngày tháng năm.', 'Hours use native numbers, minutes use Sino-Korean; days of the week; dates.'),
    sections: [
      {
        title: l('Giờ và phút', 'Hours and minutes'),
        body: l(
          '**Giờ** = số thuần Hàn + **시**; **phút** = số Hán Hàn + **분**. 반 = rưỡi, 오전 = buổi sáng (AM), 오후 = buổi chiều (PM).',
          '**Hours** = native number + **시**; **minutes** = Sino-Korean number + **분**. 반 = half past, 오전 = a.m., 오후 = p.m.',
        ),
        examples: [
          ex('지금 몇 시예요? ― **세 시 반**이에요.', 'Bây giờ là mấy giờ? ― 3 giờ rưỡi.', 'What time is it now? ― Half past three.', 'Jigeum myeot siyeyo? ― Se si banieyo.'),
          ex('**오후 두 시 십오 분**에 만나요.', 'Gặp nhau lúc 2 giờ 15 chiều nhé.', 'Let\'s meet at 2:15 p.m.', 'Ohu du si sibo bune mannayo.'),
        ],
      },
      {
        title: l('Thứ trong tuần', 'Days of the week'),
        table: table(
          [l('Thứ', 'Day'), l('Tiếng Hàn', 'Korean'), l('Phiên âm', 'Romanisation')],
          [
            [l('Thứ Hai', 'Monday'), '월요일', 'woryoil'],
            [l('Thứ Ba', 'Tuesday'), '화요일', 'hwayoil'],
            [l('Thứ Tư', 'Wednesday'), '수요일', 'suyoil'],
            [l('Thứ Năm', 'Thursday'), '목요일', 'mogyoil'],
            [l('Thứ Sáu', 'Friday'), '금요일', 'geumyoil'],
            [l('Thứ Bảy', 'Saturday'), '토요일', 'toyoil'],
            [l('Chủ nhật', 'Sunday'), '일요일', 'iryoil'],
          ],
        ),
      },
      {
        title: l('Ngày tháng', 'Dates'),
        body: l(
          'Năm, tháng, ngày đều dùng số Hán Hàn: **년, 월, 일**. Hai tháng đặc biệt: **6월 = 유월**, **10월 = 시월**. Thứ tự: năm → tháng → ngày.',
          'Years, months and days all use Sino-Korean numbers: **년, 월, 일**. Two irregular months: **6월 = 유월**, **10월 = 시월**. Order: year → month → day.',
        ),
        examples: [
          ex('생일이 언제예요? ― **시월 구 일**이에요.', 'Sinh nhật bạn khi nào? ― Ngày 9 tháng 10.', 'When is your birthday? ― 9 October.', 'Saengiri eonjeyeyo? ― Siwol gu irieyo.'),
          ex('저는 **이천오 년 오월 십 일**에 태어났어요.', 'Tôi sinh ngày 10 tháng 5 năm 2005.', 'I was born on 10 May 2005.', 'Jeoneun icheono nyeon owol sip ire taeeonasseoyo.'),
        ],
      },
    ],
    tips: [
      l('Từ chỉ thời gian hay dùng: 오늘 (hôm nay), 내일 (ngày mai), 어제 (hôm qua), 주말 (cuối tuần), 지난주 (tuần trước), 다음 주 (tuần sau).', 'Useful time words: 오늘 (today), 내일 (tomorrow), 어제 (yesterday), 주말 (weekend), 지난주 (last week), 다음 주 (next week).'),
    ],
  },
  {
    id: 'haeyo-present',
    level: 'A1',
    title: l('Đuôi -아요/어요 (hiện tại)', 'The -아요/어요 present tense'),
    summary: l('Thể lịch sự thân thiện dùng nhiều nhất: chia theo nguyên âm cuối của gốc động từ.', 'The everyday polite form: conjugated by the stem\'s last vowel.'),
    sections: [
      {
        body: l('Bỏ **다** khỏi động từ nguyên mẫu để lấy **gốc**. Sau đó nhìn **nguyên âm cuối** của gốc:', 'Remove **다** from the dictionary form to get the **stem**. Then look at the stem\'s **last vowel**:'),
        table: table(
          [RULE, ENDING, EXAMPLE],
          [
            [l('Nguyên âm cuối là **ㅏ hoặc ㅗ**', 'Last vowel is **ㅏ or ㅗ**'), '-아요', '살다 → 살**아요**, 좋다 → 좋**아요**'],
            [l('Nguyên âm khác', 'Any other vowel'), '-어요', '먹다 → 먹**어요**, 읽다 → 읽**어요**'],
            [l('Động từ **하다**', '**하다** verbs'), '-해요', '공부하다 → 공부**해요**'],
          ],
        ),
      },
      {
        title: l('Rút gọn khi gốc kết thúc bằng nguyên âm', 'Contractions when the stem ends in a vowel'),
        table: table(
          [STEM, l('Rút gọn', 'Contraction'), EXAMPLE],
          [
            ['ㅏ + 아요', 'ㅏ요', '가다 → **가요**, 자다 → **자요**'],
            ['ㅓ + 어요', 'ㅓ요', '서다 → **서요**'],
            ['ㅗ + 아요', 'ㅘ요', '오다 → **와요**, 보다 → **봐요**'],
            ['ㅜ + 어요', 'ㅝ요', '주다 → **줘요**, 배우다 → **배워요**'],
            ['ㅣ + 어요', 'ㅕ요', '마시다 → **마셔요**, 기다리다 → **기다려요**'],
            ['ㅐ + 어요', 'ㅐ요', '보내다 → **보내요**'],
            ['되 + 어요', '돼요', '되다 → **돼요**'],
          ],
        ),
      },
      {
        body: l(
          'Cùng một dạng -아요/어요 dùng cho **câu kể, câu hỏi, rủ rê và mệnh lệnh nhẹ** — chỉ khác nhau ở ngữ điệu.',
          'The same -아요/어요 form works for **statements, questions, suggestions and soft commands** — only the intonation changes.',
        ),
        examples: [
          ex('저는 서울에 **살아요**.', 'Tôi sống ở Seoul.', 'I live in Seoul.', 'Jeoneun Seoure sarayo.'),
          ex('매일 한국어를 **공부해요**.', 'Mỗi ngày tôi học tiếng Hàn.', 'I study Korean every day.', 'Maeil hangugeoreul gongbuhaeyo.'),
          ex('뭐 **마셔요**? ― 커피 **마셔요**.', 'Bạn uống gì? ― Tôi uống cà phê.', 'What are you drinking? ― Coffee.', 'Mwo masyeoyo? ― Keopi masyeoyo.'),
          ex('같이 **가요**!', 'Cùng đi nào!', 'Let\'s go together!', 'Gachi gayo!'),
        ],
      },
    ],
    tips: [l('Dạng này dùng cho cả hiện tại đơn lẫn tiếp diễn: 먹어요 = "ăn" hoặc "đang ăn".', 'This form covers both the simple and the continuous present: 먹어요 = "eat" or "am eating".')],
  },
  {
    id: 'formal-seumnida',
    level: 'A1',
    title: l('Đuôi trang trọng -ㅂ니다/습니다', 'The formal -ㅂ니다/습니다'),
    summary: l('Dùng trong tin tức, thuyết trình, công việc và lời chào trang trọng.', 'Used in news, presentations, at work and in formal greetings.'),
    sections: [
      {
        table: table(
          [STEM, l('Câu kể', 'Statement'), l('Câu hỏi', 'Question'), EXAMPLE],
          [
            [l('kết thúc bằng nguyên âm', 'ends in a vowel'), '-ㅂ니다', '-ㅂ니까?', '가다 → **갑니다 / 갑니까?**'],
            [l('kết thúc bằng phụ âm', 'ends in a consonant'), '-습니다', '-습니까?', '먹다 → **먹습니다 / 먹습니까?**'],
            [l('kết thúc bằng ㄹ', 'ends in ㄹ'), l('bỏ ㄹ + -ㅂ니다', 'drop ㄹ + -ㅂ니다'), l('bỏ ㄹ + -ㅂ니까?', 'drop ㄹ + -ㅂ니까?'), '살다 → **삽니다 / 삽니까?**'],
          ],
        ),
        examples: [
          ex('**감사합니다**.', 'Cảm ơn ạ.', 'Thank you.', 'Gamsahamnida.'),
          ex('처음 **뵙겠습니다**.', 'Rất hân hạnh được gặp (lần đầu).', 'How do you do?', 'Cheoeum boepgetseumnida.'),
          ex('회의는 세 시에 **시작합니다**.', 'Cuộc họp bắt đầu lúc 3 giờ.', 'The meeting starts at 3.', 'Hoeuineun se sie sijakamnida.'),
          ex('어디에서 **오셨습니까**?', 'Quý khách từ đâu đến ạ?', 'Where have you come from?', 'Eodieseo osyeotseumnikka?'),
        ],
      },
      {
        title: l('Phát âm', 'Pronunciation'),
        body: l('-ㅂ니다 đọc là **[ㅁ니다]** do biến âm mũi: 합니다 → [함니다].', '-ㅂ니다 is pronounced **[ㅁ니다]** because of nasalisation: 합니다 → [함니다].'),
      },
    ],
    tips: [
      l('Người mới học: dùng -아요/어요 trong hội thoại hằng ngày, còn -ㅂ니다/습니다 cho các câu chào cố định và khi phát biểu.', 'As a beginner, use -아요/어요 in everyday conversation and -ㅂ니다/습니다 for set greetings and speeches.'),
    ],
  },
  {
    id: 'past-tense',
    level: 'A1',
    title: l('Thì quá khứ -았/었어요', 'Past tense -았/었어요'),
    summary: l('Thêm -았/었/했- vào gốc động từ, theo cùng quy tắc nguyên âm như -아요/어요.', 'Add -았/었/했- to the stem, using the same vowel rule as -아요/어요.'),
    sections: [
      {
        table: table(
          [RULE, ENDING, EXAMPLE],
          [
            [l('Nguyên âm cuối ㅏ / ㅗ', 'Last vowel ㅏ / ㅗ'), '-았어요', '가다 → **갔어요**, 오다 → **왔어요**, 좋다 → 좋**았어요**'],
            [l('Nguyên âm khác', 'Other vowels'), '-었어요', '먹다 → 먹**었어요**, 마시다 → **마셨어요**'],
            ['하다', '-했어요', '공부하다 → 공부**했어요**'],
            [l('Danh từ', 'Noun'), '-이었어요 / -였어요', '학생**이었어요**, 의사**였어요**'],
          ],
        ),
        examples: [
          ex('어제 친구를 **만났어요**.', 'Hôm qua tôi đã gặp bạn.', 'I met a friend yesterday.', 'Eoje chingureul mannasseoyo.'),
          ex('아침에 빵을 **먹었어요**.', 'Buổi sáng tôi đã ăn bánh mì.', 'I had bread this morning.', 'Achime ppangeul meogeosseoyo.'),
          ex('주말에 뭐 **했어요**? ― 집에서 **쉬었어요**.', 'Cuối tuần bạn đã làm gì? ― Tôi nghỉ ngơi ở nhà.', 'What did you do at the weekend? ― I rested at home.', 'Jumare mwo haesseoyo? ― Jibeseo swieosseoyo.'),
          ex('영화가 정말 **재미있었어요**.', 'Bộ phim thật sự rất hay.', 'The film was really fun.', 'Yeonghwaga jeongmal jaemiisseosseoyo.'),
        ],
      },
      {
        title: l('Dạng trang trọng', 'Formal form'),
        body: l('-았/었**습니다**: 갔습니다, 먹었습니다, 했습니다.', '-았/었**습니다**: 갔습니다, 먹었습니다, 했습니다.'),
      },
    ],
    tips: [l('Mẹo: lấy dạng -아요/어요, bỏ 요 rồi thêm **ㅆ어요**: 가요 → 갔어요, 마셔요 → 마셨어요.', 'Shortcut: take the -아요/어요 form, drop 요 and add **ㅆ어요**: 가요 → 갔어요, 마셔요 → 마셨어요.')],
  },
  {
    id: 'future',
    level: 'A1',
    title: l('Tương lai và lời hứa', 'Future and promises'),
    summary: l('-(으)ㄹ 거예요 (sẽ), -(으)ㄹ게요 (tôi sẽ… — hứa, quyết định), -겠- (sẽ, trang trọng; đoán).', '-(으)ㄹ 거예요 (will), -(으)ㄹ게요 (I\'ll… — a promise), -겠- (will, formal; guessing).'),
    sections: [
      {
        title: l('-(으)ㄹ 거예요: sẽ, chắc sẽ', '-(으)ㄹ 거예요: will, probably will'),
        table: table(
          [STEM, ENDING, EXAMPLE],
          [
            [l('kết thúc bằng nguyên âm hoặc ㄹ', 'ends in a vowel or ㄹ'), '-ㄹ 거예요', '가다 → **갈 거예요**, 만들다 → **만들 거예요**'],
            [l('kết thúc bằng phụ âm', 'ends in a consonant'), '-을 거예요', '먹다 → **먹을 거예요**'],
          ],
        ),
        examples: [
          ex('내일 부산에 **갈 거예요**.', 'Ngày mai tôi sẽ đi Busan.', 'I\'m going to Busan tomorrow.', 'Naeil Busane gal geoyeyo.'),
          ex('주말에 뭐 **할 거예요**?', 'Cuối tuần bạn sẽ làm gì?', 'What are you going to do at the weekend?', 'Jumare mwo hal geoyeyo?'),
          ex('오후에 비가 **올 거예요**.', 'Chiều nay chắc trời sẽ mưa.', 'It\'s probably going to rain this afternoon.', 'Ohue biga ol geoyeyo.'),
        ],
      },
      {
        title: l('-(으)ㄹ게요: tôi sẽ (hứa, quyết định)', '-(으)ㄹ게요: I\'ll… (promise, decision)'),
        body: l('Chỉ dùng cho **người nói**, khi quyết định hoặc hứa làm điều gì có liên quan đến người nghe.', 'Only for **the speaker**, deciding or promising something that concerns the listener.'),
        examples: [
          ex('제가 **도와줄게요**.', 'Để tôi giúp bạn.', 'I\'ll help you.', 'Jega dowajulgeyo.'),
          ex('내일 다시 **전화할게요**.', 'Mai tôi sẽ gọi lại.', 'I\'ll call you back tomorrow.', 'Naeil dasi jeonhwahalgeyo.'),
        ],
      },
      {
        title: l('-겠-: sẽ (trang trọng), đoán', '-겠-: will (formal), guessing'),
        examples: [
          ex('잘 **먹겠습니다**.', 'Tôi xin phép ăn ạ. (câu nói trước bữa ăn)', 'Thank you for the meal. (said before eating)', 'Jal meokgetseumnida.'),
          ex('맛있**겠어요**!', 'Trông có vẻ ngon quá!', 'That looks delicious!', 'Masitgesseoyo!'),
        ],
      },
    ],
    tips: [l('거예요 đọc là **[꺼예요]**: 갈 거예요 → [갈 꺼예요].', '거예요 is pronounced **[꺼예요]**: 갈 거예요 → [갈 꺼예요].')],
  },
  {
    id: 'negation',
    level: 'A1',
    title: l('Phủ định: 안 và 못', 'Negation: 안 and 못'),
    summary: l('안 / -지 않다: không (không muốn hoặc đơn giản là không); 못 / -지 못하다: không thể.', '안 / -지 않다: not (choose not to, or simply not); 못 / -지 못하다: cannot.'),
    sections: [
      {
        table: table(
          [l('Loại', 'Type'), l('Dạng ngắn', 'Short form'), l('Dạng dài', 'Long form'), MEANING],
          [
            [l('Không', 'Not'), '**안** 가요', '가**지 않아요**', l('không đi', 'don\'t go')],
            [l('Không thể', 'Cannot'), '**못** 가요', '가**지 못해요**', l('không đi được', 'can\'t go')],
          ],
        ),
      },
      {
        title: l('Động từ 하다', '하다 verbs'),
        body: l(
          'Với động từ dạng **danh từ + 하다**, đặt 안 / 못 **ngay trước 하다**: 공부 **안** 해요 (không nói "안 공부해요").',
          'With **noun + 하다** verbs, put 안 / 못 **right before 하다**: 공부 **안** 해요 (not "안 공부해요").',
        ),
        examples: [
          ex('저는 고기를 **안** 먹어요.', 'Tôi không ăn thịt.', 'I don\'t eat meat.', 'Jeoneun gogireul an meogeoyo.'),
          ex('오늘은 운동 **안** 했어요.', 'Hôm nay tôi không tập thể dục.', 'I didn\'t exercise today.', 'Oneureun undong an haesseoyo.'),
          ex('수영을 **못** 해요.', 'Tôi không biết bơi.', 'I can\'t swim.', 'Suyeongeul mot haeyo.'),
          ex('바빠서 **못** 갔어요.', 'Vì bận nên tôi không đi được.', 'I was busy, so I couldn\'t go.', 'Bappaseo mot gasseoyo.'),
          ex('별로 맵**지 않아요**.', 'Không cay lắm.', 'It\'s not very spicy.', 'Byeollo maepji anayo.'),
        ],
      },
      {
        title: l('Những từ có dạng phủ định riêng', 'Words with their own negative'),
        table: table(
          [l('Khẳng định', 'Positive'), l('Phủ định', 'Negative')],
          [
            [l('있다 (có)', '있다 (have)'), l('**없다** (không có)', '**없다** (not have)')],
            [l('알다 (biết)', '알다 (know)'), l('**모르다** (không biết)', '**모르다** (not know)')],
            [l('이다 (là)', '이다 (be)'), l('**아니다** (không phải là)', '**아니다** (not be)')],
            [l('맛있다 (ngon)', '맛있다 (tasty)'), l('**맛없다** (dở)', '**맛없다** (not tasty)')],
          ],
        ),
      },
    ],
    tips: [l('Không nói "안 있어요" hay "안 알아요": hãy dùng **없어요** và **몰라요**.', 'Don\'t say "안 있어요" or "안 알아요": use **없어요** and **몰라요**.')],
  },
  {
    id: 'want',
    level: 'A1',
    title: l('Muốn: -고 싶다', 'Wanting: -고 싶다'),
    summary: l('Gốc động từ + 고 싶어요: muốn làm gì; người thứ ba dùng -고 싶어 하다.', 'Stem + 고 싶어요: want to do; for someone else use -고 싶어 하다.'),
    sections: [
      {
        body: l('**Gốc động từ + 고 싶어요**. Phủ định: **-고 싶지 않아요** hoặc 안 + V-고 싶어요.', '**Stem + 고 싶어요**. Negative: **-고 싶지 않아요** or 안 + V-고 싶어요.'),
        examples: [
          ex('한국에 **가고 싶어요**.', 'Tôi muốn đi Hàn Quốc.', 'I want to go to Korea.', 'Hanguge gago sipeoyo.'),
          ex('뭐 **먹고 싶어요**? ― 비빔밥을 **먹고 싶어요**.', 'Bạn muốn ăn gì? ― Tôi muốn ăn bibimbap.', 'What do you want to eat? ― I want bibimbap.', 'Mwo meokgo sipeoyo? ― Bibimbabeul meokgo sipeoyo.'),
          ex('오늘은 아무것도 **하고 싶지 않아요**.', 'Hôm nay tôi chẳng muốn làm gì cả.', 'I don\'t feel like doing anything today.', 'Oneureun amugeotdo hago sipji anayo.'),
        ],
      },
      {
        title: l('Người thứ ba: -고 싶어 하다', 'Someone else: -고 싶어 하다'),
        body: l(
          '-고 싶다 diễn tả mong muốn của **người nói** (hoặc để hỏi người nghe). Nói về người khác dùng **-고 싶어 해요**.',
          '-고 싶다 expresses **the speaker\'s** wish (or asks the listener). For other people use **-고 싶어 해요**.',
        ),
        examples: [ex('동생이 강아지를 **키우고 싶어 해요**.', 'Em tôi muốn nuôi một chú cún.', 'My younger sibling wants to have a puppy.', 'Dongsaengi gangajireul kiugo sipeo haeyo.')],
      },
    ],
    tips: [l('Muốn **có** một vật: **N이/가 갖고 싶어요** (tôi muốn có …) hoặc N이/가 필요해요 (tôi cần …).', 'To want to **have** something: **N이/가 갖고 싶어요**, or N이/가 필요해요 (I need…).')],
  },
  {
    id: 'requests',
    level: 'A1',
    title: l('Nhờ vả và yêu cầu', 'Requests'),
    summary: l('-(으)세요 (hãy…), -아/어 주세요 (làm giúp tôi…), -지 마세요 (đừng…).', '-(으)세요 (please do…), -아/어 주세요 (please do… for me), -지 마세요 (please don\'t…).'),
    sections: [
      {
        table: table(
          [PATTERN, MEANING, EXAMPLE],
          [
            ['-(으)세요', l('hãy … (lịch sự)', 'please do… (polite)'), '여기 **앉으세요**.'],
            ['-아/어 주세요', l('làm … giúp tôi', 'please do… for me'), '천천히 **말해 주세요**.'],
            [l('N 주세요', 'N 주세요'), l('cho tôi …', '… please (give me)'), '물 **주세요**.'],
            ['-지 마세요', l('đừng …', 'please don\'t…'), '걱정**하지 마세요**.'],
          ],
        ),
      },
      {
        title: l('-(으)세요: chọn 으세요 hay 세요?', '-(으)세요: 으세요 or 세요?'),
        body: l(
          'Gốc kết thúc bằng **nguyên âm** + 세요 (가세요); bằng **phụ âm** + 으세요 (읽으세요); bằng **ㄹ** thì bỏ ㄹ + 세요 (만들다 → 만드세요).',
          'Stem ending in a **vowel** + 세요 (가세요); in a **consonant** + 으세요 (읽으세요); in **ㄹ**, drop the ㄹ + 세요 (만들다 → 만드세요).',
        ),
        examples: [
          ex('안녕히 **가세요**.', 'Đi về cẩn thận nhé. (nói với người ra về)', 'Goodbye. (to someone who is leaving)', 'Annyeonghi gaseyo.'),
          ex('안녕히 **계세요**.', 'Ở lại mạnh khoẻ nhé. (nói khi mình là người ra về)', 'Goodbye. (when you are the one leaving)', 'Annyeonghi gyeseyo.'),
          ex('사진 좀 **찍어 주세요**.', 'Chụp giúp tôi tấm ảnh với.', 'Could you take a photo for me?', 'Sajin jom jjigeo juseyo.'),
          ex('여기에서 담배를 **피우지 마세요**.', 'Đừng hút thuốc ở đây.', 'Please don\'t smoke here.', 'Yeogieseo dambaereul piuji maseyo.'),
        ],
      },
    ],
    tips: [l('Thêm **좀** (một chút) để lời nhờ nhẹ nhàng hơn: 좀 도와주세요 (giúp tôi với).', 'Add **좀** ("a little") to soften a request: 좀 도와주세요 (please help me).')],
  },
  {
    id: 'suggestions',
    level: 'A1',
    title: l('Rủ rê và hỏi ý kiến', 'Suggestions and offers'),
    summary: l('-(으)ㄹ까요? (… nhé?), -아/어요 (cùng … đi), -(으)ㅂ시다 (hãy cùng…).', '-(으)ㄹ까요? (shall we / shall I…?), -아/어요 (let\'s…), -(으)ㅂ시다 (let\'s…, formal).'),
    sections: [
      {
        table: table(
          [PATTERN, MEANING, EXAMPLE],
          [
            ['-(으)ㄹ까요?', l('Rủ: "mình cùng … nhé?"; hỏi ý: "tôi … nhé?"', '"Shall we…?" / "Shall I…?"'), '같이 점심 **먹을까요**?'],
            ['-아/어요', l('"Cùng … đi" (lịch sự, thân thiện)', '"Let\'s…" (polite, friendly)'), '네, 같이 **먹어요**.'],
            ['-(으)ㅂ시다', l('"Hãy cùng …" (trang trọng; không dùng với người trên)', '"Let\'s…" (formal; not to superiors)'), '시작**합시다**.'],
          ],
        ),
        examples: [
          ex('주말에 영화 **볼까요**? ― 좋아요, **봐요**!', 'Cuối tuần đi xem phim nhé? ― Được đấy, đi xem đi!', 'Shall we watch a film at the weekend? ― Sure, let\'s!', 'Jumare yeonghwa bolkkayo? ― Joayo, bwayo!'),
          ex('창문을 **열까요**?', 'Tôi mở cửa sổ nhé?', 'Shall I open the window?', 'Changmuneul yeolkkayo?'),
          ex('뭐 **먹을까요**?', 'Mình ăn gì đây?', 'What shall we eat?', 'Mwo meogeulkkayo?'),
        ],
      },
      {
        title: l('Tự hỏi, phỏng đoán', 'Wondering aloud'),
        body: l('-(으)ㄹ까요 còn dùng để **phỏng đoán, tự hỏi**: 내일 비가 **올까요**? (mai trời có mưa không nhỉ?)', '-(으)ㄹ까요 can also **wonder** aloud: 내일 비가 **올까요**? (I wonder if it\'ll rain tomorrow.)'),
      },
    ],
  },
  {
    id: 'connectors',
    level: 'A1',
    title: l('Nối câu: -고, -지만', 'Joining clauses: -고 and -지만'),
    summary: l('-고: và, rồi; -지만: nhưng; cùng các liên từ 그리고, 그래서, 그런데, 하지만.', '-고: and, then; -지만: but; plus the conjunctions 그리고, 그래서, 그런데, 하지만.'),
    sections: [
      {
        title: l('-고: và; rồi', '-고: and; and then'),
        body: l(
          'Gắn **-고** vào gốc động từ hoặc tính từ để nối hai hành động / tính chất. Thì của câu nằm ở **động từ cuối**.',
          'Attach **-고** to a verb or adjective stem to join two actions or qualities. The tense goes on the **last verb**.',
        ),
        examples: [
          ex('이 식당은 싸**고** 맛있어요.', 'Nhà hàng này rẻ và ngon.', 'This restaurant is cheap and good.', 'I sikdangeun ssago masisseoyo.'),
          ex('밥을 먹**고** 커피를 마셨어요.', 'Tôi ăn cơm rồi uống cà phê.', 'I ate and then had coffee.', 'Babeul meokgo keopireul masyeosseoyo.'),
        ],
      },
      {
        title: l('-지만: nhưng', '-지만: but'),
        examples: [
          ex('한국어는 어렵**지만** 재미있어요.', 'Tiếng Hàn khó nhưng thú vị.', 'Korean is difficult but fun.', 'Hangugeoneun eoryeopjiman jaemiisseoyo.'),
          ex('비싸**지만** 샀어요.', 'Đắt nhưng tôi vẫn mua.', 'It was expensive, but I bought it.', 'Bissajiman sasseoyo.'),
        ],
      },
      {
        title: l('Liên từ đầu câu', 'Sentence-initial conjunctions'),
        table: table(
          [l('Liên từ', 'Conjunction'), MEANING],
          [
            ['그리고', l('và, rồi', 'and, and then')],
            ['그래서', l('vì vậy, cho nên', 'so, therefore')],
            ['그런데 / 근데', l('nhưng mà; mà này (chuyển chủ đề)', 'but; by the way')],
            ['하지만 / 그렇지만', l('tuy nhiên', 'however')],
            ['그러면 / 그럼', l('nếu vậy thì', 'then, in that case')],
          ],
        ),
        examples: [ex('비가 왔어요. **그래서** 집에 있었어요.', 'Trời mưa. Vì vậy tôi ở nhà.', 'It rained. So I stayed home.', 'Biga wasseoyo. Geuraeseo jibe isseosseoyo.')],
      },
    ],
  },
  {
    id: 'reason',
    level: 'A1',
    title: l('Lý do: -아서/어서 và -(으)니까', 'Reasons: -아서/어서 and -(으)니까'),
    summary: l('-아서/어서: vì (nguyên nhân tự nhiên); -(으)니까: vì (chủ quan, đi được với đề nghị, mệnh lệnh).', '-아서/어서: because (natural cause); -(으)니까: because (subjective, works with suggestions and commands).'),
    sections: [
      {
        table: table(
          ['', '-아서/어서', '-(으)니까'],
          [
            [l('Cách chia', 'Form'), l('như -아요/어요: 가서, 먹어서, 해서', 'like -아요/어요: 가서, 먹어서, 해서'), '가니까, 먹으니까, 하니까'],
            [l('Gắn thì quá khứ', 'Past tense before it'), l('**Không** (×갔어서)', '**No** (×갔어서)'), l('Được (갔으니까)', 'Yes (갔으니까)')],
            [l('Vế sau là mệnh lệnh, rủ rê', 'Command or suggestion after it'), l('**Không**', '**No**'), l('Được', 'Yes')],
            [l('Xin lỗi, cảm ơn', 'Apologies, thanks'), l('Dùng (늦어서 죄송합니다)', 'Yes (늦어서 죄송합니다)'), l('Không tự nhiên', 'Unnatural')],
          ],
        ),
        examples: [
          ex('배가 고**파서** 라면을 먹었어요.', 'Vì đói bụng nên tôi đã ăn mì.', 'I was hungry, so I ate ramyeon.', 'Baega gopaseo ramyeoneul meogeosseoyo.'),
          ex('늦**어서** 죄송합니다.', 'Xin lỗi vì tôi đến muộn.', 'Sorry I\'m late.', 'Neujeoseo joesonghamnida.'),
          ex('비가 오**니까** 우산을 가져가세요.', 'Trời đang mưa nên hãy mang ô theo.', 'It\'s raining, so take an umbrella.', 'Biga onikka usaneul gajyeogaseyo.'),
          ex('시간이 없**으니까** 택시를 탑시다.', 'Không có thời gian đâu, đi taxi thôi.', 'We don\'t have time, so let\'s take a taxi.', 'Sigani eopseunikka taeksireul tapsida.'),
        ],
      },
    ],
    tips: [l('Danh từ dùng **(이)라서** hoặc **(이)니까**: 휴가**라서** 집에 있어요 (vì là kỳ nghỉ nên tôi ở nhà).', 'With nouns use **(이)라서** or **(이)니까**: 휴가**라서** 집에 있어요 (it\'s my holiday, so I\'m at home).')],
  },
  {
    id: 'progressive',
    level: 'A1',
    title: l('Đang làm: -고 있다', 'In progress: -고 있다'),
    summary: l('Gốc động từ + 고 있어요: đang làm gì; cũng dùng cho việc đang mặc, đeo.', 'Stem + 고 있어요: be doing; also for things you are wearing.'),
    sections: [
      {
        body: l('**Gốc động từ + 고 있어요** nhấn mạnh hành động **đang diễn ra**. Quá khứ: -고 있었어요 (lúc đó đang…).', '**Stem + 고 있어요** stresses an action **in progress**. Past: -고 있었어요 (was doing).'),
        examples: [
          ex('지금 뭐 하**고 있어요**? ― 숙제하**고 있어요**.', 'Bây giờ bạn đang làm gì? ― Tôi đang làm bài tập.', 'What are you doing now? ― I\'m doing my homework.', 'Jigeum mwo hago isseoyo? ― Sukjehago isseoyo.'),
          ex('요즘 한국어를 배우**고 있어요**.', 'Dạo này tôi đang học tiếng Hàn.', 'I\'m learning Korean these days.', 'Yojeum hangugeoreul baeugo isseoyo.'),
          ex('전화했을 때 자**고 있었어요**.', 'Lúc bạn gọi điện, tôi đang ngủ.', 'I was sleeping when you called.', 'Jeonhwahaesseul ttae jago isseosseoyo.'),
          ex('민수 씨는 안경을 쓰**고 있어요**.', 'Minsu đang đeo kính.', 'Minsu is wearing glasses.', 'Minsu ssineun angyeongeul sseugo isseoyo.'),
        ],
      },
    ],
    tips: [l('Với người trên dùng **-고 계시다**: 할아버지께서 신문을 읽고 계세요.', 'For respected people use **-고 계시다**: 할아버지께서 신문을 읽고 계세요.')],
  },
  {
    id: 'ability',
    level: 'A1',
    title: l('Khả năng: -(으)ㄹ 수 있다 / 없다', 'Ability: -(으)ㄹ 수 있다 / 없다'),
    summary: l('Có thể / không thể làm gì; 잘하다 (giỏi) và 못하다 (kém).', 'Can / cannot do something; 잘하다 (be good at) and 못하다 (be bad at).'),
    sections: [
      {
        table: table(
          [STEM, l('Có thể', 'Can'), l('Không thể', 'Cannot')],
          [
            [l('kết thúc bằng nguyên âm hoặc ㄹ', 'ends in a vowel or ㄹ'), '갈 수 있어요', '갈 수 없어요'],
            [l('kết thúc bằng phụ âm', 'ends in a consonant'), '먹을 수 있어요', '먹을 수 없어요'],
          ],
        ),
        examples: [
          ex('한국어를 읽**을 수 있어요**.', 'Tôi có thể đọc tiếng Hàn.', 'I can read Korean.', 'Hangugeoreul ilgeul su isseoyo.'),
          ex('매운 음식을 먹**을 수 있어요**?', 'Bạn ăn được đồ cay không?', 'Can you eat spicy food?', 'Maeun eumsigeul meogeul su isseoyo?'),
          ex('내일은 바빠서 만날 **수 없어요**.', 'Mai tôi bận nên không gặp được.', 'I\'m busy tomorrow, so I can\'t meet.', 'Naeireun bappaseo mannal su eopseoyo.'),
        ],
      },
      {
        title: l('잘하다 và 못하다', '잘하다 and 못하다'),
        examples: [
          ex('민수 씨는 노래를 **잘해요**.', 'Minsu hát hay.', 'Minsu sings well.', 'Minsu ssineun noraereul jalhaeyo.'),
          ex('저는 요리를 **못해요**.', 'Tôi nấu ăn dở.', 'I\'m bad at cooking.', 'Jeoneun yorireul motaeyo.'),
        ],
      },
    ],
    tips: [l('-(으)ㄹ 수 없다 nghe trang trọng hơn **못**: 못 가요 = 갈 수 없어요.', '-(으)ㄹ 수 없다 sounds more formal than **못**: 못 가요 = 갈 수 없어요.')],
  },
  {
    id: 'adjectives',
    level: 'A1',
    title: l('Tính từ (động từ miêu tả)', 'Adjectives (descriptive verbs)'),
    summary: l('Tính từ tiếng Hàn chia như động từ; đứng trước danh từ thì thêm -(으)ㄴ.', 'Korean adjectives conjugate like verbs; before a noun they take -(으)ㄴ.'),
    sections: [
      {
        body: l(
          'Tính từ tiếng Hàn **là động từ miêu tả**: tự làm vị ngữ, **không cần "là"**: 날씨가 좋아요 (thời tiết đẹp). Chúng chia -아요/어요, quá khứ, phủ định… y như động từ.',
          'Korean adjectives **are descriptive verbs**: they work as the predicate on their own, **no "to be" needed**: 날씨가 좋아요 (the weather is nice). They take -아요/어요, past, negative… just like verbs.',
        ),
        table: table(
          [l('Tính từ', 'Adjective'), '-아요/어요', l('+ danh từ', '+ noun'), MEANING],
          [
            ['크다', '커요', '**큰** 집', l('to; ngôi nhà to', 'big; a big house')],
            ['작다', '작아요', '**작은** 가방', l('nhỏ; cái túi nhỏ', 'small; a small bag')],
            ['예쁘다', '예뻐요', '**예쁜** 꽃', l('đẹp; bông hoa đẹp', 'pretty; a pretty flower')],
            ['좋다', '좋아요', '**좋은** 사람', l('tốt; người tốt', 'good; a good person')],
            ['맛있다', '맛있어요', '**맛있는** 음식', l('ngon; món ăn ngon', 'tasty; tasty food')],
            ['덥다', '더워요', '**더운** 날씨', l('nóng; thời tiết nóng', 'hot; hot weather')],
          ],
        ),
      },
      {
        title: l('Bổ nghĩa cho danh từ: -(으)ㄴ', 'Before a noun: -(으)ㄴ'),
        bullets: [
          l('Gốc kết thúc bằng nguyên âm + **ㄴ**: 크다 → 큰, 예쁘다 → 예쁜.', 'Stem ending in a vowel + **ㄴ**: 크다 → 큰, 예쁘다 → 예쁜.'),
          l('Gốc kết thúc bằng phụ âm + **은**: 작다 → 작은, 좋다 → 좋은.', 'Stem ending in a consonant + **은**: 작다 → 작은, 좋다 → 좋은.'),
          l('Tính từ có **있다 / 없다** + **는**: 맛있는, 재미없는.', 'Adjectives with **있다 / 없다** + **는**: 맛있는, 재미없는.'),
        ],
        examples: [
          ex('**큰** 가방을 사고 싶어요.', 'Tôi muốn mua một cái túi to.', 'I want to buy a big bag.', 'Keun gabangeul sago sipeoyo.'),
          ex('서울은 **아름다운** 도시예요.', 'Seoul là một thành phố đẹp.', 'Seoul is a beautiful city.', 'Seoureun areumdaun dosiyeyo.'),
          ex('**재미있는** 영화를 봤어요.', 'Tôi đã xem một bộ phim hay.', 'I watched a fun film.', 'Jaemiinneun yeonghwareul bwasseoyo.'),
        ],
      },
      {
        title: l('Tính từ thông dụng', 'Common adjectives'),
        table: table(
          [l('Tính từ', 'Adjective'), MEANING, l('Tính từ', 'Adjective'), MEANING],
          [
            ['크다', l('to', 'big'), '작다', l('nhỏ', 'small')],
            ['많다', l('nhiều', 'many, much'), '적다', l('ít', 'few, little')],
            ['비싸다', l('đắt', 'expensive'), '싸다', l('rẻ', 'cheap')],
            ['덥다', l('nóng', 'hot'), '춥다', l('lạnh', 'cold')],
            ['쉽다', l('dễ', 'easy'), '어렵다', l('khó', 'difficult')],
            ['바쁘다', l('bận', 'busy'), '피곤하다', l('mệt', 'tired')],
            ['재미있다', l('thú vị', 'fun'), '재미없다', l('chán', 'boring')],
          ],
        ),
      },
    ],
    tips: [l('덥다, 춥다, 쉽다, 어렵다, 아름답다 là **bất quy tắc ㅂ**: ㅂ → 우 (더워요, 추워요).', '덥다, 춥다, 쉽다, 어렵다 and 아름답다 are **ㅂ-irregular**: ㅂ → 우 (더워요, 추워요).')],
  },
  {
    id: 'irregulars',
    level: 'A1',
    title: l('Động từ, tính từ bất quy tắc', 'Irregular verbs and adjectives'),
    summary: l('ㅡ, ㅂ, ㄷ, 르, ㄹ, ㅅ, ㅎ: các nhóm bất quy tắc thường gặp nhất.', 'ㅡ, ㅂ, ㄷ, 르, ㄹ, ㅅ, ㅎ: the most common irregular groups.'),
    sections: [
      {
        table: table(
          [l('Nhóm', 'Group'), RULE, EXAMPLE],
          [
            ['ㅡ', l('ㅡ cuối gốc **biến mất** trước -아/어', 'The final ㅡ **drops** before -아/어'), '바쁘다 → **바빠요**, 크다 → **커요**, 쓰다 → **써요**'],
            ['ㅂ', l('ㅂ → **우** trước nguyên âm', 'ㅂ → **우** before a vowel'), '덥다 → **더워요**, 춥다 → **추워요**, 어렵다 → **어려워요**'],
            ['ㄷ', l('ㄷ → **ㄹ** trước nguyên âm', 'ㄷ → **ㄹ** before a vowel'), '듣다 → **들어요**, 걷다 → **걸어요**, 묻다 → **물어요**'],
            ['르', l('르 → **ㄹ라 / ㄹ러**', '르 → **ㄹ라 / ㄹ러**'), '모르다 → **몰라요**, 빠르다 → **빨라요**, 부르다 → **불러요**'],
            ['ㄹ', l('ㄹ **rơi** trước ㄴ, ㅂ, ㅅ', 'ㄹ **drops** before ㄴ, ㅂ, ㅅ'), '살다 → **사세요**, 알다 → **압니다**, 만들다 → **만드는**'],
            ['ㅅ', l('ㅅ **rơi** trước nguyên âm', 'ㅅ **drops** before a vowel'), '낫다 → **나아요**, 짓다 → **지어요**'],
            ['ㅎ', l('ㅎ rơi; -아/어 thành **ㅐ**', 'ㅎ drops; -아/어 becomes **ㅐ**'), '그렇다 → **그래요**, 빨갛다 → **빨개요**, 어떻다 → **어때요**'],
          ],
        ),
      },
      {
        title: l('Trông giống nhưng có quy tắc', 'Look-alikes that are regular'),
        body: l(
          'Một số từ trông giống nhưng **chia bình thường**: 입다 → 입어요, 좁다 → 좁아요, 받다 → 받아요, 닫다 → 닫아요, 웃다 → 웃어요, 씻다 → 씻어요.',
          'Some words look similar but **are regular**: 입다 → 입어요, 좁다 → 좁아요, 받다 → 받아요, 닫다 → 닫아요, 웃다 → 웃어요, 씻다 → 씻어요.',
        ),
        examples: [
          ex('요즘 너무 **바빠요**.', 'Dạo này tôi bận quá.', 'I\'m so busy these days.', 'Yojeum neomu bappayo.'),
          ex('음악을 **들어요**.', 'Tôi nghe nhạc.', 'I listen to music.', 'Eumageul deureoyo.'),
          ex('그 사람 이름을 **몰라요**.', 'Tôi không biết tên người đó.', 'I don\'t know that person\'s name.', 'Geu saram ireumeul mollayo.'),
          ex('날씨가 **어때요**? ― 좀 **추워요**.', 'Thời tiết thế nào? ― Hơi lạnh.', 'How\'s the weather? ― A bit cold.', 'Nalssiga eottaeyo? ― Jom chuwoyo.'),
        ],
      },
    ],
    tips: [l('돕다 và 곱다 là ngoại lệ trong nhóm ㅂ: ㅂ → **오** (도와요, 고와요).', '돕다 and 곱다 are exceptions in the ㅂ group: ㅂ → **오** (도와요, 고와요).')],
  },
  {
    id: 'comparison',
    level: 'A1',
    title: l('So sánh: 보다, 더, 제일', 'Comparisons: 보다, 더, 제일'),
    summary: l('A이/가 B보다 더 …: A … hơn B; 제일 / 가장: … nhất.', 'A이/가 B보다 더 …: A is more… than B; 제일 / 가장: the most.'),
    sections: [
      {
        table: table(
          [PATTERN, MEANING, EXAMPLE],
          [
            ['A이/가 B**보다** (더) Adj', l('A … hơn B', 'A is more Adj than B'), '서울이 부산**보다** 더 커요.'],
            [l('N 중에서 **제일 / 가장** Adj', 'N 중에서 **제일 / 가장** Adj'), l('… nhất trong số N', 'the most Adj among N'), '과일 중에서 딸기를 **제일** 좋아해요.'],
            [l('A하고 B 중에서 뭐가 더 …?', 'A하고 B 중에서 뭐가 더 …?'), l('A và B, cái nào … hơn?', 'Which is more…, A or B?'), '커피하고 차 중에서 뭐가 더 좋아요?'],
          ],
        ),
        examples: [
          ex('오늘이 어제**보다** 더 추워요.', 'Hôm nay lạnh hơn hôm qua.', 'Today is colder than yesterday.', 'Oneuri eojeboda deo chuwoyo.'),
          ex('동생이 저**보다** 키가 커요.', 'Em tôi cao hơn tôi.', 'My younger sibling is taller than me.', 'Dongsaengi jeoboda kiga keoyo.'),
          ex('한국 음식 중에서 뭐가 **제일** 맛있어요?', 'Trong các món Hàn, món nào ngon nhất?', 'Which Korean food is the most delicious?', 'Hanguk eumsik jungeseo mwoga jeil masisseoyo?'),
        ],
      },
    ],
    tips: [l('Có 보다 rồi thì có thể bỏ 더. 보다 gắn **sau** vật được đem ra so sánh — thứ tự ngược tiếng Việt.', '더 can be dropped when 보다 is there. 보다 attaches **after** the thing you compare against.')],
  },
  {
    id: 'ending-nuances',
    level: 'A1',
    title: l('Đuôi cảm thán và xác nhận: -네요, -지요', 'Ending nuances: -네요 and -지요'),
    summary: l('-네요: ngạc nhiên, cảm thán ("… quá nhỉ"); -지요 (-죠): xác nhận ("… đúng không?").', '-네요: surprise, admiration ("wow, …"); -지요 (-죠): checking agreement ("…, right?").'),
    sections: [
      {
        table: table(
          [PATTERN, MEANING, EXAMPLE],
          [
            ['-네요', l('Cảm thán khi vừa nhận ra điều gì', 'Reacting to something you just noticed'), '한국어를 정말 잘하**네요**!'],
            ['-지요? / -죠?', l('Hỏi để xác nhận điều cả hai cùng biết', 'Checking something both people know'), '날씨가 좋**죠**?'],
            ['-지요 / -죠', l('Đồng tình, nhấn mạnh: "đương nhiên rồi"', 'Agreeing: "of course"'), '그럼요, 좋**죠**!'],
          ],
        ),
        examples: [
          ex('와, 경치가 정말 아름답**네요**!', 'Ồ, phong cảnh đẹp quá!', 'Wow, the view is beautiful!', 'Wa, gyeongchiga jeongmal areumdamneyo!'),
          ex('이거 맛있**네요**.', 'Cái này ngon nhỉ.', 'Oh, this is tasty.', 'Igeo masinneyo.'),
          ex('내일 시험이 있**죠**? ― 네, 있어요.', 'Mai có bài kiểm tra đúng không? ― Vâng, có.', 'There\'s a test tomorrow, right? ― Yes, there is.', 'Naeil siheomi itjyo? ― Ne, isseoyo.'),
          ex('커피 한잔 할까요? ― 좋**죠**!', 'Đi uống cà phê không? ― Được chứ!', 'Shall we grab a coffee? ― Sure!', 'Keopi hanjan halkkayo? ― Jochyo!'),
        ],
      },
    ],
    tips: [l('Mở lời hỏi đường lịch sự: 실례지만, 화장실이 어디**죠**? (xin lỗi, nhà vệ sinh ở đâu ạ?)', 'A polite opener: 실례지만, 화장실이 어디**죠**? (excuse me, where is the toilet?)')],
  },
  {
    id: 'obligation-permission',
    level: 'A2',
    title: l('Phải, được phép, không được', 'Must, may and must not'),
    summary: l('-아/어야 하다 (phải), -아/어도 되다 (được phép), -(으)면 안 되다 (không được).', '-아/어야 하다 (must), -아/어도 되다 (may), -(으)면 안 되다 (must not).'),
    sections: [
      {
        table: table(
          [PATTERN, MEANING, EXAMPLE],
          [
            ['-아/어야 하다 / 되다', l('phải làm', 'must, have to'), '내일까지 숙제를 **해야 해요**.'],
            ['-아/어도 되다', l('làm … cũng được', 'may, it\'s OK to'), '여기 **앉아도 돼요**?'],
            ['-(으)면 안 되다', l('không được làm', 'must not'), '여기서 사진을 **찍으면 안 돼요**.'],
            ['안 -아/어도 되다', l('không cần làm', 'don\'t have to'), '내일은 **안 와도 돼요**.'],
          ],
        ),
        examples: [
          ex('일곱 시에 일어나**야 해요**.', 'Tôi phải dậy lúc 7 giờ.', 'I have to get up at 7.', 'Ilgop sie ireonaya haeyo.'),
          ex('창문을 열**어도 돼요**? ― 네, 열어도 돼요.', 'Tôi mở cửa sổ được không? ― Vâng, được.', 'May I open the window? ― Yes, go ahead.', 'Changmuneul yeoreodo dwaeyo? ― Ne, yeoreodo dwaeyo.'),
          ex('수업 시간에 휴대폰을 쓰**면 안 돼요**.', 'Trong giờ học không được dùng điện thoại.', 'You must not use your phone in class.', 'Sueop sigane hyudaeponeul sseumyeon an dwaeyo.'),
        ],
      },
    ],
    tips: [l('Trong văn nói, -아/어야 되다 phổ biến hơn -아/어야 하다; nghĩa như nhau.', 'In speech, -아/어야 되다 is more common than -아/어야 하다; they mean the same.')],
  },
  {
    id: 'conditional',
    level: 'A2',
    title: l('Điều kiện: -(으)면', 'Conditionals: -(으)면'),
    summary: l('Nếu / khi: gốc + (으)면; dùng được với đề nghị, mệnh lệnh và dự định.', 'If / when: stem + (으)면; works with suggestions, commands and plans.'),
    sections: [
      {
        body: l(
          'Gốc kết thúc bằng **nguyên âm hoặc ㄹ** + **면** (가면, 살면); bằng **phụ âm** + **으면** (먹으면). Danh từ + **(이)면**.',
          'Stem ending in a **vowel or ㄹ** + **면** (가면, 살면); in a **consonant** + **으면** (먹으면). Nouns take **(이)면**.',
        ),
        examples: [
          ex('시간이 있**으면** 같이 가요.', 'Nếu có thời gian thì đi cùng nhé.', 'If you have time, let\'s go together.', 'Sigani isseumyeon gachi gayo.'),
          ex('비가 오**면** 집에 있을 거예요.', 'Nếu trời mưa, tôi sẽ ở nhà.', 'If it rains, I\'ll stay at home.', 'Biga omyeon jibe isseul geoyeyo.'),
          ex('모르**면** 물어보세요.', 'Nếu không biết thì hãy hỏi.', 'If you don\'t know, ask.', 'Moreumyeon mureoboseyo.'),
          ex('한국에 가**면** 경복궁에 가 보고 싶어요.', 'Nếu đến Hàn Quốc, tôi muốn đến thăm cung Gyeongbok.', 'When I go to Korea, I want to visit Gyeongbokgung.', 'Hanguge gamyeon Gyeongbokgunge ga bogo sipeoyo.'),
          ex('봄이 되**면** 꽃이 펴요.', 'Khi mùa xuân đến, hoa nở.', 'When spring comes, the flowers bloom.', 'Bomi doemyeon kkochi pyeoyo.'),
        ],
      },
      {
        title: l('Ước muốn: -았/었으면 좋겠다', 'Wishes: -았/었으면 좋겠다'),
        body: l('**-았/었으면 좋겠어요** = ước gì…: 돈이 많**았으면 좋겠어요** (ước gì có nhiều tiền).', '**-았/었으면 좋겠어요** = I wish…: 돈이 많**았으면 좋겠어요** (I wish I had lots of money).'),
      },
    ],
  },
  {
    id: 'intention-purpose',
    level: 'A2',
    title: l('Dự định và mục đích: -(으)려고, -(으)러', 'Intention and purpose: -(으)려고, -(으)러'),
    summary: l('-(으)려고 하다: định làm; -(으)려고: để; -(으)러 가다/오다: đi/đến để làm.', '-(으)려고 하다: plan to; -(으)려고: in order to; -(으)러 가다/오다: go/come to do.'),
    sections: [
      {
        table: table(
          [PATTERN, MEANING, EXAMPLE],
          [
            ['-(으)려고 하다', l('định, có ý định', 'intend to, be about to'), '내년에 한국에 **가려고 해요**.'],
            ['-(으)려고', l('để (mục đích)', 'in order to'), '한국어를 배우**려고** 책을 샀어요.'],
            ['-(으)러 가다 / 오다', l('đi / đến để làm (chỉ với động từ di chuyển)', 'go / come to do (movement verbs only)'), '밥 먹**으러** 가요.'],
          ],
        ),
        examples: [
          ex('주말에 친구를 만나**려고 해요**.', 'Cuối tuần tôi định gặp bạn.', 'I\'m planning to meet a friend at the weekend.', 'Jumare chingureul mannaryeogo haeyo.'),
          ex('살을 빼**려고** 운동을 해요.', 'Tôi tập thể dục để giảm cân.', 'I exercise to lose weight.', 'Sareul ppaeryeogo undongeul haeyo.'),
          ex('책을 빌리**러** 도서관에 갔어요.', 'Tôi đến thư viện để mượn sách.', 'I went to the library to borrow books.', 'Chaegeul billireo doseogwane gasseoyo.'),
          ex('커피 마시**러** 갈까요?', 'Đi uống cà phê không?', 'Shall we go for a coffee?', 'Keopi masireo galkkayo?'),
        ],
      },
    ],
    tips: [l('-(으)러 chỉ đi với **가다, 오다, 다니다…**; -(으)려고 đi được với mọi động từ.', '-(으)러 only goes with **가다, 오다, 다니다…**; -(으)려고 works with any verb.')],
  },
  {
    id: 'verb-modifiers',
    level: 'A2',
    title: l('Định ngữ động từ: -는, -(으)ㄴ, -(으)ㄹ', 'Verb modifiers: -는, -(으)ㄴ, -(으)ㄹ'),
    summary: l('Biến động từ thành định ngữ đứng trước danh từ: "người đang ăn", "món đã ăn", "món sẽ ăn".', 'Turning verbs into modifiers before nouns: "the person eating", "the food I ate", "food to eat".'),
    sections: [
      {
        table: table(
          [l('Thì', 'Tense'), ENDING, EXAMPLE, MEANING],
          [
            [l('Hiện tại', 'Present'), '-는', '먹**는** 사람', l('người đang ăn', 'the person eating')],
            [l('Quá khứ', 'Past'), '-(으)ㄴ', '먹**은** 음식, 본 영화', l('món đã ăn, bộ phim đã xem', 'the food I ate, the film I saw')],
            [l('Tương lai', 'Future'), '-(으)ㄹ', '먹**을** 음식, 할 일', l('đồ ăn sắp ăn, việc phải làm', 'food to eat, things to do')],
          ],
        ),
      },
      {
        body: l('Tiếng Hàn **không có** từ "mà / who / which": đặt cả mệnh đề **trước** danh từ.', 'Korean has **no** "who / which / that": put the whole clause **before** the noun.'),
        examples: [
          ex('저기 커피를 마시**는** 사람이 제 친구예요.', 'Người đang uống cà phê đằng kia là bạn tôi.', 'The person drinking coffee over there is my friend.', 'Jeogi keopireul masineun sarami je chinguyeyo.'),
          ex('어제 **본** 영화가 정말 재미있었어요.', 'Bộ phim tôi xem hôm qua rất hay.', 'The film I saw yesterday was really good.', 'Eoje bon yeonghwaga jeongmal jaemiisseosseoyo.'),
          ex('오늘 **할** 일이 많아요.', 'Hôm nay tôi có nhiều việc phải làm.', 'I have a lot to do today.', 'Oneul hal iri manayo.'),
          ex('제가 **좋아하는** 음식은 김치찌개예요.', 'Món tôi thích là canh kimchi.', 'My favourite food is kimchi stew.', 'Jega joahaneun eumsigeun gimchijjigaeyeyo.'),
        ],
      },
    ],
    tips: [l('Chủ ngữ trong mệnh đề định ngữ dùng **이/가**, không dùng 은/는.', 'The subject inside the modifying clause takes **이/가**, not 은/는.')],
  },
  {
    id: 'experience',
    level: 'A2',
    title: l('Kinh nghiệm: -(으)ㄴ 적이 있다', 'Experience: -(으)ㄴ 적이 있다'),
    summary: l('Đã từng / chưa từng làm gì.', 'Have ever / have never done something.'),
    sections: [
      {
        body: l(
          '**Gốc động từ + (으)ㄴ 적이 있어요** = đã từng; **없어요** = chưa từng. Thường kết hợp thành **-아/어 본 적이**: đã từng thử.',
          '**Stem + (으)ㄴ 적이 있어요** = have done; **없어요** = have never. Often combined as **-아/어 본 적이** (have tried).',
        ),
        examples: [
          ex('한국에 가 **본 적이 있어요**?', 'Bạn đã từng đến Hàn Quốc chưa?', 'Have you ever been to Korea?', 'Hanguge ga bon jeogi isseoyo?'),
          ex('김치를 만들어 **본 적이 없어요**.', 'Tôi chưa từng làm kimchi.', 'I\'ve never made kimchi.', 'Gimchireul mandeureo bon jeogi eopseoyo.'),
          ex('어렸을 때 서울에 산 **적이 있어요**.', 'Hồi nhỏ tôi từng sống ở Seoul.', 'I lived in Seoul when I was little.', 'Eoryeosseul ttae Seoure san jeogi isseoyo.'),
        ],
      },
    ],
    tips: [l('Không dùng cho việc thường ngày: "đã từng ăn cơm" nghe rất lạ.', 'Don\'t use it for everyday routines: "have ever eaten rice" sounds odd.')],
  },
  {
    id: 'try',
    level: 'A2',
    title: l('Thử làm: -아/어 보다', 'Trying: -아/어 보다'),
    summary: l('-아/어 보다: thử làm; -아/어 보세요: hãy thử …', '-아/어 보다: try doing; -아/어 보세요: give it a try.'),
    sections: [
      {
        body: l('Gắn **보다** sau dạng -아/어 của động từ: 먹어 보다, 가 보다, 해 보다.', 'Add **보다** after the -아/어 form: 먹어 보다, 가 보다, 해 보다.'),
        examples: [
          ex('이 옷 입**어 봐도** 돼요?', 'Tôi mặc thử bộ này được không?', 'May I try this on?', 'I ot ibeo bwado dwaeyo?'),
          ex('떡볶이 먹**어 보세요**. 정말 맛있어요!', 'Ăn thử tteokbokki đi. Ngon lắm!', 'Try some tteokbokki. It\'s really good!', 'Tteokbokki meogeo boseyo. Jeongmal masisseoyo!'),
          ex('제주도에 한번 가 **보고 싶어요**.', 'Tôi muốn đến đảo Jeju một lần.', 'I\'d like to visit Jeju Island some time.', 'Jejudoe hanbeon ga bogo sipeoyo.'),
        ],
      },
    ],
    tips: [l('Khuyên ai thử: **-아/어 보세요**; kể rằng mình đã thử: **-아/어 봤어요**.', 'To encourage someone: **-아/어 보세요**; to say you tried: **-아/어 봤어요**.')],
  },
  {
    id: 'honorifics',
    level: 'A2',
    title: l('Kính ngữ', 'Honorifics'),
    summary: l('-(으)시- nâng chủ ngữ; từ kính ngữ đặc biệt; tiểu từ 께서, 께.', '-(으)시- raises the subject; special honorific words; the particles 께서 and 께.'),
    sections: [
      {
        title: l('-(으)시-', '-(으)시-'),
        body: l(
          'Thêm **-(으)시-** vào gốc khi **chủ ngữ là người cần tôn trọng** (người lớn tuổi, cấp trên, khách hàng). Không bao giờ dùng cho bản thân.',
          'Add **-(으)시-** to the stem when **the subject deserves respect** (elders, superiors, customers). Never use it about yourself.',
        ),
        table: table(
          [l('Dạng', 'Form'), l('Thường', 'Plain'), l('Kính ngữ', 'Honorific')],
          [
            [l('Hiện tại', 'Present'), '가요', '가**세**요'],
            [l('Quá khứ', 'Past'), '갔어요', '가**셨**어요'],
            [l('Trang trọng', 'Formal'), '갑니다', '가**십**니다'],
          ],
        ),
      },
      {
        title: l('Từ kính ngữ đặc biệt', 'Special honorific words'),
        table: table(
          [l('Thường', 'Plain'), l('Kính ngữ', 'Honorific'), MEANING],
          [
            ['먹다 / 마시다', '드시다', l('ăn / uống', 'eat / drink')],
            ['자다', '주무시다', l('ngủ', 'sleep')],
            ['있다', '계시다', l('ở', 'be (somewhere)')],
            ['말하다', '말씀하시다', l('nói', 'speak')],
            ['아프다', '편찮으시다', l('ốm', 'be ill')],
            ['이름', '성함', l('tên', 'name')],
            ['나이', '연세', l('tuổi', 'age')],
            ['집', '댁', l('nhà', 'home')],
            ['이/가 · 은/는', '께서 · 께서는', l('tiểu từ chủ ngữ / chủ đề', 'subject / topic particle')],
            ['에게 / 한테', '께', l('cho (ai đó)', 'to (someone)')],
          ],
        ),
        examples: [
          ex('할머니**께서** 방에서 **주무세요**.', 'Bà đang ngủ trong phòng.', 'Grandma is sleeping in her room.', 'Halmeonikkeseo bangeseo jumuseyo.'),
          ex('선생님, 점심 **드셨어요**?', 'Thầy ơi, thầy đã ăn trưa chưa ạ?', 'Have you had lunch, teacher?', 'Seonsaengnim, jeomsim deusyeosseoyo?'),
          ex('**성함**이 어떻게 되**세요**?', 'Quý danh của ông/bà là gì ạ?', 'May I have your name, please?', 'Seonghami eotteoke doeseyo?'),
          ex('부모님**께** 선물을 드렸어요.', 'Tôi đã biếu quà cho bố mẹ.', 'I gave my parents a present.', 'Bumonimkke seonmureul deuryeosseoyo.'),
        ],
      },
    ],
    tips: [l('Khi nói về mình, dùng từ khiêm nhường: 저 (tôi), 드리다 (biếu, thay cho 주다), 뵙다 (gặp, thay cho 만나다).', 'For yourself, use humble words: 저 (I), 드리다 (give, instead of 주다), 뵙다 (meet, instead of 만나다).')],
  },
  {
    id: 'seems',
    level: 'A2',
    title: l('Phỏng đoán: -는 / -(으)ㄴ / -(으)ㄹ 것 같다', 'Guessing: -는 / -(으)ㄴ / -(으)ㄹ 것 같다'),
    summary: l('"Hình như, có vẻ, chắc là" — cũng là cách nêu ý kiến nhẹ nhàng.', '"It seems / I think" — also a soft way to give your opinion.'),
    sections: [
      {
        table: table(
          [l('Thì', 'Tense'), l('Động từ', 'Verb'), l('Tính từ', 'Adjective')],
          [
            [l('Hiện tại', 'Present'), '비가 오**는** 것 같아요', '비**싼** 것 같아요'],
            [l('Quá khứ', 'Past'), '비가 **온** 것 같아요', '—'],
            [l('Phỏng đoán, tương lai', 'Guess, future'), '비가 **올** 것 같아요', '비**쌀** 것 같아요'],
          ],
        ),
        examples: [
          ex('밖에 비가 오**는 것 같아요**.', 'Hình như bên ngoài đang mưa.', 'It seems to be raining outside.', 'Bakke biga oneun geot gatayo.'),
          ex('민수 씨가 벌써 집에 **간 것 같아요**.', 'Hình như Minsu đã về nhà rồi.', 'It looks like Minsu has already gone home.', 'Minsu ssiga beolsseo jibe gan geot gatayo.'),
          ex('이 옷이 저한테 좀 **작은 것 같아요**.', 'Bộ này hình như hơi nhỏ với tôi.', 'I think this is a bit small for me.', 'I osi jeohante jom jageun geot gatayo.'),
          ex('내일은 날씨가 **좋을 것 같아요**.', 'Có lẽ ngày mai trời sẽ đẹp.', 'I think the weather will be nice tomorrow.', 'Naeireun nalssiga joeul geot gatayo.'),
        ],
      },
    ],
    tips: [l('Người Hàn hay dùng -것 같아요 để **nói ý kiến khéo léo**, kể cả khi họ khá chắc chắn.', 'Koreans often use -것 같아요 to **soften opinions**, even when they are fairly sure.')],
  },
  {
    id: 'time-clauses',
    level: 'A2',
    title: l('Trước, sau, khi, trong khi', 'Before, after, when and while'),
    summary: l('-기 전에, -(으)ㄴ 후에, -(으)ㄹ 때, -(으)면서.', '-기 전에, -(으)ㄴ 후에, -(으)ㄹ 때 and -(으)면서.'),
    sections: [
      {
        table: table(
          [PATTERN, MEANING, EXAMPLE],
          [
            ['-기 전에 / N 전에', l('trước khi', 'before'), '자**기 전에** 이를 닦아요.'],
            ['-(으)ㄴ 후에 / N 후에', l('sau khi', 'after'), '수업이 끝**난 후에** 만나요.'],
            ['-(으)ㄹ 때 / N 때', l('khi, lúc', 'when'), '어**렸을 때** 부산에 살았어요.'],
            ['-(으)면서', l('vừa … vừa …', 'while (at the same time)'), '음악을 들으**면서** 공부해요.'],
          ],
        ),
        examples: [
          ex('밥을 먹**기 전에** 손을 씻으세요.', 'Hãy rửa tay trước khi ăn.', 'Wash your hands before eating.', 'Babeul meokgi jeone soneul ssiseuseyo.'),
          ex('졸업**한 후에** 한국에서 일하고 싶어요.', 'Sau khi tốt nghiệp, tôi muốn làm việc ở Hàn Quốc.', 'After graduating, I want to work in Korea.', 'Joreopan hue Hangugeseo ilhago sipeoyo.'),
          ex('시간이 있**을 때** 전화하세요.', 'Khi nào có thời gian thì gọi cho tôi nhé.', 'Call me when you have time.', 'Sigani isseul ttae jeonhwahaseyo.'),
          ex('운전하**면서** 전화하지 마세요.', 'Đừng vừa lái xe vừa gọi điện.', 'Don\'t talk on the phone while driving.', 'Unjeonhamyeonseo jeonhwahaji maseyo.'),
        ],
      },
    ],
    tips: [l('-(으)ㄴ 후에 có thể thay bằng **-(으)ㄴ 다음에** hoặc **-고 나서** với nghĩa tương tự.', '-(으)ㄴ 후에 can be swapped for **-(으)ㄴ 다음에** or **-고 나서** with much the same meaning.')],
  },
  {
    id: 'change',
    level: 'A2',
    title: l('Thay đổi: -아/어지다, -게 되다', 'Change: -아/어지다 and -게 되다'),
    summary: l('Tính từ + 아/어지다: trở nên; động từ + 게 되다: rốt cuộc thì, được (do hoàn cảnh).', 'Adjective + 아/어지다: become; verb + 게 되다: end up, come to (through circumstances).'),
    sections: [
      {
        title: l('Tính từ + -아/어지다', 'Adjective + -아/어지다'),
        examples: [
          ex('날씨가 따뜻**해졌어요**.', 'Thời tiết đã ấm lên.', 'The weather has got warmer.', 'Nalssiga ttatteutaejyeosseoyo.'),
          ex('한국어 실력이 많이 좋**아졌어요**.', 'Tiếng Hàn của bạn đã tiến bộ nhiều.', 'Your Korean has improved a lot.', 'Hangugeo sillyeogi mani joajyeosseoyo.'),
          ex('요즘 물가가 비싸**졌어요**.', 'Dạo này giá cả đắt lên.', 'Prices have gone up lately.', 'Yojeum mulgaga bissajyeosseoyo.'),
        ],
      },
      {
        title: l('Động từ + -게 되다', 'Verb + -게 되다'),
        body: l('Diễn tả việc xảy ra **do hoàn cảnh**, không hẳn do mình chủ động quyết định.', 'Describes something that happened **through circumstances** rather than your own decision.'),
        examples: [
          ex('회사 때문에 서울에 살**게 됐어요**.', 'Vì công việc nên tôi đã chuyển đến sống ở Seoul.', 'Because of work, I ended up living in Seoul.', 'Hoesa ttaemune Seoure salge dwaesseoyo.'),
          ex('드라마를 보고 한국어를 좋아하**게 됐어요**.', 'Xem phim truyền hình xong tôi dần thích tiếng Hàn.', 'Watching dramas, I came to love Korean.', 'Deuramareul bogo hangugeoreul joahage dwaesseoyo.'),
        ],
      },
    ],
    tips: [l('Danh từ + **이/가 되다** = trở thành: 의사가 되고 싶어요 (tôi muốn trở thành bác sĩ).', 'Noun + **이/가 되다** = become: 의사가 되고 싶어요 (I want to become a doctor).')],
  },
  {
    id: 'background',
    level: 'A2',
    title: l('Bối cảnh và đối lập: -는데 / -(으)ㄴ데', 'Background and contrast: -는데 / -(으)ㄴ데'),
    summary: l('Đưa thông tin nền trước khi hỏi, đề nghị; hoặc diễn tả sự đối lập nhẹ ("nhưng").', 'Gives background before a question or suggestion, or a soft contrast ("but").'),
    sections: [
      {
        table: table(
          [l('Loại từ', 'Word type'), ENDING, EXAMPLE],
          [
            [l('Động từ, 있다 / 없다', 'Verbs, 있다 / 없다'), '-는데', '가는데, 먹는데, 맛있는데'],
            [l('Tính từ (gốc nguyên âm)', 'Adjective (vowel stem)'), '-ㄴ데', '비싼데, 예쁜데'],
            [l('Tính từ (gốc phụ âm)', 'Adjective (consonant stem)'), '-은데', '작은데, 좋은데'],
            [l('Danh từ', 'Noun'), '-인데', '학생인데'],
            [l('Quá khứ', 'Past'), '-았/었는데', '갔는데, 좋았는데'],
          ],
        ),
        examples: [
          ex('배고픈**데** 뭐 먹으러 갈까요?', 'Đói bụng rồi, mình đi ăn gì đi?', 'I\'m hungry — shall we go and eat something?', 'Baegopeunde mwo meogeureo galkkayo?'),
          ex('내일 영화 보러 가**는데** 같이 갈래요?', 'Mai tôi đi xem phim, bạn đi cùng không?', 'I\'m going to see a film tomorrow — want to come?', 'Naeil yeonghwa boreo ganeunde gachi gallaeyo?'),
          ex('이 가방은 예쁜**데** 너무 비싸요.', 'Cái túi này đẹp nhưng đắt quá.', 'This bag is pretty, but too expensive.', 'I gabangeun yeppeunde neomu bissayo.'),
          ex('어제 전화했**는데** 안 받았어요.', 'Hôm qua tôi gọi điện nhưng bạn không nghe máy.', 'I called yesterday, but you didn\'t answer.', 'Eoje jeonhwahaenneunde an badasseoyo.'),
        ],
      },
    ],
    tips: [l('Kết thúc câu bằng **-는데요** để nói khéo và chờ người nghe phản ứng: 지금 좀 바쁜데요… (giờ tôi hơi bận…).', 'Ending with **-는데요** sounds soft and leaves room for a reply: 지금 좀 바쁜데요… (I\'m a bit busy right now…).')],
  },
  {
    id: 'casual-speech',
    level: 'A2',
    title: l('Nói thân mật (반말)', 'Casual speech (반말)'),
    summary: l('Bỏ 요 khi nói với bạn thân và người nhỏ tuổi hơn; các dạng 야/이야, 나/너, -자.', 'Drop 요 with close friends and younger people; 야/이야, 나/너, -자 and more.'),
    sections: [
      {
        table: table(
          [l('Lịch sự', 'Polite'), l('Thân mật', 'Casual'), MEANING],
          [
            ['가요', '가', l('đi', 'go')],
            ['먹었어요', '먹었어', l('đã ăn', 'ate')],
            ['학생이에요 / 의사예요', '학생**이야** / 의사**야**', l('là học sinh / bác sĩ', 'am a student / doctor')],
            ['네 / 아니요', '응 / 아니', l('vâng / không', 'yes / no')],
            ['저 / 제가', '나 / 내가', l('tôi', 'I')],
            ['같이 가요', '같이 가**자**', l('cùng đi nào', 'let\'s go')],
          ],
        ),
        examples: [
          ex('뭐 해? ― 그냥 집에서 쉬어.', 'Đang làm gì đấy? ― Ở nhà nghỉ thôi.', 'What are you up to? ― Just resting at home.', 'Mwo hae? ― Geunyang jibeseo swieo.'),
          ex('밥 먹었어? ― 응, 먹었어.', 'Ăn cơm chưa? ― Ừ, ăn rồi.', 'Have you eaten? ― Yeah, I have.', 'Bap meogeosseo? ― Eung, meogeosseo.'),
          ex('내일 같이 영화 보**자**!', 'Mai cùng đi xem phim đi!', 'Let\'s watch a film tomorrow!', 'Naeil gachi yeonghwa boja!'),
          ex('민수**야**, 어디 가?', 'Minsu ơi, đi đâu đấy?', 'Minsu, where are you going?', 'Minsuya, eodi ga?'),
        ],
      },
      {
        title: l('Gọi tên', 'Calling someone by name'),
        body: l('Gọi bạn thân: tên kết thúc bằng nguyên âm + **야** (민수야), bằng phụ âm + **아** (지민아).', 'Calling a close friend: a name ending in a vowel + **야** (민수야); in a consonant + **아** (지민아).'),
      },
    ],
    tips: [
      l('Chỉ dùng 반말 khi đối phương **đề nghị** (말 놓을까요? – mình nói chuyện thân mật nhé?) hoặc với người nhỏ tuổi hơn đã thân.', 'Only switch to 반말 when the other person **suggests it** (말 놓을까요? – shall we talk casually?) or with younger people you know well.'),
    ],
  },
]

export default grammar
