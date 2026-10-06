import { ArrowRight, Delete } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Button from '@/components/ui/Button'
import { composeParts } from '../builder/compose'
import AnswerFeedback from '../components/AnswerFeedback'
import PromptCard from '../components/PromptCard'
import RequestError from '../components/RequestError'
import { useHotkeys } from '../hooks/useHotkeys'
import type { BuildQuestion, BuilderTile, ComponentRole } from '../types'
import type { GameScreenProps } from './registry'

/** One colour per role, so the block shows which part goes where. */
const ROLE_COLOURS: Record<ComponentRole, string> = {
  INITIAL: 'text-sky-700 dark:text-sky-300',
  VOWEL: 'text-emerald-700 dark:text-emerald-300',
  FINAL: 'text-violet-700 dark:text-violet-300',
  BASE: 'text-sky-700 dark:text-sky-300',
  SMALL: 'text-emerald-700 dark:text-emerald-300',
  MARK: 'text-violet-700 dark:text-violet-300',
}

function BuilderGame(props: GameScreenProps) {
  const question = props.state.session.questions[props.state.index]
  // Keyed so every question starts with empty slots.
  return question.kind === 'BUILD' ? <BuilderRound key={question.id} {...props} question={question} /> : null
}

function BuilderRound({ state, game, studyLang, speechLang, question }: GameScreenProps & { question: BuildQuestion }) {
  const { t } = useTranslation()
  const slots = groupBySlot(question.options)
  const [chosen, setChosen] = useState<(BuilderTile | null)[]>(() => slots.map(() => null))
  const playing = state.status === 'playing'
  const answered = state.status === 'answered' ? question.result : null

  // After answering, show the right parts in the slots.
  const correctIds = answered?.correctOptionId?.split('|') ?? []
  const shown = answered ? slots.map((tiles, slot) => tiles.find((tile) => tile.id === correctIds[slot]) ?? null) : chosen
  const complete = shown.every((tile) => tile !== null)
  const preview = complete ? composeParts(shown.flatMap((tile) => (tile ? [tile] : []))) : null
  const isLast = state.session.questions.every((q, i) => i <= state.index || q.result)

  const choose = (tile: BuilderTile) => setChosen((current) => current.map((part, slot) => (slot === tile.slot ? tile : part)))
  const clear = (slot: number) => setChosen((current) => current.map((part, index) => (index === slot ? null : part)))
  const submit = () => {
    if (complete) game.answer({ parts: chosen.flatMap((tile) => (tile ? [tile.id] : [])) })
  }

  useHotkeys(answered ? { Enter: game.next } : { Enter: submit }, state.status !== 'answering')

  return (
    <>
      <PromptCard question={question} studyLang={studyLang} speechLang={speechLang} instruction={t('practice.builder.instruction')}>
        <div className="mt-5 flex flex-col items-center gap-3">
          <p aria-live="polite" lang={studyLang} className="flex min-h-20 items-center text-6xl font-bold sm:text-7xl">
            {preview ?? <span className="text-3xl font-semibold text-muted">?</span>}
          </p>
          <ol aria-label={t('practice.builder.slots')} className="flex flex-wrap items-center justify-center gap-2">
            {shown.map((tile, slot) => (
              <li key={slot} className="flex items-center gap-2">
                {slot > 0 && <span aria-hidden="true" className="text-xl text-muted">+</span>}
                <button
                  type="button"
                  disabled={!playing || !tile}
                  onClick={() => clear(slot)}
                  aria-label={
                    tile
                      ? t('practice.builder.clear', { part: tile.text, role: t(`practice.builder.roles.${slots[slot][0].role}`) })
                      : t('practice.builder.empty', { role: t(`practice.builder.roles.${slots[slot][0].role}`) })
                  }
                  className={`flex size-14 flex-col items-center justify-center rounded-xl border-2 border-dashed text-2xl font-bold transition-colors focus-visible:outline-2 focus-visible:outline-accent disabled:cursor-default ${
                    tile ? `border-solid border-line-soft bg-surface ${ROLE_COLOURS[tile.role]}` : 'border-line text-muted'
                  }`}
                >
                  <span lang={studyLang}>{tile?.text ?? ''}</span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      </PromptCard>

      {!answered && (
        <div className="mt-5 space-y-4">
          {slots.map((tiles, slot) => (
            <fieldset key={slot}>
              <legend className={`mb-2 text-sm font-bold ${ROLE_COLOURS[tiles[0].role]}`}>
                {slot + 1}. {t(`practice.builder.roles.${tiles[0].role}`)}
              </legend>
              <div className="flex flex-wrap gap-2">
                {tiles.map((tile) => {
                  const selected = chosen[slot]?.id === tile.id
                  return (
                    <button
                      key={tile.id}
                      type="button"
                      aria-pressed={selected}
                      disabled={!playing}
                      onClick={() => choose(tile)}
                      className={`flex min-h-12 min-w-12 items-center justify-center rounded-xl border-2 border-b-4 px-3 text-2xl font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                        selected ? 'border-primary-500 bg-brand/15' : 'border-line-soft bg-surface-raised hover:border-primary-400'
                      }`}
                    >
                      <span lang={studyLang}>{tile.text}</span>
                    </button>
                  )
                })}
              </div>
            </fieldset>
          ))}

          <div className="flex gap-2">
            <Button onClick={submit} disabled={!playing || !complete} loading={state.status === 'answering' && !state.failed} className="flex-1">
              {t('practice.builder.check')}
              <ArrowRight size={18} aria-hidden="true" />
            </Button>
            <Button variant="outline" onClick={() => setChosen(slots.map(() => null))} disabled={!playing} aria-label={t('practice.builder.reset')}>
              <Delete size={18} aria-hidden="true" />
            </Button>
          </div>
        </div>
      )}

      {state.status === 'answering' && state.failed && <RequestError message={t('practice.sendFailed')} onRetry={game.retry} />}

      {answered && !answered.isCorrect && (
        <p className="mt-4 text-center text-sm text-muted">
          {t('practice.builder.yourParts', { parts: chosen.map((tile) => tile?.text ?? '?').join(' + ') })}
        </p>
      )}

      {answered && question.reveal && (
        <AnswerFeedback
          isCorrect={answered.isCorrect}
          reveal={question.reveal}
          studyLang={studyLang}
          speechLang={speechLang}
          isLast={isLast}
          xpGained={state.status === 'answered' ? state.xpGained : 0}
          onNext={game.next}
        />
      )}
    </>
  )
}

function groupBySlot(tiles: BuilderTile[]): BuilderTile[][] {
  const slots: BuilderTile[][] = []
  for (const tile of tiles) (slots[tile.slot] ??= []).push(tile)
  return slots
}

export default BuilderGame
