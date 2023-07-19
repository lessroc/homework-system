import { MockMethod } from 'vite-plugin-mock';
import { resultSuccess } from '../../_util';
import { resultPageSuccess } from '../_util';
import { Random } from 'mockjs';

const teacherCourseList = (() => {
  const result: any[] = [];
  for (let index = 0; index < 100; index++) {
    result.push({
      courseDesc: '@cword(10,20)',
      courseId: '@integer(100000,999999)',
      courseName: '@cname()',
      // coverUrl: `https://unsplash.it/272/204?random&index=${index}`,
      coverUrl: Random.image('272x204', Random.color(), Random.color(), Random.first()),
      // coverUrl: `https://picsum.photos/272/204?${index}`,
      teacherId: 2,
      teacherName: '@cname()',
    });
  }
  return result;
})();

const homeworkTopicList = (() => {
  const result: any[] = [];
  for (let index = 0; index < 50; index++) {
    result.push({
      createTime: '@datetime',
      endTime: '@datetime',
      homeworkTopicDesc: '@cword(10,20)',
      homeworkTopicId: '@integer(100000,999999)',
      homeworkTopicTitle: '@cname()',
      startTime: '@datetime',
    });
  }
  return result;
})();

const teacherHomeworkList = (() => {
  const result: any[] = [];
  for (let index = 0; index < 50; index++) {
    result.push({
      commitTime: '@datetime',
      homeworkId: '@integer(100000,999999)',
      isCorrected: '@boolean()',
      score: '@integer(60,100)',
      studentId: 1,
      studentName: '@cname()',
    });
  }
  return result;
})();

const courseStudentList = (() => {
  const result: any[] = [];
  for (let index = 0; index < 100; index++) {
    result.push({
      studentId: '@integer(1,9)',
      studentName: '@cname()',
    });
  }
  return result;
})();

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

export default [
  {
    url: `/work-sys-api${Api.createCourse}`,
    timeout: 200,
    method: 'post',
    response: () => {
      return resultSuccess({
        message: '创建成功, 随机mock课程',
      });
    },
  },
  {
    url: `/work-sys-api${Api.teacherCourseList}`,
    timeout: 200,
    method: 'get',
    response: ({ query }) => {
      const { pageNum = 1, pageSize = 10 } = query;
      return resultPageSuccess(pageNum, pageSize, teacherCourseList);
    },
  },
  {
    url: `/work-sys-api${Api.editCourse}`,
    timeout: 200,
    method: 'post',
    response: () => {
      return resultSuccess(true, { message: '编辑成功' });
    },
  },
  {
    url: `/work-sys-api${Api.deleteCourse}`,
    timeout: 200,
    method: 'post',
    response: () => {
      return resultSuccess(true, { message: '删除成功' });
    },
  },
  {
    url: `/work-sys-api${Api.courseDetail}`,
    timeout: 200,
    method: 'get',
    response: () => {
      return resultSuccess({
        courseDesc: '@cword(10,20)',
        courseId: '@integer(100000,999999)',
        courseName: '@cname()',
        coverUrl: `https://picsum.photos/272/204?${Random.id()}`,
        createTime: '@datetime',
        teacherId: 2,
        teacherName: '@cname()',
        updateTime: '@datetime',
      });
    },
  },
  {
    url: `/work-sys-api${Api.homeworkTopicList}`,
    timeout: 200,
    method: 'get',
    response: ({ query }) => {
      const { pageNum = 1, pageSize = 10 } = query;
      return resultPageSuccess(pageNum, pageSize, homeworkTopicList);
    },
  },
  {
    url: `/work-sys-api${Api.homeworkPublish}`,
    timeout: 200,
    method: 'post',
    response: () => {
      return resultSuccess(true, { message: '发布成功' });
    },
  },
  {
    url: `/work-sys-api${Api.teacherHomeworkList}`,
    timeout: 200,
    method: 'get',
    response: ({ query }) => {
      const { pageNum = 1, pageSize = 10 } = query;
      return resultPageSuccess(pageNum, pageSize, teacherHomeworkList);
    },
  },
  {
    url: RegExp(`/work-sys-api${Api.homeworkDetail}.*`),
    timeout: 200,
    method: 'get',
    response: () => {
      return resultSuccess({
        attachmentList: (() => {
          const result: any[] = [];
          const random = Random.integer(1, 5);
          for (let index = 0; index < random; index++) {
            result.push({
              fileName: '@cword(5,10).jpg',
              fileSize: '@integer(1000,10000)',
              fileUrl: `https://picsum.photos/272/204?${Random.id()}`,
            });
          }
          return result;
        })(),
        content: '@cword(10,20)',
        homeworkId: '@integer(100000,999999)',
        homeworkTopicDesc: '@cword(10,20)',
        homeworkTopicId: '@id()',
        homeworkTopicTitle: '@cname()',
        state: '@integer(1,2)',
        teacherId: 2,
        teacherName: '@cname()',
      });
    },
  },
  {
    url: `/work-sys-api${Api.homeworkCorrect}`,
    timeout: 200,
    method: 'post',
    response: () => {
      return resultSuccess(true, { message: '批改成功' });
    },
  },
  {
    url: `/work-sys-api${Api.courseStudentList}`,
    timeout: 200,
    method: 'get',
    response: ({ query }) => {
      const { pageNum = 1, pageSize = 10 } = query;
      return resultPageSuccess(pageNum, pageSize, courseStudentList);
    },
  },
] as MockMethod[];
