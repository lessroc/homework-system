import { homeworkHttp } from '/@/utils/http/axios';

enum Api {
  allCourseList = '/course/all',
  SearchCourse = '/course/search',
  stuCourseList = '/course/stuCourseList',
  joinCourse = '/course/join',
  leaveCourse = '/course/leave',
  studentHomeworkList = '/homework/studentHomeworkList',
}

/**
 * 获取所有课程列表
 */
export function getAllCourseListApi(params: { pageNum: number; pageSize: number }) {
  return homeworkHttp.get({
    url: Api.allCourseList,
    params,
  });
}

/**
 * 搜索课程
 */
export function searchCourseApi(params: { keyword: string; pageNum: number; pageSize: number }) {
  return homeworkHttp.get({
    url: Api.SearchCourse,
    params,
  });
}

/**
 * 获取学生课程列表
 */
export function getStuCourseListApi(params: {
  pageNum: number;
  pageSize: number;
  studentId: number;
}) {
  return homeworkHttp.get({
    url: Api.stuCourseList,
    params,
  });
}

/**
 * 加入课程
 */
export function joinCourseApi(params: { courseId: number; studentId: number }) {
  return homeworkHttp.post(
    {
      url: Api.joinCourse,
      params,
    },
    {
      errorMessageMode: 'modal',
    },
  );
}

/**
 * 退出课程
 */
export function leaveCourseApi(params: { courseId: number; studentId: number }) {
  return homeworkHttp.post(
    {
      url: Api.leaveCourse,
      params,
    },
    {
      errorMessageMode: 'modal',
    },
  );
}

/**
 * 获取学生作业答卷列表
 */
export function getStudentHomeworkListApi(params: {
  pageNum: number;
  pageSize: number;
  courseId: number;
}) {
  return homeworkHttp.get({
    url: Api.studentHomeworkList,
    params,
  });
}
