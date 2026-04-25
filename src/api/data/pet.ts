import { apiDelete, apiGet, apiPatch, apiPost } from '../config';

export interface BaseListParams {
  type?: string;
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
    data: PetItem[];
    success: boolean;
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
    data: PetItem;
    success: boolean;
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
    data: PetItem;
    success: boolean;
  }>(
    {
      url: `/api/pets/${id}`,
    },
    true
  ).then((res) => res.data);
};

export const updatePetData = (id: string, params: UpdatePetParams) => {
  return apiPatch<{
    data: PetItem;
    success: boolean;
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
    data: {
      id: string;
      deleted: boolean;
    };
    success: boolean;
  }>(
    {
      url: `/api/pets/${id}`,
    },
    true
  ).then((res) => res.data);
};
