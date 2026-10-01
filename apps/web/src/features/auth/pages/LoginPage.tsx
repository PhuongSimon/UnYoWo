import { useRef } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router'
import { useTranslation } from 'react-i18next'
import Button from '@/components/ui/Button'
import TextField from '@/components/ui/TextField'
import { loginSchema, type LoginInput } from '@/features/auth/schemas'
import PasswordField from '@/components/ui/PasswordField'
import type { TurnstileInstance } from '@marsidev/react-turnstile'
import { toast } from 'sonner'
import CaptchaField from '@/features/auth/components/CaptchaField'
import GoogleButton from '../components/GoogleButton'
import { authApi } from '@/features/auth/api'
import { APP_HOME } from '@/features/auth/constants'
import { apiErrorKey, getApiError } from '@/lib/api-error'
import { useAuthStore } from '@/stores/auth.store'

function LoginPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const setAuth = useAuthStore((s) => s.setAuth)
  const captchaRef = useRef<TurnstileInstance>(undefined)
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors, isSubmitting, isSubmitted }
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { captchaToken: '' }
  })

  async function onSubmit(data: LoginInput) {
    try {
      const session = await authApi.login(data)
      setAuth(session.accessToken, session.user)
      const from = (location.state as { from?: string } | null)?.from
      navigate(from ?? APP_HOME, { replace: true })
    } catch (error) {
      captchaRef.current?.reset()
      setValue('captchaToken', '')

      const { code, email } = getApiError(error)
      if (code === 'EMAIL_NOT_VERIFIED') {
        const params = new URLSearchParams({ email: email ?? data.email, purpose: 'register' })
        navigate(`/verify-otp?${params.toString()}`, { viewTransition: true })
      } else if (code === 'INVALID_CREDENTIALS') {
        setError('password', { message: apiErrorKey(code) })
      } else {
        toast.error(t(apiErrorKey(code)))
      }
    }
  }

  return (
    <form onSubmit={(e) => handleSubmit(onSubmit)(e)} noValidate className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">{t('auth.login.title')}</h1>

      <TextField
        label={t('auth.fields.email')}
        type="email"
        placeholder={t('auth.fields.emailPlaceholder')}
        autoComplete="email"
        error={errors.email?.message}
        {...register('email')}
      />
      <PasswordField
        label={t('auth.fields.password')}
        autoComplete="current-password"
        error={errors.password?.message}
        {...register('password')}
      />
      <div className="flex items-center gap-6 mt-4">
        <Button type="submit" loading={isSubmitting} className="flex-1">
          {t('auth.login.submit')}
        </Button>
      
        <Link viewTransition to="/forgot-password" className="shrink-0 whitespace-nowrap text-sm font-medium text-accent hover:underline">
          {t('auth.login.forgotPassword')}
        </Link>
      </div>
      <CaptchaField
        ref={captchaRef}
        error={errors.captchaToken?.message}
        onChange={(token) =>
          setValue('captchaToken', token, { shouldValidate: isSubmitted })
        }
      />
      <GoogleButton>
        <span className="ml-4">{t('auth.login.google')}</span>
      </GoogleButton>

      <div className="flex items-center gap-3 mt-4">
        <div className="flex-1 border-b border-line-soft"></div>
        <Link viewTransition
          to="/register"
          className="text-center text-xs font-medium text-accent uppercase hover:underline hover:text-accent whitespace-nowrap"
        >
          {t('auth.login.noAccount')}
        </Link>
        <div className="flex-1 border-b border-line-soft"></div>
      </div>
    </form>
  )
}

export default LoginPage
