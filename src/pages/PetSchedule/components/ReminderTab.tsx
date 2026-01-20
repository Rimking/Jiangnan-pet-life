import { View, Text } from '@tarojs/components';
import { memo } from 'react';
import Calendar from './Calendar';

const ReminderTab = memo(function ReminderTab() {
  const reminderTypes = [
    '日常提醒',
    '走路提醒',
    '洗澡提醒',
    '用药提醒'
  ];

  const reminderItems = [
    {
      title: '给火火喂体重',
      time: '08:00',
      isEnabled: true
    },
    {
      title: '铲猫',
      time: '09:30',
      isEnabled: false
    },
    {
      title: '提醒我吃药药',
      time: '11:00',
      isEnabled: false
    },
    {
      title: '带火火去医院体检',
      time: '14:00',
      isEnabled: false
    },
    {
      title: '给火火剪指甲',
      time: '18:00',
      isEnabled: false
    }
  ];

  return (
    <View className="reminder-tab" style={{ flex: 1, position: 'relative' }}>
      <Calendar />
      <View style={{ marginTop: '16px', marginBottom: '12px' }}>
        <View style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px' }}>
          {reminderTypes.map((type, index) => (
            <View key={index} style={{ padding: '6px 12px', backgroundColor: index === 0 ? '#FFE082' : '#E0E0E0', borderRadius: '16px', whiteSpace: 'nowrap' }}>
              <Text style={{ fontSize: '12px', color: '#333' }}>{type}</Text>
            </View>
          ))}
        </View>
      </View>
      <View style={{ marginBottom: '60px' }}>
        {reminderItems.map((item, index) => (
          <View key={index} style={{ backgroundColor: '#FFF', borderRadius: '12px', padding: '16px', marginBottom: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: '14px', fontWeight: '500', marginBottom: '4px', display: 'block' }}>{item.title}</Text>
              <Text style={{ fontSize: '12px', color: '#666' }}>{item.time}</Text>
            </View>
            <View style={{
              width: '40px',
              height: '20px',
              borderRadius: '10px',
              backgroundColor: item.isEnabled ? '#4CAF50' : '#E0E0E0',
              display: 'flex',
              alignItems: 'center',
              padding: '2px',
              justifyContent: item.isEnabled ? 'flex-end' : 'flex-start'
            }}>
              <View style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#FFF' }} />
            </View>
          </View>
        ))}
        {/* 空状态 */}
        <View style={{ backgroundColor: '#FFF', borderRadius: '12px', padding: '40px 20px', marginBottom: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: '32px', marginBottom: '12px' }}>🐱</Text>
          <Text style={{ fontSize: '14px', color: '#999', marginBottom: '16px' }}>还没有提醒～</Text>
          <View style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#FFD700', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(255, 215, 0, 0.4)' }}>
            <Text style={{ fontSize: '20px', color: '#FFF' }}>+</Text>
          </View>
        </View>
      </View>
      {/* 右下角添加按钮 */}
      <View style={{ position: 'absolute', bottom: '16px', right: '16px', width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#FFD700', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(255, 215, 0, 0.4)' }}>
        <Text style={{ fontSize: '24px', color: '#FFF' }}>+</Text>
      </View>
    </View>
  );
});

export default ReminderTab;