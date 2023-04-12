<template>
  <Card title="课程列表" v-bind="$attrs">
    <template #extra>
      <Button type="link" size="small" @click="showCreateCourseModalBox">新建课程</Button>
    </template>
    <!--<List item-layout="horizontal" :data-source="dynamicInfoItems">
      <template #renderItem="{ item }">
        <ListItem>
          <ListItemMeta>
            <template #description>
              {{ item.date }}
            </template>
            &lt;!&ndash; eslint-disable-next-line &ndash;&gt;
            <template #title> {{ item.courseName }} <span v-html="item.courseDesc"> </span> </template>
            <template #avatar>
              <Icon :icon="item.avatar" :size="30" />
            </template>
          </ListItemMeta>
        </ListItem>
      </template>
    </List>-->
    <!--OR-->
    <List
      item-layout="vertical"
      size="large"
      :data-source="teacherCourseList.list"
      :loading="loading"
    >
      <template #footer>
        <Pagination
          class="paginationStyle"
          v-model:current="teacherCourseList.pageNum"
          show-quick-jumper
          :total="teacherCourseList.total"
          :defaultPageSize="teacherCourseList.pageSize"
          :hideOnSinglePage="true"
          @change="onChange"
        />
      </template>
      <template #renderItem="{ item }">
        <ListItem key="item.title">
          <template #actions>
            <a-button type="primary">编辑课程</a-button>
            <a-button type="primary">删除课程</a-button>
            <!--<span v-for="{ type, text } in actions" :key="type">
              <component :is="type" style="margin-right: 8px" />
              {{ text }}
            </span>-->
          </template>
          <template #extra>
            <img width="272" style="border-radius: 5px" alt="课程封面" :src="item.coverUrl" />
          </template>
          <ListItemMeta :description="item.courseDesc">
            <template #title>
              <a :href="item.href">{{ item.courseName }}</a>
            </template>
            <!--<template #avatar><Avatar :src="item.avatar" /></template>-->
          </ListItemMeta>
          {{ item.content }}
        </ListItem>
      </template>
    </List>
    <Modal v-model:visible="showCCMB" title="新建课程" centered @cancel="resetForm" @ok="onSubmit">
      <Form ref="formRef" :model="formState" :rules="rules" class="CCMBForm">
        <FormItem label="课程名称：" name="courseName">
          <Input v-model:value="formState.courseName" />
        </FormItem>
        <FormItem label="课程描述：" name="courseDesc">
          <Textarea v-model:value="formState.courseDesc" />
        </FormItem>
        <FormItem label="课程封面：" name="coverUrl">
          <UploadCourseCover @set-cover-url="setCoverUrl" />
        </FormItem>
      </Form>
    </Modal>
  </Card>
</template>
<script lang="ts" setup>
  import {
    Button,
    Card,
    List,
    Modal,
    Form,
    FormItem,
    Input,
    Textarea,
    Pagination,
  } from 'ant-design-vue';
  import { onBeforeMount, ref } from 'vue';
  // import { dynamicInfoItems } from './data';
  // import { Icon } from '/@/components/Icon';
  import { ValidateErrorEntity } from 'ant-design-vue/es/form/interface';
  import { reactive, toRaw, UnwrapRef } from 'vue';
  import { createCourseMethod } from '/@/views/homeworkSystem/utils/teacherMethods';
  import UploadCourseCover from '/@/views/homeworkSystem/teacher/components/UploadCourseCover.vue';
  import { useGlobSetting } from '/@/hooks/setting';
  import { getTeacherCourseListApi } from '/@/views/homeworkSystem/api/teacher';
  import { GetCourseListResultParams } from '/@/views/homeworkSystem/api/teacher/model';

  const ListItem = List.Item;
  const ListItemMeta = List.Item.Meta;

  onBeforeMount(() => {
    getTeacherCourseList(1);
  });

  let teacherCourseList: GetCourseListResultParams = reactive({
    pageNum: 1,
    pageSize: 3,
    total: 0,
    totalPage: 0,
    list: [],
  });

  import { useUserStore } from '/@/store/modules/user';
  const userStore = useUserStore();

  // 加载中
  let loading = ref<boolean>(false);

  // 获取指定页的课程列表
  function getTeacherCourseList(pageNum: number) {
    loading.value = true;
    getTeacherCourseListApi({
      pageNum,
      pageSize: 3,
      userId: userStore.getUserInfo?.userId,
    })
      .then((res) => {
        console.log('获取课程列表成功:', res);
        delete res.pageNum;
        teacherCourseList = Object.assign(teacherCourseList, res);
      })
      .catch((err) => {
        console.log('获取课程列表失败:', err);
      })
      .finally(() => {
        loading.value = false;
      });
  }

  const onChange = (pageNumber: number) => {
    console.log('Page: ', pageNumber);
    // 跳转到指定页
    getTeacherCourseList(pageNumber);
    teacherCourseList.pageNum = pageNumber;
  };

  // 显示新建课程模态框
  let showCCMB = ref<boolean>(false);

  function showCreateCourseModalBox() {
    console.log('showCreateCourseModalBox');
    showCCMB.value = true;
  }

  // 表单
  interface FormState {
    courseName: string;
    courseDesc: string;
    coverUrl: string;
  }
  const formRef = ref();
  const formState: UnwrapRef<FormState> = reactive({
    courseName: '',
    courseDesc: '',
    coverUrl: '',
  });
  const rules = {
    courseName: [
      { required: true, message: '请输入课程名称', trigger: 'blur' },
      { min: 2, max: 5, message: '长度应为 2 至 5', trigger: 'blur' },
    ],
    courseDesc: [{ required: true, message: '请输入课程描述', trigger: 'blur' }],
    coverUrl: [{ required: true, message: '请上传课程封面', trigger: 'blur' }],
  };
  const onSubmit = () => {
    formRef.value
      .validate()
      .then(() => {
        console.log('values', formState, toRaw(formState));
        createCourseMethod(formState)
          .then((res) => {
            console.log('res', res);
            showCCMB.value = false;
            getTeacherCourseList(1);
            teacherCourseList.pageNum = 1;
          })
          .catch((err) => {
            console.log('err', err);
          });
      })
      .catch((error: ValidateErrorEntity<FormState>) => {
        console.log('error', error);
      });
  };
  const resetForm = () => {
    showCCMB.value = false;
    formRef.value.resetFields();
  };

  const globSetting = useGlobSetting();
  const setCoverUrl = (url: string) => {
    formState.coverUrl = globSetting.jobSys + url;
  };
</script>

<style lang="less" scoped>
  .CCMBForm {
    padding: 16px;
  }

  .ant-pagination {
    margin-top: 16px;
    text-align: center;
  }
</style>
