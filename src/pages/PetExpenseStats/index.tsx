import BasicLayout from '@/layout/basicLayout';
import { View, Text, Input } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { PET_UI, PET_UI_SHADOW } from '@/constants/petUi';
import { getExpenseListData, mapExpenseToExpenseModel, updatePetData } from '@/api/data';
import { usePetApiPets } from '@/hooks/usePetApiPets';
import { PetExpenseModel } from '@/types/pet';
import { useDidShow } from '@tarojs/taro';
import { setStoredActivePetId } from '@/utils/activePetState';
import { formatLocalDateKey } from '@/utils/formatDate';
import { ensureLoggedIn, isLoggedIn } from '@/utils/authState';

const monthKey = (date: Date) => `${date.getFullYear()}-${`${date.getMonth() + 1}`.padStart(2, '0')}`;

const buildMonthOptions = () => {
  return Array.from({ length: 4 }).map((_, index) => {
    const d = new Date();
    d.setMonth(d.getMonth() - index);
    const key = monthKey(d);
    return { key, label: `${d.getFullYear()}年${d.getMonth() + 1}月` };
  });
};

type ExpenseBudgetMap = Record<string, string>;

const PetExpenseStats = memo(function PetExpenseStats() {
  const { params } = useRouter();
  const preferredPetId = params.petId || '';
  const { pets, activePet, activeRawPet, refreshPets } = usePetApiPets(preferredPetId);
  const [expenses, setExpenses] = useState<PetExpenseModel[]>([]);
  const [savingBudget, setSavingBudget] = useState(false);
  const loggedIn = isLoggedIn();

  const petId = preferredPetId || activePet?.id || '';
  const pet = pets.find((item) => item.id === petId) || activePet;
  const today = formatLocalDateKey(new Date());

  const refreshExpenses = useCallback(() => {
    if (!loggedIn) {
      setExpenses([]);
      return Promise.resolve();
    }

    if (!petId) {
      setExpenses([]);
      return Promise.resolve();
    }

    return getExpenseListData({ petId })
      .then((list) => setExpenses(list.map(mapExpenseToExpenseModel)))
      .catch(() => setExpenses([]));
  }, [loggedIn, petId]);

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
  const [activeMonth, setActiveMonth] = useState(monthOptions[0].key);
  const [budgetInput, setBudgetInput] = useState('');

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
    if (!petId) {
      setBudgetInput('');
      return;
    }
    setBudgetInput(budgetMap[activeMonth] || '');
  }, [activeMonth, budgetMap, petId]);

  const monthlyExpenses = useMemo(() => {
    return expenses
      .filter((item) => item.petId === petId && item.date.startsWith(activeMonth))
      .sort((a, b) => b.createdAt - a.createdAt);
  }, [activeMonth, expenses, petId]);

  const summary = useMemo(() => {
    const total = monthlyExpenses.reduce((sum, item) => sum + item.amount, 0);
    const categoryMap = monthlyExpenses.reduce<Record<string, number>>((acc, item) => {
      acc[item.category] = (acc[item.category] ?? 0) + item.amount;
      return acc;
    }, {});

    const byCategory = Object.entries(categoryMap)
      .map(([name, amount]) => ({ name, amount }))
      .sort((a, b) => b.amount - a.amount);

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
    if (!ensureLoggedIn(`/pages/PetExpenseStats/index${preferredPetId ? `?petId=${preferredPetId}` : ''}`)) {
      return;
    }

    if (!petId) {
      Taro.showToast({ title: '缺少宠物信息', icon: 'none' });
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
      <View className="px-8 pt-4 pb-[120rpx]">
        <View className="flex flex-wrap gap-2 mb-4">
          {pets.map((item) => (
            <View
              key={item.id}
              className="px-4 py-2 rounded-[16rpx] border-[2rpx] border-solid border-[#262626]"
              style={{ backgroundColor: petId === item.id ? '#FFD93B' : '#f4f4f4' }}
              onClick={() => {
                setStoredActivePetId(item.id);
                Taro.redirectTo({ url: `/pages/PetExpenseStats/index?petId=${item.id}` });
              }}
            >
              <Text className="text-[24rpx]">{item.name}</Text>
            </View>
          ))}
        </View>

        <View className="mb-3">
          <Text className="text-[26rpx] text-[#555]">宠物：{pet?.name || '暂无'}</Text>
        </View>

        {petId ? (
          <View className="grid grid-cols-2 gap-3 mb-4">
            <View
              className="rounded-[16rpx] border-[3rpx] border-solid border-[#262626] bg-white p-4"
              style={{ boxShadow: PET_UI_SHADOW }}
              onClick={() =>
                Taro.navigateTo({
                  url: `/pages/AddPetRecord/index?petId=${petId}&date=${today}&mode=expense`,
                })
              }
            >
              <Text className="text-[26rpx] font-bold text-[#2c2c2c]">新增花销</Text>
              <Text className="text-[20rpx] text-[#7a7a7a] mt-2 block">
                给 {pet?.name || '当前宠物'} 继续补一笔消费记录
              </Text>
            </View>
            <View
              className="rounded-[16rpx] border-[3rpx] border-solid border-[#262626] bg-white p-4"
              style={{ boxShadow: PET_UI_SHADOW }}
              onClick={() => Taro.navigateTo({ url: `/pages/PetTimeline/index?petId=${petId}` })}
            >
              <Text className="text-[26rpx] font-bold text-[#2c2c2c]">查看时间线</Text>
              <Text className="text-[20rpx] text-[#7a7a7a] mt-2 block">
                回到这只宠物的完整记录流
              </Text>
            </View>
          </View>
        ) : null}

        {!loggedIn ? (
          <View
            className="mb-4 p-5 rounded-[16rpx] border-[3rpx] border-solid border-[#262626] bg-white"
            style={{ boxShadow: PET_UI_SHADOW }}
          >
            <Text className="text-[30rpx] font-bold block">登录后查看花销统计</Text>
            <Text className="text-[22rpx] text-[#666] mt-2 block">
              每一笔花销都会跟随账号保存，还可以继续记录预算和分类占比。
            </Text>
            <View
              className="mt-3 h-[72rpx] rounded-[36rpx] bg-[#FFD93B] border-[2rpx] border-solid border-[#262626] flex items-center justify-center"
              onClick={() =>
                ensureLoggedIn(
                  `/pages/PetExpenseStats/index${preferredPetId ? `?petId=${preferredPetId}` : ''}`
                )
              }
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
              先添加宠物，后面的花销统计和预算提醒才会开始累计。
            </Text>
            <View
              className="mt-3 h-[72rpx] rounded-[36rpx] bg-[#FFD93B] border-[2rpx] border-solid border-[#262626] flex items-center justify-center"
              onClick={() => Taro.navigateTo({ url: '/pages/EditPetProfile/index' })}
            >
              <Text className="text-[24rpx] font-semibold">去添加宠物</Text>
            </View>
          </View>
        ) : null}

        <View className="flex flex-wrap gap-2 mb-4">
          {monthOptions.map((item) => (
            <View
              key={item.key}
              className="px-3 py-2 rounded-[16rpx] border-[2rpx] border-solid border-[#262626]"
              style={{ backgroundColor: activeMonth === item.key ? '#ffd93b' : '#f4f4f4' }}
              onClick={() => setActiveMonth(item.key)}
            >
              <Text className="text-[22rpx]">{item.label}</Text>
            </View>
          ))}
        </View>

        <View
          className="mb-4 p-4 rounded-[16rpx] border-[3rpx] border-solid border-[#262626] bg-[#f4f4f4]"
          style={{ boxShadow: PET_UI_SHADOW }}
        >
          <Text className="text-[28rpx] font-bold">当月总花销：¥{summary.total.toFixed(2)}</Text>
          <Text className="text-[22rpx] text-[#666] mt-1 block">记录笔数：{summary.count}</Text>
          {budgetAmount > 0 ? (
            <Text
              className="text-[22rpx] mt-1 block"
              style={{ color: isOverBudget ? '#d65a31' : '#33b36b' }}
            >
              {isOverBudget
                ? `已超预算 ¥${Math.abs(budgetDiff).toFixed(2)}`
                : `距离预算还剩 ¥${budgetDiff.toFixed(2)}`}
            </Text>
          ) : null}
        </View>

        <View
          className="mb-4 p-4 rounded-[16rpx] border-[3rpx] border-solid border-[#262626] bg-[#f4f4f4]"
          style={{ boxShadow: PET_UI_SHADOW }}
        >
          <Text className="text-[30rpx] font-bold mb-3 block">月度预算</Text>
          <View className="rounded-[12rpx] border-[2rpx] border-solid border-[#262626] bg-white px-3 py-2">
            <Input
              type="digit"
              value={budgetInput}
              placeholder="输入本月预算金额"
              onInput={(e) => setBudgetInput(e.detail.value)}
            />
          </View>
          <View
            className="mt-3 h-[72rpx] rounded-[36rpx] bg-[#FFD93B] border-[2rpx] border-solid border-[#262626] flex items-center justify-center"
            onClick={handleSaveBudget}
          >
            <Text className="text-[24rpx] font-semibold">{savingBudget ? '保存中...' : '保存预算'}</Text>
          </View>
        </View>

        <View
          className="mb-4 p-4 rounded-[16rpx] border-[3rpx] border-solid border-[#262626] bg-[#f4f4f4]"
          style={{ boxShadow: PET_UI_SHADOW }}
        >
          <Text className="text-[30rpx] font-bold mb-3 block">分类占比</Text>
          {summary.byCategory.length ? (
            summary.byCategory.map((item) => {
              const widthPct = summary.total > 0 ? (item.amount / summary.total) * 100 : 0;
              return (
                <View key={item.name} className="mb-3">
                  <View className="flex items-center justify-between mb-1">
                    <Text className="text-[24rpx]">{item.name}</Text>
                    <Text className="text-[24rpx] text-[#666]">¥{item.amount.toFixed(2)}</Text>
                  </View>
                  <View className="h-[12rpx] rounded-full bg-white border-[1rpx] border-solid border-[#262626] overflow-hidden">
                    <View className="h-full bg-[#ffb177]" style={{ width: `${Math.max(widthPct, 6)}%` }} />
                  </View>
                </View>
              );
            })
          ) : (
            <View className="rounded-[16rpx] bg-white p-4">
              <Text className="text-[24rpx] text-[#8a8a8a]">
                {pet?.name || '当前宠物'}本月还没有花销记录，可以先补一笔粮食、用品或医疗开销。
              </Text>
              {petId ? (
                <View
                  className="mt-4 h-[72rpx] rounded-[36rpx] bg-[#FFD93B] border-[2rpx] border-solid border-[#262626] flex items-center justify-center"
                  onClick={() =>
                    Taro.navigateTo({
                      url: `/pages/AddPetRecord/index?petId=${petId}&date=${today}&mode=expense`,
                    })
                  }
                >
                  <Text className="text-[24rpx] font-semibold">去补一笔花销</Text>
                </View>
              ) : null}
            </View>
          )}
        </View>

        <View
          className="p-4 rounded-[16rpx] border-[3rpx] border-solid border-[#262626] bg-[#f4f4f4]"
          style={{ boxShadow: PET_UI_SHADOW }}
        >
          <Text className="text-[30rpx] font-bold mb-3 block">花销明细</Text>
          {monthlyExpenses.length ? (
            monthlyExpenses.map((item) => (
              <View
                key={item.id}
                className="mb-2 p-3 rounded-[12rpx] border-[2rpx] border-solid border-[#262626] bg-white flex items-center justify-between"
              >
                <View className="flex-1">
                  <Text className="text-[24rpx] block">{item.category}</Text>
                  <Text className="text-[20rpx] text-[#7a7a7a]">
                    {item.date} {item.time}
                  </Text>
                </View>
                <View className="items-end">
                  <Text className="text-[24rpx] text-[#ff6b6b]">¥{item.amount.toFixed(2)}</Text>
                  {item.note ? <Text className="text-[20rpx] text-[#9a9a9a]">{item.note}</Text> : null}
                </View>
              </View>
            ))
          ) : (
            <Text className="text-[24rpx] text-[#8a8a8a]">
              {pet?.name || '当前宠物'}本月还没有花销明细
            </Text>
          )}
        </View>
      </View>
    </BasicLayout>
  );
});

export default PetExpenseStats;
