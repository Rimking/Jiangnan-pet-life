import { apiDelete, apiGet, apiPatch, apiPost } from '../config';

export interface MedicineItem {
  id: string;
  petId: string;
  name: string;
  specification?: string;
  dosage?: string;
  usage?: string;
  expiresAt?: string;
  mealTiming?: string;
  ageLimit?: string;
  weightLimit?: string;
  remainingDays?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MedicineListParams {
  petId?: string;
}

export interface CreateMedicineParams {
  petId: string;
  name: string;
  specification?: string;
  dosage?: string;
  usage?: string;
  expiresAt?: string;
  mealTiming?: string;
  ageLimit?: string;
  weightLimit?: string;
  remainingDays?: number;
  notes?: string;
}

export type UpdateMedicineParams = Partial<CreateMedicineParams>;

export const getMedicineListData = (params: MedicineListParams = {}) => {
  return apiGet<{
    code: number;
    data: MedicineItem[];
    message: string;
  }>(
    {
      url: '/api/medicines',
      data: {
        ...params,
      },
    },
    true
  ).then((res) => res.data);
};

export const createMedicineData = (params: CreateMedicineParams) => {
  return apiPost<{
    code: number;
    data: MedicineItem;
    message: string;
  }>(
    {
      url: '/api/medicines',
      data: {
        ...params,
      },
    },
    true
  ).then((res) => res.data);
};

export const updateMedicineData = (id: string, params: UpdateMedicineParams) => {
  return apiPatch<{
    code: number;
    data: MedicineItem;
    message: string;
  }>(
    {
      url: `/api/medicines/${id}`,
      data: {
        ...params,
      },
    },
    true
  ).then((res) => res.data);
};

export const deleteMedicineData = (id: string) => {
  return apiDelete<{
    code: number;
    data: {
      id: string;
      deleted: boolean;
    };
    message: string;
  }>(
    {
      url: `/api/medicines/${id}`,
    },
    true
  ).then((res) => res.data);
};
