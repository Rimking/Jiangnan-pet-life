/**
 * 基础Layout
 * 包含：
 * 1. 底部TabBar显隐
 * 2. 现代轻量化金融/数据类小程序 UI 风格
 */

import Taro, {
  useRouter,
  useLoad,
} from '@tarojs/taro';
import { getRouteByPath } from '@/routes/utils';
import { View } from '@tarojs/components';
import { twMerge } from '@weapp-tailwindcss/merge';
import { ReactNode, useMemo } from 'react';
import TabBar from '@/components/tabBar';
import NavTab, { CustomNavOption } from '@/components/navBar';
import { savedBottomPx } from '@/utils/system';
import NavLocBox from '@/components/commom/NavLocBox';
import { gradients, shadows } from '@/styles/theme';

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
  } = props;

  const { path } = useRouter();

  /** 路由信息 */
  const routerInfo = useMemo(() => getRouteByPath(path), [path]);
  
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
      className={twMerge('w-screen h-screen min-h-screen', wrapClassName)}
      style={{
        background: gradients.pageBg,
        paddingBottom: routerInfo?.isTabBar ? savedBottomPx : undefined,
        ...wrapStyle,
      }}
    >
      {headerRender}

      {/* 主要内容区域 */}
      <View style={{ flex: 1, overflow: 'auto' }}>
        {children}
      </View>

      {/* TabBar - 统一处理 */}
      {routerInfo?.isTabBar && <TabBar />}
    </View>
  );
};

export default BasicLayout;
