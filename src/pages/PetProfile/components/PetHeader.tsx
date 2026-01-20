import { View, Text } from '@tarojs/components';
import { memo } from 'react';

const PetHeader = memo(function PetHeader() {
  return (
    <View className="pet-header px-[48px] py-4 flex justify-between items-start">
      <View>
        <Text className="text-[36px] font-bold mb-1 block">Hi rimKing</Text>
        <Text className="text-[28px] text-gray-600">Good Morning!</Text>
      </View>
    </View>
  );
});

export default PetHeader;