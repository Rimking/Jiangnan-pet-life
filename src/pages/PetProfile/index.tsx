import BasicLayout from '@/layout/basicLayout';
import { View, Text } from '@tarojs/components';
import { memo, useState } from 'react';
import PetHeader from './components/PetHeader';
import PetInfoCard from './components/PetInfoCard';
import FunctionGrid from './components/FunctionGrid';
import DailyTip from './components/DailyTip';

// 宠物档案
const PetProfile = memo(function PetProfile() {

  return (
    <BasicLayout
      wrapClassName="w-full h-full"
      wrapStyle={{
        backgroundImage: 'linear-gradient( to bottom ,#FFE68D 10%, #FFFCE0 100%)',
        minHeight: '100vh',
      }}
      
    >
      <View className='pt-[60px]'>
        <PetHeader />
        <PetInfoCard />
        <FunctionGrid />
        <DailyTip />
      </View>
    </BasicLayout>
  );
});

export default PetProfile;
