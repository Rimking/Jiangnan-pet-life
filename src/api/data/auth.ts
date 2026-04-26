import { apiGet, apiPost } from '../config';
import { AuthUser } from '@/utils/authState';

export type WechatLoginParams = {
  code: string;
  nickname?: string;
  avatarUrl?: string;
  gender?: string;
  country?: string;
  province?: string;
  city?: string;
  language?: string;
};

export type WechatLoginResult = {
  token: string;
  user: AuthUser;
};

export const wechatLoginData = (params: WechatLoginParams) => {
  return apiPost<{
    code: number;
    data: WechatLoginResult;
    message: string;
  }>(
    {
      url: '/api/auth/wechat/login',
      data: params,
    },
    true
  ).then((res) => res.data);
};

export const getCurrentUserData = () => {
  return apiGet<{
    code: number;
    data: AuthUser;
    message: string;
  }>(
    {
      url: '/api/auth/me',
    },
    true
  ).then((res) => res.data);
};

export const logoutData = () => {
  return apiPost<{
    code: number;
    data: { logout: boolean };
    message: string;
  }>(
    {
      url: '/api/auth/logout',
    },
    true
  ).then((res) => res.data);
};
