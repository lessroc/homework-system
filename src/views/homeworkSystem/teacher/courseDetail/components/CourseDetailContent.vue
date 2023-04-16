<template>
  <br />
  <Card
    style="width: 100%"
    :tab-list="tabListNoTitle"
    :active-tab-key="noTitleKey"
    @tab-change="(key) => onTabChange(key)"
  >
    <p v-if="noTitleKey === '作业列表'">
      <!-- 组件缓存 -->
      <HomeworkList :courseDetail="courseDetail" />
    </p>
    <p v-else-if="noTitleKey === '发布作业'">
      <HomeworkPublish />
    </p>
  </Card>
</template>
<script lang="ts" setup>
  import { Card } from 'ant-design-vue';
  import { ref } from 'vue';
  import HomeworkList from './HomeworkList.vue';
  import HomeworkPublish from './HomeworkPublish.vue';
  const props = defineProps<{
    courseDetail: any;
  }>();
  console.log('课程内容页面:', props.courseDetail);
  const tabListNoTitle = [
    {
      key: '作业列表',
      tab: '作业列表',
    },
    {
      key: '发布作业',
      tab: '发布作业',
    },
  ];
  const noTitleKey = ref('作业列表');

  const onTabChange = (value: string) => {
    console.log(value);
    noTitleKey.value = value;
  };
</script>
