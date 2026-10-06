import { Volume2 } from 'lucide-react'
import { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { StudyContext } from '../context'
import { speak, speechSupported, toSpeechText, useSpeechStore } from '../lib/speech'

interface SpeakButtonProps {
  text: string
  /** Speech language; defaults to the language being studied. */
  lang?: string
  size?: 'sm' | 'md'
  className?: string
}

const SIZES = {
  sm: { box: 'size-8', icon: 16 },
  md: { box: 'size-10', icon: 20 },
}

function SpeakButton({ text, lang, size = 'sm', className = '' }: SpeakButtonProps) {
  const { t } = useTranslation()
  const study = useContext(StudyContext)
  const speechLang = lang ?? study?.language.speechLang ?? 'en-GB'
  const speechKey = `${speechLang}:${text}`
  const active = useSpeechStore((s) => s.speakingKey === speechKey)

  if (!speechSupported) return null

  const label = t('learn.listen', { text: toSpeechText(text) })

  return (
    <button
      type="button"
      onClick={() => speak(text, speechLang, speechKey)}
      aria-label={label}
      title={label}
      className={`inline-flex shrink-0 items-center justify-center rounded-full border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${SIZES[size].box} ${
        active
          ? 'border-primary-600 bg-primary-500 text-primary-950'
          : 'border-line-soft bg-surface-raised text-accent hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-espresso-700'
      } ${className}`}
    >
      <Volume2 size={SIZES[size].icon} aria-hidden="true" className={active ? 'motion-safe:animate-pulse' : ''} />
    </button>
  )
}

export default SpeakButton
