import { View, Text } from '@tarojs/components';
import { memo } from 'react';

interface PetCardProps {
  name: string;
  type: string;
  age: string;
  weight: string;
  gender: string;
  avatar: string;
}

const PetCard = memo(function PetCard({ name, type, age, weight, gender, avatar }: PetCardProps) {
  return (
    <View className="pet-card" style={{ backgroundColor: '#FFF', borderRadius: '16px', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', marginBottom: '12px' }}>
      <View style={{ display: 'flex', alignItems: 'center' }}>
        <View style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#FFF9E6', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '16px', boxShadow: '0 2px 6px rgba(255, 249, 230, 0.5)' }}>
          <Text style={{ fontSize: '32px' }}>{avatar}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <View style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
            <Text style={{ fontSize: '18px', fontWeight: 'bold', marginRight: '8px', color: '#333' }}>{name}</Text>
            <Text style={{ fontSize: '16px', color: gender === '♂' ? '#FF6B6B' : '#FF69B4' }}>{gender}</Text>
          </View>
          <View style={{ display: 'flex', gap: '8px' }}>
            <Text style={{ fontSize: '13px', color: '#666', backgroundColor: '#F8F9FA', padding: '4px 8px', borderRadius: '8px' }}>{type}</Text>
            <Text style={{ fontSize: '13px', color: '#666', backgroundColor: '#F8F9FA', padding: '4px 8px', borderRadius: '8px' }}>{age}</Text>
            <Text style={{ fontSize: '13px', color: '#666', backgroundColor: '#F8F9FA', padding: '4px 8px', borderRadius: '8px' }}>{weight}</Text>
          </View>
        </View>
        <View style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#FFE082', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: '14px' }}>→</Text>
        </View>
      </View>
    </View>
  );
});

export default PetCard;