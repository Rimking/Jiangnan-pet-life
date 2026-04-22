import { View, Text } from '@tarojs/components';
import { memo } from 'react';
import { PET_UI_SHADOW, PET_UI, PET_UI_BORDER, PET_UI_RADIUS, PET_UI_TEXT } from '@/constants/petUi';

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
      className="mx-[28rpx] mb-[14rpx] p-[14rpx] bg-[#f4f4f4] border-solid"
      style={{
        border: PET_UI_BORDER.strong,
        borderRadius: PET_UI_RADIUS.md,
        boxShadow: PET_UI_SHADOW,
      }}
    >
      <View className="flex items-center justify-between mb-[10rpx]">
        <Text className="font-bold" style={{ fontSize: PET_UI_TEXT.title }}>花销洞察</Text>
        <View className="items-end" onClick={onOpenDetail}>
          <Text className="text-[#ff6b6b]" style={{ fontSize: PET_UI_TEXT.body }}>本月 ¥{monthTotal.toFixed(2)}</Text>
          <Text className="text-[#7a7a7a]" style={{ fontSize: PET_UI_TEXT.caption }}>查看明细</Text>
        </View>
      </View>

      <View className="mb-[10rpx]">
        {categoryTop.length ? (
          categoryTop.map((item) => {
            const widthPct = monthTotal > 0 ? Math.max((item.amount / monthTotal) * 100, 8) : 8;
            return (
              <View key={item.name} className="mb-[8rpx]">
                <View className="flex items-center justify-between mb-[4rpx]">
                  <Text className="text-[#4f4f4f]" style={{ fontSize: PET_UI_TEXT.body }}>{item.name}</Text>
                  <Text className="text-[#7a7a7a]" style={{ fontSize: PET_UI_TEXT.body }}>¥{item.amount.toFixed(2)}</Text>
                </View>
                <View
                  className="h-[12rpx] bg-white overflow-hidden"
                  style={{ border: `1px solid ${PET_UI.cardBorderColor}`, borderRadius: PET_UI_RADIUS.pill }}
                >
                  <View
                    className="h-full bg-[#ffb177]"
                    style={{ width: `${Math.min(widthPct, 100)}%`, borderRadius: PET_UI_RADIUS.pill }}
                  />
                </View>
              </View>
            );
          })
        ) : (
          <Text className="text-[#8a8a8a]" style={{ fontSize: PET_UI_TEXT.body }}>本月还没有花销数据</Text>
        )}
      </View>

      <View>
        <Text className="text-[#666] mb-[8rpx] block" style={{ fontSize: PET_UI_TEXT.body }}>近7天趋势</Text>
        <View className="flex items-end justify-between h-[72rpx] px-[4rpx]">
          {weekSeries.map((value, index) => {
            const height = Math.max((value / maxWeek) * 100, value > 0 ? 18 : 6);
            return (
              <View key={`${index}-${value}`} className="w-[12%] flex flex-col items-center">
                <View
                  className="w-full bg-[#ffc58a]"
                  style={{
                    border: `1px solid ${PET_UI.cardBorderColor}`,
                    borderRadius: '',
                    height: `${Math.min(height, 100)}%`,
                  }}
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

