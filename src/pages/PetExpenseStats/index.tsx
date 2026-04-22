import BasicLayout from '@/layout/basicLayout';
import { View, Text } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import { memo, useMemo, useState } from 'react';
import { usePetAppData } from '@/hooks/usePetAppData';
import { PET_UI, PET_UI_SHADOW } from '@/constants/petUi';

const monthKey = (date: Date) => `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, '0')}`;

const buildMonthOptions = () => {
  return Array.from({ length: 4 }).map((_, index) => {
    const d = new Date();
    d.setMonth(d.getMonth() - index);
    const key = monthKey(d);
    return { key, label: `${d.getFullYear()}年${d.getMonth() + 1}月` };
  });
};

const PetExpenseStats = memo(function PetExpenseStats() {
  const { params } = useRouter();
  const { state, expenses, activePet } = usePetAppData();

  const petId = params.petId || activePet.id;
  const pet = state.pets.find((item) => item.id === petId) || activePet;

  const monthOptions = useMemo(() => buildMonthOptions(), []);
  const [activeMonth, setActiveMonth] = useState(monthOptions[0].key);

  const monthlyExpenses = useMemo(() => {
    return expenses
      .filter((item) => item.petId === pet.id && item.date.startsWith(activeMonth))
      .sort((a, b) => b.createdAt - a.createdAt);
  }, [activeMonth, expenses, pet.id]);

  const summary = useMemo(() => {
    const total = monthlyExpenses.reduce((sum, item) => sum + item.amount, 0);
    const categoryMap = monthlyExpenses.reduce<Record<string, number>>((acc, item) => {
      acc[item.category] = (acc[item.category] ?? 0) + item.amount;
      return acc;
    }, {});

    const byCategory = Object.entries(categoryMap)
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount);

    return {
      total,
      count: monthlyExpenses.length,
      byCategory,
    };
  }, [monthlyExpenses]);

  return (
    <BasicLayout
      wrapClassName="w-full h-full"
      wrapStyle={{
        backgroundImage: PET_UI.pageBackground,
        minHeight: '100vh',
      }}
      navOptions={{
        navTitle: '花销统计',
        needBack: true,
      }}
    >
      <View className="px-8 pt-4 pb-[120rpx]">
        <View className="mb-3">
          <Text className="text-[26rpx] text-[#555]">宠物：{pet.name}</Text>
        </View>

        <View className="flex flex-wrap gap-2 mb-4">
          {monthOptions.map((item) => (
            <View
              key={item.key}
              className="px-3 py-2 rounded-[16rpx] border-[2rpx] border-solid border-[#262626]"
              style={{ backgroundColor: activeMonth === item.key ? '#ffd93b' : '#f4f4f4' }}
              onClick={() => setActiveMonth(item.key)}
            >
              <Text className="text-[22rpx]">{item.label}</Text>
            </View>
          ))}
        </View>

        <View
          className="mb-4 p-4 rounded-[16rpx] border-[3rpx] border-solid border-[#262626] bg-[#f4f4f4]"
          style={{ boxShadow: PET_UI_SHADOW }}
        >
          <Text className="text-[28rpx] font-bold">当月总花销：¥{summary.total.toFixed(2)}</Text>
          <Text className="text-[22rpx] text-[#666] mt-1 block">记录笔数：{summary.count}</Text>
        </View>

        <View
          className="mb-4 p-4 rounded-[16rpx] border-[3rpx] border-solid border-[#262626] bg-[#f4f4f4]"
          style={{ boxShadow: PET_UI_SHADOW }}
        >
          <Text className="text-[30rpx] font-bold mb-3 block">分类占比</Text>
          {summary.byCategory.length ? (
            summary.byCategory.map((item) => {
              const widthPct = summary.total > 0 ? (item.amount / summary.total) * 100 : 0;
              return (
                <View key={item.name} className="mb-3">
                  <View className="flex items-center justify-between mb-1">
                    <Text className="text-[24rpx]">{item.name}</Text>
                    <Text className="text-[24rpx] text-[#666]">¥{item.amount.toFixed(2)}</Text>
                  </View>
                  <View className="h-[12rpx] rounded-full bg-white border-[1rpx] border-solid border-[#262626] overflow-hidden">
                    <View className="h-full bg-[#ffb177]" style={{ width: `${Math.max(widthPct, 6)}%` }} />
                  </View>
                </View>
              );
            })
          ) : (
            <Text className="text-[24rpx] text-[#8a8a8a]">本月暂无花销记录</Text>
          )}
        </View>

        <View
          className="p-4 rounded-[16rpx] border-[3rpx] border-solid border-[#262626] bg-[#f4f4f4]"
          style={{ boxShadow: PET_UI_SHADOW }}
        >
          <Text className="text-[30rpx] font-bold mb-3 block">花销明细</Text>
          {monthlyExpenses.length ? (
            monthlyExpenses.map((item) => (
              <View
                key={item.id}
                className="mb-2 p-3 rounded-[12rpx] border-[2rpx] border-solid border-[#262626] bg-white flex items-center justify-between"
              >
                <View className="flex-1">
                  <Text className="text-[24rpx] block">{item.category}</Text>
                  <Text className="text-[20rpx] text-[#7a7a7a]">{item.date} {item.time}</Text>
                </View>
                <View className="items-end">
                  <Text className="text-[24rpx] text-[#ff6b6b]">¥{item.amount.toFixed(2)}</Text>
                  {item.note ? <Text className="text-[20rpx] text-[#9a9a9a]">{item.note}</Text> : null}
                </View>
              </View>
            ))
          ) : (
            <Text className="text-[24rpx] text-[#8a8a8a]">本月暂无明细</Text>
          )}
        </View>
      </View>
    </BasicLayout>
  );
});

export default PetExpenseStats;

