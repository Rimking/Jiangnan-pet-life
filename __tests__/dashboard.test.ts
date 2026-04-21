import { getExpenseTotal, getTodayPendingCount } from '../src/utils/dashboard';
import type { ExpenseRecordItem, Schedule } from '../src/constants/mockData';

describe('dashboard selectors', () => {
  test('getTodayPendingCount counts only pending items for selected pet', () => {
    const schedules: Schedule[] = [
      { id: '1', petId: 'p1', title: 'A', date: '2026-04-21', time: '09:00', isCompleted: false, icon: '⏰' },
      { id: '2', petId: 'p1', title: 'B', date: '2026-04-21', time: '10:00', isCompleted: true, icon: '⏰' },
      { id: '3', petId: 'p2', title: 'C', date: '2026-04-21', time: '11:00', isCompleted: false, icon: '⏰' },
      { id: '4', petId: 'p1', title: 'D', date: '2026-04-20', time: '12:00', isCompleted: false, icon: '⏰' },
    ];

    expect(getTodayPendingCount(schedules, 'p1', '2026-04-21')).toBe(1);
    expect(getTodayPendingCount(schedules, 'p2', '2026-04-21')).toBe(1);
    expect(getTodayPendingCount(schedules, null, '2026-04-21')).toBe(2);
  });

  test('getExpenseTotal switches correctly by current pet', () => {
    const expenses: ExpenseRecordItem[] = [
      { id: 'e1', petId: 'p1', item: '猫粮', amount: 100, category: '食品', date: '2026-04-21' },
      { id: 'e2', petId: 'p1', item: '护理', amount: 50, category: '护理', date: '2026-04-21' },
      { id: 'e3', petId: 'p2', item: '驱虫', amount: 80, category: '医疗', date: '2026-04-21' },
    ];

    expect(getExpenseTotal(expenses, 'p1')).toBe(150);
    expect(getExpenseTotal(expenses, 'p2')).toBe(80);
    expect(getExpenseTotal(expenses, null)).toBe(230);
  });
});
