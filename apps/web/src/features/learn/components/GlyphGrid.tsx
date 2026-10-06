import { useTranslation } from 'react-i18next'
import { useStudy } from '../context'
import { speak, speechSupported, toSpeechText, useSpeechStore } from '../lib/speech'
import type { GridRow } from '../types'

interface GlyphGridProps {
  columns: string[]
  rows: GridRow[]
}

function GlyphGrid({ columns, rows }: GlyphGridProps) {
  const { t } = useTranslation()
  const { language } = useStudy()
  const speakingKey = useSpeechStore((s) => s.speakingKey)

  return (
    <div className="overflow-x-auto rounded-2xl border border-line-soft bg-surface-raised shadow-sm">
      <table className="w-full border-collapse text-center">
        <thead>
          <tr className="bg-secondary-100 dark:bg-espresso-700/60">
            <th scope="col" className="sticky left-0 z-10 w-10 bg-secondary-100 dark:bg-espresso-700">
              <span className="sr-only">{t('learn.writing.consonant')}</span>
            </th>
            {columns.map((column) => (
              <th key={column} scope="col" lang={language.code} className="px-1 py-2 text-sm font-semibold text-label">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-t border-line-soft">
              <th
                scope="row"
                lang={language.code}
                className="sticky left-0 z-10 bg-surface-raised px-2 text-sm font-semibold text-label shadow-[1px_0_0_var(--line-soft)]"
              >
                {row.label}
              </th>
              {row.cells.map((cell, cellIndex) => {
                if (!cell) return <td key={cellIndex} aria-hidden="true" className="p-0.5" />

                const speakText = cell.speak ?? cell.char
                const speechKey = `${language.speechLang}:${speakText}`
                const active = speakingKey === speechKey

                return (
                  <td key={cellIndex} className="p-0.5 sm:p-1">
                    <button
                      type="button"
                      onClick={() => speak(speakText, language.speechLang, speechKey)}
                      disabled={!speechSupported}
                      aria-label={`${cell.char} ${cell.roman ?? ''} – ${t('learn.listen', { text: toSpeechText(speakText) })}`}
                      className={`flex w-full min-w-12 flex-col items-center rounded-lg px-1 py-1.5 transition-colors focus-visible:outline-2 focus-visible:outline-accent disabled:cursor-default ${
                        active ? 'bg-brand text-on-brand' : 'hover:bg-primary-50 dark:hover:bg-espresso-700'
                      }`}
                    >
                      <span lang={language.code} className="text-xl leading-tight font-bold sm:text-2xl">
                        {cell.char}
                      </span>
                      {cell.roman && <span className={`text-xs font-medium ${active ? '' : 'text-muted'}`}>{cell.roman}</span>}
                      {cell.ipa && <span className={`text-[11px] ${active ? '' : 'text-muted/80'}`}>{cell.ipa}</span>}
                    </button>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default GlyphGrid
