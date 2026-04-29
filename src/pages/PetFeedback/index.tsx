import BasicLayout from '@/layout/basicLayout';
import { View, Text, Input, Textarea } from '@tarojs/components';
import Taro, { useDidShow, useRouter } from '@tarojs/taro';
import { memo, useMemo, useState } from 'react';
import { PET_UI } from '@/constants/petUi';
import { createFeedbackData, FeedbackMode, getFeedbackListData } from '@/api/data';
import { usePetApiPets } from '@/hooks/usePetApiPets';
import { switchTabWithActivePet } from '@/utils/activePetState';
import { ensureLoggedIn, isLoggedIn } from '@/utils/authState';

type FeedbackRecord = {
  id: string;
  content: string;
  contact: string;
  createdAt: string;
};

const PetFeedback = memo(function PetFeedback() {
  const { params } = useRouter();
  const mode: FeedbackMode = params.mode === 'contact' ? 'contact' : 'feedback';
  const { activePet, activePetId } = usePetApiPets();
  const currentPetId = activePet?.id || activePetId || '';
  const [content, setContent] = useState('');
  const [contact, setContact] = useState('');
  const [history, setHistory] = useState<FeedbackRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const loggedIn = isLoggedIn();
  const ensureActivePetContext = () => {
    if (!ensureLoggedIn(`/pages/PetFeedback/index?mode=${mode}`)) {
      return false;
    }

    if (currentPetId && activePet) {
      return true;
    }

    Taro.showToast({ title: '请先重新选择宠物', icon: 'none' });
    return false;
  };

  useDidShow(() => {
    if (!loggedIn) {
      setHistory([]);
      return;
    }

    setLoading(true);
    getFeedbackListData({ mode })
      .then((records) => {
        setHistory(
          records.map((item) => ({
            id: item.id,
            content: item.content,
            contact: item.contact || '',
            createdAt: item.createdAt,
          }))
        );
      })
      .catch(() => setHistory([]))
      .finally(() => setLoading(false));
  });

  const pageTitle = useMemo(() => {
    return mode === 'contact' ? '联系我们' : '帮助与反馈';
  }, [mode]);

  const handleSubmit = () => {
    if (!ensureLoggedIn(`/pages/PetFeedback/index?mode=${mode}`)) {
      return;
    }

    if (!content.trim()) {
      Taro.showToast({ title: '请填写反馈内容', icon: 'none' });
      return;
    }

    setSaving(true);
    createFeedbackData({
      mode,
      content: content.trim(),
      contact: contact.trim() || undefined,
    })
      .then((record) => {
        setHistory((prev) => [
          {
            id: record.id,
            content: record.content,
            contact: record.contact || '',
            createdAt: record.createdAt,
          },
          ...prev,
        ].slice(0, 10));
        setContent('');
        setContact('');
        Taro.showToast({ title: '反馈已提交', icon: 'success' });
      })
      .catch((error) => {
        const message = error instanceof Error ? error.message : '提交失败';
        Taro.showToast({ title: message, icon: 'none' });
      })
      .finally(() => setSaving(false));
  };

  const faqList = [
    '宠物档案、提醒、花销、护理都已经接入真实数据，可以优先从这几块开始体验。',
    '食物管理和用药管理已经支持新增、编辑、删除，用药还能顺手创建提醒。',
    '成长里程碑、时间线和报告页已经联通，记录关键节点后会同步出现在多个页面里。',
  ];
  const nextFeedbackActions = currentPetId && activePet
    ? [
        {
          title: '回到首页',
          subtitle: '继续围绕当前宠物查看摘要和入口',
          onClick: () => {
            if (!ensureActivePetContext()) {
              return;
            }
            switchTabWithActivePet('/pages/PetProfile/index', currentPetId);
          },
        },
        {
          title: '查看报告',
          subtitle: '回看这只宠物的数据总结和最近动态',
          onClick: () => Taro.navigateTo({ url: `/pages/PetReport/index?petId=${currentPetId}` }),
        },
        {
          title: '查看日程',
          subtitle: '继续处理提醒或新增安排',
          onClick: () => {
            if (!ensureActivePetContext()) {
              return;
            }
            switchTabWithActivePet('/pages/PetSchedule/index', currentPetId);
          },
        },
      ]
    : [];

  return (
    <BasicLayout
      wrapClassName="w-full h-full"
      wrapStyle={{
        backgroundImage: PET_UI.pageBackground,
        minHeight: '100vh',
      }}
      navOptions={{ navTitle: pageTitle, needBack: true }}
    >
      <View className="px-6 pt-4 pb-[110rpx]">
        {currentPetId && activePet ? (
          <View className="rounded-[24rpx] bg-[#EEF5FF] p-5 mb-5 shadow-[0_14rpx_30rpx_rgba(0,0,0,0.06)]">
            <Text className="text-[28rpx] font-semibold text-[#2c2c2c] block">
              当前宠物：{activePet.name}
            </Text>
            <Text className="text-[22rpx] text-[#666] leading-[1.7] mt-[10rpx] block">
              反馈页本身是通用支持页，但提交问题后，你仍然可以顺着当前宠物回到首页、报告或日程继续操作。
            </Text>
            <View className="grid grid-cols-3 gap-3 mt-4">
              {nextFeedbackActions.map((item) => (
                <View
                  key={item.title}
                  className="rounded-[16rpx] bg-white p-4 border-[2rpx] border-solid border-[#d8e6ff]"
                  onClick={item.onClick}
                >
                  <Text className="text-[22rpx] font-semibold text-[#333]">{item.title}</Text>
                  <Text className="text-[20rpx] text-[#6b6b6b] mt-[6rpx] block">{item.subtitle}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        {loggedIn && currentPetId && !activePet ? (
          <View className="rounded-[24rpx] bg-[#EEF5FF] p-5 mb-5 shadow-[0_14rpx_30rpx_rgba(0,0,0,0.06)]">
            <Text className="text-[28rpx] font-semibold text-[#2c2c2c] block">请先重新选择宠物</Text>
            <Text className="text-[22rpx] text-[#666] leading-[1.7] mt-[10rpx] block">
              反馈页本身是公共支持页，但你要回到单宠首页、报告或日程之前，需要先恢复有效的宠物上下文。
            </Text>
          </View>
        ) : null}

        <View className="rounded-[24rpx] bg-white p-5 mb-5 shadow-[0_14rpx_30rpx_rgba(0,0,0,0.06)]">
          <Text className="text-[30rpx] font-semibold text-[#2c2c2c] block">
            {mode === 'contact' ? '联系支持团队' : '提交问题与建议'}
          </Text>
          <Text className="text-[22rpx] text-[#666] leading-[1.7] mt-[10rpx] block">
            {mode === 'contact'
              ? '你可以把问题、期望功能或联调信息留在这里，登录后会同步到当前微信账号下。'
              : '这里承接问题反馈和使用建议，登录后会保存到你的账号下，方便持续跟进。'}
          </Text>
          {!loggedIn ? (
            <View className="mt-4 rounded-[18rpx] bg-[#FFF7D5] p-4">
              <Text className="text-[22rpx] text-[#6E5A2C] block">
                登录后才能提交反馈并查看自己的历史记录，未登录时你仍然可以先浏览常见说明。
              </Text>
              <View
                className="mt-3 inline-flex px-4 py-2 rounded-[999rpx] bg-[#FFD93B]"
                onClick={() => ensureLoggedIn(`/pages/PetFeedback/index?mode=${mode}`)}
              >
                <Text className="text-[22rpx] text-[#5D4510] font-semibold">去微信登录</Text>
              </View>
            </View>
          ) : null}
          <View className="mt-4 rounded-[18rpx] bg-[#F8F8F8] p-4">
            <Text className="text-[22rpx] text-[#666] block">建议留下联系方式</Text>
            <Input
              className="mt-2"
              placeholder="微信 / 手机 / 邮箱，选填"
              maxlength={100}
              value={contact}
              onInput={(e) => setContact(e.detail.value)}
            />
          </View>
          <View className="mt-3 rounded-[18rpx] bg-[#F8F8F8] p-4">
            <Text className="text-[22rpx] text-[#666] block">反馈内容</Text>
            <Textarea
              className="mt-2 min-h-[180rpx]"
              autoHeight
              placeholder="例如：新增宠物时希望支持更多字段，或这里描述你的接口联调问题"
              maxlength={2000}
              value={content}
              onInput={(e) => setContent(e.detail.value)}
            />
          </View>
          <View
            className="mt-4 h-[88rpx] rounded-[999rpx] bg-[#FFD93B] flex items-center justify-center"
            onClick={handleSubmit}
          >
            <Text className="text-[30rpx] font-semibold">{saving ? '提交中...' : '提交反馈'}</Text>
          </View>
        </View>

        <View className="rounded-[24rpx] bg-white p-5 mb-5 shadow-[0_14rpx_30rpx_rgba(0,0,0,0.06)]">
          <Text className="text-[28rpx] font-semibold text-[#2c2c2c] mb-4 block">常见说明</Text>
          {faqList.map((item) => (
            <View key={item} className="rounded-[16rpx] bg-[#FFF9E8] p-4 mb-3">
              <Text className="text-[22rpx] text-[#6f5a2b] leading-[1.7]">{item}</Text>
            </View>
          ))}
        </View>

        <View className="rounded-[24rpx] bg-white p-5 shadow-[0_14rpx_30rpx_rgba(0,0,0,0.06)]">
          <Text className="text-[28rpx] font-semibold text-[#2c2c2c] mb-4 block">最近反馈</Text>
          {loading ? (
            <Text className="text-[24rpx] text-[#8a8a8a]">正在加载反馈记录...</Text>
          ) : history.length ? (
            history.map((item) => (
              <View key={item.id} className="rounded-[16rpx] bg-[#F8F8F8] p-4 mb-3">
                <Text className="text-[24rpx] text-[#2c2c2c] leading-[1.7]">{item.content}</Text>
                {item.contact ? (
                  <Text className="text-[20rpx] text-[#7a7a7a] mt-[8rpx] block">
                    联系方式：{item.contact}
                  </Text>
                ) : null}
                <Text className="text-[20rpx] text-[#9a9a9a] mt-[6rpx] block">
                  {item.createdAt.slice(0, 10)} {item.createdAt.slice(11, 16)}
                </Text>
              </View>
            ))
          ) : (
            <Text className="text-[24rpx] text-[#8a8a8a]">
              {loggedIn ? '还没有反馈记录' : '登录后可查看你的反馈记录'}
            </Text>
          )}
        </View>
      </View>
    </BasicLayout>
  );
});

export default PetFeedback;
