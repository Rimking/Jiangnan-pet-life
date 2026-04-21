export interface Pet {
  id: string;
  name: string;
  avatar: string;
  birthday: string;
  breed: string;
  gender: 'male' | 'female';
  weight: number;
  adoptionDate: string;
}

export interface Schedule {
  id: string;
  petId: string;
  title: string;
  date: string;
  time: string;
  isCompleted: boolean;
  icon: string;
}

export interface ExpenseRecordItem {
  id: string;
  petId: string;
  item: string;
  amount: number;
  category: string;
  date: string;
}

export interface CareRecordItem {
  id: string;
  petId: string;
  content: string;
  status: string;
  date: string;
}

export interface DailyRecordItem {
  id: string;
  petId: string;
  content: string;
  date: string;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  isUnlocked: boolean;
}

export const mockUser = {
  id: 'u1',
  name: '宠物主人',
  avatar: '😀',
  petYears: 2,
};

export const mockPets: Pet[] = [
  {
    id: 'p1',
    name: '火火',
    avatar: '🐱',
    birthday: '2024-02-15',
    breed: '英短',
    gender: 'female',
    weight: 5,
    adoptionDate: '2024-03-01',
  },
  {
    id: 'p2',
    name: '土豆',
    avatar: '🐶',
    birthday: '2023-01-12',
    breed: '柯基',
    gender: 'male',
    weight: 12,
    adoptionDate: '2023-03-20',
  },
];

const today = new Date().toISOString().split('T')[0];

export const mockSchedules: Schedule[] = [
  {
    id: 's1',
    petId: 'p1',
    title: '早餐喂食',
    date: today,
    time: '08:30',
    isCompleted: false,
    icon: '🍽️',
  },
  {
    id: 's2',
    petId: 'p1',
    title: '梳毛护理',
    date: today,
    time: '20:00',
    isCompleted: true,
    icon: '🧼',
  },
];

export const mockExpenseRecords: ExpenseRecordItem[] = [
  { id: 'e1', petId: 'p1', item: '猫粮', amount: 128, category: '食品', date: today },
  { id: 'e2', petId: 'p1', item: '驱虫药', amount: 59, category: '医疗', date: today },
];

export const mockCareRecords: CareRecordItem[] = [
  { id: 'c1', petId: 'p1', content: '体检', status: '正常', date: today },
  { id: 'c2', petId: 'p1', content: '梳毛', status: '完成', date: today },
];

export const mockDailyRecords: DailyRecordItem[] = [
  { id: 'd1', petId: 'p1', content: '今天精神很好，食欲正常。', date: today },
];

export const mockBadges: Badge[] = [
  { id: 'b1', name: '连续打卡', icon: '🏅', isUnlocked: true },
  { id: 'b2', name: '护理达人', icon: '✨', isUnlocked: true },
  { id: 'b3', name: '知识新星', icon: '📘', isUnlocked: false },
];
