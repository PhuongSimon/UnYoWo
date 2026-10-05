import type { ComponentType } from 'react'
import type { QuestionState } from '../engine/game-reducer'
import type { GameController } from '../engine/useGameSession'
import type { GameType } from '../types'
import FlashcardGame from './FlashcardGame'
import MultipleChoiceGame from './MultipleChoiceGame'
import TypingGame from './TypingGame'

export interface GameScreenProps {
  state: QuestionState
  game: GameController
  studyLang: string
  speechLang: string
}

/** Games played one question at a time share one engine; each only brings its own screen. */
export type SequentialGameType = Exclude<GameType, 'MATCHING'>

export const SEQUENTIAL_SCREENS: Record<SequentialGameType, { Screen: ComponentType<GameScreenProps>; hintKey: string }> = {
  FLASHCARD: { Screen: FlashcardGame, hintKey: 'practice.hint.FLASHCARD' },
  MULTIPLE_CHOICE: { Screen: MultipleChoiceGame, hintKey: 'practice.hint.MULTIPLE_CHOICE' },
  TYPING: { Screen: TypingGame, hintKey: 'practice.hint.TYPING' },
}
