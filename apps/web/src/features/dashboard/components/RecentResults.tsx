import { ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { useLocalized } from "@/features/learn/hooks/useLocalized";
import GameIcon from "@/features/practice/components/GameIcon";
import type { RecentSession } from "../types";
import { useLanguageLabel } from "../useLanguageLabel";

function RecentResults({ sessions }: { sessions: RecentSession[] }) {
  const { t, i18n } = useTranslation();
  const loc = useLocalized();
  const label = useLanguageLabel();

  const title = (session: RecentSession) =>
    session.setTitle
      ? loc(session.setTitle)
      : `${t(`dashboard.recent.source.${session.source}`)} · ${label(session.languageCode)}`;

  return (
    <section
      aria-labelledby="dashboard-recent"
      className="flex flex-col rounded-3xl border border-line-soft bg-surface-raised p-4 shadow-sm fit:min-h-32 fit:flex-1 tall:p-5"
    >
      <div className="flex shrink-0 items-center justify-between gap-3">
        <h2 id="dashboard-recent" className="text-lg font-bold">
          {t("dashboard.recent.title")}
        </h2>
        <Link
          to="/app/progress"
          className="flex items-center gap-0.5 text-sm font-semibold text-accent hover:underline"
        >
          {t("dashboard.recent.seeAll")}
          <ChevronRight size={16} aria-hidden="true" />
        </Link>
      </div>
      {sessions.length === 0 ? (
        <p className="mt-3 text-sm text-muted">{t("dashboard.recent.empty")}</p>
      ) : (
        <ul className="mt-3 divide-y divide-line-soft [scrollbar-width:thin] fit:min-h-0 fit:flex-1 fit:overflow-y-auto fit:pr-1">
          {sessions.map((session) => (
            <li key={session.id} className="flex items-center gap-3 py-2">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-brand/15 text-accent">
                <GameIcon gameType={session.gameType} size={18} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">
                  {title(session)}
                </p>
                <p className="truncate text-xs text-muted">
                  {t("dashboard.recent.detail", {
                    game: t(`practice.games.${session.gameType}`),
                    correct: session.correctCount,
                    answered: session.answeredCount,
                    score: session.score,
                  })}
                </p>
              </div>
              <time
                dateTime={session.completedAt}
                className="shrink-0 text-xs text-muted"
              >
                {relativeDay(session.completedAt, i18n.language, t)}
              </time>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function relativeDay(
  iso: string,
  language: string,
  t: (key: string) => string,
) {
  const date = new Date(iso);
  const days = Math.round(
    (startOfDay(new Date()) - startOfDay(date)) / 86_400_000,
  );
  if (days === 0) return t("dashboard.recent.today");
  if (days === 1) return t("dashboard.recent.yesterday");
  return new Intl.DateTimeFormat(language, {
    day: "2-digit",
    month: "2-digit",
  }).format(date);
}

const startOfDay = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

export default RecentResults;
