import BasicLayout from '@/layout/basicLayout';
import { View, Text, Input, Picker } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import { memo, useEffect, useMemo, useState } from 'react';
import { ReminderType } from '@/types/pet';
import { PET_UI } from '@/constants/petUi';
import { formatLocalDateKey } from '@/utils/formatDate';
import {
  createScheduleData,
  formatDateKey,
  formatTimeKey,
  getScheduleDetailData,
  toIsoDateTime,
  updateScheduleData,
} from '@/api/data';
import { usePetApiPets } from '@/hooks/usePetApiPets';
import { setStoredActivePetId, switchTabWithActivePet } from '@/utils/activePetState';
import { ensureLoggedIn } from '@/utils/authState';

const typeOptions: Array<{ label: string; value: ReminderType }> = [
  { label: '日常提醒', value: 'daily' },
  { label: '护理提醒', value: 'care' },
  { label: '健康提醒', value: 'health' },
  { label: '行为提醒', value: 'behavior' },
];

const AddPetReminder = memo(function AddPetReminder() {
  const { params } = useRouter();
  const initialPetId = params.petId || '';
  const scheduleId = params.scheduleId || '';
  const pageMode = scheduleId ? 'edit' : 'create';
  const defaultDate = useMemo(() => params.date || formatLocalDateKey(new Date()), [params.date]);
  const [selectedPetId, setSelectedPetId] = useState(initialPetId);
  const [loading, setLoading] = useState(pageMode === 'edit');
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(defaultDate);
  const [time, setTime] = useState('08:00');
  const [repeat, setRepeat] = useState('每天');
  const [typeIndex, setTypeIndex] = useState(0);
  const { pets } = usePetApiPets();

  const currentPet = pets.find((item) => item.id === selectedPetId) || null;
  const canSave = Boolean(currentPet) && !loading && !saving;
  const pageTitle = pageMode === 'edit' ? '编辑提醒' : '添加提醒';

  useEffect(() => {
    if (pageMode !== 'edit' || !scheduleId) {
      return;
    }

    setLoading(true);
    getScheduleDetailData(scheduleId)
      .then((schedule) => {
        const matchedTypeIndex = typeOptions.findIndex((item) => item.value === schedule.category);
        setSelectedPetId(schedule.petId);
        setStoredActivePetId(schedule.petId);
        setTitle(schedule.title || '');
        setDate(formatDateKey(schedule.remindAt) || defaultDate);
        setTime(formatTimeKey(schedule.remindAt) || '08:00');
        setRepeat(schedule.repeatRule || '单次');
        setTypeIndex(matchedTypeIndex >= 0 ? matchedTypeIndex : 0);
      })
      .catch((error) => {
        const message = error instanceof Error ? error.message : '提醒详情加载失败';
        Taro.showToast({ title: message, icon: 'none' });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [defaultDate, pageMode, scheduleId]);

  const handleSave = async () => {
    const loginUrl = `/pages/AddPetReminder/index?petId=${selectedPetId}&date=${date}${scheduleId ? `&scheduleId=${scheduleId}` : ''}`;
    if (!ensureLoggedIn(loginUrl)) {
      return;
    }

    if (!title.trim()) {
      Taro.showToast({ title: '请填写提醒内容', icon: 'none' });
      return;
    }

    if (!date.trim() || !time.trim()) {
      Taro.showToast({ title: '请填写日期和时间', icon: 'none' });
      return;
    }

    if (!selectedPetId || !currentPet) {
      Taro.showToast({ title: '请先选择有效宠物', icon: 'none' });
      return;
    }

    try {
      setSaving(true);
      const payload = {
        petId: selectedPetId,
        title: title.trim(),
        category: typeOptions[typeIndex].value,
        type: typeOptions[typeIndex].label,
        repeatRule: repeat.trim() || '单次',
        remindAt: toIsoDateTime(date.trim(), time.trim()),
      };

      if (pageMode === 'edit' && scheduleId) {
        await updateScheduleData(scheduleId, payload);
      } else {
        await createScheduleData(payload);
      }

      setStoredActivePetId(selectedPetId);
      Taro.showToast({
        title: pageMode === 'edit' ? '提醒已更新' : '提醒已保存',
        icon: 'success',
      });
      setTimeout(() => switchTabWithActivePet('/pages/PetSchedule/index', selectedPetId), 300);
    } catch (error) {
      const message = error instanceof Error ? error.message : '保存失败';
      Taro.showToast({ title: message, icon: 'none' });
    } finally {
      setSaving(false);
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
        navTitle: pageTitle,
        needBack: true,
      }}
    >
      <View className="p-8 pb-[120rpx]">
        {loading ? (
          <View className="mb-5">
            <Text className="text-[24rpx] text-[#666]">提醒信息加载中...</Text>
          </View>
        ) : null}

        {pets.length ? (
          <View className="mb-5">
            <Text className="text-[22rpx] text-[#666] block mb-2">选择宠物</Text>
            <View className="flex flex-wrap gap-2">
              {pets.map((pet) => (
                <View
                  key={pet.id}
                  className="px-4 py-2 rounded-[16rpx] border-[2rpx] border-solid border-[#262626]"
                  style={{ backgroundColor: pet.id === selectedPetId ? '#FFD93B' : '#f4f4f4' }}
                  onClick={() => {
                    setSelectedPetId(pet.id);
                    setStoredActivePetId(pet.id);
                  }}
                >
                  <Text className="text-[24rpx]">{pet.name}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        <View className="mb-5 border-[3rpx] border-black border-solid rounded-[16rpx] bg-white p-4">
          <Text className="text-[22rpx] text-[#666]">当前宠物</Text>
          <Text className="text-[28rpx] font-semibold mt-2 block">
            {currentPet?.name || '未选择宠物'}
          </Text>
          <Text className="text-[22rpx] text-[#888] mt-2 block">
            提醒会只归属到这只宠物的日程、报告和时间线中。
          </Text>
        </View>

        {!pets.length ? (
          <View className="mb-5 border-[3rpx] border-black border-solid rounded-[16rpx] bg-white p-4">
            <Text className="text-[26rpx] font-semibold block">先添加宠物档案</Text>
            <Text className="text-[22rpx] text-[#666] mt-2 block">
              提醒必须挂在具体宠物下面，创建后才会进入它自己的日程和统计。
            </Text>
            <View
              className="mt-3 inline-flex px-4 py-2 rounded-[999rpx] bg-[#FFD93B] border-[2rpx] border-solid border-[#262626]"
              onClick={() => Taro.navigateTo({ url: '/pages/EditPetProfile/index' })}
            >
              <Text className="text-[24rpx] font-semibold">去添加宠物</Text>
            </View>
          </View>
        ) : null}

        {pets.length > 0 && !currentPet ? (
          <View className="mb-5 border-[3rpx] border-black border-solid rounded-[16rpx] bg-white p-4">
            <Text className="text-[26rpx] font-semibold block">没有找到对应宠物</Text>
            <Text className="text-[22rpx] text-[#666] mt-2 block">
              这个提醒入口没有绑定到有效宠物，请先重新选择一只宠物再继续。
            </Text>
            <View className="flex flex-wrap gap-2 mt-4">
              {pets.map((pet) => (
                <View
                  key={pet.id}
                  className="px-4 py-2 rounded-[999rpx] bg-[#FFD93B] border-[2rpx] border-solid border-[#262626]"
                  onClick={() => {
                    setSelectedPetId(pet.id);
                    setStoredActivePetId(pet.id);
                  }}
                >
                  <Text className="text-[24rpx] font-semibold">改为 {pet.name}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        <View className="mb-5 border-[3rpx] border-black border-solid rounded-[16rpx] bg-[#f4f4f4] p-4">
          <Text className="text-[22rpx] text-[#666]">提醒内容</Text>
          <Input
            className="h-[72rpx] text-[28rpx] mt-2"
            placeholder="例如：给火火喂药"
            value={title}
            onInput={(event) => setTitle(event.detail.value)}
          />
        </View>

        <Picker
          mode="selector"
          range={typeOptions.map((item) => item.label)}
          value={typeIndex}
          onChange={(event) => setTypeIndex(Number(event.detail.value))}
        >
          <View className="mb-5 border-[3rpx] border-black border-solid rounded-[16rpx] bg-[#f4f4f4] p-4 flex justify-between items-center">
            <Text className="text-[24rpx] text-[#666]">类型</Text>
            <Text className="text-[26rpx]">{typeOptions[typeIndex].label}</Text>
          </View>
        </Picker>

        <View className="mb-5 border-[3rpx] border-black border-solid rounded-[16rpx] bg-[#f4f4f4] p-4">
          <Text className="text-[22rpx] text-[#666]">日期</Text>
          <Input
            className="h-[72rpx] text-[28rpx] mt-2"
            value={date}
            onInput={(event) => setDate(event.detail.value)}
            placeholder="YYYY-MM-DD"
          />
        </View>

        <View className="mb-5 border-[3rpx] border-black border-solid rounded-[16rpx] bg-[#f4f4f4] p-4">
          <Text className="text-[22rpx] text-[#666]">时间</Text>
          <Input
            className="h-[72rpx] text-[28rpx] mt-2"
            value={time}
            onInput={(event) => setTime(event.detail.value)}
            placeholder="HH:mm"
          />
        </View>

        <View className="mb-10 border-[3rpx] border-black border-solid rounded-[16rpx] bg-[#f4f4f4] p-4">
          <Text className="text-[22rpx] text-[#666]">重复</Text>
          <Input
            className="h-[72rpx] text-[28rpx] mt-2"
            value={repeat}
            onInput={(event) => setRepeat(event.detail.value)}
            placeholder="每天 / 每周一"
          />
        </View>

        <View
          className="w-full h-[96rpx] border-[3rpx] border-black border-solid rounded-[50rpx] flex items-center justify-center"
          style={{ backgroundColor: canSave ? '#FFD93B' : '#E5E5E5', opacity: canSave ? 1 : 0.7 }}
          onClick={() => {
            if (!canSave) {
              Taro.showToast({ title: '请先选择有效宠物', icon: 'none' });
              return;
            }
            handleSave();
          }}
        >
          <Text className="text-[32rpx] font-bold">
            {saving ? '保存中...' : pageMode === 'edit' ? '保存修改' : '保存提醒'}
          </Text>
        </View>
      </View>
    </BasicLayout>
  );
});

export default AddPetReminder;
