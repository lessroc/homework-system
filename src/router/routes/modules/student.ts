import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const teacher: AppRouteModule = {
  path: '/student',
  name: 'Student',
  component: LAYOUT,
  redirect: '/student/index',
  meta: {
    hideChildrenInMenu: true,
    icon: 'simple-icons:about-dot-me',
    title: t('routes.homeworkSystem.student'),
    orderNo: 30,
  },
  children: [
    {
      path: 'index',
      name: 'StudentPage',
      component: () => import('/@/views/homeworkSystem/student/index.vue'),
      meta: {
        title: t('routes.homeworkSystem.student'),
        icon: 'simple-icons:about-dot-me',
        hideMenu: true,
      },
    },
  ],
};

export default teacher;
