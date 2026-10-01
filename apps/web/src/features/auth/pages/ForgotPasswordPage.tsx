import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Link, useNavigate } from 'react-router'
import Button from '@/components/ui/Button'
import TextField from '@/components/ui/TextField'
import { authApi } from '@/features/auth/api'
import { apiErrorKey, getApiError } from '@/lib/api-error'
import { forgotPasswordSchema, type ForgotPasswordInput } from '@/features/auth/schemas'

function ForgotPasswordPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  async function onSubmit(data: ForgotPasswordInput) {
    try {
      await authApi.forgotPassword(data.email)
    } catch (error) {
      toast.error(t(apiErrorKey(getApiError(error).code)))
      return
    }

    const params = new URLSearchParams({ email: data.email, purpose: 'reset' })
    navigate(`/verify-otp?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold">{t('auth.forgot.title')}</h1>
        <p className="mt-1 text-sm text-muted">{t('auth.forgot.subtitle')}</p>
      </div>

      <TextField
        label={t('auth.fields.email')}
        type="email"
        placeholder={t('auth.fields.emailPlaceholder')}
        error={errors.email?.message}
        {...register('email')}
      />

      <Button type="submit" loading={isSubmitting} className="w-full">
        {t('auth.forgot.submit')}
      </Button>

      <Link to="/login" className="text-sm text-accent underline">
        {t('auth.forgot.backToLogin')}
      </Link>
    </form>
  )
}

export default ForgotPasswordPage