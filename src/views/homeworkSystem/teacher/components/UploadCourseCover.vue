<template>
  <div class="clearfix">
    <Upload
      action="https://frp-any.top:32028/homework/uploadFile"
      list-type="picture-card"
      v-model:file-list="fileList"
      @preview="handlePreview"
      @change="handleChange"
    >
      <div v-if="fileList.length < 1">
        <PlusOutlined />
        <div class="ant-upload-text">课程封面</div>
      </div>
    </Upload>
    <Modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
      <img alt="example" style="width: 100%" :src="previewImage" />
    </Modal>
  </div>
</template>
<script lang="ts" setup>
  const emit = defineEmits(['setCoverUrl']);
  import { ref } from 'vue';
  import { Upload, Modal } from 'ant-design-vue';
  import { PlusOutlined } from '@ant-design/icons-vue';

  function getBase64(file: File) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

  interface FileItem {
    uid: string;
    name?: string;
    status?: string;
    response?: any;
    percent?: number;
    url?: string;
    preview?: string;
    originFileObj?: any;
  }

  interface FileInfo {
    file: FileItem;
    fileList: FileItem[];
  }

  const previewVisible = ref<boolean>(false);
  const previewImage = ref<string | undefined>('');

  const fileList = ref<FileItem[]>([]);

  const handleCancel = () => {
    previewVisible.value = false;
  };
  const handlePreview = async (file: FileItem) => {
    if (!file.url && !file.preview) {
      file.preview = (await getBase64(file.originFileObj)) as string;
    }
    previewImage.value = file.url || file.preview;
    previewVisible.value = true;
  };
  const handleChange = ({ fileList: newFileList }: FileInfo) => {
    fileList.value = newFileList;
    // 上传成功后，将返回的url赋值给父组件的formState.coverUrl
    if (newFileList[0].response?.result?.length > 0) {
      emit('setCoverUrl', newFileList[0].response.result[0].fileUrl);
    }
  };
</script>
<style scoped>
  /* you can make up upload button and sample style by using stylesheets */
  .ant-upload-select-picture-card i {
    font-size: 32px;
    color: #999;
  }

  .ant-upload-select-picture-card .ant-upload-text {
    margin-top: 8px;
    color: #666;
  }
</style>
