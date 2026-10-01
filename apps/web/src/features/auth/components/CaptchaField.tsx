import { Turnstile, type TurnstileInstance } from '@marsidev/react-turnstile'
import type { Ref } from 'react'
import { useTranslation } from 'react-i18next'
import { useThemeStore } from '@/stores/theme.store'

interface CaptchaFieldProps {
  onChange: (token: string) => void
  error?: string
  ref?: Ref<TurnstileInstance | undefined>
}

function CaptchaField({ onChange, error, ref }: CaptchaFieldProps) {
  const { t, i18n } = useTranslation()
  const theme = useThemeStore((s) => s.theme)

  return (
    <div className="flex flex-col gap-1">
      <Turnstile
        ref={ref}
        siteKey={import.meta.env.VITE_TURNSTILE_SITE_KEY}
        onSuccess={onChange}
        onExpire={() => onChange('')}
        onError={() => onChange('')}
        options={{
          language: i18n.language,
          theme,
          size: 'flexible',
          appearance: 'interaction-only',
        }}
      />
      {error && (
        <p role="alert" className="text-sm text-danger">
          {t(error)}
        </p>
      )}
    </div>
  )
}

export default CaptchaField