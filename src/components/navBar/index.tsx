import { View, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { getStatusBarHeight, getTitleBarHeight, getMenuButtonSize } from '@/utils/system';
import Back from '@/assets/back.png';
import clsx from 'clsx';
import { gradients, shadows, borderRadius, typography } from '@/styles/theme';

export interface CustomNavOption {
  /** 是否需要左侧返回 */
  needBack?: boolean;
  /** 左侧自定义内容 */
  leftCustomNode?: React.ReactNode;
  /** 导航栏标题 */
  navTitle?: string;
  /** 背景色 */
  background?: string;
  /** 是否使用渐变背景 */
  useGradient?: boolean;
  /** 中间自定义节点 */
  centerCustomNode?: React.ReactNode;
  /** 标题自定义颜色 */
  customTitleColor?: React.CSSProperties;

  backClick?: () => void;
}

/** 自定义 navBar - 现代轻量化金融/数据类小程序风格 */
function NavTab(props: CustomNavOption) {
  const {
    leftCustomNode,
    navTitle = '',
    background = 'transparent',
    useGradient = false,
    centerCustomNode,
    needBack = true,
    customTitleColor,
    backClick,
  } = props;

  // 获取当前设备系统栏高度
  const statusHeight = Math.floor(getStatusBarHeight());

  // 获取当前设备胶囊出的高度
  const titleBarHeight = Math.floor(getTitleBarHeight());

  // 获取当前设备胶囊按钮的大小
  const topButtonSize = getMenuButtonSize().w;

  // 计算当前设备手机导航栏加上胶囊出的总高度
  const navHeight = statusHeight + titleBarHeight;

  // 导航栏样式 - 现代轻量化风格
  const bodyStyle: React.CSSProperties = {
    height: navHeight + 'rpx',
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    zIndex: 40,
    background: useGradient ? gradients.primary : background,
    backdropFilter: 'blur(10px)',
  };

  // 回退按钮样式 - 轻量化设计
  const BACK = () => {
    return (
      <View
        className="w-[80rpx] h-[80rpx] flex justify-center items-center ml-[16px]"
        onClick={() => {
          if (backClick) {
            backClick();
          } else {
            Taro.navigateBack();
          }
        }}
      >
        <View
          style={{
            width: '56rpx',
            height: '56rpx',
            borderRadius: borderRadius.medium,
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Image
            src={Back}
            className="w-[32rpx] h-[32rpx]"
            style={{ opacity: 1 }}
          />
        </View>
      </View>
    );
  };

  return (
    <View className="navTab" style={bodyStyle}>
      <View style={{ height: statusHeight + 'rpx' }} className="w-screen" />
      <View
        style={{
          height: titleBarHeight + 'rpx',
          paddingRight: topButtonSize + 'rpx',
          top: statusHeight + 'rpx',
        }}
        className="flex absolute z-50 w-full items-center"
      >
        {needBack && (leftCustomNode ? leftCustomNode : BACK())}

        {centerCustomNode ? (
          <View className="flex-1 text-center flex justify-center items-center">
            {centerCustomNode}
          </View>
        ) : (
          <View
            className={clsx(
              'flex-1 text-center flex justify-center items-center',
              useGradient ? 'text-white' : 'text-[#2D3748]'
            )}
            style={{
              fontSize: typography.fontSize.lg,
              fontWeight: typography.fontWeight.medium,
              ...customTitleColor,
            }}
          >
            {navTitle}
          </View>
        )}
      </View>
    </View>
  );
}

export default NavTab;
