interface ProgressRingProps {
  /** 0–100 */
  percent: number;
  label: string;
  /** Size classes, e.g. "size-24 tall:size-28" */
  className?: string;
}

/** A circular progress meter. pathLength="100" lets the dash maths work in percent. */
function ProgressRing({ percent, label, className = "size-24" }: ProgressRingProps) {
  const value = Math.max(0, Math.min(100, Math.round(percent)));

  return (
    <div
      role="img"
      aria-label={label}
      className={`@container relative shrink-0 ${className}`}
    >
      <svg viewBox="0 0 100 100" className="size-full -rotate-90">
        <circle
          cx="50"
          cy="50"
          r="42"
          fill="none"
          strokeWidth="10"
          className="stroke-line-soft/70"
        />
        <circle
          cx="50"
          cy="50"
          r="42"
          fill="none"
          strokeWidth="10"
          strokeLinecap="round"
          pathLength={100}
          strokeDasharray="100"
          strokeDashoffset={100 - value}
          className="stroke-emerald-500 motion-safe:animate-ring dark:stroke-emerald-400"
        />
      </svg>
      <span
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center text-[22cqw] font-extrabold tabular-nums"
      >
        {value}%
      </span>
    </div>
  );
}

export default ProgressRing;
