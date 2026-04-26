import BasicLayout from '@/layout/basicLayout';
import { View, Text, Input } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import { memo, useMemo, useState } from 'react';
import { PET_UI } from '@/constants/petUi';
import { createCareRecordData, createExpenseData, createRecordData, toIsoDateTime } from '@/api/data';
import { ensureLoggedIn } from '@/utils/authState';

type RecordMode = 'record' | 'expense' | 'care';

const CARE_TEMPLATE = [
  { name: '驱虫', result: '已完成', nextAfterDays: 30 },
  { name: '疫苗', result: '已接种', nextAfterDays: 365 },
  { name: '体检', result: '已完成', nextAfterDays: 180 },
  { name: '洗护', result: '已完成', nextAfterDays: 14 },
];

const RESULT_TEMPLATE = ['已完成', '待观察', '需复查'];
const RECORD_TEMPLATE = ['喂食', '喝水', '排便', '运动'];
const EXPENSE_TEMPLATE = ['猫粮', '零食', '洗护', '医疗'];

const toDateInput = (date: Date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const addDays = (baseDate: string, days: number) => {
  const target = new Date(`${baseDate}T00:00:00`);
  if (Number.isNaN(target.getTime())) {
    return '';
  }
  target.setDate(target.getDate() + days);
  return toDateInput(target);
};

const AddPetRecord = memo(function AddPetRecord() {
  const { params } = useRouter();
  const petId = params.petId || '';

  const defaultDate = useMemo(() => {
    return params.date || toDateInput(new Date());
  }, [params.date]);

  const initialMode = (params.mode as RecordMode) || 'record';

  const [mode, setMode] = useState<RecordMode>(initialMode);

  const [category, setCategory] = useState('喂食');
  const [value, setValue] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(defaultDate);
  const [time, setTime] = useState('09:00');

  const [amount, setAmount] = useState('');

  const [careType, setCareType] = useState('驱虫');
  const [careResult, setCareResult] = useState('已完成');
  const [nextDate, setNextDate] = useState('');

  const handleSelectCareTemplate = (name: string) => {
    const target = CARE_TEMPLATE.find((item) => item.name === name);
    if (!target) {
      return;
    }
    setCareType(target.name);
    setCareResult(target.result);
    setNextDate(addDays(date, target.nextAfterDays));
  };

  const handleSave = async () => {
    if (!ensureLoggedIn(`/pages/AddPetRecord/index?petId=${petId}&date=${date}&mode=${mode}`)) {
      return;
    }

    if (!date.trim() || !time.trim()) {
      Taro.showToast({ title: '请填写日期和时间', icon: 'none' });
      return;
    }

    if (mode === 'expense') {
      const amountNumber = Number(amount);
      if (!category.trim() || Number.isNaN(amountNumber) || amountNumber <= 0) {
        Taro.showToast({ title: '请填写正确花销', icon: 'none' });
        return;
      }
    }

    if (mode === 'care') {
      if (!careType.trim()) {
        Taro.showToast({ title: '请填写护理类型', icon: 'none' });
        return;
      }
    }

    if (!petId) {
      Taro.showToast({ title: '缺少宠物信息', icon: 'none' });
      return;
    }

    try {
      if (mode === 'record') {
        if (!category.trim()) {
          Taro.showToast({ title: '请填写记录分类', icon: 'none' });
          return;
        }

        await createRecordData({
          petId,
          category,
          value,
          recordedAt: toIsoDateTime(date, time),
          notes: note,
        });
      }

      if (mode === 'expense') {
        await createExpenseData({
          petId,
          category,
          amount: Number(amount),
          spentAt: toIsoDateTime(date, time),
          notes: note,
        });
      }

      if (mode === 'care') {
        await createCareRecordData({
          petId,
          category: careType,
          occurredAt: toIsoDateTime(date, time),
          result: careResult,
          nextReminderAt: nextDate ? toIsoDateTime(nextDate, '09:00') : undefined,
          notes: note,
        });
      }

      Taro.showToast({ title: '记录已保存', icon: 'success' });
      setTimeout(() => Taro.navigateBack(), 300);
    } catch (error) {
      const message = error instanceof Error ? error.message : '保存失败';
      Taro.showToast({ title: message, icon: 'none' });
    }
  };

  return (
    <BasicLayout
      wrapClassName="w-full h-full"
      wrapStyle={{
        backgroundImage: PET_UI.pageBackground,
        minHeight: '100vh',
      }}
      navOptions={{
        navTitle: '新增记录',
        needBack: true,
      }}
    >
      <View className="p-8 pb-[120rpx]">
        <View className="flex gap-2 mb-5">
          <View
            className="flex-1 h-[64rpx] rounded-[14rpx] border-[2rpx] border-solid border-[#262626] flex items-center justify-center"
            style={{ backgroundColor: mode === 'record' ? '#ffd93b' : '#f4f4f4' }}
            onClick={() => setMode('record')}
          >
            <Text className="text-[24rpx]">日常</Text>
          </View>
          <View
            className="flex-1 h-[64rpx] rounded-[14rpx] border-[2rpx] border-solid border-[#262626] flex items-center justify-center"
            style={{ backgroundColor: mode === 'expense' ? '#ffc6a1' : '#f4f4f4' }}
            onClick={() => setMode('expense')}
          >
            <Text className="text-[24rpx]">花销</Text>
          </View>
          <View
            className="flex-1 h-[64rpx] rounded-[14rpx] border-[2rpx] border-solid border-[#262626] flex items-center justify-center"
            style={{ backgroundColor: mode === 'care' ? '#bdeeff' : '#f4f4f4' }}
            onClick={() => setMode('care')}
          >
            <Text className="text-[24rpx]">护理</Text>
          </View>
        </View>

        <View className="mb-5 border-[3rpx] border-black border-solid rounded-[16rpx] bg-[#f4f4f4] p-4">
          <Text className="text-[22rpx] text-[#666]">日期</Text>
          <Input
            className="h-[72rpx] text-[28rpx] mt-2"
            value={date}
            onInput={(event) => setDate(event.detail.value)}
            placeholder="YYYY-MM-DD"
          />
        </View>

        <View className="mb-5 border-[3rpx] border-black border-solid rounded-[16rpx] bg-[#f4f4f4] p-4">
          <Text className="text-[22rpx] text-[#666]">时间</Text>
          <Input
            className="h-[72rpx] text-[28rpx] mt-2"
            value={time}
            onInput={(event) => setTime(event.detail.value)}
            placeholder="HH:mm"
          />
        </View>

        {mode === 'record' ? (
          <View className="mb-3 flex flex-wrap gap-2">
            {RECORD_TEMPLATE.map((item) => (
              <View
                key={item}
                className="px-3 py-1 rounded-[16rpx] border-[2rpx] border-solid border-[#262626]"
                style={{ backgroundColor: category === item ? '#ffd93b' : '#f4f4f4' }}
                onClick={() => setCategory(item)}
              >
                <Text className="text-[22rpx]">{item}</Text>
              </View>
            ))}
          </View>
        ) : null}

        {mode === 'expense' ? (
          <View className="mb-3 flex flex-wrap gap-2">
            {EXPENSE_TEMPLATE.map((item) => (
              <View
                key={item}
                className="px-3 py-1 rounded-[16rpx] border-[2rpx] border-solid border-[#262626]"
                style={{ backgroundColor: category === item ? '#ffc6a1' : '#f4f4f4' }}
                onClick={() => setCategory(item)}
              >
                <Text className="text-[22rpx]">{item}</Text>
              </View>
            ))}
          </View>
        ) : null}

        {mode !== 'care' ? (
          <View className="mb-5 border-[3rpx] border-black border-solid rounded-[16rpx] bg-[#f4f4f4] p-4">
            <Text className="text-[22rpx] text-[#666]">分类</Text>
            <Input
              className="h-[72rpx] text-[28rpx] mt-2"
              value={category}
              onInput={(event) => setCategory(event.detail.value)}
              placeholder="如：喝水、猫粮、玩具"
            />
          </View>
        ) : null}

        {mode === 'record' ? (
          <View className="mb-5 border-[3rpx] border-black border-solid rounded-[16rpx] bg-[#f4f4f4] p-4">
            <Text className="text-[22rpx] text-[#666]">记录值</Text>
            <Input
              className="h-[72rpx] text-[28rpx] mt-2"
              value={value}
              onInput={(event) => setValue(event.detail.value)}
              placeholder="如：250ml / 1次"
            />
          </View>
        ) : null}

        {mode === 'expense' ? (
          <View className="mb-5 border-[3rpx] border-black border-solid rounded-[16rpx] bg-[#f4f4f4] p-4">
            <Text className="text-[22rpx] text-[#666]">金额（元）</Text>
            <Input
              className="h-[72rpx] text-[28rpx] mt-2"
              value={amount}
              onInput={(event) => setAmount(event.detail.value)}
              placeholder="如：89"
              type="digit"
            />
          </View>
        ) : null}

        {mode === 'care' ? (
          <>
            <View className="mb-3 flex flex-wrap gap-2">
              {CARE_TEMPLATE.map((item) => (
                <View
                  key={item.name}
                  className="px-3 py-1 rounded-[16rpx] border-[2rpx] border-solid border-[#262626]"
                  style={{ backgroundColor: careType === item.name ? '#bdeeff' : '#f4f4f4' }}
                  onClick={() => handleSelectCareTemplate(item.name)}
                >
                  <Text className="text-[22rpx]">{item.name}</Text>
                </View>
              ))}
            </View>

            <View className="mb-5 border-[3rpx] border-black border-solid rounded-[16rpx] bg-[#f4f4f4] p-4">
              <Text className="text-[22rpx] text-[#666]">护理类型</Text>
              <Input
                className="h-[72rpx] text-[28rpx] mt-2"
                value={careType}
                onInput={(event) => setCareType(event.detail.value)}
                placeholder="如：驱虫、洗护、体检"
              />
            </View>

            <View className="mb-3 flex flex-wrap gap-2">
              {RESULT_TEMPLATE.map((item) => (
                <View
                  key={item}
                  className="px-3 py-1 rounded-[16rpx] border-[2rpx] border-solid border-[#262626]"
                  style={{ backgroundColor: careResult === item ? '#d9f5e4' : '#f4f4f4' }}
                  onClick={() => setCareResult(item)}
                >
                  <Text className="text-[22rpx]">{item}</Text>
                </View>
              ))}
            </View>

            <View className="mb-5 border-[3rpx] border-black border-solid rounded-[16rpx] bg-[#f4f4f4] p-4">
              <Text className="text-[22rpx] text-[#666]">结果</Text>
              <Input
                className="h-[72rpx] text-[28rpx] mt-2"
                value={careResult}
                onInput={(event) => setCareResult(event.detail.value)}
                placeholder="如：已完成 / 异常观察"
              />
            </View>

            <View className="mb-2 flex gap-2">
              {[14, 30, 90].map((days) => (
                <View
                  key={days}
                  className="px-3 py-1 rounded-[16rpx] border-[2rpx] border-solid border-[#262626] bg-[#eef7ff]"
                  onClick={() => setNextDate(addDays(date, days))}
                >
                  <Text className="text-[22rpx]">+{days}天</Text>
                </View>
              ))}
            </View>

            <View className="mb-5 border-[3rpx] border-black border-solid rounded-[16rpx] bg-[#f4f4f4] p-4">
              <Text className="text-[22rpx] text-[#666]">下次日期（可选）</Text>
              <Input
                className="h-[72rpx] text-[28rpx] mt-2"
                value={nextDate}
                onInput={(event) => setNextDate(event.detail.value)}
                placeholder="YYYY-MM-DD，填写后自动生成提醒"
              />
            </View>
          </>
        ) : null}

        <View className="mb-10 border-[3rpx] border-black border-solid rounded-[16rpx] bg-[#f4f4f4] p-4">
          <Text className="text-[22rpx] text-[#666]">备注</Text>
          <Input
            className="h-[72rpx] text-[28rpx] mt-2"
            value={note}
            onInput={(event) => setNote(event.detail.value)}
            placeholder="可选"
          />
        </View>

        <View
          className="w-full h-[96rpx] border-[3rpx] border-black border-solid bg-[#FFD93B] rounded-[50rpx] flex items-center justify-center"
          onClick={handleSave}
        >
          <Text className="text-[32rpx] font-bold">保存记录</Text>
        </View>
      </View>
    </BasicLayout>
  );
});

export default AddPetRecord;

