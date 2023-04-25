<template>
  <Table
    :columns="columns"
    :data-source="allCoursesList.list"
    :pagination="paginationProps"
    :scroll="{ y: 'calc(100vh - 200px)' }"
    :loading="loading"
  >
    <template #bodyCell="{ record, column }">
      <template v-if="column.dataIndex === 'coverUrl'">
        <img :src="record.coverUrl" class="coverImg" alt="" />
      </template>
      <template v-if="column.dataIndex === 'operation'">
        <Space>
          <Button type="link" @click="editCourse(record)">编辑课程</Button>
          <Popconfirm title="确定删除该课程？" @confirm="deleteCourse(record.courseId)">
            <Button type="link">删除课程</Button>
          </Popconfirm>
        </Space>
      </template>
    </template>
  </Table>
</template>
<script lang="ts" setup>
  import { Table, Button, Popconfirm, Space } from 'ant-design-vue';
  import { onBeforeMount, reactive, ref } from 'vue';
  import { getAllCourseListApi } from '/@/views/homeworkSystem/api/student';
  import { deleteCourseApi } from '/@/views/homeworkSystem/api/teacher';
  const loading = ref<boolean>(false);
  const columns = [
    {
      title: '课程 ID',
      dataIndex: 'courseId',
      align: 'center',
      width: 150,
    },
    {
      title: '课程封面',
      dataIndex: 'coverUrl',
      align: 'center',
      width: 232,
    },
    {
      title: '课程名称',
      dataIndex: 'courseName',
      width: 150,
    },
    {
      title: '课程描述',
      dataIndex: 'courseDesc',
    },
    {
      title: '教师 ID',
      dataIndex: 'teacherId',
      align: 'center',
      width: 150,
    },
    {
      title: '教师名称',
      dataIndex: 'teacherName',
      align: 'center',
      width: 150,
    },
    {
      title: '操作',
      dataIndex: 'operation',
      align: 'center',
      width: 300,
    },
  ];

  const deleteCourse = (courseId) => {
    console.log('删除课程Id:', courseId);
    deleteCourseApi({ courseId })
      .then((res) => {
        console.log('删除课程成功:', res);
        getAllCoursesList();
      })
      .catch((err) => {
        console.log('删除课程失败:', err);
      });
  };

  let allCoursesList = reactive({
    pageNum: 1,
    pageSize: 10,
    totalPage: 0,
    total: 0,
    list: [],
  });

  onBeforeMount(() => {
    getAllCoursesList();
  });

  const getAllCoursesList = async () => {
    loading.value = true;
    await getAllCourseListApi({
      pageNum: allCoursesList.pageNum,
      pageSize: allCoursesList.pageSize,
    })
      .then((res) => {
        console.log('获取所有课程列表成功:', res);
        allCoursesList = Object.assign(allCoursesList, res);
      })
      .catch((err) => {
        console.log('获取所有课程列表失败:', err);
      })
      .finally(() => {
        loading.value = false;
      });
  };

  const paginationProps = reactive({
    current: allCoursesList.pageNum,
    pageSize: allCoursesList.pageSize,
    total: allCoursesList.total,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total: number) => `共 ${total} 条`,
    onChange: (page: number, pageSize: number) => {
      console.log('当前页:', page, '每页条数:', pageSize);
      allCoursesList.pageNum = page;
      allCoursesList.pageSize = pageSize;
      getAllCoursesList();
    },
    onShowSizeChange: (current: number, size: number) => {
      console.log('当前页:', current, '每页条数:', size);
      allCoursesList.pageNum = current;
      allCoursesList.pageSize = size;
      getAllCoursesList();
    },
  });
</script>
<style lang="less" scoped>
  .coverImg {
    width: 200px;
    height: 133px;
    object-fit: contain;
    border-radius: 4px;
  }
</style>
