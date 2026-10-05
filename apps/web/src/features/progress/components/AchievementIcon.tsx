import { Blocks, Crown, Feather, Flame, Footprints, Globe, Sprout, Trophy, Zap, type LucideIcon } from 'lucide-react'

/** Icons by achievement key; a new achievement without one gets the trophy. */
const ICONS: Record<string, LucideIcon> = {
  FIRST_STEPS: Footprints,
  STREAK_7: Flame,
  HIRAGANA_BEGINNER: Sprout,
  HIRAGANA_MASTER: Crown,
  KATAKANA_BEGINNER: Feather,
  HANGUL_BEGINNER: Blocks,
  POLYGLOT: Globe,
  SPEED_DEMON: Zap,
}

function AchievementIcon({ achievementKey, size }: { achievementKey: string; size: number }) {
  const Icon = ICONS[achievementKey] ?? Trophy
  return <Icon size={size} aria-hidden="true" />
}

export default AchievementIcon
