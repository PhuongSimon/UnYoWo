import { http } from '@/lib/http'
import type { TranslateRequest, TranslationResult } from './types'

export const translateApi = {
  translate: (body: TranslateRequest) => http.post<TranslationResult>('/translate', body).then((r) => r.data),
}
