/**
 * 跳转相关封装
 * 1. 页面跳转函数
 * 2. 获取转发url
 */

import Taro, { navigateTo, switchTab, reLaunch } from '@tarojs/taro';
import { getRouteByPath } from '@/routes/utils';

type navigateOptions = Parameters<typeof navigateTo>[0];
type switchTabOptions = Parameters<typeof switchTab>[0];

type Props = navigateOptions & switchTabOptions;

/**
 * 页面跳转函数
 * @param props - navigateOptions & switchTabOptions
 * @description
 * 1. 根据url获取路由信息
 * 2. 如果是tabBar页面使用switchTab跳转
 * 3. 非tabBar页面使用navigateTo跳转
 * @example
 * ```ts
 * navigatePro({ url: '/pages/index/index' ,success:(res)=>{},fail:(res)=>{},complete:(res)=>{}})
 * ```
 */
const navigatePro = (props: Props) => {
  const { url, ...rest } = props;
  if (!url) return;
  const route = getRouteByPath(url);
  if (!route) return;

  // tabBar页面，使用switchTab跳转
  if (route.isTabBar) {
    switchTab({
      url,
      ...rest,
    });
  } else {
    navigateTo({
      url,
      ...rest,
    });
  }
};

export default navigatePro;
