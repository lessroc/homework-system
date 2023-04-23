<template>
  <br />
  <Card
    style="width: 100%"
    :tab-list="tabListNoTitle"
    :active-tab-key="noTitleKey"
    @tab-change="(key) => onTabChange(key)"
  >
    <p v-if="noTitleKey === '作业列表'">
      <HomeworkList :courseId="props.courseDetail.courseId" @get-homework-data="setHomeworkData" />
    </p>
    <p v-else-if="noTitleKey === '发布作业'">
      <HomeworkPublish :courseId="props.courseDetail.courseId" :homeworkData="homeworkData" />
    </p>
    <p v-else-if="noTitleKey === '学生名单'">
      <StudentList :courseId="props.courseDetail.courseId" :joinCourseSuccess="joinCourseSuccess" />
    </p>
    <template #tabBarExtraContent>
      <a-input-search
        v-if="noTitleKey === '学生名单'"
        v-model:value="value"
        placeholder="请输入学生 ID"
        enter-button="加入课程"
        allowClear
        @search="onSearch"
      />
    </template>
  </Card>
</template>
<script lang="ts" setup>
  import { Card, message } from 'ant-design-vue';
  import { ref } from 'vue';
  import HomeworkList from './HomeworkList.vue';
  import HomeworkPublish from './HomeworkPublish.vue';
  import StudentList from './StudentList.vue';
  import { joinCourseApi } from '/@/views/homeworkSystem/api/student';
  const props = defineProps<{ courseDetail: any }>();
  console.log('课程内容页面:', props.courseDetail);
  const value = ref('');
  const joinCourseSuccess = ref(0);
  const homeworkData = ref({});
  const setHomeworkData = (data: any) => {
    noTitleKey.value = '发布作业';
    setTimeout(() => {
      homeworkData.value = data;
      console.log('homeworkData:', homeworkData.value);
    }, 200); // 等待切换到发布作业页面后再设置数据
  };
  const onSearch = async (studentId: string) => {
    console.log('搜索:', studentId);
    if (studentId === '') {
      message.error('请输入学生 ID');
      return;
    }
    await joinCourseApi({
      courseId: props.courseDetail.courseId,
      studentId: Number(studentId),
    })
      .then((res) => {
        console.log('加入课程成功:', res);
        joinCourseSuccess.value = new Date().getTime();
      })
      .catch((err) => {
        console.log('加入课程失败:', err);
        message.error('加入课程失败');
      });
  };
  const tabListNoTitle = [
    {
      key: '作业列表',
      tab: '作业列表',
    },
    {
      key: '发布作业',
      tab: '发布作业',
    },
    {
      key: '学生名单',
      tab: '学生名单',
    },
  ];
  const noTitleKey = ref('作业列表');

  const onTabChange = (value: string) => {
    console.log(value);
    noTitleKey.value = value;
  };
</script>
