import BasicLayout from '@/layout/basicLayout';
import { View, Text, Input, Textarea } from '@tarojs/components';
import Taro, { useDidShow, useRouter } from '@tarojs/taro';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { PET_UI } from '@/constants/petUi';
import {
  createMedicineData,
  createScheduleData,
  deleteMedicineData,
  getMedicineListData,
  MedicineItem,
  toIsoDateTime,
  updateMedicineData,
} from '@/api/data';
import { usePetApiPets } from '@/hooks/usePetApiPets';
import { setStoredActivePetId, switchTabWithActivePet } from '@/utils/activePetState';
import { ensureLoggedIn, isLoggedIn } from '@/utils/authState';

const defaultForm = {
  name: '',
  specification: '',
  dosage: '',
  usage: '',
  expiresAt: '',
  mealTiming: '',
  ageLimit: '',
  weightLimit: '',
  remainingDays: '',
  notes: '',
  reminderDate: '',
  reminderTime: '08:00',
};

const isValidDateString = (value: string) => {
  if (!value) {
    return true;
  }
  const matched = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!matched) {
    return false;
  }

  const year = Number(matched[1]);
  const month = Number(matched[2]);
  const day = Number(matched[3]);
  const target = new Date(`${matched[1]}-${matched[2]}-${matched[3]}T00:00:00`);

  return (
    !Number.isNaN(target.getTime()) &&
    target.getFullYear() === year &&
    target.getMonth() + 1 === month &&
    target.getDate() === day
  );
};

const isValidTimeString = (value: string) => {
  if (!value) {
    return true;
  }
  return /^([01]\d|2[0-3]):([0-5]\d)$/.test(value);
};

const PetMedicine = memo(function PetMedicine() {
  const { params } = useRouter();
  const preferredPetId = params.petId || '';
  const { pets, activePet, activePetId, setActivePetId } = usePetApiPets(preferredPetId);
  const [medicines, setMedicines] = useState<MedicineItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState('');
  const [form, setForm] = useState(defaultForm);
  const loggedIn = isLoggedIn();
  const hasActivePet = Boolean(activePetId && activePet);
  const canSubmit = hasActivePet;

  const refreshMedicines = useCallback(() => {
    if (!loggedIn) {
      setMedicines([]);
      return Promise.resolve();
    }

    if (!activePetId || !activePet) {
      setMedicines([]);
      return Promise.resolve();
    }

    return getMedicineListData({ petId: activePetId })
      .then((list) => setMedicines(list))
      .catch(() => setMedicines([]));
  }, [activePet, activePetId, loggedIn]);

  useEffect(() => {
    if (activePetId) {
      setStoredActivePetId(activePetId);
    }
    refreshMedicines();
  }, [activePetId, refreshMedicines]);

  useDidShow(() => {
    refreshMedicines();
  });

  useEffect(() => {
    if (editingId && !medicines.some((item) => item.id === editingId)) {
      resetForm();
    }
  }, [editingId, medicines]);

  const dueSoonCount = useMemo(() => {
    return medicines.filter((item) => Number(item.remainingDays || 0) > 0 && Number(item.remainingDays || 0) <= 3).length;
  }, [medicines]);
  const expiredCount = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return medicines.filter((item) => item.expiresAt && item.expiresAt < today).length;
  }, [medicines]);

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

  const handleEdit = (item: MedicineItem) => {
    setEditingId(item.id);
    setForm({
      name: item.name || '',
      specification: item.specification || '',
      dosage: item.dosage || '',
      usage: item.usage || '',
      expiresAt: item.expiresAt || '',
      mealTiming: item.mealTiming || '',
      ageLimit: item.ageLimit || '',
      weightLimit: item.weightLimit || '',
      remainingDays:
        item.remainingDays !== undefined && item.remainingDays !== null
          ? `${item.remainingDays}`
          : '',
      notes: item.notes || '',
      reminderDate: '',
      reminderTime: '08:00',
    });
    Taro.pageScrollTo({ scrollTop: 0, duration: 250 });
  };

  const handleSubmit = async () => {
    if (!ensureLoggedIn(`/pages/PetMedicine/index${preferredPetId ? `?petId=${preferredPetId}` : ''}`)) {
      return;
    }

    if (!activePetId || !activePet) {
      Taro.showToast({ title: '请先选择有效宠物', icon: 'none' });
      return;
    }

    if (!form.name.trim()) {
      Taro.showToast({ title: '请填写药品名称', icon: 'none' });
      return;
    }

    if (form.expiresAt && !isValidDateString(form.expiresAt.trim())) {
      Taro.showToast({ title: '过期日期格式不正确', icon: 'none' });
      return;
    }

    if (form.reminderDate && !isValidDateString(form.reminderDate.trim())) {
      Taro.showToast({ title: '提醒日期格式不正确', icon: 'none' });
      return;
    }

    if (form.reminderTime && !isValidTimeString(form.reminderTime.trim())) {
      Taro.showToast({ title: '提醒时间格式不正确', icon: 'none' });
      return;
    }

    setSaving(true);
    try {
      setStoredActivePetId(activePetId);
      const payload = {
        petId: activePetId,
        name: form.name.trim(),
        specification: form.specification.trim() || undefined,
        dosage: form.dosage.trim() || undefined,
        usage: form.usage.trim() || undefined,
        expiresAt: form.expiresAt.trim() || undefined,
        mealTiming: form.mealTiming.trim() || undefined,
        ageLimit: form.ageLimit.trim() || undefined,
        weightLimit: form.weightLimit.trim() || undefined,
        remainingDays: form.remainingDays ? Number(form.remainingDays) : undefined,
        notes: form.notes.trim() || undefined,
      };

      const medicine = editingId
        ? await updateMedicineData(editingId, payload)
        : await createMedicineData(payload);

      if (form.reminderDate.trim()) {
        await createScheduleData({
          petId: activePetId,
          title: `用药提醒：${medicine.name}`,
          category: 'health',
          type: '用药提醒',
          status: 'pending',
          repeatRule: '单次',
          remindAt: toIsoDateTime(form.reminderDate.trim(), form.reminderTime.trim() || '08:00'),
          notes: [medicine.dosage, medicine.usage, medicine.mealTiming]
            .filter(Boolean)
            .join(' / ') || medicine.notes,
        });
      }

      resetForm();
      Taro.showToast({
        title: form.reminderDate.trim()
          ? editingId
            ? '用药和提醒已更新'
            : '用药和提醒已保存'
          : editingId
            ? '用药已更新'
            : '用药已保存',
        icon: 'success',
      });
      await refreshMedicines();
    } catch (error) {
      const message = error instanceof Error ? error.message : '保存失败';
      Taro.showToast({ title: message, icon: 'none' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!ensureLoggedIn(`/pages/PetMedicine/index${preferredPetId ? `?petId=${preferredPetId}` : ''}`)) {
      return;
    }

    const result = await Taro.showModal({
      title: '确认删除',
      content: '是否删除这条用药记录？',
      confirmText: '删除',
      confirmColor: '#d65a31',
    });

    if (!result.confirm) {
      return;
    }

    try {
      await deleteMedicineData(id);
      if (editingId === id) {
        resetForm();
      }
      Taro.showToast({ title: '已删除', icon: 'success' });
      await refreshMedicines();
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
        navTitle: '用药管理',
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
                Taro.redirectTo({ url: `/pages/PetMedicine/index?petId=${pet.id}` });
              }}
            >
              <Text className="text-[24rpx]">{pet.name}</Text>
            </View>
          ))}
        </View>

        {!loggedIn ? (
          <View className="mb-5 rounded-[20rpx] bg-[#F6F0FF] p-4">
            <Text className="text-[22rpx] text-[#6C5C90] block">
              登录后可同步用药档案、提醒和疗程状态。
            </Text>
            <View
              className="mt-3 inline-flex px-4 py-2 rounded-[999rpx] bg-[#E9D8FF]"
              onClick={() =>
                ensureLoggedIn(
                  `/pages/PetMedicine/index${preferredPetId ? `?petId=${preferredPetId}` : ''}`
                )
              }
            >
              <Text className="text-[22rpx] text-[#6C4DA0] font-semibold">去微信登录</Text>
            </View>
          </View>
        ) : null}

        {loggedIn && !pets.length ? (
          <View className="mb-5 rounded-[20rpx] bg-white p-4 shadow-[0_14rpx_30rpx_rgba(0,0,0,0.08)]">
            <Text className="text-[24rpx] text-[#2b2b2b] font-semibold block">先添加宠物档案</Text>
            <Text className="text-[22rpx] text-[#666] mt-[8rpx] block">
              有了宠物之后，才能为它维护用药记录、疗程状态和提醒安排。
            </Text>
            <View
              className="mt-3 inline-flex px-4 py-2 rounded-[999rpx] bg-[#E9D8FF]"
              onClick={() => Taro.navigateTo({ url: '/pages/EditPetProfile/index' })}
            >
              <Text className="text-[22rpx] text-[#6C4DA0] font-semibold">去添加宠物</Text>
            </View>
          </View>
        ) : null}

        {loggedIn && pets.length > 0 && !hasActivePet ? (
          <View className="mb-5 rounded-[20rpx] bg-white p-4 shadow-[0_14rpx_30rpx_rgba(0,0,0,0.08)]">
            <Text className="text-[24rpx] text-[#2b2b2b] font-semibold block">请先重新选择宠物</Text>
            <Text className="text-[22rpx] text-[#666] mt-[8rpx] block">
              当前用药页面没有绑定到有效宠物，你可以直接从上方切换到一只现有宠物继续安排疗程和提醒。
            </Text>
          </View>
        ) : null}

        <View className="mb-5 rounded-[24rpx] bg-white p-5 shadow-[0_14rpx_30rpx_rgba(0,0,0,0.08)]">
          <Text className="text-[30rpx] font-semibold text-[#2b2b2b] block">
            {activePet?.name || (loggedIn && pets.length > 0 ? '未选择有效宠物' : '暂无宠物')}的用药档案
          </Text>
          <Text className="text-[22rpx] text-[#666] mt-[8rpx] block">
            共 {medicines.length} 条用药记录，临近疗程结束 {dueSoonCount} 条
          </Text>
          <Text className="text-[22rpx] text-[#666] mt-[6rpx] block">
            已过期药品 {expiredCount} 条
          </Text>
        </View>

        {hasActivePet ? (
          <View className="mb-5 rounded-[24rpx] bg-[#F6F0FF] p-5 shadow-[0_14rpx_30rpx_rgba(0,0,0,0.05)]">
            <Text className="text-[28rpx] font-semibold text-[#2b2b2b] block">
              围绕{activePet?.name || '当前宠物'}继续安排
            </Text>
            <Text className="text-[22rpx] text-[#6C5C90] mt-[8rpx] block">
              维护完用药后，可以直接去看日程提醒、时间线回流，或者查看这只宠物的整体报告。
            </Text>
            <View className="flex gap-3 mt-4">
              <View
                className="flex-1 px-4 py-3 rounded-[16rpx] bg-[#E9D8FF] flex items-center justify-center"
                onClick={() => switchTabWithActivePet('/pages/PetSchedule/index', activePetId)}
              >
                <Text className="text-[22rpx] font-semibold text-[#6C4DA0]">查看日程</Text>
              </View>
              <View
                className="flex-1 px-4 py-3 rounded-[16rpx] bg-white border-[2rpx] border-solid border-[#E8DDFC] flex items-center justify-center"
                onClick={() => Taro.navigateTo({ url: `/pages/PetTimeline/index?petId=${activePetId}` })}
              >
                <Text className="text-[22rpx] text-[#7c57b0]">查看时间线</Text>
              </View>
              <View
                className="flex-1 px-4 py-3 rounded-[16rpx] bg-white border-[2rpx] border-solid border-[#E8DDFC] flex items-center justify-center"
                onClick={() => Taro.navigateTo({ url: `/pages/PetReport/index?petId=${activePetId}` })}
              >
                <Text className="text-[22rpx] text-[#7c57b0]">查看报告</Text>
              </View>
            </View>
          </View>
        ) : null}

        <View className="rounded-[24rpx] bg-white p-5 mb-5 shadow-[0_14rpx_30rpx_rgba(0,0,0,0.08)]">
          <View className="mb-4 flex items-center justify-between">
            <Text className="text-[28rpx] font-semibold block">
              {editingId ? '编辑用药' : '新增用药'}
            </Text>
            {editingId ? (
              <View
                className="px-4 py-2 rounded-[999rpx] bg-[#F2E8FF]"
                onClick={resetForm}
              >
                <Text className="text-[22rpx] text-[#7c57b0]">取消编辑</Text>
              </View>
            ) : null}
          </View>
          <View className="grid grid-cols-2 gap-3">
            <View className="col-span-2 rounded-[16rpx] bg-[#F7F7F7] p-4">
              <Text className="text-[22rpx] text-[#666]">药品名称</Text>
              <Input value={form.name} onInput={(e) => updateField('name', e.detail.value)} />
            </View>
            <View className="rounded-[16rpx] bg-[#F7F7F7] p-4">
              <Text className="text-[22rpx] text-[#666]">规格</Text>
              <Input
                value={form.specification}
                onInput={(e) => updateField('specification', e.detail.value)}
              />
            </View>
            <View className="rounded-[16rpx] bg-[#F7F7F7] p-4">
              <Text className="text-[22rpx] text-[#666]">剂量</Text>
              <Input value={form.dosage} onInput={(e) => updateField('dosage', e.detail.value)} />
            </View>
            <View className="rounded-[16rpx] bg-[#F7F7F7] p-4">
              <Text className="text-[22rpx] text-[#666]">用法频次</Text>
              <Input value={form.usage} onInput={(e) => updateField('usage', e.detail.value)} />
            </View>
            <View className="rounded-[16rpx] bg-[#F7F7F7] p-4">
              <Text className="text-[22rpx] text-[#666]">过期日期</Text>
              <Input
                value={form.expiresAt}
                placeholder="YYYY-MM-DD"
                onInput={(e) => updateField('expiresAt', e.detail.value)}
              />
            </View>
            <View className="rounded-[16rpx] bg-[#F7F7F7] p-4">
              <Text className="text-[22rpx] text-[#666]">饭前/饭后</Text>
              <Input
                value={form.mealTiming}
                onInput={(e) => updateField('mealTiming', e.detail.value)}
              />
            </View>
            <View className="rounded-[16rpx] bg-[#F7F7F7] p-4">
              <Text className="text-[22rpx] text-[#666]">年龄限制</Text>
              <Input
                value={form.ageLimit}
                onInput={(e) => updateField('ageLimit', e.detail.value)}
              />
            </View>
            <View className="rounded-[16rpx] bg-[#F7F7F7] p-4">
              <Text className="text-[22rpx] text-[#666]">体重限制</Text>
              <Input
                value={form.weightLimit}
                onInput={(e) => updateField('weightLimit', e.detail.value)}
              />
            </View>
            <View className="rounded-[16rpx] bg-[#F7F7F7] p-4">
              <Text className="text-[22rpx] text-[#666]">剩余天数</Text>
              <Input
                type="number"
                value={form.remainingDays}
                onInput={(e) => updateField('remainingDays', e.detail.value)}
              />
            </View>
            <View className="col-span-2 rounded-[16rpx] bg-[#F7F7F7] p-4">
              <Text className="text-[22rpx] text-[#666]">备注</Text>
              <Textarea autoHeight value={form.notes} onInput={(e) => updateField('notes', e.detail.value)} />
            </View>
            <View className="rounded-[16rpx] bg-[#F5F0FF] p-4">
              <Text className="text-[22rpx] text-[#666]">提醒日期</Text>
              <Input
                value={form.reminderDate}
                placeholder="YYYY-MM-DD"
                onInput={(e) => updateField('reminderDate', e.detail.value)}
              />
            </View>
            <View className="rounded-[16rpx] bg-[#F5F0FF] p-4">
              <Text className="text-[22rpx] text-[#666]">提醒时间</Text>
              <Input
                value={form.reminderTime}
                placeholder="HH:mm"
                onInput={(e) => updateField('reminderTime', e.detail.value)}
              />
            </View>
            <View className="col-span-2 px-2">
              <Text className="text-[22rpx] text-[#8a7aa5]">
                可选：填写后会自动新增一条用药提醒到日程里。
              </Text>
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
              {saving ? '保存中...' : editingId ? '更新用药' : '保存用药'}
            </Text>
          </View>
        </View>

        <View className="rounded-[24rpx] bg-white p-5 shadow-[0_14rpx_30rpx_rgba(0,0,0,0.08)]">
          <Text className="text-[28rpx] font-semibold mb-4 block">用药列表</Text>
          {medicines.length ? (
            medicines.map((item) => (
              <View key={item.id} className="mb-3 rounded-[18rpx] bg-[#F8F5FF] p-4">
                <View className="flex justify-between items-start">
                  <View className="flex-1 pr-4">
                    <Text className="text-[28rpx] font-semibold block">{item.name}</Text>
                    {Number(item.remainingDays || 0) > 0 && Number(item.remainingDays || 0) <= 3 ? (
                      <Text className="text-[20rpx] inline-block px-[10rpx] py-[4rpx] rounded-[999rpx] bg-[#FFF4DE] text-[#c47a11] mt-[8rpx]">
                        临近结束
                      </Text>
                    ) : null}
                    <Text className="text-[22rpx] text-[#666] block mt-[6rpx]">
                      {item.specification || '未填规格'} · {item.dosage || '未填剂量'}
                    </Text>
                    <Text className="text-[22rpx] text-[#666] block mt-[4rpx]">
                      {item.usage || '未填用法'} {item.mealTiming ? `· ${item.mealTiming}` : ''}
                    </Text>
                    <Text className="text-[22rpx] text-[#666] block mt-[4rpx]">
                      过期：{item.expiresAt || '未填'}，剩余天数：{Number(item.remainingDays || 0)}
                    </Text>
                    {(item.ageLimit || item.weightLimit) ? (
                      <Text className="text-[21rpx] text-[#7a7a7a] block mt-[4rpx]">
                        限制：{item.ageLimit || '不限年龄'} / {item.weightLimit || '不限体重'}
                      </Text>
                    ) : null}
                    {item.notes ? (
                      <Text className="text-[21rpx] text-[#7a7a7a] block mt-[4rpx]">{item.notes}</Text>
                    ) : null}
                  </View>
                  <View className="flex gap-2">
                    <View
                      className="px-4 py-2 rounded-[999rpx] bg-white"
                      style={{ border: '2rpx solid #E8DDFC' }}
                      onClick={() => handleEdit(item)}
                    >
                      <Text className="text-[22rpx] text-[#7c57b0]">编辑</Text>
                    </View>
                    <View
                      className="px-4 py-2 rounded-[999rpx] bg-white"
                      style={{ border: '2rpx solid #E1D3FF' }}
                      onClick={() => handleDelete(item.id)}
                    >
                      <Text className="text-[22rpx] text-[#8354c0]">删除</Text>
                    </View>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <View className="rounded-[18rpx] bg-[#F8F5FF] p-4">
              <Text className="text-[24rpx] text-[#8a8a8a]">
                {activePet?.name || '当前宠物'}还没有用药记录，先补一条药品、剂量或疗程档案吧。
              </Text>
              {hasActivePet ? (
                <View className="flex gap-3 mt-4">
                  <View
                    className="flex-1 px-4 py-3 rounded-[16rpx] bg-[#E9D8FF] flex items-center justify-center"
                    onClick={() => Taro.pageScrollTo({ scrollTop: 0, duration: 250 })}
                  >
                    <Text className="text-[22rpx] font-semibold text-[#6C4DA0]">去新增用药</Text>
                  </View>
                  <View
                    className="flex-1 px-4 py-3 rounded-[16rpx] bg-white border-[2rpx] border-solid border-[#E8DDFC] flex items-center justify-center"
                    onClick={() => switchTabWithActivePet('/pages/PetSchedule/index', activePetId)}
                  >
                    <Text className="text-[22rpx] text-[#7c57b0]">查看日程</Text>
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

export default PetMedicine;
