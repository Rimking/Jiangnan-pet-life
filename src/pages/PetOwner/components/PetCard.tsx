import { View, Text } from '@tarojs/components';
import { memo, useState } from 'react';

interface PetCardProps {
  name: string;
  type: string;
  age: string;
  weight: string;
  gender: 'male' | 'female';
  avatar: string;
  isActive?: boolean;
  onOpenDetail?: () => void;
  onSetActive?: () => void;
}

const PetCard = memo(function PetCard({
  name,
  type,
  age,
  weight,
  gender,
  avatar,
  isActive = false,
  onOpenDetail,
  onSetActive,
}: PetCardProps) {
  const [pressed, setPressed] = useState(false);
  const genderLabel = gender === 'male' ? '♂' : '♀';

  return (
    <View
      className="bg-white rounded-[24rpx] p-[24rpx] mb-[18rpx] border-[3rpx]"
      style={{
        borderColor: isActive ? '#FF8F3D' : '#262626',
        boxShadow: pressed ? '0 4rpx 0 rgba(0,0,0,0.2)' : '0 10rpx 0 rgba(0,0,0,0.18)',
        transform: pressed ? 'translateY(6rpx)' : 'translateY(0)',
        transition: 'all .15s ease',
      }}
      onClick={onOpenDetail}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      onTouchCancel={() => setPressed(false)}
    >
      <View className="flex items-center">
        <View className="w-[96rpx] h-[96rpx] rounded-full flex items-center justify-center mr-[20rpx] border-[2rpx] border-[#262626] bg-[#FFF6CE]">
          <Text className="text-[52rpx]">{avatar}</Text>
        </View>

        <View className="flex-1">
          <View className="flex items-center mb-[10rpx]">
            <Text className="text-[30rpx] font-bold mr-[10rpx] text-[#1f1f1f]">{name}</Text>
            <Text className="text-[28rpx]" style={{ color: gender === 'male' ? '#5B7FFF' : '#FF699B' }}>
              {genderLabel}
            </Text>
            {isActive ? (
              <View className="ml-[12rpx] px-[10rpx] py-[4rpx] rounded-[12rpx] bg-[#FFEEE8] border border-[#FF8F3D]">
                <Text className="text-[18rpx] text-[#d16c1c]">当前</Text>
              </View>
            ) : null}
          </View>

          <View className="flex flex-wrap gap-[10rpx]">
            <Text className="text-[22rpx] text-[#5e5e5e] bg-[#f5f5f5] py-[6rpx] px-[12rpx] rounded-[12rpx]">{type}</Text>
            <Text className="text-[22rpx] text-[#5e5e5e] bg-[#f5f5f5] py-[6rpx] px-[12rpx] rounded-[12rpx]">{age}</Text>
            <Text className="text-[22rpx] text-[#5e5e5e] bg-[#f5f5f5] py-[6rpx] px-[12rpx] rounded-[12rpx]">{weight}</Text>
          </View>
        </View>

        <View
          className="ml-[12rpx] w-[68rpx] h-[68rpx] rounded-full bg-[#FFE082] border-[2rpx] border-[#262626] flex items-center justify-center"
          onClick={(event) => {
            event.stopPropagation();
            onSetActive?.();
          }}
        >
          <Text className="text-[22rpx] text-[#4a4a4a]">切换</Text>
        </View>
      </View>
    </View>
  );
});

export default PetCard;
