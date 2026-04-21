import BasicLayout from '@/layout/basicLayout';
import { View, Text } from '@tarojs/components';
import { memo, useMemo } from 'react';
import { useAtom } from 'jotai';
import {
  petsAtom,
  schedulesAtom,
  expenseRecordsAtom,
  careRecordsAtom,
  dailyRecordsAtom,
  currentPetAtom,
} from '@/store';

const DataStatistics = memo(function DataStatistics() {
  const [pets] = useAtom(petsAtom);
  const [currentPet] = useAtom(currentPetAtom);
  const [schedules] = useAtom(schedulesAtom);
  const [expenseRecords] = useAtom(expenseRecordsAtom);
  const [careRecords] = useAtom(careRecordsAtom);
  const [dailyRecords] = useAtom(dailyRecordsAtom);

  const currentPetId = currentPet?.id;

  const completedSchedules = useMemo(
    () => schedules.filter((s) => s.isCompleted && (!currentPetId || s.petId === currentPetId)).length,
    [schedules, currentPetId],
  );

  const filteredExpenses = useMemo(
    () => expenseRecords.filter((e) => !currentPetId || e.petId === currentPetId),
    [expenseRecords, currentPetId],
  );

  const expenseTotal = useMemo(
    () => filteredExpenses.reduce((sum, row) => sum + row.amount, 0),
    [filteredExpenses],
  );

  const careCount = useMemo(
    () => careRecords.filter((r) => !currentPetId || r.petId === currentPetId).length,
    [careRecords, currentPetId],
  );

  const dailyCount = useMemo(
    () => dailyRecords.filter((r) => !currentPetId || r.petId === currentPetId).length,
    [dailyRecords, currentPetId],
  );

  return (
    <BasicLayout navOptions={{ navTitle: '数据统计', needBack: true }}>
      <View className="px-8 pt-28 pb-10 flex flex-col gap-4">
        <View className="bg-white rounded-2xl p-6 shadow-sm">
          <Text className="text-[30rpx] font-bold">概览</Text>
          <Text className="mt-2 text-[24rpx] text-gray-500">当前宠物：{currentPet?.name ?? '全部宠物'}</Text>
          <Text className="mt-2">宠物数量：{pets.length}</Text>
          <Text className="mt-1">已完成提醒：{completedSchedules}</Text>
          <Text className="mt-1">花销总额：¥{expenseTotal.toFixed(2)}</Text>
          <Text className="mt-1">护理记录数：{careCount}</Text>
          <Text className="mt-1">日常记录数：{dailyCount}</Text>
        </View>
      </View>
    </BasicLayout>
  );
});

export default DataStatistics;
