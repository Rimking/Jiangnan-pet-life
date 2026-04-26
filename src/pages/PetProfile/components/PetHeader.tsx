import { View, Text } from '@tarojs/components';
import { useDidShow } from '@tarojs/taro';
import { memo, useState } from 'react';
import { getCurrentUserData } from '@/api/data';
import { PET_UI_TEXT } from '@/constants/petUi';
import { AuthUser, getCurrentUser, isLoggedIn, setCurrentUser } from '@/utils/authState';

const PetHeader = memo(function PetHeader() {
  const [user, setUser] = useState<AuthUser | null>(getCurrentUser());

  useDidShow(() => {
    const cachedUser = getCurrentUser();
    setUser(cachedUser);
    if (isLoggedIn() && !cachedUser) {
      getCurrentUserData()
        .then((profile) => {
          setCurrentUser(profile);
          setUser(profile);
        })
        .catch(() => {
          setUser(null);
        });
    }
  });

  return (
    <View className="px-[28rpx] py-[12rpx] flex justify-between items-start">
      <View>
        <Text className="font-bold mb-1 block" style={{ fontSize: PET_UI_TEXT.title }}>
          {user?.nickname ? `Hi ${user.nickname}` : 'Hi，欢迎回来'}
        </Text>
        <Text className="text-[#6b6b6b]" style={{ fontSize: PET_UI_TEXT.body }}>
          {user ? '开始记录今天的养宠点滴' : '登录后可同步宠物档案和收藏'}
        </Text>
      </View>
    </View>
  );
});

export default PetHeader;
