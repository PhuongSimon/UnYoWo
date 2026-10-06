import type { PracticeItem } from '../content/entities/content.entity.js';
import type { ItemProgress } from '../progress/entities/progress.entity.js';
import { rankForPractice } from './item-selector.js';

const now = new Date('2026-10-04T10:00:00Z');
const item = (id: string, sortOrder: number) => ({ id, sortOrder }) as PracticeItem;
const progress = (itemId: string, dueInMinutes: number) =>
  ({ itemId, dueAt: new Date(now.getTime() + dueInMinutes * 60_000) }) as ItemProgress;

describe('rankForPractice', () => {
  it('orders overdue reviews first, then new items in lesson order, then the rest', () => {
    const items = [item('later', 0), item('new-2', 2), item('overdue', 3), item('very-overdue', 4), item('new-1', 1)];
    const rows = [progress('later', 60), progress('overdue', -5), progress('very-overdue', -500)];

    const ranked = rankForPractice(items, new Map(rows.map((row) => [row.itemId, row])), now);
    expect(ranked.map((i) => i.id)).toEqual(['very-overdue', 'overdue', 'new-1', 'new-2', 'later']);
  });
});
