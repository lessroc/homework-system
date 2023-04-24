<template>
  <PageWrapper>
    <Spin :spinning="spinning">
      <Card hoverable :style="{ cursor: 'default' }">
        <!--<template #cover>
          <img alt="example" :src="courseDetail.coverUrl" class="coverUrl" />
        </template>-->
        <CardMeta :title="courseDetail.courseName">
          <template #description>{{ courseDetail.courseDesc }}</template>
        </CardMeta>
        <HomeworkList :courseId="courseId" />
      </Card>
    </Spin>
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { Spin, Card, CardMeta, message } from 'ant-design-vue';
  import { onBeforeMount, ref } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { getCourseDetailApi } from '/@/views/homeworkSystem/api/teacher';
  import { useRoute } from 'vue-router';
  import HomeworkList from '../homeworkList/index.vue';
  const spinning = ref(false);
  const route = useRoute();
  const courseId = route.params?.id ?? -1;
  const getCourseDetail = async () => {
    spinning.value = true;
    await getCourseDetailApi({ courseId: Number(courseId) })
      .then((res) => {
        console.log('获取课程详情成功:', res);
        courseDetail.value = res;
      })
      .catch((err) => {
        console.log('获取课程详情失败:', err);
        message.error('获取课程详情失败');
      })
      .finally(() => {
        spinning.value = false;
      });
  };

  onBeforeMount(() => {
    getCourseDetail();
  });

  const courseDetail = ref({});
</script>

<style lang="less" scoped>
  .coverUrl {
    width: 500px;
    height: 400px;
    margin: 0 auto;
  }
</style>
