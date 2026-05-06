import { View, Text } from '@tarojs/components';
import { memo } from 'react';
import { PET_UI_SHADOW, PET_UI_BORDER, PET_UI_RADIUS, PET_UI_TEXT } from '@/constants/petUi';

interface Props {
  onOpenKnowledge?: () => void;
  onOpenQa?: () => void;
}

const DailyTip = memo(function DailyTip({ onOpenKnowledge, onOpenQa }: Props) {
  return (
    <View
      className="mx-[28rpx] mb-[14rpx] p-[14rpx] border-solid"
      style={{
        border: PET_UI_BORDER.strong,
        borderRadius: PET_UI_RADIUS.md,
        backgroundColor: '#f6f6f6',
        boxShadow: PET_UI_SHADOW,
      }}
    >
      <View className="mb-[10rpx] flex items-center">
        <Text className="font-bold mr-[8rpx]" style={{ fontSize: PET_UI_TEXT.title }}>今日科普</Text>
        <View className="flex-1 h-[2rpx] bg-[#d5d5d5]" />
      </View>

      <Text className="leading-[38rpx] text-[#535353]" style={{ fontSize: PET_UI_TEXT.body }}>
        当猫咪出现尾巴竖起、炸毛、瞳孔放大并紧盯目标时，通常是“狩猎本能”被激活。可以用逗猫棒互动5-10分钟，帮助它释放精力，避免因为能量过剩而焦躁。
      </Text>

      <View className="flex items-center justify-between pt-[10rpx] mt-[10rpx] border-t border-[#e2e2e2] gap-[10rpx]">
        <View
          className="flex-1 px-[12rpx] py-[10rpx] bg-white border-solid flex items-center justify-center"
          style={{ border: PET_UI_BORDER.regular, borderRadius: PET_UI_RADIUS.sm }}
          onClick={onOpenKnowledge}
        >
          <Text className="text-[#4f4f4f]" style={{ fontSize: PET_UI_TEXT.body }}>
            去知识库
          </Text>
        </View>
        <View
          className="flex-1 px-[12rpx] py-[10rpx] bg-[#FFF6CE] border-solid flex items-center justify-center"
          style={{ border: PET_UI_BORDER.regular, borderRadius: PET_UI_RADIUS.sm }}
          onClick={onOpenQa}
        >
          <Text className="text-[#4f4f4f]" style={{ fontSize: PET_UI_TEXT.body }}>
            问养宠问题
          </Text>
        </View>
      </View>
    </View>
  );
});

export default DailyTip;
