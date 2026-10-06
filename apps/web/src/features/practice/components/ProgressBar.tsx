interface ProgressBarProps {
  value: number
  max: number
  label: string
  className?: string
}

function ProgressBar({ value, max, label, className = '' }: ProgressBarProps) {
  const percent = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      className={`h-2.5 overflow-hidden rounded-full bg-line-soft/70 ${className}`}
    >
      <div
        className="h-full rounded-full bg-primary-500 transition-[width] duration-500 ease-out motion-reduce:transition-none"
        style={{ width: `${percent}%` }}
      />
    </div>
  )
}

export default ProgressBar
