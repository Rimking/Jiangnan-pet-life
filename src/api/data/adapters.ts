import { CareRecordItem } from './care';
import { ExpenseItem } from './expense';
import { PetItem } from './pet';
import { RecordItem } from './record';
import { ScheduleItem } from './schedule';
import {
  PetCareLogModel,
  PetExpenseModel,
  PetProfileModel,
  PetRecordModel,
  PetReminderModel,
  ReminderType,
} from '@/types/pet';

const pad = (value: number) => `${value}`.padStart(2, '0');

const toDate = (value?: string) => {
  if (!value) {
    return null;
  }
  const target = new Date(value);
  return Number.isNaN(target.getTime()) ? null : target;
};

export const formatDateKey = (value?: string) => {
  const target = toDate(value);
  if (!target) {
    return '';
  }
  return `${target.getFullYear()}-${pad(target.getMonth() + 1)}-${pad(target.getDate())}`;
};

export const formatTimeKey = (value?: string) => {
  const target = toDate(value);
  if (!target) {
    return '';
  }
  return `${pad(target.getHours())}:${pad(target.getMinutes())}`;
};

export const toIsoDateTime = (date: string, time: string) => {
  if (!date || !time) {
    return '';
  }
  const target = new Date(`${date}T${time}:00`);
  if (Number.isNaN(target.getTime())) {
    return '';
  }
  return target.toISOString();
};

const pickAvatarEmoji = (type?: string) => {
  if (type === 'dog') {
    return '🐶';
  }
  if (type === 'bird') {
    return '🐦';
  }
  if (type === 'rabbit') {
    return '🐰';
  }
  return '🐱';
};

const mapPetTypeLabel = (type?: string, breed?: string) => {
  return breed || type || '未知品种';
};

export const mapPetToProfileModel = (pet: PetItem): PetProfileModel => {
  const tags = [
    pet.type ? `类型:${pet.type}` : '',
    pet.color || '',
    pet.sterilized ? '已绝育' : '',
  ].filter(Boolean);

  return {
    id: pet.id,
    name: pet.name,
    gender: pet.gender === 'female' ? 'female' : 'male',
    birthday: pet.birthday || '',
    weightKg: Number(pet.weight || 0),
    species: mapPetTypeLabel(pet.type, pet.breed),
    tags,
    avatarEmoji: pickAvatarEmoji(pet.type),
  };
};

const scheduleTypeMap: Record<string, ReminderType> = {
  daily: 'daily',
  care: 'care',
  health: 'health',
  behavior: 'behavior',
};

export const mapScheduleToReminderModel = (schedule: ScheduleItem): PetReminderModel => {
  return {
    id: schedule.id,
    petId: schedule.petId,
    title: schedule.title,
    type: scheduleTypeMap[schedule.category] || 'daily',
    date: formatDateKey(schedule.remindAt),
    time: formatTimeKey(schedule.remindAt),
    repeat: schedule.repeatRule || '单次',
    enabled: schedule.status !== 'done',
    createdAt: new Date(schedule.createdAt).getTime(),
  };
};

export const mapExpenseToExpenseModel = (expense: ExpenseItem): PetExpenseModel => {
  return {
    id: expense.id,
    petId: expense.petId,
    category: expense.category,
    amount: Number(expense.amount || 0),
    note: expense.notes || expense.merchant || '',
    date: formatDateKey(expense.spentAt),
    time: formatTimeKey(expense.spentAt),
    createdAt: new Date(expense.createdAt).getTime(),
  };
};

export const mapRecordToRecordModel = (record: RecordItem): PetRecordModel => {
  return {
    id: record.id,
    petId: record.petId,
    category: record.category,
    value: record.value || '',
    note: record.notes || '',
    date: formatDateKey(record.recordedAt),
    time: formatTimeKey(record.recordedAt),
    createdAt: new Date(record.createdAt).getTime(),
  };
};

export const mapCareRecordToCareLogModel = (
  careRecord: CareRecordItem
): PetCareLogModel => {
  return {
    id: careRecord.id,
    petId: careRecord.petId,
    careType: careRecord.category,
    result: careRecord.result || '已完成',
    note: careRecord.notes || careRecord.doctorAdvice || '',
    date: formatDateKey(careRecord.occurredAt),
    time: formatTimeKey(careRecord.occurredAt),
    nextDate: formatDateKey(careRecord.nextReminderAt),
    createdAt: new Date(careRecord.createdAt).getTime(),
  };
};
