import BasicLayout from '@/layout/basicLayout';
import { View, Text } from '@tarojs/components';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import Taro, { useDidShow, useRouter } from '@tarojs/taro';
import {
  deletePetData,
  getPetListData,
  getPetOverviewData,
  mapPetToProfileModel,
} from '@/api/data';
import { PetItem, PetOverviewData } from '@/api/data';
import { PetProfileModel } from '@/types/pet';
import { ensureLoggedIn } from '@/utils/authState';
import {
  clearStoredActivePetId,
  setStoredActivePetId,
  switchTabWithActivePet,
} from '@/utils/activePetState';
import { formatLocalDateKey } from '@/utils/formatDate';

type PetProfileExtras = {
  personality?: string;
  vaccineNotes?: string;
  medicalNotes?: string;
};

const PetDetailPage = memo(function PetDetailPage() {
  const { params } = useRouter();
  const petId = params.petId || '';
  const [pet, setPet] = useState<PetProfileModel | null>(null);
  const [rawPet, setRawPet] = useState<PetItem | null>(null);
  const [overview, setOverview] = useState<PetOverviewData | null>(null);
  const [reminderCount, setReminderCount] = useState(0);
  const [careCount, setCareCount] = useState(0);
  const [recordCount, setRecordCount] = useState(0);
  const [foodCount, setFoodCount] = useState(0);
  const [lowInventoryCount, setLowInventoryCount] = useState(0);
  const [medicineCount, setMedicineCount] = useState(0);
  const [dueMedicineCount, setDueMedicineCount] = useState(0);
  const [milestoneCount, setMilestoneCount] = useState(0);

  const refreshPetDetail = useCallback(() => {
    if (!petId) {
      setPet(null);
      setRawPet(null);
      setOverview(null);
      setReminderCount(0);
      setCareCount(0);
      setRecordCount(0);
      setFoodCount(0);
      setLowInventoryCount(0);
      setMedicineCount(0);
      setDueMedicineCount(0);
      setMilestoneCount(0);
      return Promise.resolve();
    }

    return getPetOverviewData(petId)
      .then((data) => {
        setOverview(data);
        setPet(mapPetToProfileModel(data.pet));
        setRawPet(data.pet);
        setReminderCount(data.stats.schedules);
        setCareCount(data.stats.careRecords);
        setRecordCount(data.stats.records);
        setFoodCount(data.stats.foods);
        setLowInventoryCount(data.stats.lowInventoryFoods);
        setMedicineCount(data.stats.medicines);
        setDueMedicineCount(data.stats.dueMedicines);
        setMilestoneCount(data.stats.milestones);
      })
      .catch(() => {
        setPet(null);
        setRawPet(null);
        setOverview(null);
        setReminderCount(0);
        setCareCount(0);
        setRecordCount(0);
        setFoodCount(0);
        setLowInventoryCount(0);
        setMedicineCount(0);
        setDueMedicineCount(0);
        setMilestoneCount(0);
      });
  }, [petId]);

  useEffect(() => {
    if (petId) {
      setStoredActivePetId(petId);
    }
    refreshPetDetail();
  }, [petId, refreshPetDetail]);

  useDidShow(() => {
    refreshPetDetail();
  });

  const handleDelete = async () => {
    if (!ensureLoggedIn(`/pages/PetDetailPage/index?petId=${petId}`)) {
      return;
    }

    if (!petId) {
      Taro.showToast({ title: '缺少宠物信息', icon: 'none' });
      return;
    }

    const result = await Taro.showModal({
      title: '确认删除',
      content: '删除后这只宠物的资料将无法恢复，确认继续吗？',
      confirmText: '删除',
      confirmColor: '#d65a31',
    });

    if (!result.confirm) {
      return;
    }

    try {
      await deletePetData(petId);
      Taro.showToast({ title: '宠物已删除', icon: 'success' });
      const petList = await getPetListData({});
      const nextPet = petList.find((item) => item.id !== petId);
      setTimeout(() => {
        if (nextPet?.id) {
          setStoredActivePetId(nextPet.id);
          Taro.redirectTo({ url: `/pages/PetDetailPage/index?petId=${nextPet.id}` });
          return;
        }

        clearStoredActivePetId();
        Taro.switchTab({ url: '/pages/PetProfile/index' });
      }, 300);
    } catch (error) {
      const message = error instanceof Error ? error.message : '删除失败';
      Taro.showToast({ title: message, icon: 'none' });
    }
  };

  const ageLabel = useMemo(() => {
    if (!pet?.birthday) {
      return '未知';
    }

    const birth = new Date(pet.birthday);
    if (Number.isNaN(birth.getTime())) {
      return '未知';
    }

    const now = new Date();
    const months =
      (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());

    if (months < 1) {
      return '1个月内';
    }

    if (months < 12) {
      return `${months}个月`;
    }

    const years = Math.floor(months / 12);
    const remainMonths = months % 12;
    return remainMonths ? `${years}岁${remainMonths}个月` : `${years}岁`;
  }, [pet?.birthday]);

  const extras = (rawPet?.profileExtras || {}) as PetProfileExtras;
  const vaccineText = careCount ? `已记录 ${careCount} 条护理或疫苗相关记录` : '暂未记录疫苗信息';
  const personalityText =
    extras.personality || rawPet?.notes || '暂未填写性格描述，可以在编辑页补充。';
  const vaccineDetailText = extras.vaccineNotes || vaccineText;
  const allergyText = rawPet?.allergies?.length
    ? rawPet.allergies.join('、')
    : '暂未填写过敏信息';
  const medicalNotesText = extras.medicalNotes || '暂未填写医疗补充信息';
  const sterilizedText = rawPet?.sterilized ? '已绝育' : '未绝育';
  const galleryBlocks = Array.from({ length: 4 });
  const totalExpenseLabel = overview
    ? `累计花销 ¥${Number(overview.stats.totalExpense || 0).toFixed(2)}`
    : '';
  const latestMilestone = overview?.recent.latestMilestones?.[0];
  const today = formatLocalDateKey(new Date());
  const upcomingSchedules = overview?.recent.upcomingSchedules || [];
  const latestExpenses = overview?.recent.latestExpenses || [];
  const latestCareRecords = overview?.recent.latestCareRecords || [];

  const detailQuickLinks = [
    {
      title: '日程安排',
      subtitle: '查看提醒和当天记录',
      bg: '#FFF4C2',
      accent: '#6A5B2A',
      onClick: () => switchTabWithActivePet('/pages/PetSchedule/index', petId),
    },
    {
      title: '花销统计',
      subtitle: '查看预算、分类和月度明细',
      bg: '#FFF8E6',
      accent: '#8C6C2D',
      onClick: () => Taro.navigateTo({ url: `/pages/PetExpenseStats/index?petId=${petId}` }),
    },
    {
      title: '成长时间线',
      subtitle: '回看记录、提醒和成长节点',
      bg: '#EEF8FF',
      accent: '#4B6A77',
      onClick: () => Taro.navigateTo({ url: `/pages/PetTimeline/index?petId=${petId}` }),
    },
    {
      title: '护理记录',
      subtitle: '查看护理历史和待跟进事项',
      bg: '#F7F0FF',
      accent: '#6A5B7D',
      onClick: () => Taro.navigateTo({ url: `/pages/PetCareStats/index?petId=${petId}` }),
    },
  ];

  return (
    <BasicLayout
      wrapClassName="w-full h-full"
      wrapStyle={{
        background: 'linear-gradient(180deg, #FFE68D 0%, #FFF5C8 42%, #FFFCEE 100%)',
        minHeight: '100vh',
      }}
      navOptions={{ navTitle: '宠物详情', needBack: true }}
    >
      <View className="px-6 pt-4 pb-[110rpx]">
        <View className="relative pt-[12rpx]">
          <View className="absolute left-[20rpx] right-[10rpx] top-0 h-full rounded-[34rpx] bg-[#F7E8A9] opacity-70" />
          <View className="relative bg-[#FFFDF6] rounded-[34rpx] px-[22rpx] py-[26rpx] shadow-[0_18rpx_40rpx_rgba(169,136,44,0.16)]">
            <View className="flex">
              <View className="w-[220rpx] h-[220rpx] rounded-[22rpx] bg-[#FFF5D8] flex items-center justify-center overflow-hidden shadow-[inset_0_0_0_2rpx_rgba(255,255,255,0.85)]">
                <View className="w-full h-full bg-[linear-gradient(135deg,#FFF3BF_0%,#FFE69A_100%)] flex items-center justify-center">
                  <Text className="text-[104rpx]">{pet?.avatarEmoji || '🐶'}</Text>
                </View>
              </View>

              <View className="flex-1 pl-[24rpx]">
                <Text className="text-[26rpx] text-[#2d2d2d] font-semibold mb-[16rpx]">
                  姓名：{pet?.name || '暂无'}
                </Text>
                <Text className="text-[26rpx] text-[#2d2d2d] font-semibold mb-[16rpx]">
                  年龄：{ageLabel}
                </Text>
                <Text className="text-[26rpx] text-[#2d2d2d] font-semibold mb-[16rpx]">
                  体重：{pet?.weightKg || 0}kg
                </Text>
                <Text className="text-[26rpx] text-[#2d2d2d] font-semibold mb-[16rpx]">
                  性别：{pet?.gender === 'female' ? '女生' : '男生'}
                </Text>
                <Text className="text-[26rpx] text-[#2d2d2d] font-semibold">
                  品种：{pet?.species || '未设置'}
                </Text>
              </View>
            </View>

            <View className="mt-[22rpx] py-[18rpx] border-t-[2rpx] border-[#F0E3B5] border-solid">
              <Text className="text-[26rpx] font-semibold text-[#222]">是否绝育：{sterilizedText}</Text>
            </View>

            <View className="py-[18rpx] border-t-[2rpx] border-[#F0E3B5] border-solid">
              <Text className="text-[26rpx] font-semibold text-[#222] mb-[8rpx]">疫苗记录</Text>
              <Text className="text-[24rpx] leading-[1.7] text-[#444]">{vaccineDetailText}</Text>
            </View>

            <View className="py-[18rpx] border-t-[2rpx] border-[#F0E3B5] border-solid">
              <Text className="text-[26rpx] font-semibold text-[#222] mb-[8rpx]">性格描述</Text>
              <Text className="text-[24rpx] leading-[1.7] text-[#444]">{personalityText}</Text>
            </View>

            <View className="py-[18rpx] border-t-[2rpx] border-[#F0E3B5] border-solid">
              <Text className="text-[26rpx] font-semibold text-[#222] mb-[8rpx]">过敏信息</Text>
              <Text className="text-[24rpx] leading-[1.7] text-[#444]">{allergyText}</Text>
            </View>

            <View className="py-[18rpx] border-t-[2rpx] border-[#F0E3B5] border-solid">
              <Text className="text-[26rpx] font-semibold text-[#222] mb-[8rpx]">医疗补充</Text>
              <Text className="text-[24rpx] leading-[1.7] text-[#444]">{medicalNotesText}</Text>
            </View>

            <View className="py-[18rpx] border-t-[2rpx] border-[#F0E3B5] border-solid">
              <Text className="text-[26rpx] font-semibold text-[#222] mb-[16rpx]">日常照片</Text>
              <View className="rounded-[24rpx] bg-[#FFF8D9] p-[16rpx] shadow-[inset_0_0_0_2rpx_rgba(244,230,176,0.9)]">
                <View className="flex mb-[10rpx]">
                  <View className="w-[48%] h-[240rpx] rounded-[16rpx] bg-[linear-gradient(135deg,#FFF2C5_0%,#FFE39B_100%)] flex items-center justify-center mr-[12rpx] shadow-[inset_0_0_0_2rpx_rgba(255,255,255,0.72)]">
                    <Text className="text-[54rpx]">{pet?.avatarEmoji || '📷'}</Text>
                  </View>
                  <View className="flex-1 flex flex-wrap justify-between content-between">
                    {galleryBlocks.map((_, index) => (
                      <View
                        key={index}
                        className="w-[48%] h-[114rpx] rounded-[14rpx] border-[2rpx] border-dashed border-[#D9C77A] bg-white/70 flex items-center justify-center"
                      >
                        <Text className="text-[22rpx] text-[#8C7A45]">预留位</Text>
                      </View>
                    ))}
                  </View>
                </View>
                <Text className="text-[21rpx] text-[#7A6A3D]">
                  图片上传功能后续接入，这里先保留展示区域，方便演示资料页结构。
                </Text>
              </View>
            </View>

            <View className="py-[18rpx] border-t-[2rpx] border-[#F0E3B5] border-solid">
              <Text className="text-[26rpx] font-semibold text-[#222] mb-[10rpx]">记录总览</Text>
              <View className="grid grid-cols-3 gap-[12rpx]">
                <View
                  className="rounded-[18rpx] bg-[#FFF4C2] p-[14rpx] shadow-[inset_0_0_0_2rpx_rgba(255,255,255,0.72)]"
                  onClick={() => switchTabWithActivePet('/pages/PetSchedule/index', petId)}
                >
                  <Text className="text-[20rpx] text-[#6A5B2A]">提醒</Text>
                  <Text className="text-[34rpx] font-bold text-[#222]">{reminderCount}</Text>
                  <Text className="text-[18rpx] text-[#7A6A3D] mt-[8rpx] block">去处理</Text>
                </View>
                <View
                  className="rounded-[18rpx] bg-[#EEF8FF] p-[14rpx] shadow-[inset_0_0_0_2rpx_rgba(255,255,255,0.72)]"
                  onClick={() => Taro.navigateTo({ url: `/pages/PetTimeline/index?petId=${petId}` })}
                >
                  <Text className="text-[20rpx] text-[#4B6A77]">日常</Text>
                  <Text className="text-[34rpx] font-bold text-[#222]">{recordCount}</Text>
                  <Text className="text-[18rpx] text-[#5E7680] mt-[8rpx] block">看时间线</Text>
                </View>
                <View
                  className="rounded-[18rpx] bg-[#F7F0FF] p-[14rpx] shadow-[inset_0_0_0_2rpx_rgba(255,255,255,0.72)]"
                  onClick={() => Taro.navigateTo({ url: `/pages/PetCareStats/index?petId=${petId}` })}
                >
                  <Text className="text-[20rpx] text-[#6A5B7D]">护理</Text>
                  <Text className="text-[34rpx] font-bold text-[#222]">{careCount}</Text>
                  <Text className="text-[18rpx] text-[#7A6A8B] mt-[8rpx] block">去查看</Text>
                </View>
              </View>

              <View className="grid grid-cols-2 gap-[12rpx] mt-[12rpx]">
                <View
                  className="rounded-[18rpx] bg-[#FFF8E6] p-[14rpx] shadow-[inset_0_0_0_2rpx_rgba(255,255,255,0.72)]"
                  onClick={() => Taro.navigateTo({ url: `/pages/PetFood/index?petId=${petId}` })}
                >
                  <Text className="text-[20rpx] text-[#8C6C2D]">食物档案</Text>
                  <Text className="text-[32rpx] font-bold text-[#222]">{foodCount}</Text>
                  <Text className="text-[20rpx] text-[#7A6A3D] mt-[4rpx]">
                    低库存提醒 {lowInventoryCount} 条
                  </Text>
                  <Text className="text-[18rpx] text-[#8C6C2D] mt-[8rpx] block">去管理</Text>
                </View>

                <View
                  className="rounded-[18rpx] bg-[#F6F0FF] p-[14rpx] shadow-[inset_0_0_0_2rpx_rgba(255,255,255,0.72)]"
                  onClick={() => Taro.navigateTo({ url: `/pages/PetMedicine/index?petId=${petId}` })}
                >
                  <Text className="text-[20rpx] text-[#6C5C90]">用药档案</Text>
                  <Text className="text-[32rpx] font-bold text-[#222]">{medicineCount}</Text>
                  <Text className="text-[20rpx] text-[#6C5C90] mt-[4rpx]">
                    临近结束 {dueMedicineCount} 条
                  </Text>
                  <Text className="text-[18rpx] text-[#6C5C90] mt-[8rpx] block">去跟进</Text>
                </View>

                <View className="rounded-[18rpx] bg-[#FFF0F6] p-[14rpx] shadow-[inset_0_0_0_2rpx_rgba(255,255,255,0.72)] col-span-2">
                  <View className="flex items-center justify-between">
                    <View>
                      <Text className="text-[20rpx] text-[#8A5374]">成长里程碑</Text>
                      <Text className="text-[32rpx] font-bold text-[#222]">{milestoneCount}</Text>
                    </View>
                    <View
                      className="px-[18rpx] py-[10rpx] rounded-[999rpx] bg-white/80"
                      onClick={() =>
                        Taro.navigateTo({ url: `/pages/PetMilestones/index?petId=${petId}` })
                      }
                    >
                      <Text className="text-[20rpx] text-[#8A5374]">去查看</Text>
                    </View>
                  </View>
                  <Text className="text-[20rpx] text-[#7B6070] mt-[8rpx] block">
                    {latestMilestone
                      ? `最近节点：${latestMilestone.title} · ${latestMilestone.occurredAt.slice(0, 10)}`
                      : '还没有成长节点，可以先记录第一次到家、第一次外出或疫苗完成等关键时刻。'}
                  </Text>
                </View>
              </View>

              {totalExpenseLabel ? (
                <Text
                  className="text-[21rpx] text-[#7A6A3D] mt-[12rpx] block"
                  onClick={() => Taro.navigateTo({ url: `/pages/PetExpenseStats/index?petId=${petId}` })}
                >
                  {totalExpenseLabel}，点击查看明细
                </Text>
              ) : null}
            </View>

            <View className="py-[18rpx] border-t-[2rpx] border-[#F0E3B5] border-solid">
              <Text className="text-[26rpx] font-semibold text-[#222] mb-[12rpx]">快捷入口</Text>
              <View className="grid grid-cols-2 gap-[12rpx]">
                {detailQuickLinks.map((item) => (
                  <View
                    key={item.title}
                    className="rounded-[18rpx] p-[14rpx] shadow-[inset_0_0_0_2rpx_rgba(255,255,255,0.72)]"
                    style={{ backgroundColor: item.bg }}
                    onClick={item.onClick}
                  >
                    <Text className="text-[22rpx] font-semibold text-[#222]">{item.title}</Text>
                    <Text className="text-[20rpx] text-[#666] mt-[6rpx] block">{item.subtitle}</Text>
                    <Text className="text-[18rpx] mt-[8rpx] block" style={{ color: item.accent }}>
                      立即前往
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            <View className="py-[18rpx] border-t-[2rpx] border-[#F0E3B5] border-solid">
              <Text className="text-[26rpx] font-semibold text-[#222] mb-[12rpx]">最近动态</Text>
              {upcomingSchedules.length || latestExpenses.length || latestCareRecords.length || latestMilestone ? (
                <View className="grid grid-cols-1 gap-[12rpx]">
                  {upcomingSchedules[0] ? (
                    <View
                      className="rounded-[18rpx] bg-[#FFF9E8] p-[14rpx]"
                      onClick={() => switchTabWithActivePet('/pages/PetSchedule/index', petId)}
                    >
                      <Text className="text-[20rpx] text-[#8C6C2D]">最近提醒</Text>
                      <Text className="text-[24rpx] font-semibold text-[#222] mt-[6rpx]">
                        {upcomingSchedules[0].title}
                      </Text>
                      <Text className="text-[20rpx] text-[#7A6A3D] mt-[6rpx] block">
                        {upcomingSchedules[0].remindAt.slice(0, 16).replace('T', ' ')}
                      </Text>
                    </View>
                  ) : null}

                  {latestExpenses[0] ? (
                    <View
                      className="rounded-[18rpx] bg-[#FFF8E6] p-[14rpx]"
                      onClick={() => Taro.navigateTo({ url: `/pages/PetExpenseStats/index?petId=${petId}` })}
                    >
                      <Text className="text-[20rpx] text-[#8C6C2D]">最近花销</Text>
                      <Text className="text-[24rpx] font-semibold text-[#222] mt-[6rpx]">
                        {latestExpenses[0].category} · ¥{Number(latestExpenses[0].amount || 0).toFixed(2)}
                      </Text>
                      <Text className="text-[20rpx] text-[#7A6A3D] mt-[6rpx] block">
                        {latestExpenses[0].spentAt.slice(0, 10)}
                      </Text>
                    </View>
                  ) : null}

                  {latestCareRecords[0] ? (
                    <View
                      className="rounded-[18rpx] bg-[#F7F0FF] p-[14rpx]"
                      onClick={() => Taro.navigateTo({ url: `/pages/PetCareStats/index?petId=${petId}` })}
                    >
                      <Text className="text-[20rpx] text-[#6A5B7D]">最近护理</Text>
                      <Text className="text-[24rpx] font-semibold text-[#222] mt-[6rpx]">
                        {latestCareRecords[0].category}
                        {latestCareRecords[0].result ? ` · ${latestCareRecords[0].result}` : ''}
                      </Text>
                      <Text className="text-[20rpx] text-[#7A6A8B] mt-[6rpx] block">
                        {latestCareRecords[0].occurredAt.slice(0, 10)}
                      </Text>
                    </View>
                  ) : null}
                </View>
              ) : (
                <View className="rounded-[18rpx] bg-[#FFFDF6] p-[14rpx]">
                  <Text className="text-[22rpx] text-[#7A6A3D] leading-[1.7]">
                    这只宠物最近的动态还比较少，可以先新增提醒、补一条记录，或者记录一个成长节点，详情页会更完整。
                  </Text>
                </View>
              )}
            </View>

            <View className="py-[18rpx] border-t-[2rpx] border-[#F0E3B5] border-solid">
              <Text className="text-[26rpx] font-semibold text-[#222] mb-[12rpx]">下一步建议</Text>
              <View className="grid grid-cols-3 gap-[12rpx]">
                <View
                  className="rounded-[18rpx] bg-[#EEF8FF] p-[14rpx]"
                  onClick={() => Taro.navigateTo({ url: `/pages/PetTimeline/index?petId=${petId}` })}
                >
                  <Text className="text-[22rpx] font-semibold text-[#2c5f7a]">时间线</Text>
                  <Text className="text-[18rpx] text-[#5E7680] mt-[6rpx] block">回看所有记录</Text>
                </View>
                <View
                  className="rounded-[18rpx] bg-[#FFF9E8] p-[14rpx]"
                  onClick={() => Taro.navigateTo({ url: `/pages/PetReport/index?petId=${petId}` })}
                >
                  <Text className="text-[22rpx] font-semibold text-[#5D4510]">数据报告</Text>
                  <Text className="text-[18rpx] text-[#7D6532] mt-[6rpx] block">查看当前总结</Text>
                </View>
                <View
                  className="rounded-[18rpx] bg-[#FFF0F6] p-[14rpx]"
                  onClick={() => Taro.navigateTo({ url: `/pages/PetMilestones/index?petId=${petId}` })}
                >
                  <Text className="text-[22rpx] font-semibold text-[#8A5374]">成长节点</Text>
                  <Text className="text-[18rpx] text-[#7B6070] mt-[6rpx] block">继续记录时刻</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View className="flex gap-3 mt-[20rpx]">
          <View
            className="flex-1 h-[86rpx] rounded-[43rpx] bg-[#2B8BFF] flex items-center justify-center shadow-[0_12rpx_24rpx_rgba(43,139,255,0.24)]"
            onClick={() => {
              if (!ensureLoggedIn(`/pages/PetDetailPage/index?petId=${petId}`)) {
                return;
              }
              Taro.navigateTo({ url: `/pages/AddPetReminder/index?petId=${petId}&date=${today}` });
            }}
          >
            <Text className="text-[28rpx] text-white font-semibold">新增提醒</Text>
          </View>

          <View
            className="flex-1 h-[86rpx] rounded-[43rpx] bg-[#FFB86B] flex items-center justify-center shadow-[0_12rpx_24rpx_rgba(255,184,107,0.24)]"
            onClick={() => {
              if (!ensureLoggedIn(`/pages/PetDetailPage/index?petId=${petId}`)) {
                return;
              }
              Taro.navigateTo({
                url: `/pages/AddPetRecord/index?petId=${petId}&date=${today}&mode=record`,
              });
            }}
          >
            <Text className="text-[28rpx] text-[#3b2a16] font-semibold">新增记录</Text>
          </View>
        </View>

        <View className="flex gap-3 mt-[20rpx]">
          <View
            className="flex-1 h-[86rpx] rounded-[43rpx] bg-[#FFD93B] flex items-center justify-center shadow-[0_12rpx_24rpx_rgba(234,188,47,0.28)]"
            onClick={() => {
              if (!ensureLoggedIn(`/pages/PetDetailPage/index?petId=${petId}`)) {
                return;
              }
              Taro.navigateTo({ url: `/pages/EditPetProfile/index?mode=edit&petId=${petId}` });
            }}
          >
            <Text className="text-[28rpx] font-semibold">编辑资料</Text>
          </View>

          <View
            className="flex-1 h-[86rpx] rounded-[43rpx] bg-white flex items-center justify-center shadow-[0_12rpx_24rpx_rgba(0,0,0,0.06)]"
            style={{ border: '2rpx solid #F0E3B5' }}
            onClick={handleDelete}
          >
            <Text className="text-[28rpx] text-[#666] font-semibold">删除宠物</Text>
          </View>
        </View>
      </View>
    </BasicLayout>
  );
});

export default PetDetailPage;
