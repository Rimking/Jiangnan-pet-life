import { apiDelete, apiGet, apiPatch, apiPost } from '../config';

export interface CareRecordItem {
  id: string;
  petId: string;
  category: string;
  occurredAt: string;
  hospital?: string;
  doctorAdvice?: string;
  result?: string;
  symptoms?: string;
  medications?: string[];
  attachments?: string[];
  nextReminderAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CareRecordListParams {
  petId?: string;
  category?: string;
}

export interface CreateCareRecordParams {
  petId: string;
  category: string;
  occurredAt: string;
  hospital?: string;
  doctorAdvice?: string;
  result?: string;
  symptoms?: string;
  medications?: string[];
  attachments?: string[];
  nextReminderAt?: string;
  notes?: string;
}

export type UpdateCareRecordParams = Partial<CreateCareRecordParams>;

export const getCareRecordListData = (params: CareRecordListParams = {}) => {
  return apiGet<{
    data: CareRecordItem[];
    success: boolean;
  }>(
    {
      url: '/api/care-records',
      data: {
        ...params,
      },
    },
    true
  ).then((res) => res.data);
};

export const createCareRecordData = (params: CreateCareRecordParams) => {
  return apiPost<{
    data: CareRecordItem;
    success: boolean;
  }>(
    {
      url: '/api/care-records',
      data: {
        ...params,
      },
    },
    true
  ).then((res) => res.data);
};

export const updateCareRecordData = (
  id: string,
  params: UpdateCareRecordParams
) => {
  return apiPatch<{
    data: CareRecordItem;
    success: boolean;
  }>(
    {
      url: `/api/care-records/${id}`,
      data: {
        ...params,
      },
    },
    true
  ).then((res) => res.data);
};

export const deleteCareRecordData = (id: string) => {
  return apiDelete<{
    data: {
      id: string;
      deleted: boolean;
    };
    success: boolean;
  }>(
    {
      url: `/api/care-records/${id}`,
    },
    true
  ).then((res) => res.data);
};
