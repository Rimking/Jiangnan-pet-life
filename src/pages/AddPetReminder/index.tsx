import BasicLayout from '@/layout/basicLayout';
import { View, Text, Input, Picker } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import { memo, useMemo, useState } from 'react';
import { ReminderType } from '@/types/pet';
import { PET_UI } from '@/constants/petUi';
import { formatLocalDateKey } from '@/utils/formatDate';
import { showDemoSuccessToast } from '@/utils/demoToast';

const typeOptions: Array<{ label: string; value: ReminderType }> = [
  { label: '日常提醒', value: 'daily' },
  { label: '护理提醒', value: 'care' },
  { label: '健康提醒', value: 'health' },
  { label: '行为提醒', value: 'behavior' },
];

const AddPetReminder = memo(function AddPetReminder() {
  const { params } = useRouter();

  const defaultDate = useMemo(() => {
    return params.date || formatLocalDateKey(new Date());
  }, [params.date]);

  const [title, setTitle] = useState('');
  const [date, setDate] = useState(defaultDate);
  const [time, setTime] = useState('08:00');
  const [repeat, setRepeat] = useState('每天');
  const [typeIndex, setTypeIndex] = useState(0);

  const handleSave = () => {
    if (!title.trim()) {
      Taro.showToast({ title: '请填写提醒内容', icon: 'none' });
      return;
    }

    if (!date.trim() || !time.trim()) {
      Taro.showToast({ title: '请填写日期和时间', icon: 'none' });
      return;
    }

    showDemoSuccessToast('提醒已保存');
    setTimeout(() => Taro.navigateBack(), 300);
  };

  return (
    <BasicLayout
      wrapClassName="w-full h-full"
      wrapStyle={{
        backgroundImage: PET_UI.pageBackground,
        minHeight: '100vh',
      }}
      navOptions={{
        navTitle: '添加提醒',
        needBack: true,
      }}
    >
      <View className="p-8 pb-[120rpx]">
        <View className="mb-5 border-[3rpx] border-black border-solid rounded-[16rpx] bg-[#f4f4f4] p-4">
          <Text className="text-[22rpx] text-[#666]">提醒内容</Text>
          <Input
            className="h-[72rpx] text-[28rpx] mt-2"
            placeholder="例如：给火火喂药"
            value={title}
            onInput={(event) => setTitle(event.detail.value)}
          />
        </View>

        <Picker
          mode="selector"
          range={typeOptions.map((item) => item.label)}
          value={typeIndex}
          onChange={(event) => setTypeIndex(Number(event.detail.value))}
        >
          <View className="mb-5 border-[3rpx] border-black border-solid rounded-[16rpx] bg-[#f4f4f4] p-4 flex justify-between items-center">
            <Text className="text-[24rpx] text-[#666]">类型</Text>
            <Text className="text-[26rpx]">{typeOptions[typeIndex].label}</Text>
          </View>
        </Picker>

        <View className="mb-5 border-[3rpx] border-black border-solid rounded-[16rpx] bg-[#f4f4f4] p-4">
          <Text className="text-[22rpx] text-[#666]">日期</Text>
          <Input
            className="h-[72rpx] text-[28rpx] mt-2"
            value={date}
            onInput={(event) => setDate(event.detail.value)}
            placeholder="YYYY-MM-DD"
          />
        </View>

        <View className="mb-5 border-[3rpx] border-black border-solid rounded-[16rpx] bg-[#f4f4f4] p-4">
          <Text className="text-[22rpx] text-[#666]">时间</Text>
          <Input
            className="h-[72rpx] text-[28rpx] mt-2"
            value={time}
            onInput={(event) => setTime(event.detail.value)}
            placeholder="HH:mm"
          />
        </View>

        <View className="mb-10 border-[3rpx] border-black border-solid rounded-[16rpx] bg-[#f4f4f4] p-4">
          <Text className="text-[22rpx] text-[#666]">重复</Text>
          <Input
            className="h-[72rpx] text-[28rpx] mt-2"
            value={repeat}
            onInput={(event) => setRepeat(event.detail.value)}
            placeholder="每天 / 每周一"
          />
        </View>

        <View
          className="w-full h-[96rpx] border-[3rpx] border-black border-solid bg-[#FFD93B] rounded-[50rpx] flex items-center justify-center"
          onClick={handleSave}
        >
          <Text className="text-[32rpx] font-bold">保存提醒</Text>
        </View>
      </View>
    </BasicLayout>
  );
});

export default AddPetReminder;




