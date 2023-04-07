import { defHttp, homeworkHttp } from '/@/utils/http/axios';
import { LoginParams, LoginResultModel, GetUserInfoModel } from '/@/api/sys/model/userModel';

import { ErrorMessageMode } from '/#/axios';

enum Api {
  Login = '/user/login',
  Logout = '/logout',
  GetUserInfo = '/user/detail',
  GetPermCode = '/getPermCode',
  TestRetry = '/testRetry',
}

/**
 * @description: user login api
 */
export function loginHomeworkApi(params: LoginParams, mode: ErrorMessageMode = 'modal') {
  return homeworkHttp.post<LoginResultModel>(
    {
      url: Api.Login,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * @description: getUserInfo
 */
export function getUserInfoHomeworkApi(userId) {
  return homeworkHttp.get<GetUserInfoModel>(
    {
      url: Api.GetUserInfo + `/${userId}`,
    },
    { errorMessageMode: 'none' },
  );
}

export function getPermCode() {
  return defHttp.get<string[]>({ url: Api.GetPermCode });
}

export function doLogout() {
  return defHttp.get({ url: Api.Logout });
}

export function testRetry() {
  return defHttp.get(
    { url: Api.TestRetry },
    {
      retryRequest: {
        isOpenRetry: true,
        count: 5,
        waitTime: 1000,
      },
    },
  );
}
