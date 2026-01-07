import NavTab from '@/components/navBar';
import BasicLayout from '@/layout/basicLayout';
import { View } from '@tarojs/components';
import { memo } from 'react';

// 发布日程
const SendPetSchedule = memo(function SendPetSchedule() {
  return (
    <BasicLayout
      wrapClassName=""
      wrapStyle={{
        backgroundColor: 'linear-gradient( to bottom ,#EDF2F2 50%, #FFFFFF 100%)',
      }}
      // statusBarLoc
      navOptions={{
        navTitle: '发布日程',
      }}
    >
      11
    </BasicLayout>
  );
});

export default SendPetSchedule;
