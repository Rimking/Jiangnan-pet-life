export type ReminderType = 'daily' | 'care' | 'health' | 'behavior';

export interface PetProfileModel {
  id: string;
  name: string;
  gender: 'male' | 'female';
  birthday: string;
  weightKg: number;
  species: string;
  tags: string[];
  avatarEmoji: string;
}

export interface PetReminderModel {
  id: string;
  petId: string;
  title: string;
  type: ReminderType;
  date: string;
  time: string;
  repeat: string;
  enabled: boolean;
  createdAt: number;
}

export interface PetRecordModel {
  id: string;
  petId: string;
  category: string;
  value: string;
  note: string;
  date: string;
  time: string;
  createdAt: number;
}

export interface PetExpenseModel {
  id: string;
  petId: string;
  category: string;
  amount: number;
  note: string;
  date: string;
  time: string;
  createdAt: number;
}

export interface PetCareLogModel {
  id: string;
  petId: string;
  careType: string;
  result: string;
  note: string;
  date: string;
  time: string;
  nextDate?: string;
  createdAt: number;
}

export interface ScheduleRecordItem {
  id: string;
  sourceId: string;
  sourceType: 'record' | 'expense' | 'care';
  category: string;
  value: string;
  note: string;
  time: string;
  createdAt: number;
}

export interface PetAppState {
  pets: PetProfileModel[];
  activePetId: string;
  reminders: PetReminderModel[];
  records: PetRecordModel[];
  expenses: PetExpenseModel[];
  careLogs: PetCareLogModel[];
}
