<template>
  <Card hoverable style="cursor: default">
    <template #cover>
      <!--<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />-->
      <img
        style="height: calc(100vh / 4)"
        alt="example"
        src="http://342j6q8933.wicp.vip/static/1681150460000最伟大的作品-周杰伦.jpg"
      />
    </template>
    <CardMeta title="Europe Street beat" :description="`教师：${props.teacherName}`" />
    <template #actions>
      <Tooltip color="blue" title="加入课程">
        <PlusCircleOutlined />
      </Tooltip>
    </template>
  </Card>
</template>
<script setup lang="ts">
  import { Card, CardMeta, Tooltip } from 'ant-design-vue';
  import { PlusCircleOutlined } from '@ant-design/icons-vue';
  const props = defineProps<{ teacherName: string }>();
</script>
