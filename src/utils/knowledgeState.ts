import Taro from '@tarojs/taro';

type QaCategory = 'health' | 'behavior' | 'feed' | 'general';

type QaHistoryItem = {
  question: string;
  answer: string;
  time: string;
  category: string;
};

const QA_STATS_STORAGE_KEY = 'knowledge_qa_stats';
const QA_HISTORY_STORAGE_KEY = 'knowledge_qa_history';

const readQaStats = () => {
  const value = Taro.getStorageSync(QA_STATS_STORAGE_KEY);
  return {
    health: Number(value?.health || 0),
    behavior: Number(value?.behavior || 0),
    feed: Number(value?.feed || 0),
    general: Number(value?.general || 0),
  } as Record<QaCategory, number>;
};

const readQaHistory = () => {
  const value = Taro.getStorageSync(QA_HISTORY_STORAGE_KEY);
  return Array.isArray(value)
    ? value.filter(
        (item) =>
          item &&
          typeof item.question === 'string' &&
          typeof item.answer === 'string' &&
          typeof item.time === 'string' &&
          typeof item.category === 'string'
      )
    : [];
};

const qaStats: Record<QaCategory, number> = readQaStats();
let qaHistory: QaHistoryItem[] = readQaHistory();

const syncQaStats = () => {
  Taro.setStorageSync(QA_STATS_STORAGE_KEY, { ...qaStats });
};

const syncQaHistory = () => {
  Taro.setStorageSync(QA_HISTORY_STORAGE_KEY, qaHistory);
};

export const getQuestionCategory = (question: string): QaCategory => {
  const text = question.trim();
  if (!text) {
    return 'general';
  }

  if (text.includes('软便') || text.includes('拉稀') || text.includes('驱虫') || text.includes('生病') || text.includes('就医')) {
    return 'health';
  }

  if (text.includes('挑食') || text.includes('训练') || text.includes('行为')) {
    return 'behavior';
  }

  if (text.includes('喂') || text.includes('饮食') || text.includes('食物')) {
    return 'feed';
  }

  return 'general';
};

export const recordQaCategory = (category: QaCategory) => {
  qaStats[category] += 1;
  syncQaStats();
};

export const getQaCategoryStats = () => {
  return { ...qaStats };
};

export const addQaHistoryItem = (item: QaHistoryItem) => {
  qaHistory = [item, ...qaHistory].slice(0, 6);
  syncQaHistory();
  return [...qaHistory];
};

export const getQaHistory = () => {
  return [...qaHistory];
};

export const clearQaHistory = () => {
  qaHistory = [];
  syncQaHistory();
  return [];
};
