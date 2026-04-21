import BasicLayout from '@/layout/basicLayout';
import { View, Text, Input } from '@tarojs/components';
import { memo, useState } from 'react';
import Taro from '@tarojs/taro';
import { useAtom } from 'jotai';
import { currentPetAtom, addScheduleAtom } from '@/store';

const SendPetSchedule = memo(function SendPetSchedule() {
  const [currentPet] = useAtom(currentPetAtom);
  const [, addSchedule] = useAtom(addScheduleAtom);

  const [content, setContent] = useState('驱虫提醒');

  const handlePublish = () => {
    if (!currentPet) {
      Taro.showToast({ title: '请先选择宠物', icon: 'none' });
      return;
    }

    addSchedule({
      petId: currentPet.id,
      title: content,
      date: new Date().toISOString().split('T')[0],
      time: '18:00',
      icon: '📌',
    });

    Taro.showToast({ title: '日程已发布', icon: 'success' });
    setTimeout(() => Taro.switchTab({ url: '/pages/PetSchedule/index' }), 300);
  };

  return (
    <BasicLayout navOptions={{ navTitle: '发布日程', needBack: true }}>
      <View className="px-8 pt-28 pb-10">
        <View className="bg-white rounded-2xl p-6 shadow-sm">
          <Text className="text-[30rpx] font-bold">快速发布</Text>
          <Text className="text-[24rpx] text-gray-500 mt-2">当前宠物：{currentPet?.name ?? '未选择'}</Text>
          <Input className="mt-4 p-3 bg-gray-50 rounded-xl" value={content} onInput={(e) => setContent(e.detail.value)} />

          <View className="mt-4 p-3 rounded-xl bg-blue-500" onClick={handlePublish}>
            <Text className="text-center text-white">发布到今日日程</Text>
          </View>
        </View>
      </View>
    </BasicLayout>
  );
});

export default SendPetSchedule;
