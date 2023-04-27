<template>
  <PageWrapper>
    <DynamicInfo :loading="loading" class="enter-y" />
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import DynamicInfo from './components/DynamicInfo.vue';

  const loading = ref(true);

  setTimeout(() => {
    loading.value = false;
  }, 100);
</script>
