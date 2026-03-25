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
    <View className="pet-card bg-white rounded-2xl p-4 shadow-md mb-3">
      <View className="flex items-center">
        <View className="w-16 h-16 rounded-full bg-yellow-50 flex items-center justify-center mr-4 shadow-sm">
          <Text className="text-4xl">{avatar}</Text>
        </View>
        <View className="flex-1">
          <View className="flex items-center mb-2">
            <Text className="text-lg font-bold mr-2 text-gray-800">{name}</Text>
            <Text
              className={`text-base ${gender === '♂' ? 'text-red-500' : 'text-pink-500'}`}
            >
              {gender}
            </Text>
          </View>
          <View className="flex gap-2">
            <Text className="text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded-lg">
              {type}
            </Text>
            <Text className="text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded-lg">
              {age}
            </Text>
            <Text className="text-sm text-gray-600 bg-gray-50 px-2 py-1 rounded-lg">
              {weight}
            </Text>
          </View>
        </View>
        <View className="w-8 h-8 rounded-full bg-yellow-200 flex items-center justify-center">
          <Text className="text-base">→</Text>
        </View>
      </View>
    </View>
  );
});

export default PetCard;
