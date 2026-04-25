/**
 * 网络请求相关的变量
 */

export type ApiEnvironment = 'development' | 'test' | 'pre' | 'production';

export const API_ENV = (process.env.API_ENV || 'development') as ApiEnvironment;

/** 网关接口 HOST，当前先统一走本地环境 */
export const GW_API_HOST: Record<ApiEnvironment, string> = {
  development: 'http://127.0.0.1:3000',
  test: 'http://127.0.0.1:3000',
  pre: 'http://127.0.0.1:3000',
  production: 'http://127.0.0.1:3000',
};

/** 小程序接口 baseUrl */
export const WEAPP_BASE_URL = '/api/weapp';

export const GW_API_HOST_ENV = GW_API_HOST[API_ENV];

/** 请求超时时间 */
export const REQUEST_TIMEOUT = 10000;

/** 默认请求头 */
export const DEFAULT_HEADER = {
  'content-type': 'application/json',
};
