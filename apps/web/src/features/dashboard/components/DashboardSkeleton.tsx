import { useTranslation } from "react-i18next";

const block = "rounded-3xl bg-line-soft/50 motion-safe:animate-pulse";

/** Same shape as the dashboard, so nothing jumps when the data arrives. */
function DashboardSkeleton() {
  const { t } = useTranslation();
  return (
    <div role="status" aria-label={t("dashboard.loading")} className="contents">
      <div className={`${block} h-32 shrink-0 tall:h-40`} />
      <div className="grid shrink-0 grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 lg:gap-4">
        {Array.from({ length: 5 }, (_, index) => (
          <div key={index} className={`${block} h-24 rounded-2xl`} />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] fit:min-h-0 fit:flex-1 lg:gap-4">
        <div className={`${block} min-h-72`} />
        <div className={`${block} min-h-72`} />
      </div>
    </div>
  );
}

export default DashboardSkeleton;
