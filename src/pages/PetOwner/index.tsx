import BasicLayout from '@/layout/basicLayout';
import { View, Text } from '@tarojs/components';
import { memo, useMemo, useState } from 'react';
import Taro, { useDidShow } from '@tarojs/taro';
import { formatLocalDateKey } from '@/utils/formatDate';
import MenuItem from './components/MenuItem';
import { usePetApiPets } from '@/hooks/usePetApiPets';
import { getCurrentUserData, getOwnerOverviewData, logoutData } from '@/api/data';
import {
  AuthUser,
  clearLoginSession,
  ensureLoggedIn,
  getCurrentUser,
  isLoggedIn,
  setCurrentUser,
} from '@/utils/authState';
import { setStoredActivePetId, switchTabWithActivePet } from '@/utils/activePetState';

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
  const loggedIn = isLoggedIn();
  const { pets, activePet, activePetId, setActivePetId, resetPets } = usePetApiPets();
  const [user, setUser] = useState<AuthUser | null>(getCurrentUser());
  const [reminderCount, setReminderCount] = useState(0);
  const [achievementCount, setAchievementCount] = useState(0);
  const [lowInventoryCount, setLowInventoryCount] = useState(0);
  const [dueMedicineCount, setDueMedicineCount] = useState(0);
  const [milestoneCount, setMilestoneCount] = useState(0);
  const [latestMilestone, setLatestMilestone] = useState<{
    id: string;
    title: string;
    occurredAt: string;
    description?: string;
  } | null>(null);

  useDidShow(() => {
    const cachedUser = getCurrentUser();
    setUser(cachedUser);

    if (loggedIn && !cachedUser) {
      getCurrentUserData()
        .then((profile) => {
          setCurrentUser(profile);
          setUser(profile);
        })
        .catch(() => {
          setUser(null);
        });
    }
    if (!loggedIn) {
      setReminderCount(0);
      setAchievementCount(0);
      setLowInventoryCount(0);
      setDueMedicineCount(0);
      setMilestoneCount(0);
      setLatestMilestone(null);
      return;
    }
    if (!activePetId || !activePet) {
      setReminderCount(0);
      setAchievementCount(0);
      setLowInventoryCount(0);
      setDueMedicineCount(0);
      setMilestoneCount(0);
      setLatestMilestone(null);
      return;
    }

    getOwnerOverviewData(activePet.id)
      .then((data) => {
        setReminderCount(data.totals.pendingReminderCount);
        setAchievementCount(data.totals.achievementCount);
        setLowInventoryCount(data.totals.lowInventoryCount);
        setDueMedicineCount(data.totals.dueMedicineCount);
        setMilestoneCount(data.totals.milestoneCount);
        setLatestMilestone(data.latestMilestone);
      })
      .catch(() => {
        setReminderCount(0);
        setAchievementCount(0);
        setLowInventoryCount(0);
        setDueMedicineCount(0);
        setMilestoneCount(0);
        setLatestMilestone(null);
      });
  });

  const today = formatLocalDateKey(new Date());
  const loggedIn = isLoggedIn();
  const currentPetId = activePet?.id || activePetId || '';
  const handleCreatePet = () => {
    if (!ensureLoggedIn('/pages/PetOwner/index')) {
      return;
    }
    Taro.navigateTo({ url: '/pages/EditPetProfile/index?mode=create' });
  };
  const ensureActivePetContext = () => {
    if (!ensureLoggedIn('/pages/PetOwner/index')) {
      return false;
    }

    if (currentPetId && activePet) {
      return true;
    }

    Taro.showToast({ title: '请先选择或创建宠物', icon: 'none' });
    return false;
  };
  const openPetPage = (url: string) => {
    if (!ensureActivePetContext()) {
      return;
    }
    Taro.navigateTo({ url });
  };
  const handleLogout = async () => {
    try {
      await logoutData();
    } catch {}
    clearLoginSession();
    resetPets();
    setUser(null);
    Taro.showToast({ title: '已退出登录', icon: 'success' });
  };

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
  const ownerNextActions =
    currentPetId && activePet
      ? [
          {
            title: reminderCount > 0 ? '处理提醒' : '新增提醒',
            subtitle:
              reminderCount > 0
                ? `还有 ${reminderCount} 条待办，先回日程页处理`
                : '先给当前宠物补一个提醒安排',
            accent: '#5a78d4',
            onClick: () =>
              reminderCount > 0
                ? ensureActivePetContext()
                  ? switchTabWithActivePet('/pages/PetSchedule/index', currentPetId)
                  : undefined
                : openPetPage(
                    `/pages/AddPetReminder/index?petId=${currentPetId}&date=${today}`
                  ),
          },
          {
            title: '查看报告',
            subtitle: '回看最近趋势、亮点和摘要',
            accent: '#466481',
            onClick: () => openPetPage(`/pages/PetReport/index?petId=${currentPetId}`),
          },
          {
            title:
              lowInventoryCount > 0 || dueMedicineCount > 0
                ? '处理库存/疗程'
                : '继续补记录',
            subtitle:
              lowInventoryCount > 0 || dueMedicineCount > 0
                ? `库存提醒 ${lowInventoryCount} 条，用药关注 ${dueMedicineCount} 条`
                : '去补日常、花销或护理，让摘要更完整',
            accent: '#8A6A2C',
            onClick: () =>
              lowInventoryCount > 0
                ? openPetPage(`/pages/PetFood/index?petId=${currentPetId}`)
                : dueMedicineCount > 0
                  ? openPetPage(`/pages/PetMedicine/index?petId=${currentPetId}`)
                  : openPetPage(
                      `/pages/AddPetRecord/index?petId=${currentPetId}&date=${today}&mode=record`
                    ),
          },
        ]
      : [];

  const quickMenus = [
    {
      icon: '会员',
      title: '会员中心',
      bg: '#F6F3ED',
      onClick: () =>
        Taro.navigateTo({
          url: `/pages/PetServiceCenter/index?mode=member${currentPetId ? `&petId=${currentPetId}` : ''}`,
        }),
    },
    {
      icon: '订阅',
      title: '订阅中心',
      bg: '#EEF2F8',
      onClick: () =>
        Taro.navigateTo({
          url: `/pages/PetServiceCenter/index?mode=subscription${currentPetId ? `&petId=${currentPetId}` : ''}`,
        }),
    },
    {
      icon: '联系',
      title: '联系我们',
      bg: '#F0EEF8',
      onClick: () => Taro.navigateTo({ url: '/pages/PetFeedback/index?mode=contact' }),
    },
  ];

  const menuItems = [
    {
      icon: '日程',
      title: '日程管理',
      subtitle: '管理提醒和记录',
      hasBadge: reminderCount > 0,
      badgeText: String(reminderCount),
      onClick: () => {
        if (!ensureActivePetContext()) {
          return;
        }
        switchTabWithActivePet('/pages/PetSchedule/index', currentPetId);
      },
    },
    {
      icon: '统计',
      title: '数据统计',
      subtitle: '查看近期花销和护理趋势',
      onClick: () => openPetPage(`/pages/PetExpenseStats/index?petId=${currentPetId}`),
    },
    {
      icon: '食物',
      title: '食物管理',
      subtitle: '喂养计划与库存提醒',
      hasBadge: lowInventoryCount > 0,
      badgeText: `${lowInventoryCount}`,
      onClick: () => openPetPage(`/pages/PetFood/index?petId=${currentPetId}`),
    },
    {
      icon: '护理',
      title: '医疗护理',
      subtitle: '门诊和检查留档',
      onClick: () => openPetPage(`/pages/PetCareStats/index?petId=${currentPetId}`),
    },
    {
      icon: '用药',
      title: '用药管理',
      subtitle: '追踪药品和疗程',
      hasBadge: dueMedicineCount > 0,
      badgeText: `${dueMedicineCount}`,
      onClick: () => openPetPage(`/pages/PetMedicine/index?petId=${currentPetId}`),
    },
    {
      icon: '时间线',
      title: '成长时间线',
      subtitle: '按时间查看提醒与记录',
      onClick: () => openPetPage(`/pages/PetTimeline/index?petId=${currentPetId}`),
    },
    {
      icon: '里程碑',
      title: '成长里程碑',
      subtitle: '记录第一次出门和重要节点',
      hasBadge: milestoneCount > 0,
      badgeText: `${milestoneCount}`,
      onClick: () => openPetPage(`/pages/PetMilestones/index?petId=${currentPetId}`),
    },
    {
      icon: '记录',
      title: '日常记录',
      subtitle: '日常健康观察',
      onClick: () =>
        openPetPage(
          `/pages/AddPetRecord/index?petId=${currentPetId}&date=${today}&mode=record`
        ),
    },
    {
      icon: '反馈',
      title: '帮助与反馈',
      subtitle: '问题反馈与建议',
      onClick: () => Taro.navigateTo({ url: '/pages/PetFeedback/index?mode=feedback' }),
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
            className="w-[56rpx] h-[56rpx] rounded-full border border-[#8D97A6] bg-white flex items-center justify-center"
            onClick={() => Taro.navigateTo({ url: '/pages/ChooseSelectCmp/index' })}
          >
            <Text className="text-[20rpx] text-[#5C6675]">入口</Text>
          </View>
          <View
            className="w-[44rpx] h-[44rpx] rounded-full border border-[#8D97A6] flex items-center justify-center"
            onClick={() => {
              if (!ensureActivePetContext()) {
                return;
              }
              switchTabWithActivePet('/pages/PetSchedule/index', currentPetId);
            }}
          >
            <Text className="text-[20rpx] text-[#5C6675]">日程</Text>
          </View>
        </View>

        <View className="flex items-center mb-[18rpx]">
          <View className="w-[112rpx] h-[112rpx] rounded-full bg-[#fff7d7] border-[4rpx] border-[#262626] flex items-center justify-center mr-[16rpx] shadow-[0_8rpx_0_rgba(0,0,0,0.14)]">
            <Text className="text-[56rpx]">{activePet?.avatarEmoji || '🐾'}</Text>
          </View>
          <View className="flex-1">
            <Text className="text-[40rpx] font-semibold text-[#2C3442]">
              {loggedIn
                ? user?.nickname ||
                  activePet?.name ||
                  (pets.length > 0 ? '未选择宠物' : '微信用户')
                : activePet?.name || '未登录'}
            </Text>
            <Text className="text-[22rpx] text-[#7B8594] mt-[8rpx] leading-[1.5]">
              {loggedIn
                ? `当前共维护 ${pets.length} 只宠物档案`
                : '登录后可同步宠物档案、收藏和个性化记录'}
            </Text>
          </View>
          <View
            className="px-[18rpx] h-[58rpx] rounded-[999rpx] bg-white border-[2rpx] border-[#262626] flex items-center justify-center"
            onClick={() =>
              loggedIn
                ? handleLogout()
                : Taro.navigateTo({
                    url: '/pages/Login/index?redirect=%2Fpages%2FPetOwner%2Findex',
                  })
            }
          >
            <Text className="text-[22rpx] text-[#333]">{loggedIn ? '退出' : '登录'}</Text>
          </View>
        </View>

        {loggedIn && pets.length > 0 && !activePet ? (
          <View className="mb-[16rpx] rounded-[22rpx] bg-white border-[3rpx] border-[#262626] px-[18rpx] py-[16rpx] shadow-[0_8rpx_0_rgba(0,0,0,0.12)]">
            <Text className="text-[26rpx] font-semibold text-[#2D3441]">
              请先重新选择宠物
            </Text>
            <Text className="text-[22rpx] text-[#6B7482] mt-[8rpx] block">
              当前我的页没有绑定到有效宠物，你可以在下方“我的宠物”里点选一只宠物，或者回首页重新切换。
            </Text>
          </View>
        ) : null}

        <View className="bg-white rounded-[28rpx] border-[3rpx] border-[#262626] px-[22rpx] py-[18rpx] mb-[18rpx] shadow-[0_10rpx_0_rgba(0,0,0,0.14)]">
          <View className="flex justify-between items-center">
            <View
              className="flex-1"
              onClick={() => {
                if (!ensureActivePetContext()) {
                  return;
                }
                switchTabWithActivePet('/pages/PetSchedule/index', currentPetId);
              }}
            >
              <Text className="text-[22rpx] text-[#8C95A2]">待处理提醒</Text>
              <Text className="text-[38rpx] font-semibold text-[#2D3441] mt-[4rpx]">
                {reminderCount}
              </Text>
            </View>
            <View className="w-[2rpx] h-[72rpx] bg-[#262626] opacity-20" />
            <View
              className="flex-1 pl-[24rpx]"
              onClick={() =>
                openPetPage(`/pages/PetMilestones/index?petId=${currentPetId}`)
              }
            >
              <Text className="text-[22rpx] text-[#8C95A2]">我的成就</Text>
              <Text className="text-[38rpx] font-semibold text-[#2D3441] mt-[4rpx]">
                {achievementCount}
              </Text>
            </View>
          </View>

          <View className="mt-[18rpx] rounded-[999rpx] bg-[#FFF7D5] border-[3rpx] border-[#262626] px-[18rpx] py-[12rpx] flex items-center">
            <Text className="text-[24rpx] mr-[12rpx]">陪伴</Text>
            <Text className="text-[24rpx] text-[#2D3441] font-semibold">
              和 {activePet?.name || '宠物'} 一起已经 {activeDays} 天了
            </Text>
          </View>
          {currentPetId && activePet ? (
            <View className="mt-[14rpx] flex gap-[12rpx]">
              <View
                className="flex-1 rounded-[18rpx] bg-[#2B8BFF] border-[3rpx] border-[#262626] px-[16rpx] py-[14rpx] flex items-center justify-center"
                onClick={() =>
                  openPetPage(
                    `/pages/AddPetReminder/index?petId=${currentPetId}&date=${today}`
                  )
                }
              >
                <Text className="text-[24rpx] text-white font-semibold">新增提醒</Text>
              </View>
              <View
                className="flex-1 rounded-[18rpx] bg-[#FFD93B] border-[3rpx] border-[#262626] px-[16rpx] py-[14rpx] flex items-center justify-center"
                onClick={() =>
                  openPetPage(
                    `/pages/AddPetRecord/index?petId=${currentPetId}&date=${today}&mode=record`
                  )
                }
              >
                <Text className="text-[24rpx] text-[#2D3441] font-semibold">新增记录</Text>
              </View>
            </View>
          ) : null}

          <View
            className="mt-[14rpx] rounded-[22rpx] bg-[#FFF2F8] border-[3rpx] border-[#262626] px-[18rpx] py-[14rpx]"
            onClick={() => openPetPage(`/pages/PetMilestones/index?petId=${currentPetId}`)}
          >
            <View className="flex items-center justify-between">
              <Text className="text-[24rpx] text-[#7D4764] font-semibold">
                最近成长节点
              </Text>
              <Text className="text-[22rpx] text-[#A45D85]">{milestoneCount} 条</Text>
            </View>
            <Text className="text-[24rpx] text-[#2D3441] font-semibold mt-[8rpx] block">
              {latestMilestone
                ? latestMilestone.title
                : '还没有成长节点，去记录第一次到家或第一次出门吧。'}
            </Text>
            <Text className="text-[20rpx] text-[#7E6C76] mt-[6rpx] block leading-[1.5]">
              {latestMilestone
                ? `${latestMilestone.occurredAt.slice(0, 10)}${latestMilestone.description ? ` · ${latestMilestone.description}` : ''}`
                : '记录后会同步到时间线、报告和详情页。'}
            </Text>
          </View>
          {currentPetId && activePet ? (
            <View className="mt-[14rpx] rounded-[22rpx] bg-[#F8FAFF] border-[3rpx] border-[#262626] px-[18rpx] py-[14rpx]">
              <Text className="text-[24rpx] text-[#466481] font-semibold">
                当前宠物下一步
              </Text>
              <Text className="text-[22rpx] text-[#4D5664] mt-[8rpx] block leading-[1.6]">
                {reminderCount > 0
                  ? `${activePet?.name || '当前宠物'} 还有 ${reminderCount} 条提醒待处理，建议先回到日程页确认。`
                  : lowInventoryCount > 0 || dueMedicineCount > 0
                    ? `${activePet?.name || '当前宠物'} 目前有库存或疗程需要关注，处理后服务页和报告会同步更新。`
                    : `当前摘要已经切到 ${activePet?.name || '这只宠物'}，可以继续看报告、补记录或回时间线。`}
              </Text>
              <View className="grid grid-cols-3 gap-[12rpx] mt-[14rpx]">
                {ownerNextActions.map((item) => (
                  <View
                    key={item.title}
                    className="rounded-[18rpx] bg-white border-[2rpx] border-[#262626] px-[12rpx] py-[14rpx]"
                    style={{ minHeight: '136rpx' }}
                    onClick={item.onClick}
                  >
                    <Text
                      className="text-[22rpx] font-semibold"
                      style={{ color: item.accent }}
                    >
                      {item.title}
                    </Text>
                    <Text className="text-[18rpx] leading-[1.5] text-[#6b6b6b] mt-[6rpx] block">
                      {item.subtitle}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          ) : null}
        </View>

        <View
          className="rounded-[18rpx] px-[22rpx] py-[18rpx] flex items-center justify-between mb-[18rpx]"
          style={{ background: 'linear-gradient(90deg, #EED7A6 0%, #E7C27C 100%)' }}
          onClick={() =>
            Taro.navigateTo({
              url: `/pages/PetServiceCenter/index?mode=member${currentPetId ? `&petId=${currentPetId}` : ''}`,
            })
          }
        >
          <View className="pr-[12rpx]">
            <Text className="text-[26rpx] text-[#5F3E13] font-semibold">
              开通会员，解锁更多服务
            </Text>
            <Text className="text-[20rpx] text-[#805D2A] mt-[6rpx] leading-[1.5]">
              当前待处理提醒 {reminderCount} 条，开通后可继续集中管理。
            </Text>
          </View>
          <View className="px-[14rpx] py-[8rpx] rounded-[20rpx] bg-[#2E220F]">
            <Text className="text-[20rpx] text-[#F6DEAF]">查看权益</Text>
          </View>
        </View>

        <View className="bg-[#F7F8FB] rounded-[20rpx] p-[14rpx] mb-[20rpx]">
          <View className="flex justify-between">
            {quickMenus.map((item) => (
              <View
                key={item.title}
                className="w-[31%] h-[180rpx] rounded-[16rpx] px-[10rpx] py-[14rpx] flex flex-col items-center justify-center"
                style={{ backgroundColor: item.bg }}
                onClick={item.onClick}
              >
                <Text className="text-[26rpx] mb-[10rpx] text-[#394150]">{item.icon}</Text>
                <Text className="text-[24rpx] text-[#4D5664]">{item.title}</Text>
              </View>
            ))}
          </View>
        </View>

        <View
          className="rounded-[999rpx] pl-[18rpx] pr-[10rpx] py-[10rpx] flex items-center justify-between mb-[24rpx]"
          style={{ background: 'linear-gradient(90deg, #2B8BFF 0%, #1F66F0 100%)' }}
          onClick={() =>
            currentPetId && activePet
              ? openPetPage(
                  `/pages/AddPetRecord/index?petId=${currentPetId}&date=${today}&mode=care`
                )
              : ensureActivePetContext()
                ? switchTabWithActivePet('/pages/PetSchedule/index', currentPetId)
                : undefined
          }
        >
          <View className="flex items-center flex-1 mr-[10rpx]">
            <View className="w-[84rpx] h-[84rpx] rounded-full bg-[#FFC67D] border-[2rpx] border-[#ffffff] flex items-center justify-center mr-[10rpx]">
              <Text className="text-[28rpx] text-[#2D3441]">照护</Text>
            </View>
            <View>
              <Text className="text-[24rpx] text-[#F7FBFF]">本周计划</Text>
              <Text className="text-[36rpx] font-semibold text-white leading-[1.1]">
                {activePet?.name ? `继续照护 ${activePet.name}` : '从养护开始'}
              </Text>
            </View>
          </View>
          <View className="w-[86rpx] h-[86rpx] rounded-full bg-[#FDC53A] border-[2rpx] border-[#FFE29C] flex items-center justify-center">
            <Text className="text-[28rpx] font-bold text-[#2656BD]">
              {currentPetId && activePet ? '护理' : 'GO'}
            </Text>
          </View>
        </View>

        <View className="mb-[20rpx] rounded-[30rpx] bg-white border-[3rpx] border-[#262626] px-[20rpx] py-[22rpx] shadow-[0_10rpx_0_rgba(0,0,0,0.14)]">
          <View className="flex items-center justify-between mb-[18rpx]">
            <Text className="text-[34rpx] font-bold text-[#2D3441]">我的宠物</Text>
            <View
              className="w-[50rpx] h-[50rpx] rounded-full border-[2rpx] border-[#262626] flex items-center justify-center bg-[#FFF7D5]"
              onClick={handleCreatePet}
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
                  className="w-[48.3%] rounded-[18rpx] border-[3rpx] border-[#262626] bg-[#FFFDF4] p-[14rpx]"
                  style={{
                    boxShadow: isActive
                      ? '0 8rpx 0 rgba(255, 191, 54, 0.28)'
                      : '0 8rpx 0 rgba(0,0,0,0.1)',
                  }}
                  onClick={() => {
                    setStoredActivePetId(pet.id);
                    Taro.navigateTo({ url: `/pages/PetDetailPage/index?petId=${pet.id}` });
                  }}
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
                      className="px-[14rpx] h-[44rpx] rounded-[999rpx] border-[2rpx] border-[#262626] flex items-center justify-center"
                      style={{ backgroundColor: isActive ? '#FFD95A' : '#F4F4F4' }}
                      onClick={(event) => {
                        event.stopPropagation();
                        setActivePetId(pet.id);
                        setStoredActivePetId(pet.id);
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
              className="w-full h-[96rpx] rounded-[18rpx] border-[3rpx] border-dashed border-[#262626] flex items-center justify-center bg-[#FFFDF4]"
              onClick={handleCreatePet}
            >
              <Text className="text-[28rpx] text-[#404040]">+ 添加宠物</Text>
            </View>
          </View>
        </View>

        <View className="mt-[8rpx]">
          <Text className="text-[32rpx] font-bold mb-[12rpx] block text-[#2D3441]">
            功能菜单
          </Text>
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
