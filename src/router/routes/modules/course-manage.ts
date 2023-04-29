import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const courseManage: AppRouteModule = {
  path: '/',
  name: 'CourseManage',
  component: LAYOUT,
  redirect: '/course-manage',
  meta: {
    hideChildrenInMenu: true,
    icon: 'simple-icons:amazonecs',
    title: t('routes.homeworkSystem.courseManage'),
    orderNo: 40,
    roles: ['admin', 'super'],
  },
  children: [
    {
      path: 'course-manage',
      name: 'CourseManagePage',
      component: () => import('/@/views/homeworkSystem/admin/index.vue'),
      meta: {
        title: t('routes.homeworkSystem.courseManage'),
        hideMenu: true,
      },
    },
  ],
};

export default courseManage;