import Taro from '@tarojs/taro';
import { baseRequest } from './base';

/**
 * 发送 POST 请求
 */
const apiPost = <T = any>(
  options: Taro.request.Option<T>,
  useInspector: boolean = true
) => baseRequest<T>(options, 'POST', useInspector);

/**
 * 发送 GET 请求
 */
const apiGet = <T = any>(
  options: Taro.request.Option<T>,
  useInspector: boolean = true
) => baseRequest<T>(options, 'GET', useInspector);

/**
 * 发送 PUT 请求
 */
const apiPut = <T = any>(
  options: Taro.request.Option<T>,
  useInspector: boolean = true
) => baseRequest<T>(options, 'PUT', useInspector);

/**
 * 发送 PATCH 请求
 */
const apiPatch = <T = any>(
  options: Taro.request.Option<T>,
  useInspector: boolean = true
) => baseRequest<T>(options, 'PATCH', useInspector);

/**
 * 发送 DELETE 请求
 */
const apiDelete = <T = any>(
  options: Taro.request.Option<T>,
  useInspector: boolean = true
) => baseRequest<T>(options, 'DELETE', useInspector);

export { baseRequest, apiPost, apiGet, apiPut, apiPatch, apiDelete };

export * from './variable';
export * from './utils';
