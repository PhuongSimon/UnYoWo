import { Volume2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useStudy } from '../context'
import { useLocalized } from '../hooks/useLocalized'
import { speak, speechSupported, toSpeechText, useSpeechStore } from '../lib/speech'
import type { Glyph } from '../types'
import RichText from './RichText'
import SpeakButton from './SpeakButton'

interface GlyphCardProps {
  glyph: Glyph
}

function charSize(char: string) {
  if (char.length > 4) return 'text-2xl'
  if (char.length > 2) return 'text-3xl'
  return 'text-4xl sm:text-5xl'
}

function GlyphCard({ glyph }: GlyphCardProps) {
  const { t } = useTranslation()
  const { language } = useStudy()
  const loc = useLocalized()

  const speakText = glyph.speak ?? glyph.char
  const speechKey = `${language.speechLang}:${speakText}`
  const active = useSpeechStore((s) => s.speakingKey === speechKey)

  const example = glyph.example
  const meaning = example ? loc(example.meaning) : ''
  // "apple — apple" adds nothing, so the meaning is hidden when it repeats the word.
  const showMeaning = example && meaning.toLowerCase() !== example.word.toLowerCase()

  return (
    <article className="flex h-full flex-col gap-3 rounded-2xl border border-line-soft bg-surface-raised p-3.5 shadow-sm transition-colors hover:border-primary-300 sm:p-4 dark:hover:border-espresso-500">
      <button
        type="button"
        onClick={() => speak(speakText, language.speechLang, speechKey)}
        disabled={!speechSupported}
        aria-label={t('learn.listen', { text: toSpeechText(speakText) })}
        className="group -m-1 flex items-start justify-between gap-2 rounded-xl p-1 text-left focus-visible:outline-2 focus-visible:outline-primary-400 disabled:cursor-default"
      >
        <span className="min-w-0">
          <span
            lang={language.code}
            className={`block leading-tight font-bold break-words transition-colors ${charSize(glyph.char)} ${active ? 'text-accent' : 'text-fg group-hover:text-accent'}`}
          >
            {glyph.char}
          </span>
          {glyph.name && (
            <span lang={language.code} className="mt-1 block text-sm font-semibold text-label">
              {glyph.name}
            </span>
          )}
          {glyph.roman && <span className="block text-sm text-muted">{glyph.roman}</span>}
        </span>
        {speechSupported && (
          <span
            aria-hidden="true"
            className={`flex size-8 shrink-0 items-center justify-center rounded-full border transition-colors ${
              active ? 'border-primary-600 bg-primary-500 text-primary-950' : 'border-line-soft text-accent group-hover:border-primary-400'
            }`}
          >
            <Volume2 size={16} className={active ? 'motion-safe:animate-pulse' : ''} />
          </span>
        )}
      </button>

      {glyph.ipa && <p className="text-sm font-medium text-accent">{glyph.ipa}</p>}

      {glyph.readings && (
        <dl className="space-y-1 text-sm">
          {glyph.readings.on && (
            <div className="flex items-baseline gap-2">
              <dt className="w-9 shrink-0 rounded bg-primary-500/15 px-1 text-center text-[11px] font-bold text-accent uppercase">{t('learn.glyph.on')}</dt>
              <dd lang="ja">{glyph.readings.on}</dd>
            </div>
          )}
          {glyph.readings.kun && (
            <div className="flex items-baseline gap-2">
              <dt className="w-9 shrink-0 rounded bg-secondary-300/50 px-1 text-center text-[11px] font-bold text-secondary-800 uppercase dark:bg-espresso-600 dark:text-secondary-200">
                {t('learn.glyph.kun')}
              </dt>
              <dd lang="ja">{glyph.readings.kun}</dd>
            </div>
          )}
        </dl>
      )}

      {glyph.sounds && (
        <ul className="flex flex-wrap gap-1">
          {glyph.sounds.split(' · ').map((sound) => (
            <li key={sound} lang={language.code} className="rounded-full bg-surface px-2 py-0.5 text-xs text-label">
              {sound}
            </li>
          ))}
        </ul>
      )}

      {glyph.tip && (
        <p className="text-xs leading-relaxed text-muted sm:text-sm">
          <RichText text={loc(glyph.tip)} />
        </p>
      )}

      {example && (
        <div className="mt-auto flex items-start gap-2 border-t border-line-soft pt-3">
          <SpeakButton text={example.word} />
          <div className="min-w-0 text-sm">
            <p className="break-words">
              <span lang={language.code} className="font-semibold text-fg">
                {example.word}
              </span>
              {example.roman && <span className="ml-1.5 text-muted italic">{example.roman}</span>}
            </p>
            {example.ipa && <p className="text-xs text-muted">{example.ipa}</p>}
            {showMeaning && <p className="text-label">{meaning}</p>}
          </div>
        </div>
      )}
    </article>
  )
}

export default GlyphCard
