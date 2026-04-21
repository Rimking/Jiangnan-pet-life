import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { memo, useMemo } from 'react';
import { useAtom } from 'jotai';
import { careRecordsAtom, currentPetAtom, expenseRecordsAtom, schedulesAtom } from '@/store';

const QuickEntry = memo(function QuickEntry() {
  const [currentPet] = useAtom(currentPetAtom);
  const [expenses] = useAtom(expenseRecordsAtom);
  const [cares] = useAtom(careRecordsAtom);
  const [schedules] = useAtom(schedulesAtom);

  const currentPetId = currentPet?.id;

  const expenseCount = useMemo(
    () => expenses.filter((item) => !currentPetId || item.petId === currentPetId).length,
    [expenses, currentPetId],
  );
  const careCount = useMemo(
    () => cares.filter((item) => !currentPetId || item.petId === currentPetId).length,
    [cares, currentPetId],
  );
  const todoCount = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return schedules.filter(
      (item) => item.date === today && !item.isCompleted && (!currentPetId || item.petId === currentPetId),
    ).length;
  }, [schedules, currentPetId]);

  const items = [
    { title: '花销记录', url: '/pages/ExpenseRecord/index', count: expenseCount },
    { title: '护理记录', url: '/pages/CareRecord/index', count: careCount },
    { title: '今日日程', url: '/pages/PetSchedule/index', count: todoCount },
    { title: '年龄换算', url: '/pages/AgeCalculator/index', count: null as number | null },
  ];

  return (
    <View className="mx-8 mb-4 p-4 bg-white rounded-2xl shadow-sm">
      <Text className="text-[28rpx] font-bold">快捷入口</Text>
      <View className="grid grid-cols-2 gap-3 mt-3">
        {items.map((item) => (
          <View
            key={item.url}
            className="p-3 bg-gray-50 rounded-xl"
            onClick={() => Taro.navigateTo({ url: item.url })}
          >
            <Text className="text-[24rpx]">{item.title}</Text>
            {item.count !== null && (
              <Text className="text-[20rpx] text-gray-500 mt-1">{item.count} 条</Text>
            )}
          </View>
        ))}
      </View>
    </View>
  );
});

export default QuickEntry;
