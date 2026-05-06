import { apiGet } from '../config';

export interface DashboardSummaryData {
  totals: {
    pets: number;
    schedules: number;
    pendingSchedules: number;
    overdueSchedules: number;
    expenses: number;
    totalExpense: number;
    careRecords: number;
    foods: number;
    medicines: number;
    milestones: number;
  };
  expenseByCategory: Record<string, number>;
  petSummaries: Array<{
    petId: string;
    petName: string;
    scheduleCount: number;
    expenseTotal: number;
    careRecordCount: number;
    foodCount: number;
    medicineCount: number;
    milestoneCount: number;
  }>;
  latestMilestones: Array<Record<string, unknown>>;
  upcomingSchedules: Array<Record<string, unknown>>;
}

export interface OwnerOverviewData {
  activePet: {
    id: string;
    name: string;
    type?: string;
    gender?: string;
    birthday?: string;
    weight?: number;
    breed?: string;
  } | null;
  totals: {
    pets: number;
    pendingReminderCount: number;
    achievementCount: number;
    lowInventoryCount: number;
    dueMedicineCount: number;
    milestoneCount: number;
  };
  petCards: Array<{
    petId: string;
    petName: string;
    type?: string;
    gender?: string;
    birthday?: string;
    weight?: number;
    breed?: string;
    active: boolean;
  }>;
  menuBadges: {
    schedule: number;
    food: number;
    medicine: number;
  };
  quickStats: {
    expenseCount: number;
    careCount: number;
    foodCount: number;
    medicineCount: number;
    milestoneCount: number;
  };
  latestMilestone: {
    id: string;
    title: string;
    occurredAt: string;
    description?: string;
  } | null;
}

export interface ProfileOverviewData {
  activePet: {
    id: string;
    name: string;
    type?: string;
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
  } | null;
  stats: {
    reminders: number;
    records: number;
    care: number;
    monthExpense: number;
    milestones: number;
  };
  expenseInsight: {
    monthTotal: number;
    categoryTop: Array<{ name: string; amount: number }>;
    weekSeries: number[];
  };
  recentMilestone: {
    id: string;
    title: string;
    occurredAt: string;
    description?: string;
  } | null;
}

export interface ReportData {
  activePet: {
    id: string;
    name: string;
    type?: string;
    breed?: string;
    birthday?: string;
    gender?: string;
    weight?: number;
  } | null;
  summary: {
    activeDays: number;
    totalExpense: number;
    recentExpense: number;
    pendingSchedules: number;
    totalRecords: number;
    totalCareRecords: number;
    totalFoods: number;
    lowInventoryFoods: number;
    totalMedicines: number;
    dueMedicines: number;
    totalMilestones: number;
  };
  recent30Days: {
    schedules: number;
    expenses: number;
    careRecords: number;
    records: number;
    foods: number;
    medicines: number;
    milestones: number;
  };
  recent7Days: Array<{
    date: string;
    label: string;
    expense: number;
    recordCount: number;
    careCount: number;
  }>;
  expenseByCategory: Record<string, number>;
  careByCategory: Record<string, number>;
  topExpenseCategory: string;
  highlights: string[];
  recentMoments: Array<{
    id: string;
    type: string;
    title: string;
    date: string;
  }>;
  petOptions: Array<{
    petId: string;
    petName: string;
    active: boolean;
  }>;
}

export const getDashboardData = () => {
  return apiGet<{
    code: number;
    data: DashboardSummaryData;
    message: string;
  }>(
    {
      url: '/api/dashboard',
    },
    true
  ).then((res) => res.data);
};

export const getOwnerOverviewData = (petId?: string) => {
  return apiGet<{
    code: number;
    data: OwnerOverviewData;
    message: string;
  }>(
    {
      url: '/api/dashboard/owner',
      data: petId ? { petId } : undefined,
    },
    true
  ).then((res) => res.data);
};

export const getProfileOverviewData = (petId?: string) => {
  return apiGet<{
    code: number;
    data: ProfileOverviewData;
    message: string;
  }>(
    {
      url: '/api/dashboard/profile',
      data: petId ? { petId } : undefined,
    },
    true
  ).then((res) => res.data);
};

export const getReportData = (petId?: string) => {
  return apiGet<{
    code: number;
    data: ReportData;
    message: string;
  }>(
    {
      url: '/api/dashboard/report',
      data: petId ? { petId } : undefined,
    },
    true
  ).then((res) => res.data);
};
