/** 使用forward 的方式重新搞了一下。*/

import { Text, View } from '@tarojs/components';
import React, {
  useEffect,
  useState,
  ReactElement,
  CSSProperties,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { clsx } from 'clsx';
import styles from './index.module.scss';

/**
 * PopWindow组件的属性类型定义
 */
interface PopWindowProps {
  /** 弹窗内容 */
  children: ReactElement;
  /** 关闭弹窗的回调函数 */
  close?: () => void;
  /** 弹窗标题 */
  title?: string;
  /** 自定义样式 */
  style?: CSSProperties;
  /** 是否显示头部，默认为true */
  showHeader?: boolean;
  /** 是否允许点击蒙层关闭弹窗，默认为false */
  isClick?: boolean;
  /** 是否允许页面滚动，false禁止滚动，true可以滚动，默认为false */
  cancelCatchMove?: boolean;
  /** 内容区域的自定义类名 */
  contentClassName?: string;
  /** 是否允许内容区域滚动，默认为false */
  scroll?: boolean;
  /** 标题区域的自定义类名 */
  titleClassName?: string;
}

const PopWindow = forwardRef(function PopWindow(props: PopWindowProps, ref) {
  const {
    close,
    children,
    title,
    style,
    showHeader = true,
    isClick = false,
    cancelCatchMove = false,
    contentClassName = '',
    scroll = false,
    titleClassName = '',
  } = props;

  const [animaFlag, setAnimaFlag] = useState(true);

  // 显隐
  const [show, setShow] = useState(false);

  // 暴露给父组件的方法
  useImperativeHandle(ref, () => ({
    open() {
      setShow(true);
      setAnimaFlag(true);
    },
    close() {
      setShow(false);
    },
  }));

  /** 弹窗关闭动画完成后执行回调 */
  useEffect(() => {
    if (!animaFlag) {
      setTimeout(() => {
        close && close();
      }, 250);
    }
  }, [animaFlag, close]);

  const animaPop = () => {
    setAnimaFlag(false);
    setShow(false);
  };

  return show ? (
    <View
      className={
        animaFlag ? styles.mask : styles.mask_down + ' relative z-[900] pointer-events-none'
      }
      style={style}
      catchMove={!cancelCatchMove}
      onClick={() => {
        isClick && animaPop();
      }}
    >
      <View className={`${animaFlag ? styles.pop : styles.pop_down} ${contentClassName}`}>
        {showHeader ? (
          <View
            className={clsx(
              `${styles.filter_title} h-[100px] flex px-[48px] box-border`,
              titleClassName
            )}
            style={{
              borderBottom: '1px solid #E1E6E6',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <View
              className="text-third text-[24px] flex items-center h-full w-[80px]"
              onClick={animaPop}
            >
              取消
            </View>
            <Text className="flex-1 text-[28px] text-first text-center">{title}</Text>
            {/* 目前是占位，后面有东西也可以放在这里 */}
            <View className="text-third text-[24px] flex items-center h-full w-[80px]"></View>
          </View>
        ) : null}
        <View style={{ height: scroll ? '100%' : '' }}>
          {React.cloneElement(children, { backFunc: setAnimaFlag })}
        </View>
      </View>
    </View>
  ) : null;
});

export default PopWindow;
