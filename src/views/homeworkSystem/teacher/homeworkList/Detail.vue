<template v-if="homeworkId">
  <Spin :spinning="spinning">
    <Typography>
      <TypographyTitle>{{ detail.homeworkTopicTitle + '|' + detail.homeworkId }}</TypographyTitle>
      <TypographyParagraph>描述：{{ detail.homeworkTopicDesc }}</TypographyParagraph>
      <TypographyParagraph>内容：{{ detail.content }}</TypographyParagraph>
      <template v-if="detail.attachmentList.length > 0">
        <Divider>附件</Divider>
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
      </template>
      <Divider>{{ scoreDivider }}</Divider>
      <a-input-group style="text-align: center">
        <a-input
          v-model:value="score"
          allowClear
          size="large"
          addonBefore="得分 :"
          style="width: 300px; text-align: center !important"
          placeholder="分数 | 评级"
          @keyup.enter="submitScore"
        />
        <a-button type="primary" size="large" :loading="loading" @click="submitScore"
          >提交</a-button
        >
      </a-input-group>
    </Typography>
  </Spin>
</template>
<script lang="ts" setup>
  import {
    Spin,
    Typography,
    TypographyTitle,
    TypographyParagraph,
    Divider,
    message,
  } from 'ant-design-vue';
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
  import { computed, onBeforeMount, reactive, ref } from 'vue';
  import { correctHomeworkApi, getHomeworkDetailApi } from '/@/views/homeworkSystem/api/teacher';
  const props = defineProps<{ homeworkId: number; score: string }>();
  const emit = defineEmits(['closeDrawer']);
  console.log('作业ID:', props.homeworkId);
  const spinning = ref<boolean>(false);
  let detail = reactive({
    homeworkTopicTitle: '',
    homeworkTopicDesc: '',
    content: '',
    attachmentList: [],
    state: 0,
    homeworkId: props.homeworkId,
    homeworkTopicId: 0,
    teacherId: 0,
    teacherName: '',
  });
  const score = ref<string>(props.score);
  const scoreDivider = computed(() => {
    return props.score === '' ? '评分' : '修改评分';
  });
  const submitOrModify = computed(() => {
    return props.score === '' ? '提交' : '修改';
  });
  const loading = ref<boolean>(false);
  // 提交评分
  const submitScore = async () => {
    loading.value = true;
    if (score.value === '') {
      message.error('请输入分数');
      loading.value = false;
      return;
    }
    await correctHomeworkApi({ homeworkId: props.homeworkId, score: Number(score.value) })
      .then((res) => {
        console.log('提交评分成功:', res);
        message.success(`${submitOrModify.value}评分成功`);
        // 等待1秒, 关闭Drawer, 通知父组件刷新列表
        setTimeout(() => {
          score.value = '';
          emit('closeDrawer');
        }, 500);
      })
      .catch((err) => {
        console.log('提交评分失败:', err);
      });
    loading.value = false;
  };
  // 获取作业详情
  const getHomeworkDetail = async () => {
    spinning.value = true;
    await getHomeworkDetailApi(props.homeworkId)
      .then((res) => {
        console.log('作业详情:', res);
        const url = 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png';
        const imgList = ['jpg', 'png', 'gif', 'jpeg', 'webp'];
        res.attachmentList = res.attachmentList.map((item) => {
          item.fileSize = `附件大小：${getFileSize(item.fileSize)}`;
          item.fileUrl = url;
          item.fileSuffix = getFileType(item.fileName);
          item.isImg = imgList.includes(item.fileSuffix);
          return item;
        });
        detail = Object.assign(detail, res);
      })
      .catch((err) => {
        console.log('作业详情:', err);
      });
    spinning.value = false;
  };
  // 获取文件后缀名
  const getFileType = (fileName) => {
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
  const getFileSize = (fileSize) => {
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
