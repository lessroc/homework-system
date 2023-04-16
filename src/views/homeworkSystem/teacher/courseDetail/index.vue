<template>
  <PageWrapper>
    <Card hoverable v-if="courseDetail.courseName" :style="{ cursor: 'default' }">
      <template #cover>
        <img alt="example" :src="courseDetail.coverUrl" class="coverUrl" />
      </template>
      <CardMeta :title="courseDetail.courseName">
        <template #description>{{ courseDetail.courseDesc }}</template>
      </CardMeta>
      <CourseDetailContent :courseDetail="courseDetail" />
    </Card>
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { Card, CardMeta } from 'ant-design-vue';
  import { onBeforeMount, ref } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { getCourseDetailApi } from '/@/views/homeworkSystem/api/teacher';
  import CourseDetailContent from './components/CourseDetailContent.vue';
  import { useGlobSetting } from '/@/hooks/setting';
  import { useRoute } from 'vue-router';
  const globSetting = useGlobSetting();
  const basisUrl = globSetting.jobSys;
  const route = useRoute();
  const courseId = route.params?.id ?? -1;
  const getCourseDetail = async () => {
    await getCourseDetailApi({ courseId: Number(courseId) }).then((res) => {
      console.log('获取课程详情成功:', res);
      res.coverUrl = res.coverUrl.replace('https://frp-any.top:32028', basisUrl);
      courseDetail.value = res;
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
