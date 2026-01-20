import { View, Text } from '@tarojs/components';
import { memo } from 'react';

const UserInfoHeader = memo(function UserInfoHeader() {
  return (
    <View className="user-info-header" style={{ padding: '20px 16px', backgroundColor: '#FFF', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
      <View style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <View style={{ width: '72px', height: '72px', borderRadius: '50%', backgroundColor: '#FFE082', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '16px', boxShadow: '0 2px 6px rgba(255, 224, 130, 0.3)' }}>
          <Text style={{ fontSize: '36px' }}>👤</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '6px', display: 'block', color: '#333' }}>Shasha</Text>
          <Text style={{ fontSize: '14px', color: '#999', backgroundColor: '#FFF9E6', padding: '4px 12px', borderRadius: '12px', display: 'inline-block' }}>铲屎官</Text>
        </View>
        <View style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#E0E0E0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: '16px' }}>✏️</Text>
        </View>
      </View>
      <View style={{ display: 'flex', gap: '12px', backgroundColor: '#F8F9FA', borderRadius: '12px', padding: '16px' }}>
        <View style={{ flex: 1, textAlign: 'center' }}>
          <Text style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '6px', display: 'block', color: '#333' }}>2</Text>
          <Text style={{ fontSize: '13px', color: '#666' }}>宠物</Text>
        </View>
        <View style={{ width: '1px', backgroundColor: '#E0E0E0' }} />
        <View style={{ flex: 1, textAlign: 'center' }}>
          <Text style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '6px', display: 'block', color: '#333' }}>15</Text>
          <Text style={{ fontSize: '13px', color: '#666' }}>天数</Text>
        </View>
        <View style={{ width: '1px', backgroundColor: '#E0E0E0' }} />
        <View style={{ flex: 1, textAlign: 'center' }}>
          <Text style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '6px', display: 'block', color: '#333' }}>8</Text>
          <Text style={{ fontSize: '13px', color: '#666' }}>记录</Text>
        </View>
      </View>
    </View>
  );
});

export default UserInfoHeader;