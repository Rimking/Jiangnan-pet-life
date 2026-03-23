import { View, Text } from '@tarojs/components';
import { memo } from 'react';

interface MenuItemProps {
  icon: string;
  title: string;
  subtitle?: string;
  hasArrow?: boolean;
  hasBadge?: boolean;
  badgeText?: string;
}

const MenuItem = memo(function MenuItem({ icon, title, subtitle, hasArrow = true, hasBadge = false, badgeText }: MenuItemProps) {
  return (
    <View className="menu-item bg-white rounded-[24rpx] p-[32rpx] mb-[24rpx] flex items-center justify-between" style={{ boxShadow: '0 4rpx 12rpx rgba(0,0,0,0.06)' }}>
      <View className="flex items-center flex-1">
        <View className="w-[88rpx] h-[88rpx] rounded-[24rpx] flex items-center justify-center mr-[28rpx]" style={{ backgroundColor: '#FFF9E6', boxShadow: '0 4rpx 8rpx rgba(255, 249, 230, 0.4)' }}>
          <Text className="text-[44rpx]">{icon}</Text>
        </View>
        <View className="flex-1">
          <Text className="text-[30rpx] font-semibold mb-[8rpx] block text-gray-800">{title}</Text>
          {subtitle && (
            <Text className="text-[26rpx] text-gray-500">{subtitle}</Text>
          )}
        </View>
      </View>
      <View className="flex items-center gap-[20rpx]">
        {hasBadge && (
          <View className="py-[10rpx] px-[20rpx] bg-red-400 rounded-[20rpx]" style={{ boxShadow: '0 4rpx 8rpx rgba(255, 107, 107, 0.3)' }}>
            <Text className="text-[22rpx] text-white font-semibold">{badgeText}</Text>
          </View>
        )}
        {hasArrow && (
          <View className="w-[56rpx] h-[56rpx] rounded-full bg-gray-300 flex items-center justify-center">
            <Text className="text-[28rpx] text-gray-500">→</Text>
          </View>
        )}
      </View>
    </View>
  );
});

export default MenuItem;