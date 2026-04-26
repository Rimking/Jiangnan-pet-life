import BasicLayout from '@/layout/basicLayout';
import { View, Text, Input, Textarea } from '@tarojs/components';
import { memo, useState } from 'react';
import Taro from '@tarojs/taro';
import { createScheduleData, toIsoDateTime } from '@/api/data';
import { usePetApiPets } from '@/hooks/usePetApiPets';
import { ensureLoggedIn, isLoggedIn } from '@/utils/authState';
import { formatLocalDateKey } from '@/utils/formatDate';

const isValidDateString = (value: string) => {
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

const isValidTimeString = (value: string) => /^([01]\d|2[0-3]):([0-5]\d)$/.test(value);

const SendPetSchedule = memo(function SendPetSchedule() {
  const { pets, activePet, activePetId, setActivePetId } = usePetApiPets();
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(() => formatLocalDateKey(new Date()));
  const [time, setTime] = useState('09:00');
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const loggedIn = isLoggedIn();

  const handleSubmit = async () => {
    if (!ensureLoggedIn('/pages/SendPetSchedule/index')) {
      return;
    }

    if (!activePetId) {
      Taro.showToast({ title: '请先添加宠物', icon: 'none' });
      return;
    }

    if (!title.trim()) {
      Taro.showToast({ title: '请先填写日程标题', icon: 'none' });
      return;
    }

    if (!isValidDateString(date.trim())) {
      Taro.showToast({ title: '日期格式不正确', icon: 'none' });
      return;
    }

    if (!isValidTimeString(time.trim())) {
      Taro.showToast({ title: '时间格式不正确', icon: 'none' });
      return;
    }

    setSaving(true);
    try {
      await createScheduleData({
        petId: activePetId,
        title: title.trim(),
        category: 'daily',
        type: '快捷提醒',
        status: 'pending',
        repeatRule: '单次',
        remindAt: toIsoDateTime(date.trim(), time.trim()),
        notes: content.trim() || undefined,
      });
      Taro.showToast({ title: '提醒已创建', icon: 'success' });
      setTitle('');
      setContent('');
      Taro.switchTab({ url: '/pages/PetSchedule/index' });
    } catch (error) {
      const message = error instanceof Error ? error.message : '创建失败';
      Taro.showToast({ title: message, icon: 'none' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <BasicLayout
      wrapClassName="w-full h-full"
      wrapStyle={{ background: 'linear-gradient(180deg, #FFE68D 0%, #FFFCE0 100%)', minHeight: '100vh' }}
      navOptions={{ navTitle: '快捷创建提醒', needBack: true }}
    >
      <View className="px-6 pt-4 pb-[120rpx]">
        {!loggedIn ? (
          <View className="mb-4 border-[2rpx] border-solid border-[#262626] rounded-[16rpx] bg-white p-4">
            <Text className="text-[26rpx] font-semibold text-[#303030] block">登录后快速创建提醒</Text>
            <Text className="text-[22rpx] text-[#666] mt-2 block">
              这里适合快速补一个喂食、复查或护理提醒，创建后会直接进入日程页。
            </Text>
            <View
              className="mt-3 inline-flex px-4 py-2 rounded-[999rpx] bg-[#FFD93B] border-[2rpx] border-solid border-[#262626]"
              onClick={() => ensureLoggedIn('/pages/SendPetSchedule/index')}
            >
              <Text className="text-[24rpx] font-semibold">去微信登录</Text>
            </View>
          </View>
        ) : null}

        {loggedIn && !pets.length ? (
          <View className="mb-4 border-[2rpx] border-solid border-[#262626] rounded-[16rpx] bg-white p-4">
            <Text className="text-[26rpx] font-semibold text-[#303030] block">先添加宠物档案</Text>
            <Text className="text-[22rpx] text-[#666] mt-2 block">
              有了宠物档案后，提醒才会正确归属到对应宠物的日程和统计里。
            </Text>
            <View
              className="mt-3 inline-flex px-4 py-2 rounded-[999rpx] bg-[#FFD93B] border-[2rpx] border-solid border-[#262626]"
              onClick={() => Taro.navigateTo({ url: '/pages/EditPetProfile/index' })}
            >
              <Text className="text-[24rpx] font-semibold">去添加宠物</Text>
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

        <View className="mb-4 border-[2rpx] border-solid border-[#262626] rounded-[16rpx] bg-white p-4">
          <Text className="text-[22rpx] text-[#666]">当前宠物</Text>
          <Text className="text-[26rpx] text-[#303030] mt-2 block">{activePet?.name || '暂无'}</Text>
        </View>

        <View className="mb-4 border-[2rpx] border-solid border-[#262626] rounded-[16rpx] bg-white p-4">
          <Text className="text-[22rpx] text-[#666]">日程标题</Text>
          <Input value={title} onInput={(e) => setTitle(e.detail.value)} placeholder="例如：给火火洗护" className="h-[64rpx] text-[26rpx] mt-2" />
        </View>

        <View className="mb-4 border-[2rpx] border-solid border-[#262626] rounded-[16rpx] bg-white p-4">
          <Text className="text-[22rpx] text-[#666]">日期</Text>
          <Input value={date} onInput={(e) => setDate(e.detail.value)} placeholder="YYYY-MM-DD" className="h-[64rpx] text-[26rpx] mt-2" />
        </View>

        <View className="mb-4 border-[2rpx] border-solid border-[#262626] rounded-[16rpx] bg-white p-4">
          <Text className="text-[22rpx] text-[#666]">时间</Text>
          <Input value={time} onInput={(e) => setTime(e.detail.value)} placeholder="HH:mm" className="h-[64rpx] text-[26rpx] mt-2" />
        </View>

        <View className="mb-6 border-[2rpx] border-solid border-[#262626] rounded-[16rpx] bg-white p-4">
          <Text className="text-[22rpx] text-[#666]">补充说明</Text>
          <Textarea value={content} onInput={(e) => setContent(e.detail.value)} placeholder="可填写事项说明、注意点" maxlength={200} className="h-[180rpx] text-[24rpx] mt-2" />
        </View>

        <View
          className="h-[92rpx] rounded-[48rpx] bg-[#FFD93B] border-[3rpx] border-solid border-[#262626] flex items-center justify-center"
          onClick={handleSubmit}
        >
          <Text className="text-[30rpx] font-bold">{saving ? '创建中...' : '创建提醒'}</Text>
        </View>
      </View>
    </BasicLayout>
  );
});

export default SendPetSchedule;


