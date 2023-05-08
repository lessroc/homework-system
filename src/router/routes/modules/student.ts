import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const student: AppRouteModule = {
  path: '/dashboard',
  name: 'Student',
  component: LAYOUT,
  redirect: '/dashboard',
  meta: {
    hideChildrenInMenu: true,
    icon: 'simple-icons:databricks',
    title: t('routes.homeworkSystem.student'),
    orderNo: 30,
    roles: ['student', 'super'],
  },
  children: [
    {
      path: '',
      name: 'StudentPage',
      component: () => import('/@/views/homeworkSystem/student/index.vue'),
      meta: {
        title: t('routes.homeworkSystem.student'),
        hideMenu: true,
      },
    },
    {
      path: 'course-detail/:id',
      name: 'StudentCourseDetail',
      component: () => import('/@/views/homeworkSystem/student/courseDetail/index.vue'),
      meta: {
        title: t('routes.homeworkSystem.courseDetail'),
        hideMenu: true,
      },
    },
  ],
};

export default student;
