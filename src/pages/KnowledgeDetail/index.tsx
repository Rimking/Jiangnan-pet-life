import BasicLayout from '@/layout/basicLayout';
import { View, Text } from '@tarojs/components';
import { memo } from 'react';

const KnowledgeDetail = memo(function KnowledgeDetail() {
  return (
    <BasicLayout navOptions={{ navTitle: '文章详情', needBack: true }}>
      <View className="px-8 pt-28 pb-10">
        <View className="bg-white rounded-2xl p-6 shadow-sm">
          <Text className="text-[32rpx] font-bold">猫咪软便怎么办？</Text>
          <Text className="mt-3 leading-7 text-[26rpx] text-gray-700">
            先观察精神状态和食欲，减少零食与油腻食物，保证饮水。若软便持续 24-48 小时，建议及时就医并记录饮食变化。
          </Text>
        </View>
      </View>
    </BasicLayout>
  );
});

export default KnowledgeDetail;
