<template>
  <!-- element-plus container 布局容器 -->
  <div class="common-layout">
    <el-container>
      <el-aside :class="{ fold: layoutSettingStore.fold ? true : false }">
        <!-- 左侧菜单 -->
        <Logo></Logo>
        <!-- 展示菜单 -->
        <!-- 滚动组件 -->
        <el-scrollbar ref="scrollbarRef" class="scrollbar">
          <!-- 菜单组件 -->
          <el-menu
            background-color="#001529"
            text-color="#fff"
            :default-active="route.path"
            :collapse="layoutSettingStore.fold"
          >
            <!-- 根据路由动态生成菜单 -->
            <Menu :menuList="userStore.menuRoutes"></Menu>
          </el-menu>
        </el-scrollbar>
      </el-aside>
      <el-container>
        <el-header>
          <Tabbar></Tabbar>
        </el-header>
        <el-main>
          <Main></Main>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
// 引入 route
import { useRoute } from "vue-router";
// 引入logo组件
import Logo from "@/components/Layout/Logo/Index.vue";
// 引入Menu菜单组件
import Menu from "@/components/Layout/Menu/Index.vue";

// 引入Tabbar组件
import Tabbar from "@/components/Layout/Tabbar/BasicTabbar.vue";

// 右侧展示区组件
import Main from "@/components/Layout/Main/Index.vue";

// 引入user小仓库
import { useUserStore } from "@/store/modules/user";

// 引入useLayoutSettingStore
import { useLayoutSettingStore } from "@/store/modules/settings";

const layoutSettingStore = useLayoutSettingStore();

const userStore = useUserStore();

const route = useRoute();
</script>

<script lang="ts">
export default {
  name: "Layout",
};
</script>

<style scoped lang="scss">
.common-layout {
  width: 100%;
  height: 100vh;

  // 左侧菜单
  .el-aside {
    width: $base-menu-width;
    height: 100vh;
    background: $base-menu-background;
    color: #fff;
    overflow: hidden;
    transition: all 0.4s;
    .scrollbar {
      width: 100%;
      height: calc(100vh - $base-menu-logo-height);

      .el-menu {
        border-right: none;
      }
    }
    &.fold {
      width: $base-menu-min-width;
    }
  }

  // 顶部导航
  .el-header {
    height: $base-tabbar-height;
    border-bottom: 1px solid #999;
  }

  // 内容区域
  .el-main {
    // background-color: green;
    height: calc(100vh - $base-tabbar-height);
  }
}
</style>
