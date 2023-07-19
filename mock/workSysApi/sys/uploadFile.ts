import { MockMethod } from 'vite-plugin-mock';
import { resultSuccess } from '../../_util';
import { Random } from 'mockjs';

enum Api {
  UploadFile = '/homework/uploadFile',
}

export default [
  {
    url: `/work-sys-api${Api.UploadFile}`,
    timeout: 200,
    method: 'post',
    response: ({ body }) => {
      console.log('uploadFileHomeworkApi params:', body);
      return resultSuccess([
        {
          fileName: '@cword(5,20).jpg',
          fileSize: 1000,
          fileUrl: Random.image('272x204', Random.color(), Random.color(), Random.first()),
        },
      ]);
    },
  },
] as MockMethod[];
