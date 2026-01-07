/** 通用列表组件
 * 自定义下拉未做，如需求需要自定义在增加。
 * 目前只实现了常见的滚动监听和上拉下拉加载等一些常见钩子，如需要其他功能，请自行增加。
 */
import { getStatusNavHeight } from '@/utils/system';
import { ScrollView, ScrollViewProps, View } from '@tarojs/components';
import { CSSProperties, forwardRef, useImperativeHandle, useState } from 'react';
import EmptyPageBox, { IEmptyPageBoxProps } from '../emptyPageBox';

interface IProps extends ScrollViewProps {
  // 子组件
  children: React.ReactNode;
  // 是否启用下拉刷新
  startEnableRefresher?: boolean;
  // 是否开启下拉
  // trigger?: boolean; // true是开，false是关
  // 自定义滚动高度
  scrollHeight?: string;
  // 无记录
  noListData?: boolean;
  // 无记录文案,作为默认参数
  noDataText?: string;
  // 空列表组件props
  emptyPageBoxProps?: IEmptyPageBoxProps;
  // 无更多数据
  noMoreData?: boolean;
  // 无更多数据文案
  noMoreDataText?: string;
  // 滚动事件
  onScroll?: (...rest) => void;
  // 自定义时间被下拉
  onRefresherPulling?: (...rest) => void;
  // 加载更多
  onLoadMore?: () => void;
  // 下拉刷新
  onRefresh?: () => void;
}

const ScrollViewList = forwardRef((props: IProps, ref) => {
  const {
    scrollHeight,
    style,
    // trigger,
    startEnableRefresher = true,
    noMoreData = false,
    noListData = false,
    noDataText = '暂无数据',
    emptyPageBoxProps = {},
    noMoreDataText = '没有更多了',
    onLoadMore = () => {},
    onRefresh = () => {},
    onScroll = () => {},
    onRefresherPulling = () => {},
    ...restProps
  } = props;
  // 当前点击的元素id
  const [currentSelectId, setCurrentSelectId] = useState<string>('');

  const [trigger, setTrigger] = useState(false);

  useImperativeHandle(ref, () => ({
    // 设置当前的视图id
    setViewId(id: string) {
      setCurrentSelectId(id);
    },
    // 设置刷新是否关闭
    setTrigger(value: boolean) {
      setTrigger(value);
    },
    // 获取开关
    getTrigger() {
      return trigger;
    },
  }));
  return (
    <ScrollView
      className="w-full min-h-[1000px]"
      style={{
        height: scrollHeight ? scrollHeight : `calc(100vh - ${getStatusNavHeight}px`,
        ...(style as CSSProperties),
      }}
      lowerThreshold={50}
      onScrollToLower={onLoadMore}
      onRefresherRefresh={onRefresh}
      onScroll={onScroll}
      refresherEnabled={startEnableRefresher}
      refresherThreshold={64}
      refresherTriggered={trigger}
      scrollY
      showScrollbar={false}
      enhanced
      enableFlex
      enableBackToTop
      scrollIntoView={currentSelectId}
      onRefresherPulling={onRefresherPulling}
      {...restProps}
    >
      {/* 调试的时候没有数据传假数据可以把这个放开 */}
      {/* {props?.children} */}
      {noListData ? (
        <EmptyPageBox emptyFirstText={noDataText} {...emptyPageBoxProps}></EmptyPageBox>
      ) : (
        props?.children
      )}
      {/* 没有更多数据了 */}
      {noMoreData ? (
        <View className="w-full h-[100px] text-[#889191] text-[24px] flex items-center justify-center">
          {noMoreDataText}
        </View>
      ) : null}
    </ScrollView>
  );
});

export default ScrollViewList;
