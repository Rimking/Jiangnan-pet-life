import BasicLayout from '@/layout/basicLayout';
import { View, Text } from '@tarojs/components';
import { memo, useCallback, useEffect, useState } from 'react';
import Taro, { useDidShow, useRouter } from '@tarojs/taro';
import {
  PetItem,
  getCareRecordListData,
  deletePetData,
  getPetDetailData,
  getRecordListData,
  getScheduleListData,
  mapPetToProfileModel,
} from '@/api/data';
import { PetProfileModel } from '@/types/pet';

const PetDetailPage = memo(function PetDetailPage() {
  const { params } = useRouter();
  const petId = params.petId || '';
  const [pet, setPet] = useState<PetProfileModel | null>(null);
  const [rawPet, setRawPet] = useState<PetItem | null>(null);
  const [reminderCount, setReminderCount] = useState(0);
  const [careCount, setCareCount] = useState(0);
  const [recordCount, setRecordCount] = useState(0);

  const refreshPetDetail = useCallback(() => {
    if (!petId) {
      setPet(null);
      setRawPet(null);
      setReminderCount(0);
      setCareCount(0);
      setRecordCount(0);
      return Promise.resolve();
    }

    return Promise.all([
      getPetDetailData(petId),
      getScheduleListData({ petId }),
      getCareRecordListData({ petId }),
      getRecordListData({ petId }),
    ])
      .then(([petDetail, scheduleList, careList, recordList]) => {
        setPet(mapPetToProfileModel(petDetail));
        setRawPet(petDetail);
        setReminderCount(scheduleList.length);
        setCareCount(careList.length);
        setRecordCount(recordList.length);
      })
      .catch(() => {
        setPet(null);
        setRawPet(null);
        setReminderCount(0);
        setCareCount(0);
        setRecordCount(0);
      });
  }, [petId]);

  useEffect(() => {
    refreshPetDetail();
  }, [refreshPetDetail]);

  useDidShow(() => {
    refreshPetDetail();
  });

  const handleDelete = async () => {
    if (!petId) {
      Taro.showToast({ title: '缺少宠物信息', icon: 'none' });
      return;
    }

    const result = await Taro.showModal({
      title: '确认删除',
      content: '删除后该宠物的档案将不可恢复，是否继续？',
      confirmText: '删除',
      confirmColor: '#d65a31',
    });

    if (!result.confirm) {
      return;
    }

    try {
      await deletePetData(petId);
      Taro.showToast({ title: '宠物已删除', icon: 'success' });
      setTimeout(() => Taro.navigateBack(), 300);
    } catch (error) {
      const message = error instanceof Error ? error.message : '删除失败';
      Taro.showToast({ title: message, icon: 'none' });
    }
  };

  const ageLabel = (() => {
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
  })();

  const vaccineText = careCount
    ? `已记录 ${careCount} 条护理/疫苗相关记录`
    : '暂未记录疫苗信息';
  const personalityText = rawPet?.notes || '暂未填写性格描述，可以在编辑页补充。';
  const sterilizedText = rawPet?.sterilized ? '已绝育' : '未绝育';
  const galleryBlocks = Array.from({ length: 4 });

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
                  <Text className="text-[104rpx]">{pet?.avatarEmoji || '🐾'}</Text>
                </View>
              </View>

              <View className="flex-1 pl-[24rpx]">
                <Text className="text-[26rpx] text-[#2d2d2d] font-semibold mb-[16rpx]">
                  姓名： {pet?.name || '暂无'}
                </Text>
                <Text className="text-[26rpx] text-[#2d2d2d] font-semibold mb-[16rpx]">
                  年龄： {ageLabel}
                </Text>
                <Text className="text-[26rpx] text-[#2d2d2d] font-semibold mb-[16rpx]">
                  体重： {pet?.weightKg || 0}kg
                </Text>
                <Text className="text-[26rpx] text-[#2d2d2d] font-semibold mb-[16rpx]">
                  性别： {pet?.gender === 'female' ? '女生' : '男生'}
                </Text>
                <Text className="text-[26rpx] text-[#2d2d2d] font-semibold">
                  种类： {pet?.species || '未设置'}
                </Text>
              </View>
            </View>

            <View className="mt-[22rpx] py-[18rpx] border-t-[2rpx] border-[#F0E3B5] border-solid">
              <Text className="text-[26rpx] font-semibold text-[#222]">是否绝育： {sterilizedText}</Text>
            </View>

            <View className="py-[18rpx] border-t-[2rpx] border-[#F0E3B5] border-solid">
              <Text className="text-[26rpx] font-semibold text-[#222] mb-[8rpx]">接种疫苗：</Text>
              <Text className="text-[24rpx] leading-[1.7] text-[#444]">{vaccineText}</Text>
            </View>

            <View className="py-[18rpx] border-t-[2rpx] border-[#F0E3B5] border-solid">
              <Text className="text-[26rpx] font-semibold text-[#222] mb-[8rpx]">性格：</Text>
              <Text className="text-[24rpx] leading-[1.7] text-[#444]">{personalityText}</Text>
            </View>

            <View className="py-[18rpx] border-t-[2rpx] border-[#F0E3B5] border-solid">
              <Text className="text-[26rpx] font-semibold text-[#222] mb-[16rpx]">日常照片：</Text>
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
                        <Text className="text-[22rpx] text-[#8C7A45]">预留</Text>
                      </View>
                    ))}
                  </View>
                </View>
                <Text className="text-[21rpx] text-[#7A6A3D]">
                  图片上传功能稍后接入，这里先预留展示区域。
                </Text>
              </View>
            </View>

            <View className="py-[18rpx] border-t-[2rpx] border-[#F0E3B5] border-solid">
              <Text className="text-[26rpx] font-semibold text-[#222] mb-[10rpx]">记录概览：</Text>
              <View className="grid grid-cols-3 gap-[12rpx]">
                <View className="rounded-[18rpx] bg-[#FFF4C2] p-[14rpx] shadow-[inset_0_0_0_2rpx_rgba(255,255,255,0.72)]">
                  <Text className="text-[20rpx] text-[#6A5B2A]">提醒</Text>
                  <Text className="text-[34rpx] font-bold text-[#222]">{reminderCount}</Text>
                </View>
                <View className="rounded-[18rpx] bg-[#EEF8FF] p-[14rpx] shadow-[inset_0_0_0_2rpx_rgba(255,255,255,0.72)]">
                  <Text className="text-[20rpx] text-[#4B6A77]">日常</Text>
                  <Text className="text-[34rpx] font-bold text-[#222]">{recordCount}</Text>
                </View>
                <View className="rounded-[18rpx] bg-[#F7F0FF] p-[14rpx] shadow-[inset_0_0_0_2rpx_rgba(255,255,255,0.72)]">
                  <Text className="text-[20rpx] text-[#6A5B7D]">护理</Text>
                  <Text className="text-[34rpx] font-bold text-[#222]">{careCount}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View className="flex gap-3 mt-[20rpx]">
          <View
            className="flex-1 h-[86rpx] rounded-[43rpx] bg-[#FFD93B] flex items-center justify-center shadow-[0_12rpx_24rpx_rgba(234,188,47,0.28)]"
            onClick={() => Taro.navigateTo({ url: `/pages/EditPetProfile/index?mode=edit&petId=${petId}` })}
          >
            <Text className="text-[28rpx] font-semibold">编辑</Text>
          </View>
          <View
            className="flex-1 h-[86rpx] rounded-[43rpx] bg-white flex items-center justify-center shadow-[0_12rpx_24rpx_rgba(0,0,0,0.06)]"
            style={{ border: '2rpx solid #F0E3B5' }}
            onClick={handleDelete}
          >
            <Text className="text-[28rpx] text-[#666] font-semibold">删除</Text>
          </View>
        </View>
      </View>
    </BasicLayout>
  );
});

export default PetDetailPage;
