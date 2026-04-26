import BasicLayout from '@/layout/basicLayout';
import { View, Text, Input, Textarea } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import { memo, useCallback, useEffect, useState } from 'react';
import { PET_UI } from '@/constants/petUi';
import {
  createMilestoneData,
  deleteMilestoneData,
  getMilestoneListData,
  MilestoneItem,
  toIsoDateTime,
  updateMilestoneData,
} from '@/api/data';
import { usePetApiPets } from '@/hooks/usePetApiPets';
import { ensureLoggedIn, isLoggedIn } from '@/utils/authState';
import { formatLocalDateKey } from '@/utils/formatDate';

const defaultForm = {
  title: '',
  date: formatLocalDateKey(new Date()),
  description: '',
  tags: '',
};

const isValidDateString = (value: string) => {
  const matched = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!matched) {
    return false;
  }
  const target = new Date(`${matched[1]}-${matched[2]}-${matched[3]}T00:00:00`);
  return !Number.isNaN(target.getTime());
};

const PetMilestones = memo(function PetMilestones() {
  const { pets, activePet, activePetId, setActivePetId } = usePetApiPets();
  const [milestones, setMilestones] = useState<MilestoneItem[]>([]);
  const [form, setForm] = useState(defaultForm);
  const [editingId, setEditingId] = useState('');
  const [saving, setSaving] = useState(false);
  const loggedIn = isLoggedIn();

  const refreshMilestones = useCallback(() => {
    if (!activePetId) {
      setMilestones([]);
      return Promise.resolve();
    }

    return getMilestoneListData({ petId: activePetId })
      .then((list) => setMilestones(list))
      .catch(() => setMilestones([]));
  }, [activePetId]);

  useEffect(() => {
    refreshMilestones();
  }, [refreshMilestones]);

  useDidShow(() => {
    refreshMilestones();
  });

  const resetForm = () => {
    setForm({
      ...defaultForm,
      date: formatLocalDateKey(new Date()),
    });
    setEditingId('');
  };

  const handleEdit = (item: MilestoneItem) => {
    setEditingId(item.id);
    setForm({
      title: item.title,
      date: item.occurredAt.slice(0, 10),
      description: item.description || '',
      tags: item.tags?.join('、') || '',
    });
    Taro.pageScrollTo({ scrollTop: 0, duration: 250 });
  };

  const handleSubmit = async () => {
    if (!ensureLoggedIn('/pages/PetMilestones/index')) {
      return;
    }

    if (!activePetId) {
      Taro.showToast({ title: '请先添加宠物', icon: 'none' });
      return;
    }

    if (!form.title.trim()) {
      Taro.showToast({ title: '请填写里程碑标题', icon: 'none' });
      return;
    }

    if (!isValidDateString(form.date.trim())) {
      Taro.showToast({ title: '日期格式不正确', icon: 'none' });
      return;
    }

    const payload = {
      petId: activePetId,
      title: form.title.trim(),
      occurredAt: toIsoDateTime(form.date.trim(), '09:00'),
      description: form.description.trim() || undefined,
      tags: form.tags
        .split(/[、,，\n]/)
        .map((item) => item.trim())
        .filter(Boolean),
    };

    setSaving(true);
    try {
      if (editingId) {
        await updateMilestoneData(editingId, payload);
      } else {
        await createMilestoneData(payload);
      }
      resetForm();
      await refreshMilestones();
      Taro.showToast({ title: editingId ? '里程碑已更新' : '里程碑已保存', icon: 'success' });
    } catch (error) {
      const message = error instanceof Error ? error.message : '保存失败';
      Taro.showToast({ title: message, icon: 'none' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!ensureLoggedIn('/pages/PetMilestones/index')) {
      return;
    }

    const result = await Taro.showModal({
      title: '确认删除',
      content: '是否删除这条里程碑记录？',
      confirmText: '删除',
      confirmColor: '#d65a31',
    });

    if (!result.confirm) {
      return;
    }

    try {
      await deleteMilestoneData(id);
      Taro.showToast({ title: '已删除', icon: 'success' });
      refreshMilestones();
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
        navTitle: '成长里程碑',
        needBack: true,
      }}
    >
      <View className="px-6 pt-4 pb-[120rpx]">
        {!loggedIn ? (
          <View className="mb-5 rounded-[20rpx] bg-[#FFF7D5] p-4">
            <Text className="text-[22rpx] text-[#6E5A2C] block">
              登录后可以记录每只宠物的重要成长节点，并同步到时间线和报告里。
            </Text>
            <View
              className="mt-3 inline-flex px-4 py-2 rounded-[999rpx] bg-[#FFD93B]"
              onClick={() => ensureLoggedIn('/pages/PetMilestones/index')}
            >
              <Text className="text-[22rpx] text-[#5D4510] font-semibold">去微信登录</Text>
            </View>
          </View>
        ) : null}

        {loggedIn && !pets.length ? (
          <View className="mb-5 rounded-[20rpx] bg-white p-4 shadow-[0_14rpx_30rpx_rgba(0,0,0,0.08)]">
            <Text className="text-[24rpx] text-[#2b2b2b] font-semibold block">先添加宠物档案</Text>
            <Text className="text-[22rpx] text-[#666] mt-[8rpx] block">
              有了宠物之后，才能为它记录生日、第一次出门、接种完成这类成长节点。
            </Text>
            <View
              className="mt-3 inline-flex px-4 py-2 rounded-[999rpx] bg-[#FFD93B]"
              onClick={() => Taro.navigateTo({ url: '/pages/EditPetProfile/index' })}
            >
              <Text className="text-[22rpx] text-[#5D4510] font-semibold">去添加宠物</Text>
            </View>
          </View>
        ) : null}

        <View className="mb-4 flex gap-2 flex-wrap">
          {pets.map((pet) => (
            <View
              key={pet.id}
              className="px-4 py-2 rounded-[16rpx]"
              style={{
                backgroundColor: activePetId === pet.id ? '#FFD93B' : '#f4f4f4',
                border: '2rpx solid #262626',
              }}
              onClick={() => setActivePetId(pet.id)}
            >
              <Text className="text-[24rpx]">{pet.name}</Text>
            </View>
          ))}
        </View>

        <View className="rounded-[24rpx] bg-white p-5 mb-5 shadow-[0_14rpx_30rpx_rgba(0,0,0,0.08)]">
          <Text className="text-[30rpx] font-semibold text-[#2b2b2b] block">
            {activePet?.name || '暂无宠物'}的成长节点
          </Text>
          <Text className="text-[22rpx] text-[#666] mt-[8rpx] block">
            当前已记录 {milestones.length} 个重要里程碑
          </Text>
        </View>

        <View className="rounded-[24rpx] bg-white p-5 mb-5 shadow-[0_14rpx_30rpx_rgba(0,0,0,0.08)]">
          <View className="mb-4 flex items-center justify-between">
            <Text className="text-[28rpx] font-semibold block">
              {editingId ? '编辑里程碑' : '新增里程碑'}
            </Text>
            {editingId ? (
              <View className="px-4 py-2 rounded-[999rpx] bg-[#FFF4CC]" onClick={resetForm}>
                <Text className="text-[22rpx] text-[#8a6a00]">取消编辑</Text>
              </View>
            ) : null}
          </View>
          <View className="rounded-[16rpx] bg-[#F7F7F7] p-4 mb-3">
            <Text className="text-[22rpx] text-[#666]">标题</Text>
            <Input
              value={form.title}
              placeholder="例如：第一次出门、完成三联疫苗"
              onInput={(e) => setForm((prev) => ({ ...prev, title: e.detail.value }))}
            />
          </View>
          <View className="rounded-[16rpx] bg-[#F7F7F7] p-4 mb-3">
            <Text className="text-[22rpx] text-[#666]">日期</Text>
            <Input
              value={form.date}
              placeholder="YYYY-MM-DD"
              onInput={(e) => setForm((prev) => ({ ...prev, date: e.detail.value }))}
            />
          </View>
          <View className="rounded-[16rpx] bg-[#F7F7F7] p-4 mb-3">
            <Text className="text-[22rpx] text-[#666]">标签</Text>
            <Input
              value={form.tags}
              placeholder="例如：成长、疫苗、外出"
              onInput={(e) => setForm((prev) => ({ ...prev, tags: e.detail.value }))}
            />
          </View>
          <View className="rounded-[16rpx] bg-[#F7F7F7] p-4">
            <Text className="text-[22rpx] text-[#666]">描述</Text>
            <Textarea
              autoHeight
              value={form.description}
              placeholder="记录当时的小故事、变化或感受"
              onInput={(e) => setForm((prev) => ({ ...prev, description: e.detail.value }))}
            />
          </View>
          <View
            className="mt-4 h-[88rpx] rounded-[999rpx] bg-[#FFD93B] flex items-center justify-center"
            onClick={handleSubmit}
          >
            <Text className="text-[30rpx] font-semibold">
              {saving ? '保存中...' : editingId ? '更新里程碑' : '保存里程碑'}
            </Text>
          </View>
        </View>

        <View className="rounded-[24rpx] bg-white p-5 shadow-[0_14rpx_30rpx_rgba(0,0,0,0.08)]">
          <Text className="text-[28rpx] font-semibold mb-4 block">里程碑列表</Text>
          {milestones.length ? (
            milestones.map((item) => (
              <View key={item.id} className="mb-3 rounded-[18rpx] bg-[#FFFBEA] p-4">
                <View className="flex justify-between items-start">
                  <View className="flex-1 pr-4">
                    <Text className="text-[28rpx] font-semibold block">{item.title}</Text>
                    <Text className="text-[22rpx] text-[#666] block mt-[6rpx]">
                      {item.occurredAt.slice(0, 10)}
                    </Text>
                    {item.tags?.length ? (
                      <Text className="text-[21rpx] text-[#a36d2b] block mt-[4rpx]">
                        标签：{item.tags.join('、')}
                      </Text>
                    ) : null}
                    {item.description ? (
                      <Text className="text-[21rpx] text-[#7a7a7a] block mt-[4rpx]">
                        {item.description}
                      </Text>
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
            <Text className="text-[24rpx] text-[#8a8a8a]">
              还没有成长里程碑，可以先记录第一次到家、第一次出门或疫苗完成这类节点。
            </Text>
          )}
        </View>
      </View>
    </BasicLayout>
  );
});

export default PetMilestones;
