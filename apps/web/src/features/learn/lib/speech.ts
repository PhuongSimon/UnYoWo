import { toast } from 'sonner'
import { create } from 'zustand'
import i18n from '@/i18n'
import { rankVoices } from './voices'

interface SpeechState {
  speakingKey: string | null
}

export const useSpeechStore = create<SpeechState>()(() => ({ speakingKey: null }))

export const speechSupported = typeof window !== 'undefined' && 'speechSynthesis' in window

let currentUtterance: SpeechSynthesisUtterance | null = null
let pendingStart: ReturnType<typeof setTimeout> | null = null

// Voices load asynchronously (Chrome fills the list after the first `voiceschanged`), so keep a cached copy.
let voices: SpeechSynthesisVoice[] = []
const loadVoices = () => {
  voices = window.speechSynthesis.getVoices()
}
if (speechSupported) {
  loadVoices()
  window.speechSynthesis.addEventListener?.('voiceschanged', loadVoices)
}

/**
 * Keeps only what should be read aloud: drops **bold** markers, "(romanization)", "→ [pronunciation]"
 * notes, arrows, and the ～ placeholder of affixes (～さん) that some voices read as a word.
 */
export function toSpeechText(text: string): string {
  return text
    .split('→')[0]
    .replace(/\*\*/g, '')
    .replace(/[(（][^)）]*[)）]/g, '')
    .replace(/[[\]↗↘～~]/g, '')
    .trim()
}

export function speak(text: string, lang: string, key = text) {
  if (!speechSupported) return
  if (voices.length === 0) loadVoices()

  const ranked = rankVoices(voices, lang)
  // An empty list means the voices are still loading: the browser then picks one from utterance.lang.
  if (voices.length > 0 && ranked.length === 0) {
    toast.warning(i18n.t('learn.noVoice'))
    return
  }

  const synth = window.speechSynthesis
  const busy = synth.speaking || synth.pending || pendingStart !== null
  stopSpeaking()
  useSpeechStore.setState({ speakingKey: key })

  const start = (voiceIndex: number) => {
    const utterance = new SpeechSynthesisUtterance(toSpeechText(text))
    utterance.lang = lang
    utterance.rate = 0.85
    utterance.volume = 1
    const voice = ranked[voiceIndex]
    if (voice) utterance.voice = voice

    const finish = () => {
      if (currentUtterance !== utterance) return
      currentUtterance = null
      useSpeechStore.setState({ speakingKey: null })
    }
    utterance.onend = finish
    utterance.onerror = (event) => {
      // A network voice (Google, Microsoft Online) can fail offline: try the next voice once.
      const failed = event.error !== 'interrupted' && event.error !== 'canceled'
      if (failed && currentUtterance === utterance && ranked[voiceIndex + 1]) start(voiceIndex + 1)
      else finish()
    }

    // Kept in a variable: Chrome stops (and never fires onend) when the utterance is garbage-collected.
    currentUtterance = utterance
    synth.resume()
    synth.speak(utterance)
  }

  // Chrome silently drops an utterance queued in the same tick as cancel(), which made a word
  // that interrupted another (or a new listening question) play nothing. Wait a moment in that case;
  // otherwise speak right away, as iOS only allows speech inside the tap that asked for it.
  if (busy) {
    pendingStart = setTimeout(() => {
      pendingStart = null
      start(0)
    }, 80)
  } else {
    start(0)
  }
}

export function stopSpeaking() {
  if (!speechSupported) return
  if (pendingStart) clearTimeout(pendingStart)
  pendingStart = null
  currentUtterance = null
  window.speechSynthesis.cancel()
  useSpeechStore.setState({ speakingKey: null })
}
