import { homeworkHttp } from '/@/utils/http/axios';

enum Api {
  allCourseList = '/course/all',
  SearchCourse = '/course/search',
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
export function searchCourseApi(params: { keyword: string }) {
  return homeworkHttp.get({
    url: Api.SearchCourse,
    params,
  });
}
