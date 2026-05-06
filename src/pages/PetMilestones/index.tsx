import BasicLayout from '@/layout/basicLayout';
import { View, Text, Input, Textarea } from '@tarojs/components';
import Taro, { useDidShow, useRouter } from '@tarojs/taro';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import { setStoredActivePetId } from '@/utils/activePetState';
import { ensureLoggedIn, isLoggedIn } from '@/utils/authState';
import { formatLocalDateKey } from '@/utils/formatDate';

const createDefaultForm = () => ({
  title: '',
  date: formatLocalDateKey(new Date()),
  description: '',
  tags: '',
});

const splitTagText = (value: string) => {
  return value
    .split(/[、，,\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
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
  const { params } = useRouter();
  const preferredPetId = params.petId || '';
  const { pets, activePet, activePetId, setActivePetId } = usePetApiPets(preferredPetId);
  const [milestones, setMilestones] = useState<MilestoneItem[]>([]);
  const [form, setForm] = useState(createDefaultForm);
  const [editingId, setEditingId] = useState('');
  const [saving, setSaving] = useState(false);
  const previousActivePetIdRef = useRef(activePetId);
  const loggedIn = isLoggedIn();
  const hasActivePet = Boolean(activePetId && activePet);
  const canSubmit = hasActivePet;

  const refreshMilestones = useCallback(() => {
    if (!loggedIn) {
      setMilestones([]);
      return Promise.resolve();
    }

    if (!activePetId || !activePet) {
      setMilestones([]);
      return Promise.resolve();
    }

    return getMilestoneListData({ petId: activePetId })
      .then((list) =>
        setMilestones(
          [...list].sort(
            (left, right) =>
              new Date(right.occurredAt).getTime() - new Date(left.occurredAt).getTime()
          )
        )
      )
      .catch(() => setMilestones([]));
  }, [activePet, activePetId, loggedIn]);

  useEffect(() => {
    if (activePetId) {
      setStoredActivePetId(activePetId);
    }
    refreshMilestones();
  }, [activePetId, refreshMilestones]);

  useDidShow(() => {
    refreshMilestones();
  });

  const resetForm = () => {
    setForm(createDefaultForm());
    setEditingId('');
  };

  useEffect(() => {
    if (editingId && !milestones.some((item) => item.id === editingId)) {
      resetForm();
    }
  }, [editingId, milestones]);

  useEffect(() => {
    if (previousActivePetIdRef.current && previousActivePetIdRef.current !== activePetId) {
      resetForm();
    }
    previousActivePetIdRef.current = activePetId;
  }, [activePetId]);

  const handleEdit = (item: MilestoneItem) => {
    setEditingId(item.id);
    setForm({
      title: item.title || '',
      date: item.occurredAt.slice(0, 10),
      description: item.description || '',
      tags: item.tags?.join('、') || '',
    });
    Taro.pageScrollTo({ scrollTop: 0, duration: 250 });
  };

  const handleSubmit = async () => {
    if (
      !ensureLoggedIn(
        `/pages/PetMilestones/index${preferredPetId ? `?petId=${preferredPetId}` : ''}`
      )
    ) {
      return;
    }

    if (!activePetId || !activePet) {
      Taro.showToast({ title: '请先选择有效宠物', icon: 'none' });
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
      tags: splitTagText(form.tags),
    };

    setSaving(true);
    try {
      setStoredActivePetId(activePetId);
      if (editingId) {
        await updateMilestoneData(editingId, payload);
      } else {
        await createMilestoneData(payload);
      }
      resetForm();
      await refreshMilestones();
      Taro.showToast({
        title: editingId ? '里程碑已更新' : '里程碑已保存',
        icon: 'success',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : '保存失败';
      Taro.showToast({ title: message, icon: 'none' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (
      !ensureLoggedIn(
        `/pages/PetMilestones/index${preferredPetId ? `?petId=${preferredPetId}` : ''}`
      )
    ) {
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
      if (editingId === id) {
        resetForm();
      }
      await refreshMilestones();
      Taro.showToast({ title: '已删除', icon: 'success' });
    } catch (error) {
      const message = error instanceof Error ? error.message : '删除失败';
      Taro.showToast({ title: message, icon: 'none' });
    }
  };

  const firstMilestone = milestones[milestones.length - 1];
  const latestMilestone = milestones[0];
  const tagCount = useMemo(() => {
    return new Set(milestones.flatMap((item) => item.tags || [])).size;
  }, [milestones]);

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
            <Text className="text-[22rpx] text-[#6E5A2C] block leading-[1.6]">
              登录后可以记录每只宠物的重要成长节点，并同步到时间线和报告里。
            </Text>
            <View
              className="mt-3 inline-flex h-[74rpx] px-4 rounded-[999rpx] bg-[#FFD93B] items-center"
              onClick={() =>
                ensureLoggedIn(
                  `/pages/PetMilestones/index${preferredPetId ? `?petId=${preferredPetId}` : ''}`
                )
              }
            >
              <Text className="text-[22rpx] text-[#5D4510] font-semibold">去微信登录</Text>
            </View>
          </View>
        ) : null}

        {loggedIn && !pets.length ? (
          <View className="mb-5 rounded-[20rpx] bg-white p-4 shadow-[0_14rpx_30rpx_rgba(0,0,0,0.08)]">
            <Text className="text-[24rpx] text-[#2B2B2B] font-semibold block">
              先添加宠物档案
            </Text>
            <Text className="text-[22rpx] text-[#666] mt-[8rpx] block leading-[1.6]">
              有了宠物之后，才适合开始记录生日、第一次到家、疫苗完成这类成长节点。
            </Text>
            <View
              className="mt-3 inline-flex h-[74rpx] px-4 rounded-[999rpx] bg-[#FFD93B] items-center"
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
              className="px-[22rpx] py-[12rpx] rounded-[16rpx]"
              style={{
                backgroundColor: activePetId === pet.id ? '#FFD93B' : '#F4F4F4',
                border: '2rpx solid #262626',
              }}
              onClick={() => {
                setActivePetId(pet.id);
                setStoredActivePetId(pet.id);
                Taro.redirectTo({ url: `/pages/PetMilestones/index?petId=${pet.id}` });
              }}
            >
              <Text className="text-[24rpx] text-[#2B2B2B]">{pet.name}</Text>
            </View>
          ))}
        </View>

        {loggedIn && pets.length > 0 && !hasActivePet ? (
          <View className="rounded-[24rpx] bg-white p-5 mb-5 shadow-[0_14rpx_30rpx_rgba(0,0,0,0.08)]">
            <Text className="text-[24rpx] font-semibold text-[#2b2b2b] block">
              请先重新选择宠物
            </Text>
            <Text className="text-[22rpx] text-[#666] mt-[8rpx] block">
              当前成长节点页面没有绑定到有效宠物，你可以直接从上方切换到一只现有宠物继续整理里程碑。
            </Text>
          </View>
        ) : null}

        <View className="rounded-[24rpx] bg-white p-5 mb-5 shadow-[0_14rpx_30rpx_rgba(0,0,0,0.08)]">
          <Text className="text-[30rpx] font-semibold text-[#2B2B2B] block">
            {activePet?.name || '当前宠物'}的成长节点
          </Text>
          <Text className="text-[22rpx] text-[#666] mt-[8rpx] block">
            当前已记录 {milestones.length} 个里程碑
          </Text>
          {latestMilestone ? (
            <Text className="text-[22rpx] text-[#666] mt-[6rpx] block">
              最近一次：{latestMilestone.title} · {latestMilestone.occurredAt.slice(0, 10)}
            </Text>
          ) : (
            <Text className="text-[22rpx] text-[#888] mt-[6rpx] block">
              还没有成长记录，可以先补一个重要节点。
            </Text>
          )}
        </View>

        {hasActivePet ? (
          <View className="rounded-[24rpx] bg-[#FFF7D5] p-5 mb-5 shadow-[0_14rpx_30rpx_rgba(0,0,0,0.05)]">
            <Text className="text-[28rpx] font-semibold text-[#2B2B2B] block">
              围绕 {activePet?.name || '当前宠物'} 继续整理成长轨迹
            </Text>
            <Text className="text-[22rpx] text-[#6E5A2C] mt-[8rpx] block leading-[1.6]">
              记录完成长节点后，可以继续回看时间线、查看成长报告，或者回到详情页继续维护其它资料。
            </Text>
            <View className="flex gap-3 mt-4">
              <View
                className="flex-1 h-[74rpx] px-4 rounded-[16rpx] bg-white border-[2rpx] border-solid border-[#E9D7AF] flex items-center justify-center"
                onClick={() =>
                  Taro.navigateTo({ url: `/pages/PetTimeline/index?petId=${activePetId}` })
                }
              >
                <Text className="text-[22rpx] text-[#8B6C3F]">查看时间线</Text>
              </View>
              <View
                className="flex-1 h-[74rpx] px-4 rounded-[16rpx] bg-white border-[2rpx] border-solid border-[#E9D7AF] flex items-center justify-center"
                onClick={() =>
                  Taro.navigateTo({ url: `/pages/PetReport/index?petId=${activePetId}` })
                }
              >
                <Text className="text-[22rpx] text-[#8B6C3F]">查看报告</Text>
              </View>
              <View
                className="flex-1 h-[74rpx] px-4 rounded-[16rpx] bg-[#FFD93B] flex items-center justify-center"
                onClick={() =>
                  Taro.navigateTo({
                    url: `/pages/PetDetailPage/index?petId=${activePetId}`,
                  })
                }
              >
                <Text className="text-[22rpx] font-semibold text-[#5D4510]">宠物详情</Text>
              </View>
            </View>
          </View>
        ) : null}

        <View className="grid grid-cols-3 gap-3 mb-5">
          <View className="rounded-[20rpx] bg-white p-4 shadow-[0_14rpx_30rpx_rgba(0,0,0,0.06)]">
            <Text className="text-[22rpx] text-[#666] block">总节点数</Text>
            <Text className="text-[34rpx] font-semibold text-[#2B2B2B] mt-[6rpx] block">
              {milestones.length}
            </Text>
          </View>
          <View className="rounded-[20rpx] bg-white p-4 shadow-[0_14rpx_30rpx_rgba(0,0,0,0.06)]">
            <Text className="text-[22rpx] text-[#666] block">标签数量</Text>
            <Text className="text-[34rpx] font-semibold text-[#2B2B2B] mt-[6rpx] block">
              {tagCount}
            </Text>
          </View>
          <View className="rounded-[20rpx] bg-white p-4 shadow-[0_14rpx_30rpx_rgba(0,0,0,0.06)]">
            <Text className="text-[22rpx] text-[#666] block">最早记录</Text>
            <Text className="text-[26rpx] font-semibold text-[#2B2B2B] mt-[6rpx] block">
              {firstMilestone ? firstMilestone.occurredAt.slice(5, 10) : '--'}
            </Text>
          </View>
        </View>

        <View className="rounded-[24rpx] bg-white p-5 mb-5 shadow-[0_14rpx_30rpx_rgba(0,0,0,0.08)]">
          <View className="mb-4 flex items-center justify-between">
            <Text className="text-[28rpx] font-semibold block">
              {editingId ? '编辑里程碑' : '新增里程碑'}
            </Text>
            {editingId ? (
              <View className="px-4 py-2 rounded-[999rpx] bg-[#FFF4CC]" onClick={resetForm}>
                <Text className="text-[22rpx] text-[#8A6A00]">取消编辑</Text>
              </View>
            ) : null}
          </View>
          {hasActivePet ? (
            <View className="mb-4 rounded-[18rpx] bg-[#FFF4CC] px-4 py-3">
              <Text className="text-[22rpx] text-[#7A5A00] block">
                当前内容会保存到 {activePet?.name}
              </Text>
              <Text className="text-[20rpx] text-[#9B7A1C] mt-[6rpx] block">
                切换宠物时会自动结束当前编辑，避免成长节点记到别的宠物身上。
              </Text>
            </View>
          ) : null}
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
            className="mt-4 h-[88rpx] rounded-[999rpx] flex items-center justify-center"
            style={{
              backgroundColor: canSubmit ? '#FFD93B' : '#E5E5E5',
              opacity: canSubmit ? 1 : 0.7,
            }}
            onClick={() => {
              if (!canSubmit) {
                Taro.showToast({ title: '请先选择有效宠物', icon: 'none' });
                return;
              }
              handleSubmit();
            }}
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
                    <Text className="text-[28rpx] font-semibold block text-[#2B2B2B]">
                      {item.title}
                    </Text>
                    <Text className="text-[22rpx] text-[#666] block mt-[6rpx]">
                      {item.occurredAt.slice(0, 10)}
                    </Text>
                    {item.tags?.length ? (
                      <Text className="text-[21rpx] text-[#A36D2B] block mt-[4rpx]">
                        标签：{item.tags.join('、')}
                      </Text>
                    ) : null}
                    {item.description ? (
                      <Text className="text-[21rpx] text-[#7A7A7A] block mt-[4rpx] leading-[1.7]">
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
                      <Text className="text-[22rpx] text-[#8B6C3F]">编辑</Text>
                    </View>
                    <View
                      className="px-4 py-2 rounded-[999rpx] bg-white"
                      style={{ border: '2rpx solid #F0D49A' }}
                      onClick={() => handleDelete(item.id)}
                    >
                      <Text className="text-[22rpx] text-[#B36439]">删除</Text>
                    </View>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <View className="rounded-[18rpx] bg-[#FFFBEA] p-4">
              <Text className="text-[24rpx] text-[#8A8A8A] leading-[1.7]">
                {activePet?.name || '当前宠物'}
                还没有成长里程碑，可以先记录第一次到家、第一次出门或疫苗完成这类关键节点。
              </Text>
              {hasActivePet ? (
                <View className="flex gap-3 mt-4">
                  <View
                    className="flex-1 h-[74rpx] px-4 rounded-[16rpx] bg-[#FFD93B] flex items-center justify-center"
                    onClick={() => Taro.pageScrollTo({ scrollTop: 0, duration: 250 })}
                  >
                    <Text className="text-[22rpx] font-semibold text-[#5D4510]">
                      去记录节点
                    </Text>
                  </View>
                  <View
                    className="flex-1 h-[74rpx] px-4 rounded-[16rpx] bg-white border-[2rpx] border-solid border-[#E9D7AF] flex items-center justify-center"
                    onClick={() =>
                      Taro.navigateTo({
                        url: `/pages/PetTimeline/index?petId=${activePetId}`,
                      })
                    }
                  >
                    <Text className="text-[22rpx] text-[#8B6C3F]">查看时间线</Text>
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

export default PetMilestones;
