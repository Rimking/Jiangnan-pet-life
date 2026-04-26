import BasicLayout from '@/layout/basicLayout';
import { View, Text } from '@tarojs/components';
import Taro, { useDidShow, useRouter } from '@tarojs/taro';
import { memo, useMemo, useState } from 'react';
import { PET_UI } from '@/constants/petUi';
import { getOwnerOverviewData, OwnerOverviewData } from '@/api/data';
import { ensureLoggedIn, isLoggedIn } from '@/utils/authState';
import { usePetApiPets } from '@/hooks/usePetApiPets';

const PetServiceCenter = memo(function PetServiceCenter() {
  const { params } = useRouter();
  const mode = params.mode === 'subscription' ? 'subscription' : 'member';
  const loggedIn = isLoggedIn();
  const { activePetId } = usePetApiPets();
  const [dashboard, setDashboard] = useState<OwnerOverviewData | null>(null);
  const [loading, setLoading] = useState(false);

  useDidShow(() => {
    if (!loggedIn) {
      setDashboard(null);
      return;
    }
    setLoading(true);
    getOwnerOverviewData(activePetId || undefined)
      .then((res) => setDashboard(res))
      .catch(() => setDashboard(null))
      .finally(() => setLoading(false));
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
          },
          {
            title: '临近结束用药',
            value: dashboard?.totals.dueMedicineCount || 0,
            subtitle: '建议尽快检查疗程是否需要续上',
            bg: '#F5F0FF',
          },
          {
            title: '食物库存提醒',
            value: dashboard?.totals.lowInventoryCount || 0,
            subtitle: '库存偏低的食物建议尽快补充',
            bg: '#FFF7E5',
          },
        ]
      : [
          {
            title: '宠物档案',
            value: dashboard?.totals.pets || 0,
            subtitle: '已建立的宠物资料数',
            bg: '#FFF7E5',
          },
          {
            title: '待处理提醒',
            value: dashboard?.totals.pendingReminderCount || 0,
            subtitle: '还没处理的照护安排',
            bg: '#EEF4FF',
          },
          {
            title: '护理记录',
            value: dashboard?.quickStats.careCount || 0,
            subtitle: '当前宠物累计护理次数',
            bg: '#F5F0FF',
          },
          {
            title: '成长里程碑',
            value: dashboard?.quickStats.milestoneCount || 0,
            subtitle: '沉淀关键成长节点',
            bg: '#FFF0F6',
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
                : `当前总计 ${dashboard?.totals.pets || 0} 只宠物，${dashboard?.totals.pendingReminderCount || 0} 条待处理提醒。`}
          </Text>
        </View>
        {!loggedIn ? (
          <View
            className="mt-4 px-4 py-3 rounded-[18rpx] bg-[#FFD93B]"
            onClick={() => ensureLoggedIn(`/pages/PetServiceCenter/index?mode=${mode}`)}
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
            >
              <Text className="text-[22rpx] text-[#7a7a7a]">{item.title}</Text>
              <Text className="text-[42rpx] font-semibold text-[#2c2c2c] mt-[8rpx] block">
                {item.value}
              </Text>
              <Text className="text-[22rpx] text-[#666] mt-[6rpx]">{item.subtitle}</Text>
            </View>
          ))}
        </View>

        <View
          className="rounded-[24rpx] bg-[#2B8BFF] p-5 mb-5 shadow-[0_14rpx_28rpx_rgba(24,80,190,0.22)]"
          onClick={() => Taro.navigateTo({ url: '/pages/PetReport/index' })}
        >
          <Text className="text-[30rpx] font-semibold text-white block">宠物数据报告</Text>
          <Text className="text-[22rpx] text-[#DBEAFF] mt-[8rpx] block">
            查看最近 30 天记录、花销构成和照护亮点。
          </Text>
        </View>

        <View className="grid grid-cols-2 gap-3 mb-5">
          <View
            className="rounded-[22rpx] bg-white p-4 shadow-[0_14rpx_28rpx_rgba(0,0,0,0.06)]"
            onClick={() => Taro.switchTab({ url: '/pages/PetSchedule/index' })}
          >
            <Text className="text-[24rpx] font-semibold text-[#2c2c2c]">提醒处理</Text>
            <Text className="text-[22rpx] text-[#666] mt-[8rpx] block">
              还有 {dashboard?.totals.pendingReminderCount || 0} 条待办
            </Text>
            <Text className="text-[20rpx] text-[#5a78d4] mt-[10rpx] block">去日程页</Text>
          </View>
          <View
            className="rounded-[22rpx] bg-white p-4 shadow-[0_14rpx_28rpx_rgba(0,0,0,0.06)]"
            onClick={() => Taro.navigateTo({ url: '/pages/PetMilestones/index' })}
          >
            <Text className="text-[24rpx] font-semibold text-[#2c2c2c]">成长记录</Text>
            <Text className="text-[22rpx] text-[#666] mt-[8rpx] block">
              当前已记录 {dashboard?.quickStats.milestoneCount || 0} 个节点
            </Text>
            <Text className="text-[20rpx] text-[#B25E8B] mt-[10rpx] block">去里程碑页</Text>
          </View>
          <View
            className="rounded-[22rpx] bg-white p-4 shadow-[0_14rpx_28rpx_rgba(0,0,0,0.06)]"
            onClick={() => Taro.navigateTo({ url: '/pages/PetFood/index' })}
          >
            <Text className="text-[24rpx] font-semibold text-[#2c2c2c]">库存检查</Text>
            <Text className="text-[22rpx] text-[#666] mt-[8rpx] block">
              低库存食物 {dashboard?.totals.lowInventoryCount || 0} 条
            </Text>
            <Text className="text-[20rpx] text-[#8A6A2C] mt-[10rpx] block">去食物页</Text>
          </View>
          <View
            className="rounded-[22rpx] bg-white p-4 shadow-[0_14rpx_28rpx_rgba(0,0,0,0.06)]"
            onClick={() => Taro.navigateTo({ url: '/pages/PetMedicine/index' })}
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
            onClick={() => Taro.navigateTo({ url: '/pages/PetMilestones/index' })}
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

        <View className="rounded-[24rpx] bg-white p-5 shadow-[0_14rpx_28rpx_rgba(0,0,0,0.06)]">
          <Text className="text-[28rpx] font-semibold text-[#2c2c2c] mb-4 block">宠物服务概览</Text>
          {(dashboard?.petCards || []).length ? (
            dashboard?.petCards.map((item) => (
              <View
                key={item.petId}
                className="rounded-[18rpx] bg-[#F8F8F8] p-4 mb-3"
                onClick={() => Taro.navigateTo({ url: `/pages/PetDetailPage/index?petId=${item.petId}` })}
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
