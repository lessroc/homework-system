import { homeworkHttp } from '/@/utils/http/axios';

enum Api {
  getUserList = '/admin/userList',
  deleteUser = '/admin/user/delete',
  getTeacherList = '/user/teacherList',
  adminEditCourse = '/admin/edit',
}

/**
 * 管理员编辑课程
 */
export function adminEditCourseApi(params: {
  courseDesc: string;
  courseId: number;
  courseName: string;
  coverUrl: string;
  teacherId: number;
}) {
  return homeworkHttp.post(
    {
      url: Api.adminEditCourse,
      params,
    },
    {
      errorMessageMode: 'modal',
    },
  );
}

/**
 * 获取教师列表
 */
export function getTeacherListApi() {
  return homeworkHttp.get({
    url: Api.getTeacherList,
  });
}

/**
 * 删除用户
 */
export function deleteUserApi(id: number) {
  return homeworkHttp.post(
    {
      url: Api.deleteUser + `/${id}`,
    },
    {
      errorMessageMode: 'modal',
    },
  );
}

/**
 * 获取用户列表
 */
export function getUserListApi(params: { pageNum: number; pageSize: number; userType: number }) {
  return homeworkHttp.get(
    {
      url: Api.getUserList,
      params,
    },
    {
      errorMessageMode: 'modal',
    },
  );
}
