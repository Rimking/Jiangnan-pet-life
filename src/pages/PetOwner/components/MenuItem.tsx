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

const MenuItem = memo(function MenuItem({
  icon,
  title,
  subtitle,
  hasArrow = true,
  hasBadge = false,
  badgeText,
}: MenuItemProps) {
  return (
    <View className="menu-item bg-white rounded-xl p-4 mb-3 shadow-sm flex items-center justify-between">
      <View className="flex items-center flex-1">
        <View className="w-11 h-11 rounded-xl bg-yellow-50 flex items-center justify-center mr-3.5 shadow-sm">
          <Text className="text-3xl">{icon}</Text>
        </View>
        <View className="flex-1">
          <Text className="text-base font-semibold mb-1 block text-gray-800">{title}</Text>
          {subtitle && <Text className="text-sm text-gray-400">{subtitle}</Text>}
        </View>
      </View>
      <View className="flex items-center gap-2.5">
        {hasBadge && (
          <View className="px-2.5 py-1.5 bg-red-500 rounded-lg shadow-sm">
            <Text className="text-xs text-white font-semibold">{badgeText}</Text>
          </View>
        )}
        {hasArrow && (
          <View className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center">
            <Text className="text-base text-gray-400">→</Text>
          </View>
        )}
      </View>
    </View>
  );
});

export default MenuItem;
