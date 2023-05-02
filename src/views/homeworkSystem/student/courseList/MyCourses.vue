<template>
  <Spin :spinning="spinning">
    <div class="cardBox">
      <template v-for="(item, i) in list" :key="i">
        <CourseCard :cardInfo="item" :isAll="false" @refresh="getList" />
      </template>
    </div>
    <Pagination class="paginationComponent" @set-paging="setPaging" :get-paging="paging" />
  </Spin>
</template>
<script setup lang="ts">
  import CourseCard from '../components/CourseCard.vue';
  import Pagination from '../components/Pagination.vue';
  import { Spin } from 'ant-design-vue';
  import { onBeforeMount, reactive, ref } from 'vue';
  import { getStuCourseListApi } from '/@/views/homeworkSystem/api/student';
  import { useUserStore } from '/@/store/modules/user';
  const userStore = useUserStore();
  const spinning = ref<boolean>(false);
  let list = reactive([]);
  let paging = reactive({
    pageNum: 1,
    pageSize: 10,
    totalPage: 0,
    total: 0,
  });
  const getList = async () => {
    spinning.value = true;
    await getStuCourseListApi({
      pageNum: paging.pageNum,
      pageSize: paging.pageSize,
      studentId: userStore.getUserInfo?.userId,
    })
      .then((res) => {
        console.log('获取学生课程列表成功:', res);
        list.length = 0;
        list = Object.assign(list, res.list);
        const { pageNum, pageSize, totalPage, total } = res;
        const newPaging = { pageNum, pageSize, totalPage, total };
        paging = Object.assign(paging, newPaging);
      })
      .catch((err) => {
        console.log('获取学生课程列表失败:', err);
      })
      .finally(() => {
        spinning.value = false;
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
