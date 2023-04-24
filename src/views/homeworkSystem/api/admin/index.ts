import { homeworkHttp } from '/@/utils/http/axios';

enum Api {
  getUserList = '/admin/userList',
}

/**
 * 获取用户列表
 */
export function getUserListApi(params: { pageNum: number; pageSize: number; userType: number }) {
  return homeworkHttp.get(
    {
      url: Api.getUserList,
      params,
    },
    {
      errorMessageMode: 'modal',
    },
  );
}
