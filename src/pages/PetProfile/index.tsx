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
import {
  getProfileOverviewData,
  mapPetToProfileModel,
} from '@/api/data';
import { usePetApiPets } from '@/hooks/usePetApiPets';
import { ensureLoggedIn, isLoggedIn } from '@/utils/authState';

const PetProfile = memo(function PetProfile() {
  const { pets, activePet, activePetId, loading, error, setActivePetId } = usePetApiPets();
  const [stats, setStats] = useState({
    reminders: 0,
    records: 0,
    care: 0,
    monthExpense: 0,
    milestones: 0,
  });
  const [expenseInsight, setExpenseInsight] = useState({
    monthTotal: 0,
    categoryTop: [] as Array<{ name: string; amount: number }>,
    weekSeries: [] as number[],
  });
  const [recentMilestone, setRecentMilestone] = useState<{
    id: string;
    title: string;
    occurredAt: string;
    description?: string;
  } | null>(null);

  const today = formatLocalDateKey(new Date());
  const loggedIn = isLoggedIn();

  const refreshProfileData = useCallback(async () => {
    if (!activePetId) {
      setStats({
        reminders: 0,
        records: 0,
        care: 0,
        monthExpense: 0,
        milestones: 0,
      });
      setExpenseInsight({
        monthTotal: 0,
        categoryTop: [],
        weekSeries: [],
      });
      setRecentMilestone(null);
      return;
    }

    try {
      const profileData = await getProfileOverviewData(activePetId);
      setStats(profileData.stats);
      setExpenseInsight(profileData.expenseInsight);
      setRecentMilestone(profileData.recentMilestone);
    } catch (requestError) {
      setStats({
        reminders: 0,
        records: 0,
        care: 0,
        monthExpense: 0,
        milestones: 0,
      });
      setExpenseInsight({
        monthTotal: 0,
        categoryTop: [],
        weekSeries: [],
      });
      setRecentMilestone(null);
    }
  }, [activePetId]);

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

        <View className="px-[28rpx] flex gap-[12rpx] mb-[16rpx]">
          {pets.map((pet) => {
            const active = pet.id === activePet?.id;
            return (
              <View
                key={pet.id}
                className="px-4 py-2 border-solid"
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
              {loggedIn ? '暂无宠物档案' : '登录后可创建并同步你的宠物档案'}
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
              onOpenDetail={() =>
                Taro.navigateTo({ url: `/pages/PetDetailPage/index?petId=${activePet.id}` })
              }
            />
            <FunctionGrid
              petName={activePet.name}
              stats={stats}
              onOpenSchedule={() => Taro.switchTab({ url: '/pages/PetSchedule/index' })}
              onOpenCare={() =>
                Taro.navigateTo({ url: `/pages/PetCareStats/index?petId=${activePet.id}` })
              }
              onOpenMilestones={() => Taro.navigateTo({ url: '/pages/PetMilestones/index' })}
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
              onOpenDetail={() =>
                Taro.navigateTo({ url: `/pages/PetExpenseStats/index?petId=${activePet.id}` })
              }
            />
            <View className="px-[28rpx] mt-[4rpx]">
              <View
                className="px-[22rpx] py-[20rpx] border-solid"
                style={{
                  border: PET_UI_BORDER.regular,
                  borderRadius: PET_UI_RADIUS.md,
                  backgroundColor: '#FFF5FA',
                }}
                onClick={() => Taro.navigateTo({ url: '/pages/PetMilestones/index' })}
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
              </View>
            </View>
          </>
        ) : null}

        <DailyTip />
      </View>
    </BasicLayout>
  );
});

export default PetProfile;
