const pad = (value: number) => String(value).padStart(2, '0');

export const formatLocalDateKey = (date: Date) => {
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  return `${year}-${month}-${day}`;
};

// 获取当天和前七天的日期，格式 yyyy-MM-dd
export const getTodayByWeek = () => {
  const today = new Date();
  today.setDate(new Date().getDate());
  const formattedToday = formatLocalDateKey(today);

  const yesterday = new Date();
  yesterday.setDate(new Date().getDate() - 1);
  const formattedYesterday = formatLocalDateKey(yesterday);

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(new Date().getDate() - 7);
  const formattedSevenDaysAgo = formatLocalDateKey(sevenDaysAgo);

  return {
    yesTerday: formattedYesterday,
    week: formattedSevenDaysAgo,
    today: formattedToday,
  };
};
