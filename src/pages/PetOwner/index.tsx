import BasicLayout from '@/layout/basicLayout';
import Taro from '@tarojs/taro';
import { View, Text, ScrollView } from '@tarojs/components';
import { memo, useMemo } from 'react';
import { useAtom } from 'jotai';
import {
  careRecordsAtom,
  currentPetAtom,
  dailyRecordsAtom,
  expenseRecordsAtom,
  petsAtom,
  schedulesAtom,
  userAtom,
} from '@/store';
import { mockBadges } from '@/constants/mockData';
import { borderRadius, gradients, shadows, theme, typography } from '@/styles/theme';
import { formatPetAge, getCompanionDays } from '@/utils/petUtils';
import { getExpenseTotal, getTodayPendingCount } from '@/utils/dashboard';

const PetOwner = memo(function PetOwner() {
  const [user] = useAtom(userAtom);
  const [pets] = useAtom(petsAtom);
  const [currentPet] = useAtom(currentPetAtom);
  const [schedules] = useAtom(schedulesAtom);
  const [expenseRecords] = useAtom(expenseRecordsAtom);
  const [careRecords] = useAtom(careRecordsAtom);
  const [dailyRecords] = useAtom(dailyRecordsAtom);

  const currentPetId = currentPet?.id;

  const unlockedBadges = useMemo(() => mockBadges.filter((b) => b.isUnlocked), []);
  const todayPending = useMemo(() => getTodayPendingCount(schedules, currentPetId), [schedules, currentPetId]);
  const expenseTotal = useMemo(() => getExpenseTotal(expenseRecords, currentPetId), [expenseRecords, currentPetId]);
  const careCount = useMemo(
    () => careRecords.filter((r) => !currentPetId || r.petId === currentPetId).length,
    [careRecords, currentPetId],
  );
  const dailyCount = useMemo(
    () => dailyRecords.filter((r) => !currentPetId || r.petId === currentPetId).length,
    [dailyRecords, currentPetId],
  );

  const menuItems = [
    { title: '花销记录', route: '/pages/ExpenseRecord/index', value: `¥${expenseTotal.toFixed(2)}` },
    { title: '护理记录', route: '/pages/CareRecord/index', value: `${careCount} 条` },
    { title: '日常记录', route: '/pages/AddPetRecord/index', value: `${dailyCount} 条` },
    { title: '今日日程', route: '/pages/PetSchedule/index', value: `${todayPending} 条待办` },
    { title: '数据统计', route: '/pages/DataStatistics/index', value: '查看详情' },
    { title: '成长时光', route: '/pages/Timeline/index', value: '查看时间轴' },
  ];

  return (
    <BasicLayout navOptions={{ navTitle: '个人中心', needBack: false, useGradient: true }}>
      <ScrollView style={{ marginTop: '96rpx', paddingBottom: '160rpx' }} scrollY>
        <View
          style={{
            margin: '32rpx',
            padding: '32rpx',
            background: gradients.primary,
            borderRadius: borderRadius.xl,
            boxShadow: shadows.strong,
          }}
        >
          <Text style={{ color: '#fff', fontSize: typography.fontSize.lg }}>{user.name}</Text>
          <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: typography.fontSize.sm }}>
            当前宠物：{currentPet?.name ?? '未选择'} · 已管理 {pets.length} 只
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: typography.fontSize.xs, marginTop: '8rpx' }}>
            陪伴天数：{getCompanionDays(currentPet?.adoptionDate || new Date().toISOString())}
          </Text>
          <View
            style={{ marginTop: '16rpx', padding: '10rpx 16rpx', borderRadius: borderRadius.full, background: 'rgba(255,255,255,0.2)', alignSelf: 'flex-start' }}
            onClick={() => Taro.navigateTo({ url: '/pages/PetList/index' })}
          >
            <Text style={{ color: '#fff', fontSize: typography.fontSize.xs }}>切换宠物</Text>
          </View>
        </View>

        <View style={{ margin: '0 32rpx 24rpx', padding: '24rpx', background: '#fff', borderRadius: borderRadius.large, boxShadow: shadows.card }}>
          <Text style={{ fontSize: typography.fontSize.lg, color: theme.text.primary, marginBottom: '16rpx' }}>功能中心</Text>
          {menuItems.map((item) => (
            <View
              key={item.route}
              style={{ paddingTop: '16rpx', paddingBottom: '16rpx', borderBottomWidth: '1rpx', borderBottomColor: '#F0F0F5', flexDirection: 'row', justifyContent: 'space-between' }}
              onClick={() => Taro.navigateTo({ url: item.route })}
            >
              <Text style={{ color: theme.text.primary }}>{item.title}</Text>
              <Text style={{ color: theme.text.tertiary, fontSize: typography.fontSize.xs }}>{item.value}</Text>
            </View>
          ))}
        </View>

        <View style={{ margin: '0 32rpx 24rpx', padding: '24rpx', background: '#fff', borderRadius: borderRadius.large, boxShadow: shadows.card }}>
          <Text style={{ fontSize: typography.fontSize.lg, color: theme.text.primary, marginBottom: '16rpx' }}>我的宠物</Text>
          {pets.map((pet) => {
            const active = pet.id === currentPetId;
            return (
              <View key={pet.id} style={{ paddingTop: '14rpx', paddingBottom: '14rpx' }}>
                <Text>{pet.avatar} {pet.name} {active ? '· 当前' : ''}</Text>
                <Text style={{ fontSize: typography.fontSize.xs, color: theme.text.tertiary }}>{formatPetAge(pet.birthday)} · {pet.breed}</Text>
              </View>
            );
          })}
        </View>

        <View style={{ margin: '0 32rpx 24rpx', padding: '24rpx', background: '#fff', borderRadius: borderRadius.large, boxShadow: shadows.card }}>
          <Text style={{ fontSize: typography.fontSize.lg, color: theme.text.primary, marginBottom: '16rpx' }}>我的徽章</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: '12rpx' }}>
            {unlockedBadges.map((badge) => (
              <Text key={badge.id}>{badge.icon} {badge.name}</Text>
            ))}
          </View>
        </View>
      </ScrollView>
    </BasicLayout>
  );
});

export default PetOwner;
