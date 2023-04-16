<template>
  <div class="clearfix">
    <Upload
      action="http://342j6q8933.wicp.vip/homework/uploadFile"
      list-type="picture-card"
      v-model:file-list="fileList"
      @preview="handlePreview"
      @change="handleChange"
      :key="new Date().getTime()"
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
  // 接收父元素传递的值
  const props = defineProps<{ coverUrl: string }>();
  import { ref, watch } from 'vue';
  import { Upload, Modal } from 'ant-design-vue';
  import { PlusOutlined } from '@ant-design/icons-vue';
  import { useGlobSetting } from '/@/hooks/setting';
  const globSetting = useGlobSetting();
  const basisUrl = globSetting.jobSys;

  const fakeFileList: any = [
    {
      uid: 'vc-upload-1681397139255-2',
      lastModified: 1679830134816,
      lastModifiedDate: '[native Date Sun Mar 26 2023 19:28:54 GMT+0800 (中国标准时间)]',
      name: '最伟大的作品-周杰伦.jpg',
      size: 91692,
      type: 'image/jpeg',
      percent: 100,
      originFileObj: '[object File]',
      status: 'done',
      preview: '',
      response: {
        code: 200,
        message: '操作成功',
        result: [
          {
            fileUrl: '/static/1681398845000最伟大的作品-周杰伦.jpg',
            fileSize: 91692,
            fileName: '最伟大的作品-周杰伦.jpg',
          },
        ],
      },
      xhr: '[object XMLHttpRequest]',
      thumbUrl: '',
    },
  ];

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

  let fileList = ref<FileItem[]>([]);
  // 如果父元素有传值，就将值赋值给fileList
  if (props.coverUrl) {
    fakeFileList[0].preview = ref(basisUrl + props.coverUrl);
    fakeFileList[0].thumbUrl = ref(basisUrl + props.coverUrl);
    fileList.value = fakeFileList;
  }
  watch(
    () => props.coverUrl,
    (newVal) => {
      fakeFileList[0].preview = ref(basisUrl + newVal);
      fakeFileList[0].thumbUrl = ref(basisUrl + newVal);
      fileList.value = fakeFileList;
      newVal === '' && (fileList.value = []);
    },
  );

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
    if (newFileList[0]?.response?.result?.length > 0) {
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
