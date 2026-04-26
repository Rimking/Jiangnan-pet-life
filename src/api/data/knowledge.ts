import { apiDelete, apiGet, apiPost } from '../config';

export interface KnowledgeCategoryItem {
  key: string;
  label: string;
  color: string;
  count?: number;
}

export interface KnowledgeArticleItem {
  id: string;
  category: string;
  title: string;
  desc: string;
  content: string[];
  sourceName?: string;
  sourceUrl?: string;
}

export interface KnowledgeQaResult {
  category: string;
  answer: string;
}

export interface KnowledgeQaHistoryItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  createdAt: string;
}

export interface KnowledgeQaHistoryResult {
  history: KnowledgeQaHistoryItem[];
  stats: {
    health: number;
    behavior: number;
    feed: number;
    general: number;
  };
}

export interface KnowledgeOverviewResult {
  categories: KnowledgeCategoryItem[];
  activeCategory: string;
  articles: KnowledgeArticleItem[];
  loggedIn: boolean;
  favoriteArticleIds: string[];
}

export const getKnowledgeCategoriesData = () => {
  return apiGet<{
    code: number;
    data: KnowledgeCategoryItem[];
    message: string;
  }>(
    {
      url: '/api/knowledge/categories',
    },
    true
  ).then((res) => res.data);
};

export const getKnowledgeOverviewData = (params?: { category?: string; keyword?: string }) => {
  return apiGet<{
    code: number;
    data: KnowledgeOverviewResult;
    message: string;
  }>(
    {
      url: '/api/knowledge/overview',
      data: params,
    },
    true
  ).then((res) => res.data);
};

export const createKnowledgeFavoriteData = (params: { articleId: string }) => {
  return apiPost<{
    code: number;
    data: { userId: string; articleId: string; favorited: boolean };
    message: string;
  }>(
    {
      url: '/api/knowledge/favorites',
      data: params,
    },
    true
  ).then((res) => res.data);
};

export const deleteKnowledgeFavoriteData = (params: { articleId: string }) => {
  return apiDelete<{
    code: number;
    data: { userId: string; articleId: string; favorited: boolean };
    message: string;
  }>(
    {
      url: '/api/knowledge/favorites',
      data: params,
    },
    true
  ).then((res) => res.data);
};

export const getKnowledgeArticlesData = (params?: { category?: string; keyword?: string }) => {
  return apiGet<{
    code: number;
    data: KnowledgeArticleItem[];
    message: string;
  }>(
    {
      url: '/api/knowledge/articles',
      data: params,
    },
    true
  ).then((res) => res.data);
};

export const getKnowledgeArticleDetailData = (id: string) => {
  return apiGet<{
    code: number;
    data: KnowledgeArticleItem;
    message: string;
  }>(
    {
      url: `/api/knowledge/articles/${id}`,
    },
    true
  ).then((res) => res.data);
};

export const getKnowledgeQaData = (question: string) => {
  return apiGet<{
    code: number;
    data: KnowledgeQaResult;
    message: string;
  }>(
    {
      url: '/api/knowledge/qa',
      data: { question },
    },
    true
  ).then((res) => res.data);
};

export const getKnowledgeQaHistoryData = () => {
  return apiGet<{
    code: number;
    data: KnowledgeQaHistoryResult;
    message: string;
  }>(
    {
      url: '/api/knowledge/qa/history',
    },
    true
  ).then((res) => res.data);
};

export const clearKnowledgeQaHistoryData = () => {
  return apiDelete<{
    code: number;
    data: {
      cleared: boolean;
      count: number;
    };
    message: string;
  }>(
    {
      url: '/api/knowledge/qa/history',
    },
    true
  ).then((res) => res.data);
};
