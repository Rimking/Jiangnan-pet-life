import BasicLayout from '@/layout/basicLayout';
import { View, Text, Input } from '@tarojs/components';
import { memo, useMemo, useState } from 'react';
import Taro from '@tarojs/taro';
import { useAtom } from 'jotai';
import { addPetAtom } from '@/store';

const AddPet = memo(function AddPet() {
  const [, addPet] = useAtom(addPetAtom);
  const [name, setName] = useState('');
  const [breed, setBreed] = useState('');
  const [birthday, setBirthday] = useState('2024-01-01');
  const [weight, setWeight] = useState('5');
  const [gender, setGender] = useState<'male' | 'female'>('female');

  const disabled = useMemo(() => !name.trim() || !breed.trim(), [name, breed]);

  const handleSave = () => {
    if (disabled) {
      Taro.showToast({ title: '请先填写姓名和品种', icon: 'none' });
      return;
    }

    addPet({
      name: name.trim(),
      breed: breed.trim(),
      birthday,
      weight: Number(weight) || 0,
      gender,
      avatar: gender === 'female' ? '🐱' : '🐶',
    });

    Taro.showToast({ title: '已添加宠物', icon: 'success' });
    setTimeout(() => Taro.navigateBack(), 350);
  };

  return (
    <BasicLayout navOptions={{ navTitle: '添加宠物', needBack: true }}>
      <View className="px-8 pt-28 pb-10">
        <View className="bg-white rounded-2xl p-6 shadow-sm flex flex-col gap-4">
          <Text className="text-[30rpx] font-bold">宠物档案</Text>

          <View>
            <Text className="text-[24rpx] text-gray-500">姓名</Text>
            <Input className="mt-2 p-3 bg-gray-50 rounded-xl" value={name} onInput={(e) => setName(e.detail.value)} placeholder="例如：火火" />
          </View>

          <View>
            <Text className="text-[24rpx] text-gray-500">品种</Text>
            <Input className="mt-2 p-3 bg-gray-50 rounded-xl" value={breed} onInput={(e) => setBreed(e.detail.value)} placeholder="例如：英短" />
          </View>

          <View>
            <Text className="text-[24rpx] text-gray-500">生日（YYYY-MM-DD）</Text>
            <Input className="mt-2 p-3 bg-gray-50 rounded-xl" value={birthday} onInput={(e) => setBirthday(e.detail.value)} />
          </View>

          <View>
            <Text className="text-[24rpx] text-gray-500">体重（kg）</Text>
            <Input className="mt-2 p-3 bg-gray-50 rounded-xl" type="number" value={weight} onInput={(e) => setWeight(e.detail.value)} />
          </View>

          <View className="flex flex-row gap-3">
            <View className={`px-4 py-2 rounded-full ${gender === 'female' ? 'bg-blue-100' : 'bg-gray-100'}`} onClick={() => setGender('female')}>
              <Text>母</Text>
            </View>
            <View className={`px-4 py-2 rounded-full ${gender === 'male' ? 'bg-blue-100' : 'bg-gray-100'}`} onClick={() => setGender('male')}>
              <Text>公</Text>
            </View>
          </View>

          <View className={`mt-2 p-3 rounded-xl ${disabled ? 'bg-gray-200' : 'bg-blue-500'}`} onClick={handleSave}>
            <Text className={`text-center ${disabled ? 'text-gray-500' : 'text-white'}`}>保存宠物</Text>
          </View>
        </View>
      </View>
    </BasicLayout>
  );
});

export default AddPet;
