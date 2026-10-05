import { speak, speechSupported, stopSpeaking } from '@/features/learn/lib/speech'

/** Something to hear: a recorded file when there is one, otherwise text for speech synthesis. */
export interface AudioClip {
  url: string | null
  text: string
  /** BCP 47 voice tag, e.g. ja-JP */
  lang: string
}

/** Games only talk to this interface, so recorded audio can replace the browser voice without touching them. */
export interface AudioProvider {
  supports(clip: AudioClip): boolean
  play(clip: AudioClip): Promise<void>
  stop(): void
}

let current: HTMLAudioElement | null = null

const fileProvider: AudioProvider = {
  supports: (clip) => clip.url !== null && typeof Audio !== 'undefined',
  play: async (clip) => {
    fileProvider.stop()
    if (!clip.url) return
    current = new Audio(clip.url)
    await current.play()
  },
  stop: () => {
    current?.pause()
    current = null
  },
}

const speechProvider: AudioProvider = {
  supports: () => speechSupported,
  play: async (clip) => speak(clip.text, clip.lang, `clip:${clip.lang}:${clip.text}`),
  stop: stopSpeaking,
}

/** In order of preference: a real recording beats a synthetic voice. */
const PROVIDERS: AudioProvider[] = [fileProvider, speechProvider]

export const canPlay = (clip: AudioClip) => PROVIDERS.some((provider) => provider.supports(clip))

export function playClip(clip: AudioClip): Promise<void> {
  const provider = PROVIDERS.find((candidate) => candidate.supports(clip))
  if (!provider) return Promise.reject(new Error('No way to play this clip'))
  PROVIDERS.forEach((other) => other !== provider && other.stop())
  return provider.play(clip)
}

export function stopClips() {
  PROVIDERS.forEach((provider) => provider.stop())
}
