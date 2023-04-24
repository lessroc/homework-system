import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const teacher: AppRouteModule = {
  path: '/admin',
  name: 'Admin',
  component: LAYOUT,
  redirect: '/admin',
  meta: {
    icon: 'simple-icons:about-dot-me',
    title: t('routes.homeworkSystem.admin'),
    orderNo: 40,
    // roles: ['admin', 'super'],
  },
  children: [
    {
      path: 'course-manage',
      name: 'CourseManage',
      component: () => import('/@/views/homeworkSystem/admin/index.vue'),
      meta: {
        title: t('routes.homeworkSystem.courseManage'),
      },
    },
    {
      path: 'student-manage',
      name: 'StudentManage',
      component: () => import('/@/views/homeworkSystem/admin/UserManage.vue'),
      meta: {
        title: t('routes.homeworkSystem.studentManage'),
      },
      props: { userType: 1 },
    },
    {
      path: 'teacher-manage',
      name: 'TeacherManage',
      component: () => import('/@/views/homeworkSystem/admin/UserManage.vue'),
      meta: {
        title: t('routes.homeworkSystem.teacherManage'),
      },
      props: { userType: 2 },
    },
  ],
};

export default teacher;
