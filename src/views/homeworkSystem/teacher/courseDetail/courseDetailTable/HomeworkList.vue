<template>
  <Table
    :columns="columns"
    :data-source="homeworkList.list"
    :pagination="paginationProps"
    :loading="loading"
  >
    <template #bodyCell="{ text, record, column }">
      <template v-if="column.dataIndex === 'operation'">
        <Space>
          <Button @click="toHomeworkDetail(record)">{{ text[0] }}</Button>
          <Button type="primary" @click="toEditHomework(record)">{{ text[1] }}</Button>
        </Space>
      </template>
    </template>
  </Table>
</template>
<script lang="ts" setup>
  import { Table, Button, Space } from 'ant-design-vue';
  import { getHomeworkTopicListApi } from '/@/views/homeworkSystem/api/teacher';
  import { onBeforeMount, reactive, ref } from 'vue';
  import dayjs from 'dayjs';
  const props = defineProps<{ courseId: number }>();
  const emit = defineEmits(['getHomeworkData']);
  const loading = ref(false);
  import { useGo } from '/@/hooks/web/usePage';
  const go = useGo();
  console.log('课程内容作业列表页面课程ID:', props.courseId);

  /**
   * 切换到发布作业tab
   */
  const toEditHomework = (record) => {
    console.log('编辑作业:', record);
    emit('getHomeworkData', record);
  };

  /**
   * 打开课程作业列表页
   */
  const toHomeworkDetail = (record) => {
    go('/dashboard/homework-list/' + record.homeworkTopicId);
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
      align: 'center',
    },
    {
      title: '结束时间',
      dataIndex: 'endTime',
      width: 200,
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      width: 250,
      align: 'center',
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
    loading.value = true;
    await getHomeworkTopicListApi({
      courseId: props.courseId,
      pageNum: homeworkList.pageNum,
      pageSize: homeworkList.pageSize,
    })
      .then((res) => {
        console.log('获取作业列表成功:', res);
        res.list = res.list.map((item: any) => {
          item.operation = ['查看答卷', '编辑作业'];
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
      })
      .finally(() => {
        loading.value = false;
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
