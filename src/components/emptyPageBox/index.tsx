import { Image, View } from '@tarojs/components';
import emptyPageIcon from '@/assets/emptyPageIcon.svg';

interface IProps {
  children?: React.ReactNode; // 特殊节点
  emptyImage?: string; // 空图片
  emptyFirstText: string; // 空文字
  emptySecondText?: string; // 空文字
  emptyStrongText?: string; // 空文字
  needStrong?: boolean; // 是否需要着重
  styleArray?: Record<string, string>;
  className?: string;
}

export interface IEmptyPageBoxProps extends IProps {}

// 动态生成色块，并根据比例进行渲染
const EmptyPageBox = (props: IProps) => {
  const {
    children,
    emptyImage,
    emptyFirstText = '',
    emptySecondText = '',
    styleArray,
    className = '',
  } = props;

  return (
    <View
      className={`${className} flex flex-1  w-full h-full box-border justify-center items-center bg-[#FFFFFF] `}
      style={styleArray}
    >
      {children ? (
        children
      ) : (
        <View className="w-full h-full flex flex-col items-center justify-center box-border">
          <Image
            src={emptyImage ? emptyImage : emptyPageIcon}
            className="w-[150px] h-[132px]"
          ></Image>
          {emptyFirstText ? (
            <View className="text-[28px] text-[#626A6A] mt-8">{emptyFirstText}</View>
          ) : null}

          {emptySecondText.length ? (
            <View className="text-[24px] text-fourth mt-2">{emptySecondText}</View>
          ) : null}
        </View>
      )}
    </View>
  );
};

export default EmptyPageBox;
