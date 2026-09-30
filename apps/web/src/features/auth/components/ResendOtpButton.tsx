import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

interface ResendOtpButtonProps {
  onResend: () => Promise<void>
  cooldown?: number
}

function ResendOtpButton({ onResend, cooldown = 60 }: ResendOtpButtonProps) {
  const { t } = useTranslation()
  const [secondsLeft, setSecondsLeft] = useState(cooldown)
  const [sending, setSending] = useState(false)

  useEffect(() => {
    if (secondsLeft <= 0) return

    const timerId = setTimeout(() => {
      setSecondsLeft((s) => s - 1)
    }, 1000)

    return () => clearTimeout(timerId)
  }, [secondsLeft])

  async function handleClick() {
    setSending(true)
    try {
      await onResend()
      setSecondsLeft(cooldown)
    } finally {
      setSending(false)
    }
  }

  const canResend = secondsLeft <= 0 && !sending

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!canResend}
      className="min-h-11 text-sm font-medium text-accent hover:underline disabled:text-muted/60 disabled:no-underline"
    >
      {secondsLeft > 0
        ? t('auth.verifyOtp.resendIn', { seconds: secondsLeft })
        : t('auth.verifyOtp.resend')}
    </button>
  )
}

export default ResendOtpButton