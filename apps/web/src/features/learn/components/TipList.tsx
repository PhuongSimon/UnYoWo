import { Lightbulb } from 'lucide-react'
import { useLocalized } from '../hooks/useLocalized'
import type { Localized } from '../types'
import RichText from './RichText'

interface TipListProps {
  title: string
  tips: Localized[]
}

function TipList({ title, tips }: TipListProps) {
  const loc = useLocalized()

  return (
    <aside className="rounded-2xl border border-secondary-300 bg-secondary-100/70 p-4 sm:p-5 dark:border-espresso-600 dark:bg-espresso-800/70">
      <h3 className="flex items-center gap-2 text-sm font-bold tracking-wide text-secondary-800 uppercase dark:text-secondary-200">
        <Lightbulb size={18} aria-hidden="true" />
        {title}
      </h3>
      <ul className="mt-3 space-y-2 text-sm leading-relaxed">
        {tips.map((tip, index) => (
          <li key={index} className="flex gap-2.5">
            <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-brand" />
            <span>
              <RichText text={loc(tip)} />
            </span>
          </li>
        ))}
      </ul>
    </aside>
  )
}

export default TipList
