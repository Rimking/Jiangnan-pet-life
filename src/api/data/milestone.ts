import { apiDelete, apiGet, apiPatch, apiPost } from '../config';

export interface MilestoneItem {
  id: string;
  petId: string;
  title: string;
  occurredAt: string;
  description?: string;
  photos?: string[];
  videos?: string[];
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateMilestoneParams {
  petId: string;
  title: string;
  occurredAt: string;
  description?: string;
  photos?: string[];
  videos?: string[];
  tags?: string[];
}

export type UpdateMilestoneParams = Partial<CreateMilestoneParams>;

export const getMilestoneListData = (params?: { petId?: string }) => {
  return apiGet<{
    code: number;
    data: MilestoneItem[];
    message: string;
  }>(
    {
      url: '/api/milestones',
      data: params,
    },
    true
  ).then((res) => res.data);
};

export const createMilestoneData = (params: CreateMilestoneParams) => {
  return apiPost<{
    code: number;
    data: MilestoneItem;
    message: string;
  }>(
    {
      url: '/api/milestones',
      data: params,
    },
    true
  ).then((res) => res.data);
};

export const updateMilestoneData = (id: string, params: UpdateMilestoneParams) => {
  return apiPatch<{
    code: number;
    data: MilestoneItem;
    message: string;
  }>(
    {
      url: `/api/milestones/${id}`,
      data: params,
    },
    true
  ).then((res) => res.data);
};

export const deleteMilestoneData = (id: string) => {
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
      url: `/api/milestones/${id}`,
    },
    true
  ).then((res) => res.data);
};
