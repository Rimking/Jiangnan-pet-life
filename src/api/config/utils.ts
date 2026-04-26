import Taro from '@tarojs/taro';
import { clearLoginSession } from '@/utils/authState';

export type RequestApiErr = {
  message: string;
  code?: string | number | null;
  request?: any;
  response?: any;
};

const createApiErr = (message: string, code?: string | number | null): RequestApiErr => ({
  message,
  code,
});

export const sanitizeRequestData = (value: any): any => {
  if (Array.isArray(value)) {
    return value
      .map((item) => sanitizeRequestData(item))
      .filter((item) => item !== undefined);
  }

  if (value && typeof value === 'object') {
    return Object.entries(value).reduce<Record<string, any>>((acc, [key, currentValue]) => {
      const normalizedValue = sanitizeRequestData(currentValue);
      if (normalizedValue === undefined) {
        return acc;
      }
      acc[key] = normalizedValue;
      return acc;
    }, {});
  }

  if (
    value === undefined ||
    value === null ||
    value === 'undefined' ||
    value === 'null'
  ) {
    return undefined;
  }

  return value;
};

/** 基础响应处理，处理网络层面错误 */
export const baseInterceptor = (
  res: Taro.request.SuccessCallbackResult<any>,
  resolve: (value: any) => void,
  reject: (reason?: RequestApiErr) => void
) => {
  if (res.statusCode >= 200 && res.statusCode < 300) {
    resolve(res.data);
  } else {
    if (res.statusCode === 401) {
      clearLoginSession();
    }
    reject(
      createApiErr(
        res?.data?.msg || res?.data?.message || res?.data?.value?.message || '接口异常',
        res.statusCode
      )
    );
  }
};

/** 对响应数据进行处理，兼容常见业务成功结构 */
export const responseInterceptor = (
  res: Taro.request.SuccessCallbackResult<any>,
  resolve: (value: any) => void,
  reject: (reason?: RequestApiErr) => void
) => {
  if (res.statusCode < 200 || res.statusCode >= 300) {
    if (res.statusCode === 401) {
      clearLoginSession();
    }
    reject(
      createApiErr(
        res?.data?.msg || res?.data?.message || res?.data?.value?.message || '接口异常',
        res.statusCode
      )
    );
    return;
  }

  const { data } = res;

  if (
    data?.code === 0 ||
    data?.code === 200 ||
    data?.code === 2000 ||
    data?.success === true
  ) {
    resolve(data);
  } else {
    reject(createApiErr(data?.msg || data?.message || '接口异常', data?.code));
  }
};
