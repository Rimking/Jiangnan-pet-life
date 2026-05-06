import BasicLayout from '@/layout/basicLayout';
import { View, Text, Input } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import { memo, useMemo, useState } from 'react';
import {
  clearKnowledgeQaHistoryData,
  getKnowledgeQaData,
  getKnowledgeQaHistoryData,
} from '@/api/data';
import {
  addQaHistoryItem,
  clearQaHistory,
  getQaCategoryStats,
  getQaHistory,
  getQuestionCategory,
  recordQaCategory,
} from '@/utils/knowledgeState';
import { isLoggedIn } from '@/utils/authState';

const QUICK_QUESTIONS = [
  '猫咪软便怎么办？',
  '幼犬挑食怎么纠正？',
  '驱虫多久做一次？',
  '老年宠物怎么护理？',
];

type QaHistory = {
  id?: string;
  question: string;
  answer: string;
  time: string;
  category: string;
};

const toTimeLabel = () => {
  const now = new Date();
  const hh = `${now.getHours()}`.padStart(2, '0');
  const mm = `${now.getMinutes()}`.padStart(2, '0');
  return `${hh}:${mm}`;
};

const answerByKeyword = (question: string) => {
  const text = question.trim();
  if (!text) {
    return '请输入你的问题，我会基于当前知识库内容给出建议。';
  }

  if (text.includes('软便') || text.includes('拉稀')) {
    return '先观察精神和食欲，暂停新零食，连续 2-3 天单一饮食并补水；若伴随呕吐或便血，请尽快就医。';
  }
  if (text.includes('挑食')) {
    return '建议固定喂食时段并减少零食干扰，单餐 15-20 分钟，超时收走，连续执行 1-2 周观察。';
  }
  if (text.includes('驱虫')) {
    return '体外驱虫通常每月一次，体内驱虫按产品说明周期执行；驱虫前后建议记录体重与精神状态。';
  }
  if (text.includes('老年') || text.includes('关节')) {
    return '老年宠物建议增加低冲击运动并定期体检，重点关注关节、牙齿和体重变化。';
  }

  return '优先观察食欲、精神、排便和饮水，异常持续请尽快咨询兽医。';
};

const categoryLabelMap: Record<string, string> = {
  health: '健康',
  behavior: '行为',
  feed: '喂养',
  general: '通用',
};

const mapCategoryLabel = (category: string) => categoryLabelMap[category] || '通用';

const PetQa = memo(function PetQa() {
  const [question, setQuestion] = useState('');
  const [asked, setAsked] = useState('');
  const [answerText, setAnswerText] = useState('');
  const [history, setHistory] = useState<QaHistory[]>([]);
  const [statsState, setStatsState] = useState({
    health: 0,
    behavior: 0,
    feed: 0,
    general: 0,
  });
  const loggedIn = isLoggedIn();

  useDidShow(() => {
    if (!loggedIn) {
      setHistory(getQaHistory());
      setStatsState(getQaCategoryStats());
      return;
    }

    getKnowledgeQaHistoryData()
      .then((result) => {
        setStatsState(result.stats);
        setHistory(
          result.history.map((item) => ({
            id: item.id,
            question: item.question,
            answer: item.answer,
            time: item.createdAt.slice(11, 16),
            category: mapCategoryLabel(item.category),
          }))
        );
      })
      .catch(() => {
        setHistory([]);
        setStatsState({
          health: 0,
          behavior: 0,
          feed: 0,
          general: 0,
        });
      });
  });

  const stats = useMemo(() => statsState, [statsState]);

  const statList = [
    { key: 'health', label: '健康', count: stats.health },
    { key: 'behavior', label: '行为', count: stats.behavior },
    { key: 'feed', label: '喂养', count: stats.feed },
    { key: 'general', label: '通用', count: stats.general },
  ];

  const handleAsk = async (input: string) => {
    const text = input.trim();
    const nextAsked = text || input;
    setAsked(nextAsked);
    setAnswerText(answerByKeyword(nextAsked));

    if (!text) {
      return;
    }

    let result = answerByKeyword(text);
    let category = getQuestionCategory(text);

    try {
      const qaResult = await getKnowledgeQaData(text);
      result = qaResult.answer;
      category = (qaResult.category || category) as
        | 'health'
        | 'behavior'
        | 'feed'
        | 'general';
    } catch {
      result = answerByKeyword(text);
    }

    setAnswerText(result);

    if (loggedIn) {
      getKnowledgeQaHistoryData()
        .then((nextData) => {
          setStatsState(nextData.stats);
          setHistory(
            nextData.history.map((item) => ({
              id: item.id,
              question: item.question,
              answer: item.answer,
              time: item.createdAt.slice(11, 16),
              category: mapCategoryLabel(item.category),
            }))
          );
        })
        .catch(() => {});
      return;
    }

    recordQaCategory(category);
    setStatsState(getQaCategoryStats());
    const nextHistory = addQaHistoryItem({
      question: text,
      answer: result,
      time: toTimeLabel(),
      category: categoryLabelMap[category],
    });
    setHistory(nextHistory);
  };

  return (
    <BasicLayout
      wrapClassName="w-full h-full"
      wrapStyle={{
        background: 'linear-gradient(180deg, #FFE68D 0%, #FFFCE0 100%)',
        minHeight: '100vh',
      }}
      navOptions={{ navTitle: '知识问答', needBack: true }}
    >
      <View className="px-[24rpx] pt-[16rpx] pb-[120rpx]">
        <View className="bg-white rounded-[18rpx] border-[2rpx] border-solid border-[#262626] p-[14rpx] mb-[14rpx]">
          <Text className="text-[24rpx] font-semibold text-[#222] block">问答说明</Text>
          <Text className="text-[22rpx] text-[#666] leading-[1.7] mt-[8rpx] block">
            这里会基于当前知识库文章内容给出建议，适合处理喂养、护理、驱虫、行为这类常见问题。
          </Text>
        </View>

        <View className="bg-white rounded-[18rpx] border-[2rpx] border-solid border-[#262626] p-[14rpx] mb-[14rpx]">
          <Text className="text-[24rpx] text-[#666]">输入问题</Text>
          <Input
            value={question}
            onInput={(e) => setQuestion(e.detail.value)}
            placeholder="例如：猫咪软便怎么办？"
            className="mt-[8rpx] h-[70rpx] text-[24rpx]"
          />
        </View>

        <View className="bg-white rounded-[18rpx] border-[2rpx] border-solid border-[#262626] p-[14rpx] mb-[14rpx]">
          <Text className="text-[24rpx] font-semibold text-[#222] mb-[8rpx] block">
            问题分类统计
          </Text>
          <View className="grid grid-cols-4 gap-[8rpx]">
            {statList.map((item) => (
              <View
                key={item.key}
                className="bg-[#F7F7F7] rounded-[12rpx] border border-[#e3e3e3] py-[8rpx] px-[6rpx] text-center"
              >
                <Text className="text-[20rpx] text-[#666] block text-center">
                  {item.label}
                </Text>
                <Text className="text-[24rpx] font-semibold text-[#333] block text-center">
                  {item.count}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View className="mb-[14rpx]">
          <Text className="text-[22rpx] text-[#555] mb-[8rpx] block">常见问题</Text>
          <View className="flex flex-wrap gap-[8rpx]">
            {QUICK_QUESTIONS.map((item) => (
              <View
                key={item}
                className="px-[12rpx] py-[8rpx] rounded-[14rpx] border-[2rpx] border-solid border-[#262626] bg-[#FFF6CE]"
                onClick={() => {
                  setQuestion(item);
                  handleAsk(item);
                }}
              >
                <Text className="text-[22rpx] text-[#333]">{item}</Text>
              </View>
            ))}
          </View>
        </View>

        {!loggedIn ? (
          <Text className="text-[20rpx] text-[#7a6f52] mb-[10rpx] block">
            当前未登录，问答历史会先保存在本机；登录后会自动同步到你的账号下。
          </Text>
        ) : null}

        <View
          className="h-[88rpx] rounded-[44rpx] bg-[#2B8BFF] border-[3rpx] border-solid border-[#235db8] flex items-center justify-center mb-[14rpx]"
          onClick={() => handleAsk(question)}
        >
          <Text className="text-[28rpx] text-white font-semibold">获取建议</Text>
        </View>

        <View className="mb-[14rpx] flex justify-end">
          <View
            className="px-[12rpx] py-[8rpx] rounded-[14rpx] border-[2rpx] border-solid border-[#262626] bg-[#F4F4F4]"
            onClick={async () => {
              if (loggedIn) {
                try {
                  await clearKnowledgeQaHistoryData();
                  setHistory([]);
                  setStatsState({
                    health: 0,
                    behavior: 0,
                    feed: 0,
                    general: 0,
                  });
                  Taro.showToast({ title: '历史已清空', icon: 'success' });
                } catch (error: any) {
                  Taro.showToast({
                    title: error?.message || '清空失败',
                    icon: 'none',
                  });
                }
                return;
              }

              setHistory(clearQaHistory());
              setStatsState(getQaCategoryStats());
            }}
          >
            <Text className="text-[22rpx] text-[#333]">清空历史</Text>
          </View>
        </View>

        <View className="bg-white rounded-[18rpx] border-[2rpx] border-solid border-[#262626] p-[18rpx] mb-[14rpx]">
          <Text className="text-[24rpx] font-semibold text-[#222] block mb-[8rpx]">
            回答
          </Text>
          <Text className="text-[24rpx] leading-[38rpx] text-[#444]">
            {answerText || answerByKeyword(asked)}
          </Text>
        </View>

        <View className="bg-white rounded-[18rpx] border-[2rpx] border-solid border-[#262626] p-[18rpx]">
          <Text className="text-[24rpx] font-semibold text-[#222] block mb-[8rpx]">
            历史问答
          </Text>
          {!history.length ? (
            <Text className="text-[22rpx] text-[#777]">暂时没有历史记录</Text>
          ) : (
            history.map((item, index) => (
              <View
                key={`${item.question}-${index}`}
                className="py-[10rpx] border-b border-[#ededed] last:border-b-0"
              >
                <View className="flex items-center justify-between">
                  <Text className="text-[22rpx] text-[#333] font-semibold">
                    {item.question}
                  </Text>
                  <Text className="text-[20rpx] text-[#888]">{item.time}</Text>
                </View>
                <Text className="text-[20rpx] text-[#6f6f6f] mt-[2rpx]">
                  分类：{item.category}
                </Text>
                <Text className="text-[22rpx] text-[#555] mt-[4rpx] leading-[34rpx]">
                  {item.answer}
                </Text>
              </View>
            ))
          )}
        </View>
      </View>
    </BasicLayout>
  );
});

export default PetQa;
