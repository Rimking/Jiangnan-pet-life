import { TAB_BAR_HEIGHT } from '@/constants/tabbar';
import Taro, { pxTransform } from '@tarojs/taro';

const systemInfo = Taro.getSystemInfoSync();

export const getNavHeightInfo = () => {
  // 状态栏高度(电池等信息的状态栏)
  let statusBarHeight = (systemInfo.statusBarHeight! * 750) / systemInfo.screenWidth;
  let rect = Taro.getMenuButtonBoundingClientRect();
  let titleBarHeight =
    (((rect.top - systemInfo.statusBarHeight!) * 2 + rect.height) * 750) /
    systemInfo.screenWidth;
  return [statusBarHeight, titleBarHeight];
};

// 状态栏高度
export const getStatusBarHeight = () =>
  ((systemInfo.statusBarHeight || 0) * 750) / systemInfo.screenWidth;

// 获取标题栏高度
export const getTitleBarHeight = () => {
  const rect = Taro.getMenuButtonBoundingClientRect();
  const titleBarHeight =
    (((rect.top - (systemInfo.statusBarHeight || 0)) * 2 + rect.height) * 750) /
    systemInfo.screenWidth;
  return titleBarHeight;
};

// 胶囊宽度
export const getMenuButtonSize = () => {
  return {
    w: Taro.getMenuButtonBoundingClientRect().width,
    h: Taro.getMenuButtonBoundingClientRect().height,
  };
};

/** 获取手机底部tabBar高度(安全区高度) */
export const getSystemTabBarHeight = () => {
  if (systemInfo.safeArea) {
    return systemInfo.screenHeight - systemInfo.safeArea.bottom;
  }

  return 0;
};

// tabbar页面预留高度
// 预留一下地步滑动区域，确保看完,安全区+tabar 128 + 50
export const savedBottomPx = pxTransform(getSystemTabBarHeight() + TAB_BAR_HEIGHT + 50);

// 返回一个状态栏+胶囊的高度函数
export const getStatusNavHeight =
  Math.floor(getStatusBarHeight()) + Math.floor(getTitleBarHeight());
