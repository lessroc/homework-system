<template>
  <Table
    :columns="columns"
    :data-source="homeworkList.list"
    v-if="homeworkList.total > 0"
    :pagination="paginationProps"
  >
    <template #bodyCell="{ text, record, column }">
      <template v-if="column.dataIndex === 'operation'">
        <a @click="toHomeworkDetail(record)">{{ text }}</a>
      </template>
    </template>
  </Table>
  <Empty v-else />
</template>
<script lang="ts" setup>
  import { Table, Empty } from 'ant-design-vue';
  import { getHomeworkTopicListApi } from '/@/views/homeworkSystem/api/teacher';
  import { onBeforeMount, reactive } from 'vue';
  import dayjs from 'dayjs';
  const props = defineProps<{ courseId: number }>();
  import { useGo } from '/@/hooks/web/usePage';
  const go = useGo();
  console.log('课程内容作业列表页面课程ID:', props.courseId);

  /**
   * 打开课程作业列表页
   */
  const toHomeworkDetail = (record) => {
    go('/teacher/homework-list/' + record.homeworkTopicId);
  };

  const columns = [
    {
      title: '名称',
      dataIndex: 'homeworkTopicTitle',
    },
    {
      title: '描述',
      dataIndex: 'homeworkTopicDesc',
      ellipsis: true,
    },
    {
      title: '开始时间',
      dataIndex: 'startTime',
      width: 200,
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      width: 200,
    },
    {
      title: '操作',
      dataIndex: 'operation',
      width: 100,
    },
  ];

  let homeworkList = reactive({
    pageNum: 1,
    pageSize: 10,
    totalPage: 0,
    total: 0,
    list: [],
  });

  // 获取作业列表
  const getHomeworkList = async () => {
    await getHomeworkTopicListApi({
      courseId: props.courseId,
      pageNum: homeworkList.pageNum,
      pageSize: homeworkList.pageSize,
    })
      .then((res) => {
        console.log('获取作业列表成功:', res);
        res.list = res.list.map((item: any) => {
          item.operation = '查看';
          item.startTime = dayjs(item.startTime).format('YYYY-MM-DD HH:mm:ss');
          item.endTime = dayjs(item.endTime).format('YYYY-MM-DD HH:mm:ss');
          return item;
        });
        delete res.pageNum;
        homeworkList = Object.assign(homeworkList, res);
        // 设置分页
        paginationProps.current = homeworkList.pageNum;
        paginationProps.pageSize = homeworkList.pageSize;
        paginationProps.total = homeworkList.total;
      })
      .catch((err) => {
        console.log('获取作业列表失败:', err);
      });
  };

  onBeforeMount(() => {
    getHomeworkList();
  });

  const paginationProps = reactive({
    current: homeworkList.pageNum,
    pageSize: homeworkList.pageSize,
    total: homeworkList.total,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total: number) => `共 ${total} 条`,
    onChange: (page: number, pageSize: number) => {
      console.log('当前页:', page, '每页条数:', pageSize);
      homeworkList.pageNum = page;
      homeworkList.pageSize = pageSize;
      getHomeworkList();
    },
    onShowSizeChange: (current: number, size: number) => {
      console.log('当前页:', current, '每页条数:', size);
      homeworkList.pageNum = current;
      homeworkList.pageSize = size;
      getHomeworkList();
    },
  });
</script>
