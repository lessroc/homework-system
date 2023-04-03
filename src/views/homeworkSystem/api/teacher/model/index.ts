/**
 * 创建课程参数
 */
export interface CreateCourseParams {
  courseName: string;
  courseDesc: string;
}

/**
 * 创建课程返回值
 */
export interface CreateCourseResultParams {
  courseDesc: string;
  courseName: string;
  createTime: string;
  id: number;
  teacherId: number;
  updateTime: string;
}
