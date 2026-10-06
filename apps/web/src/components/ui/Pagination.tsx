import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { pageItems } from './pageItems'

interface PaginationProps {
  page: number
  pageCount: number
  onChange: (page: number) => void
  /** What is being paged, for screen readers: "Topics", "Words" */
  label: string
  className?: string
}

const BUTTON =
  'inline-flex size-11 items-center justify-center rounded-xl border border-line-soft bg-surface-raised text-sm font-bold tabular-nums transition-colors hover:border-primary-400 focus-visible:outline-2 focus-visible:outline-accent disabled:pointer-events-none disabled:opacity-40'

/** Previous / next with page numbers; on a phone only "3 / 12" between the arrows. Renders nothing for a single page. */
function Pagination({ page, pageCount, onChange, label, className = '' }: PaginationProps) {
  const { t } = useTranslation()
  if (pageCount <= 1) return null

  return (
    <nav aria-label={t('pagination.label', { label })} className={`flex items-center justify-center gap-1.5 ${className}`}>
      <button type="button" onClick={() => onChange(page - 1)} disabled={page <= 1} aria-label={t('pagination.previous')} className={BUTTON}>
        <ChevronLeft size={18} aria-hidden="true" />
      </button>

      <span className="px-2 text-sm font-semibold text-muted tabular-nums sm:hidden">
        {t('pagination.status', { page, count: pageCount })}
      </span>
      <ul className="hidden items-center gap-1.5 sm:flex">
        {pageItems(page, pageCount).map((item, index) =>
          item === 'gap' ? (
            <li key={`gap-${index}`} aria-hidden="true" className="px-1 text-muted">
              …
            </li>
          ) : (
            <li key={item}>
              <button
                type="button"
                onClick={() => onChange(item)}
                aria-current={item === page ? 'page' : undefined}
                aria-label={t('pagination.page', { page: item })}
                className={`${BUTTON} ${item === page ? 'border-primary-600 bg-primary-500 text-primary-950' : ''}`}
              >
                {item}
              </button>
            </li>
          ),
        )}
      </ul>

      <button type="button" onClick={() => onChange(page + 1)} disabled={page >= pageCount} aria-label={t('pagination.next')} className={BUTTON}>
        <ChevronRight size={18} aria-hidden="true" />
      </button>
    </nav>
  )
}

export default Pagination
