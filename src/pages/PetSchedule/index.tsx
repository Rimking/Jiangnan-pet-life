import BasicLayout from '@/layout/basicLayout';
import { View, Text, ScrollView } from '@tarojs/components';
import { memo, useState, useMemo } from 'react';
import { useAtom } from 'jotai';
import Taro from '@tarojs/taro';
import { schedulesAtom, completeScheduleAtom, currentPetAtom, petsAtom } from '@/store';
import { Schedule } from '@/constants/mockData';
import Calendar from './components/calendar';
import { theme, gradients, shadows, borderRadius, typography } from '@/styles/theme';

const enum TabType {
  Record = 'record',
  Reminder = 'reminder',
}

const PetSchedule = memo(function PetSchedule() {
  const [activeTab, setActiveTab] = useState(TabType.Reminder);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [schedules] = useAtom(schedulesAtom);
  const [, completeSchedule] = useAtom(completeScheduleAtom);
  const [currentPet] = useAtom(currentPetAtom);
  const [pets] = useAtom(petsAtom);

  const today = new Date().toISOString().split('T')[0];

  const todaySchedules = useMemo(() => {
    return schedules.filter(s => s.date === today && (!currentPet || s.petId === currentPet.id));
  }, [schedules, today, currentPet]);

  const completedCount = todaySchedules.filter(s => s.isCompleted).length;
  const pendingCount = todaySchedules.filter(s => !s.isCompleted).length;

  const selectedDateSchedules = useMemo(() => {
    return schedules.filter(s => s.date === selectedDate && (!currentPet || s.petId === currentPet.id));
  }, [schedules, selectedDate, currentPet]);

  const handleComplete = (scheduleId: string) => {
    Taro.vibrateShort();
    completeSchedule(scheduleId);
  };

  const handleDelete = (scheduleId: string) => {
    Taro.showModal({
      title: '确认删除',
      content: '确定要删除这个日程吗？',
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({ title: '删除成功', icon: 'success' });
        }
      },
    });
  };

  const getPetName = (petId: string) => {
    const pet = pets.find(p => p.id === petId);
    return pet?.name || '未知';
  };

  return (
    <BasicLayout
      navOptions={{
        navTitle: '日程提醒',
        needBack: false,
        useGradient: true,
      }}
    >
      <ScrollView
        style={{
          marginTop: '96rpx',
          paddingBottom: '160rpx',
        }}
        scrollY
      >
        <View
          style={{
            margin: '0 32rpx 32rpx',
            flexDirection: 'row',
            height: '88rpx',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: '#FFFFFF',
            borderRadius: borderRadius.medium,
            padding: '8rpx',
            boxShadow: shadows.soft,
          }}
        >
          <View
            style={{
              flex: 1,
              height: '100%',
              borderRadius: borderRadius.small,
              backgroundColor: activeTab === TabType.Record ? theme.primary.main : 'transparent',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onClick={() => setActiveTab(TabType.Record)}
          >
            <Text
              style={{
                fontSize: typography.fontSize.md,
                fontWeight: typography.fontWeight.medium,
                color: activeTab === TabType.Record ? 'white' : theme.text.primary,
              }}
            >
              记录
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              height: '100%',
              borderRadius: borderRadius.small,
              backgroundColor: activeTab === TabType.Reminder ? theme.primary.main : 'transparent',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onClick={() => setActiveTab(TabType.Reminder)}
          >
            <Text
              style={{
                fontSize: typography.fontSize.md,
                fontWeight: typography.fontWeight.medium,
                color: activeTab === TabType.Reminder ? 'white' : theme.text.primary,
              }}
            >
              提醒
            </Text>
          </View>
        </View>

        <View
          style={{
            margin: '0 32rpx 32rpx',
            padding: '32rpx',
            background: '#FFFFFF',
            borderRadius: borderRadius.large,
            boxShadow: shadows.card,
          }}
        >
          <Calendar />
        </View>

        <View
          style={{
            margin: '0 32rpx 32rpx',
            padding: '32rpx',
            background: '#FFFFFF',
            borderRadius: borderRadius.large,
            boxShadow: shadows.card,
          }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24rpx' }}>
            <Text style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.semibold, color: theme.text.primary }}>今日日程</Text>
            <Text style={{ fontSize: typography.fontSize.sm, color: theme.text.tertiary }}>
              完成{completedCount}/未完成{pendingCount}
            </Text>
          </View>

          {todaySchedules.length === 0 ? (
            <View style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingVertical: '48rpx' }}>
              <Text style={{ fontSize: '64rpx', marginBottom: '16rpx' }}>✨</Text>
              <Text style={{ fontSize: typography.fontSize.md, color: theme.text.tertiary }}>今日暂无日程</Text>
            </View>
          ) : (
            <View style={{ flexDirection: 'column', gap: '20rpx' }}>
              {todaySchedules.map(schedule => (
                <View
                  key={schedule.id}
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingVertical: '20rpx',
                    borderBottomWidth: '1rpx',
                    borderBottomColor: '#F0F0F5',
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: '20rpx', flex: 1 }}>
                    <View
                      style={{
                        width: '64rpx',
                        height: '64rpx',
                        borderRadius: borderRadius.medium,
                        background: `${theme.primary.light}`,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Text style={{ fontSize: '32rpx' }}>{schedule.icon}</Text>
                    </View>
                    <View>
                      <Text style={{
                        fontSize: typography.fontSize.md,
                        color: schedule.isCompleted ? theme.text.tertiary : theme.text.primary,
                        textDecoration: schedule.isCompleted ? 'line-through' : 'none',
                      }}>
                        {schedule.title}
                      </Text>
                      <Text style={{ fontSize: typography.fontSize.xs, color: theme.text.tertiary }}>{getPetName(schedule.petId)}</Text>
                    </View>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: '16rpx' }}>
                    <Text style={{ fontSize: typography.fontSize.sm, color: theme.text.tertiary }}>{schedule.time}</Text>
                    {!schedule.isCompleted ? (
                      <View
                        style={{
                          paddingHorizontal: '20rpx',
                          paddingVertical: '8rpx',
                          borderRadius: borderRadius.full,
                          borderWidth: '2rpx',
                          borderColor: theme.primary.main,
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                        onClick={() => handleComplete(schedule.id)}
                      >
                        <Text style={{ fontSize: typography.fontSize.xs, color: theme.primary.main, fontWeight: typography.fontWeight.medium }}>完成</Text>
                      </View>
                    ) : (
                      <View
                        style={{
                          paddingHorizontal: '20rpx',
                          paddingVertical: '8rpx',
                          borderRadius: borderRadius.full,
                          background: theme.success.main,
                        }}
                      >
                        <Text style={{ fontSize: typography.fontSize.xs, color: 'white', fontWeight: typography.fontWeight.medium }}>已完成</Text>
                      </View>
                    )}
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={{ margin: '0 32rpx' }}>
          <View
            style={{
              height: '88rpx',
              borderRadius: borderRadius.full,
              background: gradients.primary,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              boxShadow: shadows.medium,
            }}
            onClick={() => Taro.navigateTo({ url: '/pages/AddPetReminder/index' })}
          >
            <Text style={{ fontSize: typography.fontSize.lg, color: 'white', fontWeight: typography.fontWeight.medium }}>添加新日程</Text>
          </View>
        </View>
      </ScrollView>
    </BasicLayout>
  );
});

export default PetSchedule;
