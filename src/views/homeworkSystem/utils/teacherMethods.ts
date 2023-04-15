import { createCourseApi } from '/@/views/homeworkSystem/api/teacher';
import { CourseListDTO } from '/@/views/homeworkSystem/api/teacher/model';

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

/**
 * 替换课程列表中图片的域名
 * https://frp-any.top:32028 -> ''
 */
export const replaceCoverUrl = (courseList: CourseListDTO[]): CourseListDTO[] => {
  return courseList.map((course) => {
    if (course.coverUrl.startsWith('https://frp-any.top:32028')) {
      return {
        ...course,
        coverUrl: course.coverUrl.replace('https://frp-any.top:32028', ''),
      };
    } else {
      return course;
    }
  });
};
