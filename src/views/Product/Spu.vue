<template>
  <!-- 主体部分 -->
  <!-- 顶部分类 -->
  <Category :scene="scene"></Category>
  <!-- 卡片 -->
  <el-card style="margin-top: 10px">
    <div v-show="scene === 0">
      <!-- 添加SPU按钮 -->
      <el-button
        type="primary"
        icon="Plus"
        :disabled="categoryStore.category3Id ? false : true"
        @click="addSpu"
        >添加SPU
      </el-button>
      <!-- SPU展示表格 -->
      <el-table border style="width: 100%; margin: 10px 0" :data="spuRecords">
        <el-table-column
          label="序号"
          width="80"
          align="center"
          type="index"
        ></el-table-column>
        <el-table-column label="SPU名称" prop="spuName"></el-table-column>
        <el-table-column
          label="SPU描述"
          prop="description"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="操作" width="240">
          <!-- 四个按钮 -->
          <template #="{ row }">
            <el-button
              type="primary"
              size="small"
              icon="Plus"
              title="添加SKU"
              @click="addSku(row)"
            ></el-button>
            <el-button
              type="warning"
              size="small"
              icon="Edit"
              title="编辑SPU"
              @click="spuEdit(row)"
            ></el-button>
            <el-button
              type="info"
              size="small"
              icon="View"
              title="查看SKU列表"
              @click="findSku(row)"
            ></el-button>
            <!-- 气泡确认是否删除 -->
            <el-popconfirm
              title="确定要删除?"
              width="200"
              @confirm="deleteSpuHandler(row.id)"
            >
              <template #reference>
                <el-button
                  type="danger"
                  size="small"
                  icon="Delete"
                  title="删除SPU"
                ></el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <!-- 页码组件 -->
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="PAGE_SIZE"
        background
        layout=" prev, pager, next, jumper, ->, sizes, total"
        :total="total"
        @current-change="getSpuList"
        @size-change="getSpuList"
      />
    </div>
    <div v-show="scene === 1">
      <SpuForm ref="spuRef" @changeScene="changeScene"></SpuForm>
    </div>
    <div v-show="scene === 2">
      <SkuForm ref="skuRef" @changeScene="changeScene"></SkuForm>
    </div>
    <!-- el-dialog对话框展示已添加的SKU -->
    <el-dialog v-model="dialogVisible" title="SKU列表" width="800">
      <el-table border :data="skuArr">
        <el-table-column label="sku名字" prop="skuName"></el-table-column>
        <el-table-column label="sku价格" prop="price"></el-table-column>
        <el-table-column label="sku重量" prop="weight"></el-table-column>
        <el-table-column label="sku图片">
          <template #="{ row, $index }">
            <img :src="row.skuDefaultImg" style="width: 100px; height: 100px" />
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </el-card>
</template>

<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from "vue";

// 引入卡片分类组件
import Category from "@/components/Category.vue";
import SpuForm from "@/views/Product/FormManage/SpuForm.vue";
import SkuForm from "@/views/Product/FormManage/SkuForm.vue";

import { useCategoryStore } from "@/store/modules/category";

import { reqSpuList, reqDeleteSpu } from "@/api/product/spu";
import { reqSkuList } from "@/api/product/sku";
import type { SPUValue, SkuInfo } from "@/api/product/type";

import { PAGE_SIZE } from "@/settings";
import { ElMessage } from "element-plus";

// 设置主题 0:显示主体table列表 1:显示添加与编辑SPU结构 2:显示添加SKU结构
let scene = ref<number>(0);

const categoryStore = useCategoryStore();

// 当前页码
let currentPage = ref<number>(1);

// pageSize 每一页展示多少条数据
let pageSize = ref<number>(3);
// 总共多少条数据
let total = ref<number>(0);
// spu列表数据
const spuRecords = ref<SPUValue[]>([]);

const spuRef = ref();
const skuRef = ref();

// 控制对话框是否展示
const dialogVisible = ref(false);

// 存放所有SKU
const skuArr = ref<SkuInfo[]>([]);

// 侦听 categoryStore.category3Id 变化 拉取spu数据
watch(
  () => categoryStore.category3Id,
  () => {
    // 当三级分类发生变化时清空对应数据
    spuRecords.value = [];
    if (!categoryStore.category3Id) return;
    // 获取分类
    getSpuList();
  },
);

// 按钮点击
// 1. 添加SPU按钮
const addSpu = () => {
  // 展示spuForm组件
  scene.value = 1;
  spuRef.value.initAddSupData(categoryStore.category3Id);
};

// 2.spu编辑按钮
const spuEdit = (row: any) => {
  // 展示spuForm组件
  scene.value = 1;
  spuRef.value.initHasSpuData(row);
};

// 3. 删除spu
const deleteSpuHandler = async (spuId: number) => {
  // 删除sup

  const res = await reqDeleteSpu(spuId);

  if (res.code === 200) {
    // 删除成功
    ElMessage.success("删除成功");
    // 更新列表
    getSpuList();
  } else {
    ElMessage.error(res.data);
  }
};

// 4. 添加sku
const addSku = (row: any) => {
  // 展示skuForm组件
  scene.value = 2;
  // 初始化sku数据
  skuRef.value.initSkuData(
    categoryStore.category1Id,
    categoryStore.category2Id,
    row,
  );
};

// 5.展示 sku
const findSku = async (row: SPUValue) => {
  const res = await reqSkuList(row.id);
  console.log(res);

  if (res.code === 200) {
    skuArr.value = res.data;
    // 对话框显示
    dialogVisible.value = true;
  }
};

// changeScene 自定义事件 修改scene
const changeScene = (val: number) => {
  scene.value = val;
  getSpuList();
};

// 获取Spu数据 reqSpuList
const getSpuList = async () => {
  const { code, data } = await reqSpuList(
    currentPage.value,
    pageSize.value,
    categoryStore.category3Id as number,
  );

  if (code === 200) {
    total.value = data.total;
    spuRecords.value = data.records;
  }
};

// 组件销毁前清空仓库数据
onBeforeUnmount(() => {
  categoryStore.$reset();
});
</script>

<style scoped></style>
