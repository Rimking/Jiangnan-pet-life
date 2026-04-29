import BasicLayout from '@/layout/basicLayout';
import { View, Text } from '@tarojs/components';
import { memo, useMemo } from 'react';
import Taro from '@tarojs/taro';
import { formatLocalDateKey } from '@/utils/formatDate';
import { usePetApiPets } from '@/hooks/usePetApiPets';
import { setStoredActivePetId, switchTabWithActivePet } from '@/utils/activePetState';
import { ensureLoggedIn } from '@/utils/authState';

type ShortcutEntry = {
  title: string;
  desc: string;
  actionText: string;
  tone?: 'yellow' | 'blue' | 'pink';
  action: () => void;
};

const ChooseSelectCmp = memo(function ChooseSelectCmp() {
  const { activePet, activePetId } = usePetApiPets();
  const currentPetId = activePet?.id || activePetId || '';
  const today = formatLocalDateKey(new Date());
  const ensureActivePetContext = () => {
    if (!ensureLoggedIn('/pages/ChooseSelectCmp/index')) {
      return false;
    }

    if (currentPetId && activePet) {
      return true;
    }

    Taro.showToast({ title: '请先选择或创建宠物', icon: 'none' });
    return false;
  };
  const openPetPage = (url: string) => {
    if (!ensureActivePetContext()) {
      return;
    }
    Taro.navigateTo({ url });
  };

  const shortcutEntries = useMemo<ShortcutEntry[]>(
    () => [
      {
        title: '宠物档案',
        desc: '查看当前宠物卡片、今日照护和最近成长节点。',
        actionText: '打开首页',
        action: () => {
          if (!ensureActivePetContext()) {
            return;
          }
          switchTabWithActivePet('/pages/PetProfile/index', currentPetId);
        },
      },
      {
        title: '宠物日程',
        desc: '查看日历、提醒和当天记录。',
        actionText: '查看日程',
        tone: 'blue',
        action: () => {
          if (!ensureActivePetContext()) {
            return;
          }
          switchTabWithActivePet('/pages/PetSchedule/index', currentPetId);
        },
      },
      {
        title: '新增提醒',
        desc: '快速创建一条新的宠物提醒。',
        actionText: '去创建',
        action: () => {
          if (!ensureActivePetContext()) {
            return;
          }
          openPetPage(`/pages/AddPetReminder/index?petId=${currentPetId}&date=${today}`);
        },
      },
      {
        title: '新增记录',
        desc: '进入日常、花销和护理记录页。',
        actionText: '去记录',
        tone: 'pink',
        action: () => {
          if (!ensureActivePetContext()) {
            return;
          }
          openPetPage(`/pages/AddPetRecord/index?petId=${currentPetId}&date=${today}&mode=record`);
        },
      },
      {
        title: '铲屎官主页',
        desc: '查看多宠切换、服务入口和最近成长摘要。',
        actionText: '打开主页',
        action: () => {
          if (!ensureActivePetContext()) {
            return;
          }
          switchTabWithActivePet('/pages/PetOwner/index', currentPetId);
        },
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
        action: () => openPetPage(`/pages/PetMilestones/index?petId=${currentPetId}`),
      },
      {
        title: '快捷创建提醒',
        desc: '用一页表单快速补一条提醒。',
        actionText: '快速创建',
        action: () => {
          if (!ensureActivePetContext()) {
            return;
          }
          if (currentPetId) {
            setStoredActivePetId(currentPetId);
          }
          openPetPage(`/pages/SendPetSchedule/index?petId=${currentPetId}`);
        },
      },
      {
        title: '食物管理',
        desc: '维护库存、主粮和过敏提醒。',
        actionText: '进入食物页',
        tone: 'yellow',
        action: () => openPetPage(`/pages/PetFood/index?petId=${currentPetId}`),
      },
      {
        title: '用药管理',
        desc: '维护疗程、剂量和提醒安排。',
        actionText: '进入用药页',
        tone: 'blue',
        action: () => openPetPage(`/pages/PetMedicine/index?petId=${currentPetId}`),
      },
    ],
    [activePet, currentPetId, today]
  );
  const nextShortcutActions = currentPetId && activePet
    ? [
        {
          title: '查看报告',
          subtitle: '回看当前宠物摘要、趋势和最近动态',
          onClick: () => openPetPage(`/pages/PetReport/index?petId=${currentPetId}`),
        },
        {
          title: '查看详情',
          subtitle: '回到这只宠物的资料和总览面板',
          onClick: () => openPetPage(`/pages/PetDetailPage/index?petId=${currentPetId}`),
        },
        {
          title: '服务概览',
          subtitle: '继续处理提醒、库存和疗程',
          onClick: () => openPetPage(`/pages/PetServiceCenter/index?mode=member&petId=${currentPetId}`),
        },
      ]
    : [];

  return (
    <BasicLayout
      wrapClassName="w-full h-full"
      wrapStyle={{ background: 'linear-gradient(180deg, #FFE68D 0%, #FFFCE0 100%)', minHeight: '100vh' }}
      navOptions={{ navTitle: '常用入口', needBack: true }}
    >
      <View className="px-6 pt-4 pb-[120rpx]">
        <View className="mb-5 border-[2rpx] border-solid border-[#262626] rounded-[16rpx] bg-[#FFF9E7] p-4">
          <Text className="text-[28rpx] font-semibold text-[#303030] block">当前快捷上下文</Text>
          <Text className="text-[22rpx] text-[#666] mt-2 block">
            {activePet
              ? `当前以 ${activePet.name} 为核心继续操作，提醒、记录、时间线和统计都会优先落到它下面。`
              : '当前还没有明确的宠物上下文，涉及记录和提醒的动作会先引导你选择或创建宠物。'}
          </Text>
          {currentPetId && activePet ? (
            <View className="flex gap-3 mt-4">
              <View
                className="flex-1 h-[62rpx] rounded-[34rpx] bg-[#FFD93B] border-[2rpx] border-solid border-[#262626] flex items-center justify-center"
                onClick={() => {
                  if (!ensureActivePetContext()) {
                    return;
                  }
                  switchTabWithActivePet('/pages/PetSchedule/index', currentPetId);
                }}
              >
                <Text className="text-[24rpx] font-semibold">查看 {activePet?.name} 日程</Text>
              </View>
            </View>
          ) : null}
        </View>

        {currentPetId && activePet ? (
          <View className="mb-5 border-[2rpx] border-solid border-[#262626] rounded-[16rpx] bg-white p-4">
            <Text className="text-[28rpx] font-semibold text-[#303030] block">当前宠物下一步</Text>
            <Text className="text-[22rpx] text-[#666] mt-2 block">
              常用入口更多是跳板。确定当前宠物之后，最适合继续去报告、详情或服务概览，把这只宠物的状态看完整。
            </Text>
            <View className="grid grid-cols-3 gap-[10rpx] mt-4">
              {nextShortcutActions.map((item) => (
                <View
                  key={item.title}
                  className="rounded-[14rpx] border border-[#d7d7d7] p-3 bg-[#F8F8F8]"
                  onClick={item.onClick}
                >
                  <Text className="text-[24rpx] font-semibold text-[#303030] block">{item.title}</Text>
                  <Text className="text-[20rpx] text-[#6f6f6f] mt-1 block">{item.subtitle}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}

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
