import { queryOptions } from '@tanstack/react-query'
import { practiceApi } from './api'

export const learningSetsQuery = (language: string) =>
  queryOptions({
    queryKey: ['learning-sets', language],
    queryFn: () => practiceApi.listSets(language),
  })

// The game keeps its own state once loaded, so the cached copy must never be reused or refetched.
export const gameSessionQuery = (sessionId: string) =>
  queryOptions({
    queryKey: ['game-session', sessionId],
    queryFn: () => practiceApi.getSession(sessionId),
    staleTime: Infinity,
    gcTime: 0,
  })
