import { useTranslation } from "react-i18next";
import { Link } from "react-router";
import BunnyMascot from "@/components/BunnyMascot";
import { useLocalized } from "@/features/learn/hooks/useLocalized";
import type { DailyGoal } from "@/features/progress/types";
import { useAuthStore } from "@/stores/auth.store";
import type { Dashboard } from "../types";

/** Encouragement that matches the day so far, plus the sets that need more practice. */
function CheerStrip({
  goals,
  weakAreas,
}: {
  goals: DailyGoal[];
  weakAreas: Dashboard["weakAreas"];
}) {
  const { t } = useTranslation();
  const loc = useLocalized();
  const name = useAuthStore((s) => s.user?.fullName ?? "");
  const left = goals.filter((goal) => !goal.completed).length;

  return (
    <section
      aria-labelledby="dashboard-cheer"
      className="flex shrink-0 items-center gap-3 rounded-3xl border border-secondary-300/60 bg-gradient-to-r from-secondary-100 to-primary-100 p-3 tall:p-4 dark:border-secondary-800 dark:from-secondary-950/60 dark:to-primary-950/50"
    >
      <BunnyMascot
        size={56}
        interactive={false}
        // ! wins over the mascot's inline size: smaller where the screen is short.
        className="fit:size-11! tall:size-14!"
      />
      <div className="min-w-0 flex-1">
        <h2 id="dashboard-cheer" className="font-bold text-accent">
          {left === 0
            ? t("dashboard.cheer.allDone", { name })
            : t("dashboard.cheer.keepGoing", { name, count: left })}
        </h2>
        {weakAreas.length > 0 ? (
          <p className="mt-1 flex flex-wrap items-center gap-1.5 text-sm text-muted">
            <span>{t("dashboard.cheer.weakTitle")}</span>
            {weakAreas.map((area, index) => (
              <Link
                key={area.setId}
                to="/app/review"
                // Only the two weakest unless the screen is wide and tall, so the strip stays two lines.
                className={`rounded-full bg-surface-raised/80 px-2.5 py-0.5 text-xs font-semibold text-fg transition-colors hover:bg-surface-raised focus-visible:outline-2 focus-visible:outline-accent ${
                  index >= 2 ? 'hidden xl:tall:inline' : ''
                }`}
              >
                {loc(area.setTitle)} · {area.weak}
              </Link>
            ))}
          </p>
        ) : (
          <p className="mt-1 text-sm text-muted">
            {t("dashboard.cheer.noWeak")}
          </p>
        )}
      </div>
    </section>
  );
}

export default CheerStrip;
