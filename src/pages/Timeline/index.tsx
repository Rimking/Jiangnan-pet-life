import BasicLayout from '@/layout/basicLayout';
import { View, Text } from '@tarojs/components';
import { memo, useMemo } from 'react';
import { useAtom } from 'jotai';
import { careRecordsAtom, currentPetAtom, dailyRecordsAtom, schedulesAtom } from '@/store';

type TimelineEvent = {
  id: string;
  petId: string;
  date: string;
  time?: string;
  type: 'schedule' | 'care' | 'daily';
  title: string;
  subtitle: string;
  icon: string;
};

function getSortKey(item: TimelineEvent) {
  const date = item.date || '1970-01-01';
  const time = item.time && item.time.trim() ? item.time : '00:00';
  return `${date} ${time}`;
}

const Timeline = memo(function Timeline() {
  const [currentPet] = useAtom(currentPetAtom);
  const [schedules] = useAtom(schedulesAtom);
  const [careRecords] = useAtom(careRecordsAtom);
  const [dailyRecords] = useAtom(dailyRecordsAtom);

  const rows = useMemo(() => {
    const currentPetId = currentPet?.id;

    const scheduleEvents: TimelineEvent[] = schedules
      .filter((item) => !currentPetId || item.petId === currentPetId)
      .map((item) => ({
        id: `schedule_${item.id}`,
        petId: item.petId,
        date: item.date,
        time: item.time,
        type: 'schedule',
        title: item.title,
        subtitle: item.isCompleted ? '已完成提醒' : '待完成提醒',
        icon: item.icon || '⏰',
      }));

    const careEvents: TimelineEvent[] = careRecords
      .filter((item) => !currentPetId || item.petId === currentPetId)
      .map((item) => ({
        id: `care_${item.id}`,
        petId: item.petId,
        date: item.date,
        type: 'care',
        title: item.content,
        subtitle: `护理状态：${item.status}`,
        icon: '🧼',
      }));

    const dailyEvents: TimelineEvent[] = dailyRecords
      .filter((item) => !currentPetId || item.petId === currentPetId)
      .map((item) => ({
        id: `daily_${item.id}`,
        petId: item.petId,
        date: item.date,
        type: 'daily',
        title: '日常记录',
        subtitle: item.content,
        icon: '📝',
      }));

    return [...scheduleEvents, ...careEvents, ...dailyEvents].sort((a, b) =>
      getSortKey(b).localeCompare(getSortKey(a)),
    );
  }, [currentPet, schedules, careRecords, dailyRecords]);

  return (
    <BasicLayout navOptions={{ navTitle: '成长时光', needBack: true }}>
      <View className="px-8 pt-28 pb-10 flex flex-col gap-3">
        <Text className="text-[24rpx] text-gray-500 mb-1">
          当前宠物：{currentPet?.name ?? '全部宠物'}
        </Text>

        {rows.length === 0 ? (
          <View className="bg-white rounded-2xl p-5 shadow-sm">
            <Text>暂无时间轴数据，先去添加提醒或护理记录吧。</Text>
          </View>
        ) : (
          rows.map((row) => (
            <View key={row.id} className="bg-white rounded-2xl p-4 shadow-sm">
              <View className="flex flex-row justify-between items-start">
                <View className="flex-1 pr-3">
                  <Text>{row.icon} {row.title}</Text>
                  <Text className="text-[24rpx] text-gray-500 mt-1">{row.subtitle}</Text>
                </View>
                <View>
                  <Text className="text-[22rpx] text-gray-500 text-right">{row.date}</Text>
                  <Text className="text-[22rpx] text-gray-400 text-right">{row.time ?? '--:--'}</Text>
                </View>
              </View>
            </View>
          ))
        )}
      </View>
    </BasicLayout>
  );
});

export default Timeline;
