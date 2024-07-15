<template>
  <!-- 菜单表格 -->
  <el-table border style="width: 100%" row-key="id" :data="menuArr">
    <el-table-column label="名称" prop="name"></el-table-column>
    <el-table-column label="权限值" prop="code"></el-table-column>
    <el-table-column label="修改时间" prop="updateTime"></el-table-column>
    <el-table-column label="操作">
      <template #="{ row }">
        <el-button
          type="primary"
          size="small"
          :disabled="row.level === 4 ? true : false"
          @click="addMenu(row)"
        >
          {{ row.level === 3 ? "添加功能" : "添加菜单" }}
        </el-button>
        <el-button
          type="primary"
          size="small"
          :disabled="row.level === 1 ? true : false"
          @click="updateMenu(row)"
          >编辑</el-button
        >
        <el-popconfirm
          :title="`你确定要删除${row.name}?`"
          width="260px"
          @confirm="deleteMenuHandler(row.id)"
        >
          <template #reference>
            <el-button
              type="primary"
              size="small"
              :disabled="row.level === 1 ? true : false"
              >删除</el-button
            >
          </template>
        </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>
  <!-- dialog:添加/编辑菜单 -->
  <el-dialog v-model="dialogVisible" width="400px">
    <!-- 头部 -->
    <template #header>
      <h4>{{ menuParams.id ? "更新菜单" : "添加菜单" }}</h4>
    </template>
    <!-- 主体：表单 -->
    <template #default>
      <el-form
        label-width="70px"
        :model="menuParams"
        :rules="rules"
        ref="menuFormRef"
      >
        <el-form-item label="名称" prop="name">
          <el-input
            v-model.trim="menuParams.name"
            placeholder="请输入菜单名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="权限值" prop="code">
          <el-input
            v-model.trim="menuParams.code"
            placeholder="请输入权限值"
          ></el-input>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveMenuHandler"> 确认 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from "vue";
import { ElMessage } from "element-plus";

import type { MenuPermissionData, setMenuForm } from "@/api/acl/type";
import {
  reqAllPermission,
  reqAddOrUpdatePermission,
  reqRemovePermission,
} from "@/api/acl/menu";

// 存放菜单数据
const menuArr = ref<MenuPermissionData[]>([]);

// 控制 添加/编辑 对话框 是否弹出
const dialogVisible = ref(false);

// 添加/编辑菜单 参数
const menuParams = reactive<setMenuForm>({
  id: 0,
  name: "",
  code: "",
  level: 0,
  pid: 0,
});

// form表单
const menuFormRef = ref();

// onMounted
onMounted(() => {
  // 获取全部菜单
  getAllMenu();
});

// 菜单验证规则
const rules = {
  name: [{ required: true, message: "名称不可为空", trigger: "blur" }],
  code: [{ required: true, message: "权限值不可为空", trigger: "blur" }],
};

// 按钮点击
// 添加菜单按钮点击
const addMenu = (row: MenuPermissionData) => {
  // 清空menuParams
  Object.assign(menuParams, {
    id: 0,
    name: "",
    code: "",
    level: 0,
    pid: 0,
  });
  // dialog对话框打开
  dialogVisible.value = true;
  // 收集新增菜单信息 - level
  menuParams.level = row.level + 1;
  // 给谁新增子菜单
  menuParams.pid = row.id as number;
  nextTick(() => {
    menuFormRef.value.clearValidate("code");
    menuFormRef.value.clearValidate("name");
  });
};

// 编辑菜单按钮
const updateMenu = (row: MenuPermissionData) => {
  // dialog对话框打开
  dialogVisible.value = true;
  // 设置menuParams
  Object.assign(menuParams, {
    id: row.id,
    name: row.name,
    code: row.code,
    level: row.level,
    pid: row.pid,
  });
  nextTick(() => {
    menuFormRef.value.clearValidate("code");
    menuFormRef.value.clearValidate("name");
  });
};

// 确认保存菜单按钮
const saveMenuHandler = async () => {
  await menuFormRef.value.validate();
  const res = await reqAddOrUpdatePermission(menuParams);
  if (res.code === 200) {
    ElMessage.success(menuParams.id ? "更新成功" : "添加成功");
    // 重新获取
    getAllMenu();
  } else {
    ElMessage.error(menuParams.id ? "更新失败" : "添加失败");
  }
  dialogVisible.value = false;
};

// 删除按钮
const deleteMenuHandler = async (id: number) => {
  const res = await reqRemovePermission(id);
  if (res.code === 200) {
    ElMessage.success("删除成功");
    getAllMenu();
  }
};

// 获取全部菜单
const getAllMenu = async () => {
  const res = await reqAllPermission();
  if (res.code === 200) {
    menuArr.value = res.data;
  }
};
</script>

<style scoped></style>
