import { View } from '@tarojs/components';
import { clsx } from 'clsx';

interface ConfirmButtonProps {
  needReset?: boolean;
  resetButtonText?: React.ReactNode | string;
  confirmButtonText?: React.ReactNode | string;
  // 置灰状态
  disabledStyle?: boolean;
  className?: string;
  resetClick?: (...rest) => void;
  confirmClick: (...rest) => void;
}

export default function Index(props: ConfirmButtonProps) {
  const {
    className = '',
    needReset,
    resetButtonText = '重置',
    confirmButtonText = '确定',
    disabledStyle = false,
    resetClick = () => {},
    confirmClick = () => {},
  } = props;
  return (
    <View className={clsx('w-full flex h-[80px]', className)}>
      {/* 重置 */}
      {needReset ? (
        <View
          onClick={resetClick}
          className="bg-[#F7FAFA] border-none w-[160px] h-[80px] mr-[16px] text-[#626A6A] text-[32px] flex justify-center items-center rounded-[4px]"
        >
          {resetButtonText}
        </View>
      ) : null}
      <View
        className="flex-1 h-[80px] border-none flex justify-center items-center rounded-[4px] text-[32px]"
        onClick={() => {
          if (disabledStyle) return;
          confirmClick();
        }}
        style={{
          boxShadow: disabledStyle ? 'none' : '0rpx 10rpx 16rpx 0rpx rgba(71,92,230,0.4)',
          backgroundImage: disabledStyle
            ? 'none'
            : 'linear-gradient( 308deg, #6577ED 0%, #475CE6 100%)',
          backgroundColor: disabledStyle ? '#ECEEEE' : '',
          color: disabledStyle ? '#AFB6B6' : '#FFFFFF',
        }}
      >
        {confirmButtonText}
      </View>
    </View>
  );
}
