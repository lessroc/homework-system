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
  editCourse = '/course/edit',
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

/**
 * 编辑课程
 */
export function editCourseApi(params: CreateCourseParams, mode: ErrorMessageMode = 'modal') {
  return homeworkHttp.post<CreateCourseResultParams>(
    {
      url: Api.editCourse,
      params,
    },
    {
      errorMessageMode: mode,
    },
  );
}
