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
import { ensureLoggedIn, isLoggedIn } from '@/utils/authState';

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
  const loggedIn = isLoggedIn();

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

  const hasDayRecords = mergedRecords.length > 0;
  const hasDayReminders = petReminders.length > 0;
  const showLoginState = !loggedIn && !activePet && !loading;
  const showNoPetState = loggedIn && !activePet && !loading;
  const showEmptyDataState = activePet && !loading && (
    (activeTab === TabType.Record && !hasDayRecords) ||
    (activeTab === TabType.Reminder && !hasDayReminders)
  );

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

        {activePet ? (
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
        ) : null}

        {showLoginState ? (
          <View className="mt-4 rounded-[28rpx] bg-white px-[28rpx] py-[32rpx] shadow-[0_18rpx_36rpx_rgba(0,0,0,0.06)]">
            <Text className="text-[#2c2c2c] font-semibold" style={{ fontSize: PET_UI_TEXT.title }}>
              登录后查看你的宠物日程
            </Text>
            <Text className="text-[#7a7a7a] mt-[12rpx] block" style={{ fontSize: PET_UI_TEXT.body }}>
              提醒、护理、花销和日常记录都会跟随账号同步，换设备也能继续看。
            </Text>
            <View
              className="mt-[20rpx] inline-flex px-[26rpx] py-[14rpx] bg-[#FFD93B]"
              style={tabStyle}
              onClick={() => ensureLoggedIn('/pages/PetSchedule/index')}
            >
              <Text style={{ fontSize: PET_UI_TEXT.body }}>去微信登录</Text>
            </View>
          </View>
        ) : null}

        {showNoPetState ? (
          <View className="mt-4 rounded-[28rpx] bg-white px-[28rpx] py-[32rpx] shadow-[0_18rpx_36rpx_rgba(0,0,0,0.06)]">
            <Text className="text-[#2c2c2c] font-semibold" style={{ fontSize: PET_UI_TEXT.title }}>
              还没有宠物档案
            </Text>
            <Text className="text-[#7a7a7a] mt-[12rpx] block" style={{ fontSize: PET_UI_TEXT.body }}>
              先添加一只宠物，后面才能开始管理提醒和照护记录。
            </Text>
            <View
              className="mt-[20rpx] inline-flex px-[26rpx] py-[14rpx] bg-[#FFD93B]"
              style={tabStyle}
              onClick={() => Taro.navigateTo({ url: '/pages/EditPetProfile/index' })}
            >
              <Text style={{ fontSize: PET_UI_TEXT.body }}>去添加宠物</Text>
            </View>
          </View>
        ) : null}

        {showEmptyDataState ? (
          <View className="mt-4 rounded-[28rpx] bg-white px-[28rpx] py-[28rpx] shadow-[0_18rpx_36rpx_rgba(0,0,0,0.06)]">
            <Text className="text-[#2c2c2c] font-semibold" style={{ fontSize: PET_UI_TEXT.title }}>
              {activeTab === TabType.Record ? '这一天还没有记录' : '这一天还没有提醒'}
            </Text>
            <Text className="text-[#7a7a7a] mt-[12rpx] block" style={{ fontSize: PET_UI_TEXT.body }}>
              {activeTab === TabType.Record
                ? '可以先补一条日常、花销或护理记录，时间线和统计页也会同步更新。'
                : '可以先添加一个提醒，让喂食、护理和复查安排更清楚。'}
            </Text>
          </View>
        ) : null}
      </View>
    </BasicLayout>
  );
});

export default PetSchedule;
