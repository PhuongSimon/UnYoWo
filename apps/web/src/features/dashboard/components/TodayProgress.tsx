import { useTranslation } from "react-i18next";
import ProgressBar from "@/features/practice/components/ProgressBar";
import type { DailyGoal } from "@/features/progress/types";
import ProgressRing from "./ProgressRing";
import { useLanguageLabel } from "../useLanguageLabel";

/** Today's goals as one ring (average progress) and a bar per goal. */
function TodayProgress({
  goals,
  today,
}: {
  goals: DailyGoal[];
  today: { xp: number; answers: number };
}) {
  const { t } = useTranslation();
  const label = useLanguageLabel();
  const percent =
    goals.length > 0
      ? (goals.reduce((sum, goal) => sum + goal.current / goal.target, 0) /
          goals.length) *
        100
      : 0;
  const done = goals.filter((goal) => goal.completed).length;
  const status =
    done === goals.length && goals.length > 0
      ? "done"
      : percent > 0
        ? "going"
        : "start";

  return (
    // As tall as its goals; on very short screens it shrinks and the goal list scrolls inside.
    <section
      aria-labelledby="dashboard-progress"
      className="flex flex-col rounded-3xl border border-line-soft bg-surface-raised p-4 shadow-sm fit:min-h-0 fit:flex-[0_1_auto] tall:p-5"
    >
      <div className="flex shrink-0 flex-wrap items-baseline justify-between gap-x-3">
        <h2 id="dashboard-progress" className="text-lg font-bold">
          {t("dashboard.progress.title")}
        </h2>
        <p className="text-xs text-muted">
          {t("dashboard.progress.detail", {
            done,
            total: goals.length,
            answers: today.answers,
            xp: today.xp,
          })}
        </p>
      </div>
      {/* Ring beside the goals: one row tall instead of two, so all goals fit on short screens. */}
      <div className="mt-3 flex flex-col gap-3 fit:min-h-0 lg:flex-row lg:items-center lg:gap-5">
        <div className="flex shrink-0 items-center gap-3 lg:w-24 lg:flex-col lg:gap-1.5 lg:text-center">
          <ProgressRing
            percent={percent}
            label={t("dashboard.progress.ringLabel", {
              percent: Math.round(percent),
            })}
            className="size-[76px] fit:size-16 tall:size-[76px]"
          />
          <p className="text-sm font-extrabold text-emerald-700 dark:text-emerald-300">
            {t(`dashboard.progress.status.${status}`)}
          </p>
        </div>
        {/* One compact line per goal: label, bar, count (and the reward on tall screens). */}
        <ul className="min-w-0 flex-1 space-y-1.5 [scrollbar-width:thin] fit:max-h-full fit:overflow-y-auto tall:space-y-3">
          {goals.map((goal) => {
            const text = t(`progress.goals.${goal.key}`, {
              count: goal.target,
              language: goal.languageCode ? label(goal.languageCode) : "",
            });
            return (
              <li key={goal.key} className="flex items-center gap-3 text-sm">
                <span
                  className={`min-w-0 flex-1 truncate ${goal.completed ? "text-muted line-through" : ""}`}
                >
                  {text}
                </span>
                <ProgressBar
                  value={goal.current}
                  max={goal.target}
                  label={t("progress.goalProgress", {
                    label: text,
                    current: goal.current,
                    target: goal.target,
                  })}
                  className="h-1.5 w-12 shrink-0 sm:w-14 xl:w-20 2xl:w-32"
                />
                <span className="w-10 shrink-0 text-right text-xs font-semibold text-muted tabular-nums">
                  {goal.current}/{goal.target}
                </span>
                <span className="hidden w-14 shrink-0 text-right text-xs font-bold text-accent xl:tall:inline">
                  +{goal.xp} XP
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export default TodayProgress;
