import NavTab from '@/components/navBar';
import BasicLayout from '@/layout/basicLayout';
import { View } from '@tarojs/components';
import { memo } from 'react';

// 知识库
const PetKnowledge = memo(function PetKnowledge() {
  return (
    <BasicLayout
      wrapClassName=""
      wrapStyle={{
        backgroundColor: 'linear-gradient( to bottom ,#EDF2F2 50%, #FFFFFF 100%)',
      }}
      // statusBarLoc
      navOptions={{
        navTitle: '知识库',
      }}
    >
      11
    </BasicLayout>
  );
});

export default PetKnowledge;
