<template>
  <Spin :spinning="spinning">
    <Typography>
      <TypographyTitle>{{ detail.homeworkTopicTitle }}</TypographyTitle>
      <TypographyParagraph>
        状态：<Tag color="#2db7f5">{{ topicDetails.comprehensiveStatus }}</Tag>
      </TypographyParagraph>
      <TypographyParagraph v-if="detail.homeworkTopicDesc">
        描述：{{ detail.homeworkTopicDesc }}
      </TypographyParagraph>
      <template v-if="newHomework || isADraft">
        <TypographyParagraph>
          <TextArea v-model:value="detail.content" placeholder="请输入作业内容" allow-clear />
        </TypographyParagraph>
      </template>
      <template v-else>
        <TypographyParagraph>内容：{{ detail.content }}</TypographyParagraph>
      </template>
      <Divider>{{ newHomework ? '上传附件' : '附件' }}</Divider>
      <UploadFiles
        v-if="detail.attachmentList.length > 0 || newHomework || isADraft"
        :attachmentList="detail.attachmentList"
        :newHomework="newHomework"
        :isADraft="isADraft"
        @update-file-list="updateFileList"
      />
      <Empty description="暂无附件" v-else />
      <div class="text-right" v-if="newHomework || isADraft">
        <Space>
          <Button @click="submit(1)">存草稿</Button>
          <Button type="primary" @click="submit(2)">提交</Button>
        </Space>
      </div>
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
    Empty,
    Space,
    Button,
    message,
    Input,
    Tag,
  } from 'ant-design-vue';
  import { computed, onBeforeMount, reactive, ref } from 'vue';
  import { getHomeworkDetailApi } from '/@/views/homeworkSystem/api/teacher';
  import UploadFiles from './UploadFiles.vue';
  import { getFileSize, getFileType, isImg } from '/@/views/homeworkSystem/utils';
  import { commitHomeworkApi, saveDraftHomeworkApi } from '/@/views/homeworkSystem/api/student';
  import dayjs from 'dayjs';
  const { TextArea } = Input;
  const props = defineProps<{ topicDetails }>();
  const emit = defineEmits(['closeDrawer']);
  console.log('作业详情抽屉:', props.topicDetails);
  // 计算作业Id是否存在,不存在则是新建提交作业
  const newHomework = computed(() => {
    return !props.topicDetails.homeworkId;
  });
  const isADraft = ref<boolean>(false);
  console.log('是否是新建作业:', newHomework.value);
  const spinning = ref<boolean>(false);
  let detail = reactive({
    attachmentList: [],
    homeworkId: props.topicDetails.homeworkId,
    homeworkTopicDesc: '',
    homeworkTopicId: props.topicDetails.homeworkTopicId,
    homeworkTopicTitle: props.topicDetails.homeworkTopicTitle,
    content: '',
    state: props.topicDetails.state,
    teacherId: props.topicDetails.teacherId,
    teacherName: props.topicDetails.teacherName,
  });
  // 提交作业
  const submit = async (state) => {
    const stateStr = state === 1 ? '草稿' : '作业';
    const submitData: any = {
      attachmentList: detail.attachmentList,
      content: detail.content,
      homeworkId: detail.homeworkId,
      homeworkTopicId: detail.homeworkTopicId,
    };
    const now = dayjs();
    console.log(`提交${stateStr}数据:`, detail);
    // 判断作业是否未开始或者已截止
    if (now.isBefore(props.topicDetails.homeStartTime) && state === 2) {
      message.error('作业未开始，不能提交，可以先保存为草稿');
      return;
    } else if (now.isAfter(props.topicDetails.homeEndTime) && state === 2) {
      message.error('作业已截止，不能提交，可以先保存为草稿，再联系老师延长截止时间');
      return;
    } else if (!submitData.content && submitData.attachmentList.length === 0) {
      // 检测是否有内容或附件, 没有则提示提交内容不能为空
      message.error(`${stateStr}内容不能全为空`);
      return;
    }
    // 处理附件list
    submitData.attachmentList = submitData.attachmentList.map((item) => {
      return {
        fileName: item.fileName,
        fileSize: item.size,
        fileUrl: item.staticUrl,
      };
    });
    const fn = state === 1 ? saveDraftHomeworkApi : commitHomeworkApi;
    await fn(submitData)
      .then((res) => {
        console.log(`提交${stateStr}:`, res);
        message.success(`提交${stateStr}成功`);
        // 等待0.5秒, 关闭Drawer, 通知父组件刷新列表
        setTimeout(() => {
          emit('closeDrawer');
        }, 500);
      })
      .catch((err) => {
        message.error(`提交${stateStr}失败`);
        console.log(`提交${stateStr}失败:`, err);
      });
  };
  const updateFileList = (fileList) => {
    detail.attachmentList = fileList;
  };
  // 获取作业详情
  const getHomeworkDetail = async () => {
    if (newHomework.value) return;
    spinning.value = true;
    await getHomeworkDetailApi(props.topicDetails.homeworkId)
      .then((res) => {
        const stateStr = res.state === 1 ? '草稿' : '作业';
        console.log(`学生获取${stateStr}详情成功:`, res);
        res.attachmentList.forEach((item) => {
          item.fileSize = `附件大小：${getFileSize(item.fileSize)}`;
          item.fileSuffix = getFileType(item.fileName);
          item.isImg = isImg(item.fileName);
        });
        detail = Object.assign(detail, res);
        //  获取完草稿详情后再更新草稿状态
        isADraft.value = detail.state === 1;
      })
      .catch((err) => {
        console.log('作业详情:', err);
      })
      .finally(() => {
        spinning.value = false;
      });
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
