import { Volume2 } from 'lucide-react'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { canPlay, playClip, stopClips, type AudioClip } from '../audio/audio-provider'
import { useHotkeys } from '../hooks/useHotkeys'

/** The listening prompt: plays the clip once when shown, then on demand (button or R). */
function AudioPrompt({ clip }: { clip: AudioClip }) {
  const { t } = useTranslation()
  const playable = canPlay(clip)
  const play = () => void playClip(clip).catch(() => undefined)

  useEffect(() => {
    // Browsers may block sound before the first tap; the button is always there as a fallback.
    if (playable) playClip(clip).catch(() => undefined)
    return stopClips
  }, [clip, playable])

  useHotkeys({ r: play, R: play }, playable)

  if (!playable) {
    return (
      <p role="alert" className="mt-4 text-sm text-muted">
        {t('practice.listening.unsupported')}
      </p>
    )
  }

  return (
    <button
      type="button"
      onClick={play}
      aria-label={t('practice.listening.replay')}
      className="mx-auto mt-4 flex size-24 items-center justify-center rounded-full bg-primary-500 text-primary-950 shadow-lg shadow-primary-500/30 transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent active:scale-95 motion-reduce:transition-none sm:size-28"
    >
      <Volume2 size={44} aria-hidden="true" />
    </button>
  )
}

export default AudioPrompt
