import { View, Text } from '@tarojs/components';
import { memo } from 'react';
import Taro from '@tarojs/taro';
import { useAtom } from 'jotai';
import { currentPetAtom, petsAtom } from '@/store';
import { formatPetAge } from '@/utils/petUtils';

const PetSwitchCard = memo(function PetSwitchCard() {
  const [pets] = useAtom(petsAtom);
  const [currentPet] = useAtom(currentPetAtom);

  return (
    <View
      className="mx-8 mb-4 p-4 bg-white rounded-2xl shadow-sm"
      onClick={() => Taro.navigateTo({ url: '/pages/PetList/index' })}
    >
      <Text className="text-[28rpx] font-bold">当前宠物</Text>
      {currentPet ? (
        <View className="mt-2 flex flex-row justify-between items-center">
          <View>
            <Text className="text-[28rpx]">{currentPet.avatar} {currentPet.name}</Text>
            <Text className="text-[24rpx] text-gray-500 mt-1">
              {currentPet.breed} · {formatPetAge(currentPet.birthday)} · {currentPet.weight}kg
            </Text>
          </View>
          <Text className="text-[22rpx] text-blue-500">切换 ({pets.length})</Text>
        </View>
      ) : (
        <Text className="text-[24rpx] text-gray-500 mt-2">暂无宠物，点击去添加</Text>
      )}
    </View>
  );
});

export default PetSwitchCard;
