<template>
  <!-- 卡片一：头部搜索 -->
  <el-card style="height: 70px">
    <el-form :inline="true" class="search-form">
      <el-form-item label="角色名称">
        <el-input placeholder="角色名称" v-model.trim="keyword"></el-input>
      </el-form-item>
      <el-form-item>
        <!-- 两个按钮 -->
        <el-button
          :disabled="keyword ? false : true"
          type="primary"
          @click="searchHandler"
          >搜索</el-button
        >
        <el-button @click="resetHandler">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <!-- 卡片二：主体列表 +分页-->
  <el-card style="margin-top: 10px">
    <!-- 添加按钮 -->
    <el-button type="primary" icon="Plus" @click="addRole">添加角色</el-button>
    <!-- 角色列表 -->
    <el-table border style="margin: 10px 0px" :data="roleRecords">
      <el-table-column
        label="#"
        type="index"
        width="100px"
        align="center"
      ></el-table-column>
      <el-table-column
        label="id"
        width="100px"
        align="center"
        prop="id"
      ></el-table-column>
      <el-table-column
        label="角色名称"
        align="center"
        prop="roleName"
      ></el-table-column>
      <el-table-column
        label="创建时间"
        align="center"
        show-overflow-tooltip
        prop="createTime"
      ></el-table-column>
      <el-table-column
        label="更新时间"
        align="center"
        show-overflow-tooltip
        prop="updateTime"
      ></el-table-column>
      <el-table-column label="操作" width="280px" align="center">
        <!-- 三个按钮：分配权限、编辑、删除 -->
        <template #="{ row }">
          <el-button
            type="primary"
            size="small"
            icon="User"
            @click="assignPermissionHandler(row.id)"
            >分配权限</el-button
          >
          <el-button
            type="primary"
            size="small"
            icon="Edit"
            @click="editRole(row)"
            >编辑</el-button
          >
          <el-popconfirm
            title="确认要删除吗?"
            width="200px"
            @confirm="deleteRoleHandler(row.id)"
          >
            <template #reference>
              <el-button type="primary" size="small" icon="Delete"
                >删除</el-button
              >
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <el-pagination
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="PAGE_SIZE"
      background
      layout="prev, pager, next, jumper,->,sizes,total"
      :total="total"
      @size-change="getRoleList"
      @current-change="getRoleList"
    />
  </el-card>
  <!-- Dialog对话框：添加/更新角色 -->
  <el-dialog v-model="dialogVisible" width="800">
    <template #header>
      <h4>{{ roleForm.id ? "更新" : "添加" }}</h4>
    </template>
    <!-- 内容 -->
    <el-form
      style="margin: 30px 0px"
      :model="roleForm"
      :rules="roleRules"
      ref="roleFormRef"
    >
      <el-form-item label="角色名称" prop="roleName">
        <el-input v-model="roleForm.roleName"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveRoleHandler">确认</el-button>
      </div>
    </template>
  </el-dialog>
  <!-- 抽屉：分配权限 -->
  <el-drawer direction="rtl" v-model="assignDrawer">
    <template #header>
      <h4>分配权限</h4>
    </template>
    <template #default>
      <!-- 树形控件 -->
      <el-tree
        ref="treeRef"
        style="max-width: 600px"
        :data="menuArr"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="selectedMenuArr"
        :props="defaultProps"
      />
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="assignDrawer = false">取消</el-button>
        <el-button type="primary" @click="setPermissionHandler">确认</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, reactive } from "vue";
import { ElMessage, ElTree, type FormRules } from "element-plus";

import { PAGE_SIZE } from "@/settings";
import { useLayoutSettingStore } from "@/store/modules/settings";
import { reqRoleList, reqAddorUpdateRole, reqRemoveRole } from "@/api/acl/role";
import { reqAllMenuList, reqSetRolePermission } from "@/api/acl/menu";
import type {
  RoleData,
  SaveRoleFormData,
  MenuPermissionData,
  SetRolePermissionForm,
} from "@/api/acl/type";

// 搜索关键子
const keyword = ref<string>("");

const settingStore = useLayoutSettingStore();

// 当前页
const currentPage = ref<number>(1);
// 每页显示数量
const pageSize = ref<number>(PAGE_SIZE[0]);
// 总数量
const total = ref<number>(0);
// 控制添加/更新 确认框是否弹出
const dialogVisible = ref(false);

// 控制分配权限的抽屉是否打开
const assignDrawer = ref(false);

// 存放角色列表数据
const roleRecords = ref<RoleData[]>([]);

// 添加/更新角色 参数
const roleForm = ref<SaveRoleFormData>({
  roleName: "",
});

// 表单验证规则
const roleRules = reactive<FormRules<typeof roleForm>>({
  roleName: [
    { required: true, trigger: "blur", message: "请填写角色姓名" },
    { min: 2, max: 10, message: "角色名称在2-10位之间", trigger: "change" },
  ],
});

// 表单添加/更新角色
const roleFormRef = ref();

// 存放菜单数据
const menuArr = ref<MenuPermissionData[]>([]);

// 设置树形控件的属性值
const defaultProps = {
  children: "children",
  label: "name",
};

// 已选择的菜单 level=4的
const selectedMenuArr = ref<number[]>([]);
// 树形控件
const treeRef = ref();

onMounted(() => {
  // 组件挂载完成，请求角色列表
  getRoleList();
});

// 搜索按钮
const searchHandler = () => {
  // 获取角色列表
  getRoleList();
  // keyword重置
  keyword.value = "";
};

// 重置按钮 - 页面重新渲染
const resetHandler = () => {
  settingStore.refresh = !settingStore.refresh;
};

// 添加角色按钮
const addRole = () => {
  // dialog打开
  dialogVisible.value = true;
  // 清空 roleParams
  roleForm.value = { roleName: "", id: 0 };
  // 清空表单错误提示
  nextTick(() => {
    roleFormRef.value.clearValidate("roleName");
  });
};

// 编辑role按钮
const editRole = (row: RoleData) => {
  // 打开 dialog
  dialogVisible.value = true;
  // 设置roleForm
  roleForm.value.id = row.id;
  roleForm.value.roleName = row.roleName;
  // 清空表单错误提示
  nextTick(() => {
    roleFormRef.value.clearValidate("roleName");
  });
};

// 删除role按钮
const deleteRoleHandler = async (roleId: number) => {
  const res = await reqRemoveRole(roleId);
  if (res.code === 200) {
    ElMessage.success("删除成功");
    getRoleList();
  } else {
    ElMessage.error("删除失败");
  }
};

// 确认添加角色按钮
const saveRoleHandler = async () => {
  // 表单验证
  await roleFormRef.value.validate();
  const res = await reqAddorUpdateRole(roleForm.value);
  if (res.code === 200) {
    // 添加/更新成功
    ElMessage.success(roleForm.value.id ? "更新成功" : "添加成功");
    // 关闭对话框
    dialogVisible.value = false;
    // 重新获取role列表
    if (!roleForm.value.id) {
      currentPage.value = 1;
    }
    getRoleList();
    // window.location.reload()
  } else {
    ElMessage.error(roleForm.value.id ? "更新失败" : "添加失败");
    dialogVisible.value = false;
  }
};

// 分配权限按钮
const assignPermissionHandler = async (roleId: number) => {
  // menuArr置空
  menuArr.value = [];
  // 打开分配权限抽屉
  assignDrawer.value = true;
  // 获取角色权限数据
  const res = await reqAllMenuList(roleId);

  if (res.code === 200) {
    menuArr.value = res.data;
    // 已选择的菜单
    selectedMenuArr.value = filterSelectMenu(menuArr.value, []);
    roleForm.value.id = roleId;
  }
};

// 筛选已选择的菜单
const filterSelectMenu = (allData: any, initArr: any) => {
  allData.forEach((item: any) => {
    if (item.select && item.level == 4) {
      initArr.push(item.id);
    }
    if (item.children && item.children.length > 0) {
      filterSelectMenu(item.children, initArr);
    }
  });
  return initArr;
};

// 设置角色权限
const setPermissionHandler = async () => {
  // 已选择的子节点 权限ID
  const checkedArr = treeRef.value!.getCheckedKeys();
  // 半选状态的权限ID - 父节点
  const halfCheckedArr = treeRef.value!.getHalfCheckedKeys();
  const permissionIdList = checkedArr.concat(halfCheckedArr);

  const params: SetRolePermissionForm = {
    permissionIdList,
    roleId: roleForm.value.id as number,
  };
  const res = await reqSetRolePermission(params);
  if (res.code === 200) {
    // 关闭抽屉
    assignDrawer.value = false;
    ElMessage.success("分配权限成功");
    // 刷新页面
    window.location.reload();
  }
};

// 获取角色列表
const getRoleList = async () => {
  const res = await reqRoleList(
    currentPage.value,
    pageSize.value,
    keyword.value,
  );
  if (res.code === 200) {
    total.value = res.data.total;
    roleRecords.value = res.data.records;
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
