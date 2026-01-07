/** 路由配置相关utils */
import routeConfigList from './index';

export const getRouteByPath = (path: string) => {
  return routeConfigList.find((item) => path.startsWith(item.path));
};
