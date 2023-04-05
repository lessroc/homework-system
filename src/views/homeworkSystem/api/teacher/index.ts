import { homeworkHttp } from '/@/utils/http/axios';
import { ErrorMessageMode } from '/#/axios';
import {
  CreateCourseParams,
  CreateCourseResultParams,
} from '/@/views/homeworkSystem/api/teacher/model';

enum Api {
  createCourse = '/course/create',
}

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
