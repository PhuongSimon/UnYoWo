import {
  CalendarCheck,
  CircleAlert,
  Play,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import DotsLoader from "@/components/ui/DotsLoader";
import { useLocalized } from "@/features/learn/hooks/useLocalized";
import ProgressBar from "@/features/practice/components/ProgressBar";
import { useStartGame } from "@/features/practice/hooks/useStartGame";
import type { Suggestion, SuggestionKind } from "../types";
import { useLanguageLabel } from "../useLanguageLabel";

const KINDS: Record<
  SuggestionKind,
  { Icon: LucideIcon; tint: string; primary: boolean }
> = {
  REVIEW_DUE: {
    Icon: CalendarCheck,
    tint: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
    primary: true,
  },
  FIX_MISTAKES: {
    Icon: CircleAlert,
    tint: "bg-red-500/15 text-red-700 dark:text-red-300",
    primary: true,
  },
  CONTINUE_SET: {
    Icon: Play,
    tint: "bg-sky-500/15 text-sky-700 dark:text-sky-300",
    primary: true,
  },
  START_SET: {
    Icon: Sparkles,
    tint: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
    primary: false,
  },
};

/** "What should I study today?": each suggestion starts its game in one tap. */
function TodayPlan({ suggestions }: { suggestions: Suggestion[] }) {
  const { t } = useTranslation();
  const loc = useLocalized();
  const label = useLanguageLabel();
  const start = useStartGame();

  const isStarting = (suggestion: Suggestion) =>
    start.isPending &&
    start.variables?.language === suggestion.languageCode &&
    start.variables.source === suggestion.source &&
    (start.variables.setId ?? null) === suggestion.setId;

  return (
    <section
      aria-labelledby="dashboard-plan"
      className="flex flex-col rounded-3xl border border-line-soft bg-surface-raised p-4 shadow-sm fit:min-h-0 fit:flex-[1_1_0%] tall:p-5"
    >
      <h2 id="dashboard-plan" className="shrink-0 text-lg font-bold">
        {t("dashboard.plan.title")}
      </h2>
      {suggestions.length === 0 ? (
        <p className="mt-3 text-muted">{t("dashboard.plan.empty")}</p>
      ) : (
        // Scrolls inside the card on short screens, so the page itself never has to.
        <ul className="mt-3 space-y-2.5 [scrollbar-width:thin] fit:min-h-0 fit:flex-1 fit:overflow-y-auto fit:pr-1">
          {suggestions.map((suggestion) => {
            const { Icon, tint, primary } = KINDS[suggestion.kind];
            const set = suggestion.setTitle ? loc(suggestion.setTitle) : "";
            const language = label(suggestion.languageCode);
            const title = t(`dashboard.plan.${suggestion.kind}`, {
              count: suggestion.count,
              set,
            });
            // The button says what to do; its name adds what it is done to ("Continue: Hiragana",
            // not "Continue: Continue: Hiragana").
            const target =
              suggestion.kind === "CONTINUE_SET" || suggestion.kind === "START_SET"
                ? set
                : title;
            return (
              <li
                key={`${suggestion.kind}-${suggestion.languageCode}`}
                className="flex items-center gap-3 rounded-2xl bg-surface p-2.5 tall:p-3.5"
              >
                <span
                  className={`flex size-10 shrink-0 items-center justify-center rounded-xl tall:size-12 ${tint}`}
                >
                  <Icon size={22} aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 leading-snug font-semibold break-words sm:truncate">{title}</p>
                  <p className="truncate text-xs text-muted">
                    {t("dashboard.plan.detail", {
                      language,
                      game: t(`practice.games.${suggestion.gameType}`),
                    })}
                    {suggestion.kind === "FIX_MISTAKES" &&
                      set &&
                      ` · ${t("dashboard.plan.mostIn", { set })}`}
                  </p>
                  {suggestion.kind === "CONTINUE_SET" && (
                    <ProgressBar
                      value={suggestion.count}
                      max={suggestion.total}
                      label={t("dashboard.plan.seen", {
                        count: suggestion.count,
                        total: suggestion.total,
                      })}
                      className="mt-1.5 h-1.5 max-w-64"
                    />
                  )}
                </div>
                <button
                  type="button"
                  disabled={start.isPending}
                  onClick={() =>
                    start.mutate({
                      gameType: suggestion.gameType,
                      language: suggestion.languageCode,
                      source: suggestion.source,
                      setId: suggestion.setId ?? undefined,
                    })
                  }
                  aria-label={`${t(`dashboard.plan.action.${suggestion.kind}`)}: ${target}`}
                  className={`inline-flex min-h-11 min-w-20 shrink-0 items-center justify-center rounded-full px-3 text-sm sm:min-w-24 sm:px-4 font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:opacity-60 ${
                    primary
                      ? "bg-brand text-on-brand hover:bg-brand-hover"
                      : "border border-line-soft bg-surface-raised hover:border-primary-400"
                  }`}
                >
                  {isStarting(suggestion) ? (
                    <DotsLoader size="sm" />
                  ) : (
                    t(`dashboard.plan.action.${suggestion.kind}`)
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

export default TodayPlan;
