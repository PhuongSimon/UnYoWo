import { queryOptions } from '@tanstack/react-query'
import type { StudyLanguage } from './types'

// The content is static and bundled with the app, so it never goes stale.
export const studyContentQuery = (language: StudyLanguage) =>
  queryOptions({
    queryKey: ['study-content', language.code],
    queryFn: () => language.load(),
    staleTime: Infinity,
    gcTime: Infinity,
  })
