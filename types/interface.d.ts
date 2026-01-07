/**
 * 定义一些全局接口
 */

/** 指定某个字段为可选属性 */
type MakeOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/** 平台类型 = 1:快手 2：抖音 3:公众号 4：视频号 5：微博 6：小红书 7:哔哩哔哩 11:懂车帝 12:车家号 13:易车 0: 全平台 */
type PlatType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 11 | 12 | 13 | 14 | 0;

/** 字符串型平台类型 1:快手 2：抖音 3:公众号 4：视频号 5：微博 6：小红书 7：哔哩哔哩 11:懂车帝 12:车家号 13:易车 0: 全平台 */
type PlatTypeStr = `${PlatType}`;

// 基础选项
interface BaseItem<T = string> {
  label: string;
  value: T;
  disabled?: boolean;
  [key: string]: any;
}

type Value = string | string[] | number;

// 矩阵通基础树形数据结构
interface BaseTreeItem {
  uid: string;
  fuuid: string;
  name: string | JSX.Element;
  [key: string]: any;
  children?: BaseTreeItem[];
}

// 矩阵通基础树形团队结构
interface GroupData extends BaseTreeItem {
  /** 老接口废弃, 新接口又有*/
  number: number;
  level: number;
  fuuid: string;
  /** 老接口废弃，新接口又有 */
  accountCount?: number;
  /** 团队类型 0:顶层空间 1：普通团队 2：默认团队 */
  spaceType?: number;
  children: GroupData[];
}

// 网络请求返回
interface ApiResData<T, U = number | string> {
  data: T;
  code: U;
  msg: string;
}
/** 老接口响应公共部分 */
interface ApiResDataOld<T> {
  success: boolean;
  value: T;
}

// 网络请求List返回
interface ListData<T> {
  count: number;
  total: number;
  update_time: string;
  list: T[];
}

// setState的类型
type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

// 排序的类型
type Sort = 'desc' | 'asc';

type SVGComment = React.FunctionComponent<
  React.SVGProps<SVGSVGElement> & {
    title?: string | undefined;
  }
>;

/** 定义的公共API错误类型 */
type ApiErr = {
  message: string;
  code?: string | number | null;
  request?: any;
  response?: any;
};
