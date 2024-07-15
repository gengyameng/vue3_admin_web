<template>
  <!-- 卡片：头像+名称 -->
  <el-card>
    <div class="header-box">
      <img :src="userStore.user.avatar" alt="" class="avatar" />
      <div>
        <div class="title">{{ getTimeStr() }}好{{ userStore.user.name }}</div>

        <p class="app-title">{{ app_title }}</p>
      </div>
    </div>
  </el-card>
  <!-- svg图 -->
  <div class="footer-box">
    <SvgIcon name="welcome" width="600px" height="300px"></SvgIcon>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

import SvgIcon from "@/components/SvgIcon/index.vue";

import { useUserStore } from "@/store/modules/user";
import { getTimeStr } from "@/utils/tools";

const app_title = import.meta.env.VITE_APP_TITLE;

const userStore = useUserStore();
</script>

<style scoped lang="scss">
.header-box {
  display: flex;
  height: 120px;
  align-items: center;

  .avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    margin-right: 15px;
  }
  .title {
    font-size: 25px;
    font-weight: 900;
    margin-bottom: 25px;
  }
  .app-title {
    font-style: italic;
    color: #bbb;
  }
}
.footer-box {
  display: flex;
  justify-content: center;
  margin-top: 70px;
}
</style>
