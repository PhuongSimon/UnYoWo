import { Play, Volume2 } from 'lucide-react'
import { useId } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '@/components/ui/Button'
import { speechSupported } from '@/features/learn/lib/speech'
import type { DrillMode } from '../drill'
import { scriptCells, type DrillCell, type DrillScript } from '../scripts'
import { useDrillSelection } from '../useDrillSettings'
import CharTable, { CheckBox } from './CharTable'

export interface DrillPrefsProps {
  mode: DrillMode
  speak: boolean
  onModeChange: (mode: DrillMode) => void
  onSpeakChange: (speak: boolean) => void
}

interface DrillSetupProps extends DrillPrefsProps {
  script: DrillScript
  onStart: (cells: DrillCell[]) => void
}

const MODES: DrillMode[] = ['continuous', 'enter']

/** Step 2: tick the characters to practise and how answers are submitted. */
function DrillSetup({ script, onStart, ...prefs }: DrillSetupProps) {
  const { t } = useTranslation()
  const [selected, setSelected] = useDrillSelection(script.id)
  const all = scriptCells(script)
  const chosen = all.filter((cell) => selected.has(cell.char))

  const toggle = (chars: string[], on: boolean) => {
    const next = new Set(selected)
    for (const char of chars) {
      if (on) next.add(char)
      else next.delete(char)
    }
    setSelected(next)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="max-w-3xl text-muted">{t('drill.select.intro')}</p>
        <p className="max-w-3xl text-sm text-muted">{t(`drill.romanization.${script.id}`)}</p>
        <div className="flex flex-wrap gap-2 pt-1">
          <Button variant="outline" onClick={() => toggle(all.map((cell) => cell.char), true)}>
            {t('drill.select.all')}
          </Button>
          <Button variant="outline" onClick={() => setSelected(new Set())} disabled={selected.size === 0}>
            {t('drill.select.none')}
          </Button>
        </div>
      </div>

      <DrillOptions {...prefs} />

      {script.tables.map((table) => (
        <CharTable key={table.id} table={table} lang={script.lang} selected={selected} onToggle={toggle} />
      ))}

      {/* Stays at the bottom of the screen while scrolling through the tables. */}
      <div className="sticky bottom-0 z-20 -mx-4 flex items-center gap-3 border-t border-line-soft bg-surface/95 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-md sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <p aria-live="polite" className="min-w-0 flex-1 text-sm font-semibold text-muted">
          {t('drill.select.count', { count: chosen.length })}
        </p>
        <Button onClick={() => onStart(chosen)} disabled={chosen.length === 0} className="shrink-0">
          <Play size={18} aria-hidden="true" />
          {t('drill.start')}
        </Button>
      </div>
    </div>
  )
}

function DrillOptions({ mode, speak, onModeChange, onSpeakChange }: DrillPrefsProps) {
  const { t } = useTranslation()
  const name = useId()

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-line-soft bg-surface-raised p-4 shadow-sm sm:flex-row sm:items-start sm:gap-8">
      <fieldset className="min-w-0 flex-1">
        <legend className="text-sm font-bold">{t('drill.mode.label')}</legend>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {MODES.map((value) => (
            <label
              key={value}
              className={`flex min-h-11 cursor-pointer items-start gap-3 rounded-xl border-2 p-3 transition-colors has-focus-visible:outline-2 has-focus-visible:outline-primary-400 ${
                mode === value ? 'border-primary-500 bg-primary-50 dark:bg-espresso-700' : 'border-line-soft hover:border-primary-400'
              }`}
            >
              <input type="radio" name={name} value={value} checked={mode === value} onChange={() => onModeChange(value)} className="mt-1 size-4 accent-primary-500" />
              <span>
                <span className="block font-semibold">{t(`drill.mode.${value}`)}</span>
                <span className="block text-sm text-muted">{t(`drill.mode.${value}Hint`)}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      {speechSupported && (
        <label className="flex min-h-11 cursor-pointer items-center gap-3 self-start rounded-xl px-1 has-focus-visible:outline-2 has-focus-visible:outline-primary-400 sm:mt-7">
          <input type="checkbox" checked={speak} onChange={(event) => onSpeakChange(event.target.checked)} className="sr-only" />
          <CheckBox state={speak} />
          <Volume2 size={18} aria-hidden="true" className="text-muted" />
          <span className="text-sm font-semibold">{t('drill.sound')}</span>
        </label>
      )}
    </div>
  )
}

export default DrillSetup
