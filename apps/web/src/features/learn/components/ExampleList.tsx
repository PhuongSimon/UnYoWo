import { useStudy } from '../context'
import { useUiLanguage } from '../hooks/useLocalized'
import type { Example } from '../types'
import RichText from './RichText'
import SpeakButton from './SpeakButton'

interface ExampleListProps {
  examples: Example[]
}

function ExampleList({ examples }: ExampleListProps) {
  const { language } = useStudy()
  const uiLanguage = useUiLanguage()

  return (
    <ul className="space-y-2">
      {examples.map((example, index) => {
        // English sentences carry no English gloss, so nothing is shown under them in the English UI.
        const gloss = uiLanguage === 'vi' ? example.vi : example.en

        return (
          <li key={index} className="flex items-start gap-3 rounded-xl border border-line-soft bg-surface-raised px-3 py-2.5 sm:px-4">
            <SpeakButton text={example.text} className="mt-0.5" />
            <div className="min-w-0 flex-1">
              <p lang={language.code} className="text-base font-medium break-words text-fg sm:text-lg">
                <RichText text={example.text} />
              </p>
              {example.roman && <p className="text-sm break-words text-muted italic">{example.roman}</p>}
              {gloss && <p className="mt-0.5 text-sm text-label">{gloss}</p>}
            </div>
          </li>
        )
      })}
    </ul>
  )
}

export default ExampleList
