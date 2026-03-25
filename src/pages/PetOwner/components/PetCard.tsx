import { View, Text } from '@tarojs/components';
import { memo } from 'react';

interface PetCardProps {
  name: string;
  type: string;
  age: string;
  weight: string;
  gender: string;
  avatar: string;
}

const PetCard = memo(function PetCard({
  name,
  type,
  age,
  weight,
  gender,
  avatar,
}: PetCardProps) {
  return (
    <View
      className="pet-card bg-white rounded-[32rpx] p-[32rpx] mb-[24rpx]"
      style={{ boxShadow: '0 4rpx 16rpx rgba(0,0,0,0.08)' }}
    >
      <View className="flex items-center">
        <View
          className="w-[128rpx] h-[128rpx] rounded-full flex items-center justify-center mr-[32rpx]"
          style={{
            backgroundColor: '#FFF9E6',
            boxShadow: '0 4rpx 12rpx rgba(255, 249, 230, 0.5)',
          }}
        >
          <Text className="text-[64rpx]">{avatar}</Text>
        </View>
        <View className="flex-1">
          <View className="flex items-center mb-[16rpx]">
            <Text className="text-[36rpx] font-bold mr-[16rpx] text-gray-800">{name}</Text>
            <Text
              className="text-[32rpx]"
              style={{ color: gender === '♂' ? '#FF6B6B' : '#FF69B4' }}
            >
              {gender}
            </Text>
          </View>
          <View className="flex gap-[16rpx]">
            <Text className="text-[26rpx] text-gray-600 bg-gray-100 py-[8rpx] px-[16rpx] rounded-[16rpx]">
              {type}
            </Text>
            <Text className="text-[26rpx] text-gray-600 bg-gray-100 py-[8rpx] px-[16rpx] rounded-[16rpx]">
              {age}
            </Text>
            <Text className="text-[26rpx] text-gray-600 bg-gray-100 py-[8rpx] px-[16rpx] rounded-[16rpx]">
              {weight}
            </Text>
          </View>
        </View>
        <View className="w-[64rpx] h-[64rpx] rounded-full bg-yellow-300 flex items-center justify-center">
          <Text className="text-[28rpx]">→</Text>
        </View>
      </View>
    </View>
  );
});

export default PetCard;
