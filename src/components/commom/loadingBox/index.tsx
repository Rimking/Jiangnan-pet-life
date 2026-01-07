import { View } from '@tarojs/components';
import { RequestType } from '@/assets/js/loading';
import { Loading } from '@antmjs/vantui';
import { useEffect, useState } from 'react';

interface IProps {
  loadingType: RequestType;
  children: React.ReactNode; // 子元素，用于传递需要包裹的内容
}

/** 加载loading */
function LoadingBox(props: IProps) {
  const { loadingType = RequestType.LOADING, children } = props;
  //
  const [defaultLoading, setDefaultLoading] = useState(loadingType);

  useEffect(() => {
    setDefaultLoading(loadingType);
  }, [loadingType]);

  return (
    <View className="w-auto h-auto relative">
      {defaultLoading === RequestType.LOADING ? (
        <View
          className="w-full h-full flex justify-center items-center absolute left-0 top-0 z-[10]"
          style={{
            backgroundColor: 'rgba(255,255,255,0.8)',
          }}
        >
          <Loading className=" w-[50px] h-[50px] " color="#1989fa" />
        </View>
      ) : null}

      {children}
    </View>
  );
}

export default LoadingBox;
