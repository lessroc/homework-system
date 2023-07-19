import { MockMethod } from 'vite-plugin-mock';
import { resultError, resultSuccess } from '../../_util';
import { isEmpty } from '/@/utils/is';

export function createFakeUserList() {
  return [
    {
      userId: 1,
      userType: 1,
      userName: '李同学',
      password: '123456',
      token: 'Bearer fakeToken1',
    },
    {
      userId: 2,
      userType: 2,
      userName: '黄老师',
      password: '123456',
      token: 'Bearer fakeToken2',
    },
    {
      userId: 3,
      userType: 3,
      userName: 'admin',
      password: '123456',
      token: 'Bearer fakeToken3',
    },
  ];
}

enum Api {
  Login = '/user/login',
  Register = '/user/register',
  EditUserName = '/user/edit',
  EditPassword = '/user/editPassword',
}

export default [
  {
    url: `/work-sys-api${Api.Login}`,
    timeout: 200,
    method: 'post',
    response: ({ body }) => {
      const { userName, password } = body;
      const checkUser = createFakeUserList().find(
        (item) => item.userName === userName && password === item.password,
      );
      if (!checkUser) {
        return resultError('帐号或密码错误！');
      }
      const { userId, userName: username, userType, token } = checkUser;
      return resultSuccess({
        userId,
        userName: username,
        userType,
        token,
      });
    },
  },
  {
    url: `/work-sys-api${Api.Register}`,
    timeout: 200,
    method: 'post',
    response: ({ body }) => {
      const { userName, password, userType } = body;
      // mock 模式下，只能注册已有的默认用户
      const checkUser = createFakeUserList().find(
        (item) =>
          item.userName === userName && password === item.password && userType === item.userType,
      );
      if (!checkUser) {
        return resultError('mock 模式下，只能注册已有的默认用户！');
      }
      return resultSuccess({
        message: '注册成功',
      });
    },
  },
  {
    url: `/work-sys-api${Api.EditUserName}`,
    timeout: 200,
    method: 'post',
    response: ({ body }) => {
      const { userName, password } = body;
      const checkUser = createFakeUserList().find((item) => item.userName === userName);
      if (checkUser) {
        return resultError('用户名重复！');
      } else if (isEmpty(userName)) {
        return resultError('用户名不能为空！');
      } else if (isEmpty(password)) {
        return resultError('密码不能为空！');
      }
      return resultSuccess({
        message: '修改成功',
      });
    },
  },
  {
    url: `/work-sys-api${Api.EditPassword}`,
    timeout: 200,
    method: 'post',
    response: ({ body }) => {
      const { password } = body;
      if (password === '123456') {
        return resultError('新密码不可与旧密码相同！');
      } else if (isEmpty(password)) {
        return resultError('密码不能为空！');
      }
      return resultSuccess({
        message: '修改成功',
      });
    },
  },
] as MockMethod[];
