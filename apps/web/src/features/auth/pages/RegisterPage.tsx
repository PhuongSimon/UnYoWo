import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import Button from '@/components/ui/Button'
import TextField from '@/components/ui/TextField'
import { registerSchema, type RegisterInput } from '@/features/auth/schemas'
import { Link, useNavigate } from 'react-router'
import PasswordField from '@/components/ui/PasswordField'
import CaptchaField from '@/features/auth/components/CaptchaField'
import GoogleButton from '../components/GoogleButton'

function RegisterPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting, isSubmitted }
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: { captchaToken: '' }
  });

  async function onSubmit(data: RegisterInput) {
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const params = new URLSearchParams({ email: data.email, purpose: 'register' })
    navigate(`/verify-otp?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
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
        {...register('password', { deps: ['confirmPassword'] })}
      />
      <PasswordField
        label={t('auth.fields.confirmPassword')}
        error={errors.confirmPassword?.message}
        {...register('confirmPassword')}
      />
      <CaptchaField
        error={errors.captchaToken?.message}
        onChange={(token) =>
          setValue('captchaToken', token, { shouldValidate: isSubmitted })
        }
      />

      <Button type="submit" loading={isSubmitting}>
        {t('auth.register.submit')}
      </Button>
      <GoogleButton>
        <span className="ml-4">{t('auth.login.google')}</span>
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
