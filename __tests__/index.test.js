import { formatLocalDateKey } from '../src/utils/formatDate';

describe('formatLocalDateKey', () => {
  test('formats local date with zero padding', () => {
    const date = new Date(2026, 3, 2, 8, 30, 0);
    expect(formatLocalDateKey(date)).toBe('2026-04-02');
  });

  test('does not use UTC day when local time is midnight', () => {
    const date = new Date(2026, 3, 22, 0, 15, 0);
    expect(formatLocalDateKey(date)).toBe('2026-04-22');
  });
});
