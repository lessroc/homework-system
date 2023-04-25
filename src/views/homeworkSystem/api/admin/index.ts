import { homeworkHttp } from '/@/utils/http/axios';

enum Api {
  getUserList = '/admin/userList',
  deleteUser = '/admin/user/detail',
}

/**
 * 删除用户
 */
export function deleteUserApi(id: number) {
  return homeworkHttp.delete(
    {
      url: Api.deleteUser + `/${id}`,
    },
    {
      errorMessageMode: 'modal',
    },
  );
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
