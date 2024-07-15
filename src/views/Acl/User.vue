<template>
  <!-- 用户管理 -->
  <!-- 卡片一：搜索栏 -->
  <el-card style="height: 70px">
    <el-form :inline="true" class="search-form">
      <el-form-item label="用户名:">
        <el-input placeholder="请输入用户名" v-model.trim="keyword"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          :disabled="keyword ? false : true"
          @click="searchHandler"
          >搜索</el-button
        >
        <el-button @click="resetHandler">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <!-- 卡片二：用户列表 -->
  <el-card style="margin-top: 10px">
    <!-- 两个按钮 -->
    <!-- 添加 -->
    <el-button type="primary" @click="addUser">添加</el-button>
    <!-- 批量删除 -->
    <el-popconfirm title="确认要删除吗?" @confirm="deleteSelectUserHandler">
      <template #reference>
        <el-button type="danger" :disabled="selectUserArr.length ? false : true"
          >批量删除</el-button
        >
      </template>
    </el-popconfirm>

    <!-- 用户列表表格 -->
    <el-table
      border
      style="margin: 10px 0px"
      :data="userRecords"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        type="selection"
        align="center"
        width="55px"
      ></el-table-column>
      <el-table-column
        type="index"
        align="center"
        label="#"
        width="80px"
      ></el-table-column>
      <el-table-column label="用户名字" prop="username"></el-table-column>
      <el-table-column label="用户名称" prop="name"></el-table-column>
      <el-table-column
        label="用户角色"
        show-overflow-tooltip
        prop="roleName"
      ></el-table-column>
      <el-table-column
        label="创建时间"
        show-overflow-tooltip
        prop="createTime"
      ></el-table-column>
      <el-table-column
        label="更新时间"
        show-overflow-tooltip
        prop="updateTime"
      ></el-table-column>
      <el-table-column label="操作" width="270px">
        <template #="{ row }">
          <!-- 三个按钮：分配角色、编辑、删除 -->
          <el-button
            type="success"
            icon="User"
            size="small"
            @click="assignUser(row)"
            >分配角色</el-button
          >
          <el-button
            type="primary"
            icon="Edit"
            size="small"
            @click="updateUser(row)"
            >编辑</el-button
          >
          <el-popconfirm
            :title="`确定要删除${row.username}吗?`"
            @confirm="deleteUser(row.id)"
          >
            <template #reference>
              <el-button type="danger" icon="Delete" size="small"
                >删除</el-button
              >
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <!-- 页码 -->
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="PAGE_SIZE"
      background
      layout="prev, pager, next, jumper,->,sizes,total"
      :total="total"
      @size-change="getUserList"
      @current-change="getUserList"
    />
  </el-card>
  <!-- 添加用户的抽屉 -->
  <el-drawer v-model="userDrawer" direction="rtl">
    <!-- 头部 -->
    <template #header>
      <h4>添加用户</h4>
    </template>
    <!-- 内容 -->
    <template #default>
      <!-- 添加用户表单 -->
      <el-form :model="userForm" ref="userFormRef" :rules="userRules">
        <el-form-item label="用户姓名" prop="username">
          <el-input
            v-model.trim="userForm.username"
            placeholder="请填写用户名字"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户昵称" prop="name">
          <el-input
            v-model.trim="userForm.name"
            placeholder="请填写用户昵称"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户密码" prop="password">
          <el-input
            v-model.trim="userForm.password"
            placeholder="请填写用户密码"
          ></el-input>
        </el-form-item>
      </el-form>
    </template>
    <!-- 底部 -->
    <template #footer>
      <div style="flex: auto">
        <el-button @click="cancelAddHandler">取消</el-button>
        <el-button type="primary" @click="saveUserHandler">确定</el-button>
      </div>
    </template>
  </el-drawer>
  <!-- 分配角色抽屉 -->
  <el-drawer v-model="assignDrawer" direction="rtl">
    <!-- header -->
    <template #header>
      <h4>分配用户角色</h4>
    </template>
    <!-- 内容 -->
    <template #default>
      <el-form>
        <el-form-item label="用户姓名">
          <el-input disabled :value="userForm.username"></el-input>
        </el-form-item>
        <el-form-item label="角色列表">
          <el-checkbox
            v-model="checkAllRole"
            :indeterminate="isIndeterminate"
            @change="handleCheckAllChange"
          >
            全选
          </el-checkbox>
          <el-checkbox-group
            v-model="checkedRoles"
            @change="handleCheckedRoleChange"
          >
            <el-checkbox v-for="item in roles" :key="item.id" :label="item">
              {{ item.roleName }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
    </template>
    <!-- 底部 -->
    <template #footer>
      <div style="flex: auto">
        <el-button @click="cancelAssignHandler">取消</el-button>
        <el-button type="primary" @click="saveAssignHandler">确定</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from "vue";
import { ElMessage, type FormRules } from "element-plus";

import { PAGE_SIZE } from "@/settings";
import { useLayoutSettingStore } from "@/store/modules/settings";

import {
  reqUserList,
  reqAddOrUpdateUser,
  reqUserRemove,
  reqUserBatchRemove,
  reqUserAssignInfo,
  reqAssignRole,
} from "@/api/acl/user";
import type {
  UserData,
  SaveUserFormData,
  UserInfo,
  UserRoleData,
  AssignRoleFormData,
} from "@/api/acl/type";

const settingStore = useLayoutSettingStore();

const keyword = ref("");
// 当前页码
let currentPage = ref<number>(1);

// pageSize 每一页展示多少条数据
let pageSize = ref<number>(PAGE_SIZE[0]);

// 总共多少条数据
let total = ref<number>(0);

// 用户数据
const userRecords = ref<UserData[]>([]);

// 控制添加用户的抽屉 是否打开
const userDrawer = ref(false);

// 控制分配角色的抽屉是否打开
const assignDrawer = ref(false);

// 添加用户表单数据
const userForm = reactive<SaveUserFormData>({
  username: "",
  name: "",
  password: "",
});

// 添加用户表单
const userFormRef = ref();

// 存放批量选择的用户
const selectUserArr = ref<UserInfo[]>([]);

// 控制角色分配 角色列表中的全选：是否全选所有角色
const checkAllRole = ref(false);

// indeterminate 属性用以表示 checkbox 的不确定状态，一般用于实现全选的效果
const isIndeterminate = ref(true);

// 所有的角色
let roles: UserRoleData[] = [];

// 已选择的角色列表
const checkedRoles = ref<UserRoleData[]>([]);

// 表单验证规则
// 用户名验证规则
const validatorUsername = (rule: any, value: any, callback: any) => {
  // 用户名 5- 11位
  if (value.trim().length >= 5 && value.length <= 11) {
    console.log("validatorUsername");
    callback();
  } else {
    callback(new Error("用户名5-11位"));
  }
};

// 表单验证规则
const userRules = reactive<FormRules<typeof userForm>>({
  username: [
    { required: true, trigger: "change", validator: validatorUsername },
  ],
  name: [
    {
      required: true,
      trigger: "change",
      min: 5,
      max: 10,
      message: "昵称在5-10位之间",
    },
  ],
  password: [
    {
      required: true,
      min: 6,
      max: 16,
      message: "密码在6-16位之间",
      trigger: "change",
    },
  ],
});

onMounted(() => {
  getUserList();
});

// 搜索按钮
const searchHandler = () => {
  // 获取用户列表
  getUserList();
  // 清空keyword
  keyword.value = "";
};

// 重置按钮
const resetHandler = () => {
  // useLayoutSettingStore 中的refresh取反，
  // Layout main组件中有侦听，会控制组件是否重建
  settingStore.refresh = !settingStore.refresh;
};

// 编辑按钮
const updateUser = (row: UserInfo) => {
  // 抽屉打开
  userDrawer.value = true;
  // userForm表单更新
  userForm.id = row.id;
  userForm.username = row.username;
  userForm.password = row.password;
  userForm.name = row.name;
  // 清空上一次的错误提示信息
  nextTick(() => {
    userFormRef.value.clearValidate("username");
    userFormRef.value.clearValidate("name");
  });
};

// 删除按钮-删除一个用户
const deleteUser = async (userId: number) => {
  const res = await reqUserRemove(userId);
  if (res.code === 200) {
    // 删除成功
    ElMessage.success("删除成功");
    getUserList();
  } else {
    ElMessage.error("删除失败");
  }
};

// 批量删除用户
const deleteSelectUserHandler = async () => {
  // 整理参数
  const idList = selectUserArr.value.map((item) => {
    return item.id;
  });

  // 批量删除
  const res = await reqUserBatchRemove(idList);
  if (res.code === 200) {
    ElMessage.success("删除成功");
    // 重新获取用户
    getUserList();
  } else {
    ElMessage.error("删除失败");
  }
};

// table复选框勾选触发事件
const handleSelectionChange = (val: UserInfo[]) => {
  selectUserArr.value = val;
};

// 添加用户事件
// 添加按钮点击
const addUser = () => {
  // 抽屉打开
  userDrawer.value = true;
  // 表单数据清空
  Object.assign(userForm, {
    id: 0,
    username: '',
    name: '',
    password: ''
  })
  // 表单验证错误提示清空 重置该表单项，将其值重置为初始值，并移除校验结果
  nextTick(() => {
    userFormRef.value.resetFields();
  });
};
// 取消添加
const cancelAddHandler = () => {
  // 关闭抽屉
  userDrawer.value = false;
};

// 保存添加用户
const saveUserHandler = async () => {
  // 验证表单是否通过
  await userFormRef.value.validate();
  // 提交
  const res = await reqAddOrUpdateUser(userForm);

  if (res.code === 200) {
    // 添加成功
    ElMessage.success(userForm.id ? "修改成功" : "添加成功");
    // 关闭抽屉
    userDrawer.value = false;
    if (!userForm.id) {
      currentPage.value = 1;
    }
    // 重新获取用户列表
    // getUserList()
    // 浏览器自动刷新一次
    window.location.reload();
  } else {
    userDrawer.value = false;
    ElMessage.error(userForm.id ? "修改失败" : "添加失败");
  }
};

// 分配角色
// 分配角色按钮
const assignUser = async (row: any) => {
  // username 展示
  Object.assign(userForm, row);
  // 获取用户角色数据
  const res = await reqUserAssignInfo(row.id);
  if (res.code === 200) {
    roles = res.data.allRolesList;
    checkedRoles.value = res.data.assignRoles;
    // 抽屉打开
    assignDrawer.value = true;
  }
};

// 选择的角色发生变化时触发
const handleCheckedRoleChange = (value: string) => {
  const checkedCount = value.length;

  checkAllRole.value = checkedCount === roles.length;
  isIndeterminate.value = checkedCount > 0 && checkedCount < roles.length;
};

// 全选按钮更改时触发
const handleCheckAllChange = (val: boolean) => {
  checkedRoles.value = val ? roles : [];
  isIndeterminate.value = false;
};

// 取消分配角色
const cancelAssignHandler = () => {
  // 抽屉关闭
  assignDrawer.value = false;
};

// 确认分配
const saveAssignHandler = async () => {
  const data: AssignRoleFormData = {
    userId: userForm.id as number,
    roleIdList: checkedRoles.value.map((item) => item.id),
  };
  const res = await reqAssignRole(data);
  if (res.code === 200) {
    ElMessage.success("分配成功");
    assignDrawer.value = false;
    getUserList();
  }
};

// 获取用户列表
const getUserList = async () => {
  const { code, data } = await reqUserList(
    currentPage.value,
    pageSize.value,
    keyword.value,
  );
  if (code === 200) {
    total.value = data.total;
    userRecords.value = data.records;
  }
};
</script>

<style scoped>
.search-form {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
