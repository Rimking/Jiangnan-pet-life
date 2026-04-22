import BasicLayout from '@/layout/basicLayout';
import { View, Text } from '@tarojs/components';
import { memo, useMemo, useState } from 'react';
import Taro from '@tarojs/taro';
import { usePetAppData } from '@/hooks/usePetAppData';
import { formatLocalDateKey } from '@/utils/formatDate';
import { showDemoPendingToast } from '@/utils/demoToast';
import PetCard from './components/PetCard';
import MenuItem from './components/MenuItem';
import PetDetail from './components/PetDetail';

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
  const { state, activePet, reminders, records, expenses, careLogs, changeActivePet } = usePetAppData();
  const [detailPetId, setDetailPetId] = useState<string | null>(null);

  const selectedPet = useMemo(() => {
    if (!detailPetId) {
      return null;
    }
    return state.pets.find((pet) => pet.id === detailPetId) ?? null;
  }, [detailPetId, state.pets]);

  const reminderCount = reminders.filter((item) => item.petId === activePet.id && item.enabled).length;
  const today = formatLocalDateKey(new Date());
  const learningHours = records.filter((item) => item.petId === activePet.id).length * 4;
  const achievementCount =
    expenses.filter((item) => item.petId === activePet.id).length +
    careLogs.filter((item) => item.petId === activePet.id).length;

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
          url: `/pages/AddPetRecord/index?petId=${activePet.id}&date=${today}&mode=care`,
        }),
    },
    {
      icon: '🩺',
      title: '医疗记录',
      subtitle: '门诊和检查留档',
      onClick: () =>
        Taro.navigateTo({
          url: `/pages/PetCareStats/index?petId=${activePet.id}`,
        }),
    },
    {
      icon: '🧴',
      title: '洗护记录',
      subtitle: '美容与护理时间线',
      onClick: () =>
        Taro.navigateTo({
          url: `/pages/AddPetRecord/index?petId=${activePet.id}&date=${today}&mode=care`,
        }),
    },
    {
      icon: '💬',
      title: '排便记录',
      subtitle: '日常健康观察',
      onClick: () =>
        Taro.navigateTo({
          url: `/pages/AddPetRecord/index?petId=${activePet.id}&date=${today}&mode=record`,
        }),
    },
    {
      icon: '❓',
      title: '帮助与反馈',
      subtitle: '问题反馈与建议',
      onClick: () => Taro.navigateTo({ url: '/pages/SendPetSchedule/index' }),
    },
  ];

  if (selectedPet) {
    const petId = selectedPet.id;
    return (
      <BasicLayout
        wrapClassName="w-full h-full"
        wrapStyle={{
          backgroundColor: '#E8EDF4',
          minHeight: '100vh',
        }}
        navOptions={{ navTitle: '', needBack: false }}
      >
        <PetDetail
          pet={selectedPet}
          isActive={activePet.id === petId}
          stats={{
            reminderCount: reminders.filter((item) => item.petId === petId).length,
            recordCount: records.filter((item) => item.petId === petId).length,
            expenseCount: expenses.filter((item) => item.petId === petId).length,
            careCount: careLogs.filter((item) => item.petId === petId).length,
          }}
          onBack={() => setDetailPetId(null)}
          onSetActive={() => {
            changeActivePet(petId);
            Taro.showToast({ title: '已切换当前宠物', icon: 'none' });
          }}
        />
      </BasicLayout>
    );
  }

  return (
    <BasicLayout
      wrapClassName="w-full h-full"
      wrapStyle={{
        backgroundColor: '#E8EDF4',
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

        <View className="flex items-center">
          <View className="w-[102rpx] h-[102rpx] rounded-full bg-[#D6CFB5] border-[2rpx] border-[#808A99] flex items-center justify-center mr-[16rpx]">
            <Text className="text-[56rpx]">{activePet.avatarEmoji}</Text>
          </View>
          <View className="flex-1">
            <Text className="text-[40rpx] font-semibold text-[#2C3442]">{activePet.name}</Text>
            <Text className="text-[22rpx] text-[#7B8594] mt-[8rpx]">当前有 {state.pets.length} 只宠物档案</Text>
          </View>
        </View>

        <View className="flex mt-[26rpx] mb-[22rpx]">
          <View className="mr-[24rpx]">
            <Text className="text-[22rpx] text-[#8C95A2]">学习时长</Text>
            <Text className="text-[38rpx] font-semibold text-[#2D3441] mt-[4rpx]">{learningHours}</Text>
          </View>
          <View>
            <Text className="text-[22rpx] text-[#8C95A2]">我的成就</Text>
            <Text className="text-[38rpx] font-semibold text-[#2D3441] mt-[4rpx]">{achievementCount}</Text>
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

        <View className="mb-[18rpx]">
          <View className="flex justify-between items-center mb-[12rpx] px-[4rpx]">
            <Text className="text-[32rpx] font-bold text-[#2D3441]">我的宠物</Text>
            <View
              className="h-[56rpx] px-[18rpx] rounded-[16rpx] bg-[#FFD93B] border-[2rpx] border-[#262626] flex items-center justify-center"
              onClick={() => showDemoPendingToast('新增宠物')}
            >
              <Text className="text-[22rpx] font-semibold text-[#3b3b3b]">+ 新增</Text>
            </View>
          </View>

          {state.pets.map((pet) => (
            <PetCard
              key={pet.id}
              name={pet.name}
              type={pet.species}
              age={getAgeLabel(pet.birthday)}
              weight={`${pet.weightKg}kg`}
              gender={pet.gender}
              avatar={pet.avatarEmoji}
              isActive={pet.id === activePet.id}
              onSetActive={() => {
                changeActivePet(pet.id);
                Taro.showToast({ title: `已切换为 ${pet.name}`, icon: 'none' });
              }}
              onOpenDetail={() => setDetailPetId(pet.id)}
            />
          ))}
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

