<template>
  <Table
    :columns="columns"
    :data-source="userList.list"
    :pagination="paginationProps"
    :scroll="{ y: 'calc(100vh - 200px)' }"
    :loading="loading"
    bordered
  >
    <template #bodyCell="{ column, text, record }">
      <template v-if="['userName', 'password'].includes(column.dataIndex)">
        <div>
          <Input
            v-if="editableData[record.id]"
            v-model:value="editableData[record.id][column.dataIndex]"
            style="margin: -5px 0"
          />
          <template v-else>
            {{ text }}
          </template>
        </div>
      </template>
      <template v-else-if="column.dataIndex === 'operation'">
        <div class="editable-row-operations">
          <span v-if="editableData[record.id]">
            <TypographyLink @click="save(record.id)">保存</TypographyLink>
            <Popconfirm title="确定取消？" @confirm="cancel(record.id)">
              <a>取消</a>
            </Popconfirm>
          </span>
          <span v-else>
            <a @click="edit(record.id)">编辑</a>
            <Popconfirm title="确定删除该用户？" @confirm="deleteUser(record.id)">
              <a>删除</a>
            </Popconfirm>
          </span>
        </div>
      </template>
    </template>
  </Table>
</template>
<script lang="ts" setup>
  import { cloneDeep } from 'lodash-es';
  import { onBeforeMount, reactive, ref } from 'vue';
  import type { UnwrapRef } from 'vue';
  import { Table, Input, TypographyLink, Popconfirm, message } from 'ant-design-vue';
  import { deleteUserApi, getUserListApi } from '/@/views/homeworkSystem/api/admin';
  import dayjs from 'dayjs';
  import { editUserNameHomeworkApi } from '/@/views/homeworkSystem/api/sys/user';
  const loading = ref<boolean>(false);
  const props = defineProps({
    userType: {
      type: Number,
      default: 1,
    },
  });

  const deleteUser = (id: number) => {
    console.log('删除用户:', id);
    deleteUserApi(id)
      .then((res) => {
        console.log('删除用户成功:', res);
        message.success('删除用户成功');
        getUserList();
      })
      .catch((err) => {
        console.log('删除用户失败:', err);
      });
  };

  onBeforeMount(() => {
    getUserList();
  });

  let userList = reactive({
    pageNum: 1,
    pageSize: 10,
    totalPage: 0,
    total: 0,
    list: [] as any[],
  });

  const getUserList = async () => {
    loading.value = true;
    await getUserListApi({
      pageNum: userList.pageNum,
      pageSize: userList.pageSize,
      userType: props.userType,
    })
      .then((res) => {
        console.log('获取用户列表成功:', res);
        // 时间格式化
        res.list.forEach((item: any) => {
          item.createTime = item.createTime && dayjs(item.createTime).format('YYYY-MM-DD HH:mm:ss');
          item.updateTime = item.updateTime && dayjs(item.updateTime).format('YYYY-MM-DD HH:mm:ss');
        });
        userList = Object.assign(userList, res);
      })
      .finally(() => {
        loading.value = false;
      });
  };

  const paginationProps = reactive({
    current: userList.pageNum,
    pageSize: userList.pageSize,
    total: userList.total,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total: number) => `共 ${total} 条`,
    onChange: (page: number, pageSize: number) => {
      console.log('当前页:', page, '每页条数:', pageSize);
      userList.pageNum = page;
      userList.pageSize = pageSize;
      getUserList();
    },
    onShowSizeChange: (current: number, size: number) => {
      console.log('当前页:', current, '每页条数:', size);
      userList.pageNum = current;
      userList.pageSize = size;
      getUserList();
    },
  });

  const columns = [
    {
      title: '用户ID',
      dataIndex: 'id',
      width: 100,
      align: 'center',
    },
    {
      title: '用户名',
      dataIndex: 'userName',
      width: 200,
    },
    {
      title: '密码',
      dataIndex: 'password',
      width: 200,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 200,
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      width: 200,
    },
    {
      title: '操作',
      dataIndex: 'operation',
      width: 200,
    },
  ];
  // 给columns元素添加居中
  columns.forEach((item) => {
    item.align = 'center';
  });
  interface DataItem {
    createTime: string;
    id: number;
    updateTime: string;
    password: string;
    userName: string;
    userType: number;
  }

  const editableData: UnwrapRef<Record<string, DataItem>> = reactive({});

  const edit = (id: number) => {
    editableData[id] = cloneDeep(userList.list.filter((item) => id === item.id)[0]);
  };
  const save = (id: number) => {
    Object.assign(userList.list.filter((item) => id === item.id)[0], editableData[id]);
    console.log('保存用户信息:', editableData[id]);
    editUserNameHomeworkApi({
      userId: editableData[id].id,
      userName: editableData[id].userName,
      password: editableData[id].password,
      userType: editableData[id].userType,
    })
      .then((res) => {
        console.log('修改用户信息成功:', res);
        message.success('修改用户信息成功');
        getUserList();
        delete editableData[id];
      })
      .catch((err) => {
        console.log('修改用户信息失败:', err);
        message.error('修改用户信息失败');
      });
  };
  const cancel = (id: number) => {
    delete editableData[id];
  };
</script>
<style lang="less" scoped>
  .editable-row-operations a {
    margin-right: 8px;
  }

  :deep(.ant-pagination) {
    margin-right: 16px;
  }
</style>
