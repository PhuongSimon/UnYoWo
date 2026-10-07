import { Check, Minus } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import type { DrillCell, DrillTable } from '../scripts'

type CheckState = boolean | 'mixed'

function checkState(chars: string[], selected: Set<string>): CheckState {
  const count = chars.filter((char) => selected.has(char)).length
  if (count === 0) return false
  return count === chars.length ? true : 'mixed'
}

interface CharTableProps {
  table: DrillTable
  lang: string
  selected: Set<string>
  /** Ticks (on) or unticks every character given */
  onToggle: (chars: string[], on: boolean) => void
}

const charsOf = (cells: (DrillCell | null)[]) => cells.filter((cell) => cell !== null).map((cell) => cell.char)

/** Rows are consonants, columns vowels: tap a character, a row/column heading, or the whole table. */
function CharTable({ table, lang, selected, onToggle }: CharTableProps) {
  const { t } = useTranslation()
  const titleId = `drill-table-${table.id}`
  const all = charsOf(table.rows.flatMap((row) => row.cells))
  const tableState = checkState(all, selected)
  const selectedCount = all.filter((char) => selected.has(char)).length

  return (
    <section aria-labelledby={titleId} className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 id={titleId} className="text-lg font-bold">
          {t(`drill.tables.${table.id}`)}{' '}
          <span className="text-sm font-semibold text-muted tabular-nums">
            {selectedCount}/{all.length}
          </span>
        </h3>
        <GroupToggle
          state={tableState}
          onClick={() => onToggle(all, tableState !== true)}
          label={t('drill.select.table')}
          ariaLabel={t('drill.select.tableLabel', { table: t(`drill.tables.${table.id}`) })}
          className="px-3"
        />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-line-soft bg-surface-raised shadow-sm">
        <table className="w-full border-collapse text-center">
          <thead>
            <tr className="bg-secondary-100 dark:bg-espresso-700/60">
              <td className="sticky left-0 z-10 bg-secondary-100 dark:bg-espresso-700" />
              {table.columns.map((column, index) => {
                const chars = charsOf(table.rows.map((row) => row.cells[index] ?? null))
                const state = checkState(chars, selected)
                return (
                  <th key={column} scope="col" className="p-1">
                    <GroupToggle
                      state={state}
                      onClick={() => onToggle(chars, state !== true)}
                      label={column}
                      lang={lang}
                      ariaLabel={t('drill.select.column', { label: column })}
                      className="w-full justify-center"
                    />
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row) => {
              const chars = charsOf(row.cells)
              const state = checkState(chars, selected)
              return (
                <tr key={row.label} className="border-t border-line-soft">
                  <th scope="row" className="sticky left-0 z-10 bg-surface-raised p-1 shadow-[1px_0_0_var(--line-soft)]">
                    <GroupToggle
                      state={state}
                      onClick={() => onToggle(chars, state !== true)}
                      label={row.label}
                      lang={lang}
                      ariaLabel={t('drill.select.row', { label: row.label })}
                      className="w-full justify-center"
                    />
                  </th>
                  {row.cells.map((cell, index) => (
                    <td key={cell?.char ?? `empty-${index}`} className="p-0.5 sm:p-1">
                      {cell && <CellToggle cell={cell} lang={lang} checked={selected.has(cell.char)} onClick={() => onToggle([cell.char], !selected.has(cell.char))} />}
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function CellToggle({ cell, lang, checked, onClick }: { cell: DrillCell; lang: string; checked: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={`${cell.char} ${cell.answers[0]}`}
      onClick={onClick}
      className={`flex min-h-13 w-full min-w-11 flex-col items-center justify-center rounded-lg border px-1 py-1 transition-colors focus-visible:outline-2 focus-visible:outline-accent ${
        checked ? 'border-brand-edge bg-brand text-on-brand' : 'border-transparent hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-espresso-700'
      }`}
    >
      <span lang={lang} className="text-xl leading-tight font-bold sm:text-2xl">
        {cell.char}
      </span>
      <span className={`text-xs font-medium ${checked ? 'text-on-brand/80' : 'text-muted'}`}>{cell.answers[0]}</span>
    </button>
  )
}

interface GroupToggleProps {
  state: CheckState
  onClick: () => void
  label: string
  ariaLabel: string
  lang?: string
  className?: string
}

/** A tri-state checkbox (none / some / all) for a row, a column or a whole table. */
function GroupToggle({ state, onClick, label, ariaLabel, lang, className = '' }: GroupToggleProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={state}
      aria-label={ariaLabel}
      onClick={onClick}
      className={`inline-flex min-h-11 min-w-11 items-center gap-1.5 rounded-lg px-1.5 text-sm font-bold text-label transition-colors hover:bg-primary-50 focus-visible:outline-2 focus-visible:outline-accent dark:hover:bg-espresso-700 ${className}`}
    >
      <CheckBox state={state} />
      <span lang={lang} className="whitespace-nowrap">
        {label}
      </span>
    </button>
  )
}

export function CheckBox({ state }: { state: CheckState }) {
  return (
    <span
      aria-hidden="true"
      className={`flex size-4.5 shrink-0 items-center justify-center rounded border-2 transition-colors ${
        state ? 'border-brand-edge bg-brand text-on-brand' : 'border-line bg-surface-raised'
      }`}
    >
      {state === true && <Check size={12} strokeWidth={3.5} />}
      {state === 'mixed' && <Minus size={12} strokeWidth={3.5} />}
    </span>
  )
}

export default CharTable
