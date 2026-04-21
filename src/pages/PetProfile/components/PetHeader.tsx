import { View, Text } from '@tarojs/components';
import { memo } from 'react';

const PetHeader = memo(function PetHeader() {
  return (
    <View className="px-[36px] py-4 flex justify-between items-start">
      <View>
        <Text className="text-[40px] font-bold mb-1 block">Hi rimKing</Text>
        <Text className="text-[28px] text-[#6b6b6b]">Good Morning!</Text>
      </View>
    </View>
  );
});

export default PetHeader;
