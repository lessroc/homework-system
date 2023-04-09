/**
 * @description: Login interface parameters
 */
export interface LoginParams {
  userName: string;
  password: string;
}

/**
 * @description: Register interface parameters
 */
export interface RegisterParams {
  userName: string;
  password: string;
  userType: string;
}

export interface RoleInfo {
  roleName: string;
  value: string;
}

/**
 * @description: Login interface return value
 */
export interface LoginResultModel {
  userId: string | number;
  token: string;
  userName: string;
  userType: string | number;
  role: RoleInfo;
}

/**
 * @description: Register interface return value
 */
export interface RegisterResultModel {
  code: number;
  result: boolean;
  message: string;
}

/**
 * @description: Get user information return value
 */
export interface GetUserInfoModel {
  roles: RoleInfo[];
  // 用户id
  userId: string | number;
  // 用户名
  username: string;
  // 真实名字
  realName: string;
  // 头像
  avatar: string;
  // 介绍
  desc?: string;
}
