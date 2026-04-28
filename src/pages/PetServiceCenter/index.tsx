import BasicLayout from '@/layout/basicLayout';
import { View, Text } from '@tarojs/components';
import Taro, { useDidShow, useRouter } from '@tarojs/taro';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { PET_UI } from '@/constants/petUi';
import { getOwnerOverviewData, OwnerOverviewData } from '@/api/data';
import { setStoredActivePetId, switchTabWithActivePet } from '@/utils/activePetState';
import { ensureLoggedIn, isLoggedIn } from '@/utils/authState';
import { usePetApiPets } from '@/hooks/usePetApiPets';

const PetServiceCenter = memo(function PetServiceCenter() {
  const { params } = useRouter();
  const mode = params.mode === 'subscription' ? 'subscription' : 'member';
  const preferredPetId = params.petId || '';
  const loggedIn = isLoggedIn();
  const { pets, activePet, activePetId, setActivePetId } = usePetApiPets(preferredPetId);
  const [dashboard, setDashboard] = useState<OwnerOverviewData | null>(null);
  const [loading, setLoading] = useState(false);

  const refreshDashboard = useCallback(() => {
    if (!loggedIn) {
      setDashboard(null);
      return Promise.resolve();
    }
    setLoading(true);
    return getOwnerOverviewData(activePetId || undefined)
      .then((res) => setDashboard(res))
      .catch(() => setDashboard(null))
      .finally(() => setLoading(false));
  }, [activePetId, loggedIn]);

  useEffect(() => {
    refreshDashboard();
  }, [refreshDashboard]);

  useDidShow(() => {
    refreshDashboard();
  });

  const pageTitle = useMemo(() => {
    return mode === 'subscription' ? '订阅中心' : '会员中心';
  }, [mode]);

  const heroTitle =
    mode === 'subscription' ? '把照护安排集中管理' : '把高频照护服务集中查看';
  const heroDesc =
    mode === 'subscription'
      ? '这里集中展示提醒、库存和疗程状态，方便你判断下一步该优先处理什么。'
      : '这里集中展示宠物档案、提醒、护理和成长节点，方便统一查看当前照护状态。';

  const serviceCards =
    mode === 'subscription'
      ? [
          {
            title: '待处理提醒',
            value: dashboard?.totals.pendingReminderCount || 0,
            subtitle: '优先处理今天和最近几天的安排',
            bg: '#EEF4FF',
            onClick: () => switchTabWithActivePet('/pages/PetSchedule/index', activePetId),
          },
          {
            title: '临近结束用药',
            value: dashboard?.totals.dueMedicineCount || 0,
            subtitle: '建议尽快检查疗程是否需要续上',
            bg: '#F5F0FF',
            onClick: () =>
              Taro.navigateTo({
                url: `/pages/PetMedicine/index${activePetId ? `?petId=${activePetId}` : ''}`,
              }),
          },
          {
            title: '食物库存提醒',
            value: dashboard?.totals.lowInventoryCount || 0,
            subtitle: '库存偏低的食物建议尽快补充',
            bg: '#FFF7E5',
            onClick: () =>
              Taro.navigateTo({
                url: `/pages/PetFood/index${activePetId ? `?petId=${activePetId}` : ''}`,
              }),
          },
        ]
      : [
          {
            title: '宠物档案',
            value: dashboard?.totals.pets || 0,
            subtitle: '已建立的宠物资料数',
            bg: '#FFF7E5',
            onClick: () =>
              activePetId
                ? (() => {
                    setStoredActivePetId(activePetId);
                    Taro.navigateTo({ url: `/pages/PetDetailPage/index?petId=${activePetId}` });
                  })()
                : undefined,
          },
          {
            title: '待处理提醒',
            value: dashboard?.totals.pendingReminderCount || 0,
            subtitle: '还没处理的照护安排',
            bg: '#EEF4FF',
            onClick: () => switchTabWithActivePet('/pages/PetSchedule/index', activePetId),
          },
          {
            title: '护理记录',
            value: dashboard?.quickStats.careCount || 0,
            subtitle: '当前宠物累计护理次数',
            bg: '#F5F0FF',
            onClick: () =>
              Taro.navigateTo({
                url: `/pages/PetCareStats/index${activePetId ? `?petId=${activePetId}` : ''}`,
              }),
          },
          {
            title: '成长里程碑',
            value: dashboard?.quickStats.milestoneCount || 0,
            subtitle: '沉淀关键成长节点',
            bg: '#FFF0F6',
            onClick: () =>
              Taro.navigateTo({
                url: `/pages/PetMilestones/index${activePetId ? `?petId=${activePetId}` : ''}`,
              }),
          },
        ];
  const followUpActions = [
    {
      title: '新增提醒',
      subtitle: '继续给当前宠物安排今天的照护任务',
      accent: '#5a78d4',
      onClick: () =>
        activePetId
          ? Taro.navigateTo({ url: `/pages/AddPetReminder/index?petId=${activePetId}` })
          : undefined,
    },
    {
      title: '新增记录',
      subtitle: '补日常、花销或护理，摘要会同步更新',
      accent: '#8a6a2c',
      onClick: () =>
        activePetId
          ? Taro.navigateTo({ url: `/pages/AddPetRecord/index?petId=${activePetId}&mode=record` })
          : undefined,
    },
    {
      title: '查看时间线',
      subtitle: '回看这只宠物最近的记录和成长节点',
      accent: '#7a61a7',
      onClick: () =>
        activePetId
          ? Taro.navigateTo({ url: `/pages/PetTimeline/index?petId=${activePetId}` })
          : undefined,
    },
  ];

  return (
    <BasicLayout
      wrapClassName="w-full h-full"
      wrapStyle={{
        backgroundImage: PET_UI.pageBackground,
        minHeight: '100vh',
      }}
      navOptions={{ navTitle: pageTitle, needBack: true }}
    >
      <View className="px-6 pt-4 pb-[110rpx]">
        {pets.length ? (
          <View className="mb-4 flex gap-2 flex-wrap">
            {pets.map((pet) => (
              <View
                key={pet.id}
                className="px-4 py-2 rounded-[16rpx]"
                style={{
                  backgroundColor: activePetId === pet.id ? '#FFD93B' : '#f4f4f4',
                  border: '2rpx solid #262626',
                }}
                onClick={() => {
                  setActivePetId(pet.id);
                  Taro.redirectTo({
                    url: `/pages/PetServiceCenter/index?mode=${mode}&petId=${pet.id}`,
                  });
                }}
              >
                <Text className="text-[24rpx]">{pet.name}</Text>
              </View>
            ))}
          </View>
        ) : null}

        <View className="rounded-[28rpx] bg-[#FFF7D5] px-5 py-6 mb-5 shadow-[0_16rpx_34rpx_rgba(230,193,82,0.18)]">
          <Text className="text-[34rpx] font-semibold text-[#5D4510] block">{heroTitle}</Text>
          <Text className="text-[22rpx] text-[#7D6532] leading-[1.7] mt-[10rpx] block">
            {heroDesc}
          </Text>
          <View className="mt-4 px-4 py-3 rounded-[18rpx] bg-white/70">
            <Text className="text-[22rpx] text-[#6E5A2C]">
              {!loggedIn
                ? '登录后可查看你的宠物服务概览、订阅状态和个性化报告。'
                : loading
                  ? '正在拉取服务数据...'
                  : activePet
                    ? `当前查看 ${activePet.name}，还有 ${dashboard?.totals.pendingReminderCount || 0} 条待处理提醒。`
                    : `当前总计 ${dashboard?.totals.pets || 0} 只宠物，${dashboard?.totals.pendingReminderCount || 0} 条待处理提醒。`}
            </Text>
          </View>
          {!loggedIn ? (
            <View
              className="mt-4 px-4 py-3 rounded-[18rpx] bg-[#FFD93B]"
              onClick={() =>
                ensureLoggedIn(
                  `/pages/PetServiceCenter/index?mode=${mode}${activePetId ? `&petId=${activePetId}` : ''}`
                )
              }
            >
              <Text className="text-[22rpx] text-[#5D4510] font-semibold">去微信登录</Text>
            </View>
          ) : null}
        </View>

        <View className="grid grid-cols-1 gap-3 mb-5">
          {serviceCards.map((item) => (
            <View
              key={item.title}
              className="rounded-[24rpx] p-5 shadow-[0_14rpx_28rpx_rgba(0,0,0,0.06)]"
              style={{ backgroundColor: item.bg }}
              onClick={item.onClick}
            >
              <Text className="text-[22rpx] text-[#7a7a7a]">{item.title}</Text>
              <Text className="text-[42rpx] font-semibold text-[#2c2c2c] mt-[8rpx] block">
                {item.value}
              </Text>
              <Text className="text-[22rpx] text-[#666] mt-[6rpx]">{item.subtitle}</Text>
              <Text className="text-[20rpx] text-[#5a78d4] mt-[10rpx] block">查看详情</Text>
            </View>
          ))}
        </View>

        {activePet ? (
          <View className="rounded-[24rpx] bg-white p-5 mb-5 shadow-[0_14rpx_28rpx_rgba(0,0,0,0.06)]">
            <Text className="text-[28rpx] font-semibold text-[#2c2c2c] block">
              {activePet.name} 的当前照护面板
            </Text>
            <Text className="text-[22rpx] text-[#666] mt-[8rpx] block">
              待处理提醒 {dashboard?.menuBadges.schedule || 0} 条，食物关注 {dashboard?.menuBadges.food || 0} 条，用药关注 {dashboard?.menuBadges.medicine || 0} 条。
            </Text>
            <View className="grid grid-cols-3 gap-3 mt-4">
              <View className="rounded-[18rpx] bg-[#EEF4FF] p-4">
                <Text className="text-[22rpx] text-[#6a7ca8]">花销记录</Text>
                <Text className="text-[34rpx] font-semibold text-[#2c2c2c] mt-[6rpx]">
                  {dashboard?.quickStats.expenseCount || 0}
                </Text>
              </View>
              <View className="rounded-[18rpx] bg-[#FFF7E5] p-4">
                <Text className="text-[22rpx] text-[#8a6a2c]">食物档案</Text>
                <Text className="text-[34rpx] font-semibold text-[#2c2c2c] mt-[6rpx]">
                  {dashboard?.quickStats.foodCount || 0}
                </Text>
              </View>
              <View className="rounded-[18rpx] bg-[#F5F0FF] p-4">
                <Text className="text-[22rpx] text-[#7a61a7]">用药档案</Text>
                <Text className="text-[34rpx] font-semibold text-[#2c2c2c] mt-[6rpx]">
                  {dashboard?.quickStats.medicineCount || 0}
                </Text>
              </View>
            </View>
            <View className="grid grid-cols-1 gap-3 mt-4">
              {followUpActions.map((item) => (
                <View
                  key={item.title}
                  className="rounded-[18rpx] bg-[#F8F8F8] p-4"
                  onClick={item.onClick}
                >
                  <Text className="text-[24rpx] font-semibold text-[#2c2c2c]">{item.title}</Text>
                  <Text className="text-[22rpx] text-[#666] mt-[8rpx] block">{item.subtitle}</Text>
                  <Text className="text-[20rpx] mt-[10rpx] block" style={{ color: item.accent }}>
                    立即继续
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        <View
          className="rounded-[24rpx] bg-[#2B8BFF] p-5 mb-5 shadow-[0_14rpx_28rpx_rgba(24,80,190,0.22)]"
          onClick={() =>
            Taro.navigateTo({
              url: `/pages/PetReport/index${activePetId ? `?petId=${activePetId}` : ''}`,
            })
          }
        >
          <Text className="text-[30rpx] font-semibold text-white block">宠物数据报告</Text>
          <Text className="text-[22rpx] text-[#DBEAFF] mt-[8rpx] block">
            查看最近 30 天记录、花销构成和照护亮点。
          </Text>
        </View>

        <View className="grid grid-cols-2 gap-3 mb-5">
          <View
            className="rounded-[22rpx] bg-white p-4 shadow-[0_14rpx_28rpx_rgba(0,0,0,0.06)]"
            onClick={() => switchTabWithActivePet('/pages/PetSchedule/index', activePetId)}
          >
            <Text className="text-[24rpx] font-semibold text-[#2c2c2c]">提醒处理</Text>
            <Text className="text-[22rpx] text-[#666] mt-[8rpx] block">
              还有 {dashboard?.totals.pendingReminderCount || 0} 条待办
            </Text>
            <Text className="text-[20rpx] text-[#5a78d4] mt-[10rpx] block">去日程页</Text>
          </View>
          <View
            className="rounded-[22rpx] bg-white p-4 shadow-[0_14rpx_28rpx_rgba(0,0,0,0.06)]"
            onClick={() =>
              Taro.navigateTo({
                url: `/pages/PetMilestones/index${activePetId ? `?petId=${activePetId}` : ''}`,
              })
            }
          >
            <Text className="text-[24rpx] font-semibold text-[#2c2c2c]">成长记录</Text>
            <Text className="text-[22rpx] text-[#666] mt-[8rpx] block">
              当前已记录 {dashboard?.quickStats.milestoneCount || 0} 个节点
            </Text>
            <Text className="text-[20rpx] text-[#B25E8B] mt-[10rpx] block">去里程碑页</Text>
          </View>
          <View
            className="rounded-[22rpx] bg-white p-4 shadow-[0_14rpx_28rpx_rgba(0,0,0,0.06)]"
            onClick={() =>
              Taro.navigateTo({
                url: `/pages/PetFood/index${activePetId ? `?petId=${activePetId}` : ''}`,
              })
            }
          >
            <Text className="text-[24rpx] font-semibold text-[#2c2c2c]">库存检查</Text>
            <Text className="text-[22rpx] text-[#666] mt-[8rpx] block">
              低库存食物 {dashboard?.totals.lowInventoryCount || 0} 条
            </Text>
            <Text className="text-[20rpx] text-[#8A6A2C] mt-[10rpx] block">去食物页</Text>
          </View>
          <View
            className="rounded-[22rpx] bg-white p-4 shadow-[0_14rpx_28rpx_rgba(0,0,0,0.06)]"
            onClick={() =>
              Taro.navigateTo({
                url: `/pages/PetMedicine/index${activePetId ? `?petId=${activePetId}` : ''}`,
              })
            }
          >
            <Text className="text-[24rpx] font-semibold text-[#2c2c2c]">疗程跟进</Text>
            <Text className="text-[22rpx] text-[#666] mt-[8rpx] block">
              临近结束用药 {dashboard?.totals.dueMedicineCount || 0} 条
            </Text>
            <Text className="text-[20rpx] text-[#7A61A7] mt-[10rpx] block">去用药页</Text>
          </View>
        </View>

        {dashboard?.latestMilestone ? (
          <View
            className="rounded-[24rpx] bg-[#FFF5FA] p-5 mb-5 shadow-[0_14rpx_28rpx_rgba(190,98,144,0.12)]"
            onClick={() =>
              Taro.navigateTo({
                url: `/pages/PetMilestones/index${activePetId ? `?petId=${activePetId}` : ''}`,
              })
            }
          >
            <Text className="text-[28rpx] font-semibold text-[#7D3C65] block">最近成长节点</Text>
            <Text className="text-[24rpx] text-[#44313C] mt-[10rpx] block">
              {dashboard.latestMilestone.title}
            </Text>
            <Text className="text-[22rpx] text-[#8A6A7B] mt-[6rpx] block">
              {dashboard.latestMilestone.occurredAt.slice(0, 10)}
            </Text>
            {dashboard.latestMilestone.description ? (
              <Text className="text-[22rpx] text-[#6F5965] mt-[10rpx] block leading-[1.7]">
                {dashboard.latestMilestone.description}
              </Text>
            ) : null}
          </View>
        ) : null}

        {activePet && !dashboard?.latestMilestone ? (
          <View className="rounded-[24rpx] bg-[#FFF5FA] p-5 mb-5 shadow-[0_14rpx_28rpx_rgba(190,98,144,0.08)]">
            <Text className="text-[28rpx] font-semibold text-[#7D3C65] block">还没有最近成长节点</Text>
            <Text className="text-[22rpx] text-[#8A6A7B] mt-[8rpx] block leading-[1.7]">
              {activePet.name} 的服务概览已经切到单宠视角了，下一步最适合补一个成长里程碑，这样报告、首页和详情页都会更完整。
            </Text>
            <View
              className="mt-4 px-4 py-3 rounded-[18rpx] bg-white inline-flex"
              onClick={() =>
                Taro.navigateTo({
                  url: `/pages/PetMilestones/index${activePetId ? `?petId=${activePetId}` : ''}`,
                })
              }
            >
              <Text className="text-[22rpx] text-[#B25E8B] font-semibold">去记录里程碑</Text>
            </View>
          </View>
        ) : null}

        <View className="rounded-[24rpx] bg-white p-5 shadow-[0_14rpx_28rpx_rgba(0,0,0,0.06)]">
          <Text className="text-[28rpx] font-semibold text-[#2c2c2c] mb-4 block">宠物服务概览</Text>
          {(dashboard?.petCards || []).length ? (
            dashboard?.petCards.map((item) => (
              <View
                key={item.petId}
                className="rounded-[18rpx] bg-[#F8F8F8] p-4 mb-3"
                onClick={() => {
                  setStoredActivePetId(item.petId);
                  Taro.navigateTo({ url: `/pages/PetDetailPage/index?petId=${item.petId}` });
                }}
              >
                <View className="flex items-center justify-between">
                  <Text className="text-[28rpx] font-semibold text-[#2c2c2c]">{item.petName}</Text>
                  <Text className="text-[22rpx] text-[#5a78d4]">查看详情</Text>
                </View>
                <Text className="text-[22rpx] text-[#666] mt-[8rpx] block">
                  {item.breed || item.type || '未填写品种'} · {item.gender || '未填写性别'}
                </Text>
                <Text className="text-[22rpx] text-[#666] mt-[4rpx] block">
                  {item.active ? '当前查看宠物' : '可切换查看详情'}
                </Text>
              </View>
            ))
          ) : (
            <Text className="text-[24rpx] text-[#8a8a8a]">当前还没有可展示的宠物服务数据</Text>
          )}
        </View>
      </View>
    </BasicLayout>
  );
});

export default PetServiceCenter;
