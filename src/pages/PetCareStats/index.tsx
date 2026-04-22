import BasicLayout from '@/layout/basicLayout';
import { View, Text } from '@tarojs/components';
import { memo, useMemo, useState } from 'react';
import { useRouter } from '@tarojs/taro';
import { PET_UI, PET_UI_SHADOW } from '@/constants/petUi';
import { usePetAppData } from '@/hooks/usePetAppData';

const monthKey = (date: Date) => `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, '0')}`;

const PetCareStats = memo(function PetCareStats() {
  const { params } = useRouter();
  const { state, careLogs, reminders, activePet } = usePetAppData();

  const petId = params.petId || activePet.id;
  const pet = state.pets.find((item) => item.id === petId) || activePet;

  const careList = useMemo(() => {
    return careLogs.filter((item) => item.petId === pet.id).sort((a, b) => b.createdAt - a.createdAt);
  }, [careLogs, pet.id]);

  const careTypes = useMemo(() => {
    const set = new Set(careList.map((item) => item.careType));
    return ['全部', ...Array.from(set)];
  }, [careList]);

  const [activeType, setActiveType] = useState('全部');

  const filteredCareList = useMemo(() => {
    return activeType === '全部' ? careList : careList.filter((item) => item.careType === activeType);
  }, [activeType, careList]);

  const thisMonthKey = monthKey(new Date());
  const monthCount = careList.filter((item) => item.date.startsWith(thisMonthKey)).length;

  const getReminderStatus = (careType: string, nextDate?: string) => {
    if (!nextDate) {
      return { label: '无需提醒', color: '#8a8a8a' };
    }

    const related = reminders.find(
      (item) =>
        item.petId === pet.id &&
        item.type === 'care' &&
        item.date === nextDate &&
        item.title.includes(careType)
    );

    if (related?.enabled) {
      return { label: '提醒已开启', color: '#33b36b' };
    }

    if (related && !related.enabled) {
      return { label: '提醒已关闭', color: '#f59e0b' };
    }

    if (nextDate < new Date().toISOString().slice(0, 10)) {
      return { label: '提醒已过期', color: '#ef4444' };
    }

    return { label: '待创建提醒', color: '#3b82f6' };
  };

  return (
    <BasicLayout
      wrapClassName="w-full h-full"
      wrapStyle={{
        backgroundImage: PET_UI.pageBackground,
        minHeight: '100vh',
      }}
      navOptions={{
        navTitle: '护理记录',
        needBack: true,
      }}
    >
      <View className="px-8 pt-4 pb-[120rpx]">
        <View
          className="mb-4 p-4 rounded-[16rpx] border-[3rpx] border-solid border-[#262626] bg-[#f4f4f4]"
          style={{ boxShadow: PET_UI_SHADOW }}
        >
          <Text className="text-[30rpx] font-bold block">{pet.name}的护理档案</Text>
          <Text className="text-[24rpx] text-[#666] mt-1 block">本月护理次数：{monthCount}</Text>
          <Text className="text-[24rpx] text-[#666]">累计护理记录：{careList.length}</Text>
        </View>

        <View className="flex flex-wrap gap-2 mb-4">
          {careTypes.map((type) => (
            <View
              key={type}
              className="px-3 py-2 rounded-[16rpx] border-[2rpx] border-solid border-[#262626]"
              style={{ backgroundColor: activeType === type ? '#bdeeff' : '#f4f4f4' }}
              onClick={() => setActiveType(type)}
            >
              <Text className="text-[22rpx]">{type}</Text>
            </View>
          ))}
        </View>

        <View
          className="p-4 rounded-[16rpx] border-[3rpx] border-solid border-[#262626] bg-[#f4f4f4]"
          style={{ boxShadow: PET_UI_SHADOW }}
        >
          <Text className="text-[30rpx] font-bold mb-3 block">护理时间轴</Text>
          {filteredCareList.length ? (
            filteredCareList.map((item) => {
              const status = getReminderStatus(item.careType, item.nextDate);
              return (
                <View key={item.id} className="flex gap-3 mb-3">
                  <View className="w-[16rpx] flex flex-col items-center pt-2">
                    <View className="w-[12rpx] h-[12rpx] rounded-full bg-[#ff8f3d] border-[1rpx] border-solid border-[#262626]" />
                    <View className="w-[2rpx] flex-1 bg-[#b7b7b7] mt-1" />
                  </View>

                  <View className="flex-1 p-3 rounded-[12rpx] border-[2rpx] border-solid border-[#262626] bg-white">
                    <View className="flex items-center justify-between mb-1">
                      <Text className="text-[25rpx] font-medium">{item.careType}</Text>
                      <Text className="text-[21rpx] text-[#666]">{item.date} {item.time}</Text>
                    </View>
                    <Text className="text-[22rpx] text-[#4f4f4f] mb-1">结果：{item.result}</Text>
                    {item.note ? <Text className="text-[21rpx] text-[#7a7a7a] mb-1">备注：{item.note}</Text> : null}
                    <View className="flex items-center justify-between">
                      <Text className="text-[21rpx] text-[#7a7a7a]">
                        下次：{item.nextDate || '未设置'}
                      </Text>
                      <Text className="text-[21rpx]" style={{ color: status.color }}>
                        {status.label}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })
          ) : (
            <Text className="text-[24rpx] text-[#8a8a8a]">暂无护理记录</Text>
          )}
        </View>
      </View>
    </BasicLayout>
  );
});

export default PetCareStats;

