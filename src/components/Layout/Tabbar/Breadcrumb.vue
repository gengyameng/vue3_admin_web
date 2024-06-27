<template>
  <!-- 显示/折叠图标 -->
  <el-icon style="margin-right: 10px; cursor: pointer" @click="changeFold">
    <component :is="layoutSettingStore.fold ? 'Fold' : 'Expand'"></component>
  </el-icon>
  <!-- 面包屑 -->
  <el-breadcrumb separator-icon="ArrowRight">
    <el-breadcrumb-item
      v-for="(item, index) in route.matched"
      :key="index"
      v-show="item.meta.title"
      :to="item.path"
    >
      <div class="breadcrumb-item">
        <el-icon>
          <component :is="item.meta.icon" v-if="item.meta.icon"></component>
        </el-icon>
        <span>{{ item.meta.title }}</span>
      </div>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup lang="ts">
// 导入useLayoutSettingStore
import { useLayoutSettingStore } from "@/store/modules/settings";

// 引入 useRoute
import { useRoute } from "vue-router";

const route = useRoute();

const layoutSettingStore = useLayoutSettingStore();

// 控制折叠图标
const changeFold = () => {
  layoutSettingStore.fold = !layoutSettingStore.fold;
};
</script>

<style scoped>
.breadcrumb-item {
  display: flex;
  align-items: center;
  cursor: pointer;
}
</style>
