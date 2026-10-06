import { Flame, Star } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import BunnyMascot from "@/components/BunnyMascot";
import { useAuthStore } from "@/stores/auth.store";

const QUOTES = 5;

/** Greeting banner. Characters from every study language float in the background. */
function DashboardHero({
  streak,
  totalXp,
}: {
  streak: number;
  totalXp: number;
}) {
  const { t, i18n } = useTranslation();
  const name = useAuthStore((s) => s.user?.fullName ?? "");
  // Read once: the banner shows today's date, not a live clock.
  const [today] = useState(() => new Date());
  const date = new Intl.DateTimeFormat(i18n.language, {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(today);
  const quote = t(`dashboard.quotes.${dayOfYear(today) % QUOTES}`);

  return (
    <section
      aria-labelledby="dashboard-greeting"
      className="relative isolate flex shrink-0 items-center gap-4 overflow-hidden rounded-3xl bg-gradient-to-br from-primary-500 via-primary-400 to-secondary-400 px-5 py-4 text-primary-950 shadow-sm sm:px-8 fit:py-3 tall:py-7 dark:from-primary-800 dark:via-primary-700 dark:to-secondary-800 dark:text-primary-50"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-4 -bottom-10 -z-10 text-[9rem] leading-none font-black opacity-15 select-none sm:right-40"
      >
        あ가Ä
      </span>
      <div className="min-w-0 flex-1">
        <h1
          id="dashboard-greeting"
          className="text-2xl font-extrabold break-words sm:text-3xl fit:text-2xl tall:text-4xl"
        >
          {t("dashboard.greeting", { name })}
        </h1>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-2 tall:mt-3">
          <p className="text-sm font-semibold capitalize opacity-80 sm:text-base">
            {date}
          </p>
          <ul className="flex flex-wrap gap-2 text-sm font-bold">
            <li className="flex items-center gap-1.5 rounded-full bg-white/30 px-3 py-1 backdrop-blur-sm dark:bg-black/20">
              <Flame size={16} aria-hidden="true" />
              {t("dashboard.streak", { count: streak })}
            </li>
            <li className="flex items-center gap-1.5 rounded-full bg-white/30 px-3 py-1 backdrop-blur-sm dark:bg-black/20">
              <Star size={16} aria-hidden="true" />
              {t("dashboard.xp", { count: totalXp })}
            </li>
          </ul>
        </div>
      </div>
      <blockquote className="hidden max-w-72 text-right text-sm font-semibold italic opacity-90 lg:block xl:max-w-sm xl:text-base">
        “{quote}”
      </blockquote>
      <BunnyMascot
        size={80}
        className="hidden shrink-0 sm:inline-block fit:size-16! tall:size-20!"
      />
    </section>
  );
}

function dayOfYear(date: Date) {
  return Math.floor(
    (date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) /
      86_400_000,
  );
}

export default DashboardHero;
