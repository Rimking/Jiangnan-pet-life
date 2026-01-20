import { View, Text } from '@tarojs/components';
import { memo } from 'react';

const PetDetail = memo(function PetDetail() {
  return (
    <View className="pet-detail" style={{ flex: 1, backgroundColor: '#FFFCE0' }}>
      <View style={{ padding: '16px', borderBottom: '1px solid #E0E0E0', display: 'flex', alignItems: 'center', backgroundColor: '#FFF', boxShadow: '0 2px 6px rgba(0,0,0,0.05)' }}>
        <View style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#E0E0E0', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: '16px' }}>
          <Text style={{ fontSize: '16px', color: '#666' }}>←</Text>
        </View>
        <Text style={{ fontSize: '18px', fontWeight: 'bold', flex: 1, color: '#333' }}>宠物详情</Text>
        <View style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#FFE082', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: '16px' }}>✏️</Text>
        </View>
      </View>

      <View style={{ padding: '20px' }}>
        <View style={{ backgroundColor: '#FFF', borderRadius: '20px', padding: '24px', marginBottom: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <View style={{ width: '120px', height: '120px', borderRadius: '50%', backgroundColor: '#FFF9E6', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', boxShadow: '0 4px 12px rgba(255, 249, 230, 0.4)' }}>
            <Text style={{ fontSize: '56px' }}>🐱</Text>
          </View>
          <View style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
            <Text style={{ fontSize: '28px', fontWeight: 'bold', marginRight: '12px', color: '#333' }}>火火</Text>
            <Text style={{ fontSize: '20px', color: '#FF6B6B' }}>♂</Text>
          </View>
          <Text style={{ fontSize: '15px', color: '#666', marginBottom: '20px' }}>6个月 | 5kg</Text>
          <View style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {['运动', '可爱', '粘人'].map((tag, index) => (
              <View key={index} style={{ padding: '8px 16px', backgroundColor: '#FFE082', borderRadius: '16px', boxShadow: '0 2px 4px rgba(255, 224, 130, 0.2)' }}>
                <Text style={{ fontSize: '13px', color: '#666', fontWeight: '500' }}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{ backgroundColor: '#FFF', borderRadius: '16px', padding: '20px', marginBottom: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <Text style={{ fontSize: '17px', fontWeight: 'bold', marginBottom: '20px', display: 'block', color: '#333' }}>基本信息</Text>
          <View style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: '13px', color: '#999', marginBottom: '6px', display: 'block' }}>品种</Text>
              <Text style={{ fontSize: '15px', fontWeight: '600', color: '#333' }}>英短</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: '13px', color: '#999', marginBottom: '6px', display: 'block' }}>生日</Text>
              <Text style={{ fontSize: '15px', fontWeight: '600', color: '#333' }}>2024-02-15</Text>
            </View>
          </View>
          <View style={{ display: 'flex', justifyContent: 'space-between' }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: '13px', color: '#999', marginBottom: '6px', display: 'block' }}>体重</Text>
              <Text style={{ fontSize: '15px', fontWeight: '600', color: '#333' }}>5kg</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: '13px', color: '#999', marginBottom: '6px', display: 'block' }}>性别</Text>
              <Text style={{ fontSize: '15px', fontWeight: '600', color: '#FF6B6B' }}>公</Text>
            </View>
          </View>
        </View>

        <View style={{ display: 'flex', gap: '14px', marginBottom: '20px' }}>
          <View style={{ flex: 1, height: '52px', borderRadius: '26px', backgroundColor: '#FFD700', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(255, 215, 0, 0.4)' }}>
            <Text style={{ fontSize: '17px', fontWeight: 'bold', color: '#FFF' }}>编辑</Text>
          </View>
          <View style={{ flex: 1, height: '52px', borderRadius: '26px', backgroundColor: '#FFF', border: '2px solid #E0E0E0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: '17px', fontWeight: 'bold', color: '#666' }}>删除</Text>
          </View>
        </View>

        <View style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <View style={{ width: '100px', height: '100px', borderRadius: '50%', backgroundColor: '#E0E0E0', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.4 }}>
            <Text style={{ fontSize: '48px' }}>🐱</Text>
          </View>
        </View>
      </View>
    </View>
  );
});

export default PetDetail;