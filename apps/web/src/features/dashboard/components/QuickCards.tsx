import { ChevronRight, Globe, RotateCcw } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import { findStudyLanguage } from "@/features/learn/languages";
import ProgressBar from "@/features/practice/components/ProgressBar";
import type { LanguageStats } from "../types";
import { useLanguageLabel } from "../useLanguageLabel";

/** A soft tint per language, so the row reads at a glance; new languages get a neutral one. */
const TINTS: Record<string, string> = {
  en: "bg-sky-50 dark:bg-sky-950/40",
  de: "bg-amber-50 dark:bg-amber-950/40",
  ja: "bg-rose-50 dark:bg-rose-950/40",
  ko: "bg-violet-50 dark:bg-violet-950/40",
};
const CARD =
  "group flex min-w-0 flex-col justify-between gap-1.5 rounded-2xl border border-line-soft p-3 transition-all hover:-translate-y-0.5 hover:border-primary-400 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent motion-reduce:hover:translate-y-0 tall:gap-2 tall:p-4";

function QuickCards({ languages }: { languages: LanguageStats[] }) {
  const { t } = useTranslation();
  const label = useLanguageLabel();
  const due = languages.reduce((sum, language) => sum + language.due, 0);
  const weak = languages.reduce((sum, language) => sum + language.weak, 0);

  return (
    <nav aria-label={t("dashboard.languagesNav")} className="shrink-0">
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 lg:gap-4">
        {languages.map((language) => {
          const study = findStudyLanguage(language.code);
          const name = label(language.code, language.nativeName);
          return (
            <li key={language.code} className="flex">
              <Link
                to={`/app/${language.code}/practice`}
                className={`${CARD} w-full ${TINTS[language.code] ?? "bg-surface-raised"}`}
              >
                <span className="flex items-center gap-2">
                  {study ? (
                    <study.Flag className="h-4 w-6 shrink-0 rounded-[3px] shadow-sm" />
                  ) : (
                    <Globe
                      size={18}
                      aria-hidden="true"
                      className="shrink-0 text-muted"
                    />
                  )}
                  <span className="truncate font-bold">{name}</span>
                  <ChevronRight
                    size={16}
                    aria-hidden="true"
                    className="ml-auto shrink-0 text-muted transition-transform group-hover:translate-x-0.5"
                  />
                </span>
                <span className="text-xs text-muted">
                  {t("dashboard.languageStats", {
                    mastered: language.mastered,
                    due: language.due,
                  })}
                </span>
                <span className="flex items-center gap-2">
                  <ProgressBar
                    value={language.seen}
                    max={language.total}
                    label={t("dashboard.languageProgress", {
                      language: name,
                      seen: language.seen,
                      total: language.total,
                    })}
                    className="h-1.5 flex-1"
                  />
                  <span className="shrink-0 text-[11px] font-semibold text-muted tabular-nums">
                    {language.seen}/{language.total}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
        <li className="col-span-2 flex lg:col-span-1">
          <Link
            to="/app/review"
            className={`${CARD} w-full bg-emerald-50 dark:bg-emerald-950/40`}
          >
            <span className="flex items-center gap-2">
              <RotateCcw
                size={18}
                aria-hidden="true"
                className="shrink-0 text-emerald-700 dark:text-emerald-300"
              />
              <span className="truncate font-bold">{t("review.title")}</span>
              <ChevronRight
                size={16}
                aria-hidden="true"
                className="ml-auto shrink-0 text-muted transition-transform group-hover:translate-x-0.5"
              />
            </span>
            <span className="text-xs text-muted">
              {t("dashboard.reviewStats", { due, weak })}
            </span>
            <span className="text-lg leading-none font-extrabold tall:text-2xl text-emerald-700 tabular-nums dark:text-emerald-300">
              {due}
            </span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default QuickCards;
