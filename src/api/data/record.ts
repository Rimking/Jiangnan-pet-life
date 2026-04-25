import { apiDelete, apiGet, apiPatch, apiPost } from '../config';

export interface RecordItem {
  id: string;
  petId: string;
  category: string;
  value?: string;
  recordedAt: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RecordListParams {
  petId?: string;
  category?: string;
}

export interface CreateRecordParams {
  petId: string;
  category: string;
  value?: string;
  recordedAt: string;
  notes?: string;
}

export type UpdateRecordParams = Partial<CreateRecordParams>;

export const getRecordListData = (params: RecordListParams = {}) => {
  return apiGet<{
    data: RecordItem[];
    success: boolean;
  }>(
    {
      url: '/api/records',
      data: {
        ...params,
      },
    },
    true
  ).then((res) => res.data);
};

export const createRecordData = (params: CreateRecordParams) => {
  return apiPost<{
    data: RecordItem;
    success: boolean;
  }>(
    {
      url: '/api/records',
      data: {
        ...params,
      },
    },
    true
  ).then((res) => res.data);
};

export const updateRecordData = (id: string, params: UpdateRecordParams) => {
  return apiPatch<{
    data: RecordItem;
    success: boolean;
  }>(
    {
      url: `/api/records/${id}`,
      data: {
        ...params,
      },
    },
    true
  ).then((res) => res.data);
};

export const deleteRecordData = (id: string) => {
  return apiDelete<{
    data: {
      id: string;
      deleted: boolean;
    };
    success: boolean;
  }>(
    {
      url: `/api/records/${id}`,
    },
    true
  ).then((res) => res.data);
};
