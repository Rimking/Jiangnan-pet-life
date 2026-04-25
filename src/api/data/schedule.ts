import { apiDelete, apiGet, apiPatch, apiPost } from '../config';

export interface ScheduleItem {
  id: string;
  petId: string;
  title: string;
  category: string;
  type?: string;
  status: string;
  repeatRule?: string;
  remindAt?: string;
  advanceMinutes?: number;
  attachments?: string[];
  notes?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ScheduleListParams {
  petId?: string;
  status?: string;
}

export interface CreateScheduleParams {
  petId: string;
  title: string;
  category: string;
  type?: string;
  status?: string;
  repeatRule?: string;
  remindAt?: string;
  advanceMinutes?: number;
  attachments?: string[];
  notes?: string;
  completedAt?: string;
}

export type UpdateScheduleParams = Partial<CreateScheduleParams>;

export const getScheduleListData = (params: ScheduleListParams = {}) => {
  return apiGet<{
    data: ScheduleItem[];
    success: boolean;
  }>(
    {
      url: '/api/schedules',
      data: {
        ...params,
      },
    },
    true
  ).then((res) => res.data);
};

export const createScheduleData = (params: CreateScheduleParams) => {
  return apiPost<{
    data: ScheduleItem;
    success: boolean;
  }>(
    {
      url: '/api/schedules',
      data: {
        ...params,
      },
    },
    true
  ).then((res) => res.data);
};

export const updateScheduleData = (id: string, params: UpdateScheduleParams) => {
  return apiPatch<{
    data: ScheduleItem;
    success: boolean;
  }>(
    {
      url: `/api/schedules/${id}`,
      data: {
        ...params,
      },
    },
    true
  ).then((res) => res.data);
};

export const deleteScheduleData = (id: string) => {
  return apiDelete<{
    data: {
      id: string;
      deleted: boolean;
    };
    success: boolean;
  }>(
    {
      url: `/api/schedules/${id}`,
    },
    true
  ).then((res) => res.data);
};
