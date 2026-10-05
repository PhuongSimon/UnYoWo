/** Every XP amount in one place. The client never sends XP; the server awards it from these rules. */
export const XP_POLICY = {
  correctAnswer: 5,
  sessionComplete: 20,
  perfectSession: 30,
  /** A session must have this many answers (or all of its questions) to earn the completion bonus */
  minAnswersForSessionBonus: 5,
  /** Perfect = every question answered, no mistake, and at least this many questions */
  minQuestionsForPerfect: 5,
} as const;
