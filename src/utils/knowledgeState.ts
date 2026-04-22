type QaCategory = 'health' | 'behavior' | 'feed' | 'general';

const favoriteArticleIds = new Set<string>();
const qaStats: Record<QaCategory, number> = {
  health: 0,
  behavior: 0,
  feed: 0,
  general: 0,
};

export const isArticleFavorited = (articleId: string) => {
  return favoriteArticleIds.has(articleId);
};

export const toggleArticleFavorite = (articleId: string) => {
  if (favoriteArticleIds.has(articleId)) {
    favoriteArticleIds.delete(articleId);
    return false;
  }
  favoriteArticleIds.add(articleId);
  return true;
};

export const getFavoriteArticleIds = () => {
  return Array.from(favoriteArticleIds);
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
};

export const getQaCategoryStats = () => {
  return { ...qaStats };
};
