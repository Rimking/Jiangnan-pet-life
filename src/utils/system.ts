import { TAB_BAR_HEIGHT } from '@/constants/tabbar';
import Taro, { pxTransform } from '@tarojs/taro';

const systemInfo = Taro.getSystemInfoSync();

export const getNavHeightInfo = () => {
  // 状态栏高度，包含电量、信号等系统信息区域。
  const statusBarHeight = ((systemInfo.statusBarHeight || 0) * 750) / systemInfo.screenWidth;
  const rect = Taro.getMenuButtonBoundingClientRect();
  const titleBarHeight =
    (((rect.top - (systemInfo.statusBarHeight || 0)) * 2 + rect.height) * 750) /
    systemInfo.screenWidth;

  return [statusBarHeight, titleBarHeight];
};

// 状态栏高度
export const getStatusBarHeight = () =>
  ((systemInfo.statusBarHeight || 0) * 750) / systemInfo.screenWidth;

// 标题栏高度
export const getTitleBarHeight = () => {
  const rect = Taro.getMenuButtonBoundingClientRect();
  return (
    (((rect.top - (systemInfo.statusBarHeight || 0)) * 2 + rect.height) * 750) /
    systemInfo.screenWidth
  );
};

// 胶囊按钮尺寸
export const getMenuButtonSize = () => {
  const rect = Taro.getMenuButtonBoundingClientRect();
  return {
    w: rect.width,
    h: rect.height,
  };
};

/** 获取底部安全区高度 */
export const getSystemTabBarHeight = () => {
  if (systemInfo.safeArea) {
    return systemInfo.screenHeight - systemInfo.safeArea.bottom;
  }

  return 0;
};

// 为底部 TabBar 和系统手势区预留滚动空间。
export const savedBottomPx = pxTransform(getSystemTabBarHeight() + TAB_BAR_HEIGHT + 50);

// 状态栏 + 标题栏总高度
export const getStatusNavHeight =
  Math.floor(getStatusBarHeight()) + Math.floor(getTitleBarHeight());
