import { View, Text, Image } from '@tarojs/components';
import { pxTransform, switchTab, useRouter, navigateTo } from '@tarojs/taro';
import { memo } from 'react';
import { getSystemTabBarHeight } from '@/utils/system';
import { TAB_BAR_HEIGHT } from '@/constants/tabbar';
import { DEFAULT_TAB_LIST } from './dataSource';
import { borderRadius, shadows, gradients, typography } from '@/styles/theme';

function TabBar() {
  const { path } = useRouter();

  // 获取底部安全区高度
  const savedBottom = getSystemTabBarHeight();
  
  // 底部tabbar的样式 - 现代轻量化风格
  const tabBarStyle = {
    paddingBottom: savedBottom + 'px', // 底部安全区高度
    height: pxTransform(TAB_BAR_HEIGHT + savedBottom), // 底部tabbar的高度
    borderRadius: borderRadius.xl + ' 0 0',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    boxShadow: shadows.medium,
    backdropFilter: 'blur(10px)',
  };

  // 点击就跳转之对应的tabbar
  const handleClick = (item: any) => {
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
      className="fixed bottom-0 w-screen flex justify-center items-center z-[50]"
      style={tabBarStyle}
    >
      {/* 生成flex布局的tabbar */}
      {DEFAULT_TAB_LIST.map((item, index) => (
        <View
          key={item.path}
          className="flex-[1] flex h-full flex-col justify-center items-center relative"
          onClick={() => {
            handleClick(item);
          }}
        >
          {item.isAdd ? (
            <View
              style={{
                width: '100rpx',
                height: '100rpx',
                borderRadius: borderRadius.large,
                background: gradients.primary,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                transform: 'translateY(-20rpx)',
                boxShadow: shadows.strong,
              }}
            >
              <Image
                src={item.icon}
                style={{
                  width: '60rpx',
                  height: '60rpx',
                }}
              />
            </View>
          ) : (
            <>
              <Image
                src={path === item.path ? item.activeIcon : item.icon}
                style={{
                  width: '48rpx',
                  height: '48rpx',
                  marginBottom: '8rpx',
                }}
              />
              <Text
                style={{
                  fontSize: typography.fontSize.xs,
                  fontWeight: path === item.path ? typography.fontWeight.medium : typography.fontWeight.regular,
                  color: path === item.path ? '#6B73FF' : '#718096',
                }}
              >
                {item.name}
              </Text>
            </>
          )}
        </View>
      ))}
    </View>
  );
}

export default memo(TabBar);
