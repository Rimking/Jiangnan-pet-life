import BasicLayout from '@/layout/basicLayout';
import { View, Text } from '@tarojs/components';
import { memo, useCallback, useEffect, useState } from 'react';
import Taro, { useDidShow } from '@tarojs/taro';
import { PET_UI, PET_UI_BORDER, PET_UI_RADIUS, PET_UI_TEXT } from '@/constants/petUi';
import { formatLocalDateKey } from '@/utils/formatDate';
import PetHeader from './components/PetHeader';
import PetInfoCard from './components/PetInfoCard';
import FunctionGrid from './components/FunctionGrid';
import DailyTip from './components/DailyTip';
import ExpenseInsight from './components/ExpenseInsight';
import { getProfileOverviewData } from '@/api/data';
import { usePetApiPets } from '@/hooks/usePetApiPets';
import { setStoredActivePetId, switchTabWithActivePet } from '@/utils/activePetState';
import { ensureLoggedIn, isLoggedIn } from '@/utils/authState';

const emptyStats = {
  reminders: 0,
  records: 0,
  care: 0,
  monthExpense: 0,
  milestones: 0,
};

const emptyExpenseInsight = {
  monthTotal: 0,
  categoryTop: [] as Array<{ name: string; amount: number }>,
  weekSeries: [] as number[],
};

const PetProfile = memo(function PetProfile() {
  const { pets, activePet, activePetId, loading, error, setActivePetId } = usePetApiPets();
  const [stats, setStats] = useState(emptyStats);
  const [expenseInsight, setExpenseInsight] = useState(emptyExpenseInsight);
  const [recentMilestone, setRecentMilestone] = useState<{
    id: string;
    title: string;
    occurredAt: string;
    description?: string;
  } | null>(null);

  const today = formatLocalDateKey(new Date());
  const loggedIn = isLoggedIn();

  const nextProfileActions = activePet
    ? [
        {
          title: '查看报告',
          subtitle: '快速回看这只宠物的摘要和最近趋势',
          accent: '#466481',
          onClick: () => Taro.navigateTo({ url: `/pages/PetReport/index?petId=${activePet.id}` }),
        },
        {
          title: '服务概览',
          subtitle: '回到服务中心继续处理提醒、库存和疗程',
          accent: '#5a78d4',
          onClick: () =>
            Taro.navigateTo({ url: `/pages/PetServiceCenter/index?mode=member&petId=${activePet.id}` }),
        },
        {
          title: stats.reminders === 0 ? '补提醒' : '去日程',
          subtitle:
            stats.reminders === 0
              ? `先给${activePet.name}安排今天的照护事项`
              : `当前还有 ${stats.reminders} 条提醒，继续处理今天安排`,
          accent: '#8A6A2C',
          onClick: () =>
            stats.reminders === 0
              ? Taro.navigateTo({ url: `/pages/AddPetReminder/index?petId=${activePet.id}&date=${today}` })
              : switchTabWithActivePet('/pages/PetSchedule/index', activePet.id),
        },
      ]
    : [];

  const refreshProfileData = useCallback(async () => {
    if (!loggedIn || !activePetId) {
      setStats(emptyStats);
      setExpenseInsight(emptyExpenseInsight);
      setRecentMilestone(null);
      return;
    }

    try {
      const profileData = await getProfileOverviewData(activePetId);
      setStats(profileData.stats);
      setExpenseInsight(profileData.expenseInsight);
      setRecentMilestone(profileData.recentMilestone);
    } catch {
      setStats(emptyStats);
      setExpenseInsight(emptyExpenseInsight);
      setRecentMilestone(null);
    }
  }, [activePetId, loggedIn]);

  useEffect(() => {
    refreshProfileData();
  }, [refreshProfileData]);

  useDidShow(() => {
    refreshProfileData();
  });

  return (
    <BasicLayout
      wrapClassName="w-full h-full"
      wrapStyle={{
        backgroundImage: PET_UI.pageBackground,
        minHeight: '100vh',
      }}
    >
      <View className="pt-[44rpx] pb-[170rpx]">
        <PetHeader />

        {error ? (
          <View className="px-[28rpx] mb-[12rpx]">
            <Text className="text-[#d65a31]" style={{ fontSize: PET_UI_TEXT.body }}>
              {error}
            </Text>
          </View>
        ) : null}

        <View className="px-[28rpx] flex gap-[12rpx] mb-[16rpx] flex-wrap">
          {pets.map((pet) => {
            const active = pet.id === activePet?.id;
            return (
              <View
                key={pet.id}
                className="px-[22rpx] py-[12rpx] border-solid"
                style={{
                  border: PET_UI_BORDER.regular,
                  borderRadius: PET_UI_RADIUS.pill,
                  backgroundColor: active ? '#ffd93b' : '#f6f6f6',
                }}
                onClick={() => setActivePetId(pet.id)}
              >
                <Text style={{ fontSize: PET_UI_TEXT.body }}>{pet.name}</Text>
              </View>
            );
          })}
        </View>

        {!activePet && !loading ? (
          <View className="px-[28rpx]">
            <Text style={{ fontSize: PET_UI_TEXT.body }}>
              {loggedIn ? '暂时还没有宠物档案' : '登录后可创建并同步你的宠物档案'}
            </Text>
            {!loggedIn ? (
              <View
                className="mt-[18rpx] inline-flex px-[26rpx] py-[14rpx] rounded-[999rpx] border-solid"
                style={{
                  border: PET_UI_BORDER.regular,
                  borderRadius: PET_UI_RADIUS.pill,
                  backgroundColor: '#FFD93B',
                }}
                onClick={() => ensureLoggedIn('/pages/PetProfile/index')}
              >
                <Text style={{ fontSize: PET_UI_TEXT.body }}>去微信登录</Text>
              </View>
            ) : null}
          </View>
        ) : null}

        {activePet ? (
          <>
            <PetInfoCard
              pet={activePet}
              onOpenDetail={() => {
                setStoredActivePetId(activePet.id);
                Taro.navigateTo({ url: `/pages/PetDetailPage/index?petId=${activePet.id}` });
              }}
            />
            <FunctionGrid
              petName={activePet.name}
              stats={stats}
              onOpenSchedule={() => switchTabWithActivePet('/pages/PetSchedule/index', activePet.id)}
              onOpenExpense={() => Taro.navigateTo({ url: `/pages/PetExpenseStats/index?petId=${activePet.id}` })}
              onOpenCare={() => Taro.navigateTo({ url: `/pages/PetCareStats/index?petId=${activePet.id}` })}
              onOpenMilestones={() => Taro.navigateTo({ url: `/pages/PetMilestones/index?petId=${activePet.id}` })}
              onAddReminder={() =>
                Taro.navigateTo({
                  url: `/pages/AddPetReminder/index?petId=${activePet.id}&date=${today}`,
                })
              }
              onAddRecord={() =>
                Taro.navigateTo({
                  url: `/pages/AddPetRecord/index?petId=${activePet.id}&date=${today}&mode=record`,
                })
              }
            />
            <ExpenseInsight
              monthTotal={expenseInsight.monthTotal}
              categoryTop={expenseInsight.categoryTop}
              weekSeries={expenseInsight.weekSeries}
              onOpenDetail={() => Taro.navigateTo({ url: `/pages/PetExpenseStats/index?petId=${activePet.id}` })}
            />

            <View className="px-[28rpx] mt-[4rpx]">
              <View
                className="px-[22rpx] py-[22rpx] border-solid mb-[14rpx]"
                style={{
                  border: PET_UI_BORDER.regular,
                  borderRadius: PET_UI_RADIUS.md,
                  backgroundColor: '#F8FAFF',
                }}
              >
                <Text className="text-[#466481] font-semibold block" style={{ fontSize: PET_UI_TEXT.caption }}>
                  当前宠物下一步
                </Text>
                <Text className="text-[#2B2B2B] mt-[8rpx] block leading-[1.6]" style={{ fontSize: PET_UI_TEXT.body }}>
                  {stats.reminders > 0
                    ? `${activePet.name} 还有 ${stats.reminders} 条提醒待处理，建议先回日程页确认今天安排。`
                    : stats.records === 0
                      ? `${activePet.name} 还缺少日常记录，补一条之后时间线和报告会更完整。`
                      : '这只宠物的基础数据已经有了，可以继续去报告、服务中心或详情页回看整体状态。'}
                </Text>
                <View className="grid grid-cols-3 gap-[12rpx] mt-[16rpx]">
                  {nextProfileActions.map((item) => (
                    <View
                      key={item.title}
                      className="px-[14rpx] py-[18rpx] border-solid"
                      style={{
                        border: PET_UI_BORDER.regular,
                        borderRadius: PET_UI_RADIUS.md,
                        backgroundColor: '#ffffff',
                        minHeight: '142rpx',
                      }}
                      onClick={item.onClick}
                    >
                      <Text className="font-semibold block" style={{ fontSize: PET_UI_TEXT.body, color: item.accent }}>
                        {item.title}
                      </Text>
                      <Text className="text-[#6f6f6f] mt-[8rpx] block leading-[1.5]" style={{ fontSize: PET_UI_TEXT.caption }}>
                        {item.subtitle}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>

              <View
                className="px-[22rpx] py-[22rpx] border-solid"
                style={{
                  border: PET_UI_BORDER.regular,
                  borderRadius: PET_UI_RADIUS.md,
                  backgroundColor: '#FFF5FA',
                }}
                onClick={() => Taro.navigateTo({ url: `/pages/PetMilestones/index?petId=${activePet.id}` })}
              >
                <Text className="text-[#B25E8B]" style={{ fontSize: PET_UI_TEXT.caption }}>
                  最近成长里程碑
                </Text>
                <Text className="text-[#2B2B2B] font-semibold mt-[8rpx] block" style={{ fontSize: PET_UI_TEXT.body }}>
                  {recentMilestone
                    ? `${recentMilestone.title} · ${recentMilestone.occurredAt.slice(0, 10)}`
                    : '还没有成长节点，去记录第一次到家、第一次出门或疫苗完成吧。'}
                </Text>
                {recentMilestone?.description ? (
                  <Text className="text-[#7B6A74] mt-[6rpx] block" style={{ fontSize: PET_UI_TEXT.caption }}>
                    {recentMilestone.description}
                  </Text>
                ) : null}
                <Text className="text-[#B25E8B] mt-[10rpx] block" style={{ fontSize: PET_UI_TEXT.caption }}>
                  {recentMilestone ? '继续查看这只宠物的成长节点' : `给${activePet.name}记录一个成长节点`}
                </Text>
              </View>

              <View className="grid grid-cols-3 gap-[12rpx] mt-[14rpx]">
                <View
                  className="px-[14rpx] py-[18rpx] border-solid"
                  style={{
                    border: PET_UI_BORDER.regular,
                    borderRadius: PET_UI_RADIUS.md,
                    backgroundColor: '#FFF8E6',
                    minHeight: '126rpx',
                  }}
                  onClick={() => Taro.navigateTo({ url: `/pages/PetFood/index?petId=${activePet.id}` })}
                >
                  <Text className="text-[#8C6C2D] font-semibold block" style={{ fontSize: PET_UI_TEXT.body }}>
                    食物管理
                  </Text>
                  <Text className="text-[#7A6A3D] mt-[8rpx] block" style={{ fontSize: PET_UI_TEXT.caption }}>
                    库存和喂养
                  </Text>
                </View>
                <View
                  className="px-[14rpx] py-[18rpx] border-solid"
                  style={{
                    border: PET_UI_BORDER.regular,
                    borderRadius: PET_UI_RADIUS.md,
                    backgroundColor: '#F6F0FF',
                    minHeight: '126rpx',
                  }}
                  onClick={() => Taro.navigateTo({ url: `/pages/PetMedicine/index?petId=${activePet.id}` })}
                >
                  <Text className="text-[#6C5C90] font-semibold block" style={{ fontSize: PET_UI_TEXT.body }}>
                    用药管理
                  </Text>
                  <Text className="text-[#7A6A8B] mt-[8rpx] block" style={{ fontSize: PET_UI_TEXT.caption }}>
                    疗程和提醒
                  </Text>
                </View>
                <View
                  className="px-[14rpx] py-[18rpx] border-solid"
                  style={{
                    border: PET_UI_BORDER.regular,
                    borderRadius: PET_UI_RADIUS.md,
                    backgroundColor: '#EEF8FF',
                    minHeight: '126rpx',
                  }}
                  onClick={() => Taro.navigateTo({ url: `/pages/PetTimeline/index?petId=${activePet.id}` })}
                >
                  <Text className="text-[#4B6A77] font-semibold block" style={{ fontSize: PET_UI_TEXT.body }}>
                    成长时间线
                  </Text>
                  <Text className="text-[#5E7680] mt-[8rpx] block" style={{ fontSize: PET_UI_TEXT.caption }}>
                    回看全部记录
                  </Text>
                </View>
              </View>
            </View>
          </>
        ) : null}

        <DailyTip
          onOpenKnowledge={() => switchTabWithActivePet('/pages/PetKnowledge/index', activePetId)}
          onOpenQa={() => Taro.navigateTo({ url: `/pages/PetQa/index${activePetId ? `?petId=${activePetId}` : ''}` })}
        />
      </View>
    </BasicLayout>
  );
});

export default PetProfile;
