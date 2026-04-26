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
    code: number;
    data: ScheduleItem[];
    message: string;
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
    code: number;
    data: ScheduleItem;
    message: string;
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
    code: number;
    data: ScheduleItem;
    message: string;
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
    code: number;
    data: {
      id: string;
      deleted: boolean;
    };
    message: string;
  }>(
    {
      url: `/api/schedules/${id}`,
    },
    true
  ).then((res) => res.data);
};
