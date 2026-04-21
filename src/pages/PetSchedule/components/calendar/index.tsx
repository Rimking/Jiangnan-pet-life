import { View, Text, Image } from '@tarojs/components';
import clsx from 'clsx';
import { useState, useEffect, useCallback } from 'react';
import LeftIcon from '@/assets/leftIcon.svg';

interface CalendarItem {
  day: number;
  year: number;
  month: number;
  type: 'prev' | 'current' | 'next';
  isToday?: boolean;
}

interface Props {
  selectedDate: string;
  onSelectDate: (date: string) => void;
}

const pad = (num: number) => `${num}`.padStart(2, '0');
const dateKey = (year: number, month: number, day: number) => `${year}-${pad(month)}-${pad(day)}`;

const CalendarCmp = ({ selectedDate, onSelectDate }: Props) => {
  const [calendarData, setCalendarData] = useState<CalendarItem[]>([]);
  const [currentYear, setCurrentYear] = useState(0);
  const [currentMonth, setCurrentMonth] = useState(0);
  const [today, setToday] = useState({ year: 0, month: 0, day: 0 });

  useEffect(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();

    setToday({ year, month, day });
    setCurrentYear(year);
    setCurrentMonth(month);
  }, []);

  const generateCalendar = useCallback(
    (year: number, month: number) => {
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

      const nextCalendarData: CalendarItem[] = [];

      for (let i = 0; i < prevDaysCount; i++) {
        const day = prevMonthTotalDays - prevDaysCount + 1 + i;
        nextCalendarData.push({
          day,
          year: month === 1 ? year - 1 : year,
          month: month === 1 ? 12 : month - 1,
          type: 'prev',
        });
      }

      for (let i = 1; i <= totalDaysOfMonth; i++) {
        nextCalendarData.push({
          day: i,
          year,
          month,
          type: 'current',
          isToday: year === today.year && month === today.month && i === today.day,
        });
      }

      for (let i = 1; i <= nextDaysCount; i++) {
        nextCalendarData.push({
          day: i,
          year: month === 12 ? year + 1 : year,
          month: month === 12 ? 1 : month + 1,
          type: 'next',
        });
      }

      setCalendarData(nextCalendarData);
    },
    [today.day, today.month, today.year]
  );

  useEffect(() => {
    if (currentYear && currentMonth) {
      generateCalendar(currentYear, currentMonth);
    }
  }, [currentYear, currentMonth, generateCalendar]);

  const handlePrevMonth = useCallback(() => {
    let newMonth = currentMonth - 1;
    let newYear = currentYear;
    if (newMonth < 1) {
      newMonth = 12;
      newYear -= 1;
    }
    setCurrentYear(newYear);
    setCurrentMonth(newMonth);
  }, [currentMonth, currentYear]);

  const handleNextMonth = useCallback(() => {
    let newMonth = currentMonth + 1;
    let newYear = currentYear;
    if (newMonth > 12) {
      newMonth = 1;
      newYear += 1;
    }
    setCurrentYear(newYear);
    setCurrentMonth(newMonth);
  }, [currentMonth, currentYear]);

  return (
    <View className="px-[20px] py-[20px] bg-[#f4f4f4] border-[4px] border-black border-solid rounded-[20px]">
      <View className="flex justify-between items-center mb-[10px]">
        <View className="w-[40rpx] h-[40rpx] flex items-center justify-center" onClick={handlePrevMonth}>
          <Image src={LeftIcon} className="w-[40rpx] h-[40rpx]" />
        </View>

        <View className="text-[32rpx] font-bold">{currentYear}年{currentMonth}月</View>

        <View
          className="w-[40rpx] h-[40rpx] flex items-center justify-center"
          style={{ transform: 'rotate(180deg)' }}
          onClick={handleNextMonth}
        >
          <Image src={LeftIcon} className="w-[40rpx] h-[40rpx]" />
        </View>
      </View>

      <View className="flex mb-1">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((week) => (
          <View key={week} className="flex-1 text-center py-[10rpx] text-[22rpx] text-[#868686]">
            {week}
          </View>
        ))}
      </View>

      <View className="flex flex-wrap">
        {calendarData.map((item, index) => {
          const key = dateKey(item.year, item.month, item.day);
          return (
            <View
              key={`${key}-${index}`}
              className={clsx('flex items-center justify-center w-[90px] h-[74px]', {
                'text-[#a9a9a9]': item.type === 'prev' || item.type === 'next',
              })}
              onClick={() => onSelectDate(key)}
            >
              <View
                className={clsx(
                  'w-[52px] h-[52px] flex items-center justify-center text-[24rpx] rounded-[12px]',
                  {
                    'bg-black text-white': item.isToday,
                    'bg-[#ffcf96] text-[#222]': selectedDate === key && !item.isToday,
                  }
                )}
              >
                {item.day}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default CalendarCmp;
