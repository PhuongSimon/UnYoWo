import { http } from '@/lib/http'
import type { AuthUser } from '@/stores/auth.store'

export type OtpPurpose = 'REGISTER' | 'RESET_PASSWORD'

interface SessionResponse {
  accessToken: string
  user: AuthUser
}

export const authApi = {
  register: (body: { fullName: string; email: string; password: string; captchaToken: string }) =>
    http.post<{ email: string }>('/auth/register', body).then((r) => r.data),

  login: (body: { email: string; password: string; captchaToken: string }) =>
    http.post<SessionResponse>('/auth/login', body).then((r) => r.data),

  forgotPassword: (email: string) => http.post('/auth/forgot-password', { email }),

  resendOtp: (email: string, purpose: OtpPurpose) => http.post('/auth/otp/resend', { email, purpose }),

  verifyRegisterOtp: (email: string, code: string) =>
    http
      .post<SessionResponse>('/auth/otp/verify', { email, code, purpose: 'REGISTER' })
      .then((r) => r.data),

  verifyResetOtp: (email: string, code: string) =>
    http
      .post<{ resetToken: string }>('/auth/otp/verify', { email, code, purpose: 'RESET_PASSWORD' })
      .then((r) => r.data),

  resetPassword: (resetToken: string, password: string) =>
    http.post('/auth/reset-password', { resetToken, password }),

  logout: () => http.post('/auth/logout'),
}
