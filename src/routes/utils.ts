/** 路由配置相关工具 */
import routeConfigList from './index';

export const getRouteByPath = (path: string) => {
  return routeConfigList.find((item) => path.startsWith(item.path));
};
