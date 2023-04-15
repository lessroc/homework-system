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

/**
 * 老师课程列表参数
 */
export interface GetCourseListParams {
  pageNum?: number;
  pageSize?: number;
  userId?: number;
}

/**
 * 老师课程列表返回值
 */
export interface GetCourseListResultParams {
  /**
   * 分页数据
   */
  list: CourseListDTO[];
  /**
   * 当前页码
   */
  pageNum?: number;
  /**
   * 每页数量
   */
  pageSize?: number;
  /**
   * 总条数
   */
  total?: number;
  /**
   * 总页数
   */
  totalPage?: number;
}

/**
 * CourseListDTO
 */
export interface CourseListDTO {
  /**
   * 课程描述
   */
  courseDesc: string;
  /**
   * 课程id
   */
  courseId: number;
  /**
   * 课程name
   */
  courseName: string;
  /**
   * 课程封面url
   */
  coverUrl: string;
  /**
   * 老师id
   */
  teacherId: number;
  /**
   * 老师name
   */
  teacherName: string;
}
