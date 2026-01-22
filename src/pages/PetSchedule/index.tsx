import BasicLayout from '@/layout/basicLayout';
import { View, Text } from '@tarojs/components';
import { memo, useState } from 'react';
import RecordTab from './components/RecordTab';
import ReminderTab from './components/ReminderTab';
import clsx from 'clsx';
import Calendar from './components/calendar';

const enum TabType {
  Record = 'record',
  Reminder = 'reminder',
}

// 宠物日程
const PetSchedule = memo(function PetSchedule() {
  const [activeTab, setActiveTab] = useState(TabType.Reminder); // record 或 reminder

  return (
    <BasicLayout
      wrapClassName="w-full h-full "
      wrapStyle={{
        backgroundImage: 'linear-gradient( to bottom ,#FFE68D 10%, #FFFCE0 100%)',
        minHeight: '100vh',
      }}
      navOptions={{
        navTitle: '宠物日程',
        needBack: false,
      }}
    >
      <View className="px-8 pb-5 mt-4">
        {/* 标签页切换 */}
        <View className="flex w-full h-[60px] justify-between items-center overflow-hidden mb-[16px] shadow-[0_2px_4px_rgba(0,0,0,0.05)]">
          <View
            className={clsx(
              'w-[308px] h-full text-[28px] border-[2px] border-solid rounded-[48px] flex items-center justify-center ',
              {}
            )}
            style={{
              backgroundColor: activeTab === 'record' ? '#FFD700' : '#FFF',
            }}
            onClick={() => setActiveTab(TabType.Record)}
          >
            记录
          </View>
          <View
            className={clsx(
              'w-[308px] h-full text-[28px] border-[2px] border-solid rounded-[48px] flex items-center justify-center ',
              {}
            )}
            style={{
              backgroundColor: activeTab === 'reminder' ? '#FFD700' : '#FFF',
            }}
            onClick={() => setActiveTab(TabType.Reminder)}
          >
            提醒
          </View>
        </View>

        {/* 日历 */}
        <Calendar />

        {/* 标签页内容 */}
        <View className="w-full mt-4">
          {activeTab === TabType.Record ? <RecordTab /> : <ReminderTab />}
        </View>
      </View>
    </BasicLayout>
  );
});

export default PetSchedule;
