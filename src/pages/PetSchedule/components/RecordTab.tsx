import { View, Text } from '@tarojs/components';
import { memo } from 'react';
import { ScheduleRecordItem } from '@/types/pet';
import { PET_UI, PET_UI_BORDER, PET_UI_RADIUS, PET_UI_TEXT } from '@/constants/petUi';

interface Props {
  records: ScheduleRecordItem[];
  onAddRecord: () => void;
  onAddExpense: () => void;
  onAddCare: () => void;
}

const actionBtnStyle = {
  border: PET_UI_BORDER.strong,
  borderRadius: PET_UI_RADIUS.sm,
};

const cardStyle = {
  border: PET_UI_BORDER.strong,
  borderRadius: PET_UI_RADIUS.md,
  backgroundColor: PET_UI.panelBackground,
};

const RecordTab = memo(function RecordTab({ records, onAddRecord, onAddExpense, onAddCare }: Props) {
  return (
    <View className="w-full flex flex-col gap-3">
      <View className="grid grid-cols-3 gap-2">
        <View className="h-[72rpx] bg-[#ffd93b] flex items-center justify-center" style={actionBtnStyle} onClick={onAddRecord}>
          <Text style={{ fontSize: PET_UI_TEXT.body }}>+ 日常记录</Text>
        </View>
        <View className="h-[72rpx] bg-[#ffc6a1] flex items-center justify-center" style={actionBtnStyle} onClick={onAddExpense}>
          <Text style={{ fontSize: PET_UI_TEXT.body }}>+ 花销</Text>
        </View>
        <View className="h-[72rpx] bg-[#bdeeff] flex items-center justify-center" style={actionBtnStyle} onClick={onAddCare}>
          <Text style={{ fontSize: PET_UI_TEXT.body }}>+ 护理</Text>
        </View>
      </View>

      {!records.length ? (
        <View className="w-full p-6 text-center" style={cardStyle}>
          <Text className="text-[#757575]" style={{ fontSize: PET_UI_TEXT.body }}>当天还没有记录</Text>
        </View>
      ) : null}

      {records.map((item) => (
        <View key={item.id} className="min-h-[110rpx] px-4 py-3 mb-[2rpx] flex items-center justify-between" style={cardStyle}>
          <View className="flex-1">
            <Text className="font-[500] block" style={{ fontSize: '' }}>{item.category}</Text>
            <Text className="text-[#7a7a7a]" style={{ fontSize: PET_UI_TEXT.caption }}>{item.time}</Text>
          </View>

          <View className="items-end max-w-[260rpx]">
            <Text className="text-[#6b6b6b] block" style={{ fontSize: PET_UI_TEXT.body }}>{item.value || '已记录'}</Text>
            {item.note ? <Text className="text-[#9a9a9a]" style={{ fontSize: PET_UI_TEXT.caption }}>{item.note}</Text> : null}
          </View>
        </View>
      ))}
    </View>
  );
});

export default RecordTab;

