import { ErrorMessageMode } from '/#/axios';
import { homeworkUploadHttp } from '/@/utils/http/axios';
import { ContentTypeEnum } from '/@/enums/httpEnum';
interface UploadFileResultModel {
  code: number;
  result: object;
  message: string;
}
enum Api {
  UploadFile = '/homework/uploadFile',
}

/**
 * @description: upload file
 */
export function uploadFileHomeworkApi(params, mode: ErrorMessageMode = 'modal') {
  console.log('uploadFileHomeworkApi params:', params);
  return homeworkUploadHttp.post<UploadFileResultModel>(
    {
      url: Api.UploadFile,
      params,
      headers: { 'Content-Type': ContentTypeEnum.FORM_DATA },
    },
    {
      errorMessageMode: mode,
    },
  );
}
