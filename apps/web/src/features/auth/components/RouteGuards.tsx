import { Navigate, Outlet, useLocation } from 'react-router'
import { APP_HOME } from '@/features/auth/constants'
import { useAuthStore } from '@/stores/auth.store'

export function RequireAuth() {
  const status = useAuthStore((s) => s.status)
  const location = useLocation()

  if (status !== 'authenticated') {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }
  return <Outlet />
}

export function GuestOnly() {
  const status = useAuthStore((s) => s.status)

  if (status === 'authenticated') return <Navigate to={APP_HOME} replace />
  return <Outlet />
}

export function HomeRedirect() {
  const status = useAuthStore((s) => s.status)
  return <Navigate to={status === 'authenticated' ? APP_HOME : '/login'} replace />
}
