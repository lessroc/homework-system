<template>
  <Form
    :model="formState"
    name="time_related_controls"
    @finish="onFinish"
    @finish-failed="onFinishFailed"
    :style="{ width: '562px', margin: '0 auto' }"
  >
    <FormItem name="title" label="标题" v-bind="title">
      <Input v-model:value="formState.title" />
    </FormItem>
    <FormItem name="desc" label="描述" v-bind="desc">
      <Textarea v-model:value="formState.desc" />
    </FormItem>
    <FormItem name="rangeTimePicker" label="开始时间和结束时间" v-bind="rangeTimePicker">
      <RangePicker
        v-model:value="formState.rangeTimePicker"
        :ranges="ranges"
        show-time
        format="YYYY-MM-DD HH:mm:ss"
        value-format="YYYY-MM-DD HH:mm:ss"
      />
    </FormItem>
    <FormItem :style="{ textAlign: 'right' }">
      <Button type="primary" html-type="submit" :loading="loading">发布</Button>
    </FormItem>
  </Form>
</template>
<script lang="ts" setup>
  import { reactive, ref, watch } from 'vue';
  import { Form, Input, Button, RangePicker, message } from 'ant-design-vue';
  import { publishHomeworkApi } from '/@/views/homeworkSystem/api/teacher';
  import dayjs, { Dayjs } from 'dayjs';
  type RangeValue = [Dayjs, Dayjs];
  const FormItem = Form.Item;
  const props = defineProps<{ courseId: number; homeworkData: any }>();
  const Textarea = Input.TextArea;

  // 监听homeworkData变化
  watch(
    () => props.homeworkData,
    (val) => {
      console.log('homeworkData变化:', val);
      if (val) {
        formState.title = val.homeworkTopicTitle;
        formState.desc = val.homeworkTopicDesc;
        formState.rangeTimePicker = [val.startTime, val.endTime];
        formState.homeworkTopicId = val.homeworkTopicId;
      }
    },
    { deep: true },
  );

  const loading = ref(false);
  const ranges = reactive({
    今天: [dayjs(), dayjs()] as RangeValue,
    今天到月底: [dayjs(), dayjs().endOf('month')] as RangeValue,
    一个月: [dayjs(), dayjs().add(1, 'month')] as RangeValue,
    下个月: [
      dayjs().add(1, 'month').startOf('month'),
      dayjs().add(1, 'month').endOf('month'),
    ] as RangeValue,
  });

  interface FormState {
    title: string;
    desc: string;
    rangeTimePicker: [string, string];
    homeworkTopicId: number;
  }
  const title = {
    rules: [{ type: 'string' as const, required: true, message: '请输入作业标题！' }],
  };
  const desc = {
    rules: [{ type: 'string' as const, required: true, message: '请输入作业描述！' }],
  };
  const rangeTimePicker = {
    rules: [{ type: 'array' as const, required: true, message: '请选择作业时间！' }],
  };
  const formState = reactive({} as FormState);
  const onFinish = (values: any) => {
    console.log('Success:', values, formState);
    loading.value = true;
    publishHomeworkApi({
      courseId: props.courseId,
      title: formState.title,
      desc: formState.desc,
      startTime: formState.rangeTimePicker[0],
      endTime: formState.rangeTimePicker[1],
      homeworkTopicId: formState.homeworkTopicId,
    })
      .then((res) => {
        console.log('发布作业成功:', res);
        message.success('发布作业成功！');
        // 重置表单
        formState.title = '';
        formState.desc = '';
        formState.rangeTimePicker = ['', ''];
      })
      .catch((err) => {
        console.log('发布作业失败:', err);
      })
      .finally(() => {
        loading.value = false;
      });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };
</script>
