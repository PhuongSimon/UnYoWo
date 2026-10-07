import { useTranslation } from 'react-i18next'
import { REVIEW_RATINGS, type ReviewRating } from '../types'

const RATING_CLASSES: Record<ReviewRating, string> = {
  AGAIN: 'border-red-300 bg-red-50 text-red-900 hover:bg-red-100 dark:border-red-800 dark:bg-red-950/50 dark:text-red-100',
  HARD: 'border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100 dark:border-amber-800 dark:bg-amber-950/50 dark:text-amber-100',
  GOOD: 'border-emerald-300 bg-emerald-50 text-emerald-900 hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-100',
  EASY: 'border-sky-300 bg-sky-50 text-sky-900 hover:bg-sky-100 dark:border-sky-800 dark:bg-sky-950/50 dark:text-sky-100',
}

interface RatingButtonsProps {
  disabled: boolean
  /** Rating sent and waiting for the server */
  pending: ReviewRating | null
  onRate: (rating: ReviewRating) => void
}

function RatingButtons({ disabled, pending, onRate }: RatingButtonsProps) {
  const { t } = useTranslation()

  return (
    <fieldset>
      <legend className="mb-2 w-full text-center text-sm font-semibold text-muted">{t('practice.rate')}</legend>
      <div className="grid grid-cols-4 gap-2">
        {REVIEW_RATINGS.map((rating, index) => (
          <button
            key={rating}
            type="button"
            disabled={disabled}
            onClick={() => onRate(rating)}
            className={`flex min-h-16 flex-col items-center justify-center rounded-xl border border-b-4 px-1 py-2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-default ${RATING_CLASSES[rating]} ${
              pending && pending !== rating ? 'opacity-50' : ''
            } ${pending === rating ? 'ring-2 ring-primary-400' : ''}`}
          >
            <span className="text-sm font-extrabold sm:text-base">{t(`practice.rating.${rating}`)}</span>
            <span className="text-[11px] leading-tight font-medium opacity-80 sm:text-xs">{t(`practice.ratingHint.${rating}`)}</span>
            <kbd aria-hidden="true" className="mt-0.5 hidden font-sans text-[11px] opacity-60 sm:block">
              {index + 1}
            </kbd>
          </button>
        ))}
      </div>
    </fieldset>
  )
}

export default RatingButtons
