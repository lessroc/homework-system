import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const teacher: AppRouteModule = {
  path: '/student',
  name: 'Student',
  component: LAYOUT,
  redirect: '/student',
  meta: {
    hideChildrenInMenu: true,
    icon: 'simple-icons:about-dot-me',
    title: t('routes.homeworkSystem.student'),
    orderNo: 30,
    // roles: ['student', 'super'],
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
    {
      path: 'homework-list/:id',
      name: 'StudentHomeworkList',
      component: () => import('/@/views/homeworkSystem/student/homeworkList/index.vue'),
      meta: {
        title: t('routes.homeworkSystem.homeworkList'),
        hideMenu: true,
      },
    },
  ],
};

export default teacher;
