import BasicLayout from '@/layout/basicLayout';
import { View, Text } from '@tarojs/components';
import Taro, { useDidShow, useRouter } from '@tarojs/taro';
import { memo, useEffect, useMemo, useState } from 'react';
import { PET_UI } from '@/constants/petUi';
import { usePetApiPets } from '@/hooks/usePetApiPets';
import { formatLocalDateKey } from '@/utils/formatDate';
import {
  getPetTimelineData,
} from '@/api/data';
import { setStoredActivePetId } from '@/utils/activePetState';
import { ensureLoggedIn, isLoggedIn } from '@/utils/authState';

type TimelineItem = {
  id: string;
  petId: string;
  date: string;
  time: string;
  title: string;
  desc: string;
  tag: string;
  bg: string;
  createdAt: number;
};

const colorMap: Record<string, string> = {
  提醒: '#FFF4C2',
  已完成: '#F2F2F2',
  日常: '#EEF8FF',
  花销: '#FFF7E5',
  护理: '#F7F0FF',
  食物: '#FFF8E6',
  用药: '#F2EAFF',
  里程碑: '#FFF0F6',
};

const PetTimeline = memo(function PetTimeline() {
  const { params } = useRouter();
  const initialPetId = params.petId || '';
  const { pets, activePet, activePetId, setActivePetId } = usePetApiPets(initialPetId);
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(false);
  const loggedIn = isLoggedIn();

  const currentPetId = initialPetId || activePetId;
  const today = formatLocalDateKey(new Date());

  useEffect(() => {
    if (currentPetId) {
      setStoredActivePetId(currentPetId);
    }
  }, [currentPetId]);

  useDidShow(() => {
    if (!loggedIn) {
      setTimeline([]);
      setLoading(false);
      return;
    }

    if (!currentPetId) {
      setTimeline([]);
      return;
    }

    setLoading(true);
    getPetTimelineData(currentPetId)
      .then((data) => {
        const merged = data.timeline.map((item) => {
          const target = new Date(item.occurredAt);
          const date = Number.isNaN(target.getTime())
            ? ''
            : `${target.getFullYear()}-${`${target.getMonth() + 1}`.padStart(2, '0')}-${`${target.getDate()}`.padStart(2, '0')}`;
          const time = Number.isNaN(target.getTime())
            ? ''
            : `${`${target.getHours()}`.padStart(2, '0')}:${`${target.getMinutes()}`.padStart(2, '0')}`;
          return {
            id: item.id,
            petId: item.petId,
            date,
            time,
            title: item.title,
            desc: item.description,
            tag: item.tag,
            bg: colorMap[item.tag] || '#F8F8F8',
            createdAt: target.getTime(),
          };
        });
        setTimeline(merged.filter((item) => item.date));
      })
      .catch(() => setTimeline([]))
      .finally(() => setLoading(false));
  });

  const groupedTimeline = useMemo(() => {
    const groups = timeline.reduce<Array<{ date: string; items: TimelineItem[] }>>((acc, item) => {
      const group = acc.find((entry) => entry.date === item.date);
      if (group) {
        group.items.push(item);
      } else {
        acc.push({ date: item.date, items: [item] });
      }
      return acc;
    }, []);
    return groups
      .map((group) => ({
        ...group,
        items: [...group.items].sort((a, b) => b.createdAt - a.createdAt),
      }))
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [timeline]);

  return (
    <BasicLayout
      wrapClassName="w-full h-full"
      wrapStyle={{
        backgroundImage: PET_UI.pageBackground,
        minHeight: '100vh',
      }}
      navOptions={{ navTitle: '成长时光轴', needBack: true }}
    >
      <View className="px-6 pt-4 pb-[110rpx]">
        <View className="mb-4 flex gap-2 flex-wrap">
          {pets.map((pet) => (
            <View
              key={pet.id}
              className="px-4 py-2 rounded-[16rpx]"
              style={{
                backgroundColor: currentPetId === pet.id ? '#FFD93B' : '#f4f4f4',
                border: '2rpx solid #262626',
              }}
              onClick={() => {
                setActivePetId(pet.id);
                setStoredActivePetId(pet.id);
                Taro.redirectTo({ url: `/pages/PetTimeline/index?petId=${pet.id}` });
              }}
            >
              <Text className="text-[24rpx]">{pet.name}</Text>
            </View>
          ))}
        </View>

        <View className="rounded-[24rpx] bg-white p-5 mb-5 shadow-[0_14rpx_28rpx_rgba(0,0,0,0.06)]">
          <Text className="text-[30rpx] font-semibold text-[#2c2c2c] block">把照护记录串成时间线</Text>
          <Text className="text-[22rpx] text-[#666] mt-[8rpx] block">
            这里会把提醒、日常、花销、护理、食物、用药和里程碑按时间汇总，方便回看宠物的成长轨迹。
          </Text>
          <Text className="text-[22rpx] text-[#8a8a8a] mt-[10rpx] block">
            {loading ? '正在整理时间线...' : `当前共整理 ${timeline.length} 条时间节点`}
          </Text>
        </View>

        {currentPetId && activePet ? (
          <View className="rounded-[24rpx] bg-[#F6F9FF] p-5 mb-5 shadow-[0_14rpx_28rpx_rgba(0,0,0,0.05)]">
            <Text className="text-[28rpx] font-semibold text-[#2c2c2c] block">
              围绕{activePet.name}继续补全时间线
            </Text>
            <Text className="text-[22rpx] text-[#64748b] mt-[8rpx] block">
              时间线会持续聚合提醒、日常、花销、护理、用药和成长节点，看完后可以直接回到当前宠物的下一步动作里。
            </Text>
            <View className="grid grid-cols-3 gap-3 mt-4">
              <View
                className="rounded-[18rpx] bg-[#FFF9E8] p-4"
                onClick={() =>
                  Taro.navigateTo({
                    url: `/pages/AddPetReminder/index?petId=${currentPetId}&date=${today}`,
                  })
                }
              >
                <Text className="text-[24rpx] font-semibold text-[#5D4510]">新增提醒</Text>
                <Text className="text-[20rpx] text-[#7D6532] mt-[6rpx] block">补一条今天的安排</Text>
              </View>
              <View
                className="rounded-[18rpx] bg-[#EEF8FF] p-4"
                onClick={() =>
                  Taro.navigateTo({
                    url: `/pages/AddPetRecord/index?petId=${currentPetId}&date=${today}&mode=record`,
                  })
                }
              >
                <Text className="text-[24rpx] font-semibold text-[#2c5f7a]">新增记录</Text>
                <Text className="text-[20rpx] text-[#5E7680] mt-[6rpx] block">继续补日常或花销</Text>
              </View>
              <View
                className="rounded-[18rpx] bg-white p-4 border-[2rpx] border-solid border-[#D8E6FF]"
                onClick={() => Taro.navigateTo({ url: `/pages/PetReport/index?petId=${currentPetId}` })}
              >
                <Text className="text-[24rpx] font-semibold text-[#466481]">查看报告</Text>
                <Text className="text-[20rpx] text-[#6D8092] mt-[6rpx] block">看看整体汇总</Text>
              </View>
            </View>
          </View>
        ) : null}

        {!loggedIn ? (
          <View className="rounded-[24rpx] bg-white p-5 shadow-[0_14rpx_28rpx_rgba(0,0,0,0.06)]">
            <Text className="text-[28rpx] font-semibold text-[#2c2c2c] block">登录后查看完整成长时光轴</Text>
            <Text className="text-[22rpx] text-[#666] mt-[8rpx] block leading-[1.7]">
              你的提醒、护理、食物、用药、日常记录和成长里程碑会统一串成时间线，方便回看整个照护过程。
            </Text>
            <View
              className="mt-[20rpx] inline-flex px-[24rpx] py-[14rpx] rounded-[999rpx] bg-[#FFD93B]"
              style={{ border: '2rpx solid #262626' }}
              onClick={() =>
                ensureLoggedIn(`/pages/PetTimeline/index${currentPetId ? `?petId=${currentPetId}` : ''}`)
              }
            >
              <Text className="text-[24rpx] text-[#2c2c2c]">去微信登录</Text>
            </View>
          </View>
        ) : !pets.length ? (
          <View className="rounded-[24rpx] bg-white p-5 shadow-[0_14rpx_28rpx_rgba(0,0,0,0.06)]">
            <Text className="text-[28rpx] font-semibold text-[#2c2c2c] block">先创建宠物档案</Text>
            <Text className="text-[22rpx] text-[#666] mt-[8rpx] block leading-[1.7]">
              有了宠物档案后，后面的提醒、护理和记录才会自动汇进时间线里。
            </Text>
            <View
              className="mt-[20rpx] inline-flex px-[24rpx] py-[14rpx] rounded-[999rpx] bg-[#FFD93B]"
              style={{ border: '2rpx solid #262626' }}
              onClick={() => Taro.navigateTo({ url: '/pages/EditPetProfile/index' })}
            >
              <Text className="text-[24rpx] text-[#2c2c2c]">去添加宠物</Text>
            </View>
          </View>
        ) : groupedTimeline.length ? (
          groupedTimeline.map((group) => (
            <View key={group.date} className="mb-5">
              <View className="flex items-center mb-3">
                <View className="w-[18rpx] h-[18rpx] rounded-full bg-[#2B8BFF] mr-[10rpx]" />
                <Text className="text-[26rpx] font-semibold text-[#2c2c2c]">{group.date}</Text>
              </View>
              <View className="pl-[18rpx] ml-[8rpx] border-l-[3rpx] border-[#D8E6FF] border-solid">
                {group.items.map((item) => (
                  <View
                    key={item.id}
                    className="rounded-[20rpx] p-4 mb-3 shadow-[0_12rpx_22rpx_rgba(0,0,0,0.05)]"
                    style={{ backgroundColor: item.bg }}
                  >
                    <View className="flex items-center justify-between mb-[8rpx]">
                      <Text className="text-[28rpx] font-semibold text-[#2c2c2c]">{item.title}</Text>
                      <View className="px-[12rpx] py-[6rpx] rounded-[999rpx] bg-white/80">
                        <Text className="text-[20rpx] text-[#555]">{item.tag}</Text>
                      </View>
                    </View>
                    <Text className="text-[22rpx] text-[#555] leading-[1.7]">{item.desc}</Text>
                    <Text className="text-[20rpx] text-[#8a8a8a] mt-[10rpx] block">
                      {item.time || '00:00'}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          ))
        ) : (
          <View className="rounded-[24rpx] bg-white p-5 shadow-[0_14rpx_28rpx_rgba(0,0,0,0.06)]">
            <Text className="text-[24rpx] text-[#8a8a8a]">
              {activePet?.name || '这个宠物'}还没有足够的时间线数据，先去添加提醒、记录、花销、食物、护理或成长里程碑吧。
            </Text>
            {currentPetId ? (
              <View className="grid grid-cols-2 gap-3 mt-4">
                <View
                  className="rounded-[18rpx] bg-[#FFF9E8] p-4"
                  onClick={() =>
                    Taro.navigateTo({
                      url: `/pages/AddPetReminder/index?petId=${currentPetId}&date=${today}`,
                    })
                  }
                >
                  <Text className="text-[24rpx] font-semibold text-[#5D4510]">新增提醒</Text>
                  <Text className="text-[20rpx] text-[#7D6532] mt-[6rpx] block">
                    从喂食、护理或复查安排开始
                  </Text>
                </View>
                <View
                  className="rounded-[18rpx] bg-[#EEF8FF] p-4"
                  onClick={() =>
                    Taro.navigateTo({
                      url: `/pages/AddPetRecord/index?petId=${currentPetId}&date=${today}&mode=record`,
                    })
                  }
                >
                  <Text className="text-[24rpx] font-semibold text-[#2c5f7a]">新增记录</Text>
                  <Text className="text-[20rpx] text-[#5E7680] mt-[6rpx] block">
                    先补一条日常、花销或护理记录
                  </Text>
                </View>
                <View
                  className="rounded-[18rpx] bg-[#FFF0F6] p-4 col-span-2"
                  onClick={() => Taro.navigateTo({ url: `/pages/PetMilestones/index?petId=${currentPetId}` })}
                >
                  <Text className="text-[24rpx] font-semibold text-[#8A5374]">记录成长里程碑</Text>
                  <Text className="text-[20rpx] text-[#7B6070] mt-[6rpx] block">
                    第一次到家、第一次出门、疫苗完成都可以成为时间线起点
                  </Text>
                </View>
              </View>
            ) : null}
          </View>
        )}
      </View>
    </BasicLayout>
  );
});

export default PetTimeline;
