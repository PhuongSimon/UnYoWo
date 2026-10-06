import { useMutation } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import { apiErrorKey, getApiError } from '@/lib/api-error'
import { practiceApi } from '../api'

/** Creates a session on the server (which picks the questions) and opens it. */
export function useStartGame({ replace = false } = {}) {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: practiceApi.createSession,
    onSuccess: (session) => navigate(`/app/play/${session.id}`, { replace }),
    onError: (error) => toast.error(t(apiErrorKey(getApiError(error).code))),
  })
}
