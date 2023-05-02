<template>
  <div>
    <Table
      :columns="columns"
      :data-source="allCoursesList.list"
      :pagination="paginationProps"
      :scroll="{ y: 'calc(100vh - 200px)' }"
      :loading="loading"
      bordered
    >
      <template #bodyCell="{ column, text, record }">
        <template v-if="editField.includes(column.dataIndex)">
          <template v-if="editableData[record.courseId]">
            <div class="coverImgBox" v-if="column.dataIndex === 'teacherId'">
              <Space>
                {{ editableData[record.courseId][column.dataIndex] }}
                <Button @click="visible = true">更换教师</Button>
              </Space>
            </div>
            <div class="coverImgBox" v-else-if="column.dataIndex === 'teacherName'">
              {{ editableData[record.courseId][column.dataIndex] }}
            </div>
            <!--上传图片-->
            <div v-else-if="column.dataIndex === 'coverUrl'">
              <Space>
                <div class="coverImgBox">
                  <img
                    class="coverImg"
                    :src="editableData[record.courseId][column.dataIndex]"
                    :alt="editableData[record.courseId][column.dataIndex]"
                  />
                </div>
                <Upload
                  :show-upload-list="false"
                  :before-upload="beforeUploadImg"
                  :custom-request="customRequest"
                >
                  <Button>更换封面</Button>
                </Upload>
              </Space>
            </div>
            <Input
              v-else
              v-model:value="editableData[record.courseId][column.dataIndex]"
              style="margin: -5px 0"
            />
          </template>
          <div class="coverImgBox" v-else-if="column.dataIndex === 'coverUrl'">
            <img class="coverImg" :src="record.coverUrl" :alt="record.coverUrl" />
          </div>
          <template v-else>
            {{ text }}
          </template>
        </template>
        <template v-else-if="column.dataIndex === 'operation'">
          <div class="editable-row-operations">
            <span v-if="editableData[record.courseId]">
              <TypographyLink @click="save(record.courseId)">保存</TypographyLink>
              <Popconfirm
                title="确定取消不保存？"
                placement="topRight"
                @confirm="cancel(record.courseId)"
              >
                <a>取消</a>
              </Popconfirm>
            </span>
            <span v-else>
              <a @click="edit(record.courseId)">编辑</a>
              <Popconfirm title="确定删除该课程？" @confirm="deleteCourse(record.courseId)">
                <a>删除</a>
              </Popconfirm>
            </span>
          </div>
        </template>
      </template>
    </Table>
    <Modal
      v-model:visible="visible"
      title="选择任课教师"
      centered
      @ok="changeTeacher"
      @cancel="cancelChangeTeacher"
    >
      <div class="teacherList">
        <div
          v-for="(item, i) in teacherList"
          :key="item.userId"
          @click="setTeacher(i, item)"
          class="teacherItem"
          :class="{ active: i === selectedTeachers.index }"
        >
          <div class="teacherInfo">
            <div class="teacherId">{{ item.userId }}</div>
            <div class="teacherName">{{ item.userName }}</div>
          </div>
        </div>
      </div>
    </Modal>
  </div>
</template>
<script lang="ts" setup>
  import { cloneDeep } from 'lodash-es';
  import { onBeforeMount, reactive, ref } from 'vue';
  import type { UnwrapRef } from 'vue';
  import {
    Table,
    Input,
    TypographyLink,
    Popconfirm,
    Button,
    Modal,
    message,
    Upload,
    Space,
  } from 'ant-design-vue';
  import { deleteCourseApi } from '/@/views/homeworkSystem/api/teacher';
  import { getAllCourseListApi } from '/@/views/homeworkSystem/api/student';
  import { adminEditCourseApi, getTeacherListApi } from '/@/views/homeworkSystem/api/admin';
  import {
    beforeUploadImg,
    customUploadFile,
  } from '/@/views/homeworkSystem/utils/customUploadFile';
  const loading = ref<boolean>(false);
  const visible = ref<boolean>(false);
  const selectedTeachers = reactive<any>({
    index: '',
    userId: '',
    userName: '',
    currCourseId: '',
  });
  const editField = ['coverUrl', 'courseName', 'courseDesc', 'teacherId', 'teacherName'];

  const customRequest = ({ file, onSuccess, onError }) => {
    customUploadFile(file)
      .then((res: any) => {
        console.log('上传封面成功:', res);
        editableData[selectedTeachers.currCourseId].coverUrl = res[0].fileUrl;
        onSuccess(res);
      })
      .catch((err) => {
        console.log('上传封面失败:', err);
        onError(err);
      });
  };

  const setTeacher = (i, item) => {
    console.log('选择教师:', i, item);
    selectedTeachers.index = i;
    selectedTeachers.userId = item.userId;
    selectedTeachers.userName = item.userName;
  };

  const cancelChangeTeacher = () => {
    console.log('取消更换教师');
    selectedTeachers.index = '';
    selectedTeachers.userId = '';
    selectedTeachers.userName = '';
    visible.value = false;
  };

  // 更换教师
  const changeTeacher = () => {
    console.log('确定更换教师:', selectedTeachers);
    if (selectedTeachers.userId && selectedTeachers.currCourseId) {
      editableData[selectedTeachers.currCourseId].teacherId = selectedTeachers.userId;
      editableData[selectedTeachers.currCourseId].teacherName = selectedTeachers.userName;
      visible.value = false;
    } else {
      message.error('请选择任课教师');
    }
  };

  const deleteCourse = (courseId) => {
    console.log('删除课程Id:', courseId);
    deleteCourseApi({ courseId })
      .then((res) => {
        console.log('删除课程成功:', res);
        getAllCoursesList();
      })
      .catch((err) => {
        console.log('删除课程失败:', err);
      });
  };

  let allCoursesList = reactive({
    pageNum: 1,
    pageSize: 10,
    totalPage: 0,
    total: 0,
    list: [] as any[],
  });

  let teacherList = reactive({});

  onBeforeMount(() => {
    getAllCoursesList();
    getTeacherList();
  });

  const getTeacherList = () => {
    console.log('获取教师列表');
    getTeacherListApi()
      .then((res) => {
        console.log('获取教师列表成功:', res);
        teacherList = Object.assign(teacherList, res);
      })
      .catch((err) => {
        console.log('获取教师列表失败:', err);
      });
  };

  const getAllCoursesList = async () => {
    loading.value = true;
    await getAllCourseListApi({
      pageNum: allCoursesList.pageNum,
      pageSize: allCoursesList.pageSize,
    })
      .then((res) => {
        console.log('获取所有课程列表成功:', res);
        paginationProps.current = res.pageNum;
        paginationProps.pageSize = res.pageSize;
        paginationProps.total = res.total;
        allCoursesList = Object.assign(allCoursesList, res);
      })
      .catch((err) => {
        console.log('获取所有课程列表失败:', err);
      })
      .finally(() => {
        loading.value = false;
      });
  };

  const paginationProps = reactive({
    current: allCoursesList.pageNum,
    pageSize: allCoursesList.pageSize,
    total: allCoursesList.total,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total: number) => `共 ${total} 条`,
    onChange: (page: number, pageSize: number) => {
      console.log('当前页:', page, '每页条数:', pageSize);
      allCoursesList.pageNum = page;
      allCoursesList.pageSize = pageSize;
      getAllCoursesList();
    },
    onShowSizeChange: (current: number, size: number) => {
      console.log('当前页:', current, '每页条数:', size);
      allCoursesList.pageNum = current;
      allCoursesList.pageSize = size;
      getAllCoursesList();
    },
  });

  const columns = [
    {
      title: '课程ID',
      dataIndex: 'courseId',
      align: 'center',
      fixed: 'left',
      width: 80,
    },
    {
      title: '课程封面',
      dataIndex: 'coverUrl',
      align: 'center',
      width: 183,
    },
    {
      title: '课程名称',
      dataIndex: 'courseName',
      width: 200,
    },
    {
      title: '课程描述',
      dataIndex: 'courseDesc',
      width: 400,
    },
    {
      title: '教师ID',
      dataIndex: 'teacherId',
      align: 'center',
      width: 120,
    },
    {
      title: '教师名称',
      dataIndex: 'teacherName',
      align: 'center',
      width: 100,
    },
    {
      title: '操作',
      dataIndex: 'operation',
      align: 'center',
      fixed: 'right',
      width: 150,
    },
  ];

  interface DataItem {
    courseDesc: string;
    courseId: number;
    courseName: string;
    coverUrl: string;
    teacherId: number;
    teacherName: string;
  }

  const editableData: UnwrapRef<Record<string, DataItem>> = reactive({});

  const edit = (courseId: number) => {
    selectedTeachers.currCourseId = courseId;
    editableData[courseId] = cloneDeep(
      allCoursesList.list.filter((item) => courseId === item.courseId)[0],
    );
  };
  const save = (courseId: number) => {
    Object.assign(
      allCoursesList.list.filter((item) => courseId === item.courseId)[0],
      editableData[courseId],
    );
    saveEditCourse(courseId);
  };
  const cancel = (courseId: number) => {
    delete editableData[courseId];
  };

  // 保存编辑的课程
  const saveEditCourse = (courseId: number) => {
    console.log('保存编辑的课程:', editableData[courseId]);
    const { courseName, courseDesc, coverUrl, teacherId } = editableData[courseId];
    adminEditCourseApi({
      courseId,
      courseName,
      courseDesc,
      coverUrl,
      teacherId,
    })
      .then((res) => {
        console.log('保存编辑的课程成功:', res);
        delete editableData[courseId];
        // getAllCoursesList(); // 不用重新获取
      })
      .catch((err) => {
        console.log('保存编辑的课程失败:', err);
      });
  };
</script>
<style lang="less" scoped>
  .editable-row-operations a {
    margin-right: 8px;
  }

  :deep(.ant-pagination) {
    margin-right: 16px;
  }

  .coverImgBox {
    display: flex;
    justify-content: center;
    align-items: center;

    .coverImg {
      height: 150px;
      object-fit: cover;
      border-radius: 4px;
    }
  }

  .updateCoverImgBox {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .teacherList {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    grid-gap: 8px;
    padding: 16px;
    max-height: 520px;
    overflow-y: auto;

    .teacherItem {
      position: relative;
      overflow: hidden;
      padding-top: 100%;
      border-radius: 4px;
      cursor: pointer;
      // 背景浅浅蓝色
      background-color: #e6f7ff;
      color: #1890ff;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      transition: all 0.3s ease-in-out;

      &:hover {
        // 背景深蓝色
        background-color: #bae7ff;
        color: #096dd9;
        box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.2);
      }
      // teacherItem 活跃
      &.active {
        // 背景深蓝色
        background-color: #bae7ff;
        color: #096dd9;
        box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.2);
      }

      .teacherInfo {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;

        .teacherId,
        .teacherName {
          width: 100%;
          text-align: center;
          // 超出显示省略号
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .teacherId {
          padding: 8px 8px 0;
        }

        .teacherName {
          padding: 0 8px 8px;
        }
      }
    }
  }
</style>
