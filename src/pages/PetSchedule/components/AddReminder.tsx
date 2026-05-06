import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { memo } from 'react';

const AddReminder = memo(function AddReminder() {
  return (
    <View className="w-full min-h-screen bg-[#FFFCE0] p-8">
      <View className="rounded-[24rpx] border-[3rpx] border-solid border-[#262626] bg-white p-6 mb-5">
        <Text className="text-[32rpx] font-bold text-[#303030] block">提醒入口已升级</Text>
        <Text className="text-[24rpx] text-[#666] leading-[1.7] mt-3 block">
          这个旧组件已不再承载正式创建逻辑，当前项目统一使用新的提醒表单和快捷提醒页来完成创建。
        </Text>
      </View>

      <View className="rounded-[24rpx] border-[3rpx] border-solid border-[#262626] bg-white p-6 mb-5">
        <Text className="text-[28rpx] font-semibold text-[#303030] block">推荐入口</Text>
        <Text className="text-[22rpx] text-[#666] mt-2 block">如果你要补完整提醒信息，建议直接进入正式提醒页。</Text>
        <View
          className="mt-4 h-[84rpx] rounded-[42rpx] bg-[#FFD93B] border-[3rpx] border-solid border-[#262626] flex items-center justify-center"
          onClick={() => Taro.navigateTo({ url: '/pages/AddPetReminder/index?returnTo=schedule' })}
        >
          <Text className="text-[28rpx] font-semibold text-[#303030]">打开正式提醒页</Text>
        </View>
      </View>

      <View className="rounded-[24rpx] border-[3rpx] border-solid border-[#262626] bg-white p-6">
        <Text className="text-[28rpx] font-semibold text-[#303030] block">快捷方式</Text>
        <Text className="text-[22rpx] text-[#666] mt-2 block">如果只是临时补一条提醒，可以走快捷创建入口。</Text>
        <View
          className="mt-4 h-[84rpx] rounded-[42rpx] bg-[#F88D4C] border-[3rpx] border-solid border-[#262626] flex items-center justify-center"
          onClick={() => Taro.navigateTo({ url: '/pages/SendPetSchedule/index' })}
        >
          <Text className="text-[28rpx] font-semibold text-white">打开快捷提醒页</Text>
        </View>
      </View>
    </View>
  );
});

export default AddReminder;
