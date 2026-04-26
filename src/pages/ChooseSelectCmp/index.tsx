import BasicLayout from '@/layout/basicLayout';
import { View, Text } from '@tarojs/components';
import { memo, useMemo } from 'react';
import Taro from '@tarojs/taro';
import { formatLocalDateKey } from '@/utils/formatDate';
import { usePetApiPets } from '@/hooks/usePetApiPets';
import { ensureLoggedIn } from '@/utils/authState';

type ShortcutEntry = {
  title: string;
  desc: string;
  actionText: string;
  tone?: 'yellow' | 'blue' | 'pink';
  action: () => void;
};

const ChooseSelectCmp = memo(function ChooseSelectCmp() {
  const { activePetId } = usePetApiPets();
  const today = formatLocalDateKey(new Date());

  const shortcutEntries = useMemo<ShortcutEntry[]>(
    () => [
      {
        title: '宠物档案',
        desc: '查看当前宠物卡片、今日照护和最近成长节点。',
        actionText: '打开首页',
        action: () => Taro.switchTab({ url: '/pages/PetProfile/index' }),
      },
      {
        title: '宠物日程',
        desc: '查看日历、提醒和当天记录。',
        actionText: '查看日程',
        tone: 'blue',
        action: () => Taro.switchTab({ url: '/pages/PetSchedule/index' }),
      },
      {
        title: '新增提醒',
        desc: '快速创建一条新的宠物提醒。',
        actionText: '去创建',
        action: () => {
          if (!ensureLoggedIn('/pages/ChooseSelectCmp/index')) {
            return;
          }
          if (!activePetId) {
            Taro.navigateTo({ url: '/pages/EditPetProfile/index' });
            return;
          }
          Taro.navigateTo({ url: `/pages/AddPetReminder/index?petId=${activePetId}&date=${today}` });
        },
      },
      {
        title: '新增记录',
        desc: '进入日常、花销和护理记录页。',
        actionText: '去记录',
        tone: 'pink',
        action: () => {
          if (!ensureLoggedIn('/pages/ChooseSelectCmp/index')) {
            return;
          }
          if (!activePetId) {
            Taro.navigateTo({ url: '/pages/EditPetProfile/index' });
            return;
          }
          Taro.navigateTo({
            url: `/pages/AddPetRecord/index?petId=${activePetId}&date=${today}&mode=record`,
          });
        },
      },
      {
        title: '铲屎官主页',
        desc: '查看多宠切换、服务入口和最近成长摘要。',
        actionText: '打开主页',
        action: () => Taro.switchTab({ url: '/pages/PetOwner/index' }),
      },
      {
        title: '知识库',
        desc: '查看分类、文章列表和收藏状态。',
        actionText: '进入知识库',
        tone: 'blue',
        action: () => Taro.switchTab({ url: '/pages/PetKnowledge/index' }),
      },
      {
        title: '成长里程碑',
        desc: '记录第一次到家、出门、疫苗完成等重要节点。',
        actionText: '记录节点',
        tone: 'pink',
        action: () => Taro.navigateTo({ url: '/pages/PetMilestones/index' }),
      },
      {
        title: '快捷创建提醒',
        desc: '用一页表单快速补一条提醒。',
        actionText: '快速创建',
        action: () => Taro.navigateTo({ url: '/pages/SendPetSchedule/index' }),
      },
      {
        title: '食物管理',
        desc: '维护库存、主粮和过敏提醒。',
        actionText: '进入食物页',
        tone: 'yellow',
        action: () => Taro.navigateTo({ url: '/pages/PetFood/index' }),
      },
      {
        title: '用药管理',
        desc: '维护疗程、剂量和提醒安排。',
        actionText: '进入用药页',
        tone: 'blue',
        action: () => Taro.navigateTo({ url: '/pages/PetMedicine/index' }),
      },
    ],
    [activePetId, today]
  );

  return (
    <BasicLayout
      wrapClassName="w-full h-full"
      wrapStyle={{ background: 'linear-gradient(180deg, #FFE68D 0%, #FFFCE0 100%)', minHeight: '100vh' }}
      navOptions={{ navTitle: '常用入口', needBack: true }}
    >
      <View className="px-6 pt-4 pb-[120rpx]">
        <View className="mb-5 border-[2rpx] border-solid border-[#262626] rounded-[16rpx] bg-white p-4">
          <Text className="text-[30rpx] font-semibold mb-2 block">项目常用入口</Text>
          <Text className="text-[22rpx] text-[#666] mb-3 block">
            这里汇总了当前项目最常用的真实页面和快捷动作，方便联调、自测和快速回到高频功能。
          </Text>

          <View className="flex flex-col gap-2">
            {shortcutEntries.map((item) => (
              <View
                key={item.title}
                className="rounded-[14rpx] border border-[#d7d7d7] p-3"
                style={{
                  backgroundColor:
                    item.tone === 'blue'
                      ? '#EEF5FF'
                      : item.tone === 'pink'
                        ? '#FFF2F7'
                        : '#FFF9E7',
                }}
              >
                <Text className="text-[24rpx] font-semibold text-[#303030] block">{item.title}</Text>
                <Text className="text-[20rpx] text-[#6f6f6f] mt-1 block">{item.desc}</Text>
                <View className="mt-2 h-[62rpx] rounded-[34rpx] bg-[#FFD93B] border-[2rpx] border-solid border-[#262626] flex items-center justify-center" onClick={item.action}>
                  <Text className="text-[24rpx] font-semibold">{item.actionText}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View className="rounded-[16rpx] bg-white border-[2rpx] border-solid border-[#262626] p-4">
          <Text className="text-[28rpx] font-semibold mb-3 block">联调建议</Text>
          <Text className="text-[22rpx] text-[#666] leading-[1.7] block">
            现在项目的核心闭环已经集中在宠物档案、日程、记录、食物、用药、里程碑、知识库和反馈里。
            如果要自测一条完整链路，建议从“登录 → 添加宠物 → 新增提醒/记录 → 查看时间线/报告”这条顺序开始。
          </Text>
        </View>
      </View>
    </BasicLayout>
  );
});

export default ChooseSelectCmp;
