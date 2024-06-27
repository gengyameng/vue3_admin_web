<template>
  <!-- 路由组件出口位置 -->
  <router-view v-slot="{ Component }">
    <transition name="fade">
      <!-- 渲染layout一级路由组件的子路由 -->
      <component :is="Component" v-if="flag" />
    </transition>
  </router-view>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from "vue";
import { useLayoutSettingStore } from "@/store/modules/settings";

const layoutSettingStore = useLayoutSettingStore();

// 根据 layoutSettingStore 中的refresh 重新渲染路由
// flag控制当前组件是否销毁重建
let flag = ref(true);

// 侦听仓库内部数据是否发生变化
watch(
  () => layoutSettingStore.refresh,
  () => {
    flag.value = false;
    nextTick(() => {
      flag.value = true;
    });
  },
);
</script>
<script lang="ts">
export default {
  name: "Main",
};
</script>

<style scoped lang="scss">
.fade-enter-from {
  opacity: 0;
}
.fade-enter-active {
  transition: all 1s;
}
.fade-enter-to {
  opacity: 1;
}
</style>
