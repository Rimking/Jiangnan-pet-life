import BasicLayout from '@/layout/basicLayout';
import { View, Text } from '@tarojs/components';
import { memo } from 'react';
import { showDemoPendingToast } from '@/utils/demoToast';

const PetDetailPage = memo(function PetDetailPage() {
  return (
    <BasicLayout
      wrapClassName="w-full h-full"
      wrapStyle={{ background: 'linear-gradient(180deg, #FFE68D 0%, #FFFCE0 100%)', minHeight: '100vh' }}
      navOptions={{ navTitle: '宠物详情', needBack: true }}
    >
      <View className="px-6 pt-4 pb-[100rpx]">
        <View className="bg-white rounded-[20rpx] border-[2rpx] border-solid border-[#262626] p-5 mb-4">
          <View className="w-[120rpx] h-[120rpx] rounded-full bg-[#FFF6CE] border-[2rpx] border-solid border-[#262626] flex items-center justify-center mb-4 mx-auto">
            <Text className="text-[64rpx]">🐱</Text>
          </View>
          <Text className="text-[34rpx] font-bold text-center text-[#303030]">火火</Text>
          <Text className="text-[22rpx] text-center text-[#6b6b6b] mt-1">英短 · 6个月 · 5kg</Text>

          <View className="flex flex-wrap justify-center gap-2 mt-4">
            {['活泼', '亲人', '黏人'].map((tag) => (
              <View key={tag} className="px-3 py-1 rounded-[14rpx] bg-[#F4F4F4] border border-[#d9d9d9]">
                <Text className="text-[20rpx] text-[#5b5b5b]">{tag}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className="bg-white rounded-[20rpx] border-[2rpx] border-solid border-[#262626] p-4 mb-4">
          <Text className="text-[26rpx] font-semibold mb-2 block">基础信息</Text>
          <Text className="text-[22rpx] text-[#555] mb-1 block">生日：2025-10-21</Text>
          <Text className="text-[22rpx] text-[#555] mb-1 block">性别：公</Text>
          <Text className="text-[22rpx] text-[#555] mb-1 block">本月提醒：4 条</Text>
          <Text className="text-[22rpx] text-[#555]">累计记录：18 条</Text>
        </View>

        <View className="flex gap-3">
          <View
            className="flex-1 h-[86rpx] rounded-[43rpx] bg-[#FFD93B] border-[2rpx] border-solid border-[#262626] flex items-center justify-center"
            onClick={() => showDemoPendingToast('编辑')}
          >
            <Text className="text-[28rpx] font-semibold">编辑</Text>
          </View>
          <View
            className="flex-1 h-[86rpx] rounded-[43rpx] bg-white border-[2rpx] border-solid border-[#d8d8d8] flex items-center justify-center"
            onClick={() => showDemoPendingToast('删除')}
          >
            <Text className="text-[28rpx] text-[#666] font-semibold">删除</Text>
          </View>
        </View>
      </View>
    </BasicLayout>
  );
});

export default PetDetailPage;

