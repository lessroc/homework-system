import { pagination, resultSuccess } from '../_util';

// 作业系统mock分页数据统一返回格式
export function resultPageSuccess<T = any>(
  pageNum: number,
  pageSize: number,
  list: T[],
  { message = 'ok' } = {},
) {
  const pageData = pagination(pageNum, pageSize, list);

  return {
    ...resultSuccess({
      list: pageData,
      pageNum: Number(pageNum),
      pageSize: Number(pageSize),
      total: list.length,
      totalPage: Math.ceil(list.length / pageSize),
    }),
    message,
  };
}
