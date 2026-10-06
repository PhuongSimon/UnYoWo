import { AudioLines, Blocks, Keyboard, Layers, ListChecks, Puzzle, Zap, type LucideIcon } from 'lucide-react'
import type { GameType } from '../types'

const ICONS: Record<GameType, LucideIcon> = {
  FLASHCARD: Layers,
  MULTIPLE_CHOICE: ListChecks,
  MATCHING: Puzzle,
  TYPING: Keyboard,
  LISTENING: AudioLines,
  SPEED: Zap,
  BUILDER: Blocks,
}

function GameIcon({ gameType, size = 20, className }: { gameType: GameType; size?: number; className?: string }) {
  const Icon = ICONS[gameType]
  return <Icon size={size} aria-hidden="true" className={className} />
}

export default GameIcon
