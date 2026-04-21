import { View, Text } from '@tarojs/components';
import { memo } from 'react';
import { ScheduleRecordItem } from '@/types/pet';

interface Props {
  records: ScheduleRecordItem[];
  onAddRecord: () => void;
  onAddExpense: () => void;
  onAddCare: () => void;
}

const RecordTab = memo(function RecordTab({ records, onAddRecord, onAddExpense, onAddCare }: Props) {
  return (
    <View className="w-full flex flex-col gap-3">
      <View className="grid grid-cols-3 gap-2">
        <View
          className="h-[72px] rounded-[14px] border-[3px] border-solid border-[#262626] bg-[#ffd93b] flex items-center justify-center"
          onClick={onAddRecord}
        >
          <Text className="text-[24px]">+ 日常记录</Text>
        </View>
        <View
          className="h-[72px] rounded-[14px] border-[3px] border-solid border-[#262626] bg-[#ffc6a1] flex items-center justify-center"
          onClick={onAddExpense}
        >
          <Text className="text-[24px]">+ 花销</Text>
        </View>
        <View
          className="h-[72px] rounded-[14px] border-[3px] border-solid border-[#262626] bg-[#bdeeff] flex items-center justify-center"
          onClick={onAddCare}
        >
          <Text className="text-[24px]">+ 护理</Text>
        </View>
      </View>

      {!records.length ? (
        <View className="w-full rounded-[18px] border-[3px] border-solid border-[#262626] bg-[#f4f4f4] p-6 text-center">
          <Text className="text-[24px] text-[#757575]">当天还没有记录</Text>
        </View>
      ) : null}

      {records.map((item) => (
        <View
          key={item.id}
          className="bg-[#f4f4f4] min-h-[110px] rounded-[18px] px-4 py-3 mb-[2px] flex items-center justify-between border-[3px] border-[#262626] border-solid"
        >
          <View className="flex-1">
            <Text className="text-[28px] font-[500] block">{item.category}</Text>
            <Text className="text-[22px] text-[#7a7a7a]">{item.time}</Text>
          </View>

          <View className="items-end max-w-[260px]">
            <Text className="text-[24px] text-[#6b6b6b] block">{item.value || '已记录'}</Text>
            {item.note ? <Text className="text-[20px] text-[#9a9a9a]">{item.note}</Text> : null}
          </View>
        </View>
      ))}
    </View>
  );
});

export default RecordTab;
