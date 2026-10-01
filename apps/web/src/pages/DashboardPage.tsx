import { LogOut } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router'
import LanguageSwitcher from '@/components/LanguageSwitcher'
import Logo from '@/components/Logo'
import ThemeToggle from '@/components/ThemeToggle'
import Button from '@/components/ui/Button'
import { authApi } from '@/features/auth/api'
import { useAuthStore } from '@/stores/auth.store'

function DashboardPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const clear = useAuthStore((s) => s.clear)
  const [loggingOut, setLoggingOut] = useState(false)

  async function handleLogout() {
    setLoggingOut(true)
    try {
      await authApi.logout()
    } finally {
      clear()
      navigate('/login', { replace: true })
    }
  }

  const initial = user?.fullName.charAt(0).toUpperCase() ?? '?'

  return (
    <div className="flex min-h-dvh flex-col bg-surface px-4 py-6 sm:px-8">
      <header className="flex items-center justify-between gap-3">
        <Logo className="text-xl" />
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-6 py-12 text-center">
        {user?.avatarUrl ? (
          <img src={user.avatarUrl} alt="" referrerPolicy="no-referrer" className="size-20 rounded-full shadow-md" />
        ) : (
          <div className="flex size-20 items-center justify-center rounded-full bg-primary-500 text-3xl font-bold text-primary-950 shadow-md">
            {initial}
          </div>
        )}

        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">{t('dashboard.greeting', { name: user?.fullName })}</h1>
          <p className="mt-2 break-all text-muted">{user?.email}</p>
        </div>

        <p className="text-muted">{t('dashboard.comingSoon')}</p>

        <Button variant="outline" onClick={handleLogout} loading={loggingOut} className="w-full sm:w-auto">
          <LogOut size={18} />
          {t('dashboard.logout')}
        </Button>
      </main>
    </div>
  )
}

export default DashboardPage
