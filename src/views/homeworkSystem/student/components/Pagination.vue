<template>
  <div>
    <Pagination
      show-quick-jumper
      :total="paging.total"
      @change="onChange"
      v-model:current="paging.pageNum"
      @show-size-change="onShowSizeChange"
    />
  </div>
</template>
<script lang="ts" setup>
  import { Pagination } from 'ant-design-vue';
  import { reactive } from 'vue';
  interface Paging {
    pageNum: number;
    pageSize: number;
    totalPage: number;
    total: number;
  }
  const props = defineProps<{ getPaging: Paging }>();
  const emit = defineEmits(['setPaging']);
  let paging = reactive<Paging>(props.getPaging);
  const onChange = () => {
    console.log('页码变更:', paging.pageNum);
    emit('setPaging', paging);
  };
  const onShowSizeChange = (pageNum: number, pageSize: number) => {
    console.log('页条数变更:', pageNum, pageSize);
    paging.pageNum = pageNum;
    paging.pageSize = pageSize;
    emit('setPaging', paging);
  };
</script>
