import BasicLayout from '@/layout/basicLayout';
import { View, Text, Input } from '@tarojs/components';
import { memo, useMemo, useState } from 'react';
import { useAtom } from 'jotai';
import Taro from '@tarojs/taro';
import { addExpenseRecordAtom, currentPetAtom, expenseRecordsAtom } from '@/store';

const ExpenseRecord = memo(function ExpenseRecord() {
  const [currentPet] = useAtom(currentPetAtom);
  const [records] = useAtom(expenseRecordsAtom);
  const [, addExpense] = useAtom(addExpenseRecordAtom);

  const [amount, setAmount] = useState('39.9');
  const [item, setItem] = useState('猫砂');
  const [category, setCategory] = useState('日用');

  const list = useMemo(
    () => records.filter((row) => !currentPet || row.petId === currentPet.id),
    [records, currentPet],
  );

  const total = useMemo(() => list.reduce((sum, cur) => sum + cur.amount, 0), [list]);

  const add = () => {
    if (!currentPet) {
      Taro.showToast({ title: '请先选择宠物', icon: 'none' });
      return;
    }
    if (!item.trim() || !Number(amount)) return;

    addExpense({
      petId: currentPet.id,
      item: item.trim(),
      amount: Number(amount),
      category: category.trim() || '其他',
    });

    setAmount('');
    setItem('');
  };

  return (
    <BasicLayout navOptions={{ navTitle: '花销记录', needBack: true }}>
      <View className="px-8 pt-28 pb-10 flex flex-col gap-4">
        <View className="bg-white rounded-2xl p-6 shadow-sm">
          <Text className="text-[30rpx] font-bold">本期总花销：¥{total.toFixed(2)}</Text>
          <Text className="mt-1 text-[24rpx] text-gray-500">当前宠物：{currentPet?.name ?? '未选择'}</Text>
          <View className="mt-4 flex flex-col gap-3">
            <Input className="p-3 bg-gray-50 rounded-xl" placeholder="项目" value={item} onInput={(e) => setItem(e.detail.value)} />
            <Input className="p-3 bg-gray-50 rounded-xl" placeholder="类别（食品/医疗/日用）" value={category} onInput={(e) => setCategory(e.detail.value)} />
            <Input className="p-3 bg-gray-50 rounded-xl" placeholder="金额" type="number" value={amount} onInput={(e) => setAmount(e.detail.value)} />
            <View className="p-3 rounded-xl bg-blue-500" onClick={add}><Text className="text-center text-white">新增花销</Text></View>
          </View>
        </View>

        {list.map((row) => (
          <View key={row.id} className="bg-white rounded-2xl p-4 shadow-sm flex flex-row justify-between">
            <View>
              <Text>{row.item}</Text>
              <Text className="text-[22rpx] text-gray-500 mt-1">{row.category} · {row.date}</Text>
            </View>
            <Text>¥{row.amount.toFixed(2)}</Text>
          </View>
        ))}
      </View>
    </BasicLayout>
  );
});

export default ExpenseRecord;
