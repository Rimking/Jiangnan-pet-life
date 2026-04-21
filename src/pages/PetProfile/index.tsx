import BasicLayout from '@/layout/basicLayout';
import { View, Text } from '@tarojs/components';
import { memo, useMemo } from 'react';
import Taro from '@tarojs/taro';
import { PET_UI } from '@/constants/petUi';
import { usePetAppData } from '@/hooks/usePetAppData';
import PetHeader from './components/PetHeader';
import PetInfoCard from './components/PetInfoCard';
import FunctionGrid from './components/FunctionGrid';
import DailyTip from './components/DailyTip';
import ExpenseInsight from './components/ExpenseInsight';

const PetProfile = memo(function PetProfile() {
  const { state, activePet, reminders, records, expenses, careLogs, changeActivePet } = usePetAppData();

  const today = new Date().toISOString().slice(0, 10);
  const monthPrefix = today.slice(0, 7);

  const stats = useMemo(() => {
    const petReminders = reminders.filter((item) => item.petId === activePet.id && item.date === today);
    const petRecords = records.filter((item) => item.petId === activePet.id && item.date === today);
    const petCare = careLogs.filter((item) => item.petId === activePet.id && item.date === today);
    const monthExpense = expenses
      .filter((item) => item.petId === activePet.id && item.date.startsWith(monthPrefix))
      .reduce((sum, item) => sum + item.amount, 0);

    return {
      reminders: petReminders.length,
      records: petRecords.length,
      care: petCare.length,
      monthExpense,
    };
  }, [activePet.id, careLogs, expenses, monthPrefix, records, reminders, today]);

  const expenseAnalysis = useMemo(() => {
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
      const dateKey = date.toISOString().slice(0, 10);
      return expenses
        .filter((item) => item.petId === activePet.id && item.date === dateKey)
        .reduce((sum, item) => sum + item.amount, 0);
    });

    return { monthTotal, categoryTop, weekSeries };
  }, [activePet.id, expenses, monthPrefix]);

  return (
    <BasicLayout
      wrapClassName="w-full h-full"
      wrapStyle={{
        backgroundImage: PET_UI.pageBackground,
        minHeight: '100vh',
      }}
    >
      <View className="pt-[60px] pb-[170px]">
        <PetHeader />

        <View className="px-[36px] flex gap-2 mb-3">
          {state.pets.map((pet) => {
            const active = pet.id === activePet.id;
            return (
              <View
                key={pet.id}
                className="px-4 py-2 rounded-[20px] border-[2px] border-solid border-[#262626]"
                style={{ backgroundColor: active ? '#ffd93b' : '#f6f6f6' }}
                onClick={() => changeActivePet(pet.id)}
              >
                <Text className="text-[26px]">{pet.name}</Text>
              </View>
            );
          })}
        </View>

        <PetInfoCard pet={activePet} onOpenDetail={() => Taro.navigateTo({ url: '/pages/PetDetailPage/index' })} />
        <FunctionGrid
          petName={activePet.name}
          stats={stats}
          onOpenSchedule={() => Taro.switchTab({ url: '/pages/PetSchedule/index' })}
          onOpenCare={() =>
            Taro.navigateTo({ url: `/pages/PetCareStats/index?petId=${activePet.id}` })
          }
          onAddReminder={() =>
            Taro.navigateTo({ url: `/pages/AddPetReminder/index?petId=${activePet.id}&date=${today}` })
          }
          onAddRecord={() =>
            Taro.navigateTo({ url: `/pages/AddPetRecord/index?petId=${activePet.id}&date=${today}&mode=record` })
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
        <DailyTip />
      </View>
    </BasicLayout>
  );
});

export default PetProfile;
