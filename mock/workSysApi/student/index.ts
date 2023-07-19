import { MockMethod } from 'vite-plugin-mock';
import { resultSuccess } from '../../_util';
import { Random } from 'mockjs';
import { resultPageSuccess } from '../_util';

const courseList = (() => {
  const result: any[] = [];
  for (let index = 0; index < 100; index++) {
    result.push({
      courseDesc: Random.cparagraph(),
      courseId: Random.integer(100000, 999999),
      courseName: Random.ctitle(3, 6),
      coverUrl: Random.image('200x150', Random.color(), Random.color(), Random.first()),
      teacherId: Random.integer(1, 9),
      teacherName: Random.cname(),
    });
  }
  return result;
})();

enum Api {
  allCourseList = '/course/all',
  SearchCourse = '/course/search',
  stuCourseList = '/course/stuCourseList',
  joinCourse = '/course/join',
  leaveCourse = '/course/leave',
  studentHomeworkList = '/homework/studentHomeworkList',
  commitHomework = '/homework/commit',
  saveDraftHomework = '/homework/saveDraft',
}

export default [
  {
    url: `/work-sys-api${Api.allCourseList}`,
    timeout: 200,
    method: 'get',
    response: ({ query }) => {
      const { pageNum, pageSize } = query;
      return resultPageSuccess(pageNum, pageSize, courseList);
    },
  },
  {
    url: `/work-sys-api${Api.SearchCourse}`,
    timeout: 200,
    method: 'get',
    response: ({ query }) => {
      const { pageNum, pageSize, keyword } = query;
      const courseList = (() => {
        const result: any[] = [];
        const random = Random.integer(1, 8);
        for (let index = 0; index < random; index++) {
          result.push({
            courseDesc: Random.cparagraph(),
            courseId: Random.integer(100000, 999999),
            courseName: keyword ?? Random.ctitle(),
            coverUrl: Random.image('200x100'),
            teacherId: Random.integer(1, 9),
            teacherName: Random.cname(),
          });
        }
        return result;
      })();
      return resultPageSuccess(pageNum, pageSize, courseList);
    },
  },
  {
    url: `/work-sys-api${Api.stuCourseList}`,
    timeout: 200,
    method: 'get',
    response: ({ query }) => {
      const { pageNum, pageSize } = query;
      return resultPageSuccess(pageNum, pageSize, courseList);
    },
  },
  {
    url: `/work-sys-api${Api.joinCourse}`,
    timeout: 200,
    method: 'post',
    response: () => {
      return resultSuccess(true, { message: '加入成功' });
    },
  },
  {
    url: `/work-sys-api${Api.leaveCourse}`,
    timeout: 200,
    method: 'post',
    response: () => {
      return resultSuccess(true, { message: '退出成功' });
    },
  },
  {
    url: `/work-sys-api${Api.studentHomeworkList}`,
    timeout: 200,
    method: 'get',
    response: ({ query }) => {
      const { pageNum, pageSize } = query;
      const homeworkList = (() => {
        const result: any[] = [];
        for (let index = 0; index < 50; index++) {
          result.push({
            homeEndTime: Random.datetime(),
            homeStartTime: Random.datetime(),
            homeworkId: Random.integer(100000, 999999),
            homeworkTopicDesc: Random.cparagraph(),
            homeworkTopicId: Random.integer(100000, 999999),
            homeworkTopicTitle: Random.ctitle(),
            isCorrected: Random.boolean(),
            score: Random.integer(60, 100),
            state: Random.integer(1, 2),
            teacherId: Random.integer(1, 9),
            teacherName: Random.cname(),
          });
        }
        return result;
      })();
      return resultPageSuccess(pageNum, pageSize, homeworkList);
    },
  },
  {
    url: `/work-sys-api${Api.commitHomework}`,
    timeout: 200,
    method: 'post',
    response: () => {
      return resultSuccess(true, { message: '提交成功' });
    },
  },
  {
    url: `/work-sys-api${Api.saveDraftHomework}`,
    timeout: 200,
    method: 'post',
    response: () => {
      return resultSuccess(true, { message: '保存成功' });
    },
  },
] as MockMethod[];
