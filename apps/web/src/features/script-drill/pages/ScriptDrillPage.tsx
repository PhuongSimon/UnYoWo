import { ArrowLeft, Repeat } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useSearchParams } from 'react-router'
import { NotFoundState } from '@/features/learn/components/ContentState'
import { useStudy } from '@/features/learn/context'
import DrillResult from '../components/DrillResult'
import DrillRound from '../components/DrillRound'
import DrillSetup from '../components/DrillSetup'
import { mistakeCells, shuffle, summarize, type DrillSummary } from '../drill'
import { drillScriptsFor, scriptCells, type DrillCell, type DrillScript } from '../scripts'
import { useDrillPrefs } from '../useDrillSettings'

const LINK = 'inline-flex min-h-11 items-center gap-1.5 rounded-lg text-sm font-medium text-muted transition-colors hover:text-fg focus-visible:outline-2 focus-visible:outline-accent'

/**
 * See a character, type its romanisation: hiragana and katakana for Japanese, hangul for Korean.
 * The chosen script is in the address (?script=katakana) so the back button returns to the picker.
 */
function ScriptDrillPage() {
  const { t } = useTranslation()
  const { language } = useStudy()
  const [params] = useSearchParams()
  const practicePath = `/app/${language.code}/practice`
  const scripts = drillScriptsFor(language.code)
  const script = scripts.length === 1 ? scripts[0] : scripts.find((item) => item.id === params.get('script'))

  if (scripts.length === 0) return <NotFoundState backTo={practicePath} backLabel={t('drill.back')} />

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-x-4">
        <Link to={practicePath} className={LINK}>
          <ArrowLeft size={16} aria-hidden="true" />
          {t('drill.back')}
        </Link>
        {script && scripts.length > 1 && (
          <Link to={{ search: '' }} className={LINK}>
            <Repeat size={16} aria-hidden="true" />
            {t('drill.changeScript')}
          </Link>
        )}
      </div>

      <header>
        <h2 className="text-2xl font-extrabold sm:text-3xl">{script ? t('drill.titleFor', { script: t(`drill.scripts.${script.id}`) }) : t('drill.title')}</h2>
      </header>

      {script ? <DrillFlow key={script.id} script={script} speechLang={language.speechLang} /> : <ScriptPicker scripts={scripts} />}
    </div>
  )
}

/** Step 1 (Japanese only): hiragana or katakana. */
function ScriptPicker({ scripts }: { scripts: DrillScript[] }) {
  const { t } = useTranslation()

  return (
    <section aria-labelledby="drill-pick" className="space-y-4">
      <p id="drill-pick" className="text-muted">
        {t('drill.pick')}
      </p>
      <ul className="grid gap-4 sm:grid-cols-2">
        {scripts.map((script) => (
          <li key={script.id}>
            <Link
              to={`?script=${script.id}`}
              className="flex h-full items-center gap-4 rounded-2xl border-2 border-line-soft bg-surface-raised p-5 shadow-sm transition-colors hover:border-primary-400 focus-visible:outline-2 focus-visible:outline-accent"
            >
              <span
                lang={script.lang}
                aria-hidden="true"
                className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-brand/15 text-4xl font-bold text-accent"
              >
                {script.sample}
              </span>
              <span className="min-w-0">
                <span className="block text-lg font-bold">{t(`drill.scripts.${script.id}`)}</span>
                <span className="block text-sm text-muted">{t(`drill.scriptHint.${script.id}`)}</span>
                <span className="mt-1 block text-sm font-semibold text-accent">{t('drill.charCount', { count: scriptCells(script).length })}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

type Phase = { step: 'setup' } | { step: 'drill'; cells: DrillCell[] } | { step: 'result'; cells: DrillCell[]; summary: DrillSummary }

/** Steps 2–4 for one script: pick characters → drill → results, and around again. */
function DrillFlow({ script, speechLang }: { script: DrillScript; speechLang: string }) {
  const [prefs, setPrefs] = useDrillPrefs()
  const [phase, setPhase] = useState<Phase>({ step: 'setup' })

  // Every start (including "try again") deals the characters in a new random order.
  const start = (cells: DrillCell[]) => setPhase({ step: 'drill', cells: shuffle(cells) })

  if (phase.step === 'drill') {
    return (
      <DrillRound
        cells={phase.cells}
        lang={script.lang}
        speechLang={speechLang}
        mode={prefs.mode}
        speak={prefs.speak}
        onFinish={(answers, durationMs) => setPhase({ step: 'result', cells: phase.cells, summary: summarize(answers, durationMs) })}
        onQuit={() => setPhase({ step: 'setup' })}
      />
    )
  }

  if (phase.step === 'result') {
    return (
      <DrillResult
        summary={phase.summary}
        lang={script.lang}
        onRetry={() => start(phase.cells)}
        onRetryMistakes={() => start(mistakeCells(phase.cells, phase.summary))}
        onReselect={() => setPhase({ step: 'setup' })}
      />
    )
  }

  return (
    <DrillSetup
      script={script}
      mode={prefs.mode}
      speak={prefs.speak}
      onModeChange={(mode) => setPrefs({ mode })}
      onSpeakChange={(speak) => setPrefs({ speak })}
      onStart={start}
    />
  )
}

export default ScriptDrillPage
