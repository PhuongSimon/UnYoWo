import { useEffect } from 'react'
import { useAuthStore } from '@/stores/auth.store'
import { authApi } from '../api'

/** Keeps the account's timezone equal to the browser's, so streaks and daily goals reset at the user's local midnight. */
export function useTimezoneSync() {
  const userId = useAuthStore((s) => s.user?.id)
  const savedTimezone = useAuthStore((s) => s.user?.timezone)

  useEffect(() => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
    if (!userId || !timezone || timezone === savedTimezone) return

    authApi
      .updateProfile({ timezone })
      .then((user) => useAuthStore.getState().setUser(user))
      // Not worth interrupting the user: the next app load simply tries again.
      .catch(() => undefined)
  }, [userId, savedTimezone])
}
