import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const teacher: AppRouteModule = {
  path: '/teacher',
  name: 'Teacher',
  component: LAYOUT,
  redirect: '/teacher',
  meta: {
    hideChildrenInMenu: true,
    icon: 'simple-icons:about-dot-me',
    title: t('routes.homeworkSystem.teacher'),
    orderNo: 20,
    // roles: ['teacher', 'super'],
  },
  children: [
    {
      path: '',
      name: 'TeacherPage',
      component: () => import('/@/views/homeworkSystem/teacher/index.vue'),
      meta: {
        title: t('routes.homeworkSystem.teacher'),
        icon: 'simple-icons:about-dot-me',
        hideMenu: true,
      },
    },
    {
      path: 'course-detail/:id',
      name: 'CourseDetail',
      component: () => import('/@/views/homeworkSystem/teacher/courseDetail/index.vue'),
      meta: {
        title: t('routes.homeworkSystem.courseDetail'),
        icon: 'simple-icons:about-dot-me',
        hideMenu: true,
      },
    },
    {
      path: 'homework-details/:id',
      name: 'HomeworkDetails',
      component: () => import('/@/views/homeworkSystem/teacher/homeworkDetail/index.vue'),
      meta: {
        title: t('routes.homeworkSystem.homeworkDetail'),
        icon: 'simple-icons:about-dot-me',
        hideMenu: true,
      },
    },
  ],
};

export default teacher;
