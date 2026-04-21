import BasicLayout from '@/layout/basicLayout';
import { View, Text, Input } from '@tarojs/components';
import { memo, useState } from 'react';
import { useAtom } from 'jotai';
import Taro from '@tarojs/taro';
import { addDailyRecordAtom, currentPetAtom, dailyRecordsAtom } from '@/store';

const AddPetRecord = memo(function AddPetRecord() {
  const [currentPet] = useAtom(currentPetAtom);
  const [records] = useAtom(dailyRecordsAtom);
  const [, addDailyRecord] = useAtom(addDailyRecordAtom);
  const [record, setRecord] = useState('今天状态良好，食欲正常。');

  const save = () => {
    if (!currentPet) {
      Taro.showToast({ title: '请先添加宠物', icon: 'none' });
      return;
    }
    if (!record.trim()) return;

    addDailyRecord({
      petId: currentPet.id,
      content: record.trim(),
    });

    setRecord('');
    Taro.showToast({ title: '记录已保存', icon: 'success' });
  };

  const petRecords = records.filter((item) => !currentPet || item.petId === currentPet.id);

  return (
    <BasicLayout
      wrapClassName=""
      wrapStyle={{ backgroundColor: '#F5F7FF' }}
      navOptions={{ navTitle: '新增记录' }}
    >
      <View className="px-8 pt-28 pb-10 flex flex-col gap-4">
        <View className="bg-white rounded-2xl p-6 shadow-sm">
          <Text className="text-[30rpx] font-bold">日常记录</Text>
          <Text className="mt-2 text-[24rpx] text-gray-500">当前宠物：{currentPet?.name ?? '未选择'}</Text>
          <Input
            className="mt-4 p-3 bg-gray-50 rounded-xl"
            value={record}
            onInput={(e) => setRecord(e.detail.value)}
            placeholder="输入今天的观察记录"
          />
          <View className="mt-3 p-3 rounded-xl bg-blue-500" onClick={save}>
            <Text className="text-white text-center">保存记录</Text>
          </View>
        </View>

        {petRecords.map((item) => (
          <View key={item.id} className="bg-white rounded-2xl p-4 shadow-sm">
            <Text>{item.content}</Text>
            <Text className="text-[22rpx] text-gray-500 mt-1">{item.date}</Text>
          </View>
        ))}
      </View>
    </BasicLayout>
  );
});

export default AddPetRecord;
