import { View, Text } from '@tarojs/components';
import { memo, useState } from 'react';

interface MenuItemProps {
  icon: string;
  title: string;
  subtitle?: string;
  hasArrow?: boolean;
  hasBadge?: boolean;
  badgeText?: string;
  onClick?: () => void;
}

const MenuItem = memo(function MenuItem({
  icon,
  title,
  subtitle,
  hasArrow = true,
  hasBadge = false,
  badgeText,
  onClick,
}: MenuItemProps) {
  const [pressed, setPressed] = useState(false);

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <View
      className="bg-white rounded-[24rpx] px-[24rpx] py-[22rpx] mb-[16rpx] border-[2rpx] border-[#262626] flex items-center justify-between"
      style={{
        boxShadow: pressed ? '0 4rpx 0 rgba(0,0,0,0.2)' : '0 10rpx 0 rgba(0,0,0,0.18)',
        transform: pressed ? 'translateY(6rpx)' : 'translateY(0)',
        transition: 'all .15s ease',
      }}
      onClick={handleClick}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      onTouchCancel={() => setPressed(false)}
    >
      <View className="flex items-center flex-1">
        <View className="w-[72rpx] h-[72rpx] rounded-[20rpx] bg-[#FFF6CE] border-[2rpx] border-[#262626] flex items-center justify-center mr-[20rpx]">
          <Text className="text-[34rpx] leading-none">{icon}</Text>
        </View>
        <View className="flex-1">
          <Text className="text-[28rpx] font-semibold mb-[6rpx] block text-[#1F1F1F]">{title}</Text>
          {subtitle && <Text className="text-[22rpx] leading-[1.5] text-[#7A7A7A]">{subtitle}</Text>}
        </View>
      </View>
      <View className="flex items-center gap-[12rpx]">
        {hasBadge && (
          <View className="px-[12rpx] py-[6rpx] bg-[#FF5A5F] rounded-[12rpx] border-[2rpx] border-[#262626]">
            <Text className="text-[20rpx] text-white font-semibold">{badgeText}</Text>
          </View>
        )}
        {hasArrow && (
          <View className="w-[46rpx] h-[46rpx] rounded-full bg-[#F1F1F1] border-[2rpx] border-[#262626] flex items-center justify-center">
            <Text className="text-[24rpx] text-[#7A7A7A]">›</Text>
          </View>
        )}
      </View>
    </View>
  );
});

export default MenuItem;
