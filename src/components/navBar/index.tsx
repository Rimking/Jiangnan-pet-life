import { View, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { getStatusBarHeight, getTitleBarHeight, getMenuButtonSize } from '@/utils/system';
import Back from '@/assets/back.png';
import clsx from 'clsx';

export interface CustomNavOption {
  /** 是否需要左侧返回 */
  needBack?: boolean;
  /** 左侧自定义内容 */
  leftCustomNode?: React.ReactNode;
  /** 导航栏标题 */
  navTitle?: string;
  /** 背景色 */
  background?: string;
  /** 中间自定义节点 */
  centerCustomNode?: React.ReactNode;
  /** 标题自定义颜色 */
  customTitleColor?: React.CSSProperties;

  backClick?: () => void; // 右侧标题点击事件
}

/** 自定义navBar*/
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

  // 获取当前设备系统栏高度
  const statusHeight = Math.floor(getStatusBarHeight());

  // 获取当前设备胶囊出的高度。
  const titleBarHeight = Math.floor(getTitleBarHeight());

  // 获取当前设备胶囊按钮的大小。
  const topButtonSize = getMenuButtonSize().w;

  // 计算当前设备手机导航栏加上胶囊出的总高度。
  const navHeight = statusHeight + titleBarHeight;
  const bodyStyle = {
    height: navHeight + 'rpx',
    backgroundColor: background,
  };

  // 回退
  const BACK = () => {
    return (
      <View
        className="w-[80px] flex justify-center items-center "
        onClick={() => {
          if (backClick) {
            backClick();
          } else {
            Taro.navigateBack();
          }
        }}
      >
        <Image src={Back} className="w-[40px] h-[40px]"></Image>
      </View>
    );
  };

  return (
    <View className="navTab box-border " style={bodyStyle}>
      <View style={{ height: statusHeight + 'rpx' }} className="w-screen"></View>
      <View
        style={{
          height: titleBarHeight + 'rpx',
          paddingRight: topButtonSize + 'rpx',
          top: statusHeight + 'rpx',
        }}
        className="flex absolute z-50 w-full"
      >
        {needBack && (leftCustomNode ? leftCustomNode : BACK())}

        {centerCustomNode ? (
          <View className="flex-1 text-center flex justify-center items-center" style={{}}>
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
