import { OwnerOverviewData, ReportData } from '@/api/data';

type SignalTone = 'urgent' | 'attention' | 'gentle';
type SignalActionType = 'navigate' | 'switchTab';

export type PetSignal = {
  key: string;
  title: string;
  description: string;
  tone: SignalTone;
  actionLabel: string;
  actionUrl: string;
  actionType?: SignalActionType;
};

export type ReportRhythmSummary = {
  title: string;
  description: string;
  tone: SignalTone;
};

export type OwnerRhythmSummary = {
  title: string;
  description: string;
  tone: SignalTone;
};

const signalToneStyles: Record<
  SignalTone,
  {
    background: string;
    title: string;
    body: string;
    action: string;
  }
> = {
  urgent: {
    background: '#FFF1EF',
    title: '#A33C27',
    body: '#9B5B4C',
    action: '#D65A31',
  },
  attention: {
    background: '#FFF9E8',
    title: '#6F5A2B',
    body: '#7D6532',
    action: '#8A6A2C',
  },
  gentle: {
    background: '#EEF4FF',
    title: '#466481',
    body: '#607688',
    action: '#5A78D4',
  },
};

const getDaysSince = (iso?: string | null) => {
  if (!iso) {
    return null;
  }

  const target = new Date(iso);
  if (Number.isNaN(target.getTime())) {
    return null;
  }

  const diff = Date.now() - target.getTime();
  if (diff < 0) {
    return 0;
  }

  return Math.floor(diff / (1000 * 60 * 60 * 24));
};

const pickLatestGap = (...values: Array<number | null | undefined>) => {
  const validValues = values.filter((item): item is number => typeof item === 'number');
  if (!validValues.length) {
    return null;
  }
  return Math.min(...validValues);
};

export const getSignalToneStyles = (tone: SignalTone) => {
  return signalToneStyles[tone];
};

export const buildOwnerSignals = (
  dashboard: OwnerOverviewData | null,
  currentPetId: string
): PetSignal[] => {
  if (!dashboard?.activePet || !currentPetId) {
    return [];
  }

  const petName = dashboard.activePet.name || '当前宠物';
  const signals: PetSignal[] = [];
  const overdueReminderCount = dashboard.totals.overdueReminderCount || 0;
  const pendingReminderCount = dashboard.totals.pendingReminderCount || 0;
  const lowInventoryCount = dashboard.totals.lowInventoryCount || 0;
  const dueMedicineCount = dashboard.totals.dueMedicineCount || 0;
  const milestoneCount = dashboard.totals.milestoneCount || 0;
  const staleRecordDays = pickLatestGap(
    getDaysSince(dashboard.recentActivity?.lastRecordAt),
    getDaysSince(dashboard.recentActivity?.lastCareAt),
    getDaysSince(dashboard.recentActivity?.lastMilestoneAt)
  );

  if (overdueReminderCount > 0) {
    signals.push({
      key: 'overdue-reminders',
      title: `有 ${overdueReminderCount} 条提醒已经逾期`,
      description: `建议先回日程页处理已经错过时间的安排，避免 ${petName} 的照护继续往后积压。`,
      tone: 'urgent',
      actionLabel: '先去处理提醒',
      actionUrl: '/pages/PetSchedule/index',
      actionType: 'switchTab',
    });
  } else if (pendingReminderCount > 0) {
    signals.push({
      key: 'pending-reminders',
      title: `还有 ${pendingReminderCount} 条提醒待处理`,
      description: `今天的安排已经沉淀好了，适合回到日程页把 ${petName} 的待办逐条处理掉。`,
      tone: 'attention',
      actionLabel: '回到日程页',
      actionUrl: '/pages/PetSchedule/index',
      actionType: 'switchTab',
    });
  }

  if (lowInventoryCount > 0) {
    signals.push({
      key: 'low-inventory',
      title: `有 ${lowInventoryCount} 项食物库存偏低`,
      description: `库存已经接近提醒阈值，最好先补齐 ${petName} 近期要吃的食物，避免断档。`,
      tone: 'attention',
      actionLabel: '去检查食物库存',
      actionUrl: `/pages/PetFood/index?petId=${currentPetId}`,
    });
  }

  if (dueMedicineCount > 0) {
    signals.push({
      key: 'due-medicines',
      title: `有 ${dueMedicineCount} 项用药临近结束`,
      description: `可以先确认疗程是否需要续用，或者补充新的提醒，避免 ${petName} 的用药中断。`,
      tone: 'urgent',
      actionLabel: '去查看用药',
      actionUrl: `/pages/PetMedicine/index?petId=${currentPetId}`,
    });
  }

  if (staleRecordDays === null || staleRecordDays >= 7) {
    signals.push({
      key: 'stale-activity',
      title:
        staleRecordDays === null
          ? '最近还没有沉淀照护记录'
          : `已经 ${staleRecordDays} 天没有新增照护记录`,
      description: `建议补一条日常、护理或成长节点，让 ${petName} 的服务中心和报告保持连续更新。`,
      tone: 'gentle',
      actionLabel: '去补一条记录',
      actionUrl: `/pages/AddPetRecord/index?petId=${currentPetId}&mode=record&returnTo=service-center`,
    });
  }

  if (milestoneCount === 0) {
    signals.push({
      key: 'missing-milestones',
      title: '还没有成长里程碑',
      description: `先记录一个关键节点，后面的报告、档案和时间线会更完整，也更像正式宠物档案。`,
      tone: 'gentle',
      actionLabel: '去记录里程碑',
      actionUrl: `/pages/PetMilestones/index?petId=${currentPetId}`,
    });
  }

  return signals.slice(0, 4);
};

export const buildReportSignals = (report: ReportData | null, currentPetId: string): PetSignal[] => {
  if (!report?.activePet || !currentPetId) {
    return [];
  }

  const petName = report.activePet.name || '当前宠物';
  const signals: PetSignal[] = [];
  const overdueSchedules = report.summary.overdueSchedules || 0;
  const pendingSchedules = report.summary.pendingSchedules || 0;
  const lowInventoryFoods = report.summary.lowInventoryFoods || 0;
  const dueMedicines = report.summary.dueMedicines || 0;
  const totalMilestones = report.summary.totalMilestones || 0;
  const recentRecords = report.recent30Days.records || 0;
  const recentCareRecords = report.recent30Days.careRecords || 0;
  const recentMilestones = report.recent30Days.milestones || 0;
  const recordGapDays = report.summary.daysSinceLastRecord;
  const careGapDays = report.summary.daysSinceLastCare;
  const latestActivityGap = pickLatestGap(recordGapDays, careGapDays, report.summary.daysSinceLastMilestone);

  if (overdueSchedules > 0) {
    signals.push({
      key: 'report-overdue',
      title: `有 ${overdueSchedules} 条提醒已经过期`,
      description: `这通常意味着今天或前几天的安排还没完成，先处理这些提醒，报告里的状态会更真实。`,
      tone: 'urgent',
      actionLabel: '回到日程处理',
      actionUrl: '/pages/PetSchedule/index',
      actionType: 'switchTab',
    });
  } else if (pendingSchedules > 0) {
    signals.push({
      key: 'report-pending',
      title: `还有 ${pendingSchedules} 条提醒待处理`,
      description: `报告已经帮你看到了全局情况，下一步最值得做的是把未完成的安排继续清掉。`,
      tone: 'attention',
      actionLabel: '去日程页',
      actionUrl: '/pages/PetSchedule/index',
      actionType: 'switchTab',
    });
  }

  if (recentRecords + recentCareRecords === 0 || latestActivityGap === null || latestActivityGap >= 7) {
    signals.push({
      key: 'report-stale',
      title:
        latestActivityGap === null
          ? '最近还没有形成连续记录'
          : `最近一次照护记录距今已 ${latestActivityGap} 天`,
      description: `建议先补一条日常或护理，让 ${petName} 的最近趋势和亮点总结更有参考价值。`,
      tone: 'gentle',
      actionLabel: '去补一条记录',
      actionUrl: `/pages/AddPetRecord/index?petId=${currentPetId}&mode=record&returnTo=report`,
    });
  }

  if (lowInventoryFoods > 0) {
    signals.push({
      key: 'report-food',
      title: `有 ${lowInventoryFoods} 项食物库存偏低`,
      description: `库存风险已经出现在报告里了，适合现在就去食物页补齐或更新库存。`,
      tone: 'attention',
      actionLabel: '去检查食物',
      actionUrl: `/pages/PetFood/index?petId=${currentPetId}`,
    });
  }

  if (dueMedicines > 0) {
    signals.push({
      key: 'report-medicine',
      title: `有 ${dueMedicines} 项用药临近结束`,
      description: `可以趁现在一起确认疗程、提醒和后续安排，避免在用药即将结束时才发现缺口。`,
      tone: 'urgent',
      actionLabel: '去查看用药',
      actionUrl: `/pages/PetMedicine/index?petId=${currentPetId}`,
    });
  }

  if (totalMilestones === 0 || recentMilestones === 0) {
    signals.push({
      key: 'report-milestone',
      title: totalMilestones === 0 ? '成长档案还是空的' : '最近 30 天还没有新增成长节点',
      description: `里程碑越完整，${petName} 的报告和时间线就越有故事感，也更方便回看阶段变化。`,
      tone: 'gentle',
      actionLabel: '去补里程碑',
      actionUrl: `/pages/PetMilestones/index?petId=${currentPetId}`,
    });
  }

  return signals.slice(0, 4);
};

export const buildOwnerRecommendations = (
  dashboard: OwnerOverviewData | null,
  currentPetId: string
): PetSignal[] => {
  if (!dashboard?.activePet || !currentPetId) {
    return [];
  }

  const petName = dashboard.activePet.name || '当前宠物';
  const recommendations: PetSignal[] = [];
  const pendingReminderCount = dashboard.totals.pendingReminderCount || 0;
  const lowInventoryCount = dashboard.totals.lowInventoryCount || 0;
  const dueMedicineCount = dashboard.totals.dueMedicineCount || 0;
  const recordCount = dashboard.quickStats.recordCount || 0;
  const careCount = dashboard.quickStats.careCount || 0;
  const milestoneCount = dashboard.quickStats.milestoneCount || 0;

  if (pendingReminderCount === 0) {
    recommendations.push({
      key: 'owner-recommend-schedule',
      title: '今天可以先补一个照护提醒',
      description: `${petName} 当前没有待处理提醒，先安排一条喂食、护理或复查任务，会让后面的日程更完整。`,
      tone: 'gentle',
      actionLabel: '去新增提醒',
      actionUrl: `/pages/AddPetReminder/index?petId=${currentPetId}&returnTo=service-center`,
    });
  }

  if (recordCount === 0) {
    recommendations.push({
      key: 'owner-recommend-record',
      title: '建议先沉淀第一条日常记录',
      description: `有了第一条记录之后，${petName} 的报告、时间线和统计页才会真正开始形成闭环。`,
      tone: 'gentle',
      actionLabel: '去补日常记录',
      actionUrl: `/pages/AddPetRecord/index?petId=${currentPetId}&mode=record&returnTo=service-center`,
    });
  } else if (careCount === 0) {
    recommendations.push({
      key: 'owner-recommend-care',
      title: '可以补一条护理记录',
      description: `护理页现在还是空的，先补一条洗护、驱虫或复查记录，后面的服务视图会更完整。`,
      tone: 'gentle',
      actionLabel: '去补护理',
      actionUrl: `/pages/AddPetRecord/index?petId=${currentPetId}&mode=care&returnTo=service-center`,
    });
  }

  if (lowInventoryCount === 0 && dueMedicineCount === 0) {
    recommendations.push({
      key: 'owner-recommend-report',
      title: '当前适合回看一次整体报告',
      description: `提醒、库存和疗程都比较平稳时，最适合去看摘要趋势，确认 ${petName} 最近的照护节奏。`,
      tone: 'gentle',
      actionLabel: '去看宠物报告',
      actionUrl: `/pages/PetReport/index?petId=${currentPetId}`,
    });
  }

  if (milestoneCount > 0) {
    recommendations.push({
      key: 'owner-recommend-timeline',
      title: '可以回时间线整理最近变化',
      description: `你已经有成长节点了，现在回时间线最适合连着看提醒、记录和里程碑有没有串起来。`,
      tone: 'gentle',
      actionLabel: '去看时间线',
      actionUrl: `/pages/PetTimeline/index?petId=${currentPetId}`,
    });
  }

  return recommendations.slice(0, 3);
};

export const buildOwnerFocusCards = (
  dashboard: OwnerOverviewData | null,
  currentPetId: string
): PetSignal[] => {
  if (!dashboard?.activePet || !currentPetId) {
    return [];
  }

  const petName = dashboard.activePet.name || '当前宠物';
  const focusCards: PetSignal[] = [];
  const pendingReminderCount = dashboard.totals.pendingReminderCount || 0;
  const overdueReminderCount = dashboard.totals.overdueReminderCount || 0;
  const lowInventoryCount = dashboard.totals.lowInventoryCount || 0;
  const dueMedicineCount = dashboard.totals.dueMedicineCount || 0;
  const recordCount = dashboard.quickStats.recordCount || 0;
  const careCount = dashboard.quickStats.careCount || 0;
  const milestoneCount = dashboard.quickStats.milestoneCount || 0;

  if (overdueReminderCount > 0) {
    focusCards.push({
      key: 'owner-focus-overdue',
      title: '今天先把逾期提醒清掉',
      description: `当前有 ${overdueReminderCount} 条提醒已经过期，先处理这些安排，${petName} 的服务中心会立刻清爽很多。`,
      tone: 'urgent',
      actionLabel: '去处理提醒',
      actionUrl: '/pages/PetSchedule/index',
      actionType: 'switchTab',
    });
  } else if (pendingReminderCount > 0) {
    focusCards.push({
      key: 'owner-focus-pending',
      title: '今天还有待处理提醒',
      description: `当前还有 ${pendingReminderCount} 条待办，先把日程里的安排做完，再回来看库存和记录会更顺。`,
      tone: 'attention',
      actionLabel: '回到日程页',
      actionUrl: '/pages/PetSchedule/index',
      actionType: 'switchTab',
    });
  } else {
    focusCards.push({
      key: 'owner-focus-clear',
      title: '今天的提醒节奏比较平稳',
      description: `${petName} 当前没有积压提醒，今天更适合继续补记录、整理时间线或回看报告。`,
      tone: 'gentle',
      actionLabel: '去看宠物报告',
      actionUrl: `/pages/PetReport/index?petId=${currentPetId}`,
    });
  }

  if (lowInventoryCount > 0 || dueMedicineCount > 0) {
    focusCards.push({
      key: 'owner-focus-supplies',
      title: '库存和疗程值得顺手确认一次',
      description: `当前食物关注 ${lowInventoryCount} 条、用药关注 ${dueMedicineCount} 条。把这些风险一起处理，会比之后分散补救更省心。`,
      tone: lowInventoryCount + dueMedicineCount > 1 ? 'attention' : 'gentle',
      actionLabel: dueMedicineCount > 0 ? '去看用药' : '去看食物库存',
      actionUrl:
        dueMedicineCount > 0
          ? `/pages/PetMedicine/index?petId=${currentPetId}`
          : `/pages/PetFood/index?petId=${currentPetId}`,
    });
  } else {
    focusCards.push({
      key: 'owner-focus-health',
      title: '库存和疗程目前都比较稳定',
      description: `当前没有明显的补货或续用压力，适合把注意力放在记录完整度和成长节点整理上。`,
      tone: 'gentle',
      actionLabel: '去看时间线',
      actionUrl: `/pages/PetTimeline/index?petId=${currentPetId}`,
    });
  }

  focusCards.push({
    key: 'owner-focus-growth',
    title:
      milestoneCount > 0
        ? `已经沉淀了 ${milestoneCount} 个成长节点`
        : '成长档案还没有关键节点',
    description:
      milestoneCount > 0
        ? `当前还有 ${recordCount} 条日常、${careCount} 条护理，可以回时间线看看这些内容有没有形成完整成长过程。`
        : `现在最值得补的是一个关键里程碑，这会让 ${petName} 的档案、报告和服务视图一下完整很多。`,
    tone: milestoneCount > 0 ? 'gentle' : 'attention',
    actionLabel: milestoneCount > 0 ? '去看里程碑' : '去补里程碑',
    actionUrl: `/pages/PetMilestones/index?petId=${currentPetId}`,
  });

  return focusCards;
};

export const buildOwnerRhythmSummary = (
  dashboard: OwnerOverviewData | null
): OwnerRhythmSummary | null => {
  if (!dashboard?.activePet) {
    return null;
  }

  const pendingReminderCount = dashboard.totals.pendingReminderCount || 0;
  const lowInventoryCount = dashboard.totals.lowInventoryCount || 0;
  const dueMedicineCount = dashboard.totals.dueMedicineCount || 0;
  const recordCount = dashboard.quickStats.recordCount || 0;
  const careCount = dashboard.quickStats.careCount || 0;
  const milestoneCount = dashboard.quickStats.milestoneCount || 0;

  if (pendingReminderCount === 0 && lowInventoryCount === 0 && dueMedicineCount === 0) {
    return {
      title: '当前服务节奏比较平稳',
      description: `提醒、库存和疗程都没有明显积压，当前更适合补充记录与成长节点。已沉淀日常 ${recordCount} 条、护理 ${careCount} 条、里程碑 ${milestoneCount} 个。`,
      tone: 'gentle',
    };
  }

  if (pendingReminderCount <= 2 && lowInventoryCount + dueMedicineCount <= 1) {
    return {
      title: '当前服务节奏可控',
      description: `现在主要是一些轻量待办需要跟进，优先清理 ${pendingReminderCount} 条提醒，再顺手检查库存或疗程即可。已沉淀日常 ${recordCount} 条、护理 ${careCount} 条。`,
      tone: 'attention',
    };
  }

  return {
    title: '当前服务节奏偏忙',
    description: `提醒、库存或疗程里已经出现连续待处理项，建议先处理风险，再回来补记录和成长节点。当前提醒 ${pendingReminderCount} 条，库存关注 ${lowInventoryCount} 条，用药关注 ${dueMedicineCount} 条。`,
    tone: 'urgent',
  };
};

export const buildReportRecommendations = (
  report: ReportData | null,
  currentPetId: string
): PetSignal[] => {
  if (!report?.activePet || !currentPetId) {
    return [];
  }

  const petName = report.activePet.name || '当前宠物';
  const recommendations: PetSignal[] = [];
  const pendingSchedules = report.summary.pendingSchedules || 0;
  const totalRecords = report.summary.totalRecords || 0;
  const totalCareRecords = report.summary.totalCareRecords || 0;
  const totalMilestones = report.summary.totalMilestones || 0;
  const recentExpense = report.summary.recentExpense || 0;
  const topExpenseCategory = report.topExpenseCategory || '未分类';
  const recent7ExpensePeak = Math.max(...(report.recent7Days || []).map((item) => Number(item.expense || 0)), 0);

  if (pendingSchedules === 0) {
    recommendations.push({
      key: 'report-recommend-schedule',
      title: '报告里没有积压提醒，可以主动安排下一步',
      description: `趁现在状态平稳，先给 ${petName} 补一条后续提醒，比等到临时再补更顺。`,
      tone: 'gentle',
      actionLabel: '去新增提醒',
      actionUrl: `/pages/AddPetReminder/index?petId=${currentPetId}&returnTo=report`,
    });
  }

  if (totalRecords > 0 && totalCareRecords > 0) {
    recommendations.push({
      key: 'report-recommend-timeline',
      title: '可以回时间线看最近沉淀是否连贯',
      description: `日常和护理都已经有内容了，下一步最适合回时间线看看最近这段照护记录是不是串起来了。`,
      tone: 'gentle',
      actionLabel: '去看时间线',
      actionUrl: `/pages/PetTimeline/index?petId=${currentPetId}`,
    });
  }

  if (recentExpense > 0) {
    recommendations.push({
      key: 'report-recommend-expense',
      title: `最近 30 天已经产生花销，适合再看一次分类构成`,
      description: `当前最高频的花销分类是${topExpenseCategory}，如果最近 7 天有单日花销峰值，也可以顺手核对有没有异常支出。`,
      tone: 'gentle',
      actionLabel: recent7ExpensePeak > 0 ? '去看花销统计' : '去补花销记录',
      actionUrl:
        recent7ExpensePeak > 0
          ? `/pages/PetExpenseStats/index?petId=${currentPetId}`
          : `/pages/AddPetRecord/index?petId=${currentPetId}&mode=expense&returnTo=report`,
    });
  }

  if (totalMilestones === 0) {
    recommendations.push({
      key: 'report-recommend-milestone',
      title: '建议尽快补一个成长节点',
      description: `现在报告里最缺的是“阶段感”。先补一个里程碑，${petName} 的成长线会立刻清晰很多。`,
      tone: 'gentle',
      actionLabel: '去补里程碑',
      actionUrl: `/pages/PetMilestones/index?petId=${currentPetId}`,
    });
  }

  if (totalRecords === 0 && totalCareRecords === 0) {
    recommendations.push({
      key: 'report-recommend-first-record',
      title: '可以先补第一条正式记录',
      description: `报告已经能打开了，但数据还不够厚。先补一条记录，后面趋势、亮点和推荐都会更准。`,
      tone: 'gentle',
      actionLabel: '去补记录',
      actionUrl: `/pages/AddPetRecord/index?petId=${currentPetId}&mode=record&returnTo=report`,
    });
  }

  return recommendations.slice(0, 3);
};

export const buildReportFocusCards = (report: ReportData | null, currentPetId: string): PetSignal[] => {
  if (!report?.activePet || !currentPetId) {
    return [];
  }

  const petName = report.activePet.name || '当前宠物';
  const focusCards: PetSignal[] = [];
  const pendingSchedules = report.summary.pendingSchedules || 0;
  const overdueSchedules = report.summary.overdueSchedules || 0;
  const weekRecordCount = (report.recent7Days || []).reduce(
    (sum, item) => sum + Number(item.recordCount || 0),
    0
  );
  const weekCareCount = (report.recent7Days || []).reduce(
    (sum, item) => sum + Number(item.careCount || 0),
    0
  );
  const weekExpense = (report.recent7Days || []).reduce(
    (sum, item) => sum + Number(item.expense || 0),
    0
  );
  const recentMilestones = report.recent30Days.milestones || 0;

  if (overdueSchedules > 0) {
    focusCards.push({
      key: 'focus-overdue',
      title: '本周重点是先清理逾期提醒',
      description: `目前有 ${overdueSchedules} 条提醒已经过期，先把这些安排处理掉，${petName} 这周的照护节奏才会重新回到正轨。`,
      tone: 'urgent',
      actionLabel: '回到日程处理',
      actionUrl: '/pages/PetSchedule/index',
      actionType: 'switchTab',
    });
  } else if (pendingSchedules > 0) {
    focusCards.push({
      key: 'focus-pending',
      title: '本周还留有待处理安排',
      description: `当前还有 ${pendingSchedules} 条提醒没完成，适合把这些待办清掉，再去补记录和里程碑。`,
      tone: 'attention',
      actionLabel: '继续处理提醒',
      actionUrl: '/pages/PetSchedule/index',
      actionType: 'switchTab',
    });
  } else {
    focusCards.push({
      key: 'focus-calm',
      title: '本周提醒节奏比较平稳',
      description: `${petName} 当前没有积压提醒，这一周更适合把注意力放在记录完整度和阶段回顾上。`,
      tone: 'gentle',
      actionLabel: '去看时间线',
      actionUrl: `/pages/PetTimeline/index?petId=${currentPetId}`,
    });
  }

  focusCards.push({
    key: 'focus-activity',
    title:
      weekRecordCount + weekCareCount > 0
        ? `近 7 天新增了 ${weekRecordCount} 条日常和 ${weekCareCount} 条护理`
        : '近 7 天还没有形成连续照护记录',
    description:
      weekRecordCount + weekCareCount > 0
        ? `这一周已经有持续记录，适合回时间线检查这些变化有没有串联成完整照护过程。`
        : `最近一周的记录偏少，建议先补一条日常或护理，让报告里的趋势更有参考价值。`,
    tone: weekRecordCount + weekCareCount > 0 ? 'gentle' : 'attention',
    actionLabel: weekRecordCount + weekCareCount > 0 ? '回看时间线' : '去补一条记录',
    actionUrl:
      weekRecordCount + weekCareCount > 0
        ? `/pages/PetTimeline/index?petId=${currentPetId}`
        : `/pages/AddPetRecord/index?petId=${currentPetId}&mode=record&returnTo=report`,
  });

  focusCards.push({
    key: 'focus-stage',
    title:
      recentMilestones > 0
        ? `最近 30 天记录了 ${recentMilestones} 个成长节点`
        : `最近 30 天还没有新增成长节点`,
    description:
      recentMilestones > 0
        ? `成长线已经开始形成了。现在再结合花销 ￥${Number(weekExpense).toFixed(2)} 的周内变化，会更容易看出这一阶段的照护节奏。`
        : `这份报告的数据已经有基础了，但阶段感还不够强，补一个里程碑会让 ${petName} 的成长故事更完整。`,
    tone: recentMilestones > 0 ? 'gentle' : 'attention',
    actionLabel: recentMilestones > 0 ? '去看里程碑' : '去补里程碑',
    actionUrl: `/pages/PetMilestones/index?petId=${currentPetId}`,
  });

  return focusCards;
};

export const buildReportRhythmSummary = (report: ReportData | null): ReportRhythmSummary | null => {
  if (!report?.activePet) {
    return null;
  }

  const activeDays = (report.recent7Days || []).filter(
    (item) => Number(item.recordCount || 0) > 0 || Number(item.careCount || 0) > 0
  ).length;
  const weekExpense = (report.recent7Days || []).reduce(
    (sum, item) => sum + Number(item.expense || 0),
    0
  );
  const totalWeekRecords = (report.recent7Days || []).reduce(
    (sum, item) => sum + Number(item.recordCount || 0),
    0
  );
  const totalWeekCare = (report.recent7Days || []).reduce(
    (sum, item) => sum + Number(item.careCount || 0),
    0
  );

  if (activeDays >= 5) {
    return {
      title: '这周的照护节奏比较稳定',
      description: `近 7 天里有 ${activeDays} 天产生了记录或护理，累计日常 ${totalWeekRecords} 条、护理 ${totalWeekCare} 条，属于持续跟进得比较稳的一周。当前周内花销约 ￥${weekExpense.toFixed(2)}。`,
      tone: 'gentle',
    };
  }

  if (activeDays >= 2) {
    return {
      title: '这周的照护节奏正在形成',
      description: `近 7 天里有 ${activeDays} 天沉淀了内容，已经开始形成连续记录，但还可以再补几条关键节点，让阶段报告更完整。当前周内花销约 ￥${weekExpense.toFixed(2)}。`,
      tone: 'attention',
    };
  }

  return {
    title: '这周的照护节奏还比较稀疏',
    description: `近 7 天里只有 ${activeDays} 天留下了记录，当前更适合先补日常或护理，再回来看这份报告。当前周内花销约 ￥${weekExpense.toFixed(2)}。`,
    tone: 'attention',
  };
};
