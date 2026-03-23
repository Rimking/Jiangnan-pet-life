import { View, Text } from '@tarojs/components';
import { memo } from 'react';

const PetDetail = memo(function PetDetail() {
  return (
    <View className="pet-detail flex-1" style={{ backgroundColor: '#FFFCE0' }}>
      <View className="p-[32rpx] border-b border-gray-300 flex items-center bg-white" style={{ borderBottomWidth: '2rpx', boxShadow: '0 4rpx 12rpx rgba(0,0,0,0.05)' }}>
        <View className="w-[72rpx] h-[72rpx] rounded-full bg-gray-300 flex items-center justify-center mr-[32rpx]">
          <Text className="text-[32rpx] text-gray-600">←</Text>
        </View>
        <Text className="text-[36rpx] font-bold flex-1 text-gray-800">宠物详情</Text>
        <View className="w-[72rpx] h-[72rpx] rounded-full bg-yellow-300 flex items-center justify-center">
          <Text className="text-[32rpx]">✏️</Text>
        </View>
      </View>

      <View className="p-[40rpx]">
        <View className="bg-white rounded-[40rpx] p-[48rpx] mb-[40rpx] flex flex-col items-center" style={{ boxShadow: '0 8rpx 24rpx rgba(0,0,0,0.08)' }}>
          <View className="w-[240rpx] h-[240rpx] rounded-full flex items-center justify-center mb-[40rpx]" style={{ backgroundColor: '#FFF9E6', boxShadow: '0 8rpx 24rpx rgba(255, 249, 230, 0.4)' }}>
            <Text className="text-[112rpx]">🐱</Text>
          </View>
          <View className="flex items-center mb-[24rpx]">
            <Text className="text-[56rpx] font-bold mr-[24rpx] text-gray-800">火火</Text>
            <Text className="text-[40rpx]" style={{ color: '#FF6B6B' }}>♂</Text>
          </View>
          <Text className="text-[30rpx] text-gray-600 mb-[40rpx]">6个月 | 5kg</Text>
          <View className="flex gap-[20rpx] flex-wrap justify-center">
            {['运动', '可爱', '粘人'].map((tag, index) => (
              <View key={index} className="py-[16rpx] px-[32rpx] bg-yellow-300 rounded-[32rpx]" style={{ boxShadow: '0 4rpx 8rpx rgba(255, 224, 130, 0.2)' }}>
                <Text className="text-[26rpx] text-gray-600 font-medium">{tag}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className="bg-white rounded-[32rpx] p-[40rpx] mb-[40rpx]" style={{ boxShadow: '0 4rpx 16rpx rgba(0,0,0,0.06)' }}>
          <Text className="text-[34rpx] font-bold mb-[40rpx] block text-gray-800">基本信息</Text>
          <View className="flex justify-between mb-[32rpx]">
            <View className="flex-1">
              <Text className="text-[26rpx] text-gray-500 mb-[12rpx] block">品种</Text>
              <Text className="text-[30rpx] font-semibold text-gray-800">英短</Text>
            </View>
            <View className="flex-1">
              <Text className="text-[26rpx] text-gray-500 mb-[12rpx] block">生日</Text>
              <Text className="text-[30rpx] font-semibold text-gray-800">2024-02-15</Text>
            </View>
          </View>
          <View className="flex justify-between">
            <View className="flex-1">
              <Text className="text-[26rpx] text-gray-500 mb-[12rpx] block">体重</Text>
              <Text className="text-[30rpx] font-semibold text-gray-800">5kg</Text>
            </View>
            <View className="flex-1">
              <Text className="text-[26rpx] text-gray-500 mb-[12rpx] block">性别</Text>
              <Text className="text-[30rpx] font-semibold" style={{ color: '#FF6B6B' }}>公</Text>
            </View>
          </View>
        </View>

        <View className="flex gap-[28rpx] mb-[40rpx]">
          <View className="flex-1 h-[104rpx] rounded-[52rpx] bg-yellow-400 flex items-center justify-center" style={{ boxShadow: '0 8rpx 24rpx rgba(255, 215, 0, 0.4)' }}>
            <Text className="text-[34rpx] font-bold text-white">编辑</Text>
          </View>
          <View className="flex-1 h-[104rpx] rounded-[52rpx] bg-white border-[4rpx] border-gray-300 flex items-center justify-center">
            <Text className="text-[34rpx] font-bold text-gray-600">删除</Text>
          </View>
        </View>

        <View className="flex justify-center mb-[40rpx]">
          <View className="w-[200rpx] h-[200rpx] rounded-full bg-gray-300 flex items-center justify-center opacity-40">
            <Text className="text-[96rpx]">🐱</Text>
          </View>
        </View>
      </View>
    </View>
  );
});

export default PetDetail;