import { View, Text } from '@tarojs/components';
import { memo } from 'react';
import { PetReminderModel } from '@/types/pet';

interface Props {
  reminders: PetReminderModel[];
  onAdd: () => void;
  onToggle: (id: string) => void;
}

const reminderTypeMap = {
  daily: { label: '日常提醒', color: '#FFF0A8' },
  care: { label: '护理提醒', color: '#B0F8FF' },
  health: { label: '健康提醒', color: '#FFC2B0' },
  behavior: { label: '行为提醒', color: '#D2B0FF' },
};
const defaultTypeMeta = { label: '其他提醒', color: '#CFCFCF' };

const ReminderTab = memo(function ReminderTab({ reminders, onAdd, onToggle }: Props) {
  return (
    <View className="w-full mb-30">
      <View className="mt-2 mb-4 flex justify-between flex-wrap gap-y-2">
        {Object.values(reminderTypeMap).map((type) => (
          <View key={type.label} className="flex items-center w-[24%]">
            <View
              className="w-[12px] h-[18px] rounded-full border-[2px] border-solid border-[#262626] mr-1"
              style={{ backgroundColor: type.color }}
            />
            <Text className="text-[20px] text-[#666]">{type.label}</Text>
          </View>
        ))}
      </View>

      {!reminders.length ? (
        <View
          className="bg-[#f4f4f4] border-[3px] border-solid border-[#262626] rounded-[16px] p-8 mt-2 flex flex-col items-center"
          onClick={onAdd}
        >
          <Text className="text-[64px] mb-2">🐾</Text>
          <Text className="text-[24px] text-[#777] mb-3">当天还没有提醒</Text>
          <Text className="text-[26px] text-[#ff8f3d]">+ 添加提醒</Text>
        </View>
      ) : null}

      {reminders.map((item) => {
        const typeMeta =
          reminderTypeMap[item.type as keyof typeof reminderTypeMap] ?? defaultTypeMeta;
        return (
          <View
            key={item.id}
            className="bg-[#f4f4f4] relative border-[3px] border-solid border-[#262626] rounded-[16px] p-4 mb-4 flex items-center justify-between"
          >
            <View
              className="absolute top-0 left-0 w-[10px] h-full rounded-l-[13px] border-r-[2px] border-r-[#262626]"
              style={{ backgroundColor: typeMeta.color }}
            />
            <View className="flex-1 ml-2">
              <Text className="text-[24px] font-medium mb-1 block">{item.title}</Text>
              <Text className="text-[20px] text-[#7a7a7a]">{item.time} · {item.repeat}</Text>
            </View>
            <View
              className="w-[30px] h-[30px] border-[2px] border-solid rounded-full"
              style={{
                borderColor: item.enabled ? '#33b36b' : '#8a8a8a',
                backgroundColor: item.enabled ? '#33b36b' : 'transparent',
              }}
              onClick={() => onToggle(item.id)}
            />
          </View>
        );
      })}

      <View
        className="h-[92px] rounded-[16px] border-[3px] border-dashed border-[#262626] flex items-center justify-center"
        onClick={onAdd}
      >
        <Text className="text-[26px] text-[#ff8f3d]">+ 新增提醒</Text>
      </View>
    </View>
  );
});

export default ReminderTab;
