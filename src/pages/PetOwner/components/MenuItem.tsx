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
    <View className="menu-item" style={{ backgroundColor: '#FFF', borderRadius: '12px', padding: '16px', marginBottom: '12px', boxShadow: '0 2px 6px rgba(0,0,0,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <View style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
        <View style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: '#FFF9E6', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '14px', boxShadow: '0 2px 4px rgba(255, 249, 230, 0.4)' }}>
          <Text style={{ fontSize: '22px' }}>{icon}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: '15px', fontWeight: '600', marginBottom: '4px', display: 'block', color: '#333' }}>{title}</Text>
          {subtitle && (
            <Text style={{ fontSize: '13px', color: '#999' }}>{subtitle}</Text>
          )}
        </View>
      </View>
      <View style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {hasBadge && (
          <View style={{ padding: '5px 10px', backgroundColor: '#FF6B6B', borderRadius: '10px', boxShadow: '0 2px 4px rgba(255, 107, 107, 0.3)' }}>
            <Text style={{ fontSize: '11px', color: '#FFF', fontWeight: '600' }}>{badgeText}</Text>
          </View>
        )}
        {hasArrow && (
          <View style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#E0E0E0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: '14px', color: '#999' }}>→</Text>
          </View>
        )}
      </View>
    </View>
  );
});

export default MenuItem;