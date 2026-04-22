import BasicLayout from '@/layout/basicLayout';
import { View, Text } from '@tarojs/components';
import { memo, useMemo, useState } from 'react';
import Taro from '@tarojs/taro';
import { formatLocalDateKey } from '@/utils/formatDate';

const PET_TYPES = ['猫咪', '狗狗', '兔子', '仓鼠', '鹦鹉'];
const PET_TAGS = ['活泼', '亲人', '爱吃', '爱睡觉', '需要训练'];

type DemoEntry = {
  title: string;
  desc: string;
  actionText: string;
  action: () => void;
};

const ChooseSelectCmp = memo(function ChooseSelectCmp() {
  const [type, setType] = useState('猫咪');
  const [tag, setTag] = useState('活泼');
  const today = formatLocalDateKey(new Date());

  const demoEntries = useMemo<DemoEntry[]>(
    () => [
      {
        title: '01 宠物档案（首页）',
        desc: '查看宠物卡片、花销洞察和今日科普。',
        actionText: '进入档案',
        action: () => Taro.switchTab({ url: '/pages/PetProfile/index' }),
      },
      {
        title: '02 宠物日程（记录/提醒）',
        desc: '演示提醒开关、日历切换和记录聚合。',
        actionText: '进入日程',
        action: () => Taro.switchTab({ url: '/pages/PetSchedule/index' }),
      },
      {
        title: '03 新增提醒（静态表单）',
        desc: '演示提醒表单填写与保存提示。',
        actionText: '新增提醒',
        action: () => Taro.navigateTo({ url: `/pages/AddPetReminder/index?petId=pet-fire&date=${today}` }),
      },
      {
        title: '04 新增记录（静态表单）',
        desc: '演示日常/花销/护理三种记录模式。',
        actionText: '新增记录',
        action: () =>
          Taro.navigateTo({
            url: `/pages/AddPetRecord/index?petId=pet-fire&date=${today}&mode=record`,
          }),
      },
      {
        title: '05 铲屎官主页（重构页）',
        desc: '演示参考布局、功能菜单和宠物切换。',
        actionText: '进入铲屎官',
        action: () => Taro.switchTab({ url: '/pages/PetOwner/index' }),
      },
      {
        title: '06 知识库（静态内容）',
        desc: '演示分类筛选与文章列表占位。',
        actionText: '进入知识库',
        action: () => Taro.switchTab({ url: '/pages/PetKnowledge/index' }),
      },
      {
        title: '07 发布日程（静态页）',
        desc: '演示快速发布表单与成功提示。',
        actionText: '发布日程',
        action: () => Taro.navigateTo({ url: '/pages/SendPetSchedule/index' }),
      },
    ],
    [today]
  );

  return (
    <BasicLayout
      wrapClassName="w-full h-full"
      wrapStyle={{ background: 'linear-gradient(180deg, #FFE68D 0%, #FFFCE0 100%)', minHeight: '100vh' }}
      navOptions={{ navTitle: '演示路线与组件', needBack: true }}
    >
      <View className="px-6 pt-4 pb-[120rpx]">
        <View className="mb-5 border-[2rpx] border-solid border-[#262626] rounded-[16rpx] bg-white p-4">
          <Text className="text-[30rpx] font-semibold mb-2 block">项目演示入口</Text>
          <Text className="text-[22rpx] text-[#666] mb-3 block">按顺序点按钮可完成整套静态演示，不依赖后端接口。</Text>

          <View className="flex flex-col gap-2">
            {demoEntries.map((item) => (
              <View key={item.title} className="rounded-[14rpx] bg-[#f7f7f7] border border-[#d7d7d7] p-3">
                <Text className="text-[24rpx] font-semibold text-[#303030] block">{item.title}</Text>
                <Text className="text-[20rpx] text-[#6f6f6f] mt-1 block">{item.desc}</Text>
                <View className="mt-2 h-[62rpx] rounded-[34rpx] bg-[#FFD93B] border-[2rpx] border-solid border-[#262626] flex items-center justify-center" onClick={item.action}>
                  <Text className="text-[24rpx] font-semibold">{item.actionText}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View className="mb-5 border-[2rpx] border-solid border-[#262626] rounded-[16rpx] bg-white p-4">
          <Text className="text-[28rpx] font-semibold mb-3 block">组件演示：宠物类型</Text>
          <View className="flex flex-wrap gap-2">
            {PET_TYPES.map((item) => (
              <View
                key={item}
                className="px-3 py-2 rounded-[14rpx] border-[2rpx] border-solid border-[#262626]"
                style={{ backgroundColor: type === item ? '#FFD93B' : '#F4F4F4' }}
                onClick={() => setType(item)}
              >
                <Text className="text-[23rpx]">{item}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className="mb-6 border-[2rpx] border-solid border-[#262626] rounded-[16rpx] bg-white p-4">
          <Text className="text-[28rpx] font-semibold mb-3 block">组件演示：宠物标签</Text>
          <View className="flex flex-wrap gap-2">
            {PET_TAGS.map((item) => (
              <View
                key={item}
                className="px-3 py-2 rounded-[14rpx] border-[2rpx] border-solid border-[#262626]"
                style={{ backgroundColor: tag === item ? '#BDEEFF' : '#F4F4F4' }}
                onClick={() => setTag(item)}
              >
                <Text className="text-[23rpx]">{item}</Text>
              </View>
            ))}
          </View>
        </View>

        <View
          className="h-[92rpx] rounded-[48rpx] bg-[#FFD93B] border-[3rpx] border-solid border-[#262626] flex items-center justify-center"
          onClick={() => Taro.showToast({ title: `已选择：${type} / ${tag}`, icon: 'none' })}
        >
          <Text className="text-[30rpx] font-bold">确认选择</Text>
        </View>
      </View>
    </BasicLayout>
  );
});

export default ChooseSelectCmp;

