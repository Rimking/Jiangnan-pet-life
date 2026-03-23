import { View, Text } from '@tarojs/components';
import { memo } from 'react';

const UserInfoHeader = memo(function UserInfoHeader() {

  const testlist = [
    {
      name: 'RimKing',
      days: '20',
    },
    {
      name: 'RimKing2',
      days: '10',
    }
  ]

  const ItemRender = (item, index) => {
    return (
      <View className="absolute w-full h-[80px] bg-white border-[2px] border-black border-solid rounded-[50px] text-center leading-[80px]"
        style={{
          transform: `rotate(${index / 2 === 0 ? 0 : 4}deg)`
        }} key={item.name}>和{item.name}在一起{item.days}天了</View>
    )
  }

  return (
    <>
      <View className=" py-[40rpx] px-[32rpx]  bg-white border-4 border-black border-solid rounded-[32rpx]" style={{ boxShadow: '0 4rpx 16rpx rgba(0,0,0,0.08)' }}>
        <View className="flex items-center ">
          <View className="w-[144rpx] h-[144rpx] rounded-full  border-2 border-black border-solid bg-yellow-300 flex items-center justify-center mr-[32rpx]" style={{ boxShadow: '0 4rpx 12rpx rgba(255, 224, 130, 0.3)' }}>
          </View>
          <View className="flex-1 h-full  flex flex-col">
            {/* 名字 */}
            <View className="text-[40rpx] h-[60px] font-bold mb-[12rpx] block text-gray-800">RimKing ♂</View>

            {/* 基础信息 */}
            <View className="h-[60px] ">个性签名</View>
          </View>
        </View>
      </View>

      {/* 和某某在一起多少天了，这里会查出来所有的pet，进行轮播 */}
      <View className="w-full h-[100px] flex items-center justify-center relative mt-[15px]">
        {testlist.map((item, index) => (
          ItemRender(item, index)
        ))}
      </View>
    </>
  );
});

export default UserInfoHeader;