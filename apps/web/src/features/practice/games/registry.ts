import type { ComponentType } from 'react'
import type { QuestionState } from '../engine/game-reducer'
import type { GameController } from '../engine/useGameSession'
import type { GameType } from '../types'
import FlashcardGame from './FlashcardGame'
import MultipleChoiceGame from './MultipleChoiceGame'

export interface GameScreenProps {
  state: QuestionState
  game: GameController
  studyLang: string
  speechLang: string
}

/** One screen per game type; the session, scoring and progress around it are shared. */
export const GAME_SCREENS: Record<GameType, { Screen: ComponentType<GameScreenProps>; hintKey: string }> = {
  FLASHCARD: { Screen: FlashcardGame, hintKey: 'practice.hint.FLASHCARD' },
  MULTIPLE_CHOICE: { Screen: MultipleChoiceGame, hintKey: 'practice.hint.MULTIPLE_CHOICE' },
}
