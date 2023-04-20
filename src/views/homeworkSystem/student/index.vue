<template>
  <PageWrapper>
    <Card
      class="courseContainer"
      :tab-list="tabListNoTitle"
      :active-tab-key="noTitleKey"
      @tab-change="(key) => onTabChange(key)"
    >
      <div v-if="noTitleKey === '我的课程'" class="courseListLayout"><MyCourses /></div>
      <div v-else-if="noTitleKey === '全部课程'" class="courseListLayout">
        <AllCourses :searchResult="searchResult" />
      </div>
      <template #tabBarExtraContent v-if="noTitleKey === '全部课程'">
        <a-input-search
          v-model:value="value"
          placeholder="模糊搜索课程名称"
          enter-button
          @search="onSearch"
        />
      </template>
    </Card>
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { PageWrapper } from '/@/components/Page';
  import { Card, message } from 'ant-design-vue';
  import MyCourses from './courseList/MyCourses.vue';
  import AllCourses from './courseList/AllCourses.vue';
  import { ref } from 'vue';
  import { searchCourseApi } from '/@/views/homeworkSystem/api/student';
  const tabListNoTitle = [
    {
      key: '我的课程',
      tab: '我的课程',
    },
    {
      key: '全部课程',
      tab: '全部课程',
    },
  ];
  const noTitleKey = ref('全部课程');

  const onTabChange = (value: string) => {
    noTitleKey.value = value;
  };
  const value = ref('');
  const searchResult = ref([]);
  const onSearch = (keyword: string) => {
    console.log('搜索:', keyword);
    keyword = keyword.trim();
    if (keyword === '') {
      message.error('搜索内容不能为空');
      return;
    }
    // TODO: 搜索
    searchCourseApi({ keyword })
      .then((res) => {
        console.log('搜索成功:', res);
        searchResult.value = res;
      })
      .catch((err) => {
        console.log('搜索失败:', err);
      });
  };
</script>
<style lang="less" scoped>
  .courseContainer {
    height: calc(100vh - 80px - 32px);
    overflow-y: scroll;

    & > :deep(.ant-card-body) {
      height: calc(100% - 56.8px);
      overflow-y: scroll;
      padding: 0;

      .courseListLayout {
        // 网格布局
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        grid-gap: 16px;
        padding: 16px;

        .ant-card {
          overflow: hidden;

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

              .anticon-plus-circle {
                padding: 12px 0;
              }
            }
          }
        }

        .paginationComponent {
          // 占满一行
          grid-column: 1 / -1;
          text-align: right;
        }
      }
    }
  }
</style>
