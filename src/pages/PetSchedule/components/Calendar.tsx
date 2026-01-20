import { View, Text } from '@tarojs/components';
import { memo, useState } from 'react';

const Calendar = memo(function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(8); // 8月
  const [currentYear, setCurrentYear] = useState(2024);
  const [selectedDate, setSelectedDate] = useState(8); // 选中的日期

  // 生成日历数据
  const generateCalendarDays = () => {
    const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth - 1, 1).getDay();
    const days = [];

    // 添加上个月的占位天数
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push({ day: '', isCurrentMonth: false });
    }

    // 添加当前月的天数
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, isCurrentMonth: true });
    }

    return days;
  };

  const calendarDays = generateCalendarDays();
  const weekdays = ['日', '一', '二', '三', '四', '五', '六'];

  return (
    <View className="calendar" style={{ backgroundColor: '#FFF', borderRadius: '12px', padding: '16px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
      <View style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <View style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#E0E0E0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: '12px' }}>←</Text>
        </View>
        <Text style={{ fontSize: '16px', fontWeight: 'bold' }}>{currentMonth}月</Text>
        <View style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#E0E0E0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: '12px' }}>→</Text>
        </View>
      </View>

      <View style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', marginBottom: '8px' }}>
        {weekdays.map((day, index) => (
          <Text key={index} style={{ textAlign: 'center', fontSize: '12px', color: '#666' }}>{day}</Text>
        ))}
      </View>

      <View style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
        {calendarDays.map((item, index) => (
          <View
            key={index}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: item.day === selectedDate ? '#FF6B6B' : item.isCurrentMonth ? '#FFF' : '#F5F5F5',
              border: item.day === selectedDate ? '2px solid #FF6B6B' : '1px solid #E0E0E0'
            }}
            onClick={() => item.isCurrentMonth && setSelectedDate(item.day)}
          >
            <Text style={{
              fontSize: '12px',
              color: item.day === selectedDate ? '#FFF' : item.isCurrentMonth ? '#333' : '#999'
            }}>{item.day}</Text>
          </View>
        ))}
      </View>
    </View>
  );
});

export default Calendar;