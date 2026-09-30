import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { useAuthStore } from '@/stores/auth.store'

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  // Gửi kèm cookie (refresh token httpOnly) trong mọi request
  withCredentials: true,
})

// 1) Trước mỗi request: gắn access token vào header
http.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// 2) Khi API trả 401 (access token hết hạn): gọi /auth/refresh một lần rồi gửi lại request cũ.
//    Nhiều request cùng 401 một lúc sẽ dùng chung một lần refresh (refreshPromise).
let refreshPromise: Promise<string> | null = null

async function refreshAccessToken(): Promise<string> {
  const { data } = await axios.post<{ accessToken: string }>(
    `${import.meta.env.VITE_API_URL}/auth/refresh`,
    null,
    { withCredentials: true },
  )
  useAuthStore.getState().setAccessToken(data.accessToken)
  return data.accessToken
}

type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean }

http.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as RetryConfig | undefined
    const isAuthCall = original?.url?.startsWith('/auth/')

    if (error.response?.status !== 401 || !original || original._retry || isAuthCall) {
      return Promise.reject(error)
    }

    original._retry = true
    try {
      refreshPromise ??= refreshAccessToken().finally(() => {
        refreshPromise = null
      })
      const token = await refreshPromise
      original.headers.Authorization = `Bearer ${token}`
      return http(original)
    } catch (refreshError) {
      useAuthStore.getState().clear()
      return Promise.reject(refreshError)
    }
  },
)
