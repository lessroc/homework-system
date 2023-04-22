<template>
  <template v-if="list.length > 0">
    <div class="cardBox">
      <template v-for="(item, i) in list" :key="i">
        <CourseCard :cardInfo="item" :isAll="false" />
      </template>
    </div>
    <Pagination class="paginationComponent" @set-paging="setPaging" :get-paging="paging" />
  </template>
  <template v-else>
    <div class="noData">暂无数据</div>
  </template>
</template>
<script setup lang="ts">
  import CourseCard from '../components/CourseCard.vue';
  import Pagination from '../components/Pagination.vue';
  import { onBeforeMount, reactive } from 'vue';
  import { getStuCourseListApi } from '/@/views/homeworkSystem/api/student';
  import { useUserStore } from '/@/store/modules/user';
  const userStore = useUserStore();
  let list = reactive([]);
  let paging = reactive({
    pageNum: 1,
    pageSize: 20,
    totalPage: 5,
    total: 100,
  });
  const getList = async () => {
    await getStuCourseListApi({
      pageNum: paging.pageNum,
      pageSize: paging.pageSize,
      studentId: userStore.getUserInfo?.userId,
    })
      .then((res) => {
        console.log('获取学生课程列表成功:', res);
        list = Object.assign(list, res.list);
        const { pageNum, pageSize, totalPage, total } = res;
        const newPaging = { pageNum, pageSize, totalPage, total };
        paging = Object.assign(paging, newPaging);
      })
      .catch((err) => {
        console.log('获取学生课程列表失败:', err);
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
