import { View } from '@tarojs/components';

interface IProps {
  pieceNumber: number; // 总个数
  percentage: number; // 内部的百分比
  colorObject?: {
    startColor: string; // 开始的颜色
    endColor: string; // 结束的颜色
  };
}

// 动态生成色块，并根据比例进行渲染
const ColorPieceBox = (props: IProps) => {
  const {
    pieceNumber,
    percentage,
    colorObject = {
      startColor: '#475CE6', // 开始的颜色
      endColor: 'rgba(71, 92, 230,0.2)', // 结束的颜色
    },
  } = props;
  const size = 100 / pieceNumber; //计算每个方块的占比
  let internal = percentage; //拷贝一下
  const percentageList: number[] = [];
  // 循环生成对应个数方块，每个方块的占比为100 / pieceNumber，然后把内部的百分比减去，直到内部的百分比为0
  for (let i = 0; i < pieceNumber; i++) {
    if (internal - size >= 0) {
      percentageList.push(100);
      internal = internal - size;
    } else if (internal > 0 && internal - size <= 0) {
      percentageList.push(Math.floor(internal * pieceNumber));
      internal = internal - size;
    } else {
      percentageList.push(0);
      internal = internal - size;
    }
  }
  // console.log('percentageList', percentageList);

  return (
    <View className="flex w-full ">
      {/* 生成节点。 */}
    {Array(pieceNumber)
        .fill(0)
        .map((r, i) => {
        return (
            <View key={i}
            className=" w-[28rpx] h-[28rpx] mr-[8px]"
            style={{
                backgroundImage: `linear-gradient(to right, ${colorObject.startColor} 0%, ${colorObject.startColor} ${percentageList[i]}%,
        ${colorObject.endColor} 0%,${colorObject.endColor}  ${100 - percentageList[i]}%)`,
            }}
            ></View>
        );
        })}
    </View>
  );
};

export default ColorPieceBox;
