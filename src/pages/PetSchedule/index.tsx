import BasicLayout from '@/layout/basicLayout';
import { View, Text } from '@tarojs/components';
import { memo, useMemo, useState } from 'react';
import Taro from '@tarojs/taro';
import RecordTab from './components/RecordTab';
import ReminderTab from './components/ReminderTab';
import clsx from 'clsx';
import Calendar from './components/calendar';
import { PET_UI } from '@/constants/petUi';
import { usePetAppData } from '@/hooks/usePetAppData';
import { ScheduleRecordItem } from '@/types/pet';

const enum TabType {
  Record = 'record',
  Reminder = 'reminder',
}

const formatDateKey = (date: Date) => date.toISOString().slice(0, 10);

const PetSchedule = memo(function PetSchedule() {
  const [activeTab, setActiveTab] = useState(TabType.Reminder);
  const { activePet, reminders, records, expenses, careLogs, switchReminder } = usePetAppData();
  const [selectedDate, setSelectedDate] = useState(() => formatDateKey(new Date()));

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

    return [...baseRecords, ...expenseRecords, ...careRecords].sort(
      (a, b) => b.createdAt - a.createdAt
    );
  }, [activePet.id, careLogs, expenses, records, selectedDate]);

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
      <View className="px-8 pb-[180px] mt-4">
        <View className="mb-2 px-1">
          <Text className="text-[22px] text-[#5f5f5f]">当前宠物：{activePet.name}</Text>
        </View>

        <View className="flex w-full h-[56px] justify-between items-center gap-[18px] mb-[16px]">
          <View
            className={clsx(
              'flex-1 h-full text-[28px] border-[3px] border-solid border-[#262626] rounded-[40px] flex items-center justify-center',
              activeTab === TabType.Record ? 'bg-[#ffffff]' : 'bg-[#f7f7f7]'
            )}
            onClick={() => setActiveTab(TabType.Record)}
          >
            <Text>记录</Text>
          </View>
          <View
            className={clsx(
              'flex-1 h-full text-[28px] border-[3px] border-solid border-[#262626] rounded-[40px] flex items-center justify-center',
              activeTab === TabType.Reminder ? 'bg-[#ffd93b]' : 'bg-[#f7f7f7]'
            )}
            onClick={() => setActiveTab(TabType.Reminder)}
          >
            <Text>提醒</Text>
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
