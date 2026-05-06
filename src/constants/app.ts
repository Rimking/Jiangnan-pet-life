import Taro from '@tarojs/taro';

export const getPlatform = () => {
  // platform取值范围如下：
  // ios：iOS微信（包含 iPhone、iPad）
  // android：Android微信
  // windows：Windows微信
  // mac：macOS微信
  // devtools：微信开发者工具
  const platform = Taro.getSystemInfoSync().platform;
  return platform.toUpperCase();
};
