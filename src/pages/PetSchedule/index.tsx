import { View, Text } from '@tarojs/components';
import { clsx } from 'clsx';
import { PET_UI, PET_UI_BORDER, PET_UI_RADIUS, PET_UI_TEXT } from '@/constants/petUi';
import { usePetAppData } from '@/hooks/usePetAppData';
import { ScheduleRecordItem } from '@/types/pet';
import { formatLocalDateKey } from '@/utils/formatDate';
import { memo, useMemo, useState } from 'react';
import Taro from '@tarojs/taro';
import BasicLayout from '@/layout/basicLayout';
import RecordTab from './components/RecordTab';
import ReminderTab from './components/ReminderTab';
import Calendar from './components/calendar';

const enum TabType {
  Record = 'record',
  Reminder = 'reminder',
}

const PetSchedule = memo(function PetSchedule() {
  const [activeTab, setActiveTab] = useState(TabType.Reminder);
  const { activePet, reminders, records, expenses, careLogs, switchReminder } = usePetAppData();
  const [selectedDate, setSelectedDate] = useState(() => formatLocalDateKey(new Date()));

  const petReminders = useMemo(() => {
    return reminders.filter((item) => item.petId === activePet.id && item.date === selectedDate);
  }, [activePet.id, reminders, selectedDate]);

  const mergedRecords = useMemo<ScheduleRecordItem[]>(() => {
    const baseRecords: ScheduleRecordItem[] = records
      .filter((item) => item.petId === activePet.id && item.date === selectedDate)
      .map((item) => ({
        id: item.id,
        category: item.category,
        value: item.value || '已记录',
        note: item.note,
        time: item.time,
        createdAt: item.createdAt,
      }));

    const expenseRecords: ScheduleRecordItem[] = expenses
      .filter((item) => item.petId === activePet.id && item.date === selectedDate)
      .map((item) => ({
        id: item.id,
        category: `花销 · ${item.category}`,
        value: `¥${item.amount.toFixed(2)}`,
        note: item.note,
        time: item.time,
        createdAt: item.createdAt,
      }));

    const careRecords: ScheduleRecordItem[] = careLogs
      .filter((item) => item.petId === activePet.id && item.date === selectedDate)
      .map((item) => ({
        id: item.id,
        category: `护理 · ${item.careType}`,
        value: item.result,
        note: item.note,
        time: item.time,
        createdAt: item.createdAt,
      }));

    return [...baseRecords, ...expenseRecords, ...careRecords].sort((a, b) => b.createdAt - a.createdAt);
  }, [activePet.id, careLogs, expenses, records, selectedDate]);

  const tabStyle = {
    border: PET_UI_BORDER.strong,
    borderRadius: PET_UI_RADIUS.pill,
  };

  return (
    <BasicLayout
      wrapClassName="w-full h-full"
      wrapStyle={{
        backgroundImage: PET_UI.pageBackground,
        minHeight: '100vh',
      }}
      navOptions={{
        navTitle: '宠物日程',
        needBack: false,
      }}
    >
      <View className="px-8 pb-[180rpx] mt-4">
        <View className="mb-2 px-1">
          <Text className="text-[#5f5f5f]" style={{ fontSize: PET_UI_TEXT.caption }}>当前宠物：{activePet.name}</Text>
        </View>

        <View className="flex w-full h-[56rpx] justify-between items-center gap-[18rpx] mb-[16rpx]">
          <View
            className={clsx('flex-1 h-full flex items-center justify-center', activeTab === TabType.Record ? 'bg-[#ffffff]' : 'bg-[#f7f7f7]')}
            style={tabStyle}
            onClick={() => setActiveTab(TabType.Record)}
          >
            <Text style={{ fontSize: PET_UI_TEXT.body }}>记录</Text>
          </View>
          <View
            className={clsx('flex-1 h-full flex items-center justify-center', activeTab === TabType.Reminder ? 'bg-[#ffd93b]' : 'bg-[#f7f7f7]')}
            style={tabStyle}
            onClick={() => setActiveTab(TabType.Reminder)}
          >
            <Text style={{ fontSize: PET_UI_TEXT.body }}>提醒</Text>
          </View>
        </View>

        <Calendar selectedDate={selectedDate} onSelectDate={setSelectedDate} />

        <View className="w-full mt-4">
          {activeTab === TabType.Record ? (
            <RecordTab
              records={mergedRecords}
              onAddRecord={() =>
                Taro.navigateTo({
                  url: `/pages/AddPetRecord/index?petId=${activePet.id}&date=${selectedDate}&mode=record`,
                })
              }
              onAddExpense={() =>
                Taro.navigateTo({
                  url: `/pages/AddPetRecord/index?petId=${activePet.id}&date=${selectedDate}&mode=expense`,
                })
              }
              onAddCare={() =>
                Taro.navigateTo({
                  url: `/pages/AddPetRecord/index?petId=${activePet.id}&date=${selectedDate}&mode=care`,
                })
              }
            />
          ) : (
            <ReminderTab
              reminders={petReminders}
              onAdd={() =>
                Taro.navigateTo({
                  url: `/pages/AddPetReminder/index?petId=${activePet.id}&date=${selectedDate}`,
                })
              }
              onToggle={switchReminder}
            />
          )}
        </View>
      </View>
    </BasicLayout>
  );
});

export default PetSchedule;

