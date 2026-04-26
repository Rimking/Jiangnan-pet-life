import { apiDelete, apiGet, apiPatch, apiPost } from '../config';

export interface FeedbackItem {
  id: string;
  mode: string;
  content: string;
  contact?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFeedbackParams {
  mode?: string;
  content: string;
  contact?: string;
}

export type UpdateFeedbackParams = Partial<CreateFeedbackParams>;

export const getFeedbackListData = (params?: { mode?: string }) => {
  return apiGet<{
    code: number;
    data: FeedbackItem[];
    message: string;
  }>(
    {
      url: '/api/feedback',
      data: params,
    },
    true
  ).then((res) => res.data);
};

export const createFeedbackData = (params: CreateFeedbackParams) => {
  return apiPost<{
    code: number;
    data: FeedbackItem;
    message: string;
  }>(
    {
      url: '/api/feedback',
      data: params,
    },
    true
  ).then((res) => res.data);
};

export const updateFeedbackData = (id: string, params: UpdateFeedbackParams) => {
  return apiPatch<{
    code: number;
    data: FeedbackItem;
    message: string;
  }>(
    {
      url: `/api/feedback/${id}`,
      data: params,
    },
    true
  ).then((res) => res.data);
};

export const deleteFeedbackData = (id: string) => {
  return apiDelete<{
    code: number;
    data: {
      id: string;
      deleted: boolean;
      softDeleted: boolean;
    };
    message: string;
  }>(
    {
      url: `/api/feedback/${id}`,
    },
    true
  ).then((res) => res.data);
};
