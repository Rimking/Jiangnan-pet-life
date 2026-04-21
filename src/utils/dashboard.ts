import type { ExpenseRecordItem, Schedule } from '@/constants/mockData';

export function getTodayPendingCount(
  schedules: Schedule[],
  currentPetId?: string | null,
  today = new Date().toISOString().split('T')[0],
): number {
  return schedules.filter(
    (s) => s.date === today && !s.isCompleted && (!currentPetId || s.petId === currentPetId),
  ).length;
}

export function getExpenseTotal(
  records: ExpenseRecordItem[],
  currentPetId?: string | null,
): number {
  return records
    .filter((r) => !currentPetId || r.petId === currentPetId)
    .reduce((sum, r) => sum + r.amount, 0);
}
