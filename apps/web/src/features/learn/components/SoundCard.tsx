import { useStudy } from '../context'
import { useLocalized } from '../hooks/useLocalized'
import { speak, speechSupported, toSpeechText, useSpeechStore } from '../lib/speech'
import type { Sound } from '../types'
import RichText from './RichText'
import SpeakButton from './SpeakButton'

interface SoundCardProps {
  sound: Sound
}

function SoundCard({ sound }: SoundCardProps) {
  const { language } = useStudy()
  const loc = useLocalized()
  const [open, close] = language.ipaDelimiters
  const speakText = sound.speak ?? sound.examples.map(toSpeechText).join(', ')

  return (
    <article className="flex h-full flex-col gap-3 rounded-2xl border border-line-soft bg-surface-raised p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-3xl font-bold tracking-tight text-accent">
            {open}
            {sound.ipa}
            {close}
          </p>
          {sound.label && <p className="mt-1 text-base font-semibold text-label">{loc(sound.label)}</p>}
        </div>
        <SpeakButton text={speakText} size="md" />
      </div>

      <ul className="flex flex-wrap gap-1.5">
        {sound.examples.map((example) => (
          <li key={example}>
            <ExampleChip text={example} />
          </li>
        ))}
      </ul>

      <p className="text-sm leading-relaxed text-muted">
        <RichText text={loc(sound.tip)} />
      </p>
    </article>
  )
}

function ExampleChip({ text }: { text: string }) {
  const { language } = useStudy()
  const speechKey = `${language.speechLang}:${text}`
  const active = useSpeechStore((s) => s.speakingKey === speechKey)

  return (
    <button
      type="button"
      lang={language.code}
      disabled={!speechSupported}
      onClick={() => speak(text, language.speechLang, speechKey)}
      className={`rounded-full border px-3 py-1 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-accent disabled:cursor-default ${
        active ? 'border-primary-600 bg-primary-500 text-primary-950 [&_strong]:text-primary-950' : 'border-line-soft bg-surface hover:border-primary-400'
      }`}
    >
      <RichText text={text} />
    </button>
  )
}

export default SoundCard
