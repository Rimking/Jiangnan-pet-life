import { View, Text } from '@tarojs/components';
import { memo } from 'react';
import { PET_UI_SHADOW } from '@/constants/petUi';

interface CategoryItem {
  name: string;
  amount: number;
}

interface Props {
  monthTotal: number;
  categoryTop: CategoryItem[];
  weekSeries: number[];
  onOpenDetail: () => void;
}

const ExpenseInsight = memo(function ExpenseInsight({
  monthTotal,
  categoryTop,
  weekSeries,
  onOpenDetail,
}: Props) {
  const maxWeek = Math.max(...weekSeries, 1);

  return (
    <View
      className="mx-[36px] mb-4 p-4 rounded-[16px] border-[3px] border-solid border-[#262626] bg-[#f4f4f4]"
      style={{ boxShadow: PET_UI_SHADOW }}
    >
      <View className="flex items-center justify-between mb-3">
        <Text className="text-[34px] font-bold">花销洞察</Text>
        <View className="items-end" onClick={onOpenDetail}>
          <Text className="text-[26px] text-[#ff6b6b]">本月 ¥{monthTotal.toFixed(2)}</Text>
          <Text className="text-[20px] text-[#7a7a7a]">查看明细</Text>
        </View>
      </View>

      <View className="mb-3">
        {categoryTop.length ? (
          categoryTop.map((item) => {
            const widthPct = monthTotal > 0 ? Math.max((item.amount / monthTotal) * 100, 8) : 8;
            return (
              <View key={item.name} className="mb-2">
                <View className="flex items-center justify-between mb-1">
                  <Text className="text-[25px] text-[#4f4f4f]">{item.name}</Text>
                  <Text className="text-[25px] text-[#7a7a7a]">¥{item.amount.toFixed(2)}</Text>
                </View>
                <View className="h-[12px] rounded-full bg-white border-[1px] border-solid border-[#262626] overflow-hidden">
                  <View
                    className="h-full rounded-full bg-[#ffb177]"
                    style={{ width: `${Math.min(widthPct, 100)}%` }}
                  />
                </View>
              </View>
            );
          })
        ) : (
          <Text className="text-[24px] text-[#8a8a8a]">本月还没有花销数据</Text>
        )}
      </View>

      <View>
        <Text className="text-[24px] text-[#666] mb-2 block">近7天趋势</Text>
        <View className="flex items-end justify-between h-[72px] px-1">
          {weekSeries.map((value, index) => {
            const height = Math.max((value / maxWeek) * 100, value > 0 ? 18 : 6);
            return (
              <View key={`${index}-${value}`} className="w-[12%] flex flex-col items-center">
                <View
                  className="w-full rounded-[6px] bg-[#ffc58a] border-[1px] border-solid border-[#262626]"
                  style={{ height: `${Math.min(height, 100)}%` }}
                />
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
});

export default ExpenseInsight;
