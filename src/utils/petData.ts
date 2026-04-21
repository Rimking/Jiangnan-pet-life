import Taro from '@tarojs/taro';
import {
  PetAppState,
  PetCareLogModel,
  PetExpenseModel,
  PetRecordModel,
  PetReminderModel,
  ReminderType,
} from '@/types/pet';

const PET_APP_STORAGE_KEY = 'PET_APP_STORAGE_V1';

const DEFAULT_PET = {
  id: 'pet-fire',
  name: '火火',
  gender: 'male' as const,
  birthday: '2025-10-21',
  weightKg: 5,
  species: '英短',
  tags: ['活泼', '亲人', '黏人'],
  avatarEmoji: '🐱',
};

const DEFAULT_STATE: PetAppState = {
  pets: [
    DEFAULT_PET,
    {
      id: 'pet-sugar',
      name: '奶糖',
      gender: 'female',
      birthday: '2024-08-01',
      weightKg: 3.8,
      species: '布偶',
      tags: ['温顺', '爱睡觉'],
      avatarEmoji: '🐱',
    },
  ],
  activePetId: 'pet-fire',
  reminders: [
    {
      id: 'rem-1',
      petId: 'pet-fire',
      title: '给火火称重',
      type: 'health',
      date: '2026-04-21',
      time: '08:00',
      repeat: '每天',
      enabled: true,
      createdAt: Date.now() - 1000,
    },
  ],
  records: [
    {
      id: 'rec-1',
      petId: 'pet-fire',
      category: '喝水',
      value: '300ml',
      note: '上午补水',
      date: '2026-04-21',
      time: '09:00',
      createdAt: Date.now() - 500,
    },
  ],
  expenses: [
    {
      id: 'exp-1',
      petId: 'pet-fire',
      category: '猫粮',
      amount: 89,
      note: '3kg 试吃装',
      date: '2026-04-21',
      time: '12:30',
      createdAt: Date.now() - 450,
    },
  ],
  careLogs: [
    {
      id: 'care-1',
      petId: 'pet-fire',
      careType: '驱虫',
      result: '已完成',
      note: '外驱滴剂',
      date: '2026-04-21',
      time: '15:00',
      nextDate: '2026-05-21',
      createdAt: Date.now() - 400,
    },
  ],
};

const cloneDefaultState = (): PetAppState => JSON.parse(JSON.stringify(DEFAULT_STATE));

const normalizePet = (pet: any, index: number) => {
  const fallbackId = `pet-${index + 1}`;
  return {
    id: typeof pet?.id === 'string' && pet.id ? pet.id : fallbackId,
    name: typeof pet?.name === 'string' && pet.name ? pet.name : `宠物${index + 1}`,
    gender: pet?.gender === 'female' ? 'female' : 'male',
    birthday: typeof pet?.birthday === 'string' && pet.birthday ? pet.birthday : '2025-01-01',
    weightKg: Number.isFinite(Number(pet?.weightKg)) ? Number(pet.weightKg) : 0,
    species: typeof pet?.species === 'string' && pet.species ? pet.species : '未知品种',
    tags: Array.isArray(pet?.tags) ? pet.tags.filter(Boolean) : [],
    avatarEmoji: typeof pet?.avatarEmoji === 'string' && pet.avatarEmoji ? pet.avatarEmoji : '🐾',
  };
};

const normalizeReminder = (item: any, index: number, petId: string): PetReminderModel => {
  const safeType =
    item?.type === 'daily' || item?.type === 'care' || item?.type === 'health' || item?.type === 'behavior'
      ? item.type
      : 'daily';

  const safeDate =
    typeof item?.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(item.date)
      ? item.date
      : '2026-01-01';

  const safeTime =
    typeof item?.time === 'string' && /^\d{2}:\d{2}$/.test(item.time)
      ? item.time
      : '09:00';

  return {
    id: typeof item?.id === 'string' && item.id ? item.id : `rem-safe-${index + 1}`,
    petId: typeof item?.petId === 'string' && item.petId ? item.petId : petId,
    title: typeof item?.title === 'string' && item.title ? item.title : '未命名提醒',
    type: safeType,
    date: safeDate,
    time: safeTime,
    repeat: typeof item?.repeat === 'string' && item.repeat ? item.repeat : '单次',
    enabled: typeof item?.enabled === 'boolean' ? item.enabled : true,
    createdAt: Number.isFinite(Number(item?.createdAt)) ? Number(item.createdAt) : Date.now(),
  };
};

const normalizeRecord = (item: any, index: number, petId: string): PetRecordModel => {
  return {
    id: typeof item?.id === 'string' && item.id ? item.id : `rec-safe-${index + 1}`,
    petId: typeof item?.petId === 'string' && item.petId ? item.petId : petId,
    category: typeof item?.category === 'string' && item.category ? item.category : '日常',
    value: typeof item?.value === 'string' ? item.value : '',
    note: typeof item?.note === 'string' ? item.note : '',
    date:
      typeof item?.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(item.date)
        ? item.date
        : '2026-01-01',
    time:
      typeof item?.time === 'string' && /^\d{2}:\d{2}$/.test(item.time)
        ? item.time
        : '09:00',
    createdAt: Number.isFinite(Number(item?.createdAt)) ? Number(item.createdAt) : Date.now(),
  };
};

const normalizeExpense = (item: any, index: number, petId: string): PetExpenseModel => {
  return {
    id: typeof item?.id === 'string' && item.id ? item.id : `exp-safe-${index + 1}`,
    petId: typeof item?.petId === 'string' && item.petId ? item.petId : petId,
    category: typeof item?.category === 'string' && item.category ? item.category : '其他',
    amount: Number.isFinite(Number(item?.amount)) ? Number(item.amount) : 0,
    note: typeof item?.note === 'string' ? item.note : '',
    date:
      typeof item?.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(item.date)
        ? item.date
        : '2026-01-01',
    time:
      typeof item?.time === 'string' && /^\d{2}:\d{2}$/.test(item.time)
        ? item.time
        : '09:00',
    createdAt: Number.isFinite(Number(item?.createdAt)) ? Number(item.createdAt) : Date.now(),
  };
};

const normalizeCareLog = (item: any, index: number, petId: string): PetCareLogModel => {
  const safeNextDate =
    typeof item?.nextDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(item.nextDate)
      ? item.nextDate
      : undefined;

  return {
    id: typeof item?.id === 'string' && item.id ? item.id : `care-safe-${index + 1}`,
    petId: typeof item?.petId === 'string' && item.petId ? item.petId : petId,
    careType: typeof item?.careType === 'string' && item.careType ? item.careType : '护理',
    result: typeof item?.result === 'string' && item.result ? item.result : '已完成',
    note: typeof item?.note === 'string' ? item.note : '',
    date:
      typeof item?.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(item.date)
        ? item.date
        : '2026-01-01',
    time:
      typeof item?.time === 'string' && /^\d{2}:\d{2}$/.test(item.time)
        ? item.time
        : '09:00',
    nextDate: safeNextDate,
    createdAt: Number.isFinite(Number(item?.createdAt)) ? Number(item.createdAt) : Date.now(),
  };
};

export const getPetAppState = (): PetAppState => {
  const cached = Taro.getStorageSync(PET_APP_STORAGE_KEY) as PetAppState | undefined;
  if (!cached || !Array.isArray(cached.pets)) {
    const seeded = cloneDefaultState();
    Taro.setStorageSync(PET_APP_STORAGE_KEY, seeded);
    return seeded;
  }

  if (!Array.isArray(cached.pets) || cached.pets.length === 0) {
    cached.pets = cloneDefaultState().pets;
  } else {
    cached.pets = cached.pets.map((item, index) => normalizePet(item, index));
  }

  if (!Array.isArray(cached.reminders)) {
    cached.reminders = [];
  } else {
    const fallbackPetId = cached.pets[0].id;
    cached.reminders = cached.reminders.map((item, index) =>
      normalizeReminder(item, index, fallbackPetId)
    );
  }

  if (!Array.isArray(cached.records)) {
    cached.records = [];
  } else {
    const fallbackPetId = cached.pets[0].id;
    cached.records = cached.records.map((item, index) =>
      normalizeRecord(item, index, fallbackPetId)
    );
  }

  if (!Array.isArray(cached.expenses)) {
    cached.expenses = [];
  } else {
    const fallbackPetId = cached.pets[0].id;
    cached.expenses = cached.expenses.map((item, index) =>
      normalizeExpense(item, index, fallbackPetId)
    );
  }

  if (!Array.isArray(cached.careLogs)) {
    cached.careLogs = [];
  } else {
    const fallbackPetId = cached.pets[0].id;
    cached.careLogs = cached.careLogs.map((item, index) =>
      normalizeCareLog(item, index, fallbackPetId)
    );
  }

  const hasActivePet = cached.pets.some((item) => item.id === cached.activePetId);
  if (!hasActivePet) {
    cached.activePetId = cached.pets[0].id;
  }

  savePetAppState(cached);

  return cached;
};

export const savePetAppState = (state: PetAppState) => {
  Taro.setStorageSync(PET_APP_STORAGE_KEY, state);
};

export const setActivePet = (petId: string) => {
  const state = getPetAppState();
  state.activePetId = petId;
  savePetAppState(state);
  return state;
};

export const addReminder = (payload: {
  petId: string;
  title: string;
  type: ReminderType;
  date: string;
  time: string;
  repeat: string;
}) => {
  const state = getPetAppState();
  const reminder: PetReminderModel = {
    id: `rem-${Date.now()}`,
    petId: payload.petId,
    title: payload.title,
    type: payload.type,
    date: payload.date,
    time: payload.time,
    repeat: payload.repeat,
    enabled: true,
    createdAt: Date.now(),
  };
  state.reminders = [reminder, ...state.reminders];
  savePetAppState(state);
  return reminder;
};

export const toggleReminderEnabled = (id: string) => {
  const state = getPetAppState();
  state.reminders = state.reminders.map((item) =>
    item.id === id ? { ...item, enabled: !item.enabled } : item
  );
  savePetAppState(state);
  return state;
};

export const addRecord = (payload: {
  petId: string;
  category: string;
  value: string;
  note: string;
  date: string;
  time: string;
}) => {
  const state = getPetAppState();
  const record: PetRecordModel = {
    id: `rec-${Date.now()}`,
    petId: payload.petId,
    category: payload.category,
    value: payload.value,
    note: payload.note,
    date: payload.date,
    time: payload.time,
    createdAt: Date.now(),
  };
  state.records = [record, ...state.records];
  savePetAppState(state);
  return record;
};

export const addExpense = (payload: {
  petId: string;
  category: string;
  amount: number;
  note: string;
  date: string;
  time: string;
}) => {
  const state = getPetAppState();
  const expense: PetExpenseModel = {
    id: `exp-${Date.now()}`,
    petId: payload.petId,
    category: payload.category,
    amount: payload.amount,
    note: payload.note,
    date: payload.date,
    time: payload.time,
    createdAt: Date.now(),
  };
  state.expenses = [expense, ...state.expenses];
  savePetAppState(state);
  return expense;
};

export const addCareLog = (payload: {
  petId: string;
  careType: string;
  result: string;
  note: string;
  date: string;
  time: string;
  nextDate?: string;
}) => {
  const state = getPetAppState();
  const careLog: PetCareLogModel = {
    id: `care-${Date.now()}`,
    petId: payload.petId,
    careType: payload.careType,
    result: payload.result,
    note: payload.note,
    date: payload.date,
    time: payload.time,
    nextDate: payload.nextDate,
    createdAt: Date.now(),
  };
  state.careLogs = [careLog, ...state.careLogs];

  if (payload.nextDate) {
    const reminder: PetReminderModel = {
      id: `rem-${Date.now() + 1}`,
      petId: payload.petId,
      title: `${payload.careType}复查提醒`,
      type: 'care',
      date: payload.nextDate,
      time: '09:00',
      repeat: '单次',
      enabled: true,
      createdAt: Date.now() + 1,
    };
    state.reminders = [reminder, ...state.reminders];
  }

  savePetAppState(state);
  return careLog;
};
