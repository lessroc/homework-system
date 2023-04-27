import { message } from 'ant-design-vue';
import { uploadFileHomeworkApi } from '/@/views/homeworkSystem/api/sys/uploadFile';

/**
 * 自定义上传文件(ant-design-vue)
 */
export const customUploadFile = (file) => {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('file', file);
    uploadFileHomeworkApi(formData)
      .then((res) => {
        console.log('自定义上传文件成功:', res);
        resolve(res);
      })
      .catch((err) => {
        console.log('自定义上传文件失败:', err);
        reject(err);
      });
  });
};

/**
 * 上传图片之前的钩子
 */
export const beforeUploadImg = (file) => {
  const isJPG = file.type === 'image/jpeg';
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isJPG) {
    message.error('上传封面只能是 JPG 格式!');
  }
  if (!isLt2M) {
    message.error('上传封面大小不能超过 2MB!');
  }
  return isJPG && isLt2M;
};
