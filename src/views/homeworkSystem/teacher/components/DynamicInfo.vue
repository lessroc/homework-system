<template>
  <Card title="课程列表" v-bind="$attrs">
    <template #extra>
      <Button type="link" size="small" @click="showCreateCourseModalBox(true)">新建课程</Button>
    </template>
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
      <template #renderItem="{ item, index }">
        <ListItem key="item.title" @click.stop="toCourseDetail(item.courseId)">
          <template #actions>
            <Button type="link" @click.stop="editCourse(index)">
              <template #icon><FormOutlined /></template>
              编辑课程
            </Button>
            <Popconfirm title="确定删除该课程？" placement="right" @confirm.stop="confirm(index)">
              <Button type="link" @click.stop>
                <template #icon><DeleteOutlined /></template>
                删除课程
              </Button>
            </Popconfirm>
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
    <Modal
      v-model:visible="showCCMB"
      title="新建课程"
      centered
      @cancel="resetForm"
      @ok="onSubmit"
      destroyOnClose
    >
      <Form ref="formRef" :model="formState" :rules="rules" class="CCMBForm">
        <FormItem label="课程名称：" name="courseName">
          <Input v-model:value="formState.courseName" />
        </FormItem>
        <FormItem label="课程描述：" name="courseDesc">
          <Textarea v-model:value="formState.courseDesc" />
        </FormItem>
        <FormItem label="课程封面：" name="coverUrl">
          <!--传参给子组件-->
          <UploadCourseCover :cover-url="formState.coverUrl" @set-cover-url="setCoverUrl" />
        </FormItem>
      </Form>
    </Modal>
  </Card>
</template>
<script lang="ts" setup>
  import { onBeforeMount, ref, reactive, toRaw } from 'vue';
  import { Button, Card, List, Modal, Form, Input, Pagination, Popconfirm } from 'ant-design-vue';
  import { FormOutlined, DeleteOutlined } from '@ant-design/icons-vue';
  import { ValidateErrorEntity } from 'ant-design-vue/es/form/interface';
  import { createCourseMethod } from '/@/views/homeworkSystem/utils/teacherMethods';
  import UploadCourseCover from '/@/views/homeworkSystem/teacher/components/UploadCourseCover.vue';
  import {
    deleteCourseApi,
    editCourseApi,
    getTeacherCourseListApi,
  } from '/@/views/homeworkSystem/api/teacher';
  import { GetCourseListResultParams } from '/@/views/homeworkSystem/api/teacher/model';
  import { useGo } from '/@/hooks/web/usePage';
  const go = useGo();

  const FormItem = Form.Item;
  const ListItem = List.Item;
  const ListItemMeta = List.Item.Meta;
  const Textarea = Input.TextArea;

  /**
   * 打开课程详情页
   */
  const toCourseDetail = (courseId: number) => {
    console.log('打开课程详情页:', courseId);
    // go({ name: 'courseDetail', params: { courseId } });
    go('/teacher/course-detail/' + courseId);
  };

  // 挂载前获取课程列表
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
  const getTeacherCourseList = (pageNum: number | undefined) => {
    loading.value = true;
    getTeacherCourseListApi({
      pageNum,
      pageSize: 3,
      userId: userStore.getUserInfo?.userId,
    })
      .then((res) => {
        console.log('获取课程列表成功:', res);
        // res.list = replaceCoverUrl(res.list);
        delete res.pageNum;
        teacherCourseList = Object.assign(teacherCourseList, res);
      })
      .catch((err) => {
        console.log('获取课程列表失败:', err);
      })
      .finally(() => {
        loading.value = false;
      });
  };

  // 页码改变的回调
  const onChange = (pageNumber: number) => {
    console.log('Page: ', pageNumber);
    // 跳转到指定页
    getTeacherCourseList(pageNumber);
    teacherCourseList.pageNum = pageNumber;
  };
  let currEditCourseBackup: any = '';
  let isEditCourse = false;
  let currEditCourseIndex = 0;
  // 编辑课程
  const editCourse = (index) => {
    console.log('editCourse', index);
    isEditCourse = true;
    currEditCourseIndex = index;
    // 设置表单数据
    const { courseName, courseDesc, coverUrl } = teacherCourseList.list[index];
    // 备份当前编辑的课程
    currEditCourseBackup = teacherCourseList.list[index];
    formState = Object.assign(formState, {
      courseName,
      courseDesc,
      coverUrl,
    });
    console.log('formState', formState);
    // 弹起模态框
    showCreateCourseModalBox();
  };
  const confirm = (index) => {
    return new Promise((resolve) => {
      // 删除课程
      const { courseId } = teacherCourseList.list[index];
      deleteCourseApi({ courseId })
        .then((res) => {
          console.log('删除课程成功:', res);
          resolve(true);
          // 重新获取课程列表
          getTeacherCourseList(teacherCourseList.pageNum);
        })
        .catch((err) => {
          console.log('删除课程失败:', err);
        });
    });
  };

  // 显示新建课程模态框
  let showCCMB = ref<boolean>(false);

  const showCreateCourseModalBox = (resetForm = false) => {
    // 重置表单
    if (resetForm) {
      formState = Object.assign(formState, {
        courseName: '',
        courseDesc: '',
        coverUrl: '',
      });
    }
    showCCMB.value = true;
  };

  // const defaultCoverUrl = 'http://342j6q8933.wicp.vip/static/1681150460000最伟大的作品-周杰伦.jpg'; // 默认封面, 暂无法上传图片

  // 表单
  interface FormState {
    courseName: string;
    courseDesc: string;
    coverUrl: string;
  }
  const formRef = ref();
  let formState = reactive<FormState>({
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
      .then(async () => {
        console.log('values', formState, toRaw(formState));
        // 如果是编辑课程则调用编辑课程接口
        const result = isEditCourse
          ? await editCourseApi(toRaw(formState))
          : await createCourseMethod(toRaw(formState));
        if (result) {
          // 如果是编辑课程则更新课程列表
          if (isEditCourse) {
            // 更新课程列表
            const { courseName, courseDesc, coverUrl } = formState;
            const { courseId, teacherId, teacherName } = currEditCourseBackup;
            teacherCourseList.list[currEditCourseIndex] = {
              courseId,
              courseName,
              courseDesc,
              coverUrl,
              teacherId,
              teacherName,
            };
            // 重置编辑状态
            isEditCourse = false;
          } else {
            // 如果是新建课程则更新课程列表
            getTeacherCourseList(1);
            teacherCourseList.pageNum = 1;
          }
          // 重置表单
          formState = Object.assign(formState, {
            courseName: '',
            courseDesc: '',
            coverUrl: '',
          });
          // 关闭模态框
          showCCMB.value = false;
        }
      })
      .catch((error: ValidateErrorEntity<FormState>) => {
        console.log('error', error);
      });
  };
  const resetForm = () => {
    showCCMB.value = false;
    formRef.value.resetFields();
  };
  const setCoverUrl = (url: string) => {
    formState.coverUrl = url;
  };
</script>

<style lang="less" scoped>
  .CCMBForm {
    padding: 16px;
  }

  .ant-list-item {
    cursor: pointer;
  }

  .ant-pagination {
    margin-top: 16px;
    text-align: right;
  }
</style>
