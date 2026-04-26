import { apiDelete, apiGet, apiPatch, apiPost } from '../config';

export interface FoodItem {
  id: string;
  petId: string;
  name: string;
  brand?: string;
  flavor?: string;
  feedingAmount?: string;
  feedingTimes?: string;
  inventory?: number;
  inventoryAlertThreshold?: number;
  allergyWarnings?: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FoodListParams {
  petId?: string;
}

export interface CreateFoodParams {
  petId: string;
  name: string;
  brand?: string;
  flavor?: string;
  feedingAmount?: string;
  feedingTimes?: string;
  inventory?: number;
  inventoryAlertThreshold?: number;
  allergyWarnings?: string[];
  notes?: string;
}

export type UpdateFoodParams = Partial<CreateFoodParams>;

export const getFoodListData = (params: FoodListParams = {}) => {
  return apiGet<{
    code: number;
    data: FoodItem[];
    message: string;
  }>(
    {
      url: '/api/foods',
      data: {
        ...params,
      },
    },
    true
  ).then((res) => res.data);
};

export const createFoodData = (params: CreateFoodParams) => {
  return apiPost<{
    code: number;
    data: FoodItem;
    message: string;
  }>(
    {
      url: '/api/foods',
      data: {
        ...params,
      },
    },
    true
  ).then((res) => res.data);
};

export const updateFoodData = (id: string, params: UpdateFoodParams) => {
  return apiPatch<{
    code: number;
    data: FoodItem;
    message: string;
  }>(
    {
      url: `/api/foods/${id}`,
      data: {
        ...params,
      },
    },
    true
  ).then((res) => res.data);
};

export const deleteFoodData = (id: string) => {
  return apiDelete<{
    code: number;
    data: {
      id: string;
      deleted: boolean;
    };
    message: string;
  }>(
    {
      url: `/api/foods/${id}`,
    },
    true
  ).then((res) => res.data);
};
