<template>
  <template v-for="item in 20" :key="item">
    <CourseCard teacher-name="黄老师" :list="list" />
  </template>
  <Pagination class="paginationComponent" @set-paging="setPaging" :get-paging="paging" />
</template>
<script setup lang="ts">
  import CourseCard from '../components/CourseCard.vue';
  import Pagination from '../components/Pagination.vue';
  import { onBeforeMount, reactive } from 'vue';
  import { getAllCourseListApi } from '/@/views/homeworkSystem/api/student';
  const props = defineProps<{
    searchResult: any[];
  }>();
  console.log('子组件接收到的searchResult:', props.searchResult);
  let list = reactive([]);
  let paging = reactive({
    pageNum: 1,
    pageSize: 10,
    totalPage: 10,
    total: 100,
  });
  const getList = async () => {
    await getAllCourseListApi({
      pageNum: paging.pageNum,
      pageSize: paging.pageSize,
    })
      .then((res) => {
        console.log('获取课程列表成功:', res);
        list = Object.assign(list, res.list);
        delete res.list;
        paging = Object.assign(paging, res);
      })
      .catch((err) => {
        console.log('获取课程列表失败:', err);
      });
  };
  onBeforeMount(() => {
    getList();
  });
  const setPaging = (value) => {
    console.log('收到分页信息:', value);
    paging = Object.assign(paging, value);
    getList();
  };
</script>
