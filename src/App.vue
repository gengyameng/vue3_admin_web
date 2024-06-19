<template>
  <div class="box">
    <h1>Svg测试</h1>
    <!-- 测试svg图表使用 -->
    <!-- svg:图表外层容器，内部需要与use标签结合使用 -->
    <svg>
      <!-- xlink:href指定用哪一个图标 属性值使用#icon-图标名字 -->
      <use xlink:href="#icon-pay" fill="yellow"></use>
    </svg>   
  </div>
</template>

<script setup lang="ts">

</script>

<style scoped>
.box {
  width: 600px;
  height: 400px;
  background-color: skyblue;
}
</style>
