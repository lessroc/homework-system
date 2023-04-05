import { createCourseApi } from '/@/views/homeworkSystem/api/teacher';

/**
 * 创建课程方法
 * @param params
 */
export const createCourseMethod = async (params) => {
  return new Promise((resolve, reject) => {
    console.log('创建课程参数:', params);
    createCourseApi(params)
      .then((res) => {
        console.log('创建课程返回值:', res);
        resolve(res);
      })
      .catch((err) => {
        console.log('创建课程错误:', err);
        reject(err);
      });
  });
};
