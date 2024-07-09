<template>
  <!-- 属性管理 -->
  <!-- 卡片1:分类 -->
  <Category :scene="scene"></Category>
  <el-card style="margin-top: 10px">
    <div v-show="scene == 0">
      <!-- 添加平台属性按钮 -->
      <el-button
        type="primary"
        icon="Plus"
        :disabled="categoryStore.category3Id ? false : true"
        @click="addAttr"
        >添加平台属性</el-button
      >
      <!-- 卡片二：表格列表 -->
      <el-table border :data="attrArr" style="width: 100%; margin-top: 10px">
        <el-table-column
          label="序号"
          width="80"
          type="index"
          align="center"
        ></el-table-column>
        <el-table-column
          label="属性名称"
          width="200"
          prop="attrName"
        ></el-table-column>
        <el-table-column label="属性值名称">
          <template #="{ row }">
            <el-tag
              style="margin: 0.1333rem"
              v-for="item in row.attrValueList"
              :key="item.id"
              type="primary"
              >{{ item.valueName }}</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button
              type="warning"
              size="small"
              icon="Edit"
              @click="updateAttr(row)"
            />
            <el-popconfirm
              title="`确认要删除属性${row.attrName}吗?`"
              width="5.3333rem"
              @confirm="deleteAttrHandler(row)"
            >
              <template #reference>
                <el-button type="danger" size="small" icon="Delete" />
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-show="scene == 1">
      <!-- 属性名称 -->
      <el-form :inline="true">
        <el-form-item label="属性名称">
          <el-input v-model.trim="attrParams.attrName" />
        </el-form-item>
      </el-form>
      <!-- 添加按钮+取消按钮 -->
      <el-button
        :disabled="attrParams.attrName ? false : true"
        @click="addAttrValueHandler"
        type="primary"
        icon="Plus"
        >添加属性值</el-button
      >
      <el-button type="primary" @click="cancelHandler">取消</el-button>
      <!-- 表格 -->
      <el-table
        border
        :data="attrParams.attrValueList"
        style="width: 100%; margin-top: 10px"
      >
        <el-table-column
          label="序号"
          width="80"
          type="index"
          align="center"
        ></el-table-column>
        <el-table-column label="属性值名称">
          <template #="{ row, $index }">
            <el-input
              v-if="row.flag"
              v-model="row.valueName"
              :ref="(vc: any) => (inputArr[$index] = vc)"
              @blur="toLookValue(row, $index)"
            ></el-input>
            <div v-else @click="toEditValue(row, $index)">
              {{ row.valueName }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <el-button
            type="danger"
            size="small"
            @click="toDeleteValue"
            icon="Delete"
          ></el-button>
        </el-table-column>
      </el-table>
      <!-- 保存 取消按钮 -->
      <el-button
        :disabled="attrParams.attrValueList.length > 0 ? false : true"
        @click="saveAttrHandler"
        type="primary"
        icon="Plus"
        >保存</el-button
      >
      <el-button type="primary" @click="cancelHandler">取消</el-button>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { watch, ref, reactive, nextTick, onBeforeUnmount } from "vue";
// 引入卡片分类组件
import Category from "@/components/Category.vue";

import { useCategoryStore } from "@/store/modules/category";
import {
  reqAttrList,
  reqSaveAttrInfo,
  reqDeleteAttr,
} from "@/api/product/attr";
import type { AttrInfo, AttrValue } from "@/api/product/type";

import { ElMessage } from "element-plus";

// 设置主题 0:显示table 1:显示添加与编辑结构
let scene = ref<number>(0);

const categoryStore = useCategoryStore();

// 属性列表
const attrArr = ref<AttrInfo[]>([]);

// 属性信息
const attrParams = reactive<AttrInfo>({
  attrName: "",
  categoryId: null,
  categoryLevel: 3, // 代表三级分类
  attrValueList: [], // 新增属性值数组
});

// 村粗组件实例 el-input：添加/编辑框的属性值名称中的input
let inputArr = ref<any>([]);

// 侦听categoryStore.category3Id 改变之后获取attr数据
watch(
  () => categoryStore.category3Id,
  () => {
    // 请求上一次查询的属性与属性值
    attrArr.value = [];
    // categoryStore.category3Id 不为null才发请求
    if (!categoryStore.category3Id) return;
    // 获取分类
    getAttr();
  },
);

// 获取属性与属性值
const getAttr = async () => {
  const { category1Id, category2Id, category3Id } = categoryStore;
  const res = await reqAttrList(category1Id, category2Id, category3Id);

  if (res.code === 200) {
    attrArr.value = res.data;
  }
};

// 点击添加属性按钮
const addAttr = () => {
  // 显示添加/编辑框
  scene.value = 1;
  // 重置attrParams
  Object.assign(attrParams, {
    attrName: "",
    categoryId: categoryStore.category3Id,
    categoryLevel: 3,
    attrValueList: [],
  });
};

// 点击编辑属性按钮
const updateAttr = (row: AttrInfo) => {
  // 更新attrParams
  //
  Object.assign(attrParams, JSON.parse(JSON.stringify(row)));
  // 显示添加/编辑框
  scene.value = 1;
};

// 保存添加/更新的属性 - 点击保存按钮
const saveAttrHandler = async () => {
  const res = await reqSaveAttrInfo(attrParams);
  if (res.code === 200) {
    // 添加成功
    // 退出
    scene.value = 0;
    ElMessage.success("保存成功");
    // 重新获取
    getAttr();
  } else {
    ElMessage.error("保存失败");
  }
};

// 删除属性
const deleteAttrHandler = async (row: AttrInfo) => {
  const attrId = row.id;
  const res = await reqDeleteAttr(attrId as number);
  if (res.code === 200) {
    ElMessage.success("删除成");
    // 重新获取
    getAttr();
  } else {
    ElMessage.error("删除失败");
  }
};

// 属性值操作
// 添加属性值
const addAttrValueHandler = () => {
  // 点击添加属性值按钮向attrParams.attrValueList插入一条数据
  // flag: true:input输入框可编辑 false:失去焦点后 div
  attrParams.attrValueList.push({ valueName: "", flag: true });
  // 最后一个el-input获取焦点
  nextTick(() => {
    inputArr.value[attrParams.attrValueList.length - 1].focus();
  });
};

// 添加/编辑框 中属性值列表中的 toLookValue toEditValue
const toLookValue = (row: AttrValue, $index: number) => {
  // 非法情况判断
  if (row.valueName?.trim() == "") {
    // 删除调用对应属性值为空的元素
    attrParams.attrValueList.splice($index, 1);
    // 提示信息
    ElMessage.error("属性值不能为空");
  }
  // 查看属性值是否重复
  let repeat = attrParams.attrValueList.find((item) => {
    if (item != row) {
      return item.valueName === row.valueName;
    }
  });
  if (repeat) {
    // 将重复的属性值从数组中干掉
    attrParams.attrValueList.splice($index, 1);
    // 提示信息
    ElMessage.error("属性值不能重复");
  }

  // 修改row.flag
  row.flag = false;
};

// 属性值编辑
const toEditValue = (row: AttrValue, $index: number) => {
  // 属性值对象flag变为true，展示input
  row.flag = true;
  // nextTick:响应式数据发生变化，获取更新的DOM，input获取焦点
  nextTick(() => {
    inputArr.value[$index].focus();
  });
};

// 属性值删除
const toDeleteValue = (row: AttrValue, $index: number) => {
  // 删除
  attrParams.attrValueList.splice($index, 1);
};

// 取消操作
const cancelHandler = () => {
  // 关闭添加/编辑框
  scene.value = 0;
};

// 组件销毁前，清空相关仓库数据
onBeforeUnmount(() => {
  // 清空仓库数据
  categoryStore.$reset();
});
</script>

<style scoped></style>
