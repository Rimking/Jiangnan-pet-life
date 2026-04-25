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

export const getDashboardData = () => {
  return apiGet<{
    data: DashboardSummaryData;
    success: boolean;
  }>(
    {
      url: '/api/dashboard',
    },
    true
  ).then((res) => res.data);
};
