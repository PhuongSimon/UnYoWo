import { Injectable } from '@nestjs/common';

/** Wraps Math.random so tests can make question order and options predictable. */
@Injectable()
export class Random {
  next(): number {
    return Math.random();
  }
}

/** Fisher–Yates shuffle; returns a new array. */
export function shuffle<T>(items: readonly T[], random: Random): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random.next() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
