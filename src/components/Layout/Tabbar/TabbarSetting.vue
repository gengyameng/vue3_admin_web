<template>
  <!-- 三个按钮 + 一个用户头像和用户名 -->
  <!-- 刷新 -->
  <div class="tabbar-btn">
    <el-button icon="Refresh" circle @click="updateRefresh" />
  </div>
  <!-- 全屏 -->
  <div class="tabbar-btn">
    <el-button icon="FullScreen" circle @click="fullScreen" />
  </div>
  <!-- 设置 -->
  <div class="tabbar-btn">
    <el-button icon="Setting" circle />
  </div>
  <!-- 用户头像 -->
  <img :src="userStore.user.avatar" alt="" style="width: 32px; height: 32px" />
  <!-- 下拉框 -->
  <el-dropdown>
    <span class="el-dropdown-link">
      {{ userStore.user.username }}
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from "vue-router";
import { useLayoutSettingStore } from "@/store/modules/settings";
import { useUserStore } from "@/store/modules/user";

const router = useRouter();

const route = useRoute();

const userStore = useUserStore();

const layoutSettingStore = useLayoutSettingStore();

// 更新刷新按钮
const updateRefresh = () => {
  layoutSettingStore.refresh = !layoutSettingStore.refresh;
};

// 全屏
const fullScreen = () => {
  // document.fullscreenElement 返回当前是否全屏模式
  let full = document.fullscreenElement;
  if (!full) {
    // 切换到全屏
    document.documentElement.requestFullscreen();
  } else {
    // 退出全屏
    document.exitFullscreen();
  }
};

// 退出登录
const logout = () => {
  // 发送退出登录请求
  // 仓库相关数据清空
  // 跳转到登录页面
  userStore.setToken();
  userStore.setUser();
  router.push({
    path: "/login",
    query: {
      redirect: route.path,
    },
  });
};
</script>

<style scoped lang="scss">
.tabbar-btn {
  margin-left: 10px;
}

img {
  margin-left: 20px;
  margin-right: 10px;
  border-radius: 50%;
}
</style>
