<template>
  <Upload
    v-model:file-list="fileList"
    name="file"
    action="http://342j6q8933.wicp.vip/homework/uploadFile"
    @change="handleChange"
  >
    <div class="uploadBtnBox" v-if="isDelete">
      <Button>
        <upload-outlined />
        上传附件
      </Button>
    </div>
    <template #itemRender="{ file, actions }">
      <div class="attachmentList">
        <div class="item">
          <div class="left" @click="actions.download">
            <img class="imgStyle" v-if="file.isImg" :src="file.fileUrl" :alt="file.name" />
            <FileExcelOutlined v-else-if="file.fileSuffix === 'excel'" class="icon" />
            <FileWordOutlined v-else-if="file.fileSuffix === 'word'" class="icon" />
            <FilePptOutlined v-else-if="file.fileSuffix === 'ppt'" class="icon" />
            <FilePdfOutlined v-else-if="file.fileSuffix === 'pdf'" class="icon" />
            <FileZipOutlined v-else-if="file.fileSuffix === 'zip'" class="icon" />
            <FileTextOutlined v-else-if="file.fileSuffix === 'text'" class="icon" />
            <FileMarkdownOutlined v-else-if="file.fileSuffix === 'markdown'" class="icon" />
            <FileUnknownOutlined v-else class="icon" />
          </div>
          <div class="right" @click="actions.download">
            <div class="fileName">{{ file.name }}</div>
            <div class="fileSize">{{ file.fileSize }}</div>
          </div>
          <div class="deleteBox" v-if="isDelete">
            <DeleteOutlined class="deleteIcon" @click="actions.remove" />
          </div>
        </div>
      </div>
    </template>
  </Upload>
</template>
<script lang="ts" setup>
  import { message, Upload, Button } from 'ant-design-vue';
  import { UploadOutlined, DeleteOutlined } from '@ant-design/icons-vue';
  import {
    FileExcelOutlined,
    FileWordOutlined,
    FilePptOutlined,
    FilePdfOutlined,
    FileZipOutlined,
    FileTextOutlined,
    FileMarkdownOutlined,
    FileUnknownOutlined,
  } from '@ant-design/icons-vue';
  import { reactive, ref } from 'vue';
  import type { UploadChangeParam } from 'ant-design-vue';
  import { getFileSize, getFileType, isImg } from '/@/views/homeworkSystem/utils';
  const props = defineProps<{ attachmentList; isDelete }>();
  console.log('旧的上传文件:', props.attachmentList);
  const oldFileList = reactive(initializeFileList(props.attachmentList));
  function initializeFileList(oldFileList) {
    return oldFileList.map((item, i) => {
      return {
        ...item,
        uid: i + 1,
        name: item.fileName,
        status: 'done',
        url: item.fileUrl,
        thumbUrl: item.fileUrl,
      };
    });
  }
  // 监听props
  const handleChange = (info: UploadChangeParam) => {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
      const newFile = handleFile(info.file);
      console.log('newFile', newFile);
      fileList.value.pop();
      fileList.value.push(newFile);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} 文件上传成功`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} 文件上传失败。`);
    }
  };

  /**
   * 处理上传文件添加字段
   */
  function handleFile(item) {
    console.log('handleFile', item);
    const url = getFileUrl(item.status, item.response);
    return {
      ...item,
      fileName: item.name,
      fileUrl: url,
      fileSize: getFileSize(item.size),
      fileSuffix: getFileType(item.name),
      isImg: isImg(item.name),
      thumbUrl: url,
      url,
    };
  }

  // 从上传完成的响应中回去文件url
  function getFileUrl(status, response) {
    console.log('getFileUrl', status, response);
    if (status === 'done') {
      return import.meta.env.VITE_GLOB_API_JOB_SYS_URL + response.result[0].fileUrl;
    }
    return '';
  }

  let fileList = ref(oldFileList);
</script>
<style lang="less" scoped>
  :deep(.ant-upload) {
    width: 100%;
    text-align: center;
    margin-bottom: 16px;
  }

  .attachmentList {
    .item {
      display: flex;
      align-items: center;
      margin-bottom: 16px;
      transition: all 0.3s;
      border-radius: 4px;
      cursor: pointer;

      &:hover {
        background-color: #f5f5f5;
        box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
      }

      .left {
        .imgStyle {
          width: 70px;
          height: 70px;
          border-radius: 4px;
        }

        .icon {
          font-size: 70px;
          color: #999;
        }
      }

      .right {
        margin-left: 16px;
        flex: 1;

        .fileName {
          font-size: 16px;
          color: #333;
        }

        .fileSize {
          font-size: 14px;
          color: #999;
        }
      }

      .deleteBox {
        width: 70px;
        height: 70px;
        display: flex;
        justify-content: center;
        align-items: center;

        .deleteIcon {
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 20px;
          color: #999;
          transition: all 0.2s;

          &:hover {
            color: #f00;
            font-size: 26px;
          }
        }
      }
    }
  }
</style>
