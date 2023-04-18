<template>
  <PageWrapper title="作业详情页面">
    <Table
      :columns="columns"
      :data-source="answerSheetList.list"
      v-if="answerSheetList.total > 0"
      :pagination="paginationProps"
    >
      <template #bodyCell="{ text, record, column }">
        <template v-if="column.dataIndex === 'operation'">
          <a @click="toHomeworkDetail(record)">{{ text }}</a>
        </template>
      </template>
    </Table>
    <Empty v-else />
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { PageWrapper } from '/@/components/Page';
  import { useRoute } from 'vue-router';
  import { getHomeworkAnswerSheetListApi } from '/@/views/homeworkSystem/api/teacher';
  import { onBeforeMount, reactive } from 'vue';
  import { Table, Empty } from 'ant-design-vue';
  import dayjs from 'dayjs';
  const route = useRoute();
  const homeworkId = route.params?.id ?? -1;

  const columns = [
    {
      title: '学生 ID',
      dataIndex: 'studentId',
    },
    {
      title: '学生姓名',
      dataIndex: 'studentName',
    },
    {
      title: '作业提交时间',
      dataIndex: 'commitTime',
    },
    {
      title: '分数',
      dataIndex: 'score',
    },
  ];

  let answerSheetList = reactive({
    pageNum: 1,
    pageSize: 10,
    totalPage: 0,
    total: 0,
    list: [],
  });

  // 获取作业答卷列表
  const getAnswerSheetList = async () => {
    await getHomeworkAnswerSheetListApi({
      homeworkTopicId: Number(homeworkId),
      pageNum: answerSheetList.pageNum,
      pageSize: answerSheetList.pageSize,
    })
      .then((res) => {
        console.log('获取作业答卷列表成功:', res);
        res.list = res.list.map((item: any) => {
          item.operation = '查看';
          item.commitTime = dayjs(item.commitTime).format('YYYY-MM-DD HH:mm:ss');
          return item;
        });
        delete res.pageNum;
        answerSheetList = Object.assign(answerSheetList, res);
        // 设置分页
        paginationProps.current = answerSheetList.pageNum;
        paginationProps.pageSize = answerSheetList.pageSize;
        paginationProps.total = answerSheetList.total;
      })
      .catch((err) => {
        console.log('获取作业列表失败:', err);
      });
  };

  onBeforeMount(() => {
    getAnswerSheetList();
  });

  const paginationProps = reactive({
    current: answerSheetList.pageNum,
    pageSize: answerSheetList.pageSize,
    total: answerSheetList.total,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total: number) => `共 ${total} 条`,
    onChange: (page: number, pageSize: number) => {
      console.log('当前页:', page, '每页条数:', pageSize);
      answerSheetList.pageNum = page;
      answerSheetList.pageSize = pageSize;
      getAnswerSheetList();
    },
    onShowSizeChange: (current: number, size: number) => {
      console.log('当前页:', current, '每页条数:', size);
      answerSheetList.pageNum = current;
      answerSheetList.pageSize = size;
      getAnswerSheetList();
    },
  });
</script>
