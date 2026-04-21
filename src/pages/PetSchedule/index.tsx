import BasicLayout from '@/layout/basicLayout';
import { View, Text, ScrollView } from '@tarojs/components';
import { memo, useMemo, useState } from 'react';
import Taro from '@tarojs/taro';
import { useAtom } from 'jotai';
import { schedulesAtom, completeScheduleAtom, currentPetAtom, petsAtom } from '@/store';
import { borderRadius, gradients, shadows, theme, typography } from '@/styles/theme';

const enum TabType {
  Record = 'record',
  Reminder = 'reminder',
}

const PetSchedule = memo(function PetSchedule() {
  const [activeTab, setActiveTab] = useState<TabType>(TabType.Reminder);
  const [schedules] = useAtom(schedulesAtom);
  const [, completeSchedule] = useAtom(completeScheduleAtom);
  const [currentPet] = useAtom(currentPetAtom);
  const [pets] = useAtom(petsAtom);

  const today = new Date().toISOString().split('T')[0];

  const todaySchedules = useMemo(
    () => schedules.filter((s) => s.date === today && (!currentPet || s.petId === currentPet.id)),
    [schedules, today, currentPet],
  );

  const completedCount = todaySchedules.filter((s) => s.isCompleted).length;
  const pendingCount = todaySchedules.filter((s) => !s.isCompleted).length;

  const getPetName = (petId: string) => pets.find((p) => p.id === petId)?.name || '未知宠物';

  return (
    <BasicLayout
      navOptions={{
        navTitle: '日程提醒',
        needBack: false,
        useGradient: true,
      }}
    >
      <ScrollView style={{ marginTop: '96rpx', paddingBottom: '160rpx' }} scrollY>
        <View
          style={{
            margin: '0 32rpx 24rpx',
            flexDirection: 'row',
            height: '88rpx',
            background: '#FFFFFF',
            borderRadius: borderRadius.medium,
            padding: '8rpx',
            boxShadow: shadows.soft,
          }}
        >
          {[TabType.Record, TabType.Reminder].map((tab) => {
            const label = tab === TabType.Record ? '记录' : '提醒';
            const active = activeTab === tab;
            return (
              <View
                key={tab}
                style={{
                  flex: 1,
                  borderRadius: borderRadius.small,
                  backgroundColor: active ? theme.primary.main : 'transparent',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onClick={() => setActiveTab(tab)}
              >
                <Text style={{ color: active ? '#fff' : theme.text.primary, fontSize: typography.fontSize.md }}>{label}</Text>
              </View>
            );
          })}
        </View>

        <View
          style={{
            margin: '0 32rpx 24rpx',
            padding: '28rpx',
            background: '#FFFFFF',
            borderRadius: borderRadius.large,
            boxShadow: shadows.card,
          }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: '16rpx' }}>
            <Text style={{ fontSize: typography.fontSize.lg, color: theme.text.primary }}>今日日程</Text>
            <Text style={{ fontSize: typography.fontSize.sm, color: theme.text.tertiary }}>
              完成 {completedCount} / 未完成 {pendingCount}
            </Text>
          </View>

          {todaySchedules.length === 0 ? (
            <View style={{ alignItems: 'center', paddingTop: '24rpx', paddingBottom: '24rpx' }}>
              <Text style={{ color: theme.text.tertiary }}>今天暂无日程</Text>
            </View>
          ) : (
            todaySchedules.map((schedule) => (
              <View
                key={schedule.id}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '16rpx',
                  paddingBottom: '16rpx',
                  borderBottomWidth: '1rpx',
                  borderBottomColor: '#F0F0F5',
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: '16rpx', flex: 1 }}>
                  <Text>{schedule.icon}</Text>
                  <View>
                    <Text style={{ color: schedule.isCompleted ? theme.text.tertiary : theme.text.primary }}>{schedule.title}</Text>
                    <Text style={{ color: theme.text.tertiary, fontSize: typography.fontSize.xs }}>{getPetName(schedule.petId)}</Text>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: '12rpx' }}>
                  <Text style={{ color: theme.text.tertiary, fontSize: typography.fontSize.xs }}>{schedule.time}</Text>
                  {!schedule.isCompleted ? (
                    <View
                      style={{
                        paddingLeft: '16rpx',
                        paddingRight: '16rpx',
                        paddingTop: '6rpx',
                        paddingBottom: '6rpx',
                        borderRadius: borderRadius.full,
                        borderWidth: '2rpx',
                        borderColor: theme.primary.main,
                      }}
                      onClick={() => completeSchedule(schedule.id)}
                    >
                      <Text style={{ color: theme.primary.main, fontSize: typography.fontSize.xs }}>完成</Text>
                    </View>
                  ) : (
                    <View
                      style={{
                        paddingLeft: '16rpx',
                        paddingRight: '16rpx',
                        paddingTop: '6rpx',
                        paddingBottom: '6rpx',
                        borderRadius: borderRadius.full,
                        background: theme.success.main,
                      }}
                    >
                      <Text style={{ color: '#fff', fontSize: typography.fontSize.xs }}>已完成</Text>
                    </View>
                  )}
                </View>
              </View>
            ))
          )}
        </View>

        <View style={{ margin: '0 32rpx' }}>
          <View
            style={{
              height: '88rpx',
              borderRadius: borderRadius.full,
              background: gradients.primary,
              justifyContent: 'center',
              alignItems: 'center',
              boxShadow: shadows.medium,
            }}
            onClick={() => Taro.navigateTo({ url: '/pages/AddPetReminder/index' })}
          >
            <Text style={{ fontSize: typography.fontSize.lg, color: '#fff' }}>添加新日程</Text>
          </View>
        </View>
      </ScrollView>
    </BasicLayout>
  );
});

export default PetSchedule;
