import { useRef } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router'
import { useTranslation } from 'react-i18next'
import Button from '@/components/ui/Button'
import TextField from '@/components/ui/TextField'
import { loginSchema, type LoginInput } from '@/features/auth/schemas'
import PasswordField from '@/components/ui/PasswordField'
import type { TurnstileInstance } from '@marsidev/react-turnstile'
import { toast } from 'sonner'
import CaptchaField from '@/features/auth/components/CaptchaField'
import GoogleButton from '../components/GoogleButton'

function LoginPage() {
  const { t } = useTranslation()
  const captchaRef = useRef<TurnstileInstance>(undefined)
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting, isSubmitted }
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { captchaToken: '' }
  })

  async function onSubmit(_data: LoginInput) {
    try {
      await new Promise((_, reject) => setTimeout(() => reject(new Error('INVALID')), 1000))
    } catch {
      toast.error(t('common.captchaError'))
      captchaRef.current?.reset()
      setValue('captchaToken', '')
    }
  }

  return (
    <form onSubmit={(e) => handleSubmit(onSubmit)(e)} noValidate className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">{t('auth.login.title')}</h1>

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
        {...register('password')}
      />
      <Link to="/forgot-password" className="self-end font-medium text-sm text-accent hover:underline">
        {t('auth.login.forgotPassword')}
      </Link>
      <CaptchaField
        ref={captchaRef}
        error={errors.captchaToken?.message}
        onChange={(token) =>
          setValue('captchaToken', token, { shouldValidate: isSubmitted })
        }
      />
      <Button type="submit" loading={isSubmitting}>
        {t('auth.login.submit')}
      </Button>
      <GoogleButton>
        <span className="ml-4">{t('auth.login.google')}</span>
      </GoogleButton>

      <div className="flex items-center gap-3 mt-4">
        <div className="flex-1 border-b border-line-soft"></div>
        <Link
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
