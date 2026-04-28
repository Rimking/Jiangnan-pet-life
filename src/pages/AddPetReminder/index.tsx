import BasicLayout from '@/layout/basicLayout';
import { View, Text, Input, Picker } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import { memo, useMemo, useState } from 'react';
import { ReminderType } from '@/types/pet';
import { PET_UI } from '@/constants/petUi';
import { formatLocalDateKey } from '@/utils/formatDate';
import { createScheduleData, toIsoDateTime } from '@/api/data';
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
  const petId = params.petId || '';
  const { pets } = usePetApiPets(petId);

  const defaultDate = useMemo(() => {
    return params.date || formatLocalDateKey(new Date());
  }, [params.date]);
  const currentPet = pets.find((item) => item.id === petId) || null;

  const [title, setTitle] = useState('');
  const [date, setDate] = useState(defaultDate);
  const [time, setTime] = useState('08:00');
  const [repeat, setRepeat] = useState('每天');
  const [typeIndex, setTypeIndex] = useState(0);

  const handleSave = async () => {
    if (!ensureLoggedIn(`/pages/AddPetReminder/index?petId=${petId}&date=${date}`)) {
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

    if (!petId || !currentPet) {
      Taro.showToast({ title: '缺少宠物信息', icon: 'none' });
      return;
    }

    try {
      await createScheduleData({
        petId,
        title,
        category: typeOptions[typeIndex].value,
        type: typeOptions[typeIndex].label,
        repeatRule: repeat,
        remindAt: toIsoDateTime(date, time),
      });
      setStoredActivePetId(petId);
      Taro.showToast({ title: '提醒已保存', icon: 'success' });
      setTimeout(() => switchTabWithActivePet('/pages/PetSchedule/index', petId), 300);
    } catch (error) {
      const message = error instanceof Error ? error.message : '保存失败';
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
        navTitle: '添加提醒',
        needBack: true,
      }}
    >
      <View className="p-8 pb-[120rpx]">
        {pets.length ? (
          <View className="mb-5">
            <Text className="text-[22rpx] text-[#666] block mb-2">选择宠物</Text>
            <View className="flex flex-wrap gap-2">
              {pets.map((pet) => (
                <View
                  key={pet.id}
                  className="px-4 py-2 rounded-[16rpx] border-[2rpx] border-solid border-[#262626]"
                  style={{ backgroundColor: pet.id === petId ? '#FFD93B' : '#f4f4f4' }}
                  onClick={() => {
                    setStoredActivePetId(pet.id);
                    Taro.redirectTo({
                      url: `/pages/AddPetReminder/index?petId=${pet.id}&date=${date}`,
                    });
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
              这个提醒入口没有绑定到有效宠物，请先重新选择一只宠物再创建。
            </Text>
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
          className="w-full h-[96rpx] border-[3rpx] border-black border-solid bg-[#FFD93B] rounded-[50rpx] flex items-center justify-center"
          onClick={handleSave}
        >
          <Text className="text-[32rpx] font-bold">保存提醒</Text>
        </View>
      </View>
    </BasicLayout>
  );
});

export default AddPetReminder;
