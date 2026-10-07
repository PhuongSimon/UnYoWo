import { useMutation } from '@tanstack/react-query'
import { ArrowLeftRight, BookOpen, Copy, Languages, X } from 'lucide-react'
import { useEffect, useId, useState, type FormEvent, type KeyboardEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'
import { toast } from 'sonner'
import Button from '@/components/ui/Button'
import SpeakButton from '@/features/learn/components/SpeakButton'
import { useLocalized, useUiLanguage } from '@/features/learn/hooks/useLocalized'
import { apiErrorKey, getApiError } from '@/lib/api-error'
import { translateApi } from '../api'
import { findTranslateLanguage, PROVIDER_NAMES, TRANSLATE_LANGUAGES } from '../languages'
import type { DictionaryEntry, TranslateRequest, TranslationLanguage, TranslationResult } from '../types'

const MAX_LENGTH = 500
const STORAGE_KEY = 'unyowo.translate.languages'

type Source = TranslateRequest['source']

/** The last language pair, remembered per browser; storage may be blocked (private mode), so failures are ignored. */
function loadPair(fallbackTarget: TranslationLanguage): { source: Source; target: TranslationLanguage } {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null') as { source?: string; target?: string } | null
    const source = saved?.source === 'auto' || findTranslateLanguage(saved?.source ?? '') ? (saved?.source as Source) : 'auto'
    const target = findTranslateLanguage(saved?.target ?? '')?.code ?? fallbackTarget
    return { source, target }
  } catch {
    return { source: 'auto', target: fallbackTarget }
  }
}

function savePair(pair: { source: Source; target: TranslationLanguage }) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pair))
  } catch {
    // not saved: the page still works with the default pair next time
  }
}

const SELECT =
  'min-h-11 w-full rounded-xl border-2 border-line bg-surface px-3 text-base font-semibold text-fg outline-none transition-colors hover:border-primary-400 focus:border-accent'

function TranslatePage() {
  const { t } = useTranslation()
  const loc = useLocalized()
  const ui = useUiLanguage()
  const ids = { source: useId(), target: useId(), text: useId() }
  const [pair, setPair] = useState(() => loadPair(ui))
  const [text, setText] = useState('')
  const mutation = useMutation({ mutationFn: translateApi.translate })
  const result = mutation.data

  useEffect(() => savePair(pair), [pair])

  const sameLanguage = pair.source === pair.target
  const canSubmit = text.trim().length > 0 && !sameLanguage && !mutation.isPending

  function submit(event?: FormEvent) {
    event?.preventDefault()
    if (canSubmit) mutation.mutate({ text: text.trim(), ...pair })
  }

  // Ctrl/⌘ + Enter translates; a plain Enter stays a new line.
  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) submit(event)
  }

  /** Swapping also moves the translation into the box, ready to translate back. */
  function swap() {
    const from = pair.source === 'auto' ? result?.source : pair.source
    if (!from || from === pair.target) return
    setPair({ source: pair.target, target: from })
    if (result?.translation) setText(result.translation)
    mutation.reset()
  }

  const errorCode = mutation.isError ? getApiError(mutation.error).code : null

  return (
    <div className="mx-auto w-full max-w-app px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
      <header className="flex items-center gap-3">
        <span className="hidden size-12 shrink-0 items-center justify-center rounded-full bg-brand/15 text-accent sm:flex">
          <Languages size={24} aria-hidden="true" />
        </span>
        <div>
          <h1 className="text-3xl font-extrabold">{t('translate.title')}</h1>
          <p className="text-muted">{t('translate.description')}</p>
        </div>
      </header>

      <div className="mt-6 grid gap-6 lg:grid-cols-2 lg:items-start">
        <form onSubmit={submit} className="rounded-3xl border border-line-soft bg-surface-raised p-4 shadow-sm sm:p-5">
          <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-2">
            <div>
              <label htmlFor={ids.source} className="text-xs font-semibold text-label">
                {t('translate.from')}
              </label>
              <select
                id={ids.source}
                value={pair.source}
                onChange={(event) => setPair((current) => ({ ...current, source: event.target.value as Source }))}
                className={SELECT}
              >
                <option value="auto">{t('translate.auto')}</option>
                {TRANSLATE_LANGUAGES.map((language) => (
                  <option key={language.code} value={language.code}>
                    {loc(language.name)}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              onClick={swap}
              disabled={pair.source === 'auto' && !result}
              aria-label={t('translate.swap')}
              title={t('translate.swap')}
              className="flex size-11 items-center justify-center rounded-full border border-line-soft bg-surface text-accent transition-colors hover:border-primary-400 focus-visible:outline-2 focus-visible:outline-accent disabled:opacity-40"
            >
              <ArrowLeftRight size={18} aria-hidden="true" />
            </button>
            <div>
              <label htmlFor={ids.target} className="text-xs font-semibold text-label">
                {t('translate.to')}
              </label>
              <select
                id={ids.target}
                value={pair.target}
                onChange={(event) => setPair((current) => ({ ...current, target: event.target.value as TranslationLanguage }))}
                className={SELECT}
              >
                {TRANSLATE_LANGUAGES.map((language) => (
                  <option key={language.code} value={language.code}>
                    {loc(language.name)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <label htmlFor={ids.text} className="sr-only">
            {t('translate.textLabel')}
          </label>
          <div className="relative mt-4">
            <textarea
              id={ids.text}
              value={text}
              onChange={(event) => setText(event.target.value)}
              onKeyDown={handleKeyDown}
              maxLength={MAX_LENGTH}
              rows={5}
              lang={pair.source === 'auto' ? undefined : pair.source}
              placeholder={t('translate.placeholder')}
              className="w-full resize-y rounded-2xl border-2 border-line bg-surface p-4 pr-12 text-base text-fg outline-none transition-colors placeholder:text-muted/60 hover:border-primary-400 focus:border-accent"
            />
            {text && (
              <button
                type="button"
                onClick={() => {
                  setText('')
                  mutation.reset()
                }}
                aria-label={t('translate.clear')}
                className="absolute top-1.5 right-1.5 flex size-11 items-center justify-center rounded-full text-muted transition-colors hover:text-fg focus-visible:outline-2 focus-visible:outline-accent"
              >
                <X size={18} aria-hidden="true" />
              </button>
            )}
          </div>
          <div className="mt-1 flex justify-between gap-3 text-xs text-muted">
            <span className="tabular-nums">
              {text.length}/{MAX_LENGTH}
            </span>
            <span className="hidden sm:inline">{t('translate.shortcut')}</span>
          </div>

          {sameLanguage && <p className="mt-3 text-sm text-danger">{t('apiErrors.TRANSLATION_SAME_LANGUAGE')}</p>}

          <Button type="submit" loading={mutation.isPending} disabled={!canSubmit} className="mt-4 w-full sm:w-auto">
            <Languages size={18} aria-hidden="true" />
            {t('translate.submit')}
          </Button>
        </form>

        <div aria-live="polite" className="space-y-4">
          {errorCode && (
            <p role="alert" className="rounded-2xl border border-danger/30 bg-danger/10 p-4 text-sm font-medium text-danger">
              {t(apiErrorKey(errorCode))}
            </p>
          )}
          {result ? <TranslationCard result={result} /> : !errorCode && <p className="hidden text-muted lg:block">{t('translate.empty')}</p>}
          {result && result.dictionary.length > 0 && <DictionaryCard entries={result.dictionary} />}
        </div>
      </div>
    </div>
  )
}

function TranslationCard({ result }: { result: TranslationResult }) {
  const { t } = useTranslation()
  const loc = useLocalized()
  const target = findTranslateLanguage(result.target)
  const source = findTranslateLanguage(result.source)

  async function copy() {
    if (!result.translation) return
    try {
      await navigator.clipboard.writeText(result.translation)
      toast.success(t('translate.copied'))
    } catch {
      toast.error(t('translate.copyFailed'))
    }
  }

  return (
    <section aria-labelledby="translation-title" className="rounded-3xl border border-line-soft bg-surface-raised p-4 shadow-sm sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 id="translation-title" className="flex items-center gap-2 text-sm font-semibold text-label">
          {target && <target.Flag className="h-3.5 w-5 rounded-[2px] shadow-sm" />}
          {target ? loc(target.name) : result.target}
        </h2>
        {result.detected && source && <span className="text-xs text-muted">{t('translate.detected', { language: loc(source.name) })}</span>}
      </div>

      {result.translation ? (
        <>
          <p lang={result.target} className="mt-2 text-xl font-semibold break-words whitespace-pre-wrap">
            {result.translation}
          </p>
          <div className="mt-3 flex items-center gap-2">
            {target && <SpeakButton text={result.translation} lang={target.speechLang} size="md" />}
            <button
              type="button"
              onClick={() => void copy()}
              aria-label={t('translate.copy')}
              title={t('translate.copy')}
              className="inline-flex size-10 items-center justify-center rounded-full border border-line-soft bg-surface-raised text-accent transition-colors hover:border-primary-400 focus-visible:outline-2 focus-visible:outline-accent"
            >
              <Copy size={18} aria-hidden="true" />
            </button>
          </div>
          {result.provider && (
            <p className="mt-3 text-xs text-muted">
              {t('translate.provider', { provider: PROVIDER_NAMES[result.provider] ?? result.provider })}
              {result.cached && ` · ${t('translate.cached')}`}
            </p>
          )}
        </>
      ) : (
        <p className="mt-2 text-muted">{t('translate.noMachine')}</p>
      )}
    </section>
  )
}

function DictionaryCard({ entries }: { entries: DictionaryEntry[] }) {
  const { t } = useTranslation()
  const ui = useUiLanguage()

  return (
    <section aria-labelledby="dictionary-title" className="rounded-3xl border border-line-soft bg-surface-raised p-4 shadow-sm sm:p-5">
      <h2 id="dictionary-title" className="flex items-center gap-2 font-bold">
        <BookOpen size={18} aria-hidden="true" className="text-accent" />
        {t('translate.dictionary.title')}
      </h2>
      <ul className="mt-3 divide-y divide-line-soft">
        {entries.map((entry) => {
          const language = findTranslateLanguage(entry.language)
          const meaning = entry.meaning?.[ui] ?? entry.meaning?.vi ?? entry.meaning?.en
          const article = entry.attributes?.article
          const pronunciation = [entry.reading, entry.romanization].filter(Boolean).join(' · ')
          return (
            <li key={entry.itemId} className="flex items-start gap-3 py-3">
              {language && <SpeakButton text={article ? `${article} ${entry.text}` : entry.text} lang={language.speechLang} className="mt-0.5" />}
              <div className="min-w-0 flex-1">
                <p className="flex flex-wrap items-baseline gap-x-2">
                  <span lang={entry.language} className="text-lg font-bold">
                    {article && `${article} `}
                    {entry.text}
                  </span>
                  {pronunciation && <span className="text-sm text-muted">{pronunciation}</span>}
                  {entry.level && <span className="rounded-full bg-brand/15 px-2 py-0.5 text-xs font-bold text-accent">{entry.level}</span>}
                </p>
                {meaning && <p className="font-medium">{meaning}</p>}
                {entry.attributes?.hanViet && <p className="text-xs text-muted">{t('practice.words.hanViet', { value: entry.attributes.hanViet })}</p>}
              </div>
              <Link
                to={`/app/${entry.language}/practice/sets/${entry.setId}`}
                className="inline-flex min-h-11 shrink-0 items-center rounded-xl px-2 text-sm font-semibold text-accent hover:underline focus-visible:outline-2 focus-visible:outline-accent"
              >
                {t('translate.dictionary.open')}
              </Link>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

export default TranslatePage
