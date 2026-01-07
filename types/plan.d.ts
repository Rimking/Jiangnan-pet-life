// 计划状态枚举
export enum PlanStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
  IN_PROGRESS = 'in-progress'
}

// 计划类型枚举
export enum PlanType {
  STUDY = '学习',
  WORK = '工作',
  FITNESS = '健身',
  LIFE = '生活',
  ENTERTAINMENT = '娱乐',
  OTHER = '其他'
}

// 重复类型枚举
export enum RepeatType {
  NONE = 'none',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  YEARLY = 'yearly'
}

// 计划基础接口
export interface Plan {
  id: number;
  title: string;
  type: PlanType;
  motivation?: string;
  repeatType: RepeatType;
  targetTime?: string;
  deadline?: string;
  color: string;
  icon: string;
  status: PlanStatus;
  createdAt: Date;
  updatedAt: Date;
}

// 计划执行记录接口
export interface PlanExecution {
  id: number;
  planId: number;
  date: Date;
  status: PlanStatus;
  completedAt?: Date;
  focusTime?: number; // 专注时间（分钟）
  notes?: string;
  images?: string[]; // 打卡图片
}

// 用户统计接口
export interface UserStats {
  totalPlans: number;
  completedPlans: number;
  completionRate: number;
  currentStreak: number;
  longestStreak: number;
  totalFocusTime: number; // 总专注时间（分钟）
  thisWeekPlans: number;
  thisWeekCompleted: number;
  thisMonthPlans: number;
  thisMonthCompleted: number;
}

// 计划模板接口
export interface PlanTemplate {
  id: number;
  title: string;
  description: string;
  category: string;
  duration: string;
  difficulty: '简单' | '中等' | '困难';
  color: string;
  icon: string;
  steps?: string[]; // 计划步骤
}

// 日历日期数据接口
export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  plans: number;
  completed: number;
  hasFailed: boolean;
}

// 专注会话接口
export interface FocusSession {
  id: number;
  planId: number;
  startTime: Date;
  endTime?: Date;
  duration: number; // 持续时间（秒）
  isCompleted: boolean;
} 