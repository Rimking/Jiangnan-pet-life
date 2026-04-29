import { apiDelete, apiGet, apiPatch, apiPost } from '../config';

export interface ExpenseItem {
  id: string;
  petId: string;
  category: string;
  amount: number;
  spentAt: string;
  merchant?: string;
  notes?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseListParams {
  petId?: string;
  category?: string;
}

export interface CreateExpenseParams {
  petId: string;
  category: string;
  amount: number;
  spentAt: string;
  merchant?: string;
  notes?: string;
  tags?: string[];
}

export type UpdateExpenseParams = Partial<CreateExpenseParams>;

export const getExpenseListData = (params: ExpenseListParams = {}) => {
  return apiGet<{
    data: ExpenseItem[];
    success: boolean;
  }>(
    {
      url: '/api/expenses',
      data: {
        ...params,
      },
    },
    true
  ).then((res) => res.data);
};

export const getExpenseDetailData = (id: string) => {
  return apiGet<{
    data: ExpenseItem;
    success: boolean;
  }>(
    {
      url: `/api/expenses/${id}`,
    },
    true
  ).then((res) => res.data);
};

export const createExpenseData = (params: CreateExpenseParams) => {
  return apiPost<{
    data: ExpenseItem;
    success: boolean;
  }>(
    {
      url: '/api/expenses',
      data: {
        ...params,
      },
    },
    true
  ).then((res) => res.data);
};

export const updateExpenseData = (id: string, params: UpdateExpenseParams) => {
  return apiPatch<{
    data: ExpenseItem;
    success: boolean;
  }>(
    {
      url: `/api/expenses/${id}`,
      data: {
        ...params,
      },
    },
    true
  ).then((res) => res.data);
};

export const deleteExpenseData = (id: string) => {
  return apiDelete<{
    data: {
      id: string;
      deleted: boolean;
    };
    success: boolean;
  }>(
    {
      url: `/api/expenses/${id}`,
    },
    true
  ).then((res) => res.data);
};
