import { View, Text } from '@tarojs/components';
import { clsx } from 'clsx';
import { PET_UI, PET_UI_BORDER, PET_UI_RADIUS, PET_UI_TEXT } from '@/constants/petUi';
import {
  ScheduleRecordItem,
  PetReminderModel,
  PetExpenseModel,
  PetCareLogModel,
  PetRecordModel,
} from '@/types/pet';
import { formatLocalDateKey } from '@/utils/formatDate';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import Taro, { useDidShow } from '@tarojs/taro';
import BasicLayout from '@/layout/basicLayout';
import RecordTab from './components/RecordTab';
import ReminderTab from './components/ReminderTab';
import Calendar from './components/calendar';
import {
  getCareRecordListData,
  getExpenseListData,
  getRecordListData,
  getScheduleListData,
  mapCareRecordToCareLogModel,
  mapExpenseToExpenseModel,
  mapRecordToRecordModel,
  mapScheduleToReminderModel,
  updateScheduleData,
} from '@/api/data';
import { usePetApiPets } from '@/hooks/usePetApiPets';

const enum TabType {
  Record = 'record',
  Reminder = 'reminder',
}

const PetSchedule = memo(function PetSchedule() {
  const [activeTab, setActiveTab] = useState(TabType.Reminder);
  const [selectedDate, setSelectedDate] = useState(() => formatLocalDateKey(new Date()));
  const [reminders, setReminders] = useState<PetReminderModel[]>([]);
  const [expenses, setExpenses] = useState<PetExpenseModel[]>([]);
  const [careLogs, setCareLogs] = useState<PetCareLogModel[]>([]);
  const [records, setRecords] = useState<PetRecordModel[]>([]);
  const { activePet, activePetId, loading, error } = usePetApiPets();

  const refreshPageData = useCallback(async () => {
    if (!activePetId) {
      setReminders([]);
      setExpenses([]);
      setCareLogs([]);
      setRecords([]);
      return;
    }

    const [scheduleList, expenseList, careRecordList, recordList] = await Promise.all([
      getScheduleListData({ petId: activePetId }),
      getExpenseListData({ petId: activePetId }),
      getCareRecordListData({ petId: activePetId }),
      getRecordListData({ petId: activePetId }),
    ]);

    setReminders(scheduleList.map(mapScheduleToReminderModel));
    setExpenses(expenseList.map(mapExpenseToExpenseModel));
    setCareLogs(careRecordList.map(mapCareRecordToCareLogModel));
    setRecords(recordList.map(mapRecordToRecordModel));
  }, [activePetId]);

  useEffect(() => {
    refreshPageData().catch(() => {
      setReminders([]);
      setExpenses([]);
      setCareLogs([]);
      setRecords([]);
    });
  }, [refreshPageData]);

  useDidShow(() => {
    refreshPageData().catch(() => {
      setReminders([]);
      setExpenses([]);
      setCareLogs([]);
      setRecords([]);
    });
  });

  const petReminders = useMemo(() => {
    if (!activePet) {
      return [];
    }
    return reminders.filter((item) => item.petId === activePet.id && item.date === selectedDate);
  }, [activePet, reminders, selectedDate]);

  const mergedRecords = useMemo<ScheduleRecordItem[]>(() => {
    if (!activePet) {
      return [];
    }

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

    const dailyRecords: ScheduleRecordItem[] = records
      .filter((item) => item.petId === activePet.id && item.date === selectedDate)
      .map((item) => ({
        id: item.id,
        category: `日常 · ${item.category}`,
        value: item.value,
        note: item.note,
        time: item.time,
        createdAt: item.createdAt,
      }));

    return [...dailyRecords, ...expenseRecords, ...careRecords].sort(
      (a, b) => b.createdAt - a.createdAt
    );
  }, [activePet, careLogs, expenses, records, selectedDate]);

  const switchReminder = async (id: string) => {
    const target = petReminders.find((item) => item.id === id);
    if (!target) {
      return;
    }

    try {
      await updateScheduleData(id, {
        status: target.enabled ? 'done' : 'pending',
      });
      await refreshPageData();
    } catch (error) {
      Taro.showToast({ title: '更新提醒失败', icon: 'none' });
    }
  };

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
          <Text className="text-[#5f5f5f]" style={{ fontSize: PET_UI_TEXT.caption }}>
            当前宠物：{activePet?.name || '暂无'}
          </Text>
        </View>

        {error ? (
          <View className="mb-2 px-1">
            <Text className="text-[#d65a31]" style={{ fontSize: PET_UI_TEXT.caption }}>
              {error}
            </Text>
          </View>
        ) : null}

        <View className="flex w-full h-[56rpx] justify-between items-center gap-[18rpx] mb-[16rpx]">
          <View
            className={clsx(
              'flex-1 h-full flex items-center justify-center',
              activeTab === TabType.Record ? 'bg-[#ffffff]' : 'bg-[#f7f7f7]'
            )}
            style={tabStyle}
            onClick={() => setActiveTab(TabType.Record)}
          >
            <Text style={{ fontSize: PET_UI_TEXT.body }}>记录</Text>
          </View>
          <View
            className={clsx(
              'flex-1 h-full flex items-center justify-center',
              activeTab === TabType.Reminder ? 'bg-[#ffd93b]' : 'bg-[#f7f7f7]'
            )}
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
                  url: `/pages/AddPetRecord/index?petId=${activePetId}&date=${selectedDate}&mode=record`,
                })
              }
              onAddExpense={() =>
                Taro.navigateTo({
                  url: `/pages/AddPetRecord/index?petId=${activePetId}&date=${selectedDate}&mode=expense`,
                })
              }
              onAddCare={() =>
                Taro.navigateTo({
                  url: `/pages/AddPetRecord/index?petId=${activePetId}&date=${selectedDate}&mode=care`,
                })
              }
            />
          ) : (
            <ReminderTab
              reminders={petReminders}
              onAdd={() =>
                Taro.navigateTo({
                  url: `/pages/AddPetReminder/index?petId=${activePetId}&date=${selectedDate}`,
                })
              }
              onToggle={switchReminder}
            />
          )}
        </View>

        {!activePet && !loading ? (
          <View className="mt-4">
            <Text style={{ fontSize: PET_UI_TEXT.body }}>暂无宠物档案，请先创建宠物。</Text>
          </View>
        ) : null}
      </View>
    </BasicLayout>
  );
});

export default PetSchedule;
