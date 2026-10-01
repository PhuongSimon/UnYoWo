import DotsLoader from '@/components/ui/DotsLoader'
import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useSearchParams } from 'react-router'
import { toast } from 'sonner'
import { APP_HOME } from '@/features/auth/constants'
import { useAuthStore } from '@/stores/auth.store'

function GoogleCallbackPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const handledRef = useRef(false)

  useEffect(() => {
    if (handledRef.current) return
    handledRef.current = true

    // AuthBootstrap already exchanged the refresh cookie set by the API for a session.
    const error = searchParams.get('error')
    if (!error && useAuthStore.getState().status === 'authenticated') {
      navigate(APP_HOME, { replace: true })
      return
    }

    toast.error(t(error === 'google_not_configured' ? 'auth.google.notConfigured' : 'auth.google.failed'))
    navigate('/login', { replace: true })
  }, [navigate, searchParams, t])

  return (
    <div role="status" className="flex flex-col items-center gap-4 py-8 text-accent">
      <DotsLoader className="h-8" />
      <p className="text-sm">{t('auth.google.signingIn')}</p>
    </div>
  )
}

export default GoogleCallbackPage