import { View, Text, Input } from '@tarojs/components';
import { memo } from 'react';

const AddReminder = memo(function AddReminder() {
  return (
    <View className="add-reminder" style={{ flex: 1, backgroundColor: '#FFFCE0' }}>
      <View style={{ padding: '16px', borderBottom: '1px solid #E0E0E0', display: 'flex', alignItems: 'center' }}>
        <View style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#E0E0E0', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '16px' }}>
          <Text style={{ fontSize: '14px' }}>←</Text>
        </View>
        <Text style={{ fontSize: '18px', fontWeight: 'bold', flex: 1 }}>添加提醒</Text>
        <View style={{ width: '32px' }} />
      </View>
      
      <View style={{ padding: '16px' }}>
        <View style={{ marginBottom: '20px' }}>
          <Text style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>请输入内容</Text>
          <View style={{ width: '100%', height: '120px', border: '1px solid #E0E0E0', borderRadius: '8px', padding: '12px', backgroundColor: '#FFF' }}>
            <Input style={{ width: '100%', height: '100%', fontSize: '14px' }} placeholder="请输入提醒内容" />
          </View>
        </View>
        
        <View style={{ marginBottom: '16px' }}>
          <Text style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>类型</Text>
          <View style={{ width: '100%', height: '44px', border: '1px solid #E0E0E0', borderRadius: '8px', padding: '0 12px', backgroundColor: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: '14px' }}>日常提醒</Text>
            <Text style={{ fontSize: '14px', color: '#999' }}>→</Text>
          </View>
        </View>
        
        <View style={{ marginBottom: '16px' }}>
          <Text style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>时间</Text>
          <View style={{ width: '100%', height: '44px', border: '1px solid #E0E0E0', borderRadius: '8px', padding: '0 12px', backgroundColor: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: '14px' }}>2024年8月8日 周二 14:23</Text>
            <Text style={{ fontSize: '14px', color: '#999' }}>→</Text>
          </View>
        </View>
        
        <View style={{ marginBottom: '24px' }}>
          <Text style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>提醒</Text>
          <View style={{ width: '100%', height: '44px', border: '1px solid #E0E0E0', borderRadius: '8px', padding: '0 12px', backgroundColor: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: '14px' }}>重复</Text>
            <Text style={{ fontSize: '14px', color: '#999' }}>→</Text>
          </View>
        </View>
        
        <View style={{ marginBottom: '16px' }}>
          <View style={{ width: '100%', height: '48px', borderRadius: '24px', backgroundColor: '#FFD700', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(255, 215, 0, 0.4)' }}>
            <Text style={{ fontSize: '16px', fontWeight: 'bold', color: '#FFF' }}>保存</Text>
          </View>
        </View>
        
        <View style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
          <View style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#E0E0E0', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.5 }}>
            <Text style={{ fontSize: '40px' }}>🐱</Text>
          </View>
        </View>
      </View>
    </View>
  );
});

export default AddReminder;