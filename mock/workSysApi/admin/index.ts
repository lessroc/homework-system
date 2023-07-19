import { MockMethod } from 'vite-plugin-mock';
import { resultSuccess } from '../../_util';
import { Random } from 'mockjs';
import { resultPageSuccess } from '../_util';

enum Api {
  getUserList = '/admin/userList',
  deleteUser = '/admin/user/delete',
  getTeacherList = '/user/teacherList',
  adminEditCourse = '/admin/edit',
}

export default [
  {
    url: `/work-sys-api${Api.getUserList}`,
    timeout: 200,
    method: 'get',
    response: ({ query }) => {
      const { pageNum, pageSize, userName, userType } = query;
      const userList = (() => {
        const result: any[] = [];
        const count = userType == 1 ? 100 : 20;
        for (let index = 0; index < count; index++) {
          result.push({
            createTime: Random.datetime(),
            id: index + 1,
            password: Random.string(),
            updateTime: Random.datetime(),
            userName: userName ?? Random.cname(),
            userType: Random.integer(userType),
          });
        }
        return result;
      })();
      return resultPageSuccess(pageNum, pageSize, userList);
    },
  },
  {
    url: RegExp(`/work-sys-api${Api.deleteUser}.*`),
    timeout: 200,
    method: 'post',
    response: () => {
      return resultSuccess(true, { message: '删除成功' });
    },
  },
  {
    url: `/work-sys-api${Api.getTeacherList}`,
    timeout: 200,
    method: 'get',
    response: () => {
      const teacherList = (() => {
        const result: any[] = [];
        for (let index = 0; index < 20; index++) {
          result.push({
            token: 'Bearer fakeToken2',
            userId: index + 1,
            userName: Random.cname(),
            userType: 2,
          });
        }
        return result;
      })();
      return resultSuccess(teacherList);
    },
  },
  {
    url: `/work-sys-api${Api.adminEditCourse}`,
    timeout: 200,
    method: 'post',
    response: () => {
      return resultSuccess(true, { message: '编辑成功' });
    },
  },
] as MockMethod[];
