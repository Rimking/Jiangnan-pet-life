import BasicLayout from '@/layout/basicLayout';
import { View, Text, Input, Textarea } from '@tarojs/components';
import { memo, useState } from 'react';
import Taro, { useRouter } from '@tarojs/taro';
import { createScheduleData, toIsoDateTime } from '@/api/data';
import { usePetApiPets } from '@/hooks/usePetApiPets';
import { setStoredActivePetId, switchTabWithActivePet } from '@/utils/activePetState';
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
  const { params } = useRouter();
  const preferredPetId = params.petId || '';
  const { pets, activePet, activePetId, setActivePetId } = usePetApiPets(preferredPetId);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(() => formatLocalDateKey(new Date()));
  const [time, setTime] = useState('09:00');
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const loggedIn = isLoggedIn();
  const hasActivePet = Boolean(activePetId && activePet);
  const nextScheduleActions = hasActivePet
    ? [
        {
          title: '看日程',
          subtitle: '创建后回到当前宠物日程确认待办',
          onClick: () => switchTabWithActivePet('/pages/PetSchedule/index', activePetId),
        },
        {
          title: '看报告',
          subtitle: '回到报告页查看提醒是否沉淀进摘要',
          onClick: () => Taro.navigateTo({ url: `/pages/PetReport/index?petId=${activePetId}` }),
        },
        {
          title: '补记录',
          subtitle: '继续补日常、花销或护理记录',
          onClick: () => Taro.navigateTo({ url: `/pages/AddPetRecord/index?petId=${activePetId}&mode=record` }),
        },
      ]
    : [];

  const handleSubmit = async () => {
    if (!ensureLoggedIn(`/pages/SendPetSchedule/index${activePetId ? `?petId=${activePetId}` : ''}`)) {
      return;
    }

    if (!activePetId || !activePet) {
      Taro.showToast({ title: '请先选择有效宠物', icon: 'none' });
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
      setStoredActivePetId(activePetId);
      Taro.showToast({ title: '提醒已创建', icon: 'success' });
      setTitle('');
      setContent('');
      switchTabWithActivePet('/pages/PetSchedule/index', activePetId);
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
              onClick={() =>
                ensureLoggedIn(`/pages/SendPetSchedule/index${activePetId ? `?petId=${activePetId}` : ''}`)
              }
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

        {loggedIn && pets.length > 0 && !hasActivePet ? (
          <View className="mb-4 border-[2rpx] border-solid border-[#262626] rounded-[16rpx] bg-white p-4">
            <Text className="text-[26rpx] font-semibold text-[#303030] block">先选择一只宠物</Text>
            <Text className="text-[22rpx] text-[#666] mt-2 block">
              快捷提醒必须归属到具体宠物。先选中宠物，再继续创建提醒。
            </Text>
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
              onClick={() => {
                setActivePetId(pet.id);
                setStoredActivePetId(pet.id);
                Taro.redirectTo({ url: `/pages/SendPetSchedule/index?petId=${pet.id}` });
              }}
            >
              <Text className="text-[24rpx]">{pet.name}</Text>
            </View>
          ))}
        </View>

        <View className="mb-4 border-[2rpx] border-solid border-[#262626] rounded-[16rpx] bg-white p-4">
          <Text className="text-[22rpx] text-[#666]">当前宠物</Text>
          <Text className="text-[26rpx] text-[#303030] mt-2 block">{activePet?.name || '暂无'}</Text>
          <Text className="text-[20rpx] text-[#7a7a7a] mt-2 block">
            创建成功后会直接回到这只宠物的日程页。
          </Text>
        </View>

        {hasActivePet ? (
          <View className="mb-4 border-[2rpx] border-solid border-[#262626] rounded-[16rpx] bg-[#FFF9E7] p-4">
            <Text className="text-[24rpx] font-semibold text-[#303030] block">快捷提醒后的下一步</Text>
            <Text className="text-[20rpx] text-[#666] mt-2 block">
              快捷提醒适合补一个当下要做的事情。创建完以后，最适合回日程确认待办，或者继续补记录和报告摘要。
            </Text>
            <View className="grid grid-cols-3 gap-[10rpx] mt-4">
              {nextScheduleActions.map((item) => (
                <View
                  key={item.title}
                  className="rounded-[14rpx] border border-[#d7d7d7] p-3 bg-white"
                  onClick={item.onClick}
                >
                  <Text className="text-[22rpx] font-semibold text-[#303030] block">{item.title}</Text>
                  <Text className="text-[18rpx] text-[#6f6f6f] mt-1 block">{item.subtitle}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}

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
          className="h-[92rpx] rounded-[48rpx] border-[3rpx] border-solid border-[#262626] flex items-center justify-center"
          style={{ backgroundColor: hasActivePet ? '#FFD93B' : '#E5E5E5', opacity: hasActivePet ? 1 : 0.7 }}
          onClick={() => {
            if (!hasActivePet) {
              Taro.showToast({ title: '请先选择宠物', icon: 'none' });
              return;
            }
            handleSubmit();
          }}
        >
          <Text className="text-[30rpx] font-bold">{saving ? '创建中...' : '创建提醒'}</Text>
        </View>
      </View>
    </BasicLayout>
  );
});

export default SendPetSchedule;
