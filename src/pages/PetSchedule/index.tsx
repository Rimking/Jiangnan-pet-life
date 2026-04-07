import BasicLayout from '@/layout/basicLayout';
import { View, Text, ScrollView } from '@tarojs/components';
import { memo, useState, useMemo } from 'react';
import Taro from '@tarojs/taro';
import { mockSchedules, mockPets } from '@/constants/mockData';
import Calendar from './components/calendar';
import { theme, gradients, shadows, borderRadius, typography } from '@/styles/theme';

const enum TabType {
  Record = 'record',
  Reminder = 'reminder',
}

// 宠物日程
const PetSchedule = memo(function PetSchedule() {
  const [activeTab, setActiveTab] = useState(TabType.Reminder);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // 获取今日日程
  const today = new Date().toISOString().split('T')[0];

  // 今日日程
  const todaySchedules = useMemo(() => {
    return mockSchedules.filter(s => s.date === today);
  }, []);

  // 未完成日程
  const uncompletedSchedules = useMemo(() => {
    return mockSchedules.filter(s => s.status === 'pending' && s.date <= today);
  }, []);

  // 选中日期日程
  const selectedDateSchedules = useMemo(() => {
    return mockSchedules.filter(s => s.date === selectedDate);
  }, [selectedDate]);

  const handleComplete = (scheduleId: string) => {
    Taro.showToast({ title: '标记完成', icon: 'success' });
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

  const getScheduleIcon = (type: string) => {
    const iconMap: Record<string, string> = {
      health: '💊',
      daily: '🍖',
      care: '🛁',
      custom: '📌',
    };
    return iconMap[type] || '📌';
  };

  const getPetName = (petId: string) => {
    if (petId === 'all') return '全部宠物';
    const pet = mockPets.find(p => p.id === petId);
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
        {/* 标签切换 */}
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

        {/* 日历组件 - 保留现有实现 */}
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

        {/* 今日日程 */}
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
              完成{todaySchedules.filter(s => s.status === 'completed').length}/
              未完成{todaySchedules.filter(s => s.status === 'pending').length}
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
                        background: schedule.type === 'health' 
                          ? `${theme.status.danger}20`
                          : schedule.type === 'daily'
                          ? `${theme.orange.main}20`
                          : `${theme.cyan.main}20`,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Text style={{ fontSize: '32rpx' }}>{getScheduleIcon(schedule.type)}</Text>
                    </View>
                    <View>
                      <Text style={{
                        fontSize: typography.fontSize.md,
                        color: schedule.status === 'completed' ? theme.text.tertiary : theme.text.primary,
                        textDecoration: schedule.status === 'completed' ? 'line-through' : 'none',
                      }}>
                        {schedule.specificItem}
                      </Text>
                      <Text style={{ fontSize: typography.fontSize.xs, color: theme.text.tertiary }}>{getPetName(schedule.petId)}</Text>
                    </View>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: '16rpx' }}>
                    <Text style={{ fontSize: typography.fontSize.sm, color: theme.text.tertiary }}>{schedule.time}</Text>
                    {schedule.status === 'pending' ? (
                      <View style={{ flexDirection: 'row', gap: '12rpx' }}>
                        <View
                          style={{
                            paddingHorizontal: '20rpx',
                            paddingVertical: '8rpx',
                            borderRadius: borderRadius.full,
                            background: gradients.cyan,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                          onClick={() => handleComplete(schedule.id)}
                        >
                          <Text style={{ fontSize: typography.fontSize.xs, color: 'white', fontWeight: typography.fontWeight.medium }}>完成</Text>
                        </View>
                        <View
                          style={{
                            paddingHorizontal: '20rpx',
                            paddingVertical: '8rpx',
                            borderRadius: borderRadius.full,
                            background: `${theme.status.danger}20`,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}
                          onClick={() => handleDelete(schedule.id)}
                        >
                          <Text style={{ fontSize: typography.fontSize.xs, color: theme.status.danger, fontWeight: typography.fontWeight.medium }}>删除</Text>
                        </View>
                      </View>
                    ) : (
                      <View
                        style={{
                          paddingHorizontal: '20rpx',
                          paddingVertical: '8rpx',
                          borderRadius: borderRadius.full,
                          background: `${theme.status.success}20`,
                        }}
                      >
                        <Text style={{ fontSize: typography.fontSize.xs, color: theme.status.success, fontWeight: typography.fontWeight.medium }}>已完成</Text>
                      </View>
                    )}
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* 未完成高亮 */}
        {uncompletedSchedules.length > 0 && (
          <View
            style={{
              margin: '0 32rpx 32rpx',
              padding: '32rpx',
              background: gradients.cardBg,
              borderRadius: borderRadius.large,
              boxShadow: shadows.card,
              borderWidth: '2rpx',
              borderColor: `${theme.status.danger}30`,
            }}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24rpx' }}>
              <Text style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.semibold, color: theme.status.danger }}>
                未完成日程（{uncompletedSchedules.length}条）
              </Text>
              <View
                style={{
                  paddingHorizontal: '24rpx',
                  paddingVertical: '8rpx',
                  borderRadius: borderRadius.full,
                  background: `${theme.primary.main}20`,
                }}
              >
                <Text style={{ fontSize: typography.fontSize.sm, color: theme.primary.main, fontWeight: typography.fontWeight.medium }}>全部处理</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'column', gap: '20rpx' }}>
              {uncompletedSchedules.slice(0, 3).map(schedule => (
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
                        background: `${theme.status.danger}20`,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Text style={{ fontSize: '32rpx' }}>{getScheduleIcon(schedule.type)}</Text>
                    </View>
                    <View>
                      <Text style={{ fontSize: typography.fontSize.md, color: theme.text.primary }}>{schedule.specificItem}</Text>
                      <Text style={{ fontSize: typography.fontSize.xs, color: theme.text.tertiary }}>{schedule.date} {schedule.time}</Text>
                    </View>
                  </View>
                  <View style={{ flexDirection: 'row', gap: '12rpx' }}>
                    <View
                      style={{
                        paddingHorizontal: '20rpx',
                        paddingVertical: '8rpx',
                        borderRadius: borderRadius.full,
                        background: gradients.cyan,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                      onClick={() => handleComplete(schedule.id)}
                    >
                      <Text style={{ fontSize: typography.fontSize.xs, color: 'white', fontWeight: typography.fontWeight.medium }}>完成</Text>
                    </View>
                    <View
                      style={{
                        paddingHorizontal: '20rpx',
                        paddingVertical: '8rpx',
                        borderRadius: borderRadius.full,
                        background: `${theme.status.danger}20`,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                      onClick={() => handleDelete(schedule.id)}
                    >
                      <Text style={{ fontSize: typography.fontSize.xs, color: theme.status.danger, fontWeight: typography.fontWeight.medium }}>删除</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* 添加日程按钮 */}
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
