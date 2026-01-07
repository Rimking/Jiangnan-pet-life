import { View } from "@tarojs/components";
import { getStatusBarHeight } from "@/utils/system";
import { memo } from "react";



/** 导航空白栏*/
function NavLocBox() {


  // 获取当前设备系统栏高度
  const statusHeight  = Math.floor(getStatusBarHeight()) 
  console.log("statusHeight",statusHeight)
  return (
      <View style={{height:statusHeight+"rpx"}} className="w-screen"></View>
  );
}

export default memo(NavLocBox)
