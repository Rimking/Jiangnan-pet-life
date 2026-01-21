import { View, Text, Input } from '@tarojs/components';
import { memo } from 'react';

const AddReminder = memo(function AddReminder() {
  return (
    <View className="add-reminder" style={{ flex: 1, backgroundColor: '#FFFCE0' }}>
      <View className="p-8 border-b border-gray-200 flex items-center">
        <View className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mr-8">
          <Text className="text-2xl">←</Text>
        </View>
        <Text className="text-3xl font-bold flex-1">添加提醒</Text>
        <View className="w-16" />
      </View>

      <View className="p-8">
        <View className="mb-10">
          <Text className="text-lg font-medium mb-4 block">请输入内容</Text>
          <View className="w-full h-60 border-2 border-gray-200 rounded-xl p-6 bg-white">
            <Input className="w-full h-full text-lg" placeholder="请输入提醒内容" />
          </View>
        </View>

        <View className="mb-8">
          <Text className="text-lg font-medium mb-4 block">类型</Text>
          <View className="w-full h-22 border-2 border-gray-200 rounded-xl px-6 bg-white flex items-center justify-between">
            <Text className="text-lg">日常提醒</Text>
            <Text className="text-lg text-gray-400">→</Text>
          </View>
        </View>

        <View className="mb-8">
          <Text className="text-lg font-medium mb-4 block">时间</Text>
          <View className="w-full h-22 border-2 border-gray-200 rounded-xl px-6 bg-white flex items-center justify-between">
            <Text className="text-lg">2024年8月8日 周二 14:23</Text>
            <Text className="text-lg text-gray-400">→</Text>
          </View>
        </View>

        <View className="mb-12">
          <Text className="text-lg font-medium mb-4 block">提醒</Text>
          <View className="w-full h-22 border-2 border-gray-200 rounded-xl px-6 bg-white flex items-center justify-between">
            <Text className="text-lg">重复</Text>
            <Text className="text-lg text-gray-400">→</Text>
          </View>
        </View>

        <View className="mb-8">
          <View className="w-full h-24 rounded-3xl bg-yellow-400 flex items-center justify-center shadow-md">
            <Text className="text-2xl font-bold text-white">保存</Text>
          </View>
        </View>

        <View className="flex justify-center mb-8">
          <View className="w-40 h-40 rounded-full bg-gray-200 flex items-center justify-center opacity-50">
            <Text className="text-5xl">🐱</Text>
          </View>
        </View>
      </View>
    </View>
  );
});

export default AddReminder;
