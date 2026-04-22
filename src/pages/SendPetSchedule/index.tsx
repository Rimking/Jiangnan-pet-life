import BasicLayout from '@/layout/basicLayout';
import { View, Text, Input, Textarea } from '@tarojs/components';
import { memo, useState } from 'react';
import Taro from '@tarojs/taro';
import { showDemoSuccessToast } from '@/utils/demoToast';

const SendPetSchedule = memo(function SendPetSchedule() {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('2026-04-22');
  const [time, setTime] = useState('09:00');
  const [content, setContent] = useState('');

  return (
    <BasicLayout
      wrapClassName="w-full h-full"
      wrapStyle={{ background: 'linear-gradient(180deg, #FFE68D 0%, #FFFCE0 100%)', minHeight: '100vh' }}
      navOptions={{ navTitle: '发布日程', needBack: true }}
    >
      <View className="px-6 pt-4 pb-[120rpx]">
        <View className="mb-4 border-[2rpx] border-solid border-[#262626] rounded-[16rpx] bg-white p-4">
          <Text className="text-[22rpx] text-[#666]">日程标题</Text>
          <Input value={title} onInput={(e) => setTitle(e.detail.value)} placeholder="例如：给火火洗护" className="h-[64rpx] text-[26rpx] mt-2" />
        </View>

        <View className="mb-4 border-[2rpx] border-solid border-[#262626] rounded-[16rpx] bg-white p-4">
          <Text className="text-[22rpx] text-[#666]">日期</Text>
          <Input value={date} onInput={(e) => setDate(e.detail.value)} placeholder="YYYY-MM-DD" className="h-[64rpx] text-[26rpx] mt-2" />
        </View>

        <View className="mb-4 border-[2rpx] border-solid border-[#262626] rounded-[16rpx] bg-white p-4">
          <Text className="text-[22rpx] text-[#666]">时间</Text>
          <Input value={time} onInput={(e) => setTime(e.detail.value)} placeholder="HH:mm" className="h-[64rpx] text-[26rpx] mt-2" />
        </View>

        <View className="mb-6 border-[2rpx] border-solid border-[#262626] rounded-[16rpx] bg-white p-4">
          <Text className="text-[22rpx] text-[#666]">补充说明</Text>
          <Textarea value={content} onInput={(e) => setContent(e.detail.value)} placeholder="可填写事项说明、注意点" maxlength={200} className="h-[180rpx] text-[24rpx] mt-2" />
        </View>

        <View
          className="h-[92rpx] rounded-[48rpx] bg-[#FFD93B] border-[3rpx] border-solid border-[#262626] flex items-center justify-center"
          onClick={() => {
            if (!title.trim()) {
              Taro.showToast({ title: '请先填写日程标题', icon: 'none' });
              return;
            }
            showDemoSuccessToast('发布成功');
          }}
        >
          <Text className="text-[30rpx] font-bold">发布日程</Text>
        </View>
      </View>
    </BasicLayout>
  );
});

export default SendPetSchedule;




