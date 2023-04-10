import { ErrorMessageMode } from '/#/axios';
import { homeworkHttp } from '/@/utils/http/axios';
import { ContentTypeEnum } from '/@/enums/httpEnum';
interface UploadFileParams {
  file: File;
}
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
export function uploadFileHomeworkApi(params: UploadFileParams, mode: ErrorMessageMode = 'modal') {
  return homeworkHttp.post<UploadFileResultModel>(
    {
      url: Api.UploadFile,
      params,
      headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },
    },
    {
      errorMessageMode: mode,
    },
  );
}
