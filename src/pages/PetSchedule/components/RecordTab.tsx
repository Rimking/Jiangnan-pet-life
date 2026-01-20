import { View, Text } from '@tarojs/components';
import { memo } from 'react';
import Calendar from './Calendar';

const RecordTab = memo(function RecordTab() {
  const recordItems = [
    {
      title: '饮食',
      icon: '🍽️',
      value: '',
      hasArrow: true
    },
    {
      title: '喝水',
      icon: '💧',
      value: '300ml',
      hasArrow: false,
      hasSwitch: true
    },
    {
      title: '体重',
      icon: '⚖️',
      value: '2.5kg',
      hasArrow: false,
      hasSwitch: true
    },
    {
      title: '洗护',
      icon: '🛁',
      value: '',
      hasArrow: true
    },
    {
      title: '排便',
      icon: '💩',
      value: '',
      hasArrow: true,
      options: ['💩', '💩💩', '💩💩💩']
    },
    {
      title: '记事',
      icon: '📝',
      value: '',
      hasArrow: true,
      hasNoteIcon: true
    },
    {
      title: '异常',
      icon: '⚠️',
      value: '',
      hasArrow: true
    }
  ];

  return (
    <View className="record-tab" style={{ flex: 1 }}>
      <Calendar />
      <View style={{ marginTop: '16px' }}>
        {recordItems.map((item, index) => (
          <View key={index} style={{ backgroundColor: '#FFF', borderRadius: '12px', padding: '16px', marginBottom: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ display: 'flex', alignItems: 'center' }}>
              <View style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#E0E0E0', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '12px' }}>
                <Text style={{ fontSize: '16px' }}>{item.icon}</Text>
              </View>
              <Text style={{ fontSize: '14px', fontWeight: '500' }}>{item.title}</Text>
            </View>
            <View style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {item.value && (
                <Text style={{ fontSize: '14px', color: '#666' }}>{item.value}</Text>
              )}
              {item.options && (
                <View style={{ display: 'flex', gap: '4px' }}>
                  {item.options.map((option, optIndex) => (
                    <Text key={optIndex} style={{ fontSize: '14px' }}>{option}</Text>
                  ))}
                </View>
              )}
              {item.hasNoteIcon && (
                <View style={{ width: '20px', height: '20px', borderRadius: '4px', backgroundColor: '#E0E0E0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontSize: '12px' }}>📌</Text>
                </View>
              )}
              {item.hasSwitch && (
                <View style={{ width: '40px', height: '20px', borderRadius: '10px', backgroundColor: '#4CAF50', display: 'flex', alignItems: 'center', padding: '2px' }}>
                  <View style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: '#FFF' }} />
                </View>
              )}
              {item.hasArrow && (
                <View style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#E0E0E0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontSize: '12px' }}>→</Text>
                </View>
              )}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
});

export default RecordTab;