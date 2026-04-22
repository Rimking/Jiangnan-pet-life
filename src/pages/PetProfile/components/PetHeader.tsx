import { View, Text } from '@tarojs/components';
import { memo } from 'react';
import { PET_UI_TEXT } from '@/constants/petUi';

const PetHeader = memo(function PetHeader() {
  return (
    <View className="px-[28rpx] py-[12rpx] flex justify-between items-start">
      <View>
        <Text className="font-bold mb-1 block" style={{ fontSize: PET_UI_TEXT.title }}>
          Hi rimKing
        </Text>
        <Text className="text-[#6b6b6b]" style={{ fontSize: PET_UI_TEXT.body }}>
          Good Morning!
        </Text>
      </View>
    </View>
  );
});

export default PetHeader;
