/**
 * Picks the voice that sounds best for a language. Browsers list every installed voice and the
 * first match is often a poor one: macOS puts its "Eloquence" and novelty voices (Eddy, Flo,
 * Grandma, Bubbles…) before Kyoko or Anna, and they sound robotic and much quieter.
 */

// macOS Eloquence and novelty voices: robotic, quiet, or sing instead of speaking.
const POOR_VOICES = new Set([
  'albert', 'bad news', 'bahh', 'bells', 'boing', 'bubbles', 'cellos', 'eddy', 'flo', 'fred', 'good news', 'grandma',
  'grandpa', 'jester', 'junior', 'kathy', 'organ', 'ralph', 'reed', 'rocko', 'sandy', 'shelley', 'superstar',
  'trinoids', 'whisper', 'wobble', 'zarvox',
])

// Natural-sounding system voices per language (macOS, Windows, Android).
const GOOD_VOICES = [
  'kyoko', 'otoya', 'nanami', 'haruka', 'yuna', 'sunhi', 'heami', 'anna', 'katja', 'hedda', 'daniel', 'kate', 'serena',
  'samantha', 'hazel', 'sonia', 'linh', 'hoaimy',
]

export type VoiceLike = Pick<SpeechSynthesisVoice, 'name' | 'lang' | 'localService' | 'default'>

const normalizedLang = (voice: VoiceLike) => voice.lang.replace('_', '-').toLowerCase()
/** "Eddy (Japanese (Japan))" → "eddy", "Microsoft Nanami Online (Natural) - Japanese" → "microsoft nanami online" */
const baseName = (voice: VoiceLike) => voice.name.toLowerCase().split(/[(-]/)[0].trim()

function score(voice: VoiceLike, lang: string): number {
  const name = voice.name.toLowerCase()
  // Still usable when it is the only voice the device has for the language.
  if (POOR_VOICES.has(baseName(voice))) return 1
  let points = normalizedLang(voice) === lang.toLowerCase() ? 100 : 50
  // Neural / network voices are the clearest and loudest.
  if (/natural|neural|online|google|premium|enhanced|siri/.test(name)) points += 30
  if (GOOD_VOICES.some((good) => name.split(/[\s(-]+/).includes(good))) points += 20
  if (voice.default) points += 5
  return points
}

/** Voices for the language, best first. Empty when the device has no voice for it. */
export function rankVoices<V extends VoiceLike>(voices: V[], lang: string): V[] {
  const base = lang.split('-')[0].toLowerCase()
  return voices
    .filter((voice) => normalizedLang(voice).split('-')[0] === base)
    .map((voice) => ({ voice, points: score(voice, lang) }))
    .sort((a, b) => b.points - a.points)
    .map(({ voice }) => voice)
}
