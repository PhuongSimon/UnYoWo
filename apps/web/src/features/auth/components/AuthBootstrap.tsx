import { useEffect, useRef, type ReactNode } from 'react'
import DotsLoader from '@/components/ui/DotsLoader'
import { refreshSession } from '@/lib/http'
import { useAuthStore } from '@/stores/auth.store'

function AuthBootstrap({ children }: { children: ReactNode }) {
  const status = useAuthStore((s) => s.status)
  const startedRef = useRef(false)

  useEffect(() => {
    if (startedRef.current) return
    startedRef.current = true
    refreshSession().catch(() => useAuthStore.getState().clear())
  }, [])

  if (status === 'loading') {
    return (
      <div role="status" className="flex min-h-dvh items-center justify-center bg-surface text-accent">
        <DotsLoader />
      </div>
    )
  }

  return children
}

export default AuthBootstrap
