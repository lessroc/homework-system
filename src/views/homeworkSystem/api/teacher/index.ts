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
  homeworkTopicList = '/homework/homeworkTopicList',
  homeworkPublish = '/homework/publish',
  teacherHomeworkList = '/homework/teacherHomeworkList',
  homeworkDetail = '/homework/detail',
  homeworkCorrect = '/homework/correct',
  courseStudentList = '/course/studentList',
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
 * 获取作业主题列表
 */
export function getHomeworkTopicListApi(params: {
  courseId: number;
  pageNum: number;
  pageSize: number;
}) {
  return homeworkHttp.get({
    url: Api.homeworkTopicList,
    params,
    headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },
  });
}

/**
 * 发布作业
 */
export function publishHomeworkApi(params: {
  courseId: number;
  title: string;
  desc: string;
  startTime: string;
  endTime: string;
  homeworkTopicId: number;
}) {
  return homeworkHttp.post({
    url: Api.homeworkPublish,
    params,
  });
}

/**
 * 获取作业答卷列表
 */
export function getHomeworkAnswerSheetListApi(params: {
  homeworkTopicId: number;
  pageNum: number;
  pageSize: number;
}) {
  return homeworkHttp.get({
    url: Api.teacherHomeworkList,
    params,
  });
}

/**
 * 获取作业详情
 */
export function getHomeworkDetailApi(params) {
  return homeworkHttp.get({
    url: `${Api.homeworkDetail}/${params}`,
  });
}

/**
 * 批改作业
 */
export function correctHomeworkApi(params: { homeworkId: number; score: number }) {
  return homeworkHttp.post({
    url: Api.homeworkCorrect,
    params,
  });
}

/**
 * 获取课程学生名单列表
 */
export function getCourseStudentListApi(params: {
  courseId: number;
  pageNum: number;
  pageSize: number;
}) {
  return homeworkHttp.get({
    url: Api.courseStudentList,
    params,
  });
}
