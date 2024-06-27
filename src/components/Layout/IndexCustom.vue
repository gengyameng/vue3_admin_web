<!-- 手写布局 -->
<template>
  <div class="layout-container">
    <!-- 左侧菜单 -->
    <div class="layout-slider">左侧菜单</div>
    <!-- 头部导航 -->
    <div class="layout-tabbar">顶部导航</div>
    <!-- 内容区域 -->
    <div class="layout-main">
      内容展示区域
      <p style="height: 1000px"></p>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.layout-container {
  width: 100%;
  height: 100vh;
  background-color: red;

  // 左侧菜单
  .layout-slider {
    width: $base-menu-width;
    height: 100vh;
    background: $base-menu-background;
  }

  // 顶部导航
  .layout-tabbar {
    position: fixed;
    top: 0;
    left: $base-menu-width;
    width: calc(100% - $base-menu-width);
    height: $base-tabbar-height;
    background-color: skyblue;
  }

  // 内容区域
  .layout-main {
    position: absolute;
    top: $base-tabbar-height;
    left: $base-menu-width;
    background-color: green;
    width: calc(100% - $base-menu-width);
    height: calc(100vh - $base-tabbar-height);
    padding: 20px;
    overflow: auto;
  }
}
</style>
