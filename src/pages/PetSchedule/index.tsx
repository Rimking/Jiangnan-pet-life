import BasicLayout from '@/layout/basicLayout';
import { View, Text } from '@tarojs/components';
import { memo, useState } from 'react';
import RecordTab from './components/RecordTab';
import ReminderTab from './components/ReminderTab';

// 宠物日程
const PetSchedule = memo(function PetSchedule() {
  const [activeTab, setActiveTab] = useState('record'); // record 或 reminder

  return (
    <BasicLayout
      wrapClassName="w-full h-full"
      wrapStyle={{
        backgroundImage: 'linear-gradient( to bottom ,#FFE68D 10%, #FFFCE0 100%)',
        minHeight: '100vh',
      }}
      navOptions={{
        navTitle: '宠物日程',
        needBack: false,
      }}
    >
      <View style={{ padding: '16px', paddingBottom: '20px' }}>
        {/* 标签页切换 */}
        <View style={{ display: 'flex', backgroundColor: '#FFF', borderRadius: '12px', overflow: 'hidden', marginBottom: '16px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <View
            style={{
              flex: 1,
              padding: '12px',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: activeTab === 'record' ? '#FFD700' : '#FFF'
            }}
            onClick={() => setActiveTab('record')}
          >
            <Text style={{ fontSize: '14px', fontWeight: activeTab === 'record' ? 'bold' : 'normal', color: activeTab === 'record' ? '#FFF' : '#333' }}>记录</Text>
          </View>
          <View
            style={{
              flex: 1,
              padding: '12px',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: activeTab === 'reminder' ? '#FFD700' : '#FFF'
            }}
            onClick={() => setActiveTab('reminder')}
          >
            <Text style={{ fontSize: '14px', fontWeight: activeTab === 'reminder' ? 'bold' : 'normal', color: activeTab === 'reminder' ? '#FFF' : '#333' }}>提醒</Text>
          </View>
        </View>
        
        {/* 标签页内容 */}
        <View style={{ padding: '16px', backgroundColor: '#FFF', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', minHeight: '500px' }}>
          {activeTab === 'record' ? <RecordTab /> : <ReminderTab />}
        </View>
      </View>
    </BasicLayout>
  );
});

export default PetSchedule;
