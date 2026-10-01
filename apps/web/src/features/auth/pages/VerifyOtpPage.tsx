import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Navigate, useNavigate, useSearchParams } from 'react-router'
import Button from '@/components/ui/Button'
import OtpInput from '@/features/auth/components/OtpInput'
import ResendOtpButton from '@/features/auth/components/ResendOtpButton'
import { toast } from 'sonner'
import { authApi } from '@/features/auth/api'
import { APP_HOME } from '@/features/auth/constants'
import { apiErrorKey, getApiError } from '@/lib/api-error'
import { errorKey, translateError } from '@/lib/i18n-error'
import { useAuthStore } from '@/stores/auth.store'

const OTP_LENGTH = 6
const isCompleteOtp = (value: string) => new RegExp(`^\\d{${OTP_LENGTH}}$`).test(value)

function VerifyOtpPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)
  const [searchParams] = useSearchParams()
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [verifying, setVerifying] = useState(false)

  const email = searchParams.get('email')
  const purpose = searchParams.get('purpose')

  if (!email || (purpose !== 'reset' && purpose !== 'register')) {
    return <Navigate to="/login" replace />
  }
  const targetEmail = email

  async function verify(code: string) {
    setVerifying(true)
    setError('')
    try {
      if (purpose === 'reset') {
        const { resetToken } = await authApi.verifyResetOtp(targetEmail, code)
        navigate('/reset-password', { replace: true, state: { email, resetToken } })
      } else {
        const session = await authApi.verifyRegisterOtp(targetEmail, code)
        setAuth(session.accessToken, session.user)
        navigate(APP_HOME, { replace: true })
      }
    } catch (err) {
      const { code: errorCode, attemptsLeft } = getApiError(err)
      setError(
        errorCode === 'OTP_INVALID' && attemptsLeft !== undefined
          ? errorKey('apiErrors.OTP_INVALID_ATTEMPTS', { count: attemptsLeft })
          : apiErrorKey(errorCode),
      )
      setOtp('')
    } finally {
      setVerifying(false)
    }
  }

  function handleOtpChange(value: string) {
    setOtp(value)
    if (error) setError('')
    if (isCompleteOtp(value)) verify(value)
  }

  async function handleResend() {
    try {
      await authApi.resendOtp(targetEmail, purpose === 'reset' ? 'RESET_PASSWORD' : 'REGISTER')
    } catch (err) {
      const { code, retryAfter } = getApiError(err)
      toast.error(
        code === 'OTP_COOLDOWN' && retryAfter
          ? t('apiErrors.OTP_COOLDOWN_SECONDS', { seconds: retryAfter })
          : t(apiErrorKey(code)),
      )
      throw err
    }
    setOtp('')
    setError('')
    toast.success(t('auth.verifyOtp.resent'))
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (isCompleteOtp(otp)) verify(otp)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div>
        <h1 className="text-2xl font-bold">{t('auth.verifyOtp.title')}</h1>
        <p className="mt-1 break-all text-sm text-muted">
          {t('auth.verifyOtp.sentTo', { email })}
        </p>
      </div>

      <OtpInput
        value={otp}
        onChange={handleOtpChange}
        length={OTP_LENGTH}
        error={!!error}
        disabled={verifying}
      />

      {error && (
        <p role="alert" className="text-center text-sm text-danger">
          {translateError(t, error)}
        </p>
      )}

      <Button
        type="submit"
        loading={verifying}
        disabled={!isCompleteOtp(otp)}
        className="w-full"
      >
        {t('auth.verifyOtp.submit')}
      </Button>

      <div className="flex justify-center">
        <ResendOtpButton onResend={handleResend} />
      </div>
    </form>
  )
}

export default VerifyOtpPage