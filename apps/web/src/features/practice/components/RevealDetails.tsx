import SpeakButton from '@/features/learn/components/SpeakButton'
import type { QuestionReveal } from '../types'

interface RevealDetailsProps {
  reveal: QuestionReveal
  studyLang: string
  speechLang: string
  centered?: boolean
}

/** The full item: ぬ · nu, or 犬 いぬ inu — dog 🐕, with a button to hear it. */
function RevealDetails({ reveal, studyLang, speechLang, centered = false }: RevealDetailsProps) {
  const showReading = reveal.reading && reveal.reading !== reveal.text
  const showMeaning = reveal.meaning && reveal.meaning.toLowerCase() !== reveal.text.toLowerCase()

  return (
    <div className={`flex items-center gap-3 ${centered ? 'justify-center text-center' : ''}`}>
      {reveal.emoji && (
        <span aria-hidden="true" className="text-3xl leading-none">
          {reveal.emoji}
        </span>
      )}
      <div className="min-w-0">
        <p className={`flex flex-wrap items-baseline gap-x-2 ${centered ? 'justify-center' : ''}`}>
          <span lang={studyLang} className="text-2xl font-bold">
            {reveal.text}
          </span>
          {showReading && (
            <span lang={studyLang} className="text-lg text-muted">
              {reveal.reading}
            </span>
          )}
          {reveal.romanization && (
            <span lang={`${studyLang}-Latn`} className="text-lg text-muted italic">
              {reveal.romanization}
            </span>
          )}
        </p>
        {showMeaning && <p className="mt-0.5 font-medium">{reveal.meaning}</p>}
      </div>
      <SpeakButton text={reveal.text} lang={speechLang} size="md" />
    </div>
  )
}

export default RevealDetails
