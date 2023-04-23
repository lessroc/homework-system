<template>
  <br />
  <Table
    :columns="columns"
    :data-source="answerSheetList.list"
    v-if="answerSheetList.total > 0"
    :pagination="paginationProps"
  >
    <template #bodyCell="{ text, record, column }">
      <template v-if="column.dataIndex === 'operation'">
        <a @click="showDrawer(record)">{{ text }}</a>
      </template>
    </template>
  </Table>
  <Empty v-else />
  <Drawer
    v-model:visible="visible"
    size="large"
    class="custom-class"
    title="作业详情"
    placement="right"
    @after-visible-change="afterVisibleChange"
  >
    <Detail v-if="visible" @close-drawer="closeDrawer" :topicDetails="topicDetails" />
  </Drawer>
</template>
<script lang="ts" setup>
  import { onBeforeMount, reactive, ref } from 'vue';
  import { Table, Empty, Drawer } from 'ant-design-vue';
  import dayjs from 'dayjs';
  import Detail from './Detail.vue';
  import { getStudentHomeworkListApi } from '/@/views/homeworkSystem/api/student';
  const visible = ref<boolean>(false);
  const homeworkId = ref<number>(0);
  const props = defineProps<{ courseId }>();
  console.log('学生进入作业列表的课程ID:', props.courseId);
  let topicDetails = reactive({});

  const closeDrawer = () => {
    console.log('子组件关闭');
    visible.value = false;
    homeworkId.value = 0;
    // 重新获取列表
    getAnswerSheetList();
  };

  const afterVisibleChange = (bool: boolean) => {
    console.log('抽屉状态:', bool);
    if (!bool) {
      homeworkId.value = 0;
    }
  };

  const showDrawer = (record) => {
    console.log('作业题目详情:', record);
    homeworkId.value = record.homeworkId || 0;
    topicDetails = Object.assign(topicDetails, record);
    visible.value = true;
  };

  const columns = [
    {
      title: '作业名称',
      dataIndex: 'homeworkTopicTitle',
    },
    {
      title: '创建人',
      dataIndex: 'teacherName',
      width: 100,
    },
    {
      title: '开始时间',
      dataIndex: 'homeStartTime',
      width: 200,
    },
    {
      title: '截止时间',
      dataIndex: 'homeEndTime',
      width: 200,
    },
    {
      title: '状态',
      dataIndex: 'comprehensiveStatus',
      width: 100,
    },
    {
      title: '操作',
      dataIndex: 'operation',
      width: 100,
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
    await getStudentHomeworkListApi({
      courseId: Number(props.courseId),
      pageNum: answerSheetList.pageNum,
      pageSize: answerSheetList.pageSize,
    })
      .then((res) => {
        console.log('获取我的作业答卷列表成功:', res);
        res.list = res.list.map((item: any) => {
          item.operation = '查看';
          item.homeStartTime = dayjs(item.homeStartTime).format('YYYY-MM-DD HH:mm:ss');
          item.homeEndTime = dayjs(item.homeEndTime).format('YYYY-MM-DD HH:mm:ss');
          item.comprehensiveStatus = getHomeworkState(item);
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

  /**
   * 根据作业属性计算作业综合状态
   */
  const getHomeworkState = (item) => {
    const now = dayjs();
    const startTime = dayjs(item.homeStartTime);
    const endTime = dayjs(item.homeEndTime);
    if (item.state === 1) {
      return '草稿';
    } else if (now.isBefore(startTime)) {
      return '未开始';
    } else if (!item.homeworkId) {
      return '未提交';
    } else if (item.score) {
      if (!isNaN(item.score)) return item.score + ' 分'; // 如果是数字,则拼接得了多少分
      return item.score; // 已批改,直接显示
    } else if (item.state === 2) {
      return '待批阅'; // 已提交,未批改
    } else if (now.isAfter(endTime)) {
      return '已结束';
    }
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
