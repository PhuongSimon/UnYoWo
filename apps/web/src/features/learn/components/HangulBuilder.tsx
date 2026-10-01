import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { composeSyllable, FINALS, indexOfInitial, indexOfVowel, INITIALS, type Jamo, romanizeSyllable, syllableIpa, VOWELS } from '../lib/hangul'
import SpeakButton from './SpeakButton'

const DEFAULT_FINAL = FINALS.findIndex((jamo) => jamo.char === 'ㄴ')

function HangulBuilder() {
  const { t } = useTranslation()
  const [initial, setInitial] = useState(() => indexOfInitial('ㅎ'))
  const [vowel, setVowel] = useState(() => indexOfVowel('ㅏ'))
  const [final, setFinal] = useState(DEFAULT_FINAL)

  const syllable = composeSyllable(initial, vowel, final)
  const parts = [INITIALS[initial].char, VOWELS[vowel].char, FINALS[final].char].filter(Boolean)

  return (
    <div className="grid gap-5 rounded-2xl border border-line-soft bg-surface-raised p-4 shadow-sm sm:p-6 lg:grid-cols-[15rem_minmax(0,1fr)]">
      {/* Sticky so the result stays in view while picking letters further down on a phone */}
      <div className="sticky top-[7.25rem] z-10 flex items-center gap-3 rounded-2xl border border-line-soft bg-surface p-3 shadow-sm sm:gap-4 sm:p-4 lg:top-36 lg:flex-col lg:gap-2 lg:self-start lg:p-5 lg:text-center">
        <span lang="ko" aria-live="polite" className="w-16 shrink-0 text-center text-5xl leading-none font-bold text-fg sm:w-20 sm:text-6xl lg:w-auto lg:text-7xl">
          {syllable}
        </span>
        <div className="min-w-0 flex-1 space-y-2 lg:w-full">
          <p lang="ko" className="text-base text-muted">
            {parts.join(' + ')}
          </p>
          {/* Labels are only shown in the roomy desktop layout; phones get a compact "han [han]" line */}
          <dl className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-base lg:grid lg:grid-cols-2 lg:gap-2 lg:text-sm">
            <div className="lg:rounded-lg lg:bg-surface-raised lg:px-2 lg:py-1">
              <dt className="sr-only lg:not-sr-only lg:text-xs lg:text-muted">{t('learn.builder.romanization')}</dt>
              <dd className="font-semibold">{romanizeSyllable(initial, vowel, final)}</dd>
            </div>
            <div className="lg:rounded-lg lg:bg-surface-raised lg:px-2 lg:py-1">
              <dt className="sr-only lg:not-sr-only lg:text-xs lg:text-muted">IPA</dt>
              <dd className="font-semibold text-accent">{syllableIpa(initial, vowel, final)}</dd>
            </div>
          </dl>
        </div>
        <SpeakButton text={syllable} size="md" />
      </div>

      <div className="space-y-5">
        <JamoPicker label={t('learn.builder.initial')} items={INITIALS} value={initial} onChange={setInitial} />
        <JamoPicker label={t('learn.builder.vowel')} items={VOWELS} value={vowel} onChange={setVowel} />
        <JamoPicker label={t('learn.builder.final')} items={FINALS} value={final} onChange={setFinal} emptyLabel={t('learn.builder.none')} />
      </div>
    </div>
  )
}

interface JamoPickerProps {
  label: string
  items: Jamo[]
  value: number
  onChange: (index: number) => void
  /** Shown for the empty jamo (no final consonant). */
  emptyLabel?: string
}

function JamoPicker({ label, items, value, onChange, emptyLabel }: JamoPickerProps) {
  return (
    <fieldset>
      <legend className="mb-2 text-sm font-semibold text-label">{label}</legend>
      <div className="flex flex-wrap gap-1.5">
        {items.map((item, index) => {
          const selected = index === value
          return (
            <button
              key={index}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(index)}
              className={`flex h-10 min-w-10 items-center justify-center rounded-lg border px-2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary-400 ${
                selected ? 'border-primary-600 bg-primary-500 text-primary-950' : 'border-line-soft bg-surface text-fg hover:border-primary-400'
              }`}
            >
              {item.char ? (
                <span lang="ko" className="text-xl font-semibold">
                  {item.char}
                </span>
              ) : (
                <span className="text-xs font-semibold">{emptyLabel}</span>
              )}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}

export default HangulBuilder
