import BasicLayout from '@/layout/basicLayout';
import { View, Text, Input, Textarea } from '@tarojs/components';
import Taro, { useDidShow, useRouter } from '@tarojs/taro';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { PET_UI } from '@/constants/petUi';
import {
  createFoodData,
  deleteFoodData,
  FoodItem,
  getFoodListData,
  updateFoodData,
} from '@/api/data';
import { usePetApiPets } from '@/hooks/usePetApiPets';
import { setStoredActivePetId } from '@/utils/activePetState';
import { ensureLoggedIn, isLoggedIn } from '@/utils/authState';

const defaultForm = {
  name: '',
  brand: '',
  flavor: '',
  feedingAmount: '',
  feedingTimes: '',
  inventory: '',
  inventoryAlertThreshold: '',
  allergyWarnings: '',
  notes: '',
};

const PetFood = memo(function PetFood() {
  const { params } = useRouter();
  const preferredPetId = params.petId || '';
  const { pets, activePet, activePetId, setActivePetId } = usePetApiPets(preferredPetId);
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState('');
  const [form, setForm] = useState(defaultForm);
  const loggedIn = isLoggedIn();
  const hasActivePet = Boolean(activePetId && activePet);
  const canSubmit = hasActivePet;

  const refreshFoods = useCallback(() => {
    if (!loggedIn) {
      setFoods([]);
      return Promise.resolve();
    }

    if (!activePetId || !activePet) {
      setFoods([]);
      return Promise.resolve();
    }

    return getFoodListData({ petId: activePetId })
      .then((list) => setFoods(list))
      .catch(() => setFoods([]));
  }, [activePet, activePetId, loggedIn]);

  useEffect(() => {
    if (activePetId) {
      setStoredActivePetId(activePetId);
    }
    refreshFoods();
  }, [activePetId, refreshFoods]);

  useDidShow(() => {
    refreshFoods();
  });

  useEffect(() => {
    if (editingId && !foods.some((item) => item.id === editingId)) {
      resetForm();
    }
  }, [editingId, foods]);

  const lowInventoryCount = useMemo(() => {
    return foods.filter((item) => {
      const inventory = Number(item.inventory || 0);
      const threshold = Number(item.inventoryAlertThreshold || 0);
      return threshold > 0 && inventory > 0 && inventory <= threshold;
    }).length;
  }, [foods]);
  const totalInventory = useMemo(() => {
    return foods.reduce((sum, item) => sum + Number(item.inventory || 0), 0);
  }, [foods]);

  const updateField = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetForm = () => {
    setForm(defaultForm);
    setEditingId('');
  };

  const handleEdit = (item: FoodItem) => {
    setEditingId(item.id);
    setForm({
      name: item.name || '',
      brand: item.brand || '',
      flavor: item.flavor || '',
      feedingAmount: item.feedingAmount || '',
      feedingTimes: item.feedingTimes || '',
      inventory: item.inventory !== undefined && item.inventory !== null ? `${item.inventory}` : '',
      inventoryAlertThreshold:
        item.inventoryAlertThreshold !== undefined && item.inventoryAlertThreshold !== null
          ? `${item.inventoryAlertThreshold}`
          : '',
      allergyWarnings: item.allergyWarnings?.join('、') || '',
      notes: item.notes || '',
    });
    Taro.pageScrollTo({ scrollTop: 0, duration: 250 });
  };

  const handleSubmit = async () => {
    if (!ensureLoggedIn(`/pages/PetFood/index${preferredPetId ? `?petId=${preferredPetId}` : ''}`)) {
      return;
    }

    if (!activePetId || !activePet) {
      Taro.showToast({ title: '请先选择有效宠物', icon: 'none' });
      return;
    }

    if (!form.name.trim()) {
      Taro.showToast({ title: '请填写食物名称', icon: 'none' });
      return;
    }

    setSaving(true);
    try {
      setStoredActivePetId(activePetId);
      const payload = {
        petId: activePetId,
        name: form.name.trim(),
        brand: form.brand.trim() || undefined,
        flavor: form.flavor.trim() || undefined,
        feedingAmount: form.feedingAmount.trim() || undefined,
        feedingTimes: form.feedingTimes.trim() || undefined,
        inventory: form.inventory ? Number(form.inventory) : undefined,
        inventoryAlertThreshold: form.inventoryAlertThreshold
          ? Number(form.inventoryAlertThreshold)
          : undefined,
        allergyWarnings: form.allergyWarnings
          .split(/[、,，\n]/)
          .map((item) => item.trim())
          .filter(Boolean),
        notes: form.notes.trim() || undefined,
      };

      if (editingId) {
        await updateFoodData(editingId, payload);
      } else {
        await createFoodData(payload);
      }
      resetForm();
      Taro.showToast({ title: editingId ? '食物已更新' : '食物已保存', icon: 'success' });
      await refreshFoods();
    } catch (error) {
      const message = error instanceof Error ? error.message : '保存失败';
      Taro.showToast({ title: message, icon: 'none' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!ensureLoggedIn(`/pages/PetFood/index${preferredPetId ? `?petId=${preferredPetId}` : ''}`)) {
      return;
    }

    const result = await Taro.showModal({
      title: '确认删除',
      content: '是否删除这条食物记录？',
      confirmText: '删除',
      confirmColor: '#d65a31',
    });

    if (!result.confirm) {
      return;
    }

    try {
      await deleteFoodData(id);
      if (editingId === id) {
        resetForm();
      }
      Taro.showToast({ title: '已删除', icon: 'success' });
      await refreshFoods();
    } catch (error) {
      const message = error instanceof Error ? error.message : '删除失败';
      Taro.showToast({ title: message, icon: 'none' });
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
        navTitle: '食物管理',
        needBack: true,
      }}
    >
      <View className="px-6 pt-4 pb-[120rpx]">
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
                setStoredActivePetId(pet.id);
                Taro.redirectTo({ url: `/pages/PetFood/index?petId=${pet.id}` });
              }}
            >
              <Text className="text-[24rpx]">{pet.name}</Text>
            </View>
          ))}
        </View>

        {!loggedIn ? (
          <View className="mb-5 rounded-[20rpx] bg-[#FFF7D5] p-4">
            <Text className="text-[22rpx] text-[#6E5A2C] block">
              登录后可管理每只宠物的食物档案、库存和过敏提醒。
            </Text>
            <View
              className="mt-3 inline-flex px-4 py-2 rounded-[999rpx] bg-[#FFD93B]"
              onClick={() =>
                ensureLoggedIn(`/pages/PetFood/index${preferredPetId ? `?petId=${preferredPetId}` : ''}`)
              }
            >
              <Text className="text-[22rpx] text-[#5D4510] font-semibold">去微信登录</Text>
            </View>
          </View>
        ) : null}

        {loggedIn && !pets.length ? (
          <View className="mb-5 rounded-[20rpx] bg-white p-4 shadow-[0_14rpx_30rpx_rgba(0,0,0,0.08)]">
            <Text className="text-[24rpx] text-[#2b2b2b] font-semibold block">先添加宠物档案</Text>
            <Text className="text-[22rpx] text-[#666] mt-[8rpx] block">
              有了宠物之后，才能为它维护专属食物档案、库存和过敏提醒。
            </Text>
            <View
              className="mt-3 inline-flex px-4 py-2 rounded-[999rpx] bg-[#FFD93B]"
              onClick={() => Taro.navigateTo({ url: '/pages/EditPetProfile/index' })}
            >
              <Text className="text-[22rpx] text-[#5D4510] font-semibold">去添加宠物</Text>
            </View>
          </View>
        ) : null}

        {loggedIn && pets.length > 0 && !hasActivePet ? (
          <View className="mb-5 rounded-[20rpx] bg-white p-4 shadow-[0_14rpx_30rpx_rgba(0,0,0,0.08)]">
            <Text className="text-[24rpx] text-[#2b2b2b] font-semibold block">请先重新选择宠物</Text>
            <Text className="text-[22rpx] text-[#666] mt-[8rpx] block">
              当前食物页面没有绑定到有效宠物，你可以直接从上方切换到一只现有宠物继续管理。
            </Text>
          </View>
        ) : null}

        <View className="mb-5 rounded-[24rpx] bg-white p-5 shadow-[0_14rpx_30rpx_rgba(0,0,0,0.08)]">
          <Text className="text-[30rpx] font-semibold text-[#2b2b2b] block">
            {activePet?.name || (loggedIn && pets.length > 0 ? '未选择有效宠物' : '暂无宠物')}的食物档案
          </Text>
          <Text className="text-[22rpx] text-[#666] mt-[8rpx] block">
            共 {foods.length} 条食物记录，低库存提醒 {lowInventoryCount} 条
          </Text>
          <Text className="text-[22rpx] text-[#666] mt-[6rpx] block">
            当前库存总量 {totalInventory.toFixed(2)}
          </Text>
        </View>

        {hasActivePet ? (
          <View className="mb-5 rounded-[24rpx] bg-[#FFF9E4] p-5 shadow-[0_14rpx_30rpx_rgba(0,0,0,0.05)]">
            <Text className="text-[28rpx] font-semibold text-[#2b2b2b] block">
              围绕{activePet?.name || '当前宠物'}继续管理
            </Text>
            <Text className="text-[22rpx] text-[#7a6b42] mt-[8rpx] block">
              维护完食物档案后，可以继续查看时间线、报告，或者回到这只宠物详情页继续处理其它事项。
            </Text>
            <View className="flex gap-3 mt-4">
              <View
                className="flex-1 px-4 py-3 rounded-[16rpx] bg-white border-[2rpx] border-solid border-[#E9D7AF] flex items-center justify-center"
                onClick={() => Taro.navigateTo({ url: `/pages/PetTimeline/index?petId=${activePetId}` })}
              >
                <Text className="text-[22rpx] text-[#8b6c3f]">查看时间线</Text>
              </View>
              <View
                className="flex-1 px-4 py-3 rounded-[16rpx] bg-white border-[2rpx] border-solid border-[#E9D7AF] flex items-center justify-center"
                onClick={() => Taro.navigateTo({ url: `/pages/PetReport/index?petId=${activePetId}` })}
              >
                <Text className="text-[22rpx] text-[#8b6c3f]">查看报告</Text>
              </View>
              <View
                className="flex-1 px-4 py-3 rounded-[16rpx] bg-[#FFD93B] flex items-center justify-center"
                onClick={() => Taro.navigateTo({ url: `/pages/PetDetailPage/index?petId=${activePetId}` })}
              >
                <Text className="text-[22rpx] font-semibold text-[#5D4510]">宠物详情</Text>
              </View>
            </View>
          </View>
        ) : null}

        <View className="rounded-[24rpx] bg-white p-5 mb-5 shadow-[0_14rpx_30rpx_rgba(0,0,0,0.08)]">
          <View className="mb-4 flex items-center justify-between">
            <Text className="text-[28rpx] font-semibold block">
              {editingId ? '编辑食物' : '新增食物'}
            </Text>
            {editingId ? (
              <View
                className="px-4 py-2 rounded-[999rpx] bg-[#FFF4CC]"
                onClick={resetForm}
              >
                <Text className="text-[22rpx] text-[#8a6a00]">取消编辑</Text>
              </View>
            ) : null}
          </View>
          <View className="grid grid-cols-2 gap-3">
            <View className="col-span-2 rounded-[16rpx] bg-[#F7F7F7] p-4">
              <Text className="text-[22rpx] text-[#666]">食物名称</Text>
              <Input value={form.name} onInput={(e) => updateField('name', e.detail.value)} />
            </View>
            <View className="rounded-[16rpx] bg-[#F7F7F7] p-4">
              <Text className="text-[22rpx] text-[#666]">品牌</Text>
              <Input value={form.brand} onInput={(e) => updateField('brand', e.detail.value)} />
            </View>
            <View className="rounded-[16rpx] bg-[#F7F7F7] p-4">
              <Text className="text-[22rpx] text-[#666]">口味</Text>
              <Input value={form.flavor} onInput={(e) => updateField('flavor', e.detail.value)} />
            </View>
            <View className="rounded-[16rpx] bg-[#F7F7F7] p-4">
              <Text className="text-[22rpx] text-[#666]">喂食量</Text>
              <Input
                value={form.feedingAmount}
                onInput={(e) => updateField('feedingAmount', e.detail.value)}
              />
            </View>
            <View className="rounded-[16rpx] bg-[#F7F7F7] p-4">
              <Text className="text-[22rpx] text-[#666]">喂食频次</Text>
              <Input
                value={form.feedingTimes}
                onInput={(e) => updateField('feedingTimes', e.detail.value)}
              />
            </View>
            <View className="rounded-[16rpx] bg-[#F7F7F7] p-4">
              <Text className="text-[22rpx] text-[#666]">库存</Text>
              <Input
                type="digit"
                value={form.inventory}
                onInput={(e) => updateField('inventory', e.detail.value)}
              />
            </View>
            <View className="rounded-[16rpx] bg-[#F7F7F7] p-4">
              <Text className="text-[22rpx] text-[#666]">提醒阈值</Text>
              <Input
                type="digit"
                value={form.inventoryAlertThreshold}
                onInput={(e) => updateField('inventoryAlertThreshold', e.detail.value)}
              />
            </View>
            <View className="col-span-2 rounded-[16rpx] bg-[#F7F7F7] p-4">
              <Text className="text-[22rpx] text-[#666]">过敏提醒</Text>
              <Textarea
                autoHeight
                value={form.allergyWarnings}
                onInput={(e) => updateField('allergyWarnings', e.detail.value)}
              />
            </View>
            <View className="col-span-2 rounded-[16rpx] bg-[#F7F7F7] p-4">
              <Text className="text-[22rpx] text-[#666]">备注</Text>
              <Textarea
                autoHeight
                value={form.notes}
                onInput={(e) => updateField('notes', e.detail.value)}
              />
            </View>
          </View>

          <View
            className="mt-4 h-[88rpx] rounded-[999rpx] flex items-center justify-center"
            style={{ backgroundColor: canSubmit ? '#FFD93B' : '#E5E5E5', opacity: canSubmit ? 1 : 0.7 }}
            onClick={() => {
              if (!canSubmit) {
                Taro.showToast({ title: '请先选择有效宠物', icon: 'none' });
                return;
              }
              handleSubmit();
            }}
          >
            <Text className="text-[30rpx] font-semibold">
              {saving ? '保存中...' : editingId ? '更新食物' : '保存食物'}
            </Text>
          </View>
        </View>

        <View className="rounded-[24rpx] bg-white p-5 shadow-[0_14rpx_30rpx_rgba(0,0,0,0.08)]">
          <Text className="text-[28rpx] font-semibold mb-4 block">食物列表</Text>
          {foods.length ? (
            foods.map((item) => (
              <View key={item.id} className="mb-3 rounded-[18rpx] bg-[#FFFBEA] p-4">
                <View className="flex justify-between items-start">
                  <View className="flex-1 pr-4">
                    <Text className="text-[28rpx] font-semibold block">{item.name}</Text>
                    {Number(item.inventoryAlertThreshold || 0) > 0 &&
                    Number(item.inventory || 0) > 0 &&
                    Number(item.inventory || 0) <= Number(item.inventoryAlertThreshold || 0) ? (
                      <Text className="text-[20rpx] inline-block px-[10rpx] py-[4rpx] rounded-[999rpx] bg-[#FDECEC] text-[#d65a31] mt-[8rpx]">
                        库存偏低
                      </Text>
                    ) : null}
                    <Text className="text-[22rpx] text-[#666] block mt-[6rpx]">
                      {item.brand || '未填品牌'} {item.flavor ? `· ${item.flavor}` : ''}
                    </Text>
                    <Text className="text-[22rpx] text-[#666] block mt-[4rpx]">
                      {item.feedingAmount || '未填喂食量'} / {item.feedingTimes || '未填频次'}
                    </Text>
                    <Text className="text-[22rpx] text-[#666] block mt-[4rpx]">
                      库存：{Number(item.inventory || 0)}，提醒阈值：{Number(
                        item.inventoryAlertThreshold || 0
                      )}
                    </Text>
                    {item.allergyWarnings?.length ? (
                      <Text className="text-[21rpx] text-[#a36d2b] block mt-[4rpx]">
                        过敏提醒：{item.allergyWarnings.join('、')}
                      </Text>
                    ) : null}
                    {item.notes ? (
                      <Text className="text-[21rpx] text-[#7a7a7a] block mt-[4rpx]">{item.notes}</Text>
                    ) : null}
                  </View>
                  <View className="flex gap-2">
                    <View
                      className="px-4 py-2 rounded-[999rpx] bg-white"
                      style={{ border: '2rpx solid #E9D7AF' }}
                      onClick={() => handleEdit(item)}
                    >
                      <Text className="text-[22rpx] text-[#8b6c3f]">编辑</Text>
                    </View>
                    <View
                      className="px-4 py-2 rounded-[999rpx] bg-white"
                      style={{ border: '2rpx solid #F0D49A' }}
                      onClick={() => handleDelete(item.id)}
                    >
                      <Text className="text-[22rpx] text-[#b36439]">删除</Text>
                    </View>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <View className="rounded-[18rpx] bg-[#FFFBEA] p-4">
              <Text className="text-[24rpx] text-[#8a8a8a]">
                {activePet?.name || '当前宠物'}还没有食物记录，先补一条主粮、零食或罐头档案吧。
              </Text>
              {hasActivePet ? (
                <View className="flex gap-3 mt-4">
                  <View
                    className="flex-1 px-4 py-3 rounded-[16rpx] bg-[#FFD93B] flex items-center justify-center"
                    onClick={() => Taro.pageScrollTo({ scrollTop: 0, duration: 250 })}
                  >
                    <Text className="text-[22rpx] font-semibold text-[#5D4510]">去新增食物</Text>
                  </View>
                  <View
                    className="flex-1 px-4 py-3 rounded-[16rpx] bg-white border-[2rpx] border-solid border-[#E9D7AF] flex items-center justify-center"
                    onClick={() => Taro.navigateTo({ url: `/pages/PetTimeline/index?petId=${activePetId}` })}
                  >
                    <Text className="text-[22rpx] text-[#8b6c3f]">查看时间线</Text>
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

export default PetFood;
