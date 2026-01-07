import NavTab from '@/components/navBar';
import BasicLayout from '@/layout/basicLayout';
import { View } from '@tarojs/components';
import { memo } from 'react';

// 铲屎官
const PetOwner = memo(function PetOwner() {
  return (
    <BasicLayout
      wrapClassName=""
      wrapStyle={{
        backgroundImage: 'linear-gradient( to bottom ,#EDF2F2 50%, #FFFFFF 100%)',
      }}
      // statusBarLoc
      navOptions={{
        navTitle: '铲屎官',
      }}
    >
      11123
    </BasicLayout>
  );
});

export default PetOwner;
