import Taro from '@tarojs/taro';

export const showDemoPendingToast = (feature: string) => {
  Taro.showToast({
    title: `演示模式：${feature}待接入`,
    icon: 'none',
  });
};

export const showDemoSuccessToast = (message: string) => {
  Taro.showToast({
    title: `演示模式：${message}`,
    icon: 'success',
  });
};
