import BasicLayout from '@/layout/basicLayout';
import { View, Text } from '@tarojs/components';
import { memo, useMemo, useState } from 'react';
import Taro, { useDidShow } from '@tarojs/taro';
import { formatLocalDateKey } from '@/utils/formatDate';
import MenuItem from './components/MenuItem';
import { usePetApiPets } from '@/hooks/usePetApiPets';
import {
  getCareRecordListData,
  getExpenseListData,
  getRecordListData,
  getScheduleListData,
  mapCareRecordToCareLogModel,
  mapExpenseToExpenseModel,
  mapRecordToRecordModel,
  mapScheduleToReminderModel,
} from '@/api/data';
import { PetCareLogModel, PetExpenseModel, PetRecordModel, PetReminderModel } from '@/types/pet';

const getAgeLabel = (birthday: string) => {
  const birth = new Date(birthday);
  if (Number.isNaN(birth.getTime())) {
    return '年龄未知';
  }

  const now = new Date();
  const months = Math.max(
    0,
    (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth())
  );

  if (months < 1) {
    return '1个月内';
  }
  if (months < 12) {
    return `${months}个月`;
  }

  const years = Math.floor(months / 12);
  const remainMonths = months % 12;
  return remainMonths === 0 ? `${years}岁` : `${years}岁${remainMonths}个月`;
};

const PetOwner = memo(function PetOwner() {
  const { pets, activePet, activePetId, setActivePetId } = usePetApiPets();
  const [reminders, setReminders] = useState<PetReminderModel[]>([]);
  const [expenses, setExpenses] = useState<PetExpenseModel[]>([]);
  const [careLogs, setCareLogs] = useState<PetCareLogModel[]>([]);
  const [records, setRecords] = useState<PetRecordModel[]>([]);

  useDidShow(() => {
    Promise.all([
      getScheduleListData({}),
      getExpenseListData({}),
      getCareRecordListData({}),
      getRecordListData({}),
    ])
      .then(([scheduleList, expenseList, careList, recordList]) => {
        setReminders(scheduleList.map(mapScheduleToReminderModel));
        setExpenses(expenseList.map(mapExpenseToExpenseModel));
        setCareLogs(careList.map(mapCareRecordToCareLogModel));
        setRecords(recordList.map(mapRecordToRecordModel));
      })
      .catch(() => {
        setReminders([]);
        setExpenses([]);
        setCareLogs([]);
        setRecords([]);
      });
  });

  const reminderCount = reminders.filter((item) => item.petId === activePetId && item.enabled).length;
  const today = formatLocalDateKey(new Date());
  const achievementCount =
    records.filter((item) => item.petId === activePetId).length +
    expenses.filter((item) => item.petId === activePetId).length +
    careLogs.filter((item) => item.petId === activePetId).length;
  const activeDays = useMemo(() => {
    if (!activePet?.birthday) {
      return 0;
    }
    const birth = new Date(activePet.birthday);
    if (Number.isNaN(birth.getTime())) {
      return 0;
    }
    const now = new Date();
    const diff = now.getTime() - birth.getTime();
    return Math.max(1, Math.floor(diff / (1000 * 60 * 60 * 24)));
  }, [activePet?.birthday]);

  const quickMenus = [
    {
      icon: '👑',
      title: '会员中心',
      bg: '#F6F3ED',
      onClick: () => Taro.navigateTo({ url: '/pages/ChooseSelectCmp/index' }),
    },
    {
      icon: '🧾',
      title: '订阅中心',
      bg: '#EEF2F8',
      onClick: () => Taro.navigateTo({ url: '/pages/PetExpenseStats/index' }),
    },
    {
      icon: '📨',
      title: '联系我们',
      bg: '#F0EEF8',
      onClick: () => Taro.navigateTo({ url: '/pages/SendPetSchedule/index' }),
    },
  ];

  const menuItems = [
    {
      icon: '📅',
      title: '日程管理',
      subtitle: '管理提醒和记录',
      hasBadge: reminders.length > 0,
      badgeText: String(reminders.length),
      onClick: () => Taro.switchTab({ url: '/pages/PetSchedule/index' }),
    },
    {
      icon: '📊',
      title: '数据统计',
      subtitle: '查看近期花销和护理趋势',
      onClick: () => Taro.navigateTo({ url: '/pages/PetExpenseStats/index' }),
    },
    {
      icon: '💊',
      title: '用药记录',
      subtitle: '追踪药品和疗程',
      onClick: () =>
        Taro.navigateTo({
          url: `/pages/AddPetRecord/index?petId=${activePetId}&date=${today}&mode=care`,
        }),
    },
    {
      icon: '🩺',
      title: '医疗记录',
      subtitle: '门诊和检查留档',
      onClick: () => Taro.navigateTo({ url: `/pages/PetCareStats/index?petId=${activePetId}` }),
    },
    {
      icon: '🧴',
      title: '洗护记录',
      subtitle: '美容与护理时间线',
      onClick: () =>
        Taro.navigateTo({
          url: `/pages/AddPetRecord/index?petId=${activePetId}&date=${today}&mode=care`,
        }),
    },
    {
      icon: '💬',
      title: '日常记录',
      subtitle: '日常健康观察',
      onClick: () =>
        Taro.navigateTo({
          url: `/pages/AddPetRecord/index?petId=${activePetId}&date=${today}&mode=record`,
        }),
    },
    {
      icon: '❓',
      title: '帮助与反馈',
      subtitle: '问题反馈与建议',
      onClick: () => Taro.navigateTo({ url: '/pages/SendPetSchedule/index' }),
    },
  ];

  return (
    <BasicLayout
      wrapClassName="w-full h-full"
      wrapStyle={{
        background: 'linear-gradient(180deg, #FFF0A8 0%, #FFF8DC 42%, #F7F3E2 100%)',
        minHeight: '100vh',
      }}
      navOptions={{ navTitle: '', needBack: false }}
    >
      <View className="px-[22rpx] pt-[28rpx] pb-[42rpx]">
        <View className="flex justify-end gap-[12rpx] mb-[16rpx]">
          <View
            className="w-[44rpx] h-[44rpx] rounded-full border border-[#8D97A6] flex items-center justify-center"
            onClick={() => Taro.navigateTo({ url: '/pages/ChooseSelectCmp/index' })}
          >
            <Text className="text-[22rpx] text-[#5C6675]">◌</Text>
          </View>
          <View
            className="w-[44rpx] h-[44rpx] rounded-full border border-[#8D97A6] flex items-center justify-center"
            onClick={() => Taro.switchTab({ url: '/pages/PetSchedule/index' })}
          >
            <Text className="text-[22rpx] text-[#5C6675]">◉</Text>
          </View>
        </View>

        <View className="flex items-center mb-[18rpx]">
          <View className="w-[112rpx] h-[112rpx] rounded-full bg-[#fff7d7] border-[4rpx] border-[#262626] flex items-center justify-center mr-[16rpx] shadow-[0_8rpx_0_rgba(0,0,0,0.14)]">
            <Text className="text-[56rpx]">{activePet?.avatarEmoji || '🐾'}</Text>
          </View>
          <View className="flex-1">
            <Text className="text-[40rpx] font-semibold text-[#2C3442]">{activePet?.name || '暂无宠物'}</Text>
            <Text className="text-[22rpx] text-[#7B8594] mt-[8rpx]">当前有 {pets.length} 只宠物档案</Text>
          </View>
        </View>

        <View className="bg-white rounded-[28rpx] border-[3rpx] border-[#262626] px-[22rpx] py-[18rpx] mb-[18rpx] shadow-[0_10rpx_0_rgba(0,0,0,0.14)]">
          <View className="flex justify-between items-center">
            <View className="flex-1">
              <Text className="text-[22rpx] text-[#8C95A2]">待处理提醒</Text>
              <Text className="text-[38rpx] font-semibold text-[#2D3441] mt-[4rpx]">{reminderCount}</Text>
            </View>
            <View className="w-[2rpx] h-[72rpx] bg-[#262626] opacity-20" />
            <View className="flex-1 pl-[24rpx]">
              <Text className="text-[22rpx] text-[#8C95A2]">我的成就</Text>
              <Text className="text-[38rpx] font-semibold text-[#2D3441] mt-[4rpx]">{achievementCount}</Text>
            </View>
          </View>
          <View className="mt-[18rpx] rounded-[999rpx] bg-[#FFF7D5] border-[3rpx] border-[#262626] px-[18rpx] py-[12rpx] flex items-center">
            <Text className="text-[30rpx] mr-[12rpx]">🐾</Text>
            <Text className="text-[24rpx] text-[#2D3441] font-semibold">
              与{activePet?.name || '它'}一起已经 {activeDays} 天了
            </Text>
          </View>
        </View>

        <View
          className="rounded-[18rpx] px-[22rpx] py-[18rpx] flex items-center justify-between mb-[18rpx]"
          style={{ background: 'linear-gradient(90deg, #EED7A6 0%, #E7C27C 100%)' }}
          onClick={() => Taro.navigateTo({ url: '/pages/ChooseSelectCmp/index' })}
        >
          <View className="pr-[12rpx]">
            <Text className="text-[26rpx] text-[#5F3E13] font-semibold">开通会员，解锁更多服务</Text>
            <Text className="text-[20rpx] text-[#805D2A] mt-[6rpx]">当前待处理提醒 {reminderCount} 条，开通后可自动推送</Text>
          </View>
          <View className="px-[14rpx] py-[8rpx] rounded-[20rpx] bg-[#2E220F]">
            <Text className="text-[20rpx] text-[#F6DEAF]">开通会员 ›</Text>
          </View>
        </View>

        <View className="bg-[#F7F8FB] rounded-[20rpx] p-[14rpx] mb-[20rpx]">
          <View className="flex justify-between">
            {quickMenus.map((item) => (
              <View
                key={item.title}
                className="w-[31%] h-[170rpx] rounded-[16rpx] px-[10rpx] py-[14rpx] flex flex-col items-center justify-center"
                style={{ backgroundColor: item.bg }}
                onClick={item.onClick}
              >
                <Text className="text-[34rpx] mb-[10rpx]">{item.icon}</Text>
                <Text className="text-[24rpx] text-[#4D5664]">{item.title}</Text>
              </View>
            ))}
          </View>
        </View>

        <View
          className="rounded-[999rpx] pl-[18rpx] pr-[10rpx] py-[10rpx] flex items-center justify-between mb-[24rpx]"
          style={{ background: 'linear-gradient(90deg, #2B8BFF 0%, #1F66F0 100%)' }}
          onClick={() => Taro.switchTab({ url: '/pages/PetSchedule/index' })}
        >
          <View className="flex items-center flex-1 mr-[10rpx]">
            <View className="w-[84rpx] h-[84rpx] rounded-full bg-[#FFC67D] border-[2rpx] border-[#ffffff] flex items-center justify-center mr-[10rpx]">
              <Text className="text-[46rpx]">🐾</Text>
            </View>
            <View>
              <Text className="text-[24rpx] text-[#F7FBFF]">本周计划</Text>
              <Text className="text-[36rpx] font-semibold text-white leading-[1.1]">从养护开始</Text>
            </View>
          </View>
          <View className="w-[86rpx] h-[86rpx] rounded-full bg-[#FDC53A] border-[2rpx] border-[#FFE29C] flex items-center justify-center">
            <Text className="text-[34rpx] font-bold text-[#2656BD]">GO</Text>
          </View>
        </View>

        <View className="mb-[20rpx] rounded-[30rpx] bg-white border-[3rpx] border-[#262626] px-[20rpx] py-[22rpx] shadow-[0_10rpx_0_rgba(0,0,0,0.14)]">
          <View className="flex items-center justify-between mb-[18rpx]">
            <Text className="text-[34rpx] font-bold text-[#2D3441] relative">
              我的宠物
            </Text>
            <View
              className="w-[42rpx] h-[42rpx] rounded-full border-[2rpx] border-[#262626] flex items-center justify-center bg-[#FFF7D5]"
              onClick={() => Taro.navigateTo({ url: '/pages/EditPetProfile/index?mode=create' })}
            >
              <Text className="text-[28rpx]">+</Text>
            </View>
          </View>

          <View className="flex flex-wrap justify-between gap-y-[16rpx]">
            {pets.map((pet) => {
              const isActive = pet.id === activePet?.id;
              return (
                <View
                  key={pet.id}
                  className="w-[48.3%] rounded-[18rpx] border-[3rpx] border-[#262626] bg-[#FFFDF4] p-[12rpx]"
                  style={{
                    boxShadow: isActive ? '0 8rpx 0 rgba(255, 191, 54, 0.28)' : '0 8rpx 0 rgba(0,0,0,0.1)',
                  }}
                  onClick={() => Taro.navigateTo({ url: `/pages/PetDetailPage/index?petId=${pet.id}` })}
                >
                  <View className="flex items-center mb-[10rpx]">
                    <View className="w-[72rpx] h-[72rpx] rounded-[16rpx] bg-[#FFF0B3] border-[2rpx] border-[#262626] flex items-center justify-center mr-[12rpx]">
                      <Text className="text-[40rpx]">{pet.avatarEmoji}</Text>
                    </View>
                    <View className="flex-1 min-w-0">
                      <View className="flex items-center">
                        <Text className="text-[28rpx] font-semibold text-[#1f1f1f] truncate">
                          {pet.name}
                        </Text>
                        <Text
                          className="text-[26rpx] ml-[8rpx]"
                          style={{ color: pet.gender === 'male' ? '#5B7FFF' : '#FF7EA8' }}
                        >
                          {pet.gender === 'male' ? '♂' : '♀'}
                        </Text>
                      </View>
                      <Text className="text-[21rpx] text-[#5f5f5f] mt-[4rpx]">
                        {getAgeLabel(pet.birthday)} | {pet.weightKg || 0}kg
                      </Text>
                    </View>
                  </View>

                  <View className="flex items-center justify-between">
                    <Text className="text-[20rpx] text-[#6b6b6b]">{pet.species}</Text>
                    <View
                      className="px-[12rpx] h-[40rpx] rounded-[999rpx] border-[2rpx] border-[#262626] flex items-center justify-center"
                      style={{ backgroundColor: isActive ? '#FFD95A' : '#F4F4F4' }}
                      onClick={(event) => {
                        event.stopPropagation();
                        setActivePetId(pet.id);
                        Taro.showToast({ title: `已切换为 ${pet.name}`, icon: 'none' });
                      }}
                    >
                      <Text className="text-[20rpx]">{isActive ? '当前' : '切换'}</Text>
                    </View>
                  </View>
                </View>
              );
            })}

            <View
              className="w-full h-[92rpx] rounded-[18rpx] border-[3rpx] border-dashed border-[#262626] flex items-center justify-center bg-[#FFFDF4]"
              onClick={() => Taro.navigateTo({ url: '/pages/EditPetProfile/index?mode=create' })}
            >
              <Text className="text-[28rpx] text-[#404040]">⊕ 添加宠物</Text>
            </View>
          </View>
        </View>

        <View className="mt-[8rpx]">
          <Text className="text-[32rpx] font-bold mb-[12rpx] block text-[#2D3441]">功能菜单</Text>
          {menuItems.map((item) => (
            <MenuItem
              key={item.title}
              icon={item.icon}
              title={item.title}
              subtitle={item.subtitle}
              hasBadge={item.hasBadge}
              badgeText={item.badgeText}
              onClick={item.onClick}
            />
          ))}
        </View>
      </View>
    </BasicLayout>
  );
});

export default PetOwner;
