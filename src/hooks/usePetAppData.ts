import { useCallback, useMemo, useState } from 'react';
import { useDidShow } from '@tarojs/taro';
import { PetAppState } from '@/types/pet';
import {
  addCareLog,
  addExpense,
  addRecord,
  addReminder,
  getPetAppState,
  setActivePet,
  toggleReminderEnabled,
} from '@/utils/petData';

const sortByCreatedAt = <T extends { createdAt: number }>(list: T[]) => {
  return [...list].sort((a, b) => b.createdAt - a.createdAt);
};

const FALLBACK_PET = {
  id: 'pet-fallback',
  name: '宠物',
  gender: 'male' as const,
  birthday: '2025-01-01',
  weightKg: 0,
  species: '未知品种',
  tags: [],
  avatarEmoji: '🐾',
};

export const usePetAppData = () => {
  const [state, setState] = useState<PetAppState>(() => getPetAppState());

  const refresh = useCallback(() => {
    setState(getPetAppState());
  }, []);

  useDidShow(() => {
    refresh();
  });

  const activePet = useMemo(() => {
    if (!Array.isArray(state.pets) || state.pets.length === 0) {
      return FALLBACK_PET;
    }
    return state.pets.find((item) => item.id === state.activePetId) ?? state.pets[0] ?? FALLBACK_PET;
  }, [state.activePetId, state.pets]);

  const changeActivePet = useCallback((petId: string) => {
    const next = setActivePet(petId);
    setState(next);
  }, []);

  const createReminder = useCallback(
    (payload: Parameters<typeof addReminder>[0]) => {
      addReminder(payload);
      refresh();
    },
    [refresh]
  );

  const createRecord = useCallback(
    (payload: Parameters<typeof addRecord>[0]) => {
      addRecord(payload);
      refresh();
    },
    [refresh]
  );

  const createExpense = useCallback(
    (payload: Parameters<typeof addExpense>[0]) => {
      addExpense(payload);
      refresh();
    },
    [refresh]
  );

  const createCareLog = useCallback(
    (payload: Parameters<typeof addCareLog>[0]) => {
      addCareLog(payload);
      refresh();
    },
    [refresh]
  );

  const switchReminder = useCallback((id: string) => {
    const next = toggleReminderEnabled(id);
    setState(next);
  }, []);

  return {
    state,
    activePet,
    reminders: sortByCreatedAt(Array.isArray(state.reminders) ? state.reminders : []),
    records: sortByCreatedAt(Array.isArray(state.records) ? state.records : []),
    expenses: sortByCreatedAt(Array.isArray(state.expenses) ? state.expenses : []),
    careLogs: sortByCreatedAt(Array.isArray(state.careLogs) ? state.careLogs : []),
    refresh,
    changeActivePet,
    createReminder,
    createRecord,
    createExpense,
    createCareLog,
    switchReminder,
  };
};
