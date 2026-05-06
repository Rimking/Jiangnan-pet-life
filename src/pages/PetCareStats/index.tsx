import BasicLayout from '@/layout/basicLayout';
import { View, Text } from '@tarojs/components';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import Taro, { useDidShow, useRouter } from '@tarojs/taro';
import { PET_UI, PET_UI_SHADOW } from '@/constants/petUi';
import {
  getCareRecordListData,
  getScheduleListData,
  mapCareRecordToCareLogModel,
  mapScheduleToReminderModel,
} from '@/api/data';
import { usePetApiPets } from '@/hooks/usePetApiPets';
import { PetCareLogModel, PetReminderModel } from '@/types/pet';
import { formatLocalDateKey } from '@/utils/formatDate';
import { setStoredActivePetId, switchTabWithActivePet } from '@/utils/activePetState';
import { ensureLoggedIn, isLoggedIn } from '@/utils/authState';

const monthKey = (date: Date) =>
  `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, '0')}`;
const ALL_TYPE = '全部';

const getStatusTone = (label: string) => {
  if (label === '提醒已开启') {
    return {
      color: '#2E8B57',
      backgroundColor: '#E8F7EE',
    };
  }

  if (label === '提醒已关闭') {
    return {
      color: '#C58A12',
      backgroundColor: '#FFF4DE',
    };
  }

  if (label === '已过期') {
    return {
      color: '#D65A31',
      backgroundColor: '#FDECEC',
    };
  }

  return {
    color: '#3B82F6',
    backgroundColor: '#EAF2FF',
  };
};

const PetCareStats = memo(function PetCareStats() {
  const { params } = useRouter();
  const preferredPetId = params.petId || '';
  const { pets, activePet, activePetId, setActivePetId } = usePetApiPets(preferredPetId);
  const [careLogs, setCareLogs] = useState<PetCareLogModel[]>([]);
  const [reminders, setReminders] = useState<PetReminderModel[]>([]);
  const [activeType, setActiveType] = useState(ALL_TYPE);
  const loggedIn = isLoggedIn();

  const petId = preferredPetId || activePetId || activePet?.id || '';
  const pet = pets.find((item) => item.id === petId) || activePet;
  const hasValidPetContext = Boolean(petId && pet);
  const ensureActivePetContext = () => {
    if (
      !ensureLoggedIn(
        `/pages/PetCareStats/index${preferredPetId ? `?petId=${preferredPetId}` : ''}`
      )
    ) {
      return false;
    }

    if (petId && pet) {
      return true;
    }

    Taro.showToast({
      title: pets.length ? '请先选择有效宠物' : '请先选择或创建宠物',
      icon: 'none',
    });
    return false;
  };
  const openPetPage = (url: string) => {
    if (!ensureActivePetContext()) {
      return;
    }
    Taro.navigateTo({ url });
  };

  const refreshCareData = useCallback(() => {
    if (!loggedIn) {
      setCareLogs([]);
      setReminders([]);
      return Promise.resolve();
    }

    if (!petId || !pet) {
      setCareLogs([]);
      setReminders([]);
      return Promise.resolve();
    }

    return Promise.all([getCareRecordListData({ petId }), getScheduleListData({ petId })])
      .then(([careList, scheduleList]) => {
        setCareLogs(careList.map(mapCareRecordToCareLogModel));
        setReminders(scheduleList.map(mapScheduleToReminderModel));
      })
      .catch(() => {
        setCareLogs([]);
        setReminders([]);
      });
  }, [loggedIn, pet, petId]);

  useEffect(() => {
    if (petId) {
      setStoredActivePetId(petId);
    }
    refreshCareData();
  }, [petId, refreshCareData]);

  useDidShow(() => {
    refreshCareData();
  });

  const careList = useMemo(() => {
    return careLogs
      .filter((item) => item.petId === petId)
      .sort((left, right) => right.createdAt - left.createdAt);
  }, [careLogs, petId]);

  const careTypes = useMemo(() => {
    const types = Array.from(
      new Set(careList.map((item) => item.careType).filter(Boolean))
    );
    return [ALL_TYPE, ...types];
  }, [careList]);

  useEffect(() => {
    if (!careTypes.includes(activeType)) {
      setActiveType(ALL_TYPE);
    }
  }, [activeType, careTypes]);

  const filteredCareList = useMemo(() => {
    if (activeType === ALL_TYPE) {
      return careList;
    }
    return careList.filter((item) => item.careType === activeType);
  }, [activeType, careList]);

  const thisMonthKey = monthKey(new Date());
  const monthCount = careList.filter((item) => item.date.startsWith(thisMonthKey)).length;
  const upcomingCount = careList.filter(
    (item) => item.nextDate && item.nextDate >= today
  ).length;
  const overdueCount = careList.filter(
    (item) => item.nextDate && item.nextDate < today
  ).length;
  const recentCare = careList[0];

  const getReminderStatus = (careType: string, nextDate?: string) => {
    if (!nextDate) {
      return { label: '无需提醒' };
    }

    const related = reminders.find(
      (item) =>
        item.petId === petId &&
        item.type === 'care' &&
        item.date === nextDate &&
        item.title.includes(careType)
    );

    if (related?.enabled) {
      return { label: '提醒已开启' };
    }

    if (related && !related.enabled) {
      return { label: '提醒已关闭' };
    }

    if (nextDate < today) {
      return { label: '已过期' };
    }

    return { label: '待创建提醒' };
  };

  return (
    <BasicLayout
      wrapClassName="w-full h-full"
      wrapStyle={{
        backgroundImage: PET_UI.pageBackground,
        minHeight: '100vh',
      }}
      navOptions={{
        navTitle: '护理记录',
        needBack: true,
      }}
    >
      <View className="px-6 pt-4 pb-[120rpx]">
        <View className="mb-4 flex flex-wrap gap-2">
          {pets.map((item) => (
            <View
              key={item.id}
              className="px-4 py-2 rounded-[16rpx] border-[2rpx] border-solid border-[#262626]"
              style={{ backgroundColor: petId === item.id ? '#FFD93B' : '#F4F4F4' }}
              onClick={() => {
                setActivePetId(item.id);
                setStoredActivePetId(item.id);
                Taro.redirectTo({ url: `/pages/PetCareStats/index?petId=${item.id}` });
              }}
            >
              <Text className="text-[24rpx] text-[#2B2B2B]">{item.name}</Text>
            </View>
          ))}
        </View>

        {!loggedIn ? (
          <View
            className="mb-5 rounded-[20rpx] border-[3rpx] border-solid border-[#262626] bg-white p-5"
            style={{ boxShadow: PET_UI_SHADOW }}
          >
            <Text className="text-[30rpx] font-semibold text-[#2B2B2B] block">
              登录后查看护理档案
            </Text>
            <Text className="text-[22rpx] text-[#666] mt-2 block">
              护理时间线、待跟进提醒和护理类型统计都会跟随账号保存，适合后续继续补全演示数据。
            </Text>
            <View
              className="mt-4 h-[76rpx] rounded-[38rpx] bg-[#FFD93B] border-[2rpx] border-solid border-[#262626] flex items-center justify-center"
              onClick={() =>
                ensureLoggedIn(
                  `/pages/PetCareStats/index${preferredPetId ? `?petId=${preferredPetId}` : ''}`
                )
              }
            >
              <Text className="text-[24rpx] font-semibold text-[#5D4510]">去微信登录</Text>
            </View>
          </View>
        ) : null}

        {loggedIn && !pets.length ? (
          <View
            className="mb-5 rounded-[20rpx] border-[3rpx] border-solid border-[#262626] bg-white p-5"
            style={{ boxShadow: PET_UI_SHADOW }}
          >
            <Text className="text-[30rpx] font-semibold text-[#2B2B2B] block">
              还没有宠物档案
            </Text>
            <Text className="text-[22rpx] text-[#666] mt-2 block">
              先添加宠物，后面的洗护、驱虫、疫苗和复查记录才会开始沉淀成护理时间线。
            </Text>
            <View
              className="mt-4 h-[76rpx] rounded-[38rpx] bg-[#FFD93B] border-[2rpx] border-solid border-[#262626] flex items-center justify-center"
              onClick={() => Taro.navigateTo({ url: '/pages/EditPetProfile/index' })}
            >
              <Text className="text-[24rpx] font-semibold text-[#5D4510]">去添加宠物</Text>
            </View>
          </View>
        ) : null}

        {loggedIn && pets.length > 0 && !hasValidPetContext ? (
          <View
            className="mb-4 p-5 rounded-[16rpx] border-[3rpx] border-solid border-[#262626] bg-white"
            style={{ boxShadow: PET_UI_SHADOW }}
          >
            <Text className="text-[30rpx] font-bold block">请先重新选择宠物</Text>
            <Text className="text-[22rpx] text-[#666] mt-2 block">
              当前护理页面没有绑定到有效宠物，你可以直接从上方切换到一只现有宠物继续查看护理档案。
            </Text>
          </View>
        ) : null}

        <View
          className="mb-5 rounded-[24rpx] border-[3rpx] border-solid border-[#262626] bg-[#F4F4F4] p-5"
          style={{ boxShadow: PET_UI_SHADOW }}
        >
          <Text className="text-[30rpx] font-bold block">
            {pet?.name || (loggedIn && pets.length > 0 ? '未选择有效宠物' : '暂无')}
            的护理档案
          </Text>
          <Text className="text-[24rpx] text-[#666] mt-1 block">
            本月护理次数：{monthCount}
          </Text>
          <Text className="text-[24rpx] text-[#666]">累计护理记录：{careList.length}</Text>
          {recentCare ? (
            <Text className="text-[22rpx] text-[#666] mt-1 block">
              最近一次：{recentCare.careType} · {recentCare.date}
            </Text>
          ) : (
            <Text className="text-[22rpx] text-[#888] mt-1 block">
              还没有护理记录，可以先补一条最近完成的事项。
            </Text>
          )}
        </View>

        {hasValidPetContext ? (
          <View className="grid grid-cols-2 gap-3 mb-4">
            <View
              className="rounded-[20rpx] border-[3rpx] border-solid border-[#262626] bg-white p-4"
              style={{ boxShadow: PET_UI_SHADOW }}
              onClick={() =>
                openPetPage(
                  `/pages/AddPetRecord/index?petId=${petId}&date=${today}&mode=care`
                )
              }
            >
              <Text className="text-[26rpx] font-semibold text-[#2B2B2B]">新增护理</Text>
              <Text className="text-[20rpx] text-[#7A7A7A] mt-2 block">
                继续补一条洗护、驱虫、疫苗、复查或体检记录。
              </Text>
            </View>
            <View
              className="rounded-[20rpx] border-[3rpx] border-solid border-[#262626] bg-white p-4"
              style={{ boxShadow: PET_UI_SHADOW }}
              onClick={() => switchTabWithActivePet('/pages/PetSchedule/index', petId)}
            >
              <Text className="text-[26rpx] font-semibold text-[#2B2B2B]">查看日程</Text>
              <Text className="text-[20rpx] text-[#7A7A7A] mt-2 block">
                回到这只宠物的护理提醒和复查安排，继续做日程管理。
              </Text>
            </View>
          </View>
        ) : null}

        <View className="grid grid-cols-3 gap-3 mb-5">
          <View
            className="rounded-[20rpx] border-[3rpx] border-solid border-[#262626] bg-white p-4"
            style={{ boxShadow: PET_UI_SHADOW }}
          >
            <Text className="text-[22rpx] text-[#666] block">待跟进</Text>
            <Text className="text-[34rpx] font-semibold text-[#2B2B2B] mt-1 block">
              {upcomingCount}
            </Text>
          </View>
          <View
            className="rounded-[20rpx] border-[3rpx] border-solid border-[#262626] bg-white p-4"
            style={{ boxShadow: PET_UI_SHADOW }}
          >
            <Text className="text-[22rpx] text-[#666] block">已过期</Text>
            <Text className="text-[34rpx] font-semibold text-[#D65A31] mt-1 block">
              {overdueCount}
            </Text>
          </View>
          <View
            className="rounded-[20rpx] border-[3rpx] border-solid border-[#262626] bg-white p-4"
            style={{ boxShadow: PET_UI_SHADOW }}
          >
            <Text className="text-[22rpx] text-[#666] block">护理类型</Text>
            <Text className="text-[34rpx] font-semibold text-[#2B2B2B] mt-1 block">
              {Math.max(careTypes.length - 1, 0)}
            </Text>
          </View>
        </View>

        <View className="mb-5">
          <Text className="text-[24rpx] font-semibold text-[#2B2B2B] mb-3 block">
            按护理类型筛选
          </Text>
          <View className="flex flex-wrap gap-2">
            {careTypes.map((type) => (
              <View
                key={type}
                className="px-4 py-2 rounded-[999rpx] border-[2rpx] border-solid border-[#262626]"
                style={{ backgroundColor: activeType === type ? '#BDEEFF' : '#F4F4F4' }}
                onClick={() => setActiveType(type)}
              >
                <Text className="text-[22rpx] text-[#2B2B2B]">{type}</Text>
              </View>
            ))}
          </View>
        </View>

        <View
          className="rounded-[24rpx] border-[3rpx] border-solid border-[#262626] bg-[#F4F4F4] p-5"
          style={{ boxShadow: PET_UI_SHADOW }}
        >
          <View className="mb-4 flex items-center justify-between">
            <Text className="text-[30rpx] font-semibold text-[#2B2B2B] block">
              护理时间线
            </Text>
            <Text className="text-[20rpx] text-[#7A7A7A]">
              {filteredCareList.length} 条记录
            </Text>
          </View>

          {filteredCareList.length ? (
            filteredCareList.map((item, index) => {
              const status = getReminderStatus(item.careType, item.nextDate);
              const tone = getStatusTone(status.label);

              return (
                <View
                  key={item.id}
                  className={
                    index === filteredCareList.length - 1 ? 'flex gap-3' : 'flex gap-3 mb-4'
                  }
                >
                  <View className="w-[16rpx] flex flex-col items-center pt-2">
                    <View className="w-[12rpx] h-[12rpx] rounded-full bg-[#FF8F3D] border-[1rpx] border-solid border-[#262626]" />
                    {index !== filteredCareList.length - 1 ? (
                      <View className="w-[2rpx] flex-1 bg-[#B7B7B7] mt-1" />
                    ) : null}
                  </View>

                  <View className="flex-1 rounded-[16rpx] border-[2rpx] border-solid border-[#262626] bg-white p-4">
                    <View className="flex items-start justify-between gap-3">
                      <View className="flex-1">
                        <Text className="text-[26rpx] font-semibold text-[#2B2B2B] block">
                          {item.careType}
                        </Text>
                        <Text className="text-[21rpx] text-[#666] mt-1 block">
                          {item.date} {item.time}
                        </Text>
                      </View>
                      <Text
                        className="text-[20rpx] px-[12rpx] py-[6rpx] rounded-[999rpx]"
                        style={tone}
                      >
                        {status.label}
                      </Text>
                    </View>

                    <Text className="text-[22rpx] text-[#4F4F4F] mt-3 block">
                      结果：{item.result || '已完成'}
                    </Text>
                    {item.note ? (
                      <Text className="text-[21rpx] text-[#7A7A7A] mt-2 block">
                        备注：{item.note}
                      </Text>
                    ) : null}

                    <View className="mt-3 rounded-[14rpx] bg-[#F8F8F8] p-3">
                      <Text className="text-[21rpx] text-[#666] block">
                        下次安排：{item.nextDate || '暂未设置'}
                      </Text>
                      <Text
                        className="text-[21rpx] mt-1 block"
                        style={{ color: tone.color }}
                      >
                        提醒状态：{status.label}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })
          ) : (
            <View className="rounded-[18rpx] bg-white p-4">
              <Text className="text-[24rpx] text-[#8A8A8A] leading-[1.7]">
                {pet?.name || '当前宠物'}
                还没有护理记录，可以先补一条洗护、驱虫、疫苗或复查记录，再回来看护理时间线和提醒状态。
              </Text>
              {hasValidPetContext ? (
                <View className="flex gap-3 mt-4">
                  <View
                    className="flex-1 px-4 py-3 rounded-[16rpx] bg-[#BDEEFF] flex items-center justify-center"
                    onClick={() =>
                      openPetPage(
                        `/pages/AddPetRecord/index?petId=${petId}&date=${today}&mode=care`
                      )
                    }
                  >
                    <Text className="text-[22rpx] font-semibold text-[#2C5F7A]">
                      新增护理记录
                    </Text>
                  </View>
                  <View
                    className="flex-1 px-4 py-3 rounded-[16rpx] bg-white border-[2rpx] border-solid border-[#CBE5F0] flex items-center justify-center"
                    onClick={() =>
                      switchTabWithActivePet('/pages/PetSchedule/index', petId)
                    }
                  >
                    <Text className="text-[22rpx] text-[#3B82F6]">查看日程</Text>
                  </View>
                </View>
              ) : null}
            </View>
          )}
        </View>
      </View>
    </BasicLayout>
  );
});

export default PetCareStats;
