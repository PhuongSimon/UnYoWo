import { queryOptions } from '@tanstack/react-query'
import { practiceApi } from './api'

/** The API's largest page size, which holds the biggest set. */
const SET_ITEMS_LIMIT = 200

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

/**
 * Every word of a set in one request: the word list searches and pages them in the browser.
 * A set is small: vocabulary sets are split into parts of at most 30 words, alphabet charts hold up to 140.
 */
export const setItemsQuery = (setId: string) =>
  queryOptions({
    queryKey: ['set-items', setId],
    queryFn: () => practiceApi.listItems(setId, 1, SET_ITEMS_LIMIT),
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
