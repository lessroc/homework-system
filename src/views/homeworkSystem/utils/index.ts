// 获取文件后缀名
export const getFileType = (fileName) => {
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
};
// 将文件大小转换为KB、MB、GB
export const getFileSize = (fileSize) => {
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
