<template>
  <Card
    hoverable
    :style="{ cursor: `${isAll ? 'default' : 'pointer'}` }"
    @click="toCourseDetail(cardInfo.courseId)"
  >
    <template #cover>
      <img class="coverImg" alt="example" :src="cardInfo.coverUrl" />
    </template>
    <CardMeta :title="cardInfo.courseName" :description="`教师：${cardInfo.teacherName}`" />
    <template #actions>
      <Tooltip color="blue" title="加入课程" @click="joinCourse" v-if="isAll">
        <PlusCircleOutlined />
      </Tooltip>
      <Tooltip color="volcano" title="退出课程" @click="quitCourse" v-else>
        <MinusCircleOutlined />
      </Tooltip>
    </template>
  </Card>
</template>
<script setup lang="ts">
  import { Card, CardMeta, message, Tooltip } from 'ant-design-vue';
  import { PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons-vue';
  import { joinCourseApi, leaveCourseApi } from '/@/views/homeworkSystem/api/student';
  import { useUserStore } from '/@/store/modules/user';
  import { useGo } from '/@/hooks/web/usePage';
  const go = useGo();

  /**
   * 打开课程作业列表页
   */
  const toCourseDetail = (courseId) => {
    if (props.isAll) return;
    go('/student/course-detail/' + courseId);
  };
  const userStore = useUserStore();
  const props = defineProps<{ cardInfo: any; isAll: boolean }>();
  const joinCourse = async () => {
    console.log('加入课程');
    await joinCourseApi({
      courseId: props.cardInfo.courseId,
      studentId: userStore.getUserInfo?.userId,
    })
      .then((res) => {
        console.log('加入课程成功:', res);
        message.success('加入课程成功');
      })
      .catch((err) => {
        console.log('加入课程失败:', err);
        message.error('加入课程失败');
      });
  };
  const quitCourse = async () => {
    console.log('退出课程');
    await leaveCourseApi({
      courseId: props.cardInfo.courseId,
      studentId: userStore.getUserInfo?.userId,
    })
      .then((res) => {
        console.log('退出课程成功:', res);
        message.success('退出课程成功');
        // 刷新页面
        window.location.reload();
      })
      .catch((err) => {
        console.log('退出课程失败:', err);
        message.error('退出课程失败');
      });
  };
</script>
<style lang="less" scoped>
  .coverImg {
    height: calc(100vh / 4);
    width: 100%;
    object-fit: cover;
  }
</style>
