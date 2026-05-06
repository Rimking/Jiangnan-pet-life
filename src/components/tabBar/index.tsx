import { View, Text, Image } from '@tarojs/components';
import { pxTransform, switchTab, useRouter, navigateTo } from '@tarojs/taro';
import { memo } from 'react';
import { getSystemTabBarHeight } from '@/utils/system';
import { TAB_BAR_HEIGHT } from '@/constants/tabbar';
import clsx from 'clsx';
import PointIcon from '@/assets/oldBarICon/point.svg';
import { DEFAULT_TAB_LIST } from './dataSource';

function TabBar() {
  const { path } = useRouter();
  const safeBottom = getSystemTabBarHeight();

  const tabBarStyle = {
    paddingBottom: `${safeBottom}px`,
    height: pxTransform(TAB_BAR_HEIGHT + safeBottom),
    borderRadius: '16px 16px 0 0',
  };

  const handleClick = (item: any) => {
    if (item.isAdd) {
      navigateTo({ url: item.path });
      return;
    }

    switchTab({ url: item.path });
  };

  return (
    <View
      className="fixed bottom-0 w-screen bg-[#ffffff] flex justify-center items-center z-[50]"
      style={tabBarStyle}
    >
      {DEFAULT_TAB_LIST.map((item) => (
        <View
          key={item.path}
          className="flex-[1] flex h-full flex-col justify-center items-center relative"
          onClick={() => handleClick(item)}
        >
          {item.isAdd ? (
            <View
              className="w-[120px] h-[120px] flex justify-center items-center rounded-[12px]"
              style={{ transform: 'rotate(45deg)' }}
            >
              <Image
                src={path === item.path ? item.activeIcon : item.icon}
                style={{ transform: 'rotate(-45deg)' }}
                className="w-[80px] h-[80px] flex-shrink-0"
              />
            </View>
          ) : (
            <Image
              src={path === item.path ? item.activeIcon : item.icon}
              className="w-[44px] h-[44px] flex-shrink-0 mb-2"
            />
          )}

          {path === item.path ? (
            <Image src={PointIcon} className="w-2 h-2 absolute bottom-1 right-[28rpx]" />
          ) : null}

          {!item.isAdd ? (
            <Text
              className={clsx(
                'text-[20px] leading-none',
                path === item.path ? 'text-second' : 'text-third'
              )}
            >
              {item.name}
            </Text>
          ) : null}
        </View>
      ))}
    </View>
  );
}

export default memo(TabBar);
