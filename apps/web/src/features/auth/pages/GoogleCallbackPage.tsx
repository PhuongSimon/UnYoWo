import DotsLoader from '@/components/ui/DotsLoader'
import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useSearchParams } from 'react-router'
import { toast } from 'sonner'

async function fakeRefreshSession() {
  await new Promise((resolve) => setTimeout(resolve, 1500))
  return { accessToken: 'fake-access-token' }
}

function GoogleCallbackPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const handledRef = useRef(false)

  useEffect(() => {
    if (handledRef.current) return
    handledRef.current = true

    const error = searchParams.get('error')
    if (error) {
      toast.error(t('auth.google.failed'))
      navigate('/login', { replace: true })
      return
    }

    fakeRefreshSession()
      .then(() => {
        navigate('/', { replace: true })
      })
      .catch(() => {
        toast.error(t('auth.google.failed'))
        navigate('/login', { replace: true })
      })
  }, [navigate, searchParams, t])

  return (
    <div role="status" className="flex flex-col items-center gap-4 py-8 text-accent">
      <DotsLoader className="h-8" />
      <p className="text-sm">{t('auth.google.signingIn')}</p>
    </div>
  )
}

export default GoogleCallbackPage