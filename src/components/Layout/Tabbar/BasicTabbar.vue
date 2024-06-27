<template>
  <div class="tabbar">
    <div class="tabbar-left">
      <Breadcrumb />
    </div>
    <div class="tabbar-right">
      <TabbarSetting />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";

import Breadcrumb from "./Breadcrumb.vue";

import TabbarSetting from "./TabbarSetting.vue";
</script>
<script lang="ts">
export default {
  name: "Tabbar",
};
</script>

<style scoped lang="scss">
.tabbar {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .tabbar-left {
    display: flex;
    align-items: center;
  }
  .tabbar-right {
    display: flex;
    align-items: center;
  }
}
</style>
