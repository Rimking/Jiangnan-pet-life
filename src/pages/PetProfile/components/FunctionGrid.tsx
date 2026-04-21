import { View, Text } from '@tarojs/components';
import { memo } from 'react';
import { PET_UI, PET_UI_SHADOW } from '@/constants/petUi';

interface Props {
  petName: string;
  stats: {
    reminders: number;
    records: number;
    care: number;
    monthExpense: number;
  };
  onOpenSchedule: () => void;
  onOpenCare: () => void;
  onAddReminder: () => void;
  onAddRecord: () => void;
}

const cardStyle = {
  borderColor: PET_UI.cardBorderColor,
  backgroundColor: PET_UI.panelBackground,
  boxShadow: PET_UI_SHADOW,
};

const FunctionGrid = memo(function FunctionGrid({
  petName,
  stats,
  onOpenSchedule,
  onOpenCare,
  onAddReminder,
  onAddRecord,
}: Props) {
  return (
    <View className="w-full h-[360px] px-[36px] py-4 gap-[20px] flex justify-between">
      <View className="w-[330px] h-full rounded-[16px] border-[4px] border-solid" style={cardStyle}>
        <View className="w-full h-full flex flex-col justify-center items-center gap-3 px-3">
          <View className="w-full h-[56px] rounded-[12px] bg-white border-[2px] border-solid border-[#262626] flex items-center justify-between px-4">
            <Text className="text-[26px]">今日提醒</Text>
            <Text className="text-[27px] text-[#ff6b6b]">{stats.reminders}</Text>
          </View>

          <View
            className="w-full h-[56px] rounded-[12px] bg-white border-[2px] border-solid border-[#262626] flex items-center justify-between px-4"
            onClick={onOpenCare}
          >
            <Text className="text-[26px]">今日护理</Text>
            <Text className="text-[27px] text-[#008ecf]">{stats.care}</Text>
          </View>

          <View className="w-full h-[56px] rounded-[12px] bg-white border-[2px] border-solid border-[#262626] flex items-center justify-between px-4">
            <Text className="text-[26px]">本月花销</Text>
            <Text className="text-[27px] text-[#ff6b6b]">¥{stats.monthExpense.toFixed(2)}</Text>
          </View>

          <View
            className="w-full h-[56px] rounded-[12px] bg-[#ffd93b] border-[2px] border-solid border-[#262626] flex items-center justify-center"
            onClick={onAddReminder}
          >
            <Text className="text-[25px] font-medium">给{petName}添加提醒</Text>
          </View>
        </View>
      </View>

      <View className="w-[330px] h-full flex gap-4 flex-col justify-between">
        <View
          className="w-[330px] h-[170px] rounded-[16px] border-[4px] border-solid flex items-center justify-center"
          style={cardStyle}
          onClick={onAddRecord}
        >
          <Text className="text-[32px] text-[#ff6b6b]">新增记录</Text>
        </View>

        <View
          className="w-[330px] h-[170px] rounded-[16px] border-[4px] border-solid flex items-center justify-center"
          style={cardStyle}
          onClick={onOpenSchedule}
        >
          <Text className="text-[32px] text-[#ff6b6b]">查看完整日程</Text>
        </View>
      </View>
    </View>
  );
});

export default FunctionGrid;
