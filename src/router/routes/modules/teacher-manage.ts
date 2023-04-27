import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const teacherManage: AppRouteModule = {
  path: '/',
  name: 'TeacherManage',
  component: LAYOUT,
  redirect: '/teacher-manage',
  meta: {
    hideChildrenInMenu: true,
    icon: 'simple-icons:openaigym',
    title: t('routes.homeworkSystem.teacherManage'),
    orderNo: 40,
    roles: ['admin', 'super'],
  },
  children: [
    {
      path: 'teacher-manage',
      name: 'TeacherManagePage',
      component: () => import('/@/views/homeworkSystem/admin/UserManage.vue'),
      meta: {
        title: t('routes.homeworkSystem.teacherManage'),
        hideMenu: true,
      },
    },
  ],
};

export default teacherManage;
