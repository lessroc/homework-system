import { homeworkHttp } from '/@/utils/http/axios';
import { ErrorMessageMode } from '/#/axios';
import {
  CreateCourseParams,
  CreateCourseResultParams,
  GetCourseListParams,
  GetCourseListResultParams,
} from '/@/views/homeworkSystem/api/teacher/model';

enum Api {
  createCourse = '/course/create',
  teacherCourseList = '/course/teacherCourseList',
}

/**
 * 创建课程
 */
export function createCourseApi(params: CreateCourseParams, mode: ErrorMessageMode = 'modal') {
  return homeworkHttp.post<CreateCourseResultParams>(
    {
      url: Api.createCourse,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * 老师课程列表
 */
export function getTeacherCourseListApi(params: GetCourseListParams) {
  console.log('提交的参数:', params);
  return homeworkHttp.get<GetCourseListResultParams>({
    url: Api.teacherCourseList,
    params,
  });
}
import axios from 'axios';
/**
 * 老师课程列表 axios
 */
export function getTeacherCourseListAxiosApi(params: GetCourseListParams) {
  console.log('获取课程列表成功Axios提交的参数:', params);
  return axios({
    method: 'GET',
    headers: { 'content-type': 'application/json' },
    data: params,
    url: import.meta.env.VITE_GLOB_API_JOB_SYS_URL + Api.teacherCourseList,
  });
}
