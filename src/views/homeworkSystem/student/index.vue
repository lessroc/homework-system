<template>
  <PageWrapper>
    <Card
      class="courseContainer"
      :tab-list="tabList"
      :active-tab-key="tabKey"
      @tab-change="(key) => onTabChange(key)"
    >
      <div v-if="tabKey === '我的课程'" class="courseListLayout"><MyCourses /></div>
      <div v-else-if="tabKey === '全部课程'" class="courseListLayout">
        <AllCourses :searchKeyword="searchKeyword" />
      </div>
      <template #tabBarExtraContent>
        <a-input-search
          v-if="tabKey === '全部课程'"
          v-model:value="value"
          placeholder="模糊搜索课程名称"
          enter-button
          allowClear
          @search="onSearch"
        />
      </template>
    </Card>
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { PageWrapper } from '/@/components/Page';
  import { Card } from 'ant-design-vue';
  import MyCourses from './courseList/MyCourses.vue';
  import AllCourses from './courseList/AllCourses.vue';
  import { reactive, ref } from 'vue';
  const tabList = [
    {
      key: '我的课程',
      tab: '我的课程',
    },
    {
      key: '全部课程',
      tab: '全部课程',
    },
  ];
  const tabKey = ref('我的课程');

  const onTabChange = (value: string) => {
    tabKey.value = value;
    console.log('切换标签:', value);
  };
  const value = ref('');
  const searchKeyword = reactive({
    keyword: '',
    t: new Date().getTime(),
  });
  const onSearch = (keyword: string) => {
    console.log('搜索:', keyword);
    keyword = keyword.trim();
    searchKeyword.keyword = keyword;
    searchKeyword.t = new Date().getTime();
  };
</script>
<style lang="less" scoped>
  .courseContainer {
    height: calc(100vh - 80px - 32px);
    overflow: hidden;

    & > :deep(.ant-card-head) {
      height: 57px;
    }

    & > :deep(.ant-card-body) {
      height: calc(100% - 57px);
      overflow: hidden;
      padding: 0;

      .courseListLayout {
        height: 100%;
        overflow: hidden;

        .cardBox {
          // 网格布局
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          grid-gap: 16px;
          padding: 16px;
          height: calc(100% - 64px);
          overflow-y: auto;

          .ant-card {
            height: fit-content;

            .ant-card-body {
              padding: 16px;

              .ant-card-meta-description {
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
              }
            }

            .ant-card-actions {
              & > li {
                margin: 0;

                .anticon-minus-circle,
                .anticon-plus-circle {
                  padding: 12px 0;
                }
              }
            }
          }
        }

        .paginationComponent {
          // 占满一行
          grid-column: 1 / -1;
          text-align: right;
          padding: 16px;
        }
      }
    }
  }
</style>
