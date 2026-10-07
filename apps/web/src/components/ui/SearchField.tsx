import { Search, X } from 'lucide-react'
import { useId } from 'react'
import { useTranslation } from 'react-i18next'

interface SearchFieldProps {
  /**
   * Keep this in component state, not straight from the address: router updates run in a transition,
   * so an input bound to ?q= snaps back after each key and Vietnamese typing (Telex, Unikey) loses letters.
   */
  value: string
  onChange: (value: string) => void
  label: string
  placeholder: string
  className?: string
}

/** A search box with a magnifier and a clear button; 16px text so phones do not zoom in. */
function SearchField({ value, onChange, label, placeholder, className = '' }: SearchFieldProps) {
  const { t } = useTranslation()
  const id = useId()

  return (
    <div role="search" className={`relative ${className}`}>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <Search size={18} aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-muted" />
      <input
        id={id}
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        enterKeyHint="search"
        className="min-h-11 w-full rounded-xl border-2 border-line bg-surface py-2 pr-11 pl-10 text-base text-fg outline-none transition-colors placeholder:text-muted/60 hover:border-primary-400 focus:border-accent [&::-webkit-search-cancel-button]:hidden"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label={t('common.clearSearch')}
          className="absolute top-1/2 right-0.5 flex size-11 -translate-y-1/2 items-center justify-center rounded-xl text-muted hover:text-fg focus-visible:outline-2 focus-visible:outline-accent"
        >
          <X size={18} aria-hidden="true" />
        </button>
      )}
    </div>
  )
}

export default SearchField
