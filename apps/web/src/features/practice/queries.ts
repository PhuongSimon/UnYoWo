import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query'
import { practiceApi } from './api'

export const learningSetsQuery = (language: string) =>
  queryOptions({
    queryKey: ['learning-sets', language],
    queryFn: () => practiceApi.listSets(language),
  })

// Credits rarely change: keep them for the whole visit.
export const contentSourcesQuery = (language: string) =>
  queryOptions({
    queryKey: ['content-sources', language],
    queryFn: () => practiceApi.listSources(language),
    staleTime: Infinity,
  })

/** A set's words, 100 per page (a word-list set holds at most 30, an alphabet set up to 140). */
export const setItemsQuery = (setId: string) =>
  infiniteQueryOptions({
    queryKey: ['set-items', setId],
    queryFn: ({ pageParam }) => practiceApi.listItems(setId, pageParam),
    initialPageParam: 1,
    getNextPageParam: (last) => (last.page * last.pageSize < last.total ? last.page + 1 : undefined),
    staleTime: 5 * 60_000,
  })

// The game keeps its own state once loaded, so the cached copy must never be reused or refetched.
export const gameSessionQuery = (sessionId: string) =>
  queryOptions({
    queryKey: ['game-session', sessionId],
    queryFn: () => practiceApi.getSession(sessionId),
    staleTime: Infinity,
    gcTime: 0,
  })
