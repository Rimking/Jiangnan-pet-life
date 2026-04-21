import BasicLayout from '@/layout/basicLayout';
import { View, Text, Input } from '@tarojs/components';
import { memo, useMemo, useState } from 'react';
import { useAtom } from 'jotai';
import Taro from '@tarojs/taro';
import { addCareRecordAtom, careRecordsAtom, currentPetAtom } from '@/store';

const CareRecord = memo(function CareRecord() {
  const [currentPet] = useAtom(currentPetAtom);
  const [records] = useAtom(careRecordsAtom);
  const [, addCare] = useAtom(addCareRecordAtom);

  const [content, setContent] = useState('洗澡');
  const [status, setStatus] = useState('完成');

  const list = useMemo(
    () => records.filter((row) => !currentPet || row.petId === currentPet.id),
    [records, currentPet],
  );

  const add = () => {
    if (!currentPet) {
      Taro.showToast({ title: '请先选择宠物', icon: 'none' });
      return;
    }
    if (!content.trim()) return;

    addCare({
      petId: currentPet.id,
      content: content.trim(),
      status: status.trim() || '完成',
    });

    setContent('');
    setStatus('完成');
  };

  return (
    <BasicLayout navOptions={{ navTitle: '护理记录', needBack: true }}>
      <View className="px-8 pt-28 pb-10 flex flex-col gap-4">
        <View className="bg-white rounded-2xl p-6 shadow-sm">
          <Text className="text-[30rpx] font-bold">新增护理</Text>
          <Text className="mt-1 text-[24rpx] text-gray-500">当前宠物：{currentPet?.name ?? '未选择'}</Text>
          <Input className="mt-3 p-3 bg-gray-50 rounded-xl" value={content} onInput={(e) => setContent(e.detail.value)} placeholder="例如：剪指甲" />
          <Input className="mt-3 p-3 bg-gray-50 rounded-xl" value={status} onInput={(e) => setStatus(e.detail.value)} placeholder="状态（完成/待观察）" />
          <View className="mt-3 p-3 rounded-xl bg-blue-500" onClick={add}><Text className="text-center text-white">保存护理记录</Text></View>
        </View>

        {list.map((row) => (
          <View key={row.id} className="bg-white rounded-2xl p-4 shadow-sm">
            <Text>{row.content}：{row.status}</Text>
            <Text className="text-[22rpx] text-gray-500 mt-1">{row.date}</Text>
          </View>
        ))}
      </View>
    </BasicLayout>
  );
});

export default CareRecord;
