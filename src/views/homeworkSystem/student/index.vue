<template>
  <PageWrapper>
    <Card
      style="width: 100%"
      :tab-list="tabListNoTitle"
      :active-tab-key="noTitleKey"
      @tab-change="(key) => onTabChange(key)"
    >
      <p v-if="noTitleKey === '我的课程'">article content</p>
      <p v-else-if="noTitleKey === '全部课程'">app content</p>
      <p v-else>project content</p>
      <template #tabBarExtraContent>
        <a href="#">More</a>
      </template>
    </Card>
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { PageWrapper } from '/@/components/Page';
  import { Card } from 'ant-design-vue';
  import { ref } from 'vue';
  const tabListNoTitle = [
    {
      key: '我的课程',
      tab: '我的课程',
    },
    {
      key: '全部课程',
      tab: '全部课程',
    },
  ];
  const noTitleKey = ref('全部课程');

  const onTabChange = (value: string) => {
    noTitleKey.value = value;
  };
</script>
