/**
 * 基础Layout
 * 包含：
 * 1. 底部TabBar显隐
 */

import Taro, {
  useRouter,
  useDidShow,
  useLoad,
  redirectTo,
  getStorageSync,
  setStorageSync,
} from '@tarojs/taro';
import { getRouteByPath } from '@/routes/utils';
import { View, Image } from '@tarojs/components';
import { twMerge } from '@weapp-tailwindcss/merge';
import { ReactNode, useCallback, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import TabBar from '@/components/tabBar';
import NavTab, { CustomNavOption } from '@/components/navBar';
import { savedBottomPx } from '@/utils/system';
import NavLocBox from '@/components/commom/NavLocBox';

interface Props {
  children: ReactNode;
  /** 容器类名 */
  wrapClassName?: string;
  /** 容器样式 */
  wrapStyle?: React.CSSProperties;
  /** 导航栏配置 */
  navOptions?: CustomNavOption;
  /** 状态栏占位 */
  statusBarLoc?: boolean;
  /** 底部是否展示矩阵通Logo */
  bottomLogo?: boolean;
  /** 底部是否显示覆盖在logo后的圆形 */
  bottomBgColor?: boolean;
}

const BasicLayout = (props: Props) => {
  const {
    children,
    wrapClassName,
    wrapStyle,
    navOptions,
    statusBarLoc,
    bottomLogo,
    bottomBgColor,
  } = props;

  const { path, params } = useRouter();
  console.log(path);

  /** 路由信息 */
  const routerInfo = useMemo(() => getRouteByPath(path), [path]);
  console.log('routerInfo', routerInfo);
  /**
   * 头部渲染
   * 1. 优先渲染导航栏
   * 2. 其次渲染状态栏占位
   * 3. 最后不渲染
   */
  const headerRender = useMemo(() => {
    if (navOptions) {
      return <NavTab {...navOptions} />;
    }
    return statusBarLoc ? <NavLocBox /> : null;
  }, [statusBarLoc, navOptions]);

  useLoad(() => {});

  return (
    <View
      className={twMerge('w-screen h-screen', wrapClassName)}
      style={{
        paddingBottom: routerInfo?.isTabBar ? savedBottomPx : undefined,
        ...wrapStyle,
      }}
    >
      {headerRender}

      {/* 主要内容区域 */}
      {children}

      {/* TabBar - 统一处理 */}
      {routerInfo?.isTabBar && <TabBar />}
    </View>
  );
};

export default BasicLayout;
