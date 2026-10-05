import type { GameSession } from './types'

/** Where a game goes back to: the practice tab of its language. */
export const practiceHome = (session: GameSession) => `/app/${session.language}/practice`
