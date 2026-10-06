import { http } from '@/lib/http'
import type { Achievement, LanguageMistakes, ProgressSummary } from './types'

export const progressApi = {
  summary: () => http.get<ProgressSummary>('/progress/summary').then((r) => r.data),
  achievements: () => http.get<Achievement[]>('/achievements').then((r) => r.data),
  mistakes: () => http.get<LanguageMistakes[]>('/mistakes').then((r) => r.data),
}
