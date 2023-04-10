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
    <List item-layout="vertical" size="large" :pagination="pagination" :data-source="listData">
      <template #renderItem="{ item }">
        <ListItem key="item.title">
          <template #actions>
            <span v-for="{ type, text } in actions" :key="type">
              <component :is="type" style="margin-right: 8px" />
              {{ text }}
            </span>
          </template>
          <template #extra>
            <img
              width="272"
              alt="logo"
              src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
            />
          </template>
          <ListItemMeta :description="item.description">
            <template #title>
              <a :href="item.href">{{ item.title }}</a>
            </template>
            <template #avatar><Avatar :src="item.avatar" /></template>
          </ListItemMeta>
          {{ item.content }}
        </ListItem>
      </template>
      <template #footer>
        <div>
          <b>ant design vue</b>
          footer part
        </div>
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
    Avatar,
    Modal,
    Form,
    FormItem,
    Input,
    Textarea,
  } from 'ant-design-vue';
  import { ref } from 'vue';
  // import { dynamicInfoItems } from './data';
  // import { Icon } from '/@/components/Icon';

  const ListItem = List.Item;
  const ListItemMeta = List.Item.Meta;

  // OR
  const listData: Record<string, string>[] = [];

  for (let i = 0; i < 23; i++) {
    listData.push({
      href: 'https://www.antdv.com/',
      title: `课程名称 ${i}`,
      avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
      description:
        'Ant Design, a design language for background applications, is refined by Ant UED Team.',
      content:
        'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
    });
  }
  const pagination = {
    onChange: (page: number) => {
      console.log(page);
    },
    pageSize: 3,
  };
  const actions: Record<string, string>[] = [
    { type: 'StarOutlined', text: '156' },
    { type: 'LikeOutlined', text: '156' },
    { type: 'MessageOutlined', text: '2' },
  ];

  // 显示新建课程模态框
  let showCCMB = ref<boolean>(false);

  function showCreateCourseModalBox() {
    console.log('showCreateCourseModalBox');
    showCCMB.value = true;
  }

  import { ValidateErrorEntity } from 'ant-design-vue/es/form/interface';
  import { reactive, toRaw, UnwrapRef } from 'vue';
  import { createCourseMethod } from '/@/views/homeworkSystem/utils/teacherMethods';
  import UploadCourseCover from '/@/views/homeworkSystem/teacher/components/UploadCourseCover.vue';

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

  import { useGlobSetting } from '/@/hooks/setting';
  const globSetting = useGlobSetting();
  const setCoverUrl = (url: string) => {
    formState.coverUrl = globSetting.jobSys + url;
  };
</script>

<style lang="less" scoped>
  .CCMBForm {
    padding: 16px;
  }
</style>
