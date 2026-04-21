import BasicLayout from '@/layout/basicLayout';
import { View, Text } from '@tarojs/components';
import { memo } from 'react';
import { useAtom } from 'jotai';
import { petsAtom } from '@/store';

const PhotoAlbum = memo(function PhotoAlbum() {
  const [pets] = useAtom(petsAtom);

  return (
    <BasicLayout navOptions={{ navTitle: '成长相册', needBack: true }}>
      <View className="px-8 pt-28 pb-10 grid grid-cols-2 gap-3">
        {pets.map((pet) => (
          <View key={pet.id} className="bg-white rounded-2xl p-4 shadow-sm">
            <Text className="text-[38rpx]">{pet.avatar}</Text>
            <Text className="mt-2 font-bold">{pet.name}</Text>
            <Text className="text-[24rpx] text-gray-500">{pet.breed}</Text>
          </View>
        ))}
      </View>
    </BasicLayout>
  );
});

export default PhotoAlbum;
