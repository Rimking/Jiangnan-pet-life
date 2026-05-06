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
  deleteCareRecordData,
  deleteExpenseData,
  deleteRecordData,
  deleteScheduleData,
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
import { setStoredActivePetId } from '@/utils/activePetState';
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
  const { pets, activePet, activePetId, loading, error, setActivePetId } = usePetApiPets();
  const loggedIn = isLoggedIn();
  const currentPetId = activePet?.id || activePetId || '';

  const refreshPageData = useCallback(async () => {
    if (!loggedIn) {
      setReminders([]);
      setExpenses([]);
      setCareLogs([]);
      setRecords([]);
      return;
    }

    if (!activePetId || !activePet) {
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
  }, [activePet, activePetId, loggedIn]);

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
    return reminders.filter(
      (item) => item.petId === activePet.id && item.date === selectedDate
    );
  }, [activePet, reminders, selectedDate]);

  const mergedRecords = useMemo<ScheduleRecordItem[]>(() => {
    if (!activePet) {
      return [];
    }

    const expenseRecords: ScheduleRecordItem[] = expenses
      .filter((item) => item.petId === activePet.id && item.date === selectedDate)
      .map((item) => ({
        id: item.id,
        sourceId: item.id,
        sourceType: 'expense',
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
        sourceId: item.id,
        sourceType: 'care',
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
        sourceId: item.id,
        sourceType: 'record',
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
      Taro.showToast({
        title: target.enabled ? '已标记完成' : '已恢复待办',
        icon: 'success',
      });
    } catch {
      Taro.showToast({ title: '更新提醒失败', icon: 'none' });
    }
  };

  const deleteReminder = async (id: string) => {
    const result = await Taro.showModal({
      title: '确认删除',
      content: '是否删除这条提醒？',
      confirmText: '删除',
      confirmColor: '#d65a31',
    });

    if (!result.confirm) {
      return;
    }

    try {
      await deleteScheduleData(id);
      await refreshPageData();
      Taro.showToast({ title: '提醒已删除', icon: 'success' });
    } catch (error) {
      Taro.showToast({ title: '删除提醒失败', icon: 'none' });
    }
  };

  const deleteRecordItem = async (item: ScheduleRecordItem) => {
    const result = await Taro.showModal({
      title: '确认删除',
      content: '是否删除这条记录？',
      confirmText: '删除',
      confirmColor: '#d65a31',
    });

    if (!result.confirm) {
      return;
    }

    try {
      if (item.sourceType === 'record') {
        await deleteRecordData(item.sourceId);
      } else if (item.sourceType === 'expense') {
        await deleteExpenseData(item.sourceId);
      } else if (item.sourceType === 'care') {
        await deleteCareRecordData(item.sourceId);
      }
      await refreshPageData();
      Taro.showToast({ title: '记录已删除', icon: 'success' });
    } catch (error) {
      Taro.showToast({ title: '删除记录失败', icon: 'none' });
    }
  };

  const tabStyle = {
    border: PET_UI_BORDER.strong,
    borderRadius: PET_UI_RADIUS.pill,
  };

  const hasDayRecords = mergedRecords.length > 0;
  const hasDayReminders = petReminders.length > 0;
  const showLoginState = !loggedIn && !activePet && !loading;
  const showNoPetState = loggedIn && !pets.length && !activePet && !loading;
  const showInvalidPetState = loggedIn && pets.length > 0 && !activePet && !loading;
  const showEmptyDataState =
    activePet &&
    !loading &&
    ((activeTab === TabType.Record && !hasDayRecords) ||
      (activeTab === TabType.Reminder && !hasDayReminders));

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
        {pets.length ? (
          <View className="mb-3 flex gap-2 flex-wrap">
            {pets.map((pet) => (
              <View
                key={pet.id}
                className="px-[22rpx] py-[12rpx] rounded-[16rpx]"
                style={{
                  backgroundColor: activePetId === pet.id ? '#FFD93B' : '#f4f4f4',
                  border: '2rpx solid #262626',
                }}
                onClick={() => {
                  setActivePetId(pet.id);
                  setStoredActivePetId(pet.id);
                }}
              >
                <Text style={{ fontSize: PET_UI_TEXT.body }}>{pet.name}</Text>
              </View>
            ))}
          </View>
        ) : null}

        <View className="mb-2 px-1">
          <Text className="text-[#5f5f5f]" style={{ fontSize: PET_UI_TEXT.caption }}>
            当前宠物：
            {activePet?.name || (loggedIn && pets.length > 0 ? '未选择有效宠物' : '暂无')}
          </Text>
        </View>

        {activePet ? (
          <View className="mb-4 rounded-[28rpx] bg-white px-[24rpx] py-[26rpx] shadow-[0_18rpx_36rpx_rgba(0,0,0,0.06)]">
            <Text
              className="text-[#2c2c2c] font-semibold block"
              style={{ fontSize: PET_UI_TEXT.title }}
            >
              围绕 {activePet.name} 继续安排今天
            </Text>
            <Text
              className="text-[#7a7a7a] mt-[10rpx] block leading-[1.6]"
              style={{ fontSize: PET_UI_TEXT.body }}
            >
              日程处理完成后，可以继续去时间线回看记录，或者查看这只宠物的整体状态报告。
            </Text>
            <View className="flex gap-[12rpx] mt-[18rpx]">
              <View
                className="flex-1 h-[74rpx] inline-flex px-[18rpx] bg-[#FFD93B] justify-center items-center"
                style={tabStyle}
                onClick={() =>
                  Taro.navigateTo({
                    url: `/pages/AddPetReminder/index?petId=${activePet.id}&date=${selectedDate}&returnTo=schedule`,
                  })
                }
              >
                <Text style={{ fontSize: PET_UI_TEXT.body }}>新增提醒</Text>
              </View>
              <View
                className="flex-1 h-[74rpx] inline-flex px-[18rpx] bg-[#ffffff] justify-center items-center"
                style={tabStyle}
                onClick={() =>
                  Taro.navigateTo({ url: `/pages/PetTimeline/index?petId=${activePet.id}` })
                }
              >
                <Text style={{ fontSize: PET_UI_TEXT.body }}>查看时间线</Text>
              </View>
              <View
                className="flex-1 h-[74rpx] inline-flex px-[18rpx] bg-[#ffffff] justify-center items-center"
                style={tabStyle}
                onClick={() =>
                  Taro.navigateTo({ url: `/pages/PetReport/index?petId=${activePet.id}` })
                }
              >
                <Text style={{ fontSize: PET_UI_TEXT.body }}>查看报告</Text>
              </View>
            </View>
          </View>
        ) : null}

        {error ? (
          <View className="mb-2 px-1">
            <Text className="text-[#d65a31]" style={{ fontSize: PET_UI_TEXT.caption }}>
              {error}
            </Text>
          </View>
        ) : null}

        <View className="flex w-full h-[72rpx] justify-between items-center gap-[18rpx] mb-[16rpx]">
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
                    url: `/pages/AddPetRecord/index?petId=${currentPetId}&date=${selectedDate}&mode=record&returnTo=schedule`,
                  })
                }
                onAddExpense={() =>
                  Taro.navigateTo({
                    url: `/pages/AddPetRecord/index?petId=${currentPetId}&date=${selectedDate}&mode=expense&returnTo=schedule`,
                  })
                }
                onAddCare={() =>
                  Taro.navigateTo({
                    url: `/pages/AddPetRecord/index?petId=${currentPetId}&date=${selectedDate}&mode=care&returnTo=schedule`,
                  })
                }
                onEdit={(item) =>
                  Taro.navigateTo({
                    url: `/pages/AddPetRecord/index?petId=${currentPetId}&date=${selectedDate}&mode=${item.sourceType}&sourceId=${item.sourceId}&returnTo=schedule`,
                  })
                }
                onDelete={deleteRecordItem}
              />
            ) : (
              <ReminderTab
                reminders={petReminders}
                onAdd={() =>
                  Taro.navigateTo({
                    url: `/pages/AddPetReminder/index?petId=${currentPetId}&date=${selectedDate}&returnTo=schedule`,
                  })
                }
                onToggle={switchReminder}
                onEdit={(id) =>
                  Taro.navigateTo({
                    url: `/pages/AddPetReminder/index?petId=${currentPetId}&date=${selectedDate}&scheduleId=${id}&returnTo=schedule`,
                  })
                }
                onDelete={deleteReminder}
              />
            )}
          </View>
        ) : null}

        {showLoginState ? (
          <View className="mt-4 rounded-[28rpx] bg-white px-[28rpx] py-[32rpx] shadow-[0_18rpx_36rpx_rgba(0,0,0,0.06)]">
            <Text
              className="text-[#2c2c2c] font-semibold"
              style={{ fontSize: PET_UI_TEXT.title }}
            >
              登录后查看你的宠物日程
            </Text>
            <Text
              className="text-[#7a7a7a] mt-[12rpx] block leading-[1.6]"
              style={{ fontSize: PET_UI_TEXT.body }}
            >
              提醒、护理、花销和日常记录都会跟随账号同步，换设备也能继续看。
            </Text>
            <View
              className="mt-[20rpx] inline-flex h-[74rpx] px-[26rpx] bg-[#FFD93B] items-center"
              style={tabStyle}
              onClick={() => ensureLoggedIn('/pages/PetSchedule/index')}
            >
              <Text style={{ fontSize: PET_UI_TEXT.body }}>去微信登录</Text>
            </View>
          </View>
        ) : null}

        {showNoPetState ? (
          <View className="mt-4 rounded-[28rpx] bg-white px-[28rpx] py-[32rpx] shadow-[0_18rpx_36rpx_rgba(0,0,0,0.06)]">
            <Text
              className="text-[#2c2c2c] font-semibold"
              style={{ fontSize: PET_UI_TEXT.title }}
            >
              还没有宠物档案
            </Text>
            <Text
              className="text-[#7a7a7a] mt-[12rpx] block leading-[1.6]"
              style={{ fontSize: PET_UI_TEXT.body }}
            >
              先添加一只宠物，后面才能开始管理提醒和照护记录。
            </Text>
            <View
              className="mt-[20rpx] inline-flex h-[74rpx] px-[26rpx] bg-[#FFD93B] items-center"
              style={tabStyle}
              onClick={() => Taro.navigateTo({ url: '/pages/EditPetProfile/index' })}
            >
              <Text style={{ fontSize: PET_UI_TEXT.body }}>去添加宠物</Text>
            </View>
          </View>
        ) : null}

        {showInvalidPetState ? (
          <View className="mt-4 rounded-[28rpx] bg-white px-[28rpx] py-[32rpx] shadow-[0_18rpx_36rpx_rgba(0,0,0,0.06)]">
            <Text
              className="text-[#2c2c2c] font-semibold"
              style={{ fontSize: PET_UI_TEXT.title }}
            >
              请先重新选择宠物
            </Text>
            <Text
              className="text-[#7a7a7a] mt-[12rpx] block"
              style={{ fontSize: PET_UI_TEXT.body }}
            >
              当前日程页没有绑定到有效宠物。你可以直接点上方宠物标签，切回某一只宠物后再继续看提醒和记录。
            </Text>
          </View>
        ) : null}

        {showEmptyDataState ? (
          <View className="mt-4 rounded-[28rpx] bg-white px-[28rpx] py-[28rpx] shadow-[0_18rpx_36rpx_rgba(0,0,0,0.06)]">
            <Text
              className="text-[#2c2c2c] font-semibold"
              style={{ fontSize: PET_UI_TEXT.title }}
            >
              {activePet
                ? `${activePet.name} 在这一天还没有${activeTab === TabType.Record ? '记录' : '提醒'}`
                : activeTab === TabType.Record
                  ? '这一天还没有记录'
                  : '这一天还没有提醒'}
            </Text>
            <Text
              className="text-[#7a7a7a] mt-[12rpx] block leading-[1.6]"
              style={{ fontSize: PET_UI_TEXT.body }}
            >
              {activeTab === TabType.Record
                ? `可以先给${activePet?.name || '这只宠物'}补一条日常、花销或护理记录，时间线和统计页也会同步更新。`
                : `可以先给${activePet?.name || '这只宠物'}添加一个提醒，让喂养、护理和复查安排更清楚。`}
            </Text>
            {activePet ? (
              <View className="mt-[18rpx] flex gap-[12rpx]">
                {activeTab === TabType.Record ? (
                  <>
                    <View
                      className="flex-1 inline-flex h-[74rpx] px-[20rpx] bg-[#FFD93B] justify-center items-center"
                      style={tabStyle}
                      onClick={() =>
                        Taro.navigateTo({
                          url: `/pages/AddPetRecord/index?petId=${activePet.id}&date=${selectedDate}&mode=record&returnTo=schedule`,
                        })
                      }
                    >
                      <Text style={{ fontSize: PET_UI_TEXT.body }}>新增日常记录</Text>
                    </View>
                    <View
                      className="flex-1 inline-flex h-[74rpx] px-[20rpx] bg-[#ffffff] justify-center items-center"
                      style={tabStyle}
                      onClick={() =>
                        Taro.navigateTo({
                          url: `/pages/AddPetRecord/index?petId=${activePet.id}&date=${selectedDate}&mode=care&returnTo=schedule`,
                        })
                      }
                    >
                      <Text style={{ fontSize: PET_UI_TEXT.body }}>新增护理记录</Text>
                    </View>
                  </>
                ) : (
                  <>
                    <View
                      className="inline-flex h-[74rpx] px-[26rpx] bg-[#FFD93B] justify-center items-center"
                      style={tabStyle}
                      onClick={() =>
                        Taro.navigateTo({
                          url: `/pages/AddPetReminder/index?petId=${activePet.id}&date=${selectedDate}&returnTo=schedule`,
                        })
                      }
                    >
                      <Text style={{ fontSize: PET_UI_TEXT.body }}>新增提醒</Text>
                    </View>
                    <View
                      className="inline-flex h-[74rpx] px-[26rpx] bg-[#ffffff] justify-center items-center"
                      style={tabStyle}
                      onClick={() =>
                        Taro.navigateTo({
                          url: `/pages/PetServiceCenter/index?mode=member&petId=${activePet.id}`,
                        })
                      }
                    >
                      <Text style={{ fontSize: PET_UI_TEXT.body }}>查看服务概览</Text>
                    </View>
                  </>
                )}
              </View>
            ) : null}
          </View>
        ) : null}
      </View>
    </BasicLayout>
  );
});

export default PetSchedule;
