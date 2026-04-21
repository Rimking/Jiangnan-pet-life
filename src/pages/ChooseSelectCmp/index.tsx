import BasicLayout from '@/layout/basicLayout';
import { View, Text } from '@tarojs/components';
import { memo } from 'react';

const ChooseSelectCmp = memo(function ChooseSelectCmp() {
  return (
    <BasicLayout navOptions={{ navTitle: '选择器示例', needBack: true }}>
      <View className="px-8 pt-28">
        <View className="bg-white rounded-2xl p-6 shadow-sm">
          <Text className="text-[30rpx] font-bold">组件预留页</Text>
          <Text className="text-[24rpx] text-gray-500 mt-2">此页用于后续放置通用选择组件。</Text>
        </View>
      </View>
    </BasicLayout>
  );
});

export default ChooseSelectCmp;
