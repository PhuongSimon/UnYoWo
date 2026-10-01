import { AudioLines, BookOpen, PenLine, Repeat } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import BunnyMascot from '@/components/BunnyMascot'
import { useAuthStore } from '@/stores/auth.store'
import LanguageCard from '../components/LanguageCard'
import { STUDY_LANGUAGES } from '../languages'

const ROADMAP = [
  { key: 'writing', Icon: PenLine },
  { key: 'pronunciation', Icon: AudioLines },
  { key: 'grammar', Icon: BookOpen },
  { key: 'practice', Icon: Repeat },
] as const

function HomePage() {
  const { t } = useTranslation()
  const user = useAuthStore((s) => s.user)

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <section className="flex items-center gap-4 sm:gap-8">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold tracking-[0.2em] text-accent uppercase sm:text-sm">Unlock Your World</p>
          <h1 className="mt-2 text-3xl font-extrabold break-words sm:text-4xl">{t('home.greeting', { name: user?.fullName })}</h1>
          <p className="mt-3 max-w-2xl text-muted sm:text-lg">{t('home.subtitle')}</p>
        </div>
        <BunnyMascot size={104} className="shrink-0" />
      </section>

      <section aria-labelledby="home-languages" className="mt-10 sm:mt-12">
        <h2 id="home-languages" className="text-xl font-bold">
          {t('home.languagesTitle')}
        </h2>
        <div className="mt-5 grid gap-6 md:grid-cols-2 md:gap-8">
          {STUDY_LANGUAGES.map((language) => (
            <LanguageCard key={language.code} language={language} />
          ))}
        </div>
      </section>

      <section aria-labelledby="home-roadmap" className="mt-14 sm:mt-16">
        <h2 id="home-roadmap" className="text-xl font-bold">
          {t('home.roadmapTitle')}
        </h2>
        <p className="mt-1 text-muted">{t('home.roadmapSubtitle')}</p>
        <ol className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ROADMAP.map(({ key, Icon }, index) => (
            <li key={key} className="relative rounded-2xl border border-line-soft bg-surface-raised p-5">
              <div className="flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-full bg-primary-500 text-sm font-extrabold text-primary-950">{index + 1}</span>
                <Icon size={20} className="text-accent" aria-hidden="true" />
              </div>
              <h3 className="mt-4 font-bold">{t(`home.roadmap.${key}.title`)}</h3>
              <p className="mt-1 text-sm leading-relaxed text-muted">{t(`home.roadmap.${key}.description`)}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  )
}

export default HomePage
