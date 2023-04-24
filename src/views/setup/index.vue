<template>
  <PageWrapper title="引导页" content="用于给用户的指引操作">
    <a-button type="primary" @click="handleStart">开始</a-button>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { PageWrapper } from '/@/components/Page';
  import { useDesign } from '/@/hooks/web/useDesign';
  import intro from 'intro.js';
  import 'intro.js/minified/introjs.min.css';

  export default defineComponent({
    components: { PageWrapper },
    setup() {
      const { prefixVar } = useDesign('');

      function handleStart() {
        intro()
          .setOptions({
            steps: [
              {
                title: '欢迎使用',
                intro: '东莞理工作业系统 👋',
              },
              {
                title: '折叠按钮',
                element: document.querySelector(`.${prefixVar}-layout-header-trigger`)!,
                intro: '这是菜单折叠按钮',
              },
              {
                title: '用户功能区',
                element: document.querySelector(`.${prefixVar}-layout-header-action`)!,
                intro: '你可以在这里进行用户相关的操作',
              },
            ],
          })
          .start();
      }
      return { handleStart };
    },
  });
</script>
