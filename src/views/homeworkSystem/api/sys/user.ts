import { homeworkHttp } from '/@/utils/http/axios';
import {
  LoginParams,
  LoginResultModel,
  GetUserInfoModel,
  RegisterParams,
  RegisterResultModel,
} from '/@/api/sys/model/userModel';

import { ErrorMessageMode } from '/#/axios';

enum Api {
  Login = '/user/login',
  Logout = '/logout',
  GetUserInfo = '/user/detail',
  Register = '/user/register',
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

/**
 * @description: user register api
 */
export function registerHomeworkApi(params: RegisterParams, mode: ErrorMessageMode = 'modal') {
  return homeworkHttp.post<RegisterResultModel>(
    {
      url: Api.Register,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}
