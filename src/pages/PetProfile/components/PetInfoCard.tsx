import { View, Text } from '@tarojs/components';
import { memo } from 'react';
import { PET_UI, PET_UI_SHADOW, PET_UI_BORDER, PET_UI_RADIUS, PET_UI_TEXT } from '@/constants/petUi';
import { PetProfileModel } from '@/types/pet';

interface Props {
  pet: PetProfileModel;
  onOpenDetail: () => void;
}

const PetInfoCard = memo(function PetInfoCard({ pet, onOpenDetail }: Props) {
  return (
    <View className="w-full px-[28rpx]">
      <View
        className="px-[20rpx] py-[22rpx] border-solid"
        style={{
          border: PET_UI_BORDER.strong,
          borderRadius: PET_UI_RADIUS.lg,
          backgroundColor: PET_UI.panelBackground,
          boxShadow: PET_UI_SHADOW,
        }}
      >
        <View
          className="w-[92rpx] h-[16rpx] mb-[14rpx] m-auto border-solid bg-[#f46a6a]"
          style={{ border: PET_UI_BORDER.regular, borderRadius: PET_UI_RADIUS.pill }}
        />

        <View className="flex items-center">
          <View
            className="w-[176rpx] h-[176rpx] mr-[20rpx] border-solid flex items-center justify-center bg-white"
            style={{
              border: PET_UI_BORDER.strong,
              borderRadius: PET_UI_RADIUS.sm,
              transform: 'rotate(-8deg)',
            }}
          >
            <Text style={{ fontSize: PET_UI_TEXT.heading }}>{pet.avatarEmoji}</Text>
          </View>

          <View className="flex-1 relative">
            <View
              className="absolute -top-[14rpx] right-0 min-w-[94rpx] px-[14rpx] h-[42rpx] flex items-center justify-center bg-black"
              style={{ borderRadius: PET_UI_RADIUS.pill }}
              onClick={onOpenDetail}
            >
              <Text className="text-white" style={{ fontSize: PET_UI_TEXT.body }}>
                详情
              </Text>
            </View>

            <View className="flex items-center mb-2">
              <Text className="font-bold mr-[8rpx]" style={{ fontSize: '42rpx' }}>
                {pet.name}
              </Text>
              <Text className="text-[#f46a6a]" style={{ fontSize: '32rpx' }}>
                {pet.gender === 'male' ? '♂' : '♀'}
              </Text>
            </View>
            <Text className="text-[#666] mb-[10rpx] block" style={{ fontSize: PET_UI_TEXT.heading }}>
              {pet.birthday} | {pet.weightKg}kg
            </Text>

            <View className="flex flex-wrap gap-[8rpx]">
              {pet.tags.map((tag) => (
                <View
                  key={tag}
                  className="px-[12rpx] py-[4rpx] bg-[#ffe082]"
                  style={{ borderRadius: PET_UI_RADIUS.pill }}
                >
                  <Text className="text-[#6b6b6b]" style={{ fontSize: PET_UI_TEXT.body }}>
                    {tag}
                  </Text>
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
