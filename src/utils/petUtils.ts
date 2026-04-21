export function formatPetAge(birthday: string): string {
  const birth = new Date(birthday);
  if (Number.isNaN(birth.getTime())) return '未知年龄';

  const now = new Date();
  const monthDiff =
    (now.getFullYear() - birth.getFullYear()) * 12 +
    (now.getMonth() - birth.getMonth());

  if (monthDiff < 12) return `${Math.max(monthDiff, 0)}个月`;
  const years = Math.floor(monthDiff / 12);
  const months = monthDiff % 12;
  return months ? `${years}岁${months}个月` : `${years}岁`;
}

export function getCompanionDays(adoptionDate: string): number {
  const start = new Date(adoptionDate);
  if (Number.isNaN(start.getTime())) return 0;
  const now = new Date();
  return Math.max(Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)), 0);
}
