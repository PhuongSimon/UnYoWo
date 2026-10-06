import { useQuery } from "@tanstack/react-query";
import { ErrorState } from "@/features/learn/components/ContentState";
import { dashboardQuery } from "../api";
import CheerStrip from "../components/CheerStrip";
import DashboardHero from "../components/DashboardHero";
import DashboardSkeleton from "../components/DashboardSkeleton";
import QuickCards from "../components/QuickCards";
import RecentResults from "../components/RecentResults";
import TodayPlan from "../components/TodayPlan";
import TodayProgress from "../components/TodayProgress";

/**
 * Home screen. On tablets and desktops (the `fit:` variant) it fills exactly the space
 * between header and footer: rows shrink, long lists scroll inside their card and the
 * page never scrolls. Phones stack everything and scroll normally.
 */
function DashboardPage() {
  const { data, isPending, isError, refetch } = useQuery(dashboardQuery);

  return (
    <div className="mx-auto flex w-full max-w-app flex-col gap-3 px-4 py-4 sm:px-6 lg:gap-4 lg:px-8 fit:min-h-0 fit:flex-1 tall:gap-5 tall:py-6">
      {isPending ? (
        <DashboardSkeleton />
      ) : isError ? (
        <ErrorState onRetry={() => void refetch()} />
      ) : (
        <>
          <DashboardHero streak={data.streak.current} totalXp={data.totalXp} />
          <QuickCards languages={data.languages} />
          {/* minmax(0, 1fr) rows: grid cells default to their content height and would push past the screen. */}
          <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] fit:min-h-0 fit:flex-1 fit:grid-rows-[minmax(0,1fr)] lg:gap-4 tall:gap-5">
            <div className="flex flex-col gap-3 fit:min-h-0 lg:gap-4 tall:gap-5">
              <TodayPlan suggestions={data.suggestions} />
              <CheerStrip goals={data.dailyGoals} weakAreas={data.weakAreas} />
            </div>
            <div className="flex flex-col gap-3 fit:min-h-0 lg:gap-4 tall:gap-5">
              <TodayProgress goals={data.dailyGoals} today={data.today} />
              <RecentResults sessions={data.recentSessions} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default DashboardPage;
