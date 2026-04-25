/**
 * 针对 Taro.request 进行基础封装
 * 1. 包含类型约束
 * 2. 包含请求头设置
 * 3. 包含响应拦截处理
 */

import Taro from '@tarojs/taro';
import { DEFAULT_HEADER, GW_API_HOST_ENV, REQUEST_TIMEOUT } from './variable';
import { baseInterceptor, RequestApiErr, responseInterceptor } from './utils';

/**
 * 基础请求
 * 默认补齐网关前缀，支持是否开启响应拦截
 */
export const baseRequest = <T = any>(
  options: Taro.request.Option<T>,
  method?: keyof Taro.request.Method,
  useInspector: boolean = true
) => {
  return new Promise<T>((resolve, reject) => {
    const { url = '' } = options;

    const resultUrl = url?.startsWith('http') ? url : `${GW_API_HOST_ENV}${url}`;

    Taro.request<T>({
      ...options,
      url: resultUrl,
      method,
      timeout: options.timeout || REQUEST_TIMEOUT,
      header: {
        ...DEFAULT_HEADER,
        ...options.header,
      },
    })
      .then((res) => {
        useInspector
          ? responseInterceptor(res, resolve, reject)
          : baseInterceptor(res, resolve, reject);
      })
      .catch((err) => {
        const errData: RequestApiErr = {
          message: err?.message || err?.errMsg || '接口异常',
        };
        reject(errData);
      });
  });
};

export default {};
