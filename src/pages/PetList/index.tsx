import BasicLayout from '@/layout/basicLayout';
import { View, Text } from '@tarojs/components';
import { memo } from 'react';
import Taro from '@tarojs/taro';
import { useAtom } from 'jotai';
import { petsAtom, currentPetAtom, setCurrentPetAtom } from '@/store';

const PetList = memo(function PetList() {
  const [pets] = useAtom(petsAtom);
  const [currentPet] = useAtom(currentPetAtom);
  const [, setCurrentPet] = useAtom(setCurrentPetAtom);

  return (
    <BasicLayout navOptions={{ navTitle: '我的宠物', needBack: true }}>
      <View className="px-8 pt-28 pb-10 flex flex-col gap-4">
        {pets.map((pet) => {
          const active = currentPet?.id === pet.id;
          return (
            <View key={pet.id} className="bg-white rounded-2xl p-5 shadow-sm" onClick={() => setCurrentPet(pet.id)}>
              <View className="flex flex-row items-center justify-between">
                <View>
                  <Text className="text-[30rpx] font-bold">{pet.avatar} {pet.name}</Text>
                  <Text className="text-[24rpx] text-gray-500 mt-1">{pet.breed} · {pet.weight}kg · {pet.birthday}</Text>
                </View>
                {active && <Text className="text-[22rpx] text-blue-500">当前</Text>}
              </View>
            </View>
          );
        })}

        <View className="bg-blue-500 rounded-xl p-3 mt-2" onClick={() => Taro.navigateTo({ url: '/pages/AddPet/index' })}>
          <Text className="text-white text-center">添加新宠物</Text>
        </View>
      </View>
    </BasicLayout>
  );
});

export default PetList;
