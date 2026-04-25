import Taro from '@tarojs/taro';

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

/** 基础响应处理，处理网络层面错误 */
export const baseInterceptor = (
  res: Taro.request.SuccessCallbackResult<any>,
  resolve: (value: any) => void,
  reject: (reason?: RequestApiErr) => void
) => {
  if (res.statusCode >= 200 && res.statusCode < 300) {
    resolve(res.data);
  } else {
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
    data?.code === undefined ||
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
