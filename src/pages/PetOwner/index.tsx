import BasicLayout from '@/layout/basicLayout';
import { View, Text } from '@tarojs/components';
import { memo, useState } from 'react';
import UserInfoHeader from './components/UserInfoHeader';
import PetCard from './components/PetCard';
import MenuItem from './components/MenuItem';
import PetDetail from './components/PetDetail';

// 铲屎官
const PetOwner = memo(function PetOwner() {
  const [showDetail, setShowDetail] = useState(false);

  if (showDetail) return <PetDetail />;

  const pets = [
    {
      name: '火火',
      type: '英短',
      age: '6个月',
      weight: '5kg',
      gender: '♂',
      avatar: '🐱',
    },
    {
      name: '小黑',
      type: '美短',
      age: '1岁',
      weight: '3.5kg',
      gender: '♀',
      avatar: '🐱',
    },
  ];

  const menuItems = [
    {
      icon: '📅',
      title: '日程管理',
      subtitle: '管理宠物日程',
      hasBadge: true,
      badgeText: '3',
    },
    {
      icon: '📊',
      title: '数据统计',
      subtitle: '查看宠物数据',
    },
    {
      icon: '💊',
      title: '用药记录',
      subtitle: '记录用药情况',
    },
    {
      icon: '🏥',
      title: '医疗记录',
      subtitle: '记录医疗信息',
    },
    {
      icon: '🛁',
      title: '洗护记录',
      subtitle: '记录洗护情况',
    },
    {
      icon: '💩',
      title: '排便记录',
      subtitle: '记录排便情况',
    },
    {
      icon: '⚙️',
      title: '设置',
      subtitle: '应用设置',
    },
    {
      icon: '❓',
      title: '帮助与反馈',
      subtitle: '获取帮助',
    },
  ];

  return (
    <BasicLayout
      wrapClassName="w-full h-full"
      wrapStyle={{
        backgroundImage: 'linear-gradient( to bottom ,#FFE68D 10%, #FFFCE0 100%)',
        minHeight: '100vh',
      }}
      navOptions={{
        navTitle: '铲屎官',
        needBack: false,
      }}
    >
      <View className="p-4 pb-6">
        <UserInfoHeader />

        <View className="mt-5 mb-4">
          <View className="flex justify-between items-center mb-4">
            <Text className="text-[32px] font-bold text-gray-800">我的宠物</Text>
            <View className="w-8 h-8 rounded-full bg-yellow-400 flex items-center justify-center shadow-md">
              <Text className="text-lg text-white">+</Text>
            </View>
          </View>

          {pets.map((pet, index) => (
            <PetCard
              key={index}
              name={pet.name}
              type={pet.type}
              age={pet.age}
              weight={pet.weight}
              gender={pet.gender}
              avatar={pet.avatar}
            />
          ))}
        </View>

        <View className="mt-5">
          <Text className="text-[32px] font-bold mb-4 block text-gray-800">功能菜单</Text>
          {menuItems.map((item, index) => (
            <MenuItem
              key={index}
              icon={item.icon}
              title={item.title}
              subtitle={item.subtitle}
              hasBadge={item.hasBadge}
              badgeText={item.badgeText}
            />
          ))}
        </View>
      </View>
    </BasicLayout>
  );
});

export default PetOwner;
