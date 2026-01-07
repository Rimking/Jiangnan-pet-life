import BasicLayout from '@/layout/basicLayout';
import { View } from '@tarojs/components';
import { memo } from 'react';

// 宠物档案
const PetProfile = memo(function PetProfile() {
  return (
    <BasicLayout
      wrapClassName="w-full h-full"
      wrapStyle={{
        backgroundImage: 'linear-gradient( to bottom ,#FFE68D 20%, #FFFCE0 100%)',
        height: '100vh',
      }}
      // statusBarLoc

      navOptions={{
        navTitle: '',
        needBack: false,
      }}
    >
      11
    </BasicLayout>
  );
});

export default PetProfile;
