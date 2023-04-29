import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const userInfo: AppRouteModule = {
  path: '/userinfo',
  name: 'UserInfo',
  component: LAYOUT,
  redirect: '/userinfo',
  meta: {
    hideChildrenInMenu: true,
    icon: 'simple-icons:about-dot-me',
    title: t('routes.homeworkSystem.userInfo'),
    orderNo: 100,
  },
  children: [
    {
      path: '',
      name: 'UserInfoPage',
      component: () => import('/@/views/homeworkSystem/userInfo/index.vue'),
      meta: {
        title: t('routes.homeworkSystem.userInfo'),
        hideMenu: true,
      },
    },
  ],
};

export default userInfo;
