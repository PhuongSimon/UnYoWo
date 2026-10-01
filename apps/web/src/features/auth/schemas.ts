import { z } from 'zod'
import { errorKey } from '@/lib/i18n-error'

export const PASSWORD_MIN_LENGTH = 8

const captchaToken = z.string().min(1, 'validation.captchaRequired')

const email = z
  .string()
  .trim()
  .min(1, 'validation.emailRequired')
  .pipe(z.email('validation.emailInvalid'))

const passwordPair = z.object({
  password: z
    .string()
    .min(PASSWORD_MIN_LENGTH, errorKey('validation.passwordMin', { min: PASSWORD_MIN_LENGTH })),
  confirmPassword: z.string().min(1, 'validation.confirmRequired'),
})

const validatePasswordMatch = (data: { password: string; confirmPassword: string }) =>
  data.password === data.confirmPassword

const passwordMismatchOptions = {
  message: 'validation.passwordMismatch',
  path: ['confirmPassword'],
}

export const loginSchema = z.object({
  email,
  password: z.string().min(1, 'validation.passwordRequired'),
  captchaToken,
})

export const registerSchema = passwordPair
  .extend({
    fullName: z.string().min(1, 'validation.fullNameRequired'),
    email,
    captchaToken,
  })
  .refine(validatePasswordMatch, passwordMismatchOptions)

export const forgotPasswordSchema = z.object({
  email,
})

export const resetPasswordSchema = passwordPair.refine(validatePasswordMatch, passwordMismatchOptions)

export type LoginInput = z.infer<typeof loginSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>
