import { View, Text } from '@tarojs/components';
import { memo } from 'react';

const PetDetail = memo(function PetDetail() {
  return (
    <View className="pet-detail flex-1 bg-yellow-50">
      <View className="px-4 py-4 border-b border-gray-200 bg-white shadow-sm flex items-center">
        <View className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center mr-4">
          <Text className="text-base text-gray-600">←</Text>
        </View>
        <Text className="text-lg font-bold flex-1 text-gray-800">宠物详情</Text>
        <View className="w-9 h-9 rounded-full bg-yellow-200 flex items-center justify-center">
          <Text className="text-base">✏️</Text>
        </View>
      </View>

      <View className="p-5">
        <View className="bg-white rounded-2xl p-6 mb-5 shadow-md flex flex-col items-center">
          <View className="w-30 h-30 rounded-full bg-yellow-50 flex items-center justify-center mb-5 shadow-sm">
            <Text className="text-6xl">🐱</Text>
          </View>
          <View className="flex items-center mb-3">
            <Text className="text-3xl font-bold mr-3 text-gray-800">火火</Text>
            <Text className="text-2xl text-red-500">♂</Text>
          </View>
          <Text className="text-base text-gray-600 mb-5">6个月 | 5kg</Text>
          <View className="flex gap-2.5 flex-wrap justify-center">
            {['运动', '可爱', '粘人'].map((tag, index) => (
              <View key={index} className="px-4 py-2 bg-yellow-200 rounded-full shadow-sm">
                <Text className="text-sm text-gray-600 font-medium">{tag}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className="bg-white rounded-2xl p-5 mb-5 shadow-sm">
          <Text className="text-lg font-bold mb-5 block text-gray-800">基本信息</Text>
          <View className="flex justify-between mb-4">
            <View className="flex-1">
              <Text className="text-sm text-gray-400 mb-1.5 block">品种</Text>
              <Text className="text-base font-semibold text-gray-800">英短</Text>
            </View>
            <View className="flex-1">
              <Text className="text-sm text-gray-400 mb-1.5 block">生日</Text>
              <Text className="text-base font-semibold text-gray-800">2024-02-15</Text>
            </View>
          </View>
          <View className="flex justify-between">
            <View className="flex-1">
              <Text className="text-sm text-gray-400 mb-1.5 block">体重</Text>
              <Text className="text-base font-semibold text-gray-800">5kg</Text>
            </View>
            <View className="flex-1">
              <Text className="text-sm text-gray-400 mb-1.5 block">性别</Text>
              <Text className="text-base font-semibold text-red-500">公</Text>
            </View>
          </View>
        </View>

        <View className="flex gap-3.5 mb-5">
          <View className="flex-1 h-13 rounded-full bg-yellow-400 flex items-center justify-center shadow-md">
            <Text className="text-lg font-bold text-white">编辑</Text>
          </View>
          <View className="flex-1 h-13 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center">
            <Text className="text-lg font-bold text-gray-600">删除</Text>
          </View>
        </View>

        <View className="flex justify-center mb-5">
          <View className="w-25 h-25 rounded-full bg-gray-200 flex items-center justify-center opacity-40">
            <Text className="text-5xl">🐱</Text>
          </View>
        </View>
      </View>
    </View>
  );
});

export default PetDetail;