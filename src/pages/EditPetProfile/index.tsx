import BasicLayout from '@/layout/basicLayout';
import { View, Text, Input, Textarea } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import { memo, useEffect, useMemo, useState } from 'react';
import { PET_UI } from '@/constants/petUi';
import {
  createPetData,
  CreatePetParams,
  getPetDetailData,
  updatePetData,
} from '@/api/data';

const typeOptions = [
  { label: '猫咪', value: 'cat' },
  { label: '狗狗', value: 'dog' },
  { label: '鸟类', value: 'bird' },
  { label: '兔兔', value: 'rabbit' },
];

const genderOptions = [
  { label: '公', value: 'male' as const },
  { label: '母', value: 'female' as const },
];

const isValidDateString = (value: string) => {
  if (!value) {
    return true;
  }
  const matched = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!matched) {
    return false;
  }

  const year = Number(matched[1]);
  const month = Number(matched[2]);
  const day = Number(matched[3]);
  const target = new Date(`${matched[1]}-${matched[2]}-${matched[3]}T00:00:00`);

  return (
    !Number.isNaN(target.getTime()) &&
    target.getFullYear() === year &&
    target.getMonth() + 1 === month &&
    target.getDate() === day
  );
};

const defaultForm: CreatePetParams = {
  name: '',
  type: 'cat',
  breed: '',
  birthday: '',
  gender: 'male',
  weight: 0,
  color: '',
  sterilized: false,
  notes: '',
};

const EditPetProfile = memo(function EditPetProfile() {
  const { params } = useRouter();
  const petId = params.petId || '';
  const mode = params.mode === 'edit' ? 'edit' : 'create';
  const [loading, setLoading] = useState(mode === 'edit');
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<CreatePetParams>(defaultForm);

  const pageTitle = useMemo(() => (mode === 'edit' ? '编辑宠物' : '新增宠物'), [mode]);

  useEffect(() => {
    if (mode !== 'edit' || !petId) {
      return;
    }

    setLoading(true);
    getPetDetailData(petId)
      .then((pet) => {
        setForm({
          name: pet.name || '',
          type: pet.type || 'cat',
          breed: pet.breed || '',
          birthday: pet.birthday || '',
          gender: pet.gender === 'female' ? 'female' : 'male',
          weight: Number(pet.weight || 0),
          color: pet.color || '',
          sterilized: Boolean(pet.sterilized),
          notes: pet.notes || '',
        });
      })
      .catch((error) => {
        const message = error instanceof Error ? error.message : '宠物信息加载失败';
        Taro.showToast({ title: message, icon: 'none' });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [mode, petId]);

  const updateField = <K extends keyof CreatePetParams>(key: K, value: CreatePetParams[K]) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      Taro.showToast({ title: '请填写宠物名字', icon: 'none' });
      return;
    }

    if (!form.type.trim()) {
      Taro.showToast({ title: '请选择宠物类型', icon: 'none' });
      return;
    }

    if (form.birthday && !isValidDateString(form.birthday.trim())) {
      Taro.showToast({ title: '生日格式不正确', icon: 'none' });
      return;
    }

    const payload: CreatePetParams = {
      ...form,
      name: form.name.trim(),
      breed: form.breed?.trim() || undefined,
      birthday: form.birthday?.trim() || undefined,
      color: form.color?.trim() || undefined,
      notes: form.notes?.trim() || undefined,
      weight: form.weight && form.weight > 0 ? Number(form.weight) : undefined,
    };

    setSaving(true);
    try {
      if (mode === 'edit' && petId) {
        await updatePetData(petId, payload);
      } else {
        await createPetData(payload);
      }
      Taro.showToast({
        title: mode === 'edit' ? '宠物信息已更新' : '宠物已添加',
        icon: 'success',
      });
      setTimeout(() => Taro.navigateBack(), 300);
    } catch (error) {
      const message = error instanceof Error ? error.message : '保存失败';
      Taro.showToast({ title: message, icon: 'none' });
    } finally {
      setSaving(false);
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
        navTitle: pageTitle,
        needBack: true,
      }}
    >
      <View className="p-8 pb-[120rpx]">
        {loading ? (
          <View className="mb-6">
            <Text className="text-[#666] text-[24rpx]">宠物信息加载中...</Text>
          </View>
        ) : null}

        <View className="mb-5">
          <Text className="text-[24rpx] text-[#666] mb-2 block">宠物名字</Text>
          <View className="border-[3rpx] border-black border-solid rounded-[16rpx] bg-[#f4f4f4] p-4">
            <Input
              className="h-[72rpx] text-[28rpx]"
              value={form.name}
              placeholder="例如：火火"
              onInput={(event) => updateField('name', event.detail.value)}
            />
          </View>
        </View>

        <View className="mb-5">
          <Text className="text-[24rpx] text-[#666] mb-2 block">宠物类型</Text>
          <View className="flex gap-2 flex-wrap">
            {typeOptions.map((item) => (
              <View
                key={item.value}
                className="px-4 py-2 rounded-[16rpx] border-[2rpx] border-solid border-[#262626]"
                style={{ backgroundColor: form.type === item.value ? '#ffd93b' : '#f4f4f4' }}
                onClick={() => updateField('type', item.value)}
              >
                <Text className="text-[24rpx]">{item.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className="mb-5">
          <Text className="text-[24rpx] text-[#666] mb-2 block">品种</Text>
          <View className="border-[3rpx] border-black border-solid rounded-[16rpx] bg-[#f4f4f4] p-4">
            <Input
              className="h-[72rpx] text-[28rpx]"
              value={form.breed}
              placeholder="例如：英短、金毛"
              onInput={(event) => updateField('breed', event.detail.value)}
            />
          </View>
        </View>

        <View className="mb-5">
          <Text className="text-[24rpx] text-[#666] mb-2 block">生日</Text>
          <View className="border-[3rpx] border-black border-solid rounded-[16rpx] bg-[#f4f4f4] p-4">
            <Input
              className="h-[72rpx] text-[28rpx]"
              value={form.birthday}
              placeholder="YYYY-MM-DD"
              onInput={(event) => updateField('birthday', event.detail.value)}
            />
          </View>
        </View>

        <View className="mb-5">
          <Text className="text-[24rpx] text-[#666] mb-2 block">性别</Text>
          <View className="flex gap-2">
            {genderOptions.map((item) => (
              <View
                key={item.value}
                className="flex-1 py-3 rounded-[16rpx] border-[2rpx] border-solid border-[#262626] flex items-center justify-center"
                style={{ backgroundColor: form.gender === item.value ? '#ffe3ef' : '#f4f4f4' }}
                onClick={() => updateField('gender', item.value)}
              >
                <Text className="text-[24rpx]">{item.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className="mb-5">
          <Text className="text-[24rpx] text-[#666] mb-2 block">体重（kg）</Text>
          <View className="border-[3rpx] border-black border-solid rounded-[16rpx] bg-[#f4f4f4] p-4">
            <Input
              className="h-[72rpx] text-[28rpx]"
              value={form.weight ? String(form.weight) : ''}
              type="digit"
              placeholder="例如：4.5"
              onInput={(event) => updateField('weight', Number(event.detail.value || 0))}
            />
          </View>
        </View>

        <View className="mb-5">
          <Text className="text-[24rpx] text-[#666] mb-2 block">毛色</Text>
          <View className="border-[3rpx] border-black border-solid rounded-[16rpx] bg-[#f4f4f4] p-4">
            <Input
              className="h-[72rpx] text-[28rpx]"
              value={form.color}
              placeholder="例如：银渐层、奶油色"
              onInput={(event) => updateField('color', event.detail.value)}
            />
          </View>
        </View>

        <View className="mb-5">
          <Text className="text-[24rpx] text-[#666] mb-2 block">绝育状态</Text>
          <View className="flex gap-2">
            {[
              { label: '未绝育', value: false },
              { label: '已绝育', value: true },
            ].map((item) => (
              <View
                key={item.label}
                className="flex-1 py-3 rounded-[16rpx] border-[2rpx] border-solid border-[#262626] flex items-center justify-center"
                style={{ backgroundColor: form.sterilized === item.value ? '#d9f5e4' : '#f4f4f4' }}
                onClick={() => updateField('sterilized', item.value)}
              >
                <Text className="text-[24rpx]">{item.label}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className="mb-10">
          <Text className="text-[24rpx] text-[#666] mb-2 block">备注</Text>
          <View className="border-[3rpx] border-black border-solid rounded-[16rpx] bg-[#f4f4f4] p-4">
            <Textarea
              value={form.notes}
              maxlength={200}
              autoHeight
              placeholder="例如：胆小、对某些食物过敏"
              onInput={(event) => updateField('notes', event.detail.value)}
            />
          </View>
        </View>

        <View
          className="w-full h-[96rpx] border-[3rpx] border-black border-solid bg-[#FFD93B] rounded-[50rpx] flex items-center justify-center"
          onClick={handleSubmit}
        >
          <Text className="text-[32rpx] font-bold">
            {saving ? '保存中...' : mode === 'edit' ? '保存修改' : '创建宠物'}
          </Text>
        </View>
      </View>
    </BasicLayout>
  );
});

export default EditPetProfile;
