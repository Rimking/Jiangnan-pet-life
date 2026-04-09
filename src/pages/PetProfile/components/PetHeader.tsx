import { View, Text, Text as TaroText } from '@tarojs/components';
import { memo } from 'react';
import { useAtom } from 'jotai';
import { userAtom } from '@/store';
import { typography } from '@/styles/theme';

const PetHeader = memo(function PetHeader() {
  const [user] = useAtom(userAtom);
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '早上好';
    if (hour < 18) return '下午好';
    return '晚上好';
  };

  return (
    <View className="pet-header px-8 py-6 flex justify-between items-center">
      <View>
        <Text 
          className="flex items-center"
        >
          <Text className="text-2xl mr-2">📍</Text>
          <Text style={{ fontSize: typography.fontSize.md, color: '#8C8C8C' }}>我的位置</Text>
        </Text>
      </View>
      <View className="flex items-center">
        <View className="relative">
          <Text className="text-3xl">🔔</Text>
          <View className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full" />
        </View>
      </View>
    </View>
  );
});

export default PetHeader;