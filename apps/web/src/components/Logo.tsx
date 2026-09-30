import { Link } from 'react-router'

interface LogoProps {
  tone?: 'light' | 'dark'
  className?: string
}

function Logo({ tone = 'dark', className = '' }: LogoProps) {
  const base = tone === 'light' ? 'text-secondary-100' : 'text-fg'
  const accent = tone === 'light' ? 'text-primary-400' : 'text-primary-600 dark:text-primary-400'

  return (
    <Link to="/" aria-label="UnYoWo" className={`font-extrabold tracking-tight ${base} ${className}`}>
      <span>Un</span>
      <span className={accent}>Yo</span>
      <span>Wo</span>
    </Link>
  )
}

export default Logo
