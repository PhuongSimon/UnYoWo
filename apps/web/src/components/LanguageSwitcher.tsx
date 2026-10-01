import { Check, ChevronDown, Languages } from 'lucide-react'
import { useEffect, useId, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { LANGUAGES } from '@/i18n/languages'

function LanguageSwitcher() {
  const { t, i18n } = useTranslation()
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const menuId = useId()

  const current = LANGUAGES.find((lang) => lang.code === i18n.language) ?? LANGUAGES[0]

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

  function selectLanguage(code: string) {
    i18n.changeLanguage(code)
    setOpen(false)
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={t('common.language')}
        title={t('common.language')}
        className="flex h-8 items-center gap-1.5 rounded-full border border-line-soft bg-surface-raised px-2.5 text-muted shadow-sm transition-colors hover:border-primary-400 hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-400"
      >
        <Languages size={16} />
        <current.Flag className="h-3 w-[18px] rounded-[2px]" />
        <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <ul
          id={menuId}
          role="menu"
          className="absolute right-0 z-50 mt-2 min-w-44 overflow-hidden rounded-xl border border-line-soft bg-surface-raised py-1 shadow-lg motion-safe:animate-fade-in"
        >
          {LANGUAGES.map((lang) => {
            const active = lang.code === current.code
            return (
              <li key={lang.code} role="none">
                <button
                  type="button"
                  role="menuitemradio"
                  aria-checked={active}
                  lang={lang.code}
                  onClick={() => selectLanguage(lang.code)}
                  className={`flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm transition-colors hover:bg-surface focus-visible:bg-surface focus-visible:outline-none ${
                    active ? 'font-semibold text-accent' : 'text-fg'
                  }`}
                >
                  <lang.Flag className="h-4 w-6 shrink-0 rounded-[2px] shadow-sm" />
                  <span className="flex-1">{lang.name}</span>
                  {active && <Check size={16} />}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export default LanguageSwitcher
