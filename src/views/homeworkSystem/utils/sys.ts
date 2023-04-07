/**
 * 处理后台获取用户详情接口返回的数据
 * ```js
 * {
 *   userId: '1',
 *   username: 'vben',
 *   realName: 'Vben Admin',
 *   avatar: 'https://q1.qlogo.cn/g?b=qq&nk=190848757&s=640',
 *   desc: 'manager',
 *   password: '123456',
 *   token: 'fakeToken1',
 *   homePath: '/dashboard/analysis',
 *   roles: [
 *     {
 *       roleName: 'Super Admin',
 *       value: 'super',
 *     },
 *   ],
 * };
 * const result = {
 *   userId: 5,
 *   userName: '黄老师',
 *   userType: 2,
 * };
 * ```
 */
export const handleGetUserInfoData = (data: any) => {
  // console.log(123, userStore);
  const { userId, userName, userType } = data;
  return {
    userId,
    username: userName,
    realName: userName,
    avatar: 'https://q1.qlogo.cn/g?b=qq&nk=190848757&s=640',
    desc: setLoginRole(userType)[0].roleName,
    password: '123456',
    homePath: '/dashboard/analysis',
    roles: setLoginRole(userType),
  };
};

/**
 * 根据用户类型设置登录角色
 */
export const setLoginRole = (userType: number) => {
  const role = {
    1: ['student'],
    2: ['teacher'],
    3: ['admin'],
  };
  return [
    {
      // role[userType][0] 首字母大写
      roleName: role[userType][0].replace(role[userType][0][0], role[userType][0][0].toUpperCase()),
      value: role[userType][0],
    },
    {
      roleName: 'Super Admin',
      value: 'super',
    },
  ];
};
