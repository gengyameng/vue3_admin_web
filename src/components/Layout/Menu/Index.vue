<template>
  <!-- 使用template标签是因为不会渲染到浏览器页面，但保证页面结构 -->
  <template v-for="(item, index) in menuList" :key="item.path">
    <!-- 无子路由 -->
    <template v-if="!item.children">
      <el-menu-item
        v-if="!item.meta.hidden"
        :index="item.path"
        @click="goRoute"
      >
        <el-icon>
          <component :is="item.meta.icon"></component>
        </el-icon>
        <template #title>
          <span>{{ item.meta.title }}</span>
        </template>
      </el-menu-item>
    </template>
    <!-- 只有一个子路由 -->
    <template v-if="item.children && item.children.length === 1">
      <el-menu-item
        v-if="!item.children[0].meta.hidden"
        :index="item.children[0].path"
        @click="goRoute"
      >
        <el-icon>
          <component :is="item.children[0].meta.icon"></component>
        </el-icon>
        <template #title>
          <span>{{ item.children[0].meta.title }}</span>
        </template>
      </el-menu-item>
    </template>
    <!-- 多个子路由 -->
    <template v-if="item.children && item.children.length > 1">
      <el-sub-menu v-if="!item.meta.hidden" :index="item.path">
        <template #title>
          <el-icon>
            <component :is="item.meta.icon"></component>
          </el-icon>
          <span>{{ item.meta.title }}</span>
        </template>
        <el-menu-item-group>
          <Menu :menuList="item.children"></Menu>
        </el-menu-item-group>
      </el-sub-menu>
    </template>
  </template>
</template>

<script setup lang="ts" name="Menu">
// 导入 useRouter
import { useRouter } from "vue-router";

// 接收父组件传递过来的menuRoutes 路由数组
defineProps(["menuList"]);

const router = useRouter();

// 点击菜单时回调
const goRoute = (vc: any) => {
  console.log(vc);

  router.push(vc.index);
};
</script>
<script lang="ts">
export default {
  name: "Menu",
};
</script>

<style scoped></style>
