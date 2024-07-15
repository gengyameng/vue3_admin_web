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
    <!-- <el-button icon="Setting" circle /> -->
    <el-popover
      placement="bottom"
      title="主题设置"
      :width="300"
      trigger="hover"
    >
      <!-- Popover内嵌HTML文本 -->
      <el-form>
        <el-form-item label="主题颜色">
          <el-color-picker
            v-model="color"
            show-alpha
            :predefine="predefineColors"
            @change="setColor"
          />
        </el-form-item>
        <el-form-item label="暗黑模式">
          <el-switch
            v-model="dark"
            inline-prompt
            active-icon="MoonNight"
            inactive-icon="Sunny"
            @change="changeDark"
          />
        </el-form-item>
      </el-form>

      <!-- 触发Popover显示的HTML元素 -->
      <template #reference>
        <el-button icon="Setting" circle />
      </template>
    </el-popover>
  </div>
  <!-- 用户头像 -->
  <img :src="userStore.user.avatar" alt="" style="width: 32px; height: 32px" />
  <!-- 下拉框 -->
  <el-dropdown>
    <span class="el-dropdown-link">
      {{ userStore.user.name }}
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
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useLayoutSettingStore } from "@/store/modules/settings";
import { useUserStore } from "@/store/modules/user";
import { reqLogout } from "@/api/user";

const router = useRouter();

const route = useRoute();

const userStore = useUserStore();

const layoutSettingStore = useLayoutSettingStore();

// 主题颜色
const color = ref("#1e90ff");
const predefineColors = ref([
  "#ff4500",
  "#ff8c00",
  "#ffd700",
  "#90ee90",
  "#00ced1",
  "#1e90ff",
  "#c71585",
  "rgba(255, 69, 0, 0.68)",
  "rgb(255, 120, 0)",
  "hsv(51, 100, 98)",
  "hsva(120, 40, 94, 0.5)",
  "hsl(181, 100%, 37%)",
  "hsla(209, 100%, 56%, 0.73)",
  "#c7158577",
]);

// 收集开关数据
const dark = ref<boolean>(false);

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
const logout = async () => {
  // 发送退出登录请求
  // 仓库相关数据清空
  // 跳转到登录页面
  await reqLogout();
  userStore.setToken();
  userStore.setUser();
  router.push({
    path: "/login",
    query: {
      redirect: route.path,
    },
  });
};

// switch开关的change事件，进行暗黑模式切换
const changeDark = () => {
  // 获取根节点
  let html = document.documentElement;
  // 判断HTML标签是否有类名 dark
  dark.value ? (html.className = "dark") : (html.className = "");
};

// 设置主题颜色
const setColor = () => {
  console.log(color.value);

  // 通过js修改根节点的样式对象属性与属性值
  const html = document.documentElement;

  html.style.setProperty("--el-color-primary", color.value);
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
