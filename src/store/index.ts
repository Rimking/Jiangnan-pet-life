import { atom } from 'jotai';
import Taro from '@tarojs/taro';
import {
  mockPets,
  mockSchedules,
  mockUser,
  mockExpenseRecords,
  mockCareRecords,
  mockDailyRecords,
  type Pet,
  type Schedule,
  type ExpenseRecordItem,
  type CareRecordItem,
  type DailyRecordItem,
} from '@/constants/mockData';

const STORAGE_KEYS = {
  pets: 'cy_pet_pets',
  schedules: 'cy_pet_schedules',
  currentPetId: 'cy_pet_current_pet_id',
  expenseRecords: 'cy_pet_expense_records',
  careRecords: 'cy_pet_care_records',
  dailyRecords: 'cy_pet_daily_records',
} as const;

function safeGetStorage<T>(key: string, fallback: T): T {
  try {
    const value = Taro.getStorageSync(key);
    if (value === '' || value === undefined || value === null) return fallback;
    return value as T;
  } catch {
    return fallback;
  }
}

function safeSetStorage<T>(key: string, value: T) {
  try {
    Taro.setStorageSync(key, value);
  } catch {
    // Keep in-memory data when storage API is unavailable.
  }
}

const persistedPets = safeGetStorage<Pet[]>(STORAGE_KEYS.pets, mockPets);
const persistedSchedules = safeGetStorage<Schedule[]>(STORAGE_KEYS.schedules, mockSchedules);
const persistedExpenseRecords = safeGetStorage<ExpenseRecordItem[]>(
  STORAGE_KEYS.expenseRecords,
  mockExpenseRecords,
);
const persistedCareRecords = safeGetStorage<CareRecordItem[]>(
  STORAGE_KEYS.careRecords,
  mockCareRecords,
);
const persistedDailyRecords = safeGetStorage<DailyRecordItem[]>(
  STORAGE_KEYS.dailyRecords,
  mockDailyRecords,
);
const persistedCurrentPetId = safeGetStorage<string | null>(
  STORAGE_KEYS.currentPetId,
  persistedPets[0]?.id ?? null,
);

export const userAtom = atom(mockUser);
export const petsAtom = atom<Pet[]>(persistedPets);
export const currentPetAtom = atom<Pet | null>(
  persistedPets.find((item) => item.id === persistedCurrentPetId) ?? persistedPets[0] ?? null,
);
export const schedulesAtom = atom<Schedule[]>(persistedSchedules);
export const expenseRecordsAtom = atom<ExpenseRecordItem[]>(persistedExpenseRecords);
export const careRecordsAtom = atom<CareRecordItem[]>(persistedCareRecords);
export const dailyRecordsAtom = atom<DailyRecordItem[]>(persistedDailyRecords);

export const setCurrentPetAtom = atom(null, (get, set, petId: string) => {
  const list = get(petsAtom);
  const found = list.find((item) => item.id === petId);
  if (!found) return;

  set(currentPetAtom, found);
  safeSetStorage(STORAGE_KEYS.currentPetId, found.id);
});

export const addPetAtom = atom(null, (get, set, payload: Omit<Pet, 'id' | 'adoptionDate'>) => {
  const now = new Date().toISOString();
  const pet: Pet = {
    ...payload,
    id: `p_${Date.now()}`,
    adoptionDate: now,
  };

  const nextPets = [pet, ...get(petsAtom)];
  set(petsAtom, nextPets);
  set(currentPetAtom, pet);

  safeSetStorage(STORAGE_KEYS.pets, nextPets);
  safeSetStorage(STORAGE_KEYS.currentPetId, pet.id);
});

export const addScheduleAtom = atom(
  null,
  (get, set, payload: Omit<Schedule, 'id' | 'isCompleted'>) => {
    const schedule: Schedule = {
      ...payload,
      id: `s_${Date.now()}`,
      isCompleted: false,
    };

    const nextSchedules = [schedule, ...get(schedulesAtom)];
    set(schedulesAtom, nextSchedules);
    safeSetStorage(STORAGE_KEYS.schedules, nextSchedules);
  },
);

export const completeScheduleAtom = atom(null, (get, set, scheduleId: string) => {
  const next = get(schedulesAtom).map((item) =>
    item.id === scheduleId ? { ...item, isCompleted: true } : item,
  );
  set(schedulesAtom, next);
  safeSetStorage(STORAGE_KEYS.schedules, next);
});

export const addExpenseRecordAtom = atom(
  null,
  (get, set, payload: Omit<ExpenseRecordItem, 'id' | 'date'> & { date?: string }) => {
    const record: ExpenseRecordItem = {
      ...payload,
      id: `e_${Date.now()}`,
      date: payload.date ?? new Date().toISOString().split('T')[0],
    };

    const next = [record, ...get(expenseRecordsAtom)];
    set(expenseRecordsAtom, next);
    safeSetStorage(STORAGE_KEYS.expenseRecords, next);
  },
);

export const addCareRecordAtom = atom(
  null,
  (get, set, payload: Omit<CareRecordItem, 'id' | 'date'> & { date?: string }) => {
    const record: CareRecordItem = {
      ...payload,
      id: `c_${Date.now()}`,
      date: payload.date ?? new Date().toISOString().split('T')[0],
    };

    const next = [record, ...get(careRecordsAtom)];
    set(careRecordsAtom, next);
    safeSetStorage(STORAGE_KEYS.careRecords, next);
  },
);

export const addDailyRecordAtom = atom(
  null,
  (get, set, payload: Omit<DailyRecordItem, 'id' | 'date'> & { date?: string }) => {
    const record: DailyRecordItem = {
      ...payload,
      id: `d_${Date.now()}`,
      date: payload.date ?? new Date().toISOString().split('T')[0],
    };

    const next = [record, ...get(dailyRecordsAtom)];
    set(dailyRecordsAtom, next);
    safeSetStorage(STORAGE_KEYS.dailyRecords, next);
  },
);
