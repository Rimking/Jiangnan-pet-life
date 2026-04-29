import { View, Text } from '@tarojs/components';
import { memo } from 'react';
import { PetReminderModel } from '@/types/pet';
import { PET_UI, PET_UI_BORDER, PET_UI_RADIUS, PET_UI_TEXT } from '@/constants/petUi';

interface Props {
  reminders: PetReminderModel[];
  onAdd: () => void;
  onToggle: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const reminderTypeMap = {
  daily: { label: '日常提醒', color: '#FFF0A8' },
  care: { label: '护理提醒', color: '#B0F8FF' },
  health: { label: '健康提醒', color: '#FFC2B0' },
  behavior: { label: '行为提醒', color: '#D2B0FF' },
};
const defaultTypeMeta = { label: '其他提醒', color: '#CFCFCF' };

const cardStyle = {
  border: PET_UI_BORDER.strong,
  borderRadius: PET_UI_RADIUS.md,
  backgroundColor: PET_UI.panelBackground,
};

const ReminderTab = memo(function ReminderTab({ reminders, onAdd, onToggle, onEdit, onDelete }: Props) {
  return (
    <View className="w-full mb-30">
      <View className="mt-2 mb-4 flex justify-between flex-wrap gap-y-2">
        {Object.values(reminderTypeMap).map((type) => (
          <View key={type.label} className="flex items-center w-[24%]">
            <View
              className="w-[12rpx] h-[18rpx] mr-1"
              style={{ border: PET_UI_BORDER.regular, borderRadius: PET_UI_RADIUS.pill, backgroundColor: type.color }}
            />
            <Text className="text-[#666]" style={{ fontSize: PET_UI_TEXT.caption }}>{type.label}</Text>
          </View>
        ))}
      </View>

      {!reminders.length ? (
        <View className="p-8 mt-2 flex flex-col items-center" style={cardStyle} onClick={onAdd}>
          <Text className="text-[64rpx] mb-2">🐾</Text>
          <Text className="text-[#777] mb-3" style={{ fontSize: PET_UI_TEXT.body }}>当天还没有提醒</Text>
          <Text className="text-[#ff8f3d]" style={{ fontSize: PET_UI_TEXT.body }}>+ 添加提醒</Text>
        </View>
      ) : null}

      {reminders.map((item) => {
        const typeMeta = reminderTypeMap[item.type as keyof typeof reminderTypeMap] ?? defaultTypeMeta;
        return (
          <View key={item.id} className="relative p-4 mb-4 flex items-center justify-between" style={cardStyle}>
            <View
              className="absolute top-0 left-0 w-[10rpx] h-full"
              style={{
                borderRight: PET_UI_BORDER.regular,
                borderTopLeftRadius: PET_UI_RADIUS.sm,
                borderBottomLeftRadius: PET_UI_RADIUS.sm,
                backgroundColor: typeMeta.color,
              }}
            />
            <View className="flex-1 ml-2">
              <Text className="font-medium mb-1 block" style={{ fontSize: PET_UI_TEXT.body }}>{item.title}</Text>
              <Text className="text-[#7a7a7a]" style={{ fontSize: PET_UI_TEXT.caption }}>{item.time} · {item.repeat}</Text>
            </View>
            <View className="flex items-center gap-3">
              <View
                className="px-[12rpx] py-[8rpx] bg-white"
                style={{ border: PET_UI_BORDER.regular, borderRadius: PET_UI_RADIUS.pill }}
                onClick={() => onEdit(item.id)}
              >
                <Text className="text-[#466481]" style={{ fontSize: PET_UI_TEXT.caption }}>编辑</Text>
              </View>
              <View
                className="px-[12rpx] py-[8rpx] bg-white"
                style={{ border: PET_UI_BORDER.regular, borderRadius: PET_UI_RADIUS.pill }}
                onClick={() => onDelete(item.id)}
              >
                <Text className="text-[#b36439]" style={{ fontSize: PET_UI_TEXT.caption }}>删除</Text>
              </View>
              <View
                className="w-[30rpx] h-[30rpx]"
                style={{
                  borderRadius: PET_UI_RADIUS.pill,
                  border: `2px solid ${item.enabled ? '#33b36b' : '#8a8a8a'}`,
                  backgroundColor: item.enabled ? '#33b36b' : 'transparent',
                }}
                onClick={() => onToggle(item.id)}
              />
            </View>
          </View>
        );
      })}

      <View
        className="h-[92rpx] border-dashed flex items-center justify-center"
        style={{ border: `3px dashed ${PET_UI.cardBorderColor}`, borderRadius: PET_UI_RADIUS.md }}
        onClick={onAdd}
      >
        <Text className="text-[#ff8f3d]" style={{ fontSize: PET_UI_TEXT.body }}>+ 新增提醒</Text>
      </View>
    </View>
  );
});

export default ReminderTab;
