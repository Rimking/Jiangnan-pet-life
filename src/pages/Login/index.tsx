import BasicLayout from '@/layout/basicLayout';
import { Image, Text, View } from '@tarojs/components';
import { memo } from 'react';
import Taro from '@tarojs/taro';
import LogoSvg from '@/assets/logoIcon/login-icon.svg';
import { showDemoSuccessToast } from '@/utils/demoToast';

const Login = memo(function Login() {
  return (
    <BasicLayout
      wrapClassName="w-[100vw] h-[100vh] flex flex-col justify-center items-center px-6"
      wrapStyle={{ background: 'linear-gradient(180deg, #FFE68D 0%, #FFFCE0 100%)' }}
      navOptions={{ navTitle: '', needBack: false }}
    >
      <View className="w-[320rpx] h-[320rpx] rounded-[24rpx] mb-6 bg-white border-[3rpx] border-[#262626] flex items-center justify-center">
        <Image src={LogoSvg} className="w-[200rpx] h-[200rpx]" />
      </View>

      <Text className="text-[34rpx] font-semibold text-[#333] mb-2">欢迎来到宠物世界</Text>
      <Text className="text-[24rpx] text-[#6a6a6a] mb-8">先登录，再开始你的养宠记录</Text>

      <View
        className="w-[360rpx] h-[84rpx] bg-[#F88D4C] rounded-[42rpx] border-[3rpx] border-[#262626] flex items-center justify-center"
        onClick={() => {
          showDemoSuccessToast('登录成功');
          setTimeout(() => Taro.switchTab({ url: '/pages/PetProfile/index' }), 350);
        }}
      >
        <Text className="text-[28rpx] text-[#FFF] font-semibold">微信登录</Text>
      </View>
    </BasicLayout>
  );
});

export default Login;



