import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const teacher: AppRouteModule = {
  path: '/admin',
  name: 'Admin',
  component: LAYOUT,
  redirect: '/admin/index',
  meta: {
    hideChildrenInMenu: true,
    icon: 'simple-icons:about-dot-me',
    title: t('routes.homeworkSystem.admin'),
    orderNo: 40,
  },
  children: [
    {
      path: 'index',
      name: 'AdminPage',
      component: () => import('/@/views/homeworkSystem/admin/index.vue'),
      meta: {
        title: t('routes.homeworkSystem.admin'),
        icon: 'simple-icons:about-dot-me',
        hideMenu: true,
      },
    },
  ],
};

export default teacher;
