<template>
  <div>
    <h3>Home插件</h3>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { reqUserInfo } from "@/api/user/index";
import { useUserStore } from "@/store/modules/user";

const userStore = useUserStore();

onMounted(async () => {
  // 获取用户信息
  const { code, data } = await reqUserInfo();
  if (code === 200) {
    // 成功获取
    const user = data.checkUser;
    // 保存User
    userStore.setUser(user);
  }
});
</script>

<style scoped></style>
