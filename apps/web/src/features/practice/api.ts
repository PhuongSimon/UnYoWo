import { http } from '@/lib/http'
import type {
  AnswerInput,
  AnswerResult,
  ContentSource,
  GameSession,
  LearningSet,
  NewGame,
  SessionSummary,
  SessionTimer,
  SetItemsPage,
} from './types'

export const practiceApi = {
  listSets: (language: string) => http.get<LearningSet[]>(`/languages/${language}/sets`).then((r) => r.data),

  listSources: (language: string) => http.get<ContentSource[]>(`/languages/${language}/sources`).then((r) => r.data),

  listItems: (setId: string, page: number, pageSize: number) =>
    http.get<SetItemsPage>(`/learning-sets/${setId}/items`, { params: { page, pageSize } }).then((r) => r.data),

  createSession: (game: NewGame) => http.post<GameSession>('/game-sessions', game).then((r) => r.data),

  getSession: (sessionId: string) => http.get<GameSession>(`/game-sessions/${sessionId}`).then((r) => r.data),

  submitAnswer: (sessionId: string, body: AnswerInput & { questionId: string; idempotencyKey: string; responseMs: number }) =>
    http.post<AnswerResult>(`/game-sessions/${sessionId}/answers`, body).then((r) => r.data),

  startSession: (sessionId: string) =>
    http.post<{ timer: SessionTimer; serverNow: string }>(`/game-sessions/${sessionId}/start`).then((r) => r.data),

  completeSession: (sessionId: string) =>
    http.post<SessionSummary>(`/game-sessions/${sessionId}/complete`).then((r) => r.data),
}
