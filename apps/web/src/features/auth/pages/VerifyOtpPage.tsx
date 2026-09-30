import { useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Navigate, useNavigate, useSearchParams } from 'react-router'
import Button from '@/components/ui/Button'
import OtpInput from '@/features/auth/components/OtpInput'
import ResendOtpButton from '@/features/auth/components/ResendOtpButton'
import { toast } from 'sonner'

const OTP_LENGTH = 6
const isCompleteOtp = (value: string) => new RegExp(`^\\d{${OTP_LENGTH}}$`).test(value)

async function fakeVerifyOtp(code: string) {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  if (code !== '123456') throw new Error('INVALID_OTP')
  return { resetToken: 'fake-reset-token' }
}

async function fakeSendOtp() {
  await new Promise((resolve) => setTimeout(resolve, 1000))
}

function VerifyOtpPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [verifying, setVerifying] = useState(false)

  const email = searchParams.get('email')
  const purpose = searchParams.get('purpose')

  if (!email || (purpose !== 'reset' && purpose !== 'register')) {
    return <Navigate to="/login" replace />
  }

  async function verify(code: string) {
    setVerifying(true)
    setError('')
    try {
      const result = await fakeVerifyOtp(code)

      if (purpose === 'reset') {
        navigate('/reset-password', {
          replace: true,
          state: { email, resetToken: result.resetToken },
        })
      } else {
        navigate('/login', { replace: true })
      }
    } catch {
      setError('auth.verifyOtp.invalid')
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
    await fakeSendOtp()
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
          {t(error)}
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

      <p className="text-center text-xs text-muted/70">{t('auth.verifyOtp.hint')}</p>
    </form>
  )
}

export default VerifyOtpPage