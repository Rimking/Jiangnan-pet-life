import { View, Text } from '@tarojs/components';
import { memo } from 'react';
import { PET_UI_SHADOW } from '@/constants/petUi';

const DailyTip = memo(function DailyTip() {
  return (
    <View
      className="mx-[36px] mb-4 p-4 rounded-[16px] border-[3px] border-solid border-[#262626]"
      style={{ backgroundColor: '#f6f6f6', boxShadow: PET_UI_SHADOW }}
    >
      <View className="mb-3 flex items-center">
        <Text className="text-[36px] font-bold mr-2">今日科普</Text>
        <View className="flex-1 h-[2px] bg-[#d5d5d5]" />
      </View>

      <Text className="text-[26px] leading-[40px] text-[#535353]">
        当猫咪出现尾巴竖起、炸毛、瞳孔放大并紧盯目标时，通常是“狩猎本能”被激活。可以用逗猫棒互动5-10分钟，帮助它释放精力，避免因为能量过剩而焦躁。
      </Text>

      <View className="flex items-center pt-3 mt-3 border-t border-[#e2e2e2] gap-2">
        <Text className="text-[24px]">❤️</Text>
        <Text className="text-[24px]">💬</Text>
        <Text className="text-[24px]">🔖</Text>
      </View>
    </View>
  );
});

export default DailyTip;
