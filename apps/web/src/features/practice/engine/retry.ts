import { getApiError } from '@/lib/api-error'

const RETRY_DELAYS_MS = [400, 1200]

/** Retries network drops and server errors; a 4xx answer from the API is final. */
export async function withRetry<T>(request: () => Promise<T>, delays = RETRY_DELAYS_MS): Promise<T> {
  for (let attempt = 0; ; attempt++) {
    try {
      return await request()
    } catch (error) {
      const { statusCode } = getApiError(error)
      const retryable = statusCode === 0 || statusCode >= 500
      if (!retryable || attempt >= delays.length) throw error
      await new Promise((resolve) => setTimeout(resolve, delays[attempt]))
    }
  }
}
