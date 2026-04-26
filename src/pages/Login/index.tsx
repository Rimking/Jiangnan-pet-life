import BasicLayout from '@/layout/basicLayout';
import { wechatLoginData } from '@/api/data';
import { setLoginSession } from '@/utils/authState';
import { Image, Text, View } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import { memo, useMemo, useState } from 'react';
import LogoSvg from '@/assets/logoIcon/login-icon.svg';

const TAB_PAGES = new Set([
  '/pages/PetProfile/index',
  '/pages/PetSchedule/index',
  '/pages/PetKnowledge/index',
  '/pages/PetOwner/index',
]);

const Login = memo(function Login() {
  const { params } = useRouter();
  const [loading, setLoading] = useState(false);
  const redirectUrl = useMemo(() => {
    if (!params.redirect) {
      return '';
    }
    try {
      return decodeURIComponent(params.redirect);
    } catch {
      return '';
    }
  }, [params.redirect]);

  const goNext = () => {
    if (redirectUrl) {
      if (TAB_PAGES.has(redirectUrl)) {
        Taro.switchTab({ url: redirectUrl });
        return;
      }

      Taro.redirectTo({ url: redirectUrl }).catch(() => {
        Taro.navigateBack({ delta: 1 });
      });
      return;
    }

    Taro.switchTab({ url: '/pages/PetProfile/index' });
  };

  const handleLogin = async () => {
    if (loading) {
      return;
    }

    setLoading(true);
    try {
      const loginResult = await Taro.login();
      if (!loginResult.code) {
        throw new Error('未获取到微信登录凭证');
      }

      let profile: Record<string, any> = {};
      try {
        const userProfile = await Taro.getUserProfile({
          desc: '用于完善你的养宠档案信息',
        });
        profile = userProfile?.userInfo || {};
      } catch {
        profile = {};
      }

      const result = await wechatLoginData({
        code: loginResult.code,
        nickname: profile.nickName,
        avatarUrl: profile.avatarUrl,
        gender:
          profile.gender === 1 ? 'male' : profile.gender === 2 ? 'female' : undefined,
        country: profile.country,
        province: profile.province,
        city: profile.city,
        language: profile.language,
      });

      setLoginSession(result.token, result.user);
      Taro.showToast({ title: '微信登录成功', icon: 'success' });
      setTimeout(goNext, 300);
    } catch (error: any) {
      Taro.showToast({
        title: error?.message || '登录失败，请稍后再试',
        icon: 'none',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <BasicLayout
      wrapClassName="w-[100vw] h-[100vh] flex flex-col justify-center items-center px-6"
      wrapStyle={{ background: 'linear-gradient(180deg, #FFE68D 0%, #FFFCE0 100%)' }}
      navOptions={{ navTitle: '', needBack: false }}
    >
      <View className="w-[320rpx] h-[320rpx] rounded-[24rpx] mb-6 bg-white border-[3rpx] border-[#262626] flex items-center justify-center">
        <Image src={LogoSvg} className="w-[200rpx] h-[200rpx]" />
      </View>

      <Text className="text-[34rpx] font-semibold text-[#333] mb-2">微信登录</Text>
      <Text className="text-[24rpx] text-[#6a6a6a] mb-3">
        登录后可同步宠物档案、收藏、里程碑、反馈和个人记录
      </Text>
      <Text className="text-[22rpx] text-[#8a8a8a] mb-8">
        浏览知识库、查看文章和基础页面不受影响，涉及写入和个人数据同步时再登录即可
      </Text>

      <View
        className="w-[360rpx] h-[84rpx] bg-[#F88D4C] rounded-[42rpx] border-[3rpx] border-[#262626] flex items-center justify-center"
        onClick={handleLogin}
      >
        <Text className="text-[28rpx] text-[#FFF] font-semibold">
          {loading ? '登录中...' : '微信登录'}
        </Text>
      </View>
    </BasicLayout>
  );
});

export default Login;
