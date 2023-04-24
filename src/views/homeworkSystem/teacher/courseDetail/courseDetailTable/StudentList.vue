<template>
  <Table
    :columns="columns"
    :data-source="studentList.list"
    :pagination="paginationProps"
    :loading="loading"
  >
    <template #bodyCell="{ text, record, column }">
      <template v-if="column.dataIndex === 'operation'">
        <Popconfirm
          placement="topRight"
          ok-text="确定"
          cancel-text="取消"
          @confirm="removeStudent(record.studentId)"
        >
          <template #title>
            <p>确定将该学生移出课程吗？</p>
          </template>
          <Button type="primary">{{ text }}</Button>
        </Popconfirm>
      </template>
    </template>
  </Table>
</template>
<script lang="ts" setup>
  import { Table, Popconfirm, Button, message } from 'ant-design-vue';
  import { getCourseStudentListApi } from '/@/views/homeworkSystem/api/teacher';
  import { onBeforeMount, reactive, ref, watch } from 'vue';
  import { leaveCourseApi } from '/@/views/homeworkSystem/api/student';
  const loading = ref(false);
  const props = defineProps<{ courseId: number; joinCourseSuccess: number }>();
  console.log('课程ID:', props.courseId);

  // 监听父组件传来的刷新页面事件
  watch(
    () => props.joinCourseSuccess,
    (newVal) => {
      console.log('加入课程成功刷新页面:', newVal);
      getStudentList();
    },
  );

  const columns = [
    {
      title: '学生 ID',
      dataIndex: 'studentId',
      align: 'center',
    },
    {
      title: '学生姓名',
      dataIndex: 'studentName',
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      align: 'center',
    },
  ];

  let studentList = reactive({
    pageNum: 1,
    pageSize: 10,
    totalPage: 0,
    total: 0,
    list: [],
  });

  // 移除学生
  const removeStudent = async (studentId: number) => {
    console.log('移除学生:', studentId);
    await leaveCourseApi({
      courseId: props.courseId,
      studentId: studentId,
    })
      .then((res) => {
        console.log('移除学生成功:', res);
        message.success('移除学生成功');
        getStudentList();
      })
      .catch((err) => {
        console.log('移除学生失败:', err);
        message.error('移除学生失败');
      });
  };

  // 获取课程学生名单列表
  const getStudentList = async () => {
    loading.value = true;
    await getCourseStudentListApi({
      courseId: props.courseId,
      pageNum: studentList.pageNum,
      pageSize: studentList.pageSize,
    })
      .then((res) => {
        console.log('获取作业列表成功:', res);
        res.list = res.list.map((item: any) => {
          item.operation = '移除';
          return item;
        });
        console.log('res:', res);
        delete res.pageNum;
        studentList = Object.assign(studentList, res);
        // 设置分页
        paginationProps.current = studentList.pageNum;
        paginationProps.pageSize = studentList.pageSize;
        paginationProps.total = studentList.total;
      })
      .catch((err) => {
        console.log('获取作业列表失败:', err);
      })
      .finally(() => {
        loading.value = false;
      });
  };

  onBeforeMount(() => {
    getStudentList();
  });

  const paginationProps = reactive({
    current: studentList.pageNum,
    pageSize: studentList.pageSize,
    total: studentList.total,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total: number) => `共 ${total} 条`,
    onChange: (page: number, pageSize: number) => {
      console.log('当前页:', page, '每页条数:', pageSize);
      studentList.pageNum = page;
      studentList.pageSize = pageSize;
      getStudentList();
    },
    onShowSizeChange: (current: number, size: number) => {
      console.log('当前页:', current, '每页条数:', size);
      studentList.pageNum = current;
      studentList.pageSize = size;
      getStudentList();
    },
  });
</script>
