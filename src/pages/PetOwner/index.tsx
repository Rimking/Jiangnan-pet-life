import BasicLayout from '@/layout/basicLayout';
import { mockPets, mockBadges, mockUser } from '@/constants/mockData';
import Taro from '@tarojs/taro';
import { View, Text, ScrollView } from '@tarojs/components';
import { memo } from 'react';
import { theme, gradients, shadows, borderRadius, typography } from '@/styles/theme';
import { formatPetAge, getCompanionDays } from '@/utils/petUtils';

const PetOwner = memo(function PetOwner() {
  const user = mockUser;
  const unlockedBadges = mockBadges.filter((b) => b.isUnlocked);

  // 功能入口
  const menuItems = [
    { icon: '💰', title: '花销记录', subtitle: '查看养宠花销', route: '/pages/ExpenseRecord/index', color: gradients.pink },
    { icon: '📊', title: '数据统计', subtitle: '查看宠物数据', route: '/pages/DataStatistics/index', color: gradients.cyan },
    { icon: '📷', title: '成长相册', subtitle: '记录美好时光', route: '/pages/PhotoAlbum/index', color: gradients.orange },
    { icon: '📅', title: '日程管理', subtitle: '管理宠物日程', route: '/pages/PetSchedule/index', isTabBar: true, color: gradients.primary },
    { icon: '🧮', title: '年龄换算', subtitle: '宠物年龄计算', route: '/pages/AgeCalculator/index', color: gradients.blueGreen },
    { icon: '⏰', title: '成长时光', subtitle: '时光轴记录', route: '/pages/Timeline/index', color: gradients.purplePink },
  ];

  const settingsItems = [
    { icon: '🎨', title: '主题皮肤', route: '/pages/PetDetailPage/index' },
    { icon: '🔔', title: '消息提醒', route: '/pages/PetDetailPage/index' },
    { icon: '☁️', title: '云端存储', route: '/pages/PetDetailPage/index' },
    { icon: '🗑️', title: '清除缓存', route: '', value: '12.5MB' },
    { icon: '📱', title: '版本更新', route: '', value: 'V1.0.0' },
    { icon: '🚪', title: '退出登录', route: 'logout', isDanger: true },
  ];

  const handleMenuClick = (route: string, isTabBar?: boolean) => {
    if (isTabBar) {
      Taro.switchTab({ url: route });
    } else if (route === 'logout') {
      Taro.showModal({
        title: '退出登录',
        content: '确定要退出登录吗？',
        success: (res) => {
          if (res.confirm) {
            Taro.showToast({ title: '已退出登录', icon: 'none' });
          }
        },
      });
    } else if (route) {
      Taro.navigateTo({ url: route });
    }
  };

  return (
    <BasicLayout
      navOptions={{
        navTitle: '个人中心',
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
        {/* 用户信息卡片 */}
        <View
          style={{
            margin: '32rpx',
            padding: '32rpx',
            background: gradients.primary,
            borderRadius: borderRadius.xl,
            boxShadow: shadows.strong,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: '24rpx' }}>
            <View
              style={{
                width: '120rpx',
                height: '120rpx',
                borderRadius: '60rpx',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: '24rpx',
              }}
            >
              <Text style={{ fontSize: '64rpx', color: 'white' }}>{user.avatar}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.bold, color: 'white', marginBottom: '8rpx' }}>{user.name}</Text>
              <Text style={{ fontSize: typography.fontSize.sm, color: 'rgba(255, 255, 255, 0.9)' }}>养宠 {user.petYears} 年 · {mockPets.length} 只宠物</Text>
            </View>
          </View>
          
          {/* 统计数据 */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingTop: '24rpx', borderTopWidth: '1rpx', borderTopColor: 'rgba(255, 255, 255, 0.2)' }}>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: typography.fontSize.xl, fontWeight: typography.fontWeight.bold, color: 'white' }}>{mockPets.length}</Text>
              <Text style={{ fontSize: typography.fontSize.xs, color: 'rgba(255, 255, 255, 0.9)', marginTop: '4rpx' }}>宠物</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: typography.fontSize.xl, fontWeight: typography.fontWeight.bold, color: 'white' }}>{unlockedBadges.length}</Text>
              <Text style={{ fontSize: typography.fontSize.xs, color: 'rgba(255, 255, 255, 0.9)', marginTop: '4rpx' }}>徽章</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: typography.fontSize.xl, fontWeight: typography.fontWeight.bold, color: 'white' }}>{getCompanionDays(mockPets[0]?.adoptionDate || new Date().toISOString())}</Text>
              <Text style={{ fontSize: typography.fontSize.xs, color: 'rgba(255, 255, 255, 0.9)', marginTop: '4rpx' }}>陪伴天数</Text>
            </View>
          </View>
        </View>

        {/* 功能菜单 */}
        <View
          style={{
            margin: '0 32rpx 32rpx',
            padding: '32rpx',
            background: '#FFFFFF',
            borderRadius: borderRadius.large,
            boxShadow: shadows.card,
          }}
        >
          <Text style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.semibold, color: theme.text.primary, marginBottom: '24rpx' }}>功能中心</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: '24rpx' }}>
            {menuItems.map((item, index) => (
              <View
                key={index}
                style={{
                  width: '300rpx',
                  padding: '24rpx',
                  background: gradients.cardBg,
                  borderRadius: borderRadius.medium,
                  boxShadow: shadows.soft,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
                onClick={() => handleMenuClick(item.route, item.isTabBar)}
              >
                <View
                  style={{
                    width: '64rpx',
                    height: '64rpx',
                    borderRadius: borderRadius.medium,
                    background: `${item.color}20`,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: '16rpx',
                  }}
                >
                  <Text style={{ fontSize: '32rpx' }}>{item.icon}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: typography.fontSize.md, fontWeight: typography.fontWeight.medium, color: theme.text.primary, marginBottom: '4rpx' }}>{item.title}</Text>
                  <Text style={{ fontSize: typography.fontSize.xs, color: theme.text.tertiary }}>{item.subtitle}</Text>
                </View>
                <Text style={{ fontSize: '24rpx', color: theme.text.tertiary }}>›</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 宠物列表 */}
        <View
          style={{
            margin: '0 32rpx 32rpx',
            padding: '32rpx',
            background: '#FFFFFF',
            borderRadius: borderRadius.large,
            boxShadow: shadows.card,
          }}
        >
          <Text style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.semibold, color: theme.text.primary, marginBottom: '24rpx' }}>我的宠物</Text>
          {mockPets.map((pet, index) => (
            <View
              key={pet.id}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: '20rpx',
                borderBottomWidth: index < mockPets.length - 1 ? '1rpx' : '0',
                borderBottomColor: '#F0F0F5',
              }}
            >
              <View
                style={{
                  width: '80rpx',
                  height: '80rpx',
                  borderRadius: '40rpx',
                  background: `${theme.primary.main}20`,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginRight: '20rpx',
                }}
              >
                <Text style={{ fontSize: '40rpx' }}>{pet.avatar}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: typography.fontSize.md, fontWeight: typography.fontWeight.medium, color: theme.text.primary, marginBottom: '4rpx' }}>{pet.name}</Text>
                <Text style={{ fontSize: typography.fontSize.sm, color: theme.text.tertiary }}>{formatPetAge(pet.birthday)} · {pet.breed}</Text>
              </View>
              <Text style={{ fontSize: '24rpx', color: theme.text.tertiary }}>›</Text>
            </View>
          ))}
        </View>

        {/* 设置选项 */}
        <View
          style={{
            margin: '0 32rpx 32rpx',
            padding: '32rpx',
            background: '#FFFFFF',
            borderRadius: borderRadius.large,
            boxShadow: shadows.card,
          }}
        >
          <Text style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.semibold, color: theme.text.primary, marginBottom: '24rpx' }}>设置</Text>
          {settingsItems.map((item, index) => (
            <View
              key={index}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingVertical: '20rpx',
                borderBottomWidth: index < settingsItems.length - 1 ? '1rpx' : '0',
                borderBottomColor: '#F0F0F5',
              }}
              onClick={() => handleMenuClick(item.route)}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontSize: '32rpx', marginRight: '20rpx' }}>{item.icon}</Text>
                <Text style={{ fontSize: typography.fontSize.md, color: item.isDanger ? theme.status.danger : theme.text.primary }}>{item.title}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {item.value && (
                  <Text style={{ fontSize: typography.fontSize.sm, color: theme.text.tertiary, marginRight: '12rpx' }}>{item.value}</Text>
                )}
                <Text style={{ fontSize: '24rpx', color: theme.text.tertiary }}>›</Text>
              </View>
            </View>
          ))}
        </View>

        {/* 徽章展示 */}
        <View
          style={{
            margin: '0 32rpx 32rpx',
            padding: '32rpx',
            background: gradients.cardBg,
            borderRadius: borderRadius.large,
            boxShadow: shadows.card,
            borderWidth: '2rpx',
            borderColor: '#F0F0F5',
          }}
        >
          <Text style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.semibold, color: theme.text.primary, marginBottom: '24rpx' }}>我的徽章</Text>
          <ScrollView scrollX style={{ flexDirection: 'row', gap: '20rpx', paddingBottom: '16rpx' }}>
            {unlockedBadges.map((badge, index) => (
              <View
                key={badge.id}
                style={{
                  alignItems: 'center',
                }}
              >
                <View
                  style={{
                    width: '80rpx',
                    height: '80rpx',
                    borderRadius: '40rpx',
                    background: gradients.cardBg,
                    boxShadow: shadows.soft,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: '8rpx',
                  }}
                >
                  <Text style={{ fontSize: '40rpx' }}>{badge.icon}</Text>
                </View>
                <Text style={{ fontSize: typography.fontSize.xs, color: theme.text.secondary, textAlign: 'center', width: '100rpx' }}>{badge.name}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* 底部版本信息 */}
        <View style={{ alignItems: 'center', marginBottom: '32rpx' }}>
          <Text style={{ fontSize: typography.fontSize.xs, color: theme.text.tertiary }}>Cy-Pet v1.0.0</Text>
          <Text style={{ fontSize: typography.fontSize.xs, color: theme.text.tertiary, marginTop: '4rpx' }}>© 2024 Cy-Pet Team</Text>
        </View>
      </ScrollView>
    </BasicLayout>
  );
});

export default PetOwner;