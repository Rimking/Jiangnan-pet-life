import { PropsWithChildren } from 'react';
import Taro, { useLaunch, setStorageSync, onAppHide, onAppShow } from '@tarojs/taro';

import '@/assets/css/index.scss';

function App({ children }: PropsWithChildren<any>) {
  useLaunch((data) => {});

  /** 小程序进入后台 */
  onAppHide(() => {
    setStorageSync('APP_STATUS', 'BACK');
  });

  /** 小程序进入前台 */
  onAppShow(() => {
    setStorageSync('APP_STATUS', 'FRONT');
  });

  // children 是将要会渲染的页面
  return children;
}

export default App;
