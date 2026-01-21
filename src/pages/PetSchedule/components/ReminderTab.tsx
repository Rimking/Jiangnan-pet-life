import { View, Text } from '@tarojs/components';
import { memo } from 'react';

const ReminderTab = memo(function ReminderTab() {
  const reminderTypes = [
    {
      type: '日常提醒',
      color: '#FFF7B0',
    },
    {
      type: '走路提醒',
      color: '#B0F8FF',
    },
    {
      type: '洗澡提醒',
      color: '#FFC2B0',
    },
    {
      type: '用药提醒',
      color: '#D2B0FF',
    },
  ];

  const reminderItems = [
    {
      title: '给火火喂体重',
      time: '08:00',
      isEnabled: true,
    },
    {
      title: '铲猫',
      time: '09:30',
      isEnabled: false,
    },
    {
      title: '提醒我吃药药',
      time: '11:00',
      isEnabled: false,
    },
    {
      title: '带火火去医院体检',
      time: '14:00',
      isEnabled: false,
    },
    {
      title: '给火火剪指甲',
      time: '18:00',
      isEnabled: false,
    },
  ];

  return (
    <View className="w-full">
      {/* 类型描述 */}
      <View className="mt-8 mb-6">
        <View className="flex gap-4 overflow-x-auto pb-4">
          {reminderTypes.map((type, index) => (
            <View key={index} className={`flex items-center px-6 py-3 rounded-2xl `}>
              <View
                className="w-4 h-6 rounded-full border-[2px] border-solid border-[black] mr-1"
                style={{
                  backgroundColor: type.color,
                }}
              ></View>
              <Text className="text-[24px] text-gray-800">{type.type}</Text>
            </View>
          ))}
        </View>
      </View>
      <View className="mb-30">
        {reminderItems.map((item, index) => (
          <View
            key={index}
            className="bg-white border-[2px] border-solid border-[black] rounded-2xl p-8 mb-6 shadow-sm flex items-center justify-between"
          >
            <View className="flex-1">
              <Text className="text-[24px] font-medium mb-2 block">{item.title}</Text>
              <Text className="text-[24px] text-gray-600">{item.time}</Text>
            </View>
            <View
              className={`w-20 h-10 rounded-full ${item.isEnabled ? 'bg-green-500' : 'bg-gray-200'} flex items-center p-1 ${item.isEnabled ? 'justify-end' : 'justify-start'}`}
            >
              <View className="w-8 h-8 rounded-full bg-white" />
            </View>
          </View>
        ))}
        {/* 空状态 */}
        <View className="bg-white border-[2px] border-solid border-[black] rounded-2xl p-20 px-10 mb-6 shadow-sm flex flex-col items-center justify-center">
          <Text className="text-[64px] mb-6">🐱</Text>
          <Text className="text-[24px] text-gray-400 mb-8">还没有提醒～</Text>
          <View className="w-24 h-24 rounded-full bg-yellow-400 flex items-center justify-center shadow-md">
            <Text className="text-[24px] text-white">+</Text>
          </View>
        </View>
      </View>
      {/* 右下角添加按钮 */}
      <View className="absolute bottom-8 right-8 w-28 h-28 rounded-full bg-yellow-400 flex items-center justify-center shadow-lg">
        <Text className="text-[36px] text-white">+</Text>
      </View>
    </View>
  );
});

export default ReminderTab;
