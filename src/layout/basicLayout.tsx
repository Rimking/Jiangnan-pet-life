/**
 * 基础 Layout
 * 包含：
 * 1. 底部 TabBar 显隐
 */

import { useRouter } from '@tarojs/taro';
import { getRouteByPath } from '@/routes/utils';
import { View } from '@tarojs/components';
import { twMerge } from '@weapp-tailwindcss/merge';
import { ReactNode, useMemo } from 'react';
import TabBar from '@/components/tabBar';
import NavTab, { CustomNavOption } from '@/components/navBar';
import { savedBottomPx } from '@/utils/system';
import NavLocBox from '@/components/commom/NavLocBox';

interface Props {
  children: ReactNode;
  wrapClassName?: string;
  wrapStyle?: React.CSSProperties;
  navOptions?: CustomNavOption;
  statusBarLoc?: boolean;
  bottomLogo?: boolean;
  bottomBgColor?: boolean;
}

const BasicLayout = (props: Props) => {
  const { children, wrapClassName, wrapStyle, navOptions, statusBarLoc } = props;
  const { path } = useRouter();

  const routerInfo = useMemo(() => getRouteByPath(path), [path]);

  const headerRender = useMemo(() => {
    if (navOptions) {
      return <NavTab {...navOptions} />;
    }
    return statusBarLoc ? <NavLocBox /> : null;
  }, [statusBarLoc, navOptions]);

  return (
    <View
      className={twMerge('w-screen h-screen', wrapClassName)}
      style={{
        paddingBottom: routerInfo?.isTabBar ? savedBottomPx : undefined,
        ...wrapStyle,
      }}
    >
      {headerRender}
      {children}
      {routerInfo?.isTabBar && <TabBar />}
    </View>
  );
};

export default BasicLayout;
