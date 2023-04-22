<template>
  <template v-if="list.length > 0">
    <div class="cardBox">
      <template v-for="(item, i) in list" :key="i">
        <CourseCard :cardInfo="item" :isAll="true" />
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
  import { onBeforeMount, reactive, watch } from 'vue';
  import { getAllCourseListApi, searchCourseApi } from '/@/views/homeworkSystem/api/student';
  const props = defineProps<{ searchKeyword }>();
  console.log('子组件接收到的keyword:', props.searchKeyword);
  let list = reactive([]);
  let paging = reactive({
    pageNum: 1,
    pageSize: 20,
    totalPage: 5,
    total: 100,
  });
  // 监听父组件传来的搜索结果
  watch(
    () => props.searchKeyword,
    (val) => {
      console.log('子组件监听到父组件传来的搜索结果:', val);
      paging.pageNum = 1;
      paging.pageSize = 20;
      if (val.keyword) {
        getSearchResult();
      } else {
        getList();
      }
    },
    {
      deep: true,
    },
  );
  const getSearchResult = async () => {
    await searchCourseApi({
      keyword: props.searchKeyword.keyword,
      pageNum: paging.pageNum,
      pageSize: paging.pageSize,
    })
      .then((res) => {
        console.log('获取搜索结果成功:', res);
        list.length = 0;
        list = Object.assign(list, res.list);
        const { pageNum, pageSize, totalPage, total } = res;
        const newPaging = { pageNum, pageSize, totalPage, total };
        paging = Object.assign(paging, newPaging);
      })
      .catch((err) => {
        console.log('获取搜索结果失败:', err);
      });
  };
  const getList = async () => {
    await getAllCourseListApi({
      pageNum: paging.pageNum,
      pageSize: paging.pageSize,
    })
      .then((res) => {
        console.log('获取所有课程列表成功:', res);
        list = Object.assign(list, res.list);
        const { pageNum, pageSize, totalPage, total } = res;
        const newPaging = { pageNum, pageSize, totalPage, total };
        paging = Object.assign(paging, newPaging);
      })
      .catch((err) => {
        console.log('获取所有课程列表失败:', err);
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
