import BasicLayout from '@/layout/basicLayout';
import { View, Text } from '@tarojs/components';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter, useDidShow } from '@tarojs/taro';
import { PET_UI, PET_UI_SHADOW } from '@/constants/petUi';
import { getCareRecordListData, getScheduleListData, mapCareRecordToCareLogModel, mapScheduleToReminderModel } from '@/api/data';
import { usePetApiPets } from '@/hooks/usePetApiPets';
import { PetCareLogModel, PetReminderModel } from '@/types/pet';
import { formatLocalDateKey } from '@/utils/formatDate';
import { ensureLoggedIn, isLoggedIn } from '@/utils/authState';

const monthKey = (date: Date) => `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, '0')}`;

const PetCareStats = memo(function PetCareStats() {
  const { params } = useRouter();
  const { pets, activePet } = usePetApiPets();
  const [careLogs, setCareLogs] = useState<PetCareLogModel[]>([]);
  const [reminders, setReminders] = useState<PetReminderModel[]>([]);
  const loggedIn = isLoggedIn();

  const petId = params.petId || activePet?.id || '';
  const pet = pets.find((item) => item.id === petId) || activePet;

  const refreshCareData = useCallback(() => {
    if (!petId) {
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
  }, [petId]);

  useEffect(() => {
    refreshCareData();
  }, [refreshCareData]);

  useDidShow(() => {
    refreshCareData();
  });

  const careList = useMemo(() => {
    return careLogs.filter((item) => item.petId === petId).sort((a, b) => b.createdAt - a.createdAt);
  }, [careLogs, petId]);

  const careTypes = useMemo(() => {
    const set = new Set(careList.map((item) => item.careType));
    return ['全部', ...Array.from(set)];
  }, [careList]);

  const [activeType, setActiveType] = useState('全部');

  const filteredCareList = useMemo(() => {
    return activeType === '全部' ? careList : careList.filter((item) => item.careType === activeType);
  }, [activeType, careList]);

  const thisMonthKey = monthKey(new Date());
  const monthCount = careList.filter((item) => item.date.startsWith(thisMonthKey)).length;
  const upcomingCount = careList.filter((item) => item.nextDate && item.nextDate >= formatLocalDateKey(new Date())).length;
  const overdueCount = careList.filter((item) => item.nextDate && item.nextDate < formatLocalDateKey(new Date())).length;
  const recentCare = careList[0];

  const getReminderStatus = (careType: string, nextDate?: string) => {
    if (!nextDate) {
      return { label: '无需提醒', color: '#8a8a8a' };
    }

    const related = reminders.find(
      (item) =>
        item.petId === petId &&
        item.type === 'care' &&
        item.date === nextDate &&
        item.title.includes(careType)
    );

    if (related?.enabled) {
      return { label: '提醒已开启', color: '#33b36b' };
    }

    if (related && !related.enabled) {
      return { label: '提醒已关闭', color: '#f59e0b' };
    }

    if (nextDate < formatLocalDateKey(new Date())) {
      return { label: '提醒已过期', color: '#ef4444' };
    }

    return { label: '待创建提醒', color: '#3b82f6' };
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
      <View className="px-8 pt-4 pb-[120rpx]">
        {!loggedIn ? (
          <View
            className="mb-4 p-5 rounded-[16rpx] border-[3rpx] border-solid border-[#262626] bg-white"
            style={{ boxShadow: PET_UI_SHADOW }}
          >
            <Text className="text-[30rpx] font-bold block">登录后查看护理档案</Text>
            <Text className="text-[22rpx] text-[#666] mt-2 block">
              护理时间轴、待跟进提醒和护理类型统计都会跟随账号保存。
            </Text>
            <View
              className="mt-3 h-[72rpx] rounded-[36rpx] bg-[#FFD93B] border-[2rpx] border-solid border-[#262626] flex items-center justify-center"
              onClick={() => ensureLoggedIn('/pages/PetCareStats/index')}
            >
              <Text className="text-[24rpx] font-semibold">去微信登录</Text>
            </View>
          </View>
        ) : null}

        {loggedIn && !petId ? (
          <View
            className="mb-4 p-5 rounded-[16rpx] border-[3rpx] border-solid border-[#262626] bg-white"
            style={{ boxShadow: PET_UI_SHADOW }}
          >
            <Text className="text-[30rpx] font-bold block">还没有宠物档案</Text>
            <Text className="text-[22rpx] text-[#666] mt-2 block">
              先添加宠物，后面的护理记录和复查提醒才会开始累计。
            </Text>
            <View
              className="mt-3 h-[72rpx] rounded-[36rpx] bg-[#FFD93B] border-[2rpx] border-solid border-[#262626] flex items-center justify-center"
              onClick={() => Taro.navigateTo({ url: '/pages/EditPetProfile/index' })}
            >
              <Text className="text-[24rpx] font-semibold">去添加宠物</Text>
            </View>
          </View>
        ) : null}

        <View
          className="mb-4 p-4 rounded-[16rpx] border-[3rpx] border-solid border-[#262626] bg-[#f4f4f4]"
          style={{ boxShadow: PET_UI_SHADOW }}
        >
          <Text className="text-[30rpx] font-bold block">{pet?.name || '暂无'}的护理档案</Text>
          <Text className="text-[24rpx] text-[#666] mt-1 block">本月护理次数：{monthCount}</Text>
          <Text className="text-[24rpx] text-[#666]">累计护理记录：{careList.length}</Text>
          {recentCare ? (
            <Text className="text-[24rpx] text-[#666] mt-1 block">
              最近一次：{recentCare.careType} · {recentCare.date}
            </Text>
          ) : null}
        </View>

        <View className="grid grid-cols-3 gap-3 mb-4">
          <View
            className="p-4 rounded-[16rpx] border-[3rpx] border-solid border-[#262626] bg-white"
            style={{ boxShadow: PET_UI_SHADOW }}
          >
            <Text className="text-[22rpx] text-[#666]">待跟进</Text>
            <Text className="text-[34rpx] font-bold text-[#2c2c2c] mt-1 block">{upcomingCount}</Text>
          </View>
          <View
            className="p-4 rounded-[16rpx] border-[3rpx] border-solid border-[#262626] bg-white"
            style={{ boxShadow: PET_UI_SHADOW }}
          >
            <Text className="text-[22rpx] text-[#666]">已过期</Text>
            <Text className="text-[34rpx] font-bold text-[#d65a31] mt-1 block">{overdueCount}</Text>
          </View>
          <View
            className="p-4 rounded-[16rpx] border-[3rpx] border-solid border-[#262626] bg-white"
            style={{ boxShadow: PET_UI_SHADOW }}
          >
            <Text className="text-[22rpx] text-[#666]">护理类型</Text>
            <Text className="text-[34rpx] font-bold text-[#2c2c2c] mt-1 block">
              {Math.max(careTypes.length - 1, 0)}
            </Text>
          </View>
        </View>

        <View className="flex flex-wrap gap-2 mb-4">
          {careTypes.map((type) => (
            <View
              key={type}
              className="px-3 py-2 rounded-[16rpx] border-[2rpx] border-solid border-[#262626]"
              style={{ backgroundColor: activeType === type ? '#bdeeff' : '#f4f4f4' }}
              onClick={() => setActiveType(type)}
            >
              <Text className="text-[22rpx]">{type}</Text>
            </View>
          ))}
        </View>

        <View
          className="p-4 rounded-[16rpx] border-[3rpx] border-solid border-[#262626] bg-[#f4f4f4]"
          style={{ boxShadow: PET_UI_SHADOW }}
        >
          <Text className="text-[30rpx] font-bold mb-3 block">护理时间轴</Text>
          {filteredCareList.length ? (
            filteredCareList.map((item) => {
              const status = getReminderStatus(item.careType, item.nextDate);
              return (
                <View key={item.id} className="flex gap-3 mb-3">
                  <View className="w-[16rpx] flex flex-col items-center pt-2">
                    <View className="w-[12rpx] h-[12rpx] rounded-full bg-[#ff8f3d] border-[1rpx] border-solid border-[#262626]" />
                    <View className="w-[2rpx] flex-1 bg-[#b7b7b7] mt-1" />
                  </View>

                  <View className="flex-1 p-3 rounded-[12rpx] border-[2rpx] border-solid border-[#262626] bg-white">
                  <View className="flex items-center justify-between mb-1">
                    <Text className="text-[25rpx] font-medium">{item.careType}</Text>
                    <Text className="text-[21rpx] text-[#666]">
                      {item.date} {item.time}
                    </Text>
                  </View>
                  <View className="mb-2">
                    <Text
                      className="text-[20rpx] inline-block px-[10rpx] py-[4rpx] rounded-[999rpx]"
                      style={{
                        backgroundColor:
                          status.label === '提醒已开启'
                            ? '#EAF9EF'
                            : status.label === '提醒已过期'
                              ? '#FDECEC'
                              : status.label === '提醒已关闭'
                                ? '#FFF4DE'
                                : '#EAF2FF',
                        color: status.color,
                      }}
                    >
                      {status.label}
                    </Text>
                  </View>
                  <Text className="text-[22rpx] text-[#4f4f4f] mb-1">结果：{item.result}</Text>
                  {item.note ? <Text className="text-[21rpx] text-[#7a7a7a] mb-1">备注：{item.note}</Text> : null}
                  <View className="flex items-center justify-between">
                      <Text className="text-[21rpx] text-[#7a7a7a]">下次：{item.nextDate || '未设置'}</Text>
                      <Text className="text-[21rpx]" style={{ color: status.color }}>
                        {status.label}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })
          ) : (
            <Text className="text-[24rpx] text-[#8a8a8a]">还没有护理记录，可以先补一条洗护、驱虫、疫苗或体检记录。</Text>
          )}
        </View>
      </View>
    </BasicLayout>
  );
});

export default PetCareStats;
