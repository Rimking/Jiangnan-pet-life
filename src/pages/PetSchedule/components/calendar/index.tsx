import { View, Button, Text, Image } from '@tarojs/components';
import clsx from 'clsx';
import { useState, useEffect, useCallback, useMemo } from 'react';
import LeftIcon from '@/assets/leftIcon.svg';

// 定义日期项的类型（TypeScript 可选）
interface CalendarItem {
  day: number;
  year: number;
  month: number;
  type: 'prev' | 'current' | 'next';
  isToday?: boolean;
}

const CalendarCmp = () => {
  // 1. 状态管理
  const [calendarData, setCalendarData] = useState<CalendarItem[]>([]);
  const [currentYear, setCurrentYear] = useState<number>(0);
  const [currentMonth, setCurrentMonth] = useState<number>(0);
  const [today, setToday] = useState<{ year: number; month: number; day: number }>({
    year: 0,
    month: 0,
    day: 0,
  });
  // 选中的日期
  const [selectedDate, setSelectedDate] = useState<{
    year: number;
    month: number;
    day: number;
  }>({
    year: 0,
    month: 0,
    day: 0,
  });

  // 2. 初始化日历
  useEffect(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    console.log(year, month, day);
    setToday({ year, month, day });
    setCurrentYear(year);
    setCurrentMonth(month);
  }, []);

  useEffect(() => {
    generateCalendar(today.year, today.month);
  }, [today]);

  // 3. 核心：生成日历数据（逻辑不变）
  const generateCalendar = useCallback(
    (year: number, month: number) => {
      try {
        const firstDayOfMonth = new Date(year, month - 1, 1);
        const lastDayOfMonth = new Date(year, month, 0);

        let firstDayWeek = firstDayOfMonth.getDay();
        firstDayWeek = firstDayWeek === 0 ? 7 : firstDayWeek;
        const totalDaysOfMonth = lastDayOfMonth.getDate();

        const prevMonthLastDay = new Date(year, month - 1, 0);
        const prevMonthTotalDays = prevMonthLastDay.getDate();
        const prevDaysCount = firstDayWeek - 1;

        const totalCalendarDays = 42;
        const nextDaysCount = totalCalendarDays - prevDaysCount - totalDaysOfMonth;

        const newCalendarData: CalendarItem[] = [];

        // 补全上月尾巴
        for (let i = 0; i < prevDaysCount; i++) {
          const day = prevMonthTotalDays - prevDaysCount + 1 + i;
          newCalendarData.push({
            day: day,
            year: month === 1 ? year - 1 : year,
            month: month === 1 ? 12 : month - 1,
            type: 'prev',
          });
        }
        console.log(today);

        // 当月日期
        for (let i = 1; i <= totalDaysOfMonth; i++) {
          newCalendarData.push({
            day: i,
            year,
            month,
            type: 'current',
            isToday: year === today.year && month === today.month && i === today.day,
          });
        }

        // 补全下月开头
        for (let i = 1; i <= nextDaysCount; i++) {
          newCalendarData.push({
            day: i,
            year: month === 12 ? year + 1 : year,
            month: month === 12 ? 1 : month + 1,
            type: 'next',
          });
        }
        console.log(newCalendarData);
        setCalendarData(newCalendarData);
      } catch (error) {
        console.error('生成日历数据失败：', error);
      }
    },
    [today]
  );

  // 4. 月份切换
  const handlePrevMonth = useCallback(() => {
    let newMonth = currentMonth - 1;
    let newYear = currentYear;
    if (newMonth < 1) {
      newMonth = 12;
      newYear -= 1;
    }
    setCurrentYear(newYear);
    setCurrentMonth(newMonth);
    generateCalendar(newYear, newMonth);
  }, [currentMonth, currentYear, generateCalendar]);

  const handleNextMonth = useCallback(() => {
    let newMonth = currentMonth + 1;
    let newYear = currentYear;
    if (newMonth > 12) {
      newMonth = 1;
      newYear += 1;
    }
    setCurrentYear(newYear);
    setCurrentMonth(newMonth);
    generateCalendar(newYear, newMonth);
  }, [currentMonth, currentYear, generateCalendar]);

  // 5. 日期点击
  const handleDateTap = useCallback((item: CalendarItem) => {
    console.log('选中的日期：', `${item.year}-${item.month}-${item.day}`);
    setSelectedDate({ year: item.year, month: item.month, day: item.day });
  }, []);

  //   点击了当天
  const isSelected = useCallback(
    (item: CalendarItem) => {
      return (
        item.year === selectedDate.year &&
        item.month === selectedDate.month &&
        item.day === selectedDate.day
      );
    },
    [selectedDate]
  );

  // 6. 渲染（核心：使用 Tailwind 样式类）
  return (
    <View className="px-[24px] py-[24px] bg-[#ffffff] border-[4px] border-black border-solid rounded-[32px]">
      {/* 年月切换栏 */}
      <View className="flex justify-between items-center mb-[20rpx]">
        <View
          className="w-[40rpx] h-[40rpx] flex items-center justify-center "
          onClick={handlePrevMonth}
        >
          <Image src={LeftIcon} className="w-[40rpx] h-[40rpx]"></Image>
        </View>
        <View className="text-[32rpx] font-bold">
          {currentYear}年{currentMonth}月
        </View>
        <View
          className="w-[40rpx] h-[40rpx] flex items-center justify-center"
          style={{ transform: 'rotate(180deg)' }}
          onClick={handleNextMonth}
        >
          <Image src={LeftIcon} className="w-[40rpx] h-[40rpx]"></Image>
        </View>
      </View>

      {/* 星期头部 */}
      <View className="flex">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((week, index) => (
          <View key={index} className="flex-1 text-center py-[15rpx] text-[28rpx]">
            {week}
          </View>
        ))}
      </View>

      {/* 日历主体 */}
      <View className="flex flex-wrap">
        {calendarData.map((item, index) => (
          <View
            key={index}
            className={clsx('flex items-center justify-center w-[92px] h-[80px] ', {
              'text-gray-400': item.type === 'prev' || item.type === 'next',
            })}
            onClick={() => {
              handleDateTap(item);
            }}
          >
            <View
              className={clsx(
                'w-16 h-16 flex items-center justify-center text-[28rpx] rounded-2xl',
                {
                  'bg-[black] text-white': item.isToday,
                  'bg-[#ffc2a3] text-white': isSelected(item),
                }
              )}
            >
              {item.day}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

export default CalendarCmp;
