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

// 深度遍历result中的每一项
// 如果属性类型是字符串则将字符串开头/^http.*\/static\//的部分替换为http://342j6q8933.wicp.vip/static/
// 如果属性类型是字符串则将字符串开头/static/的部分替换为http://342j6q8933.wicp.vip/static/
export const deepTraversal = (obj: any) => {
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const element = obj[key];
      if (typeof element === 'string') {
        obj[key] = element.replace(/^http.*\/static\//, `${basicUrl}/static/`);
        if (element.startsWith('/static/')) {
          obj[key] = element.replace('/static/', `${basicUrl}/static/`);
        }
      } else if (typeof element === 'object') {
        deepTraversal(element);
      }
    }
  }
};
