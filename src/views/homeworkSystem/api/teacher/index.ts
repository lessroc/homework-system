import { homeworkHttp } from '/@/utils/http/axios';
import { ErrorMessageMode } from '/#/axios';
import {
  CreateCourseParams,
  CreateCourseResultParams,
  GetCourseListParams,
  GetCourseListResultParams,
} from '/@/views/homeworkSystem/api/teacher/model';
import { ContentTypeEnum } from '/@/enums/httpEnum';

enum Api {
  createCourse = '/course/create',
  teacherCourseList = '/course/teacherCourseList',
  editCourse = '/course/edit',
  deleteCourse = '/course/delete',
  courseDetail = '/course/detail',
  homeworkList = '/homework/teacherHomeworkList',
  homeworkPublish = '/homework/publish',
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

/**
 * 删除课程
 */
export function deleteCourseApi(
  params: { courseId: number | undefined },
  mode: ErrorMessageMode = 'modal',
) {
  return homeworkHttp.post<CreateCourseResultParams>(
    {
      url: Api.deleteCourse,
      params,
      headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },
    },
    {
      errorMessageMode: mode,
    },
  );
}

/**
 * 获取课程详情
 */
export function getCourseDetailApi(params: { courseId: number }) {
  return homeworkHttp.get({
    url: Api.courseDetail,
    params,
  });
}

/**
 * 获取作业列表
 */
export function getHomeworkListApi(params: {
  homeworkTopicId: number;
  pageNum: number;
  pageSize: number;
}) {
  return homeworkHttp.get({
    url: Api.homeworkList,
    params,
  });
}

/**
 * 发布作业
 */
export function publishHomeworkApi(params: {
  title: string;
  desc: string;
  startTime: string;
  endTime: string;
}) {
  return homeworkHttp.post({
    url: Api.homeworkPublish,
    params,
  });
}
