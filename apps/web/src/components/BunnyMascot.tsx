import { Mascot } from 'page-mascot'
import { useTranslation } from 'react-i18next'

const DIRECTIONS = '/mascots/bunny-box-directions.webp'
const REACTIONS = '/mascots/bunny-box-reactions.webp'

interface BunnyMascotProps {
  size?: number
  className?: string
  interactive?: boolean
}

function BunnyMascot({ size = 140, className = '', interactive = true }: BunnyMascotProps) {
  const { t } = useTranslation()

  if (!interactive) {
    return (
      <span
        aria-hidden="true"
        className={`inline-block shrink-0 bg-no-repeat ${className}`}
        style={{
          width: size,
          height: size,
          backgroundImage: `url(${DIRECTIONS})`,
          backgroundSize: '300% 300%',
          backgroundPosition: '50% 50%',
        }}
      />
    )
  }

  return (
    <Mascot directions={DIRECTIONS} reactions={REACTIONS} size={size} label={t('mascot.name')} className={className} />
  )
}

export default BunnyMascot
