import NavTab from '@/components/navBar';
import BasicLayout from '@/layout/basicLayout';
import { View } from '@tarojs/components';
import { memo } from 'react';

// 宠物日程
const PetSchedule = memo(function PetSchedule() {
  return (
    <BasicLayout
      wrapClassName=""
      wrapStyle={{
        backgroundColor: 'linear-gradient( to bottom ,#EDF2F2 50%, #FFFFFF 100%)',
      }}
      // statusBarLoc
      navOptions={{
        navTitle: '宠物日程',
      }}
    >
      11
    </BasicLayout>
  );
});

export default PetSchedule;
