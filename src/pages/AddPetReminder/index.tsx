import BasicLayout from '@/layout/basicLayout';
import { View, Text, Input, Textarea } from '@tarojs/components';
import { memo, useState } from 'react';

// 新增提醒
const AddPetReminder = memo(function AddPetReminder() {
  // 提醒内容
  const [reminderContent, setReminderContent] = useState('');
  // 提醒类型
  const [reminderType, setReminderType] = useState('');
  // 提醒时间
  const [reminderTime, setReminderTime] = useState('');
  // 提醒是否重复
  const [reminderRepeat, setReminderRepeat] = useState('');

  return (
    <BasicLayout
      wrapClassName="w-full h-full"
      wrapStyle={{
        backgroundColor: '#FFF',
        minHeight: '100vh',
      }}
      navOptions={{
        navTitle: '添加提醒',
        needBack: true,
      }}
    >
      <View className="p-8">
        {/* 输入内容 */}
        <View className="mb-8 border-[2px] border-black border-solid rounded-xl">
          <Textarea
            className="w-full px-4 py-2 h-[128px] text-[24px]"
            placeholder="请输入提醒内容"
          />
        </View>

        {/* 类型选择 */}
        <View className="mb-6 border-[2px] border-black border-solid rounded-xl">
          <View className="w-full h-[88px] rounded-xl flex items-center px-4 justify-between">
            <Text className="text-[24px] text-gray-500">类型</Text>
            <View className="flex items-center gap-2">
              <Text className="text-[24px]">日常提醒</Text>
              <Text className="text-[24px] text-gray-400">→</Text>
            </View>
          </View>
        </View>

        {/* 时间选择 */}
        <View className="mb-6 border-[2px] border-black border-solid rounded-xl">
          <View className="w-full h-[88px] rounded-xl flex items-center px-4 justify-between">
            <Text className="text-[24px] text-gray-500">时间</Text>
            <View className="flex items-center gap-2">
              <Text className="text-[24px]">2024年8月6日 周二 14:23</Text>
              <Text className="text-[24px] text-gray-400">→</Text>
            </View>
          </View>
        </View>

        {/* 提醒设置 */}
        <View className="mb-12 border-[2px] border-black border-solid rounded-xl">
          <View className="w-full h-[88px] rounded-xl flex items-center px-4 justify-between">
            <Text className="text-[24px] text-gray-500">提醒</Text>
            <View className="flex items-center gap-2">
              <Text className="text-[24px]">重复</Text>
              <Text className="text-[24px] text-gray-400">→</Text>
            </View>
          </View>
        </View>

        {/* 保存按钮 */}
        <View className="w-full h-[96px] border-[2px] border-black border-solid bg-[#FFEB3B] rounded-[50px] flex items-center justify-center shadow-md">
          <Text className="text-[32px] font-bold ">保存</Text>
        </View>
      </View>
    </BasicLayout>
  );
});

export default AddPetReminder;
