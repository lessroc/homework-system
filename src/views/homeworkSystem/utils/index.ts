import { useGlobSetting } from '/@/hooks/setting';
const globSetting = useGlobSetting();
const basicUrl = globSetting.jobSys;

// 获取文件后缀名
export const getFileType = (fileName) => {
  try {
    const index = fileName.lastIndexOf('.');
    // 将后缀名转为小写
    const suffix = fileName.substring(index + 1).toLowerCase();
    // txt 转为 text, md 转为 markdown
    if (suffix === 'txt') {
      return 'text';
    } else if (suffix === 'md') {
      return 'markdown';
    }
    // 如果没有后缀名，返回 unknown
    if (index < 0) {
      return 'unknown';
    } else {
      return suffix;
    }
  } catch (err) {
    console.log('获取文件后缀名失败:', err);
    return 'unknown';
  }
};
// 将文件大小转换为KB、MB、GB
export const getFileSize = (fileSize) => {
  if (!/^\d+(\.\d+)?$/.test(fileSize)) return '0B';
  if (fileSize < 1024) {
    return fileSize + 'B';
  } else if (fileSize < 1024 * 1024) {
    return (fileSize / 1024).toFixed(2) + 'KB';
  } else if (fileSize < 1024 * 1024 * 1024) {
    return (fileSize / 1024 / 1024).toFixed(2) + 'MB';
  } else {
    return (fileSize / 1024 / 1024 / 1024).toFixed(2) + 'GB';
  }
};

// isImg
export const isImg = (fileName) => {
  const suffix = getFileType(fileName);
  return ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'].includes(suffix);
};

/**
 * 深度遍历 result 中的每一个字段
 */
export const deepTraversal = (obj: any) => {
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const element = obj[key];
      if (typeof element === 'string') {
        obj[key] = replaceUrl(element, basicUrl);
        if (element.startsWith('/static/')) {
          obj[key] = basicUrl + element;
        }
      } else if (typeof element === 'object') {
        deepTraversal(element);
      }
    }
  }
};

/**
 * 替换 url
 * - 匹配以 http 开头其后紧接 /static/ 则替换为 {replaceUrl}
 * - 匹配以 /static/ 开头则替换为 {replaceUrl}
 * @param url 要替换的 url
 * @param replaceValue 替换的值
 */
export const replaceUrl = (url: string, replaceValue: string) => {
  return url.replace(/^http.*(?=\/static\/)/, replaceValue);
};
