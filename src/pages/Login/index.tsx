import BasicLayout from '@/layout/basicLayout';
import { Image, Text, View } from '@tarojs/components';
import { memo } from 'react';
import LogoSvg from '@/assets/logoIcon/login-icon.svg';

// 登录页
const Login = memo(function PetProfile() {
  return (
    <BasicLayout
      wrapClassName="w-[100vw]  flex flex-col justify-center items-center "
      wrapStyle={{
        backgroundImage: 'linear-gradient( to bottom ,#FFE68D 10%, #FFFCE0 100%)',
        height: '100vh',
      }}
      navOptions={{
        navTitle: '',
        needBack: false,
      }}
      >
          {/* 登录页的内容 */}
          <View className="w-[320rpx] h-[320rpx] bg-red-300 rounded-[20rpx] mb-5 flex items-center justify-center">
            <Image src={LogoSvg} className="w-[200rpx] h-[200rpx]" />
          </View>
          {/* 欢迎来到宠物世界 */}
          <View className="w-full h-[80rpx]  flex items-center justify-center">
            <Text className="text-[28rpx]">欢迎来到宠物世界</Text>
          </View>
          {/* 微信登录 */}
          <View className="w-[320rpx] h-[80rpx] bg-[#F88D4C] rounded-[40rpx] flex items-center justify-center">
            <Text className="text-[28rpx] text-[#FFF]">微信登录</Text>
          </View>
    </BasicLayout>
  );
});

export default Login;
