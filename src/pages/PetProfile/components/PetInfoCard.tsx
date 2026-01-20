import { View, Text } from '@tarojs/components';
import { memo } from 'react';

const PetInfoCard = memo(function PetInfoCard() {
  return (
    <View className="w-full px-[36px]">
      <View className=" px-[16px] py-[30px] bg-[#FFFFFF] border-[4px] border-black border-solid rounded-[16px] shadow-[0_2px_8px_rgba(0,0,0,0.1)] ">
        <View className='w-[100px] h-[20px] bg-[#FF6B6B] rounded-[10px] mb-4 border-[2px] border-black border-solid m-auto'></View>
        <View className='flex items-center'>
        {/* 头像 */}
        <View className="w-[240px] h-[240px] mr-10 rounded-lg  border-[4px] border-black border-solid flex items-center justify-center" style={{
          transform:'rotate(-10deg)'
        }}>
          <Text className="text-[32px]">🐱</Text>
        </View>
        {/* 基础信息 */} 
        <View className="flex-1 mb-4 relative">
          {/* 编辑入口 */}
          <View className="absolute -top-[30px] right-0 w-[100px] h-[50px] flex items-center justify-center bg-black rounded-[20px]">
            <Text className=" text-[#FFFFFF]">编辑</Text>
          </View>

          <View className="flex items-center mb-4">
            <Text className="text-[48px] font-bold mr-[8px]">火火</Text>
            <Text className="text-[40px] text-[#FF6B6B] mr-[8px]">♂</Text>
          </View>
          <View className="text-[32px] text-[#666] mb-4">6个月 | 5kg</View>
          <View className="flex gap-[8px]">
            {['运动', '可爱', '粘人'].map((tag, index) => (
              <View
                key={index}
                className="text-[24px] text-[#666] px-[16px] py-[8px] bg-[#FFE082] rounded-[20px]"
              >
                <Text className="text-[24px] text-[#666]">{tag}</Text>
              </View>
            ))}
          </View>
        </View>
        </View>
      </View>
    </View>
  );
});

export default PetInfoCard;
