import { zodResolver } from '@hookform/resolvers/zod'
import { useRef } from 'react'
import type { TurnstileInstance } from '@marsidev/react-turnstile'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
import Button from '@/components/ui/Button'
import TextField from '@/components/ui/TextField'
import { registerSchema, type RegisterInput } from '@/features/auth/schemas'
import { Link, useNavigate } from 'react-router'
import PasswordField from '@/components/ui/PasswordField'
import CaptchaField from '@/features/auth/components/CaptchaField'
import GoogleButton from '../components/GoogleButton'
import { authApi } from '@/features/auth/api'
import { apiErrorKey, getApiError } from '@/lib/api-error'

function RegisterPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const captchaRef = useRef<TurnstileInstance>(undefined)
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors, isSubmitting, isSubmitted }
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { captchaToken: '' }
  });

  async function onSubmit({ confirmPassword: _confirm, ...body }: RegisterInput) {
    try {
      const { email } = await authApi.register(body)
      const params = new URLSearchParams({ email, purpose: 'register' })
      navigate(`/verify-otp?${params.toString()}`)
    } catch (error) {
      captchaRef.current?.reset()
      setValue('captchaToken', '')

      const { code } = getApiError(error)
      if (code === 'EMAIL_TAKEN') setError('email', { message: apiErrorKey(code) })
      else toast.error(t(apiErrorKey(code)))
    }
  }

  return (
    <form onSubmit={(e) => handleSubmit(onSubmit)(e)} noValidate className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">{t('auth.register.title')}</h1>

      <TextField
        label={t('auth.fields.fullName')}
        type="text"
        placeholder={t('auth.fields.fullNamePlaceholder')}
        error={errors.fullName?.message}
        {...register('fullName')}
      />
      <TextField
        label={t('auth.fields.email')}
        type="email"
        placeholder={t('auth.fields.emailPlaceholder')}
        error={errors.email?.message}
        {...register('email')}
      />
      <PasswordField
        label={t('auth.fields.password')}
        error={errors.password?.message}
        autoComplete="new-password"
        {...register('password', { deps: ['confirmPassword'] })}
      />
      <PasswordField
        label={t('auth.fields.confirmPassword')}
        error={errors.confirmPassword?.message}
        autoComplete="new-password"
        {...register('confirmPassword')}
      />
      <CaptchaField
        ref={captchaRef}
        error={errors.captchaToken?.message}
        onChange={(token) =>
          setValue('captchaToken', token, { shouldValidate: isSubmitted })
        }
      />

      <Button type="submit" loading={isSubmitting}>
        {t('auth.register.submit')}
      </Button>
      <GoogleButton>
        <span className="ml-4">{t('auth.register.google')}</span>
      </GoogleButton>
      <div className="flex items-center gap-3 mt-4">
        <div className="flex-1 border-b border-line-soft"></div>
        <Link
          to="/login"
          className="text-center text-xs font-medium text-accent uppercase hover:underline hover:text-accent whitespace-nowrap"
        >
          {t('auth.register.haveAccount')}
        </Link>
        <div className="flex-1 border-b border-line-soft"></div>
      </div>
    </form>
  )
}

export default RegisterPage
