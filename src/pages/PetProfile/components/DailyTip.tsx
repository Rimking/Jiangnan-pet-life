import { View, Text } from '@tarojs/components';
import { memo } from 'react';

const DailyTip = memo(function DailyTip() {
  return (
    <View className="daily-tip mx-9 mb-4 p-4 bg-purple-100 rounded-xl shadow-sm">
      <View className="mb-3 flex items-center">
        <Text className="text-[32px] font-bold mr-2">今日科普</Text>
        <View className="flex-1 h-px bg-gray-200" />
      </View>
      <View className="flex gap-3 mb-3">
        <View className="flex-1">
          <Text className="text-[24px] leading-relaxed text-gray-800">
            当猫咪出现尾巴竖起，毛炸起，瞳孔放大，紧紧盯着它的猎物-猫咪体内的一种叫做"捕食本能"的行为被激发了，这时候它需要一些时间来释放这种能量。试着用逗猫棒和它玩一会儿，或者给它一个 puzzle 玩具，让它的精力得到释放。
          </Text>
        </View>
        
      </View>
      <View className="flex justify-between items-center pt-3 border-t border-gray-200">
        <View className="flex gap-2">
          <View className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center">
            <Text className="text-xs">❤️</Text>
          </View>
          <View className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center">
            <Text className="text-xs">💬</Text>
          </View>
          <View className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center">
            <Text className="text-xs">🔗</Text>
          </View>
        </View>
      </View>
    </View>
  );
});

export default DailyTip;