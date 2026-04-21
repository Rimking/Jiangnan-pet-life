import { View, Text } from '@tarojs/components';
import { memo } from 'react';
import { PET_UI, PET_UI_SHADOW } from '@/constants/petUi';
import { PetProfileModel } from '@/types/pet';

interface Props {
  pet: PetProfileModel;
  onOpenDetail: () => void;
}

const PetInfoCard = memo(function PetInfoCard({ pet, onOpenDetail }: Props) {
  return (
    <View className="w-full px-[36px]">
      <View
        className="px-[20px] py-[24px] rounded-[20px] border-[4px] border-solid"
        style={{
          borderColor: PET_UI.cardBorderColor,
          backgroundColor: PET_UI.panelBackground,
          boxShadow: PET_UI_SHADOW,
        }}
      >
        <View className="w-[100px] h-[18px] rounded-[10px] mb-[18px] m-auto border-[2px] border-solid border-[#262626] bg-[#f46a6a]" />

        <View className="flex items-center">
          <View
            className="w-[210px] h-[210px] mr-8 rounded-[14px] border-[4px] border-solid border-[#262626] flex items-center justify-center bg-white"
            style={{ transform: 'rotate(-8deg)' }}
          >
            <Text className="text-[32px]">{pet.avatarEmoji}</Text>
          </View>

          <View className="flex-1 relative">
            <View
              className="absolute -top-[20px] right-0 min-w-[100px] px-3 h-[48px] flex items-center justify-center bg-black rounded-[20px]"
              onClick={onOpenDetail}
            >
              <Text className="text-white text-[24px]">详情</Text>
            </View>

            <View className="flex items-center mb-2">
              <Text className="text-[46px] font-bold mr-[8px]">{pet.name}</Text>
              <Text className="text-[36px] text-[#f46a6a]">{pet.gender === 'male' ? '♂' : '♀'}</Text>
            </View>
            <Text className="text-[32px] text-[#666] mb-3 block">{pet.birthday} | {pet.weightKg}kg</Text>

            <View className="flex flex-wrap gap-[8px]">
              {pet.tags.map((tag) => (
                <View key={tag} className="px-[14px] py-[6px] rounded-[18px] bg-[#ffe082]">
                  <Text className="text-[24px] text-[#6b6b6b]">{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
});

export default PetInfoCard;
