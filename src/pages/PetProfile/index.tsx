import BasicLayout from '@/layout/basicLayout';
import { View, Text } from '@tarojs/components';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import Taro, { useDidShow } from '@tarojs/taro';
import { PET_UI, PET_UI_BORDER, PET_UI_RADIUS, PET_UI_TEXT } from '@/constants/petUi';
import { formatLocalDateKey } from '@/utils/formatDate';
import PetHeader from './components/PetHeader';
import PetInfoCard from './components/PetInfoCard';
import FunctionGrid from './components/FunctionGrid';
import DailyTip from './components/DailyTip';
import ExpenseInsight from './components/ExpenseInsight';
import {
  getCareRecordListData,
  getExpenseListData,
  getRecordListData,
  getScheduleListData,
  mapCareRecordToCareLogModel,
  mapExpenseToExpenseModel,
  mapRecordToRecordModel,
  mapScheduleToReminderModel,
} from '@/api/data';
import { usePetApiPets } from '@/hooks/usePetApiPets';
import { PetCareLogModel, PetExpenseModel, PetRecordModel, PetReminderModel } from '@/types/pet';

const PetProfile = memo(function PetProfile() {
  const { pets, activePet, activePetId, loading, error, setActivePetId } = usePetApiPets();
  const [reminders, setReminders] = useState<PetReminderModel[]>([]);
  const [expenses, setExpenses] = useState<PetExpenseModel[]>([]);
  const [careLogs, setCareLogs] = useState<PetCareLogModel[]>([]);
  const [records, setRecords] = useState<PetRecordModel[]>([]);

  const today = formatLocalDateKey(new Date());
  const monthPrefix = today.slice(0, 7);

  const refreshProfileData = useCallback(async () => {
    if (!activePetId) {
      setReminders([]);
      setExpenses([]);
      setCareLogs([]);
      setRecords([]);
      return;
    }

    try {
      const [scheduleList, expenseList, careRecordList, recordList] = await Promise.all([
        getScheduleListData({ petId: activePetId }),
        getExpenseListData({ petId: activePetId }),
        getCareRecordListData({ petId: activePetId }),
        getRecordListData({ petId: activePetId }),
      ]);

      setReminders(scheduleList.map(mapScheduleToReminderModel));
      setExpenses(expenseList.map(mapExpenseToExpenseModel));
      setCareLogs(careRecordList.map(mapCareRecordToCareLogModel));
      setRecords(recordList.map(mapRecordToRecordModel));
    } catch (requestError) {
      setReminders([]);
      setExpenses([]);
      setCareLogs([]);
      setRecords([]);
    }
  }, [activePetId]);

  useEffect(() => {
    refreshProfileData();
  }, [refreshProfileData]);

  useDidShow(() => {
    refreshProfileData();
  });

  const stats = useMemo(() => {
    if (!activePet) {
      return {
        reminders: 0,
        records: 0,
        care: 0,
        monthExpense: 0,
      };
    }

    const petReminders = reminders.filter((item) => item.petId === activePet.id && item.date === today);
    const petCare = careLogs.filter((item) => item.petId === activePet.id && item.date === today);
    const petRecords = records.filter((item) => item.petId === activePet.id && item.date === today);
    const monthExpense = expenses
      .filter((item) => item.petId === activePet.id && item.date.startsWith(monthPrefix))
      .reduce((sum, item) => sum + item.amount, 0);

    return {
      reminders: petReminders.length,
      records: petRecords.length,
      care: petCare.length,
      monthExpense,
    };
  }, [activePet, careLogs, expenses, monthPrefix, records, reminders, today]);

  const expenseAnalysis = useMemo(() => {
    if (!activePet) {
      return { monthTotal: 0, categoryTop: [], weekSeries: [] as number[] };
    }

    const monthExpenseList = expenses.filter(
      (item) => item.petId === activePet.id && item.date.startsWith(monthPrefix)
    );
    const monthTotal = monthExpenseList.reduce((sum, item) => sum + item.amount, 0);

    const categoryMap = monthExpenseList.reduce<Record<string, number>>((acc, item) => {
      acc[item.category] = (acc[item.category] ?? 0) + item.amount;
      return acc;
    }, {});

    const categoryTop = Object.entries(categoryMap)
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 3);

    const weekSeries = Array.from({ length: 7 }).map((_, index) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - index));
      const dateKey = formatLocalDateKey(date);
      return expenses
        .filter((item) => item.petId === activePet.id && item.date === dateKey)
        .reduce((sum, item) => sum + item.amount, 0);
    });

    return { monthTotal, categoryTop, weekSeries };
  }, [activePet, expenses, monthPrefix]);

  return (
    <BasicLayout
      wrapClassName="w-full h-full"
      wrapStyle={{
        backgroundImage: PET_UI.pageBackground,
        minHeight: '100vh',
      }}
    >
      <View className="pt-[44rpx] pb-[170rpx]">
        <PetHeader />

        {error ? (
          <View className="px-[28rpx] mb-[12rpx]">
            <Text className="text-[#d65a31]" style={{ fontSize: PET_UI_TEXT.body }}>
              {error}
            </Text>
          </View>
        ) : null}

        <View className="px-[28rpx] flex gap-[12rpx] mb-[16rpx]">
          {pets.map((pet) => {
            const active = pet.id === activePet?.id;
            return (
              <View
                key={pet.id}
                className="px-4 py-2 border-solid"
                style={{
                  border: PET_UI_BORDER.regular,
                  borderRadius: PET_UI_RADIUS.pill,
                  backgroundColor: active ? '#ffd93b' : '#f6f6f6',
                }}
                onClick={() => setActivePetId(pet.id)}
              >
                <Text style={{ fontSize: PET_UI_TEXT.body }}>{pet.name}</Text>
              </View>
            );
          })}
        </View>

        {!activePet && !loading ? (
          <View className="px-[28rpx]">
            <Text style={{ fontSize: PET_UI_TEXT.body }}>暂无宠物档案</Text>
          </View>
        ) : null}

        {activePet ? (
          <>
            <PetInfoCard
              pet={activePet}
              onOpenDetail={() =>
                Taro.navigateTo({ url: `/pages/PetDetailPage/index?petId=${activePet.id}` })
              }
            />
            <FunctionGrid
              petName={activePet.name}
              stats={stats}
              onOpenSchedule={() => Taro.switchTab({ url: '/pages/PetSchedule/index' })}
              onOpenCare={() =>
                Taro.navigateTo({ url: `/pages/PetCareStats/index?petId=${activePet.id}` })
              }
              onAddReminder={() =>
                Taro.navigateTo({
                  url: `/pages/AddPetReminder/index?petId=${activePet.id}&date=${today}`,
                })
              }
              onAddRecord={() =>
                Taro.navigateTo({
                  url: `/pages/AddPetRecord/index?petId=${activePet.id}&date=${today}&mode=record`,
                })
              }
            />
            <ExpenseInsight
              monthTotal={expenseAnalysis.monthTotal}
              categoryTop={expenseAnalysis.categoryTop}
              weekSeries={expenseAnalysis.weekSeries}
              onOpenDetail={() =>
                Taro.navigateTo({ url: `/pages/PetExpenseStats/index?petId=${activePet.id}` })
              }
            />
          </>
        ) : null}

        <DailyTip />
      </View>
    </BasicLayout>
  );
});

export default PetProfile;
