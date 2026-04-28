import BasicLayout from '@/layout/basicLayout';
import { View, Text } from '@tarojs/components';
import Taro, { useDidShow, useRouter } from '@tarojs/taro';
import { memo, useEffect, useMemo, useState } from 'react';
import { PET_UI } from '@/constants/petUi';
import { getReportData, ReportData } from '@/api/data';
import { setStoredActivePetId, switchTabWithActivePet } from '@/utils/activePetState';
import { ensureLoggedIn, isLoggedIn } from '@/utils/authState';

const PetReport = memo(function PetReport() {
  const { params } = useRouter();
  const initialPetId = params.petId || '';
  const [report, setReport] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(false);
  const loggedIn = isLoggedIn();

  const loadData = (petId?: string) => {
    if (!loggedIn) {
      setReport(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    getReportData(petId)
      .then((res) => setReport(res))
      .catch(() => setReport(null))
      .finally(() => setLoading(false));
  };

  useDidShow(() => {
    loadData(initialPetId || undefined);
  });

  const currentPetId = report?.activePet?.id || initialPetId;

  useEffect(() => {
    if (currentPetId) {
      setStoredActivePetId(currentPetId);
    }
  }, [currentPetId]);

  const expenseList = Object.entries(report?.expenseByCategory || {}).sort((a, b) => b[1] - a[1]);
  const careList = Object.entries(report?.careByCategory || {}).sort((a, b) => b[1] - a[1]);
  const quickLinks = useMemo(
    () => [
      {
        title: '成长时光轴',
        subtitle: '回看提醒、护理和里程碑',
        accent: '#5a78d4',
        url: `/pages/PetTimeline/index${currentPetId ? `?petId=${currentPetId}` : ''}`,
      },
      {
        title: '花销统计',
        subtitle: '查看预算和分类构成',
        accent: '#8A6A2C',
        url: `/pages/PetExpenseStats/index${currentPetId ? `?petId=${currentPetId}` : ''}`,
      },
      {
        title: '护理记录',
        subtitle: '检查近期护理和复查安排',
        accent: '#7A61A7',
        url: `/pages/PetCareStats/index${currentPetId ? `?petId=${currentPetId}` : ''}`,
      },
      {
        title: '成长里程碑',
        subtitle: '继续补充关键成长节点',
        accent: '#B25E8B',
        url: `/pages/PetMilestones/index${currentPetId ? `?petId=${currentPetId}` : ''}`,
      },
    ],
    [currentPetId]
  );
  const summaryCards = [
    {
      title: '最近 30 天花销',
      value: `¥${Number(report?.summary.recentExpense || 0).toFixed(2)}`,
      url: `/pages/PetExpenseStats/index${currentPetId ? `?petId=${currentPetId}` : ''}`,
    },
    {
      title: '待处理提醒',
      value: `${report?.summary.pendingSchedules || 0}`,
      url: '/pages/PetSchedule/index',
    },
    {
      title: '护理记录',
      value: `${report?.summary.totalCareRecords || 0}`,
      url: `/pages/PetCareStats/index${currentPetId ? `?petId=${currentPetId}` : ''}`,
    },
    {
      title: '日常记录',
      value: `${report?.summary.totalRecords || 0}`,
      url: `/pages/PetTimeline/index${currentPetId ? `?petId=${currentPetId}` : ''}`,
    },
    {
      title: '食物档案',
      value: `${report?.summary.totalFoods || 0}`,
      url: `/pages/PetFood/index${currentPetId ? `?petId=${currentPetId}` : ''}`,
    },
    {
      title: '用药档案',
      value: `${report?.summary.totalMedicines || 0}`,
      url: `/pages/PetMedicine/index${currentPetId ? `?petId=${currentPetId}` : ''}`,
    },
    {
      title: '成长里程碑',
      value: `${report?.summary.totalMilestones || 0}`,
      url: `/pages/PetMilestones/index${currentPetId ? `?petId=${currentPetId}` : ''}`,
      fullWidth: true,
    },
  ];
  const handleRecentMomentClick = (type: string) => {
    if (!currentPetId) {
      return;
    }

    if (type === 'milestone') {
      Taro.navigateTo({ url: `/pages/PetMilestones/index?petId=${currentPetId}` });
      return;
    }

    if (type === 'expense') {
      Taro.navigateTo({ url: `/pages/PetExpenseStats/index?petId=${currentPetId}` });
      return;
    }

    if (type === 'care') {
      Taro.navigateTo({ url: `/pages/PetCareStats/index?petId=${currentPetId}` });
      return;
    }

    if (type === 'food') {
      Taro.navigateTo({ url: `/pages/PetFood/index?petId=${currentPetId}` });
      return;
    }

    if (type === 'medicine') {
      Taro.navigateTo({ url: `/pages/PetMedicine/index?petId=${currentPetId}` });
      return;
    }

    Taro.navigateTo({ url: `/pages/PetTimeline/index?petId=${currentPetId}` });
  };
  const missingActions = [
    {
      title: '补提醒',
      visible: (report?.summary.pendingSchedules || 0) === 0,
      onClick: () =>
        currentPetId
          ? Taro.navigateTo({ url: `/pages/AddPetReminder/index?petId=${currentPetId}` })
          : undefined,
    },
    {
      title: '补记录',
      visible: (report?.summary.totalRecords || 0) === 0,
      onClick: () =>
        currentPetId
          ? Taro.navigateTo({ url: `/pages/AddPetRecord/index?petId=${currentPetId}&mode=record` })
          : undefined,
    },
    {
      title: '补里程碑',
      visible: (report?.summary.totalMilestones || 0) === 0,
      onClick: () =>
        currentPetId
          ? Taro.navigateTo({ url: `/pages/PetMilestones/index?petId=${currentPetId}` })
          : undefined,
    },
  ].filter((item) => item.visible);

  return (
    <BasicLayout
      wrapClassName="w-full h-full"
      wrapStyle={{
        backgroundImage: PET_UI.pageBackground,
        minHeight: '100vh',
      }}
      navOptions={{ navTitle: '宠物报告', needBack: true }}
    >
      <View className="px-6 pt-4 pb-[110rpx]">
        <View className="mb-4 flex gap-2 flex-wrap">
          {(report?.petOptions || []).map((pet) => (
            <View
              key={pet.petId}
              className="px-4 py-2 rounded-[16rpx]"
              style={{
                backgroundColor: pet.active ? '#FFD93B' : '#f4f4f4',
                border: '2rpx solid #262626',
              }}
              onClick={() => {
                setStoredActivePetId(pet.petId);
                loadData(pet.petId);
                Taro.redirectTo({ url: `/pages/PetReport/index?petId=${pet.petId}` });
              }}
            >
              <Text className="text-[24rpx]">{pet.petName}</Text>
            </View>
          ))}
        </View>

        {!loggedIn ? (
          <View className="rounded-[24rpx] bg-white p-5 mb-5 shadow-[0_14rpx_28rpx_rgba(0,0,0,0.06)]">
            <Text className="text-[30rpx] font-semibold text-[#2c2c2c] block">登录后查看专属宠物报告</Text>
            <Text className="text-[22rpx] text-[#666] mt-[10rpx] block leading-[1.7]">
              花销、护理、提醒和日常记录会汇总成阶段报告，方便你回顾最近的照护情况。
            </Text>
            <View
              className="mt-[20rpx] inline-flex px-[24rpx] py-[14rpx] rounded-[999rpx] bg-[#FFD93B]"
              style={{ border: '2rpx solid #262626' }}
              onClick={() =>
                ensureLoggedIn(`/pages/PetReport/index${initialPetId ? `?petId=${initialPetId}` : ''}`)
              }
            >
              <Text className="text-[24rpx] text-[#2c2c2c]">去微信登录</Text>
            </View>
          </View>
        ) : null}

        {loggedIn && !loading && !report?.petOptions?.length ? (
          <View className="rounded-[24rpx] bg-white p-5 mb-5 shadow-[0_14rpx_28rpx_rgba(0,0,0,0.06)]">
            <Text className="text-[30rpx] font-semibold text-[#2c2c2c] block">还没有宠物档案</Text>
            <Text className="text-[22rpx] text-[#666] mt-[10rpx] block leading-[1.7]">
              先添加一只宠物，后面这里会自动生成属于它的报告和阶段总结。
            </Text>
            <View
              className="mt-[20rpx] inline-flex px-[24rpx] py-[14rpx] rounded-[999rpx] bg-[#FFD93B]"
              style={{ border: '2rpx solid #262626' }}
              onClick={() => Taro.navigateTo({ url: '/pages/EditPetProfile/index' })}
            >
              <Text className="text-[24rpx] text-[#2c2c2c]">去添加宠物</Text>
            </View>
          </View>
        ) : null}

        <View className="rounded-[28rpx] bg-[#FFF7D5] px-5 py-6 mb-5 shadow-[0_16rpx_34rpx_rgba(230,193,82,0.18)]">
          <Text className="text-[34rpx] font-semibold text-[#5D4510] block">
            {report?.activePet?.name || '当前宠物'}的数据小结
          </Text>
          <Text className="text-[22rpx] text-[#7D6532] leading-[1.7] mt-[10rpx] block">
            {loading
              ? '正在整理报告...'
              : `一起生活 ${report?.summary.activeDays || 0} 天，累计记录花销 ¥${Number(report?.summary.totalExpense || 0).toFixed(2)}。`}
          </Text>
          {report?.activePet ? (
            <Text className="text-[22rpx] text-[#8A6A2C] mt-[10rpx] block">
              当前报告只统计 {report.activePet.name} 的专属数据，不和其他宠物混合。
            </Text>
          ) : null}
        </View>

        {currentPetId ? (
          <View className="rounded-[24rpx] bg-white p-5 mb-5 shadow-[0_14rpx_28rpx_rgba(0,0,0,0.06)]">
            <Text className="text-[28rpx] font-semibold text-[#2c2c2c] block">报告下一步建议</Text>
            <Text className="text-[22rpx] text-[#666] mt-[8rpx] block leading-[1.7]">
              报告已经是当前宠物的单独视角了。看完摘要后，最适合继续补齐缺失数据，或者直接回到时间线和日程里处理当天事项。
            </Text>
            {missingActions.length ? (
              <View className="grid grid-cols-3 gap-3 mt-4">
                {missingActions.map((item) => (
                  <View
                    key={item.title}
                    className="rounded-[18rpx] bg-[#FFF9E8] p-4"
                    onClick={item.onClick}
                  >
                    <Text className="text-[24rpx] font-semibold text-[#5D4510]">{item.title}</Text>
                    <Text className="text-[20rpx] text-[#7D6532] mt-[6rpx] block">继续补全数据</Text>
                  </View>
                ))}
              </View>
            ) : (
              <View className="grid grid-cols-2 gap-3 mt-4">
                <View
                  className="rounded-[18rpx] bg-[#EEF4FF] p-4"
                  onClick={() => switchTabWithActivePet('/pages/PetSchedule/index', currentPetId)}
                >
                  <Text className="text-[24rpx] font-semibold text-[#466481]">回到日程</Text>
                  <Text className="text-[20rpx] text-[#6D8092] mt-[6rpx] block">继续处理待办</Text>
                </View>
                <View
                  className="rounded-[18rpx] bg-[#F8FAFF] p-4"
                  onClick={() => Taro.navigateTo({ url: `/pages/PetTimeline/index?petId=${currentPetId}` })}
                >
                  <Text className="text-[24rpx] font-semibold text-[#466481]">回看时间线</Text>
                  <Text className="text-[20rpx] text-[#6D8092] mt-[6rpx] block">检查最近动态回流</Text>
                </View>
              </View>
            )}
          </View>
        ) : null}

        {currentPetId ? (
          <View className="grid grid-cols-2 gap-3 mb-5">
            {quickLinks.map((item) => (
              <View
                key={item.title}
                className="rounded-[22rpx] bg-white p-4 shadow-[0_14rpx_26rpx_rgba(0,0,0,0.06)]"
                onClick={() => Taro.navigateTo({ url: item.url })}
              >
                <Text className="text-[24rpx] font-semibold text-[#2c2c2c]">{item.title}</Text>
                <Text className="text-[22rpx] text-[#666] mt-[8rpx] block">{item.subtitle}</Text>
                <Text className="text-[20rpx] mt-[10rpx] block" style={{ color: item.accent }}>
                  继续查看
                </Text>
              </View>
            ))}
          </View>
        ) : null}

        <View className="grid grid-cols-2 gap-3 mb-5">
          {summaryCards.map((item) => (
            <View
              key={item.title}
              className={`rounded-[22rpx] bg-white p-5 shadow-[0_14rpx_26rpx_rgba(0,0,0,0.06)] ${item.fullWidth ? 'col-span-2' : ''}`}
              onClick={() => {
                if (item.url === '/pages/PetSchedule/index') {
                  switchTabWithActivePet(item.url, currentPetId);
                  return;
                }
                Taro.navigateTo({ url: item.url });
              }}
            >
              <Text className="text-[22rpx] text-[#777]">{item.title}</Text>
              <Text className="text-[40rpx] font-semibold text-[#2c2c2c] mt-[8rpx] block">
                {item.value}
              </Text>
              <Text className="text-[20rpx] text-[#5a78d4] mt-[10rpx] block">继续查看</Text>
            </View>
          ))}
        </View>

        <View className="rounded-[24rpx] bg-white p-5 mb-5 shadow-[0_14rpx_28rpx_rgba(0,0,0,0.06)]">
          <Text className="text-[28rpx] font-semibold text-[#2c2c2c] mb-4 block">最近 30 天</Text>
          <View className="grid grid-cols-2 gap-3">
            <View className="rounded-[18rpx] bg-[#EEF4FF] p-4">
              <Text className="text-[22rpx] text-[#6a7ca8]">提醒</Text>
              <Text className="text-[34rpx] font-semibold text-[#2c2c2c] mt-[6rpx]">
                {report?.recent30Days.schedules || 0}
              </Text>
            </View>
            <View className="rounded-[18rpx] bg-[#FFF7E5] p-4">
              <Text className="text-[22rpx] text-[#8a6a2c]">花销</Text>
              <Text className="text-[34rpx] font-semibold text-[#2c2c2c] mt-[6rpx]">
                {report?.recent30Days.expenses || 0}
              </Text>
            </View>
            <View className="rounded-[18rpx] bg-[#F5F0FF] p-4">
              <Text className="text-[22rpx] text-[#7a61a7]">护理</Text>
              <Text className="text-[34rpx] font-semibold text-[#2c2c2c] mt-[6rpx]">
                {report?.recent30Days.careRecords || 0}
              </Text>
            </View>
            <View className="rounded-[18rpx] bg-[#EFFAF4] p-4">
              <Text className="text-[22rpx] text-[#56836a]">日常</Text>
              <Text className="text-[34rpx] font-semibold text-[#2c2c2c] mt-[6rpx]">
                {report?.recent30Days.records || 0}
              </Text>
            </View>
            <View className="rounded-[18rpx] bg-[#FFF0F6] p-4 col-span-2">
              <Text className="text-[22rpx] text-[#8A5374]">里程碑</Text>
              <Text className="text-[34rpx] font-semibold text-[#2c2c2c] mt-[6rpx]">
                {report?.recent30Days.milestones || 0}
              </Text>
            </View>
          </View>
        </View>

        <View className="rounded-[24rpx] bg-white p-5 mb-5 shadow-[0_14rpx_28rpx_rgba(0,0,0,0.06)]">
          <Text className="text-[28rpx] font-semibold text-[#2c2c2c] mb-4 block">亮点总结</Text>
          {(report?.highlights || []).length ? (
            (report?.highlights || []).map((item) => (
              <View key={item} className="rounded-[16rpx] bg-[#FFF9E8] p-4 mb-3">
                <Text className="text-[22rpx] text-[#6f5a2b] leading-[1.7]">{item}</Text>
              </View>
            ))
          ) : (
            <View className="rounded-[16rpx] bg-[#FFF9E8] p-4">
              <Text className="text-[22rpx] text-[#6f5a2b] leading-[1.7]">
                {report?.activePet?.name || '当前宠物'}最近还没有足够的数据生成亮点总结，先补一些提醒、记录或里程碑，报告会逐步变完整。
              </Text>
            </View>
          )}
        </View>

        <View className="rounded-[24rpx] bg-white p-5 mb-5 shadow-[0_14rpx_28rpx_rgba(0,0,0,0.06)]">
          <Text className="text-[28rpx] font-semibold text-[#2c2c2c] mb-4 block">近 7 天趋势</Text>
          {(report?.recent7Days || []).length ? (
            (report?.recent7Days || []).map((item) => (
              <View key={item.date} className="rounded-[18rpx] bg-[#FFF9E8] p-4 mb-3">
                <View className="flex items-center justify-between">
                  <Text className="text-[22rpx] text-[#53411c]">{item.label}</Text>
                  <Text className="text-[20rpx] text-[#8a7442]">花销 ¥{Number(item.expense || 0).toFixed(2)}</Text>
                </View>
                <Text className="text-[20rpx] text-[#766238] mt-[6rpx] block">
                  日常 {item.recordCount} 条 · 护理 {item.careCount} 条
                </Text>
              </View>
            ))
          ) : (
            <Text className="text-[24rpx] text-[#8a8a8a]">最近 7 天还没有可统计的趋势数据</Text>
          )}
        </View>

        <View className="rounded-[24rpx] bg-white p-5 shadow-[0_14rpx_28rpx_rgba(0,0,0,0.06)]">
          <Text className="text-[28rpx] font-semibold text-[#2c2c2c] mb-4 block">花销构成</Text>
          <Text className="text-[22rpx] text-[#666] mb-4 block">
            当前最高频花销分类：{report?.topExpenseCategory || '未分类'}
          </Text>
          {expenseList.length ? (
            expenseList.map(([name, amount]) => (
              <View key={name} className="mb-3">
                <View className="flex items-center justify-between mb-[6rpx]">
                  <Text className="text-[22rpx] text-[#444]">{name}</Text>
                  <Text className="text-[22rpx] text-[#777]">¥{Number(amount).toFixed(2)}</Text>
                </View>
                <View className="h-[14rpx] rounded-[999rpx] bg-[#F4F4F4] overflow-hidden">
                  <View
                    className="h-full rounded-[999rpx] bg-[#FFC58A]"
                    style={{
                      width: `${Math.min(
                        (Number(amount) /
                          Math.max(...expenseList.map(([, value]) => Number(value)), 1)) *
                          100,
                        100
                      )}%`,
                    }}
                  />
                </View>
              </View>
            ))
          ) : (
            <Text className="text-[24rpx] text-[#8a8a8a]">当前还没有花销数据</Text>
          )}
        </View>

        <View className="rounded-[24rpx] bg-white p-5 mt-5 shadow-[0_14rpx_28rpx_rgba(0,0,0,0.06)]">
          <Text className="text-[28rpx] font-semibold text-[#2c2c2c] mb-4 block">护理分布</Text>
          {careList.length ? (
            careList.map(([name, count]) => (
              <View key={name} className="flex items-center justify-between py-[10rpx] border-b border-[#efefef] last:border-b-0">
                <Text className="text-[22rpx] text-[#444]">{name}</Text>
                <Text className="text-[22rpx] text-[#777]">{count} 次</Text>
              </View>
            ))
          ) : (
            <Text className="text-[24rpx] text-[#8a8a8a]">当前还没有护理分类数据</Text>
          )}
        </View>

        <View className="rounded-[24rpx] bg-white p-5 mt-5 shadow-[0_14rpx_28rpx_rgba(0,0,0,0.06)]">
          <Text className="text-[28rpx] font-semibold text-[#2c2c2c] mb-4 block">最近动态</Text>
          {(report?.recentMoments || []).length ? (
            (report?.recentMoments || []).map((item) => (
              <View
                key={item.id}
                className="rounded-[16rpx] bg-[#F8FAFF] p-4 mb-3"
                onClick={() => handleRecentMomentClick(item.type)}
              >
                <View className="flex items-center justify-between">
                  <Text className="text-[22rpx] text-[#333]">{item.title}</Text>
                  <Text className="text-[18rpx] text-[#8a8a8a]">
                    {item.type === 'milestone' ? '里程碑' : item.type}
                  </Text>
                </View>
                <Text className="text-[20rpx] text-[#7b7b7b] mt-[6rpx] block">
                  {item.date.slice(0, 10)}
                </Text>
                <Text className="text-[18rpx] text-[#5a78d4] mt-[8rpx] block">查看相关页面</Text>
              </View>
            ))
          ) : (
            <View className="rounded-[16rpx] bg-[#F8FAFF] p-4">
              <Text className="text-[24rpx] text-[#8a8a8a]">
                最近还没有新的动态，可以先去补提醒、记录或里程碑，新的数据会很快回流到这里。
              </Text>
              {currentPetId ? (
                <View className="flex gap-3 mt-4">
                  <View
                    className="flex-1 rounded-[16rpx] bg-[#FFD93B] px-4 py-3 flex items-center justify-center"
                    onClick={() => Taro.navigateTo({ url: `/pages/AddPetReminder/index?petId=${currentPetId}` })}
                  >
                    <Text className="text-[22rpx] font-semibold text-[#5D4510]">新增提醒</Text>
                  </View>
                  <View
                    className="flex-1 rounded-[16rpx] bg-white border-[2rpx] border-solid border-[#D8E6FF] px-4 py-3 flex items-center justify-center"
                    onClick={() => Taro.navigateTo({ url: `/pages/AddPetRecord/index?petId=${currentPetId}&mode=record` })}
                  >
                    <Text className="text-[22rpx] text-[#466481]">新增记录</Text>
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

export default PetReport;
