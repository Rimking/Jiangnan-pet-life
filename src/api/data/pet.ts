import { apiDelete, apiGet, apiPatch, apiPost } from '../config';

export interface BaseListParams {
  type?: string;
}

export interface PetOverviewData {
  pet: PetItem;
  stats: {
    schedules: number;
    pendingSchedules: number;
    records: number;
    expenses: number;
    totalExpense: number;
    careRecords: number;
    foods: number;
    lowInventoryFoods: number;
    medicines: number;
    dueMedicines: number;
    milestones: number;
  };
  recent: {
    upcomingSchedules: Array<{
      id: string;
      title: string;
      category: string;
      status: string;
      remindAt: string;
    }>;
    latestExpenses: Array<{
      id: string;
      category: string;
      amount: number;
      spentAt: string;
      notes?: string;
    }>;
    latestCareRecords: Array<{
      id: string;
      category: string;
      occurredAt: string;
      result?: string;
      notes?: string;
    }>;
    latestMilestones: Array<{
      id: string;
      title: string;
      occurredAt: string;
      description?: string;
      tags?: string[];
    }>;
  };
}

export interface PetTimelineData {
  petId: string;
  total: number;
  timeline: Array<{
    id: string;
    sourceId: string;
    petId: string;
    sourceType: string;
    title: string;
    tag: string;
    description: string;
    occurredAt: string;
  }>;
}

export interface PetItem {
  id: string;
  name: string;
  type: string;
  breed?: string;
  birthday?: string;
  gender?: string;
  weight?: number;
  color?: string;
  sterilized?: boolean;
  allergies?: string[];
  photos?: string[];
  avatar?: string;
  notes?: string;
  profileExtras?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePetParams {
  name: string;
  type: string;
  breed?: string;
  birthday?: string;
  gender?: string;
  weight?: number;
  color?: string;
  sterilized?: boolean;
  allergies?: string[];
  photos?: string[];
  avatar?: string;
  notes?: string;
  profileExtras?: Record<string, unknown>;
}

export type UpdatePetParams = Partial<CreatePetParams>;

/**
 * 获取宠物列表
 * 使用方式：
 * getPetListData(params).then((res) => {
 *   console.log(res);
 * });
 */
export const getPetListData = (params: BaseListParams) => {
  return apiGet<{
    code: number;
    data: PetItem[];
    message: string;
  }>(
    {
      url: '/api/pets',
      data: {
        ...params,
      },
    },
    true
  ).then((res) => res.data);
};

/**
 * 新增宠物
 * 使用方式：
 * createPetData(params).then((res) => {
 *   console.log(res);
 * });
 */
export const createPetData = (params: CreatePetParams) => {
  return apiPost<{
    code: number;
    data: PetItem;
    message: string;
  }>(
    {
      url: '/api/pets',
      data: {
        ...params,
      },
    },
    true
  ).then((res) => res.data);
};

export const getPetDetailData = (id: string) => {
  return apiGet<{
    code: number;
    data: PetItem;
    message: string;
  }>(
    {
      url: `/api/pets/${id}`,
    },
    true
  ).then((res) => res.data);
};

export const updatePetData = (id: string, params: UpdatePetParams) => {
  return apiPatch<{
    code: number;
    data: PetItem;
    message: string;
  }>(
    {
      url: `/api/pets/${id}`,
      data: {
        ...params,
      },
    },
    true
  ).then((res) => res.data);
};

export const deletePetData = (id: string) => {
  return apiDelete<{
    code: number;
    data: {
      id: string;
      deleted: boolean;
    };
    message: string;
  }>(
    {
      url: `/api/pets/${id}`,
    },
    true
  ).then((res) => res.data);
};

export const getPetOverviewData = (id: string) => {
  return apiGet<{
    code: number;
    data: PetOverviewData;
    message: string;
  }>(
    {
      url: `/api/pets/${id}/overview`,
    },
    true
  ).then((res) => res.data);
};

export const getPetTimelineData = (id: string) => {
  return apiGet<{
    code: number;
    data: PetTimelineData;
    message: string;
  }>(
    {
      url: `/api/pets/${id}/timeline`,
    },
    true
  ).then((res) => res.data);
};
