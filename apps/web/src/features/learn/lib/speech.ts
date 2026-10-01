import { toast } from 'sonner'
import { create } from 'zustand'
import i18n from '@/i18n'

interface SpeechState {
  speakingKey: string | null
}

export const useSpeechStore = create<SpeechState>()(() => ({ speakingKey: null }))

export const speechSupported = typeof window !== 'undefined' && 'speechSynthesis' in window

let currentUtterance: SpeechSynthesisUtterance | null = null

/** Keeps only what should be read aloud: drops **bold** markers, "(romanization)", "→ [pronunciation]" notes and arrows. */
export function toSpeechText(text: string): string {
  return text
    .split('→')[0]
    .replace(/\*\*/g, '')
    .replace(/[(（][^)）]*[)）]/g, '')
    .replace(/[[\]↗↘]/g, '')
    .trim()
}

// undefined = voices not loaded yet (the browser picks one from utterance.lang); null = no voice for this language.
function pickVoice(lang: string): SpeechSynthesisVoice | null | undefined {
  const voices = window.speechSynthesis.getVoices()
  if (voices.length === 0) return undefined

  const normalized = (voice: SpeechSynthesisVoice) => voice.lang.replace('_', '-').toLowerCase()
  const base = lang.split('-')[0].toLowerCase()
  return (
    voices.find((voice) => normalized(voice) === lang.toLowerCase()) ??
    voices.find((voice) => normalized(voice).startsWith(base)) ??
    null
  )
}

export function speak(text: string, lang: string, key = text) {
  if (!speechSupported) return

  const voice = pickVoice(lang)
  if (voice === null) {
    toast.warning(i18n.t('learn.noVoice'))
    return
  }

  const synth = window.speechSynthesis
  synth.cancel()

  const utterance = new SpeechSynthesisUtterance(toSpeechText(text))
  utterance.lang = lang
  utterance.rate = 0.85
  if (voice) utterance.voice = voice

  const finish = () => {
    if (currentUtterance !== utterance) return
    currentUtterance = null
    useSpeechStore.setState({ speakingKey: null })
  }
  utterance.onend = finish
  utterance.onerror = finish

  currentUtterance = utterance
  useSpeechStore.setState({ speakingKey: key })
  synth.speak(utterance)
}

export function stopSpeaking() {
  if (!speechSupported) return
  currentUtterance = null
  window.speechSynthesis.cancel()
  useSpeechStore.setState({ speakingKey: null })
}
