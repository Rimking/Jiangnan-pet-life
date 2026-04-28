import Taro from '@tarojs/taro';
import { clearStoredActivePetId } from './activePetState';

const AUTH_TOKEN_KEY = 'pet_app_auth_token';
const AUTH_USER_KEY = 'pet_app_auth_user';

export type AuthUser = {
  id: string;
  nickname: string;
  avatarUrl?: string;
  gender?: string;
  country?: string;
  province?: string;
  city?: string;
  language?: string;
  lastLoginAt?: string;
};

export const getAuthToken = () => {
  return Taro.getStorageSync<string>(AUTH_TOKEN_KEY) || '';
};

export const setAuthToken = (token: string) => {
  if (!token) {
    Taro.removeStorageSync(AUTH_TOKEN_KEY);
    return;
  }
  Taro.setStorageSync(AUTH_TOKEN_KEY, token);
};

export const getCurrentUser = () => {
  return Taro.getStorageSync<AuthUser>(AUTH_USER_KEY) || null;
};

export const setCurrentUser = (user: AuthUser | null) => {
  if (!user) {
    Taro.removeStorageSync(AUTH_USER_KEY);
    return;
  }
  Taro.setStorageSync(AUTH_USER_KEY, user);
};

export const setLoginSession = (token: string, user: AuthUser) => {
  setAuthToken(token);
  setCurrentUser(user);
};

export const clearLoginSession = () => {
  Taro.removeStorageSync(AUTH_TOKEN_KEY);
  Taro.removeStorageSync(AUTH_USER_KEY);
  clearStoredActivePetId();
};

export const isLoggedIn = () => {
  return Boolean(getAuthToken());
};

export const ensureLoggedIn = (redirectUrl?: string) => {
  if (isLoggedIn()) {
    return true;
  }

  const targetUrl = redirectUrl
    ? `/pages/Login/index?redirect=${encodeURIComponent(redirectUrl)}`
    : '/pages/Login/index';

  Taro.navigateTo({ url: targetUrl });
  return false;
};
