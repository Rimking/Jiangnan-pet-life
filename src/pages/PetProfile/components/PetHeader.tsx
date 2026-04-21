import { View, Text } from '@tarojs/components';
import { memo } from 'react';
import { useAtom } from 'jotai';
import { schedulesAtom, currentPetAtom } from '@/store';
import { typography } from '@/styles/theme';

const PetHeader = memo(function PetHeader() {
  const [currentPet] = useAtom(currentPetAtom);
  const [schedules] = useAtom(schedulesAtom);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? '早上好' : hour < 18 ? '下午好' : '晚上好';

  const today = new Date().toISOString().split('T')[0];
  const todayPending = schedules.filter(
    (s) => s.date === today && !s.isCompleted && (!currentPet || s.petId === currentPet.id),
  ).length;

  return (
    <View className="pet-header px-8 py-6 flex justify-between items-center">
      <View>
        <Text className="flex items-center">
          <Text className="text-2xl mr-2">📍</Text>
          <Text style={{ fontSize: typography.fontSize.md, color: '#8C8C8C' }}>
            {greeting}，{currentPet?.name ?? '宠主'}
          </Text>
        </Text>
      </View>
      <View className="flex items-center">
        <View className="relative">
          <Text className="text-3xl">🔔</Text>
          {todayPending > 0 && (
            <View className="absolute -top-1 -right-1 min-w-[30rpx] h-[30rpx] px-1 bg-red-500 rounded-full flex items-center justify-center">
              <Text className="text-white text-[18rpx]">{todayPending}</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
});

export default PetHeader;
