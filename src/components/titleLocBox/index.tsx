import { Image, Text, View } from '@tarojs/components';
import React, { memo } from 'react';
import NextSvg from '@/assets/next.svg';
import DownSvg from '@/assets/down.svg';
import LeftPointSvg from '@/assets/left_point.svg';
import styles from './index.module.scss';

interface IProps {
  title?: string;
  nextTitle?: string; // 右侧标题
  nextTitleNode?: React.ReactNode; // 右侧标题
  nextTitleStyle?: string;
  showRight?: boolean; // 是否显示右侧标题
  useDown?: boolean; // 右侧标题图标选用哪一个
  leftOffset?: number; // 左偏移量
  showNextIcon?: boolean; // 是否显示右侧图标
  rightIconContent?: React.ReactNode; // 右侧图标处内容
  nextClick?: () => void; // 右侧标题点击事件
  onClick?: () => void; // 标题点击事件
}

/** 自定义标题栏*/
function TitleLocBox(props: IProps) {
  const {
    title = '',
    nextTitle = '',
    showRight = true,
    nextClick = () => {},
    useDown = false,
    leftOffset = -32,
    nextTitleNode,
    showNextIcon = true,
    nextTitleStyle = '',
    rightIconContent = null,
    onClick = () => {},
  } = props;
  //
  return (
    <View
      className={`${styles.titleBox} font-normal relative w-full h-[100px] py-[32px] box-border flex items-center justify-between`}
      onClick={onClick}
    >
      {/* 左侧超出的标题 */}
      <Image
        src={LeftPointSvg}
        className="w-[16px] h-[16px] absolute"
        style={{ left: leftOffset + 'rpx' }}
      ></Image>
      <View className="flex-1 text-first text-[28rpx]">{title}</View>
      {showRight ? (
        <View className="text-[24rpx] text-third flex items-center" onClick={nextClick}>
          {nextTitleNode ? (
            nextTitleNode
          ) : (
            <Text className={`${nextTitleStyle} mr-[4px]`}>{nextTitle}</Text>
          )}
          {showNextIcon ? (
            rightIconContent ? (
              rightIconContent
            ) : (
              <Image
                src={useDown ? DownSvg : NextSvg}
                style={{
                  width: useDown ? '14rpx' : '20rpx',
                  height: useDown ? '14rpx' : '20rpx',
                }}
              ></Image>
            )
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

export default memo(TitleLocBox);
