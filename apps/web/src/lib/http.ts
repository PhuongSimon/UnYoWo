import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'
import i18n from '@/i18n'
import { useAuthStore, type AuthUser } from '@/stores/auth.store'

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
})

http.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken
  if (token) config.headers.Authorization = `Bearer ${token}`
  config.headers['Accept-Language'] = i18n.language
  return config
})

interface SessionResponse {
  accessToken: string
  user: AuthUser
}

// Several requests can hit 401 at the same time: they all wait for one shared refresh.
let refreshPromise: Promise<SessionResponse> | null = null

export function refreshSession() {
  refreshPromise ??= axios
    .post<SessionResponse>(`${import.meta.env.VITE_API_URL}/auth/refresh`, null, { withCredentials: true })
    .then(({ data }) => {
      useAuthStore.getState().setAuth(data.accessToken, data.user)
      return data
    })
    .finally(() => {
      refreshPromise = null
    })
  return refreshPromise
}

const NO_RETRY_URLS = ['/auth/login', '/auth/refresh', '/auth/logout', '/auth/register', '/auth/otp/verify']

type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean }

http.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as RetryConfig | undefined
    const skip = NO_RETRY_URLS.some((url) => original?.url?.startsWith(url))

    if (error.response?.status !== 401 || !original || original._retry || skip) {
      return Promise.reject(error)
    }

    original._retry = true
    try {
      const { accessToken } = await refreshSession()
      original.headers.Authorization = `Bearer ${accessToken}`
      return http(original)
    } catch (refreshError) {
      useAuthStore.getState().clear()
      return Promise.reject(refreshError)
    }
  },
)
