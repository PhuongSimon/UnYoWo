import { http } from '@/lib/http'
import type { AnswerInput, AnswerResult, GameSession, LearningSet, NewGame, SessionSummary } from './types'

export const practiceApi = {
  listSets: (language: string) => http.get<LearningSet[]>(`/languages/${language}/sets`).then((r) => r.data),

  createSession: (game: NewGame) => http.post<GameSession>('/game-sessions', game).then((r) => r.data),

  getSession: (sessionId: string) => http.get<GameSession>(`/game-sessions/${sessionId}`).then((r) => r.data),

  submitAnswer: (sessionId: string, body: AnswerInput & { questionId: string; idempotencyKey: string; responseMs: number }) =>
    http.post<AnswerResult>(`/game-sessions/${sessionId}/answers`, body).then((r) => r.data),

  completeSession: (sessionId: string) =>
    http.post<SessionSummary>(`/game-sessions/${sessionId}/complete`).then((r) => r.data),
}
