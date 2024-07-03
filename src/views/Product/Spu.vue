<template>
  <!-- 主体部分 -->
  <!-- 顶部分类 -->
  <Category :scene="scene"></Category>
  <SpuForm></SpuForm>
  <SkuForm></SkuForm>
</template>

<script setup lang="ts">
import { ref } from "vue";

// 引入卡片分类组件
import Category from "@/components/Category.vue";
import SpuForm from "@/views/Product/FormManage/SpuForm.vue";
import SkuForm from "@/views/Product/FormManage/SkuForm.vue";

// 设置主题 0:显示主体table列表 1:显示添加与编辑SPU结构 2:显示添加SKU结构
let scene = ref<number>(0);
</script>

<style scoped></style>
