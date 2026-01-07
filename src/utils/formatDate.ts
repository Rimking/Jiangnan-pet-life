// 获取当天和前七天的日期，格式为 yyyy-MM-d
export const getTodayByWeek = () => {
  // 获取当天日期
  const today = new Date();
  today.setDate(new Date().getDate());
  const formattedToday = today.toISOString().split('T')[0];

  const yesterday = new Date();
  yesterday.setDate(new Date().getDate() - 1);
  const formattedYesterday = yesterday.toISOString().split('T')[0];

  // 获取前七天日期
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(new Date().getDate() - 7);
  const formattedSevenDaysAgo = sevenDaysAgo.toISOString().split('T')[0];
  return {
    yesTerday: formattedYesterday,
    week: formattedSevenDaysAgo,
    today: formattedToday,
  };
};
