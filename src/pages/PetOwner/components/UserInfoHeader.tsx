import { View, Text } from '@tarojs/components';
import { memo } from 'react';

interface UserInfoHeaderProps {
  ownerName: string;
  signature: string;
  totalPets: number;
  activePetName: string;
  reminderCount: number;
  onEditProfile?: () => void;
}

const UserInfoHeader = memo(function UserInfoHeader({
  ownerName,
  signature,
  totalPets,
  activePetName,
  reminderCount,
  onEditProfile,
}: UserInfoHeaderProps) {
  return (
    <View
      className="py-[30rpx] px-[28rpx] bg-white border-[3rpx] border-[#262626] rounded-[28rpx]"
      style={{ boxShadow: '0 12rpx 0 rgba(0,0,0,0.18)' }}
      onClick={onEditProfile}
    >
      <View className="flex items-center">
        <View className="w-[112rpx] h-[112rpx] rounded-full border-[3rpx] border-[#262626] bg-[#FFE68D] flex items-center justify-center mr-[20rpx]">
          <Text className="text-[56rpx]">😺</Text>
        </View>

        <View className="flex-1">
          <Text className="text-[34rpx] font-bold text-[#1f1f1f] block">{ownerName}</Text>
          <Text className="text-[24rpx] text-[#6b6b6b] mt-[8rpx] block">{signature}</Text>
        </View>

        <View className="px-[18rpx] py-[10rpx] rounded-[16rpx] bg-[#FFF6CE] border-[2rpx] border-[#262626]">
          <Text className="text-[22rpx] text-[#4a4a4a]">编辑</Text>
        </View>
      </View>

      <View className="mt-[22rpx] flex flex-wrap gap-[12rpx]">
        <View className="px-[14rpx] py-[10rpx] rounded-[14rpx] bg-[#F7F7F7] border-[2rpx] border-[#262626]">
          <Text className="text-[22rpx] text-[#525252]">宠物 {totalPets} 只</Text>
        </View>
        <View className="px-[14rpx] py-[10rpx] rounded-[14rpx] bg-[#F7F7F7] border-[2rpx] border-[#262626]">
          <Text className="text-[22rpx] text-[#525252]">当前：{activePetName}</Text>
        </View>
        <View className="px-[14rpx] py-[10rpx] rounded-[14rpx] bg-[#FFEEE8] border-[2rpx] border-[#262626]">
          <Text className="text-[22rpx] text-[#9a4335]">待提醒 {reminderCount} 条</Text>
        </View>
      </View>
    </View>
  );
});

export default UserInfoHeader;
