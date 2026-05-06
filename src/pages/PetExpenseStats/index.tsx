import BasicLayout from '@/layout/basicLayout';
import { View, Text, Input } from '@tarojs/components';
import Taro, { useDidShow, useRouter } from '@tarojs/taro';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { PET_UI, PET_UI_SHADOW } from '@/constants/petUi';
import { getExpenseListData, mapExpenseToExpenseModel, updatePetData } from '@/api/data';
import { usePetApiPets } from '@/hooks/usePetApiPets';
import { PetExpenseModel } from '@/types/pet';
import { setStoredActivePetId } from '@/utils/activePetState';
import { formatLocalDateKey } from '@/utils/formatDate';
import { ensureLoggedIn, isLoggedIn } from '@/utils/authState';

const monthKey = (date: Date) =>
  `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, '0')}`;

const buildMonthOptions = () => {
  return Array.from({ length: 4 }).map((_, index) => {
    const date = new Date();
    date.setMonth(date.getMonth() - index);
    return {
      key: monthKey(date),
      label: `${date.getFullYear()}年${date.getMonth() + 1}月`,
    };
  });
};

type ExpenseBudgetMap = Record<string, string>;

const PetExpenseStats = memo(function PetExpenseStats() {
  const { params } = useRouter();
  const preferredPetId = params.petId || '';
  const { pets, activePet, activeRawPet, refreshPets } = usePetApiPets(preferredPetId);
  const [expenses, setExpenses] = useState<PetExpenseModel[]>([]);
  const [savingBudget, setSavingBudget] = useState(false);
  const [activeMonth, setActiveMonth] = useState(buildMonthOptions()[0].key);
  const [budgetInput, setBudgetInput] = useState('');
  const loggedIn = isLoggedIn();

  const petId = preferredPetId || activePet?.id || '';
  const pet = pets.find((item) => item.id === petId) || activePet;
  const hasValidPetContext = Boolean(petId && pet && activePet);
  const canRenderExpenseContent = Boolean(loggedIn && hasValidPetContext);
  const today = formatLocalDateKey(new Date());
  const canSaveBudget = Boolean(petId && pet && activeRawPet && activePet);
  const ensureActivePetContext = () => {
    if (
      !ensureLoggedIn(
        `/pages/PetExpenseStats/index${preferredPetId ? `?petId=${preferredPetId}` : ''}`
      )
    ) {
      return false;
    }

    if (petId && pet && activePet) {
      return true;
    }

    Taro.showToast({
      title: pets.length > 0 ? '请先重新选择宠物' : '请先选择或创建宠物',
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

  const refreshExpenses = useCallback(() => {
    if (!loggedIn) {
      setExpenses([]);
      return Promise.resolve();
    }

    if (!petId || !pet || !activePet) {
      setExpenses([]);
      return Promise.resolve();
    }

    return getExpenseListData({ petId })
      .then((list) => setExpenses(list.map(mapExpenseToExpenseModel)))
      .catch(() => setExpenses([]));
  }, [activePet, loggedIn, pet, petId]);

  useEffect(() => {
    if (petId) {
      setStoredActivePetId(petId);
    }
    refreshExpenses();
  }, [petId, refreshExpenses]);

  useDidShow(() => {
    refreshExpenses();
  });

  const monthOptions = useMemo(() => buildMonthOptions(), []);

  const budgetMap = useMemo<ExpenseBudgetMap>(() => {
    const rawBudgets = activeRawPet?.profileExtras?.expenseBudgets;
    if (!rawBudgets || typeof rawBudgets !== 'object' || Array.isArray(rawBudgets)) {
      return {};
    }

    return Object.entries(rawBudgets as Record<string, unknown>).reduce<ExpenseBudgetMap>(
      (acc, [key, value]) => {
        if (typeof value === 'string' || typeof value === 'number') {
          acc[key] = String(value);
        }
        return acc;
      },
      {}
    );
  }, [activeRawPet?.profileExtras]);

  useEffect(() => {
    if (!petId || !pet || !activePet) {
      setBudgetInput('');
      return;
    }
    setBudgetInput(budgetMap[activeMonth] || '');
  }, [activeMonth, activePet, budgetMap, pet, petId]);

  const monthlyExpenses = useMemo(() => {
    return expenses
      .filter((item) => item.petId === petId && item.date.startsWith(activeMonth))
      .sort((left, right) => right.createdAt - left.createdAt);
  }, [activeMonth, expenses, petId]);

  const summary = useMemo(() => {
    const total = monthlyExpenses.reduce((sum, item) => sum + item.amount, 0);
    const categoryMap = monthlyExpenses.reduce<Record<string, number>>((acc, item) => {
      acc[item.category] = (acc[item.category] ?? 0) + item.amount;
      return acc;
    }, {});

    const byCategory = Object.entries(categoryMap)
      .map(([name, amount]) => ({
        name,
        amount,
        ratio: total > 0 ? amount / total : 0,
      }))
      .sort((left, right) => right.amount - left.amount);

    return {
      total,
      count: monthlyExpenses.length,
      byCategory,
    };
  }, [monthlyExpenses]);

  const budgetAmount = Number(budgetInput || 0);
  const budgetDiff = budgetAmount - summary.total;
  const isOverBudget = budgetAmount > 0 && summary.total > budgetAmount;

  const handleSaveBudget = async () => {
    if (
      !ensureLoggedIn(
        `/pages/PetExpenseStats/index${preferredPetId ? `?petId=${preferredPetId}` : ''}`
      )
    ) {
      return;
    }

    if (!petId || !pet || !activePet) {
      Taro.showToast({ title: '请先选择有效宠物', icon: 'none' });
      return;
    }

    if (!activeRawPet) {
      Taro.showToast({ title: '宠物信息加载中', icon: 'none' });
      return;
    }

    const nextBudgets = {
      ...budgetMap,
      [activeMonth]: budgetInput.trim(),
    };

    if (!budgetInput.trim()) {
      delete nextBudgets[activeMonth];
    }

    setSavingBudget(true);
    try {
      await updatePetData(petId, {
        profileExtras: {
          ...(activeRawPet.profileExtras || {}),
          expenseBudgets: nextBudgets,
        },
      });
      await refreshPets();
      Taro.showToast({ title: '预算已保存', icon: 'success' });
    } catch (error) {
      const message = error instanceof Error ? error.message : '预算保存失败';
      Taro.showToast({ title: message, icon: 'none' });
    } finally {
      setSavingBudget(false);
    }
  };

  return (
    <BasicLayout
      wrapClassName="w-full h-full"
      wrapStyle={{
        backgroundImage: PET_UI.pageBackground,
        minHeight: '100vh',
      }}
      navOptions={{
        navTitle: '花销统计',
        needBack: true,
      }}
    >
      <View className="px-6 pt-4 pb-[120rpx]">
        <View className="flex flex-wrap gap-2 mb-4">
          {pets.map((item) => (
            <View
              key={item.id}
              className="px-4 py-2 rounded-[16rpx] border-[2rpx] border-solid border-[#262626]"
              style={{ backgroundColor: petId === item.id ? '#FFD93B' : '#F4F4F4' }}
              onClick={() => {
                setStoredActivePetId(item.id);
                Taro.redirectTo({ url: `/pages/PetExpenseStats/index?petId=${item.id}` });
              }}
            >
              <Text className="text-[24rpx] text-[#2B2B2B]">{item.name}</Text>
            </View>
          ))}
        </View>

        {canRenderExpenseContent ? (
          <View className="mb-3">
            <Text className="text-[26rpx] text-[#555]">宠物：{pet?.name}</Text>
          </View>
        ) : null}

        {hasValidPetContext ? (
          <View className="grid grid-cols-2 gap-3 mb-4">
            <View
              className="rounded-[20rpx] border-[3rpx] border-solid border-[#262626] bg-white p-4"
              style={{ boxShadow: PET_UI_SHADOW }}
              onClick={() =>
                openPetPage(
                  `/pages/AddPetRecord/index?petId=${petId}&date=${today}&mode=expense&returnTo=expense-stats`
                )
              }
            >
              <Text className="text-[26rpx] font-semibold text-[#2B2B2B]">新增花销</Text>
              <Text className="text-[20rpx] text-[#7A7A7A] mt-2 block">
                继续为 {pet?.name || '当前宠物'} 补一笔粮食、用品或医疗开销。
              </Text>
            </View>
            <View
              className="rounded-[20rpx] border-[3rpx] border-solid border-[#262626] bg-white p-4"
              style={{ boxShadow: PET_UI_SHADOW }}
              onClick={() => openPetPage(`/pages/PetTimeline/index?petId=${petId}`)}
            >
              <Text className="text-[26rpx] font-semibold text-[#2B2B2B]">查看时间线</Text>
              <Text className="text-[20rpx] text-[#7A7A7A] mt-2 block">
                回到这只宠物的完整记录流，看花销和护理、提醒的关联。
              </Text>
            </View>
          </View>
        ) : null}

        {!loggedIn ? (
          <View
            className="mb-5 p-5 rounded-[20rpx] border-[3rpx] border-solid border-[#262626] bg-white"
            style={{ boxShadow: PET_UI_SHADOW }}
          >
            <Text className="text-[30rpx] font-semibold text-[#2B2B2B] block">
              登录后查看花销统计
            </Text>
            <Text className="text-[22rpx] text-[#666] mt-2 block">
              每一笔花销都会跟随账号保存，还可以继续记录预算和分类占比。
            </Text>
            <View
              className="mt-4 h-[72rpx] rounded-[36rpx] bg-[#FFD93B] border-[2rpx] border-solid border-[#262626] flex items-center justify-center"
              onClick={() =>
                ensureLoggedIn(
                  `/pages/PetExpenseStats/index${preferredPetId ? `?petId=${preferredPetId}` : ''}`
                )
              }
            >
              <Text className="text-[24rpx] font-semibold text-[#5D4510]">去微信登录</Text>
            </View>
          </View>
        ) : null}

        {loggedIn && !pets.length ? (
          <View
            className="mb-5 p-5 rounded-[20rpx] border-[3rpx] border-solid border-[#262626] bg-white"
            style={{ boxShadow: PET_UI_SHADOW }}
          >
            <Text className="text-[30rpx] font-semibold text-[#2B2B2B] block">
              还没有宠物档案
            </Text>
            <Text className="text-[22rpx] text-[#666] mt-2 block">
              先添加宠物，后面的花销统计和预算提醒才会开始累计。
            </Text>
            <View
              className="mt-4 h-[72rpx] rounded-[36rpx] bg-[#FFD93B] border-[2rpx] border-solid border-[#262626] flex items-center justify-center"
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
              当前花销统计页没有绑定到有效宠物，你可以直接从上方切换到一只现有宠物继续查看预算和明细。
            </Text>
          </View>
        ) : null}

        {canRenderExpenseContent ? (
          <>
            <View className="flex flex-wrap gap-2 mb-4">
              {monthOptions.map((item) => (
                <View
                  key={item.key}
                  className="px-4 py-2 rounded-[999rpx] border-[2rpx] border-solid border-[#262626]"
                  style={{ backgroundColor: activeMonth === item.key ? '#FFD93B' : '#F4F4F4' }}
                  onClick={() => setActiveMonth(item.key)}
                >
                  <Text className="text-[22rpx] text-[#2B2B2B]">{item.label}</Text>
                </View>
              ))}
            </View>

            <View className="grid grid-cols-3 gap-3 mb-5">
              <View
                className="p-4 rounded-[20rpx] border-[3rpx] border-solid border-[#262626] bg-[#F4F4F4]"
                style={{ boxShadow: PET_UI_SHADOW }}
              >
                <Text className="text-[22rpx] text-[#666] block">本月总花销</Text>
                <Text className="text-[30rpx] font-semibold text-[#2B2B2B] mt-1 block">
                  ¥{summary.total.toFixed(2)}
                </Text>
              </View>
              <View
                className="p-4 rounded-[20rpx] border-[3rpx] border-solid border-[#262626] bg-[#F4F4F4]"
                style={{ boxShadow: PET_UI_SHADOW }}
              >
                <Text className="text-[22rpx] text-[#666] block">记录笔数</Text>
                <Text className="text-[30rpx] font-semibold text-[#2B2B2B] mt-1 block">
                  {summary.count}
                </Text>
              </View>
              <View
                className="p-4 rounded-[20rpx] border-[3rpx] border-solid border-[#262626] bg-[#F4F4F4]"
                style={{ boxShadow: PET_UI_SHADOW }}
              >
                <Text className="text-[22rpx] text-[#666] block">预算状态</Text>
                <Text
                  className="text-[26rpx] font-semibold mt-1 block"
                  style={{ color: isOverBudget ? '#D65A31' : '#2B2B2B' }}
                >
                  {budgetAmount > 0 ? (isOverBudget ? '已超支' : '预算内') : '未设置'}
                </Text>
              </View>
            </View>

            <View
              className="mb-5 p-5 rounded-[20rpx] border-[3rpx] border-solid border-[#262626] bg-white"
              style={{ boxShadow: PET_UI_SHADOW }}
            >
              <Text className="text-[30rpx] font-semibold text-[#2B2B2B] mb-3 block">
                月度预算
              </Text>
              <View className="rounded-[14rpx] border-[2rpx] border-solid border-[#262626] bg-[#F8F8F8] px-4 py-3">
                <Input
                  type="digit"
                  value={budgetInput}
                  placeholder="输入本月预算金额"
                  onInput={(e) => setBudgetInput(e.detail.value)}
                />
              </View>
              {budgetAmount > 0 ? (
                <Text
                  className="text-[22rpx] mt-3 block"
                  style={{ color: isOverBudget ? '#D65A31' : '#33B36B' }}
                >
                  {isOverBudget
                    ? `已超预算 ¥${Math.abs(budgetDiff).toFixed(2)}`
                    : `距离预算还剩 ¥${budgetDiff.toFixed(2)}`}
                </Text>
              ) : (
                <Text className="text-[22rpx] text-[#7A7A7A] mt-3 block">
                  暂未设置预算，可先录入一个演示金额。
                </Text>
              )}
              <View
                className="mt-3 h-[72rpx] rounded-[36rpx] border-[2rpx] border-solid border-[#262626] flex items-center justify-center"
                style={{
                  backgroundColor: canSaveBudget ? '#FFD93B' : '#E5E5E5',
                  opacity: canSaveBudget ? 1 : 0.7,
                }}
                onClick={() => {
                  if (!canSaveBudget) {
                    Taro.showToast({ title: '请先选择有效宠物', icon: 'none' });
                    return;
                  }
                  handleSaveBudget();
                }}
              >
                <Text className="text-[24rpx] font-semibold text-[#5D4510]">
                  {savingBudget ? '保存中...' : '保存预算'}
                </Text>
              </View>
            </View>

            <View
              className="mb-5 p-5 rounded-[20rpx] border-[3rpx] border-solid border-[#262626] bg-white"
              style={{ boxShadow: PET_UI_SHADOW }}
            >
              <Text className="text-[30rpx] font-semibold text-[#2B2B2B] mb-3 block">
                分类占比
              </Text>
              {summary.byCategory.length ? (
                summary.byCategory.map((item) => (
                  <View key={item.name} className="mb-4">
                    <View className="flex items-center justify-between mb-1">
                      <Text className="text-[24rpx] text-[#2B2B2B]">{item.name}</Text>
                      <Text className="text-[22rpx] text-[#666]">
                        ¥{item.amount.toFixed(2)} · {(item.ratio * 100).toFixed(0)}%
                      </Text>
                    </View>
                    <View className="h-[14rpx] rounded-full bg-[#F1F1F1] overflow-hidden border-[1rpx] border-solid border-[#262626]">
                      <View
                        className="h-full bg-[#FFB177]"
                        style={{ width: `${Math.max(item.ratio * 100, 6)}%` }}
                      />
                    </View>
                  </View>
                ))
              ) : (
                <View className="rounded-[16rpx] bg-[#FFFBEA] p-4">
                  <Text className="text-[24rpx] text-[#8A8A8A] leading-[1.7]">
                    {pet?.name || '当前宠物'}
                    本月还没有花销记录，可以先补一笔粮食、用品或医疗开销。
                  </Text>
                  {hasValidPetContext ? (
                    <View
                      className="mt-4 h-[72rpx] rounded-[36rpx] bg-[#FFD93B] border-[2rpx] border-solid border-[#262626] flex items-center justify-center"
                      onClick={() =>
                        openPetPage(
                          `/pages/AddPetRecord/index?petId=${petId}&date=${today}&mode=expense&returnTo=expense-stats`
                        )
                      }
                    >
                      <Text className="text-[24rpx] font-semibold text-[#5D4510]">
                        去补一笔花销
                      </Text>
                    </View>
                  ) : null}
                </View>
              )}
            </View>

            <View
              className="p-5 rounded-[20rpx] border-[3rpx] border-solid border-[#262626] bg-white"
              style={{ boxShadow: PET_UI_SHADOW }}
            >
              <Text className="text-[30rpx] font-semibold text-[#2B2B2B] mb-3 block">
                花销明细
              </Text>
              {monthlyExpenses.length ? (
                monthlyExpenses.map((item) => (
                  <View
                    key={item.id}
                    className="mb-3 p-4 rounded-[16rpx] border-[2rpx] border-solid border-[#262626] bg-[#F8F8F8] flex items-center justify-between"
                  >
                    <View className="flex-1 pr-4">
                      <Text className="text-[24rpx] text-[#2B2B2B] block">{item.category}</Text>
                      <Text className="text-[20rpx] text-[#7A7A7A] mt-[6rpx] block">
                        {item.date} {item.time}
                      </Text>
                      {item.note ? (
                        <Text className="text-[20rpx] text-[#9A9A9A] mt-[6rpx] block">
                          {item.note}
                        </Text>
                      ) : null}
                    </View>
                    <Text className="text-[26rpx] font-semibold text-[#FF6B6B]">
                      ¥{item.amount.toFixed(2)}
                    </Text>
                  </View>
                ))
              ) : (
                <Text className="text-[24rpx] text-[#8A8A8A]">
                  {pet?.name || '当前宠物'}本月还没有花销明细。
                </Text>
              )}
            </View>
          </>
        ) : null}
      </View>
    </BasicLayout>
  );
});

export default PetExpenseStats;
