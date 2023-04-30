<template>
  <PageWrapper title="答卷列表">
    <Table
      :columns="columns"
      :data-source="answerSheetList.list"
      :pagination="paginationProps"
      :loading="loading"
    >
      <template #bodyCell="{ text, record, column }">
        <template v-if="column.dataIndex === 'operation'">
          <a @click="showDrawer(record)">{{ text }}</a>
        </template>
      </template>
    </Table>
    <Drawer
      v-model:visible="visible"
      size="large"
      class="custom-class"
      title="答卷详情"
      placement="right"
      @after-visible-change="afterVisibleChange"
    >
      <Detail
        v-if="homeworkId"
        @close-drawer="closeDrawer"
        :homeworkId="homeworkId"
        :score="score"
        :isCorrected="isCorrected"
      />
    </Drawer>
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { PageWrapper } from '/@/components/Page';
  import { useRoute } from 'vue-router';
  import { getHomeworkAnswerSheetListApi } from '/@/views/homeworkSystem/api/teacher';
  import { onBeforeMount, reactive, ref } from 'vue';
  import { Table, Drawer } from 'ant-design-vue';
  import dayjs from 'dayjs';
  import Detail from './Detail.vue';
  const route = useRoute();
  const homeworkTopicId = route.params?.id ?? -1;
  const visible = ref<boolean>(false);
  const homeworkId = ref<number>(0);
  const score = ref<string>('');
  const isCorrected = ref<string>('');
  const loading = ref<boolean>(false);

  const closeDrawer = () => {
    console.log('子组件关闭');
    visible.value = false;
    homeworkId.value = 0;
    score.value = '';
    // 重新获取列表
    getAnswerSheetList();
  };

  const afterVisibleChange = (bool: boolean) => {
    console.log('visible', bool);
    if (!bool) {
      homeworkId.value = 0;
      score.value = '';
    }
  };

  const showDrawer = (record) => {
    console.log('record', record);
    homeworkId.value = record.homeworkId;
    score.value = record.score;
    isCorrected.value = record.isCorrected;
    visible.value = true;
  };

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
    {
      title: '状态',
      dataIndex: 'isCorrected',
    },
    {
      title: '操作',
      dataIndex: 'operation',
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
    loading.value = true;
    await getHomeworkAnswerSheetListApi({
      homeworkTopicId: Number(homeworkTopicId),
      pageNum: answerSheetList.pageNum,
      pageSize: answerSheetList.pageSize,
    })
      .then((res) => {
        console.log('获取作业答卷列表成功:', res);
        res.list = res.list.map((item: any) => {
          item.operation = '查看';
          item.isCorrected = item.isCorrected ? '已批改' : '待批改';
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
      })
      .finally(() => {
        loading.value = false;
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
