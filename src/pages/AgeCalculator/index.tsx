import BasicLayout from '@/layout/basicLayout';
import { View, Text, Input } from '@tarojs/components';
import { memo, useMemo, useState } from 'react';
import { formatPetAge } from '@/utils/petUtils';

const AgeCalculator = memo(function AgeCalculator() {
  const [birthday, setBirthday] = useState('2024-01-01');
  const age = useMemo(() => formatPetAge(birthday), [birthday]);

  return (
    <BasicLayout navOptions={{ navTitle: '年龄换算器', needBack: true }}>
      <View className="px-8 pt-28 pb-10">
        <View className="bg-white rounded-2xl p-6 shadow-sm">
          <Text className="text-[30rpx] font-bold">输入生日</Text>
          <Input className="mt-3 p-3 bg-gray-50 rounded-xl" value={birthday} onInput={(e) => setBirthday(e.detail.value)} />
          <Text className="mt-4">当前年龄：{age}</Text>
        </View>
      </View>
    </BasicLayout>
  );
});

export default AgeCalculator;
