interface DotsLoaderProps {
  size?: 'sm' | 'md'
  className?: string
}

const SIZE_CLASSES = {
  sm: 'size-2',
  md: 'size-4',
}

const DOT_DELAYS_MS = [0, 150, 300]

function DotsLoader({ size = 'md', className = '' }: DotsLoaderProps) {
  return (
    <span aria-hidden="true" className={`inline-flex items-center gap-2 ${className}`}>
      {DOT_DELAYS_MS.map((delay) => (
        <span
          key={delay}
          className={`rounded-full bg-current motion-safe:animate-dot-wave ${SIZE_CLASSES[size]}`}
          style={{ animationDelay: `${delay}ms` }}
        />
      ))}
    </span>
  )
}

export default DotsLoader
