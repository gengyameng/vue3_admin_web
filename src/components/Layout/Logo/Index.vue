<template>
  <div class="logo">
    <img :src="WEB_LOGO" alt="" />
    <p>{{ WEB_TITLE }}</p>
  </div>
</template>

<script setup lang="ts">
// 引入项目logo标题文件
import { WEB_TITLE, WEB_LOGO } from "@/settings";
</script>
<script lang="ts">
export default {
  name: "Logo",
};
</script>

<style scoped lang="scss">
.logo {
  width: 100%;
  height: $base-menu-logo-height;
  display: flex;
  align-items: center;
  padding: 10px;

  img {
    width: 40px;
    height: 40px;
  }

  p {
    font-size: $base-logo-title-fontSize;
    margin-left: 10px;
  }
}
</style>
