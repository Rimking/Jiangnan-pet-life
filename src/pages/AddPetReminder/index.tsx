import BasicLayout from '@/layout/basicLayout';
import { View, Text, Input } from '@tarojs/components';
import { memo, useMemo, useState } from 'react';
import Taro from '@tarojs/taro';
import { useAtom } from 'jotai';
import { addScheduleAtom, currentPetAtom } from '@/store';

const AddPetReminder = memo(function AddPetReminder() {
  const [currentPet] = useAtom(currentPetAtom);
  const [, addSchedule] = useAtom(addScheduleAtom);

  const [title, setTitle] = useState('喂食提醒');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('09:00');
  const [icon, setIcon] = useState('⏰');

  const disabled = useMemo(() => !currentPet || !title.trim(), [currentPet, title]);

  const handleSave = () => {
    if (!currentPet) {
      Taro.showToast({ title: '请先添加宠物', icon: 'none' });
      return;
    }

    addSchedule({
      petId: currentPet.id,
      title: title.trim(),
      date,
      time,
      icon,
    });

    Taro.showToast({ title: '提醒已创建', icon: 'success' });
    setTimeout(() => Taro.navigateBack(), 350);
  };

  return (
    <BasicLayout navOptions={{ navTitle: '添加提醒', needBack: true }}>
      <View className="p-8 pt-28">
        <View className="bg-white rounded-2xl p-6 shadow-sm flex flex-col gap-4">
          <Text className="text-[30rpx] font-bold">提醒信息</Text>
          <Text className="text-[24rpx] text-gray-500">当前宠物：{currentPet?.name ?? '未选择'}</Text>

          <View>
            <Text className="text-[24rpx] text-gray-500">标题</Text>
            <Input className="mt-2 p-3 bg-gray-50 rounded-xl" value={title} onInput={(e) => setTitle(e.detail.value)} />
          </View>

          <View>
            <Text className="text-[24rpx] text-gray-500">日期（YYYY-MM-DD）</Text>
            <Input className="mt-2 p-3 bg-gray-50 rounded-xl" value={date} onInput={(e) => setDate(e.detail.value)} />
          </View>

          <View>
            <Text className="text-[24rpx] text-gray-500">时间（HH:mm）</Text>
            <Input className="mt-2 p-3 bg-gray-50 rounded-xl" value={time} onInput={(e) => setTime(e.detail.value)} />
          </View>

          <View>
            <Text className="text-[24rpx] text-gray-500">图标</Text>
            <Input className="mt-2 p-3 bg-gray-50 rounded-xl" value={icon} onInput={(e) => setIcon(e.detail.value)} />
          </View>

          <View className={`p-3 rounded-xl ${disabled ? 'bg-gray-200' : 'bg-blue-500'}`} onClick={handleSave}>
            <Text className={`text-center ${disabled ? 'text-gray-500' : 'text-white'}`}>保存提醒</Text>
          </View>
        </View>
      </View>
    </BasicLayout>
  );
});

export default AddPetReminder;
