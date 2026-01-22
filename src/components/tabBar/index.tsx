import { View, Text, Image } from '@tarojs/components';
import { pxTransform, switchTab, useRouter, navigateTo } from '@tarojs/taro';
import { memo, useMemo } from 'react';
import { twMerge } from '@weapp-tailwindcss/merge';
import { getSystemTabBarHeight } from '@/utils/system';
import { TAB_BAR_HEIGHT } from '@/constants/tabbar';
import { getRouteByPath } from '@/routes/utils';
import clsx from 'clsx';
import PointIcon from '@/assets/oldBarICon/point.svg';
import { DEFAULT_TAB_LIST } from './dataSource';

function TabBar() {
  const { path } = useRouter();

  // 获取底部安全区高度
  const savedBottom = getSystemTabBarHeight();
  // 底部tabbar的样式
  const tabBarStyle = {
    paddingBottom: savedBottom + 'px', // 底部安全区高度
    height: pxTransform(TAB_BAR_HEIGHT + savedBottom), // 底部tabbar的高度
    borderRadius: '16px 16px 0 0',
  };

  // 点击就跳转之对应的tabbar
  const handleClick = (item: any) => {
    console.log('item.path', item.path);
    if (item.isAdd) {
      // 加号按钮使用navigateTo跳转到创建计划页面
      navigateTo({ url: item.path });
    } else {
      // 其他按钮使用switchTab
      switchTab({ url: item.path });
    }
  };

  return (
    <View
      className="fixed bottom-0 w-screen  bg-[#ffffff] flex justify-center items-center z-[50]"
      style={tabBarStyle}
    >
      {/* 生成flex布局的tabbar */}
      {DEFAULT_TAB_LIST.map((item, index) => (
        <View
          key={item.path}
          className="flex-[1] flex h-full flex-col justify-center items-center"
          onClick={() => {
            handleClick(item);
          }}
        >
          {item.isAdd ? (
            <div
              className="w-[120px] h-[120px] flex justify-center items-center  rounded-[12px]"
              style={{ transform: 'rotate(45deg)' }}
            >
              <Image
                src={path === item.path ? item.activeIcon : item.icon}
                style={{
                  transform: 'rotate(-45deg)',
                }}
                className={clsx('w-[100px] h-[100px] flex-shrink-0 ', {
                  'w-[80px] h-[80px]': item.isAdd,
                })}
              ></Image>
            </div>
          ) : (
            <Image
              src={path === item.path ? item.activeIcon : item.icon}
              className={clsx('w-[44px] h-[44px] flex-shrink-0 mb-2 ', {
                'w-[80px] h-[80px]': item.isAdd,
              })}
            ></Image>
          )}

          {path === item.path && (
            <Image src={PointIcon} className="w-2 h-2 absolute bottom-1 right-0"></Image>
          )}

          {/* `${index === 2? "w-14 h-14 flex-shrink-0 " : "w-12 h-12 flex-shrink-0 "}` */}
          {!item.isAdd && (
            <Text
              className={clsx(
                'text-[20px]',
                path === item.path ? 'text-second' : 'text-third'
              )}
            >
              {item.name}
            </Text>
          )}
        </View>
      ))}
    </View>
  );
}

export default memo(TabBar);
