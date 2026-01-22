import BasicLayout from '@/layout/basicLayout';
import { View, Text, Input, Textarea } from '@tarojs/components';
import { memo, useState } from 'react';

// 新增提醒
const AddPetReminder = memo(function AddPetReminder() {
  return (
    <BasicLayout
      wrapClassName="w-full h-full"
      wrapStyle={{
        backgroundColor: '#FFF',
        minHeight: '100vh',
      }}
      navOptions={{
        navTitle: '添加提醒',
        needBack: true,
      }}
    >
      11
    </BasicLayout>
  );
});

export default AddPetReminder;
