import { View, Text } from '@tarojs/components';
import { memo, useMemo } from 'react';
import { useAtom } from 'jotai';
import { currentPetAtom, schedulesAtom } from '@/store';

const TodayTodo = memo(function TodayTodo() {
  const [currentPet] = useAtom(currentPetAtom);
  const [schedules] = useAtom(schedulesAtom);

  const rows = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return schedules
      .filter((item) => item.date === today && !item.isCompleted && (!currentPet || item.petId === currentPet.id))
      .sort((a, b) => a.time.localeCompare(b.time));
  }, [schedules, currentPet]);

  return (
    <View className="mx-8 mb-8 p-4 bg-white rounded-2xl shadow-sm">
      <Text className="text-[28rpx] font-bold">今日待办</Text>
      {rows.length === 0 ? (
        <Text className="text-[24rpx] text-gray-500 mt-2">今天暂无待办</Text>
      ) : (
        rows.slice(0, 4).map((item) => (
          <View key={item.id} className="mt-2 flex flex-row justify-between items-center">
            <Text className="text-[24rpx]">{item.icon} {item.title}</Text>
            <Text className="text-[22rpx] text-gray-500">{item.time}</Text>
          </View>
        ))
      )}
    </View>
  );
});

export default TodayTodo;
