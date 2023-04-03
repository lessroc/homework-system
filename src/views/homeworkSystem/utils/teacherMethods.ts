import { createCourseApi } from '/@/views/homeworkSystem/api/teacher';

/**
 * 创建课程方法
 * @param params
 */
export const createCourseMethod = async (params) => {
  createCourseApi(params).then((res) => {
    console.log('创建课程成功:', res);
  });
};
