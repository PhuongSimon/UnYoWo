interface DotsLoaderProps {
  size?: 'sm' | 'md'
  className?: string
}

const SIZE_CLASSES = {
  sm: 'size-2',
  md: 'size-4',
}

const DELAYS = ['[animation-delay:.7s]', '[animation-delay:.3s]', '[animation-delay:.7s]']

function DotsLoader({ size = 'md', className = '' }: DotsLoaderProps) {
  return (
    <span aria-hidden="true" className={`inline-flex items-center gap-2 ${className}`}>
      {DELAYS.map((delay, index) => (
        <span
          key={index}
          className={`rounded-full bg-current motion-safe:animate-bounce ${SIZE_CLASSES[size]} ${delay}`}
        />
      ))}
    </span>
  )
}

export default DotsLoader
