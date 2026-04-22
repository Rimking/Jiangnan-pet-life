import { PropsWithChildren } from 'react';
import { useLaunch } from '@tarojs/taro';

import '@/assets/css/index.scss';

function App({ children }: PropsWithChildren<any>) {
  useLaunch(() => {});

  return children;
}

export default App;
