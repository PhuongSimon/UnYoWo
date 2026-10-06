import { Languages, LogOut, RotateCcw, Trophy } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router'
import DotsLoader from '@/components/ui/DotsLoader'
import { authApi } from '@/features/auth/api'
import { COLOR_THEMES } from '@/lib/color-themes'
import { useAuthStore } from '@/stores/auth.store'
import { useThemeStore } from '@/stores/theme.store'

function UserMenu() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const clear = useAuthStore((s) => s.clear)
  const colorTheme = useThemeStore((s) => s.colorTheme)
  const setColorTheme = useThemeStore((s) => s.setColorTheme)
  const [open, setOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const menuId = useId()
  const themeLabelId = useId()

  useEffect(() => {
    if (!open) return

    function handlePointerDown(e: PointerEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false)
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  async function handleLogout() {
    setLoggingOut(true)
    try {
      await authApi.logout()
    } finally {
      clear()
      navigate('/login', { replace: true })
    }
  }

  if (!user) return null

  const initial = user.fullName.charAt(0).toUpperCase()

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={t('userMenu.open')}
        title={user.fullName}
        className="flex size-8 items-center justify-center overflow-hidden rounded-full bg-brand text-sm font-bold text-on-brand shadow-sm ring-2 ring-surface transition-shadow hover:ring-primary-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        {user.avatarUrl ? <img src={user.avatarUrl} alt="" referrerPolicy="no-referrer" className="size-full object-cover" /> : initial}
      </button>

      {open && (
        <div
          id={menuId}
          role="menu"
          className="absolute right-0 z-50 mt-2 w-72 overflow-hidden rounded-xl border border-line-soft bg-surface-raised shadow-lg motion-safe:animate-fade-in"
        >
          <div className="border-b border-line-soft px-4 py-3">
            <p className="truncate font-semibold">{user.fullName}</p>
            <p className="truncate text-sm text-muted">{user.email}</p>
          </div>
          {[
            { to: '/app/review', Icon: RotateCcw, label: t('review.title') },
            { to: '/app/progress', Icon: Trophy, label: t('progress.title') },
            { to: '/app/translate', Icon: Languages, label: t('translate.title') },
          ].map(({ to, Icon, label }) => (
            <Link
              key={to}
              to={to}
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex min-h-11 w-full items-center gap-3 px-4 text-sm font-semibold transition-colors hover:bg-surface focus-visible:bg-surface focus-visible:outline-none"
            >
              <Icon size={18} aria-hidden="true" className="text-muted" />
              {label}
            </Link>
          ))}
          <div role="group" aria-labelledby={themeLabelId} className="border-t border-line-soft px-4 py-3">
            <p id={themeLabelId} className="mb-2 text-xs font-bold tracking-wide text-muted uppercase">
              {t('userMenu.colorTheme')}
            </p>
            <div className="grid grid-cols-3 gap-2">
              {COLOR_THEMES.map(({ id, swatch }) => {
                const active = colorTheme === id
                return (
                  <button
                    key={id}
                    type="button"
                    role="menuitemradio"
                    aria-checked={active}
                    onClick={() => setColorTheme(id)}
                    className={`flex min-h-14 flex-col items-center justify-center gap-1.5 rounded-lg border-2 px-1 py-1.5 text-center text-xs leading-tight font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-accent ${
                      active ? 'border-accent bg-surface text-fg' : 'border-transparent text-muted hover:bg-surface hover:text-fg'
                    }`}
                  >
                    <span aria-hidden="true" className="flex -space-x-1.5">
                      {swatch.map((color) => (
                        <span key={color} className="size-4 rounded-full ring-2 ring-surface-raised" style={{ backgroundColor: color }} />
                      ))}
                    </span>
                    {t(`userMenu.themes.${id}`)}
                  </button>
                )
              })}
            </div>
          </div>
          <button
            type="button"
            role="menuitem"
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex w-full items-center gap-3 border-t border-line-soft px-4 py-3 text-left text-sm font-medium text-danger transition-colors hover:bg-surface focus-visible:bg-surface focus-visible:outline-none disabled:opacity-70"
          >
            {loggingOut ? <DotsLoader size="sm" /> : <LogOut size={18} aria-hidden="true" />}
            {t('userMenu.logout')}
          </button>
        </div>
      )}
    </div>
  )
}

export default UserMenu
