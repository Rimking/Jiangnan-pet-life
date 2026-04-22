import { View, Text } from '@tarojs/components';
import { memo } from 'react';
import { PetProfileModel } from '@/types/pet';

interface PetDetailProps {
  pet: PetProfileModel;
  isActive: boolean;
  stats: {
    reminderCount: number;
    recordCount: number;
    expenseCount: number;
    careCount: number;
  };
  onBack: () => void;
  onSetActive: () => void;
}

const PetDetail = memo(function PetDetail({ pet, isActive, stats, onBack, onSetActive }: PetDetailProps) {
  const genderLabel = pet.gender === 'male' ? '公' : '母';

  return (
    <View className="flex-1 p-[24rpx] pb-[40rpx]">
      <View className="bg-white rounded-[24rpx] border-[3rpx] border-[#262626] p-[20rpx] flex items-center justify-between" style={{ boxShadow: '0 10rpx 0 rgba(0,0,0,0.18)' }}>
        <View
          className="w-[68rpx] h-[68rpx] rounded-full bg-[#F4F4F4] border-[2rpx] border-[#262626] flex items-center justify-center"
          onClick={onBack}
        >
          <Text className="text-[30rpx]">‹</Text>
        </View>
        <Text className="text-[32rpx] font-bold text-[#1f1f1f]">宠物详情</Text>
        <View
          className="px-[14rpx] py-[8rpx] rounded-[14rpx] border-[2rpx] border-[#262626]"
          style={{ backgroundColor: isActive ? '#FFEEE8' : '#F4F4F4' }}
          onClick={onSetActive}
        >
          <Text className="text-[22rpx] text-[#3f3f3f]">{isActive ? '当前宠物' : '设为当前'}</Text>
        </View>
      </View>

      <View className="mt-[20rpx] bg-white rounded-[24rpx] border-[3rpx] border-[#262626] p-[24rpx]" style={{ boxShadow: '0 10rpx 0 rgba(0,0,0,0.18)' }}>
        <View className="flex items-center">
          <View className="w-[120rpx] h-[120rpx] rounded-full bg-[#FFF6CE] border-[3rpx] border-[#262626] flex items-center justify-center mr-[18rpx]">
            <Text className="text-[66rpx]">{pet.avatarEmoji}</Text>
          </View>
          <View className="flex-1">
            <Text className="text-[34rpx] font-bold text-[#1f1f1f]">{pet.name}</Text>
            <Text className="text-[24rpx] text-[#6b6b6b] mt-[6rpx]">{pet.species} · {pet.weightKg}kg · {genderLabel}</Text>
            <Text className="text-[24rpx] text-[#6b6b6b] mt-[4rpx]">生日：{pet.birthday}</Text>
          </View>
        </View>

        <View className="mt-[20rpx] flex flex-wrap gap-[10rpx]">
          {pet.tags.map((tag) => (
            <View key={tag} className="px-[12rpx] py-[8rpx] rounded-[12rpx] bg-[#F7F7F7] border-[2rpx] border-[#262626]">
              <Text className="text-[22rpx] text-[#505050]">{tag}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className="mt-[20rpx] bg-white rounded-[24rpx] border-[3rpx] border-[#262626] p-[24rpx]" style={{ boxShadow: '0 10rpx 0 rgba(0,0,0,0.18)' }}>
        <Text className="text-[28rpx] font-semibold text-[#1f1f1f] mb-[18rpx] block">近期数据</Text>
        <View className="grid grid-cols-2 gap-[12rpx]">
          <View className="rounded-[16rpx] bg-[#FFF6CE] p-[16rpx] border-[2rpx] border-[#262626]">
            <Text className="text-[22rpx] text-[#666]">提醒</Text>
            <Text className="text-[34rpx] font-bold text-[#1f1f1f]">{stats.reminderCount}</Text>
          </View>
          <View className="rounded-[16rpx] bg-[#EAF8FF] p-[16rpx] border-[2rpx] border-[#262626]">
            <Text className="text-[22rpx] text-[#666]">记录</Text>
            <Text className="text-[34rpx] font-bold text-[#1f1f1f]">{stats.recordCount}</Text>
          </View>
          <View className="rounded-[16rpx] bg-[#FFEFEF] p-[16rpx] border-[2rpx] border-[#262626]">
            <Text className="text-[22rpx] text-[#666]">花销</Text>
            <Text className="text-[34rpx] font-bold text-[#1f1f1f]">{stats.expenseCount}</Text>
          </View>
          <View className="rounded-[16rpx] bg-[#F0F3FF] p-[16rpx] border-[2rpx] border-[#262626]">
            <Text className="text-[22rpx] text-[#666]">护理</Text>
            <Text className="text-[34rpx] font-bold text-[#1f1f1f]">{stats.careCount}</Text>
          </View>
        </View>
      </View>
    </View>
  );
});

export default PetDetail;
