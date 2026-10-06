# Role

You are a senior full-stack software architect and engineer.

I want you to design and implement a production-quality language-learning game platform inside my existing project.

The goal is NOT to build a simple CRUD vocabulary application.

The goal is to build an interactive **Language Learning Game Platform** where users can learn:

* English
* German
* Japanese
* Korean

through games, quizzes, spaced repetition, progress tracking, achievements, daily goals, and mistake-based review.

The application should be designed so that the learning content and game mechanics are separated. New languages, vocabulary types, alphabet systems, and games should be easy to add later.

---

# 1. IMPORTANT: Inspect the existing project first

Before modifying anything:

1. Inspect the complete repository structure.
2. Identify:

   * frontend framework
   * backend framework
   * database
   * ORM
   * existing authentication
   * existing routing
   * existing UI component system
   * existing state management
   * existing i18n implementation
   * existing API architecture
   * existing validation
   * existing testing setup
   * existing linting/formatting
3. Reuse the existing architecture whenever reasonable.
4. Do NOT blindly introduce new libraries.
5. Do NOT replace existing libraries/frameworks unless there is a strong technical reason.
6. Follow the existing project's coding conventions.
7. Before implementing a major architectural change, explain why it is necessary.

The existing application already has i18n with:

* `en`
* `vi`

Preserve this system.

All NEW UI text must support the existing i18n mechanism.

Do NOT hard-code user-facing English or Vietnamese strings inside React components/templates.

---

# 2. Product concept

Build a platform temporarily named:

**Polyglot Quest**

The application should feel like a combination of:

* language-learning application
* flashcard system
* quiz platform
* casual educational game
* spaced-repetition system

The core learning loop is:

```text
Learn
  ↓
Practice
  ↓
Play
  ↓
Test
  ↓
Record result
  ↓
Update learning progress
  ↓
Schedule next review
  ↓
Improve weak areas
```

The application should be useful for real studying, not only visually impressive.

---

# 3. Supported languages

Initial languages:

```text
English
German
Japanese
Korean
```

The architecture must NOT hard-code these four languages into the core learning engine.

A future developer should be able to add:

* French
* Spanish
* Chinese
* etc.

without rewriting the game engine.

---

# 4. Learning content types

There are two main categories.

## A. Alphabet / Writing Systems

Japanese:

* Hiragana
* Katakana
* Dakuten
* Handakuten
* combination sounds such as:

  * きゃ
  * きゅ
  * きょ
  * etc.

Korean:

* basic consonants
* basic vowels
* double consonants if appropriate
* combined syllable blocks
* syllable construction

The architecture should allow additional writing systems later.

---

## B. Vocabulary

Vocabulary should work across:

* English
* German
* Japanese
* Korean

Example concept:

```text
Meaning:
apple

English:
apple

German:
Apfel

Japanese:
りんご

Korean:
사과
```

Do not design vocabulary around only one language.

---

# 5. Core architecture

Design the application around two major concepts:

## Learning Engine

Responsible for:

* learning items
* vocabulary
* alphabet characters
* pronunciation
* difficulty
* learning progress
* review scheduling
* mistakes
* mastery
* statistics

## Game Engine

Responsible for:

* flashcards
* multiple choice
* matching
* typing
* listening
* speed challenge
* character building

A game should consume learning items from the Learning Engine.

Do NOT duplicate learning logic inside every game.

Conceptually:

```text
                Learning Engine
                       │
              Learning Items
                       │
        ┌──────────────┼──────────────┐
        ↓              ↓              ↓
   Flashcards     Multiple Choice   Matching
        ↓              ↓              ↓
      Typing        Listening      Speed Game
        │              │              │
        └──────────────┼──────────────┘
                       ↓
                 Learning Result
                       ↓
              Progress / Review
```

---

# 6. Games to implement

Implement the following game types if the existing architecture allows them.

Prioritize them in this order:

1. Flashcards
2. Multiple Choice
3. Matching
4. Typing / Recall
5. Speed Challenge
6. Listening
7. Character Builder

Do not over-engineer all games at once.

Build a reusable game framework first.

---

# 7. Flashcard Game

Example:

```text
Japanese

さくら

[ Show Answer ]
```

After revealing:

```text
さくら
sakura
cherry blossom

[ Again ]
[ Hard ]
[ Good ]
[ Easy ]
```

The result must be recorded.

The answer quality should affect the next review schedule.

---

# 8. Multiple Choice Game

Examples:

```text
What is 「ぬ」?

A. nu
B. ne
C. na
D. no
```

Vocabulary example:

```text
What does "Apfel" mean?

A. Apple
B. Orange
C. Banana
D. Grape
```

Record:

* selected answer
* correct answer
* correctness
* response time
* learning item
* game type
* timestamp

---

# 9. Matching Game

Example:

```text
ぬ    nu
ね    ne
な    na
の    no
```

User matches the correct pairs.

The game should track:

* number of attempts
* mistakes
* completion time
* score
* combo

Use the same mechanic for vocabulary.

---

# 10. Typing / Recall Game

Examples:

```text
What is "quả táo" in English?

[ apple ]
```

Japanese:

```text
What is "hoa anh đào"?

[ さくら ]
```

Romanization mode:

```text
Type the Japanese character for:

ka

[ か ]
```

Korean:

```text
Build/type the correct Hangul syllable:

ㄱ + ㅏ

[ 가 ]
```

Normalize answers appropriately.

For example:

* trim whitespace
* normalize Unicode where appropriate
* handle case-insensitive Latin answers when appropriate

Do NOT incorrectly treat Japanese/Korean answers as case-insensitive.

---

# 11. Speed Challenge

Implement a timed game.

Example:

```text
30 seconds

犬

A. Dog
B. Cat
C. Bird
D. Fish
```

Track:

* score
* correct answers
* incorrect answers
* combo
* response time
* best personal score

Do not introduce global multiplayer leaderboards unless the existing project already supports them.

Personal best is sufficient for the first version.

---

# 12. Listening Game

Implement a listening mode.

For MVP, if there is no audio infrastructure, browser speech synthesis / speech APIs may be used where appropriate.

Architecture must allow replacing generated speech with real audio files later.

Example:

```text
🔊

What did you hear?

A. さ
B. し
C. す
D. せ
```

For vocabulary:

```text
🔊 Apfel

A. Apple
B. Water
C. House
D. Book
```

Do not make the audio system tightly coupled to browser APIs.

Create an abstraction so an AudioProvider can later be replaced.

---

# 13. Character Builder

This is an important feature.

## Japanese

Allow users to practice combinations such as:

```text
き + ゃ → きゃ
```

and potentially:

```text
か + ん → かん
```

## Korean

Allow users to combine:

```text
ㄱ + ㅏ → 가
```

and:

```text
ㄱ + ㅗ + ㄱ → 곡
```

The UI should visually explain how Hangul syllable blocks are constructed.

Do not simply store Korean syllables as unrelated strings.

The data model should preserve the components where appropriate.

---

# 14. Japanese learning structure

Seed enough initial data to make the feature usable.

At minimum:

## Hiragana

Include:

* あいうえお
* かきくけこ
* さしすせそ
* たちつてと
* なにぬねの
* はひふへほ
* まみむめも
* やゆよ
* らりるれろ
* わを
* ん

Also include:

* dakuten
* handakuten

Examples:

```text
が ぎ ぐ げ ご
ざ じ ず ぜ ぞ
だ ぢ づ で ど
ば び ぶ べ ぼ
ぱ ぴ ぷ ぺ ぽ
```

Include common combination sounds where practical.

## Katakana

Seed the standard basic Katakana set.

Do not manually duplicate Japanese data unnecessarily.

Design the database so characters can have:

* script
* character
* romanization
* pronunciation
* category
* variants
* related characters

---

# 15. Korean learning structure

Seed:

## Consonants

```text
ㄱ ㄴ ㄷ ㄹ ㅁ ㅂ ㅅ ㅇ ㅈ ㅊ ㅋ ㅌ ㅍ ㅎ
```

## Vowels

```text
ㅏ ㅑ ㅓ ㅕ ㅗ ㅛ ㅜ ㅠ ㅡ ㅣ
```

Include combined vowels where appropriate.

The architecture should support syllable construction.

Example:

```text
ㄱ + ㅏ = 가
ㄴ + ㅏ = 나
ㄷ + ㅏ = 다
```

---

# 16. Vocabulary categories

Create useful starter categories:

* greetings
* people
* family
* numbers
* food
* animals
* places
* transportation
* daily life
* common verbs
* common adjectives
* time
* colors

The architecture must allow additional categories.

---

# 17. Learning Progress

Every user should have progress per learning item.

Track at minimum:

```text
user
learning_item
attempt_count
correct_count
incorrect_count
accuracy
streak
mastery_level
last_reviewed_at
next_review_at
current_interval
difficulty
```

Do not store derived values unnecessarily if they can be calculated reliably.

Use appropriate indexes.

---

# 18. Spaced Repetition

Implement a simple, understandable review algorithm for the first version.

Suggested behavior:

```text
Again → review in ~10 minutes
Hard  → review in ~1 day
Good  → review in ~3 days
Easy  → review in ~7 days
```

Make the algorithm a separate service/module.

Example conceptual API:

```text
ReviewScheduler.calculateNextReview(...)
```

Do not embed scheduling logic directly inside controllers or React components.

The architecture should make it possible to replace this implementation with:

* SM-2
* FSRS

later.

---

# 19. Mistake Tracking

Every incorrect answer should be recorded appropriately.

Create a "Mistakes" experience.

Example:

```text
My Mistakes

12 items need review

Japanese

さ vs き
ぬ vs め

Korean

ㅓ vs ㅗ
ㅐ vs ㅔ

[ Practice Mistakes ]
```

The system should be able to generate a practice session specifically from weak items.

---

# 20. Confusion Training

Detect frequently confused items.

Examples:

Japanese:

```text
さ vs き
ぬ vs め
れ vs ね
シ vs ツ
ソ vs ン
```

Korean:

```text
ㅓ vs ㅗ
ㅐ vs ㅔ
ㄱ vs ㅋ
ㄷ vs ㅌ
```

Do not hard-code only these examples.

The architecture should allow confusion pairs/groups to be configured or generated from user mistake data.

---

# 21. Daily Goals

Implement daily learning goals.

Example:

```text
Today's Goals

□ Learn 10 new words       +50 XP
□ Review 20 words          +30 XP
□ Play 1 game              +20 XP
□ Practice Japanese        +30 XP
```

Track daily progress.

Reset appropriately based on the application's timezone strategy.

Do not assume UTC if the existing application already has a timezone policy.

---

# 22. XP System

Implement a simple XP system.

Examples:

```text
Correct answer       +5 XP
Complete lesson      +20 XP
Daily goal           +50 XP
Perfect challenge    +30 XP
```

Do not allow the frontend to arbitrarily submit XP values.

The backend should calculate or validate rewards.

Prevent obvious abuse such as:

```text
POST /game-result
xp = 999999
```

---

# 23. Streak

Track daily learning streak.

Example:

```text
🔥 7 day streak
```

Consider:

* current streak
* longest streak
* last study date

Make the calculation deterministic and timezone-aware.

---

# 24. Achievements

Implement an extensible achievement system.

Examples:

```text
First Steps
Complete your first lesson.

7 Day Streak
Study 7 consecutive days.

Hiragana Beginner
Complete basic Hiragana.

Hiragana Master
Master all Hiragana.

Katakana Beginner
Complete basic Katakana.

Hangul Beginner
Complete Hangul basics.

Polyglot
Study all four languages.

Speed Demon
Answer 20 questions correctly in a row.
```

Do not hard-code achievement logic into random controllers.

Use a clean achievement evaluation mechanism.

---

# 25. Dashboard

Create a useful dashboard.

Example information:

```text
Good evening 👋

🔥 7 day streak
⭐ 1,240 XP

Today's Goal
██████████████░░ 15 / 20

Due for Review
23 items

Weak Areas
Japanese Hiragana
Korean vowels
German vocabulary
```

Language cards:

```text
🇬🇧 English
Vocabulary: 342
Mastered: 127
Due: 23

🇩🇪 German
Vocabulary: 210
Mastered: 72

🇯🇵 Japanese
Hiragana: 46 / 46
Katakana: 31 / 46

🇰🇷 Korean
Consonants: 14 / 14
Vowels: 10 / 10
```

Do not overwhelm the UI.

The dashboard should prioritize actionable information.

---

# 26. UI / UX

The application is a learning game.

UI should feel:

* clean
* friendly
* modern
* responsive
* slightly gamified
* not childish
* easy to use for adults

Use the existing design system if one exists.

Do not introduce excessive animations.

Animations should communicate:

* correct answer
* wrong answer
* combo
* XP gained
* level/achievement unlocked

Respect accessibility.

Keyboard navigation should work for game interactions where reasonable.

---

# 27. Game Session Architecture

Create a reusable concept of a game session.

For example:

```text
GameSession

id
userId
gameType
language
startedAt
completedAt
score
correctCount
incorrectCount
duration
```

Game questions should be generated from learning items.

Do not trust the frontend to determine the final score.

The backend should validate important game results.

---

# 28. API design

Use the existing backend conventions.

Possible endpoints conceptually:

```text
GET    /languages
GET    /learning-items
GET    /learning-items/:id

GET    /learning/sessions
POST   /learning/sessions

POST   /game-sessions
POST   /game-sessions/:id/answer
POST   /game-sessions/:id/complete

GET    /reviews/due
POST   /reviews/:learningItemId

GET    /progress
GET    /progress/:language

GET    /mistakes
POST   /mistakes/practice-session

GET    /daily-goals
GET    /achievements
GET    /stats
```

These are examples, not mandatory names.

Follow REST conventions and the existing project's conventions.

Avoid exposing internal database structure unnecessarily.

---

# 29. Database requirements

Design a normalized relational schema.

Potential entities:

```text
languages

language_scripts

learning_items

learning_item_translations

learning_item_pronunciations

vocabulary_categories

alphabet_sets

alphabet_characters

alphabet_character_components

user_learning_progress

learning_reviews

learning_attempts

game_sessions

game_session_questions

game_session_answers

user_daily_progress

user_streaks

achievements

user_achievements
```

Do not blindly create every table listed above.

Evaluate whether each table is actually necessary.

Avoid over-normalization that makes simple queries unnecessarily complicated.

Add proper:

* primary keys
* foreign keys
* unique constraints
* indexes
* timestamps

where appropriate.

---

# 30. Important data-model rule

Do NOT create separate learning engines like:

```text
EnglishVocabularyService
GermanVocabularyService
JapaneseVocabularyService
KoreanVocabularyService
```

unless language-specific behavior truly requires it.

Prefer:

```text
LearningItem
Language
LearningItemType
```

and strategy/policy objects for genuinely language-specific behavior.

---

# 31. i18n

The current UI supports:

```text
en
vi
```

Preserve that.

Add translation keys for all new UI text.

Example:

```text
learning.dashboard.title
learning.dashboard.daily_goal
learning.game.correct
learning.game.incorrect
learning.game.next
learning.game.submit
learning.game.show_answer
learning.game.try_again
learning.review.due
learning.review.again
learning.review.hard
learning.review.good
learning.review.easy
learning.achievement.unlocked
```

Do not put English/Vietnamese directly inside UI components.

Content such as:

```text
apple
Apfel
りんご
사과
```

is learning data, not UI translation text.

Keep the distinction clear.

---

# 32. Seed data

Create seed data sufficient to demonstrate the application.

At minimum include:

## Japanese

* basic Hiragana
* basic Katakana
* dakuten
* handakuten
* common combinations

## Korean

* basic consonants
* basic vowels
* common combined vowels
* basic syllables

## Vocabulary

At least several dozen useful starter words across:

* English
* German
* Japanese
* Korean

Use consistent semantic concepts where possible.

For example:

```text
hello
goodbye
water
food
apple
dog
cat
house
book
school
friend
family
eat
drink
go
come
big
small
good
bad
```

Include:

* translation
* pronunciation/romanization where appropriate
* language
* category
* difficulty

Do not invent dubious linguistic information.

If unsure about a linguistic detail, flag it instead of silently creating incorrect seed data.

---

# 33. Validation

Validate:

* language IDs
* learning item IDs
* game session ownership
* submitted answers
* review ratings
* score calculations
* XP calculations

Never trust:

```text
userId
xp
score
correctAnswer
```

from the client when they can be derived server-side.

---

# 34. Security

Follow existing authentication/authorization.

Users must only access:

* their own progress
* their own game sessions
* their own mistakes
* their own achievements
* their own statistics

Public/shared learning content can be readable by authenticated users as appropriate.

Prevent IDOR/BOLA issues.

Validate ownership on resource access.

---

# 35. Performance

Design for efficient queries.

Important indexes will likely include:

```text
(user_id, learning_item_id)

(user_id, next_review_at)

(user_id, language_id)

(user_id, created_at)

(game_session_id)

(game_session_question_id)
```

But determine indexes based on the actual schema and query patterns.

Avoid N+1 queries.

Do not load the entire vocabulary database into the browser.

Paginate large collections.

For review sessions, retrieve only the number of items required.

---

# 36. Frontend architecture

Create reusable components where appropriate:

```text
LanguageSelector
LearningCard
Flashcard
AnswerOption
ProgressBar
XPBadge
StreakBadge
GameTimer
GameResult
AchievementCard
DailyGoalCard
VocabularyCard
AlphabetCard
MatchingBoard
TypingInput
CharacterBuilder
```

Do not create giant components containing all game logic.

Separate:

* UI
* game state
* API calls
* learning logic

where appropriate.

---

# 37. Game state

Games should have explicit states.

Example:

```text
idle
loading
playing
answering
answered
completed
```

Avoid scattered boolean state such as:

```text
isLoading
isStarted
isFinished
isAnswered
isCorrect
...
```

when a state machine or discriminated union would make the logic clearer.

Use the project's existing state-management conventions if they exist.

---

# 38. Error handling

Games should gracefully handle:

* API failure
* network interruption
* expired session
* invalid question
* duplicate submission

A user should not lose their entire session because one API request failed.

Where appropriate:

* retry
* preserve local state
* prevent duplicate submissions

---

# 39. Offline-friendly behavior

If the existing frontend architecture allows it, consider making active game sessions resilient to temporary network issues.

However:

DO NOT build a full offline synchronization system unless the existing application already requires it.

A lightweight approach is enough:

* keep current question in memory
* disable duplicate submission
* retry failed requests
* preserve unfinished session where reasonable

---

# 40. Accessibility

Support:

* keyboard navigation
* visible focus states
* semantic buttons
* screen-reader-friendly labels
* sufficient contrast
* reduced motion where possible

Do not make drag-and-drop the only way to complete matching games.

Provide a click/tap alternative.

---

# 41. Testing

Add tests according to the existing testing framework.

Prioritize:

## Backend

* learning item retrieval
* review scheduling
* answer validation
* XP calculation
* streak calculation
* achievement evaluation
* authorization
* game session ownership

## Frontend

* flashcard flow
* answer submission
* game completion
* progress rendering
* character builder
* i18n rendering

The most important domain logic should have unit tests.

---

# 42. Architecture quality

Avoid:

* God classes
* giant controllers
* giant React components
* duplicated game logic
* language-specific duplication
* hard-coded XP values everywhere
* hard-coded achievement checks everywhere
* business logic inside UI components
* database queries directly inside controllers if the backend architecture uses services/repositories
* arbitrary abstraction just for the sake of design patterns

Use design patterns only when they solve a real problem.

Potentially useful patterns:

* Strategy Pattern for review scheduling
* Strategy Pattern for game question generation
* Factory Pattern for game creation
* Repository/Service pattern if consistent with the existing backend
* State Machine for game sessions
* Adapter Pattern for audio providers

Do not introduce patterns unnecessarily.

---

# 43. Important architectural principle

The following should be possible in the future:

```text
Add Spanish
     ↓
Add Spanish learning content
     ↓
Existing games automatically support Spanish
```

and:

```text
Add new game
     ↓
Reuse Learning Engine
     ↓
Reuse Progress Engine
     ↓
Reuse XP / Achievement Engine
```

without rewriting the entire application.

This is one of the most important architectural requirements.

---

# 44. Suggested development phases

Do NOT attempt to build everything blindly in one giant change.

Work in phases.

## Phase 1

Analyze current project.

Produce:

* architecture analysis
* current stack
* existing conventions
* proposed architecture
* database ERD
* API design
* implementation plan

Do not modify code yet if major architectural questions remain unresolved.

## Phase 2

Implement:

* language model
* learning item model
* alphabet model
* vocabulary model
* seed data
* basic progress model

## Phase 3

Implement:

* Flashcards
* Multiple Choice
* basic review scheduling

## Phase 4

Implement:

* Matching
* Typing
* Game sessions
* score calculation

## Phase 5

Implement:

* XP
* achievements
* daily goals
* streaks
* mistake tracking

## Phase 6

Implement:

* Japanese Character Builder
* Korean Hangul Builder
* Listening

## Phase 7

Polish:

* dashboard
* responsive UI
* animations
* accessibility
* error handling
* performance
* tests

---

# 45. Before coding

First inspect the project and tell me:

1. What architecture currently exists?
2. What should be reused?
3. What needs to be introduced?
4. What database tables already exist?
5. What tables should be added?
6. What API structure should be used?
7. What frontend routes should be added?
8. What components should be created?
9. What risks or architectural conflicts do you see?
10. What implementation order do you recommend?

Then create a concrete implementation plan.

Do not immediately rewrite unrelated existing code.

---

# 46. Implementation behavior

After the architecture is approved or sufficiently clear from the existing project:

Implement incrementally.

For every major change:

1. Explain what you are changing.
2. Explain why.
3. Implement it.
4. Run relevant tests/type checks/lint/build.
5. Fix errors.
6. Summarize changed files.
7. Mention any remaining TODOs.

Do not claim something works if you did not verify it.

---

# 47. Code quality requirements

Use:

* strong typing
* meaningful names
* small cohesive functions
* reusable components
* clear domain boundaries
* validation
* proper error handling

Avoid:

```text
any
```

unless absolutely unavoidable.

Do not silence TypeScript errors with:

```text
as any
@ts-ignore
@ts-expect-error
```

unless there is a documented and unavoidable reason.

Follow existing lint rules.

---

# 48. Final expected result

The finished feature should feel like a real application:

```text
Dashboard
   │
   ├── Choose Language
   │
   ├── Learn
   │     ├── Vocabulary
   │     ├── Hiragana
   │     ├── Katakana
   │     └── Hangul
   │
   ├── Practice
   │     ├── Flashcards
   │     ├── Multiple Choice
   │     ├── Matching
   │     └── Typing
   │
   ├── Games
   │     ├── Speed Challenge
   │     ├── Listening
   │     └── Character Builder
   │
   ├── Review
   │     ├── Due Today
   │     └── Mistakes
   │
   └── Progress
         ├── XP
         ├── Streak
         ├── Achievements
         └── Statistics
```

The important part is that all of these features share the same underlying:

```text
Learning Engine
Progress Engine
Review Engine
Game Engine
```

rather than becoming independent CRUD features.

---

# 49. UX priority

Prioritize the learning experience in this order:

1. Fast interaction
2. Clear feedback
3. Low cognitive load
4. Immediate progress feedback
5. Useful repetition
6. Gamification
7. Visual polish

Do not sacrifice usability for animations or visual effects.

---

# 50. Important final instruction

Think like both:

* a senior software architect
* a language-learning product designer

Do not merely implement database CRUD.

Build a coherent learning system where:

```text
Content
   ↓
Game
   ↓
Answer
   ↓
Result
   ↓
Progress
   ↓
Review scheduling
   ↓
Weakness detection
   ↓
Targeted practice
```

is the central product loop.

Before making major changes, inspect the existing codebase carefully and adapt the solution to it.

Do not rewrite unrelated features.

Start by analyzing the existing project and presenting the proposed architecture and implementation plan.
