<template>
  <Spin :spinning="spinning">
    <Typography>
      <TypographyTitle>{{
        detail.homeworkTopicTitle + '|' + detail.homeworkTopicId
      }}</TypographyTitle>
      <template v-if="newHomework">
        <TypographyParagraph>
          <a-input
            v-model:value="detail.homeworkTopicDesc"
            placeholder="请输入作业描述"
            allow-clear
          />
        </TypographyParagraph>
        <TypographyParagraph>
          <a-textarea v-model:value="detail.content" placeholder="请输入作业内容" allow-clear />
        </TypographyParagraph>
      </template>
      <template v-else>
        <TypographyParagraph>描述：{{ detail.homeworkTopicDesc }}</TypographyParagraph>
        <TypographyParagraph>内容：{{ detail.content }}</TypographyParagraph>
      </template>
      <Divider>{{ newHomework ? '上传附件' : '附件' }}</Divider>
      <!--<template v-if="detail.attachmentList.length > 0">
        <div class="attachmentList" v-for="(item, index) in detail.attachmentList" :key="index">
          <a class="item" :href="item.fileUrl" target="_blank" rel="noopener noreferrer">
            <div class="left">
              <img class="imgStyle" v-if="item.isImg" :src="item.fileUrl" :alt="item.fileName" />
              <FileExcelOutlined v-else-if="item.fileSuffix === 'excel'" class="icon" />
              <FileWordOutlined v-else-if="item.fileSuffix === 'word'" class="icon" />
              <FilePptOutlined v-else-if="item.fileSuffix === 'ppt'" class="icon" />
              <FilePdfOutlined v-else-if="item.fileSuffix === 'pdf'" class="icon" />
              <FileZipOutlined v-else-if="item.fileSuffix === 'zip'" class="icon" />
              <FileTextOutlined v-else-if="item.fileSuffix === 'text'" class="icon" />
              <FileMarkdownOutlined v-else-if="item.fileSuffix === 'markdown'" class="icon" />
              <FileUnknownOutlined v-else class="icon" />
            </div>
            <div class="right">
              <div class="fileName">{{ item.fileName }}</div>
              <div class="fileSize">{{ item.fileSize }}</div>
            </div>
          </a>
        </div>
      </template>-->
      <UploadFiles :attachmentList="detail.attachmentList" :isDelete="newHomework" />
      <!--<template>
        <Empty description="暂无附件" />
      </template>-->
    </Typography>
  </Spin>
</template>
<script lang="ts" setup>
  import { Spin, Typography, TypographyTitle, TypographyParagraph, Divider } from 'ant-design-vue';
  import { computed, onBeforeMount, reactive, ref } from 'vue';
  import { getHomeworkDetailApi } from '/@/views/homeworkSystem/api/teacher';
  import UploadFiles from './UploadFiles.vue';
  import { getFileSize, getFileType, isImg } from '/@/views/homeworkSystem/utils';
  const props = defineProps<{ topicDetails }>();
  // const emit = defineEmits(['closeDrawer']);
  console.log('作业详情抽屉:', props.topicDetails);
  // 计算作业Id是否存在,不存在则是新建提交作业
  const newHomework = computed(() => {
    return !props.topicDetails.homeworkId;
  });
  console.log('是否是新建作业:', newHomework.value);
  const spinning = ref<boolean>(false);
  let detail = reactive({
    homeworkTopicTitle: props.topicDetails.homeworkTopicTitle,
    homeworkTopicDesc: '',
    content: '',
    attachmentList: [],
    state: props.topicDetails.state,
    homeworkId: props.topicDetails.homeworkId,
    homeworkTopicId: props.topicDetails.homeworkTopicId,
    teacherId: props.topicDetails.teacherId,
    teacherName: props.topicDetails.teacherName,
  });
  // 等待1秒, 关闭Drawer, 通知父组件刷新列表
  /* setTimeout(() => {
    emit('closeDrawer');
  }, 500); */
  // 获取作业详情
  const getHomeworkDetail = async () => {
    if (newHomework.value) return;
    spinning.value = true;
    await getHomeworkDetailApi(props.topicDetails.homeworkId)
      .then((res) => {
        console.log('作业详情:', res);
        const url = 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png';
        res.attachmentList = res.attachmentList.map((item) => {
          item.fileSize = `附件大小：${getFileSize(item.fileSize)}`;
          item.fileUrl = url;
          item.fileSuffix = getFileType(item.fileName);
          item.isImg = isImg(item.fileUrl);
          return item;
        });
        detail = Object.assign(detail, res);
      })
      .catch((err) => {
        console.log('作业详情:', err);
      });
    spinning.value = false;
  };
  onBeforeMount(() => {
    getHomeworkDetail();
  });
</script>
<style lang="less" scoped>
  .spin-state {
    margin-top: 16px;
  }

  .attachmentList {
    .item {
      display: flex;
      align-items: center;
      margin-bottom: 16px;
      transition: all 0.3s;
      border-radius: 4px;

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

        .fileName {
          font-size: 16px;
          color: #333;
        }

        .fileSize {
          font-size: 14px;
          color: #999;
        }
      }
    }
  }
</style>
