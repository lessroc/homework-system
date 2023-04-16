<template>
  <Table :columns="columns" :data-source="data" v-if="homeworkList.total > 0">
    <template #bodyCell="{ column, text }">
      <template v-if="column.dataIndex === 'name'">
        <a>{{ text }}</a>
      </template>
    </template>
  </Table>
  <Empty v-else />
</template>
<script lang="ts" setup>
  import { Table, Empty } from 'ant-design-vue';
  import { getHomeworkListApi } from '/@/views/homeworkSystem/api/teacher';
  import { onBeforeMount, reactive } from 'vue';
  const props = defineProps<{
    courseDetail: any;
  }>();
  console.log('课程内容作业列表页面:', props.courseDetail);
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
      width: 80,
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address 1',
      ellipsis: true,
    },
    {
      title: 'Long Column Long Column Long Column',
      dataIndex: 'address',
      key: 'address 2',
      ellipsis: true,
    },
    {
      title: 'Long Column Long Column',
      dataIndex: 'address',
      key: 'address 3',
      ellipsis: true,
    },
    {
      title: 'Long Column',
      dataIndex: 'address',
      key: 'address 4',
      ellipsis: true,
    },
  ];

  const data = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park, New York No. 1 Lake Park',
      tags: ['nice', 'developer'],
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 2 Lake Park, London No. 2 Lake Park',
      tags: ['loser'],
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park, Sidney No. 1 Lake Park',
      tags: ['cool', 'teacher'],
    },
  ];

  let homeworkList = reactive({
    pageNum: 0,
    pageSize: 3,
    totalPage: 0,
    total: 0,
    list: [],
  });

  // 获取作业列表
  const getHomeworkList = async () => {
    await getHomeworkListApi({
      homeworkTopicId: 27,
      pageNum: 1,
      pageSize: 3,
    })
      .then((res) => {
        console.log('获取作业列表成功:', res);
        homeworkList = Object.assign(homeworkList, res);
      })
      .catch((err) => {
        console.log('获取作业列表失败:', err);
      });
  };

  onBeforeMount(() => {
    getHomeworkList();
  });
</script>
