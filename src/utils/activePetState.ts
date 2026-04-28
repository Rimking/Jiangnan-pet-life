import Taro from '@tarojs/taro';

const ACTIVE_PET_ID_KEY = 'pet_app_active_pet_id';

export const getStoredActivePetId = () => {
  return Taro.getStorageSync<string>(ACTIVE_PET_ID_KEY) || '';
};

export const setStoredActivePetId = (petId: string) => {
  if (!petId) {
    Taro.removeStorageSync(ACTIVE_PET_ID_KEY);
    return;
  }

  Taro.setStorageSync(ACTIVE_PET_ID_KEY, petId);
};

export const clearStoredActivePetId = () => {
  Taro.removeStorageSync(ACTIVE_PET_ID_KEY);
};

export const switchTabWithActivePet = (url: string, petId?: string) => {
  if (petId) {
    setStoredActivePetId(petId);
  }

  Taro.switchTab({ url });
};
