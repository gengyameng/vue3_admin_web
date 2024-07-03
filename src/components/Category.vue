<template>
  <!-- 分类组件 -->
  <el-card>
    <!-- 行内表单 -->
    <el-form :inline="true">
      <el-form-item label="一级分类">
        <el-select
          :disabled="scene === 0 ? false : true"
          style="width: 200px"
          v-model="categoryStore.category1Id"
          @change="changeCategory1Handler"
        >
          <el-option
            v-for="item in categoryStore.category1Arr"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select
          :disabled="scene === 0 ? false : true"
          style="width: 200px"
          v-model="categoryStore.category2Id"
          @change="changeCategory2Handler"
        >
          <el-option
            v-for="item in categoryStore.category2Arr"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select
          :disabled="scene === 0 ? false : true"
          style="width: 200px"
          v-model="categoryStore.category3Id"
        >
          <el-option
            v-for="item in categoryStore.category3Arr"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import { onMounted } from "vue";

import { useCategoryStore } from "@/store/modules/category";

defineProps({
  scene: {
    type: Number,
    default: 0,
  },
});
const categoryStore = useCategoryStore();

// onMounted 获取一级分类
onMounted(() => {
  getCategory1Handler();
});

// 切换一级分类
const changeCategory1Handler = () => {
  // 一级分类切换时 清空二级三级分类
  categoryStore.category2Id = null;
  categoryStore.category3Id = null;
  categoryStore.category3Arr = [];
  // 获取二级分类
  categoryStore.getCategory2();
};

// 切换二级分类
const changeCategory2Handler = () => {
  // 二级分类切换时，清空三级分类
  categoryStore.category3Id = null;
  // 获取三级分类
  categoryStore.getCategory3();
};

// 获取一级分类 - 选择器的输入框获取焦点触发
const getCategory1Handler = async () => {
  categoryStore.getCategory1();
};
</script>

<style scoped></style>
