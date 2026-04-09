import BasicLayout from '@/layout/basicLayout';
import { View, ScrollView } from '@tarojs/components';
import { memo } from 'react';
import PetHeader from './components/PetHeader';
import PetSwitchCard from './components/PetSwitchCard';
import QuickEntry from './components/QuickEntry';
import TodayTodo from './components/TodayTodo';
import { theme } from '@/styles/theme';

const PetProfile = memo(function PetProfile() {
  return (
    <BasicLayout
      wrapClassName="w-full h-full"
      wrapStyle={{
        backgroundColor: theme.background.default,
        minHeight: '100vh',
      }}
    >
      <ScrollView
        scrollY
        style={{
          paddingTop: '60px',
          paddingBottom: '140px',
          height: '100vh',
        }}
      >
        <PetHeader />
        <PetSwitchCard />
        <QuickEntry />
        <TodayTodo />
      </ScrollView>
    </BasicLayout>
  );
});

export default PetProfile;
