import { View, Text } from '@tarojs/components';
import { memo } from 'react';

const UserInfoHeader = memo(function UserInfoHeader() {
  return (
    <View className="user-info-header p-5 bg-white rounded-2xl shadow-md">
      <View className="flex items-center mb-5">
        <View className="w-18 h-18 rounded-full bg-yellow-200 flex items-center justify-center mr-4 shadow-sm">
          <Text className="text-5xl">👤</Text>
        </View>
        <View className="flex-1">
          <Text className="text-2xl font-bold mb-1.5 block text-gray-800">Shasha</Text>
          <Text className="text-base text-gray-400 bg-yellow-50 px-3 py-1 rounded-xl inline-block">
            铲屎官
          </Text>
        </View>
        <View className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center">
          <Text className="text-lg">✏️</Text>
        </View>
      </View>
      <View className="flex gap-3 bg-gray-50 rounded-xl p-4">
        <View className="flex-1 text-center">
          <Text className="text-4xl font-bold mb-1.5 block text-gray-800">2</Text>
          <Text className="text-sm text-gray-600">宠物</Text>
        </View>
        <View className="w-0.5 bg-gray-200" />
        <View className="flex-1 text-center">
          <Text className="text-4xl font-bold mb-1.5 block text-gray-800">15</Text>
          <Text className="text-sm text-gray-600">天数</Text>
        </View>
        <View className="w-0.5 bg-gray-200" />
        <View className="flex-1 text-center">
          <Text className="text-4xl font-bold mb-1.5 block text-gray-800">8</Text>
          <Text className="text-sm text-gray-600">记录</Text>
        </View>
      </View>
    </View>
  );
});

export default UserInfoHeader;
