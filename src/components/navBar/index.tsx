import { View, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { getStatusBarHeight, getTitleBarHeight, getMenuButtonSize } from '@/utils/system';
import Back from '@/assets/back.png';
import clsx from 'clsx';

export interface CustomNavOption {
  /** 是否需要左侧返回按钮 */
  needBack?: boolean;
  /** 左侧自定义内容 */
  leftCustomNode?: React.ReactNode;
  /** 导航标题 */
  navTitle?: string;
  /** 导航背景色 */
  background?: string;
  /** 中间自定义节点 */
  centerCustomNode?: React.ReactNode;
  /** 标题样式 */
  customTitleColor?: React.CSSProperties;
  /** 自定义返回事件 */
  backClick?: () => void;
}

/** 自定义导航栏 */
function NavTab(props: CustomNavOption) {
  const {
    leftCustomNode,
    navTitle = '',
    background = 'transparent',
    centerCustomNode,
    needBack = true,
    customTitleColor,
    backClick,
  } = props;

  const statusHeight = Math.floor(getStatusBarHeight());
  const titleBarHeight = Math.floor(getTitleBarHeight());
  const topButtonSize = getMenuButtonSize().w;
  const navHeight = statusHeight + titleBarHeight;

  const bodyStyle = {
    height: `${navHeight}rpx`,
    backgroundColor: background,
  };

  const renderBack = () => (
    <View
      className="w-[80px] flex justify-center items-center"
      onClick={() => {
        if (backClick) {
          backClick();
          return;
        }
        Taro.navigateBack();
      }}
    >
      <Image src={Back} className="w-[40px] h-[40px]" />
    </View>
  );

  return (
    <View className="navTab box-border" style={bodyStyle}>
      <View style={{ height: `${statusHeight}rpx` }} className="w-screen" />
      <View
        style={{
          height: `${titleBarHeight}rpx`,
          paddingRight: `${topButtonSize}rpx`,
          top: `${statusHeight}rpx`,
        }}
        className="flex absolute z-50 w-full"
      >
        {needBack ? (leftCustomNode || renderBack()) : null}

        {centerCustomNode ? (
          <View className="flex-1 text-center flex justify-center items-center">
            {centerCustomNode}
          </View>
        ) : (
          <View
            className={clsx(
              'text-[32rpx] flex-1 text-center flex justify-center items-center text-[#FFFFFF]'
            )}
            style={{ ...customTitleColor }}
          >
            {navTitle}
          </View>
        )}
      </View>
    </View>
  );
}

export default NavTab;
