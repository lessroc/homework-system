<template>
  <PageWrapper title="修改个人信息">
    <div class="pageContainer">
      <Space direction="vertical" :size="16" class="spaceStyle">
        <a-input-group compact class="flex">
          <a-input :value="userTypeStr" disabled allowClear addonBefore="用户类型" />
        </a-input-group>
        <a-input-group compact class="flex">
          <a-input v-model:value="userName" allowClear addonBefore="修改昵称" />
          <a-button type="primary" @click="saveUserName">保存</a-button>
        </a-input-group>
        <a-input-group compact class="flex">
          <a-input-password v-model:value="password" allowClear addonBefore="修改密码" />
          <a-button type="primary" @click="savePassword">保存</a-button>
        </a-input-group>
      </Space>
    </div>
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { PageWrapper } from '/@/components/Page';
  import { message, Space } from 'ant-design-vue';
  import { computed, ref } from 'vue';
  import { useUserStore } from '/@/store/modules/user';
  import {
    editPasswordHomeworkApi,
    editUserNameHomeworkApi,
  } from '/@/views/homeworkSystem/api/sys/user';
  const userStore = useUserStore();
  const userName = ref<string>('');
  const password = ref<string>('');
  const userId = userStore.getUserInfo?.userId;
  const userType = userStore.getUserInfo?.userType;
  const userTypeStr = computed(() => {
    switch (userType) {
      case 1:
        return '学生';
      case 2:
        return '教师';
      case 3:
        return '管理员';
      default:
        return '未知';
    }
  });
  const saveUserName = () => {
    editUserNameHomeworkApi({
      userId,
      userType,
      userName: userName.value,
    })
      .then((res) => {
        console.log('修改昵称成功:', res);
        // userStore.setUserInfo({ username: userName.value });
        message.success('修改昵称成功');
      })
      .catch((err) => {
        console.log('修改昵称失败:', err);
        message.error('修改昵称失败');
      });
  };

  const savePassword = () => {
    editPasswordHomeworkApi({
      userId,
      password: password.value,
    })
      .then((res) => {
        console.log('修改密码成功:', res);
        message.success('修改密码成功');
      })
      .catch((err) => {
        console.log('修改密码失败:', err);
        message.error('修改密码失败');
      });
  };
</script>
<style lang="less" scoped>
  .pageContainer {
    background-color: #fff;
    height: calc(100vh - 80px - 72px - 32px);
  }

  .spaceStyle {
    margin: 16px;
  }

  .flex {
    display: flex;
  }
</style>
