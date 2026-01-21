import { View, Text } from '@tarojs/components';
import { memo } from 'react';

const RecordTab = memo(function RecordTab() {
  const recordItems = [
    {
      title: '饮食',
      icon: '🍽️',
      value: '',
      hasArrow: true,
    },
    {
      title: '喝水',
      icon: '💧',
      value: '300ml',
      hasArrow: false,
      hasSwitch: true,
    },
    {
      title: '体重',
      icon: '⚖️',
      value: '2.5kg',
      hasArrow: false,
      hasSwitch: true,
    },
    {
      title: '洗护',
      icon: '🛁',
      value: '',
      hasArrow: true,
    },
    {
      title: '排便',
      icon: '💩',
      value: '',
      hasArrow: true,
      options: ['💩', '💩💩', '💩💩💩'],
    },
    {
      title: '记事',
      icon: '📝',
      value: '',
      hasArrow: true,
      hasNoteIcon: true,
    },
    {
      title: '异常',
      icon: '⚠️',
      value: '',
      hasArrow: true,
    },
  ];

  return (
    <View className="w-full flex flex-col ">
      {recordItems.map((item, index) => (
        <View
          key={index}
          className="bg-[#FFF] h-[116px] rounded-[24px] px-4 mb-[12px] shadow-sm flex items-center justify-between border-[4px] border-[black] border-solid "
        >
          <View className="flex items-center">
            <View className="w-[64px] h-[64px] rounded-[16px] bg-[#E0E0E0] flex items-center justify-center mr-[16px]">
              <Text className="text-[32px]">{item.icon}</Text>
            </View>
            <Text className="text-[28px] font-[500]">{item.title}</Text>
          </View>
          <View className="flex items-center gap-[16px]">
            {item.value && <Text className="text-[28px] text-[#666]">{item.value}</Text>}
            {item.options && (
              <View className="flex gap-[4px]">
                {item.options.map((option, optIndex) => (
                  <Text key={optIndex} className="text-[28px]">
                    {option}
                  </Text>
                ))}
              </View>
            )}
            {item.hasNoteIcon && (
              <View className="w-[40px] h-[40px] rounded-[8px] bg-[#E0E0E0] flex items-center justify-center">
                <Text className="text-[24px]">📌</Text>
              </View>
            )}
            {item.hasSwitch && (
              <View className="w-[80px] h-[40px] rounded-[20px] bg-[#4CAF50] flex items-center justify-center">
                <View className="w-[32px] h-[32px] rounded-[50%] bg-[#FFF]" />
              </View>
            )}
            {item.hasArrow && (
              <View className="w-[40px] h-[40px] rounded-[50%] bg-[#E0E0E0] flex items-center justify-center">
                <Text className="text-[24px]">→</Text>
              </View>
            )}
          </View>
        </View>
      ))}
    </View>
  );
});

export default RecordTab;
