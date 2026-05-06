import BasicLayout from '@/layout/basicLayout';
import { View, Text } from '@tarojs/components';
import Taro, { useDidShow, useRouter } from '@tarojs/taro';
import { memo, useEffect, useMemo, useState } from 'react';
import { PET_UI } from '@/constants/petUi';
import { usePetApiPets } from '@/hooks/usePetApiPets';
import { formatLocalDateKey } from '@/utils/formatDate';
import { getPetTimelineData } from '@/api/data';
import { setStoredActivePetId } from '@/utils/activePetState';
import { ensureLoggedIn, isLoggedIn } from '@/utils/authState';

type TimelineSourceType =
  | 'schedule'
  | 'record'
  | 'expense'
  | 'care'
  | 'food'
  | 'medicine'
  | 'milestone';

type TimelineItem = {
  id: string;
  petId: string;
  date: string;
  time: string;
  title: string;
  desc: string;
  tag: string;
  sourceType: TimelineSourceType;
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

const filterOptions: Array<{ key: 'all' | TimelineSourceType; label: string }> = [
  { key: 'all', label: '全部' },
  { key: 'schedule', label: '提醒' },
  { key: 'record', label: '日常' },
  { key: 'expense', label: '花销' },
  { key: 'care', label: '护理' },
  { key: 'food', label: '食物' },
  { key: 'medicine', label: '用药' },
  { key: 'milestone', label: '里程碑' },
];

const sourceActionMap: Record<TimelineSourceType, { title: string; url: (petId: string, date: string) => string }> = {
  schedule: {
    title: '补提醒',
    url: (petId, date) => `/pages/AddPetReminder/index?petId=${petId}&date=${date}`,
  },
  record: {
    title: '补记录',
    url: (petId, date) => `/pages/AddPetRecord/index?petId=${petId}&date=${date}&mode=record`,
  },
  expense: {
    title: '补花销',
    url: (petId, date) => `/pages/AddPetRecord/index?petId=${petId}&date=${date}&mode=expense`,
  },
  care: {
    title: '补护理',
    url: (petId, date) => `/pages/AddPetRecord/index?petId=${petId}&date=${date}&mode=care`,
  },
  food: {
    title: '管食物',
    url: (petId) => `/pages/PetFood/index?petId=${petId}`,
  },
  medicine: {
    title: '管用药',
    url: (petId) => `/pages/PetMedicine/index?petId=${petId}`,
  },
  milestone: {
    title: '记里程碑',
    url: (petId) => `/pages/PetMilestones/index?petId=${petId}`,
  },
};

const PetTimeline = memo(function PetTimeline() {
  const { params } = useRouter();
  const initialPetId = params.petId || '';
  const { pets, activePet, activePetId, setActivePetId } = usePetApiPets(initialPetId);
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | TimelineSourceType>('all');
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
            sourceType: item.sourceType as TimelineSourceType,
            bg: colorMap[item.tag] || '#F8F8F8',
            createdAt: target.getTime(),
          };
        });
        setTimeline(merged.filter((item) => item.date));
      })
      .catch(() => setTimeline([]))
      .finally(() => setLoading(false));
  });

  const summary = useMemo(() => {
    const sourceCount = timeline.reduce<Record<string, number>>((acc, item) => {
      acc[item.sourceType] = (acc[item.sourceType] || 0) + 1;
      return acc;
    }, {});

    return {
      total: timeline.length,
      schedule: sourceCount.schedule || 0,
      record: sourceCount.record || 0,
      expense: sourceCount.expense || 0,
      care: sourceCount.care || 0,
      food: sourceCount.food || 0,
      medicine: sourceCount.medicine || 0,
      milestone: sourceCount.milestone || 0,
    };
  }, [timeline]);

  const filteredTimeline = useMemo(() => {
    if (activeFilter === 'all') {
      return timeline;
    }
    return timeline.filter((item) => item.sourceType === activeFilter);
  }, [activeFilter, timeline]);

  const groupedTimeline = useMemo(() => {
    const groups = filteredTimeline.reduce<Array<{ date: string; items: TimelineItem[] }>>((acc, item) => {
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
  }, [filteredTimeline]);

  const actionItems = currentPetId
    ? [
        {
          title: '新增提醒',
          desc: '补一条今天的安排',
          color: '#FFF9E8',
          textColor: '#5D4510',
          url: `/pages/AddPetReminder/index?petId=${currentPetId}&date=${today}`,
        },
        {
          title: '新增记录',
          desc: '继续补日常或花销',
          color: '#EEF8FF',
          textColor: '#2C5F7A',
          url: `/pages/AddPetRecord/index?petId=${currentPetId}&date=${today}&mode=record`,
        },
        {
          title: '查看报告',
          desc: '看看整体汇总',
          color: '#FFFFFF',
          textColor: '#466481',
          border: '#D8E6FF',
          url: `/pages/PetReport/index?petId=${currentPetId}`,
        },
      ]
    : [];

  return (
    <BasicLayout
      wrapClassName="w-full h-full"
      wrapStyle={{
        backgroundImage: PET_UI.pageBackground,
        minHeight: '100vh',
      }}
      navOptions={{ navTitle: '成长时间线', needBack: true }}
    >
      <View className="px-6 pt-4 pb-[110rpx]">
        <View className="mb-4 flex gap-2 flex-wrap">
          {pets.map((pet) => (
            <View
              key={pet.id}
              className="px-[22rpx] py-[12rpx] rounded-[16rpx]"
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
          <Text className="text-[22rpx] text-[#666] mt-[8rpx] block leading-[1.7]">
            这里会把提醒、日常、花销、护理、食物、用药和里程碑按时间汇总，方便回看宠物的成长轨迹。
          </Text>
          <Text className="text-[22rpx] text-[#8a8a8a] mt-[10rpx] block">
            {loading ? '正在整理时间线...' : `当前共整理 ${summary.total} 条时间节点`}
          </Text>
        </View>

        {currentPetId && activePet ? (
          <View className="rounded-[24rpx] bg-[#F6F9FF] p-5 mb-5 shadow-[0_14rpx_28rpx_rgba(0,0,0,0.05)]">
            <Text className="text-[28rpx] font-semibold text-[#2c2c2c] block">
              围绕 {activePet.name} 继续补全时间线
            </Text>
            <Text className="text-[22rpx] text-[#64748b] mt-[8rpx] block leading-[1.6]">
              时间线会持续聚合提醒、日常、花销、护理、食物、用药和成长节点，看完后可以直接回到当前宠物的下一步动作里。
            </Text>
            <View className="grid grid-cols-3 gap-3 mt-4">
              {actionItems.map((item) => (
                <View
                  key={item.title}
                  className="rounded-[18rpx] p-4"
                  style={{
                    backgroundColor: item.color,
                    border: item.border ? `2rpx solid ${item.border}` : undefined,
                  }}
                  onClick={() => Taro.navigateTo({ url: item.url })}
                >
                  <Text className="text-[24rpx] font-semibold" style={{ color: item.textColor }}>
                    {item.title}
                  </Text>
                  <Text className="text-[20rpx] mt-[6rpx] block" style={{ color: item.textColor, opacity: 0.82 }}>
                    {item.desc}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        <View className="grid grid-cols-4 gap-3 mb-5">
          <View className="rounded-[18rpx] bg-white p-4 shadow-[0_12rpx_22rpx_rgba(0,0,0,0.05)]">
            <Text className="text-[20rpx] text-[#777]">提醒</Text>
            <Text className="text-[30rpx] font-semibold text-[#2c2c2c] mt-[6rpx] block">{summary.schedule}</Text>
          </View>
          <View className="rounded-[18rpx] bg-white p-4 shadow-[0_12rpx_22rpx_rgba(0,0,0,0.05)]">
            <Text className="text-[20rpx] text-[#777]">记录</Text>
            <Text className="text-[30rpx] font-semibold text-[#2c2c2c] mt-[6rpx] block">{summary.record}</Text>
          </View>
          <View className="rounded-[18rpx] bg-white p-4 shadow-[0_12rpx_22rpx_rgba(0,0,0,0.05)]">
            <Text className="text-[20rpx] text-[#777]">花销</Text>
            <Text className="text-[30rpx] font-semibold text-[#2c2c2c] mt-[6rpx] block">{summary.expense}</Text>
          </View>
          <View className="rounded-[18rpx] bg-white p-4 shadow-[0_12rpx_22rpx_rgba(0,0,0,0.05)]">
            <Text className="text-[20rpx] text-[#777]">护理</Text>
            <Text className="text-[30rpx] font-semibold text-[#2c2c2c] mt-[6rpx] block">{summary.care}</Text>
          </View>
          <View className="rounded-[18rpx] bg-white p-4 shadow-[0_12rpx_22rpx_rgba(0,0,0,0.05)]">
            <Text className="text-[20rpx] text-[#777]">食物</Text>
            <Text className="text-[30rpx] font-semibold text-[#2c2c2c] mt-[6rpx] block">{summary.food}</Text>
          </View>
          <View className="rounded-[18rpx] bg-white p-4 shadow-[0_12rpx_22rpx_rgba(0,0,0,0.05)]">
            <Text className="text-[20rpx] text-[#777]">用药</Text>
            <Text className="text-[30rpx] font-semibold text-[#2c2c2c] mt-[6rpx] block">{summary.medicine}</Text>
          </View>
          <View className="rounded-[18rpx] bg-white p-4 shadow-[0_12rpx_22rpx_rgba(0,0,0,0.05)] col-span-2">
            <Text className="text-[20rpx] text-[#777]">里程碑</Text>
            <Text className="text-[30rpx] font-semibold text-[#2c2c2c] mt-[6rpx] block">{summary.milestone}</Text>
          </View>
        </View>

        <View className="flex flex-wrap gap-2 mb-5">
          {filterOptions.map((item) => (
            <View
              key={item.key}
              className="px-4 py-2 rounded-[16rpx]"
              style={{
                backgroundColor: activeFilter === item.key ? '#FFD93B' : '#f4f4f4',
                border: '2rpx solid #262626',
              }}
              onClick={() => setActiveFilter(item.key)}
            >
              <Text className="text-[22rpx]">{item.label}</Text>
            </View>
          ))}
        </View>

        {!loggedIn ? (
          <View className="rounded-[24rpx] bg-white p-5 shadow-[0_14rpx_28rpx_rgba(0,0,0,0.06)]">
            <Text className="text-[28rpx] font-semibold text-[#2c2c2c] block">登录后查看完整成长时间线</Text>
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
                    <View className="mt-[10rpx] flex items-center justify-between">
                      <Text className="text-[20rpx] text-[#8a8a8a]">{item.time || '00:00'}</Text>
                      {currentPetId ? (
                        <View
                          className="px-[12rpx] py-[6rpx] rounded-[999rpx] bg-white/75"
                          onClick={() =>
                            Taro.navigateTo({
                              url: sourceActionMap[item.sourceType].url(currentPetId, today),
                            })
                          }
                        >
                          <Text className="text-[20rpx] text-[#444]">
                            {sourceActionMap[item.sourceType].title}
                          </Text>
                        </View>
                      ) : null}
                    </View>
                  </View>
                ))}
              </View>
            </View>
          ))
        ) : (
          <View className="rounded-[24rpx] bg-white p-5 shadow-[0_14rpx_28rpx_rgba(0,0,0,0.06)]">
            <Text className="text-[24rpx] text-[#8a8a8a] leading-[1.7]">
              {activePet?.name || '这个宠物'}在当前筛选下还没有足够的时间线数据，先去补提醒、记录、花销、护理、食物、用药或里程碑吧。
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
