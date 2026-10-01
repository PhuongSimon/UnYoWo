import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Navigate, useLocation, useNavigate } from 'react-router'
import { toast } from 'sonner'
import Button from '@/components/ui/Button'
import PasswordField from '@/components/ui/PasswordField'
import { authApi } from '@/features/auth/api'
import { apiErrorKey, getApiError } from '@/lib/api-error'
import { resetPasswordSchema, type ResetPasswordInput } from '@/features/auth/schemas'

interface ResetState {
  email: string
  resetToken: string
}

function isResetState(value: unknown): value is ResetState {
  return (
    typeof value === 'object' &&
    value !== null &&
    'email' in value &&
    'resetToken' in value &&
    typeof value.email === 'string' &&
    typeof value.resetToken === 'string'
  )
}

function ResetPasswordPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
  })

  const state = location.state
  if (!isResetState(state)) {
    return <Navigate to="/forgot-password" replace />
  }

  async function onSubmit(data: ResetPasswordInput) {
    try {
      await authApi.resetPassword(state.resetToken, data.password)
    } catch (error) {
      const { code } = getApiError(error)
      toast.error(t(apiErrorKey(code)))
      if (code === 'RESET_TOKEN_INVALID') navigate('/forgot-password', { replace: true })
      return
    }
    toast.success(t('auth.reset.success'))
    navigate('/login', { replace: true })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold">{t('auth.reset.title')}</h1>
        <p className="mt-1 break-all text-sm text-muted">
          {t('auth.reset.subtitle', { email: state.email })}
        </p>
      </div>

      <PasswordField
        label={t('auth.fields.newPassword')}
        autoComplete="new-password"
        autoFocus
        error={errors.password?.message}
        {...register('password', { deps: ['confirmPassword'] })}
      />
      <PasswordField
        label={t('auth.fields.confirmNewPassword')}
        autoComplete="new-password"
        error={errors.confirmPassword?.message}
        {...register('confirmPassword')}
      />

      <Button type="submit" loading={isSubmitting} className="w-full">
        {t('auth.reset.submit')}
      </Button>
    </form>
  )
}

export default ResetPasswordPage