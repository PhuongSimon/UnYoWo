import { queryOptions } from '@tanstack/react-query'
import { progressApi } from './api'

// Refreshed after every finished game (see useSessionCompletion), so a short staleTime is enough.
export const progressSummaryQuery = queryOptions({
  queryKey: ['progress-summary'],
  queryFn: progressApi.summary,
  staleTime: 30_000,
})

export const achievementsQuery = queryOptions({ queryKey: ['achievements'], queryFn: progressApi.achievements })

export const mistakesQuery = queryOptions({ queryKey: ['mistakes'], queryFn: progressApi.mistakes })
