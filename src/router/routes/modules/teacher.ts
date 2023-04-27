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
    icon: 'simple-icons:databricks',
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
        hideMenu: true,
      },
    },
    {
      path: 'course-detail/:id',
      name: 'TeacherCourseDetail',
      component: () => import('/@/views/homeworkSystem/teacher/courseDetail/index.vue'),
      meta: {
        title: t('routes.homeworkSystem.courseDetail'),
        hideMenu: true,
      },
    },
    {
      path: 'homework-list/:id',
      name: 'TeacherHomeworkList',
      component: () => import('/@/views/homeworkSystem/teacher/homeworkList/index.vue'),
      meta: {
        title: t('routes.homeworkSystem.homeworkList'),
        hideMenu: true,
      },
    },
  ],
};

export default teacher;
