import { isAxiosError } from 'axios'

export interface ApiErrorBody {
  statusCode: number
  code: string
  retryAfter?: number
  attemptsLeft?: number
  email?: string
}

export function getApiError(error: unknown): ApiErrorBody {
  if (isAxiosError<ApiErrorBody>(error) && error.response?.data?.code) {
    return error.response.data
  }
  return { statusCode: 0, code: 'NETWORK_ERROR' }
}

export function apiErrorKey(code: string) {
  return `apiErrors.${code}`
}
