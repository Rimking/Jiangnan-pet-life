import { View, Text } from '@tarojs/components';
import { memo } from 'react';
import { PET_UI, PET_UI_SHADOW, PET_UI_BORDER, PET_UI_RADIUS, PET_UI_TEXT } from '@/constants/petUi';

interface Props {
  petName: string;
  stats: {
    reminders: number;
    records: number;
    care: number;
    monthExpense: number;
    milestones: number;
  };
  onOpenSchedule: () => void;
  onOpenCare: () => void;
  onOpenMilestones: () => void;
  onAddReminder: () => void;
  onAddRecord: () => void;
}

const cardStyle = {
  border: PET_UI_BORDER.strong,
  borderRadius: PET_UI_RADIUS.md,
  backgroundColor: PET_UI.panelBackground,
  boxShadow: PET_UI_SHADOW,
};

const metricRowStyle = {
  border: PET_UI_BORDER.regular,
  borderRadius: PET_UI_RADIUS.sm,
};

const FunctionGrid = memo(function FunctionGrid({
  petName,
  stats,
  onOpenSchedule,
  onOpenCare,
  onOpenMilestones,
  onAddReminder,
  onAddRecord,
}: Props) {
  return (
    <View className="w-full h-[340rpx] px-[28rpx] py-[12rpx] gap-[14rpx] flex justify-between">
      <View className="w-[324rpx] h-full border-solid" style={cardStyle}>
        <View className="w-full h-full flex flex-col justify-center items-center gap-[10rpx] px-[10rpx]">
          <View className="w-full h-[54rpx] bg-white border-solid flex items-center justify-between px-[12rpx]" style={metricRowStyle}>
            <Text style={{ fontSize: PET_UI_TEXT.body }}>今日提醒</Text>
            <Text className="text-[#ff6b6b]" style={{ fontSize: PET_UI_TEXT.body }}>{stats.reminders}</Text>
          </View>

          <View
            className="w-full h-[54rpx] bg-white border-solid flex items-center justify-between px-[12rpx]"
            style={metricRowStyle}
            onClick={onOpenCare}
          >
            <Text style={{ fontSize: PET_UI_TEXT.body }}>今日护理</Text>
            <Text className="text-[#008ecf]" style={{ fontSize: PET_UI_TEXT.body }}>{stats.care}</Text>
          </View>

          <View className="w-full h-[54rpx] bg-white border-solid flex items-center justify-between px-[12rpx]" style={metricRowStyle}>
            <Text style={{ fontSize: PET_UI_TEXT.body }}>本月花销</Text>
            <Text className="text-[#ff6b6b]" style={{ fontSize: PET_UI_TEXT.body }}>
              ¥{stats.monthExpense.toFixed(2)}
            </Text>
          </View>

          <View
            className="w-full h-[54rpx] bg-white border-solid flex items-center justify-between px-[12rpx]"
            style={metricRowStyle}
            onClick={onOpenMilestones}
          >
            <Text style={{ fontSize: PET_UI_TEXT.body }}>成长节点</Text>
            <Text className="text-[#d06aa1]" style={{ fontSize: PET_UI_TEXT.body }}>
              {stats.milestones}
            </Text>
          </View>

          <View
            className="w-full h-[54rpx] bg-[#ffd93b] border-solid flex items-center justify-center"
            style={metricRowStyle}
            onClick={onAddReminder}
          >
            <Text style={{ fontSize: PET_UI_TEXT.body }}>给{petName}添加提醒</Text>
          </View>
        </View>
      </View>

      <View className="w-[324rpx] h-full flex gap-[14rpx] flex-col justify-between">
        <View className="w-[324rpx] h-[162rpx] border-solid flex items-center justify-center" style={cardStyle} onClick={onAddRecord}>
          <Text className="text-[#ff6b6b]" style={{ fontSize: PET_UI_TEXT.heading }}>新增记录</Text>
        </View>

        <View className="w-[324rpx] h-[162rpx] border-solid flex items-center justify-center" style={cardStyle} onClick={onOpenSchedule}>
          <Text className="text-[#ff6b6b]" style={{ fontSize: PET_UI_TEXT.heading }}>查看完整日程</Text>
        </View>
      </View>
    </View>
  );
});

export default FunctionGrid;
