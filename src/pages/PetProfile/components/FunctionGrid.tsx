import { View, Text } from '@tarojs/components';
import { memo } from 'react';

interface FunctionItem {
  title: string;
  subtitle: string;
  icon: string;
}

const FunctionGrid = memo(function FunctionGrid() {
  const functions: FunctionItem[] = [
    {
      title: '给火火打疫苗',
      subtitle: '请提醒我',
      icon: '💉',
    },
    {
      title: '记录',
      subtitle: '记录我的小宝贝',
      icon: '📝',
    },
    {
      title: '给火火喂小零食',
      subtitle: '每天限吃的小零食',
      icon: '🍪',
    },
    {
      title: '提醒',
      subtitle: '给火火记点',
      icon: '🔔',
    },
  ];

  return (
    <View className="w-full h-[378px] px-[36px] py-4 gap-[32px] flex justify-between">
      {/* 左侧单独的清单 */}
      <View className="w-[328px] h-full bg-[#ffffff] border-[4px] border-black border-solid rounded-[16px]">
        {['打疫苗'].map((i) => (
          <View key={i} className="w-full h-[64px] flex items-center justify-center">
            <Text className="text-[32px] text-[#FF6B6B]">{i}</Text>
          </View>
        ))}
      </View>
      <View className="w-[328px] h-full flex gap-6 flex-col justify-between">
        <View className="w-[328px] h-[170px] bg-[#ffffff] border-[4px] border-black border-solid rounded-[16px]">
          {['打疫苗'].map((i) => (
            <View key={i} className="w-full h-[64px] flex items-center justify-center">
              <Text className="text-[32px] text-[#FF6B6B]">{i}</Text>
            </View>
          ))}
        </View>
        <View className="w-[328px] h-[170px] bg-[#ffffff] border-[4px] border-black border-solid rounded-[16px]">
          {['打疫苗'].map((i) => (
            <View key={i} className="w-full h-[64px] flex items-center justify-center">
              <Text className="text-[32px] text-[#FF6B6B]">{i}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
});

export default FunctionGrid;
