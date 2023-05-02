import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const studentManage: AppRouteModule = {
  path: '/',
  name: 'StudentManage',
  component: LAYOUT,
  redirect: '/student-manage',
  meta: {
    hideChildrenInMenu: true,
    icon: 'simple-icons:laravel',
    title: t('routes.homeworkSystem.studentManage'),
    orderNo: 40,
    roles: ['admin', 'super'],
  },
  children: [
    {
      path: 'student-manage',
      name: 'StudentManagePage',
      component: () => import('/@/views/homeworkSystem/admin/UserManage.vue'),
      meta: {
        title: t('routes.homeworkSystem.studentManage'),
        hideMenu: true,
      },
      props: { userType: 1 },
    },
  ],
};

export default studentManage;
