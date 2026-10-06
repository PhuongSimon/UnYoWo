import type { DrillCell } from './scripts'

/** "Continuous" submits by itself once the romanisation is complete; "enter" waits for the Enter key. */
export type DrillMode = 'continuous' | 'enter'

export interface DrillAnswer {
  char: string
  expected: string
  given: string
  correct: boolean
  /** Time from showing the character to answering it */
  ms: number
}

/** Letters only, lower case: "Shi " and "s-h-i" both read as "shi". */
export const normalizeRomaji = (text: string) => text.toLowerCase().replace(/[^a-z]/g, '')

export const isCorrect = (typed: string, answers: string[]) => answers.includes(normalizeRomaji(typed))

export type ContinuousRead = { done: false } | { done: true; given: string }

/**
 * Continuous mode: decides after each keystroke whether the answer is complete.
 * - an accepted spelling → done, correct, at once ("n" for ん, even though "nn" is accepted too)
 * - still the start of an accepted spelling ("s" or "sh" for し) → keep typing
 * - wrong once as many letters as the shortest spelling are typed ("ga" for こ, "sa" for し), so a
 *   wrong first letter does not spill the rest of the answer into the next character
 */
export function readContinuous(typed: string, answers: string[]): ContinuousRead {
  const text = normalizeRomaji(typed)
  if (!text) return { done: false }
  if (answers.includes(text)) return { done: true, given: text }
  if (answers.some((answer) => answer.startsWith(text))) return { done: false }
  const shortest = Math.min(...answers.map((answer) => answer.length))
  return text.length >= shortest ? { done: true, given: text } : { done: false }
}

/** Fisher–Yates: every order is equally likely. */
export function shuffle<T>(items: T[], random: () => number = Math.random): T[] {
  const result = [...items]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

export interface Mistake {
  char: string
  expected: string
  /** What was typed each time, "" when skipped */
  given: string[]
}

export interface DrillSummary {
  total: number
  correct: number
  accuracy: number
  durationMs: number
  averageMs: number
  bestStreak: number
  /** Most-missed first, then in the order they came up */
  mistakes: Mistake[]
}

export function summarize(answers: DrillAnswer[], durationMs: number): DrillSummary {
  const correct = answers.filter((answer) => answer.correct).length
  let streak = 0
  let bestStreak = 0
  const mistakes = new Map<string, Mistake>()

  for (const answer of answers) {
    streak = answer.correct ? streak + 1 : 0
    bestStreak = Math.max(bestStreak, streak)
    if (answer.correct) continue
    const mistake = mistakes.get(answer.char) ?? { char: answer.char, expected: answer.expected, given: [] }
    mistake.given.push(answer.given)
    mistakes.set(answer.char, mistake)
  }

  return {
    total: answers.length,
    correct,
    accuracy: answers.length > 0 ? Math.round((correct / answers.length) * 100) : 0,
    durationMs,
    averageMs: answers.length > 0 ? Math.round(answers.reduce((sum, answer) => sum + answer.ms, 0) / answers.length) : 0,
    bestStreak,
    mistakes: [...mistakes.values()].sort((a, b) => b.given.length - a.given.length),
  }
}

/** The cells to practise again: the ones answered wrong, in a new order. */
export const mistakeCells = (cells: DrillCell[], summary: DrillSummary) =>
  cells.filter((cell) => summary.mistakes.some((mistake) => mistake.char === cell.char))
