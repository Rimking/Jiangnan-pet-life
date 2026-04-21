import BasicLayout from '@/layout/basicLayout';
import { View, Text } from '@tarojs/components';
import { memo } from 'react';
import { useAtom } from 'jotai';
import { currentPetAtom } from '@/store';

const PetDetailPage = memo(function PetDetailPage() {
  const [pet] = useAtom(currentPetAtom);

  return (
    <BasicLayout
      wrapClassName="w-full h-full"
      wrapStyle={{ backgroundColor: '#FFFCE0', minHeight: '100vh' }}
      navOptions={{ navTitle: '宠物详情', needBack: true }}
    >
      <View style={{ padding: '20px' }}>
        <View style={{ backgroundColor: '#FFF', borderRadius: '20px', padding: '24px', marginBottom: '20px' }}>
          <Text style={{ fontSize: '56px' }}>{pet?.avatar ?? '🐾'}</Text>
          <Text style={{ fontSize: '28px', fontWeight: 'bold', marginTop: '8px' }}>{pet?.name ?? '未选择宠物'}</Text>
          <Text style={{ fontSize: '15px', color: '#666', marginTop: '8px' }}>{pet?.breed ?? '—'} · {pet?.weight ?? 0}kg</Text>
        </View>

        <View style={{ backgroundColor: '#FFF', borderRadius: '16px', padding: '20px' }}>
          <Text style={{ fontSize: '17px', fontWeight: 'bold', marginBottom: '12px' }}>基础信息</Text>
          <Text>生日：{pet?.birthday ?? '—'}</Text>
          <Text>性别：{pet?.gender === 'female' ? '母' : '公'}</Text>
        </View>
      </View>
    </BasicLayout>
  );
});

export default PetDetailPage;
