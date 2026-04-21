import { PropsWithChildren } from 'react';
import { useLaunch, setStorageSync, onAppHide, onAppShow } from '@tarojs/taro';

import '@/assets/css/index.scss';

function App({ children }: PropsWithChildren<any>) {
  useLaunch(() => {});

  onAppHide(() => {
    setStorageSync('APP_STATUS', 'BACK');
  });

  onAppShow(() => {
    setStorageSync('APP_STATUS', 'FRONT');
  });

  return children;
}

export default App;
