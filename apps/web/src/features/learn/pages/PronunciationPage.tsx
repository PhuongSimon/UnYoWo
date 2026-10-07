import { useTranslation } from 'react-i18next'
import DataTable from '../components/DataTable'
import ExampleList from '../components/ExampleList'
import JumpLinks from '../components/JumpLinks'
import RichText from '../components/RichText'
import SoundCard from '../components/SoundCard'
import { useStudy } from '../context'
import { useLocalized } from '../hooks/useLocalized'
import { useScrollToHash } from '../hooks/useScrollToHash'
import type { Rule } from '../types'

const RULES_ID = 'rules'

function PronunciationPage() {
  const { t } = useTranslation()
  const { content } = useStudy()
  const loc = useLocalized()
  const { intro, groups, rules } = content.pronunciation
  useScrollToHash()

  const links = [...groups.map((group) => ({ id: group.id, label: loc(group.title) })), { id: RULES_ID, label: t('learn.pronunciation.rules') }]

  return (
    <div className="space-y-10 sm:space-y-12">
      <header className="space-y-4">
        <p className="max-w-3xl leading-relaxed text-fg/90">
          <RichText text={loc(intro)} />
        </p>
        <JumpLinks label={t('learn.jumpTo')} links={links} />
      </header>

      {groups.map((group) => (
        <section key={group.id} id={group.id} aria-labelledby={`${group.id}-title`} className="scroll-mt-32 space-y-4">
          <div>
            <h2 id={`${group.id}-title`} className="text-xl font-bold sm:text-2xl">
              {loc(group.title)}
            </h2>
            {group.intro && (
              <p className="mt-1 max-w-3xl text-sm leading-relaxed text-muted sm:text-base">
                <RichText text={loc(group.intro)} />
              </p>
            )}
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {group.sounds.map((sound, index) => (
              <SoundCard key={`${sound.ipa}-${index}`} sound={sound} />
            ))}
          </div>
        </section>
      ))}

      <section id={RULES_ID} aria-labelledby={`${RULES_ID}-title`} className="scroll-mt-32 space-y-4">
        <h2 id={`${RULES_ID}-title`} className="text-xl font-bold sm:text-2xl">
          {t('learn.pronunciation.rules')}
        </h2>
        <div className="space-y-4">
          {rules.map((rule, index) => (
            <RuleCard key={rule.id} rule={rule} number={index + 1} />
          ))}
        </div>
      </section>
    </div>
  )
}

function RuleCard({ rule, number }: { rule: Rule; number: number }) {
  const loc = useLocalized()

  return (
    <article className="rounded-2xl border border-line-soft bg-surface-raised p-4 shadow-sm sm:p-6">
      <h3 className="flex items-center gap-3 text-lg font-bold">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand text-sm font-extrabold text-on-brand">{number}</span>
        {loc(rule.title)}
      </h3>
      <p className="mt-3 leading-relaxed text-fg/90">
        <RichText text={loc(rule.body)} />
      </p>
      {rule.table && (
        <div className="mt-4">
          <DataTable table={rule.table} />
        </div>
      )}
      {rule.examples && (
        <div className="mt-4">
          <ExampleList examples={rule.examples} />
        </div>
      )}
    </article>
  )
}

export default PronunciationPage
