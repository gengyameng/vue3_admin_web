<template>
  <div class="box">
    <div class="title">
      <p>年龄比例</p>
      <p class="bg"></p>
    </div>
    <div class="age-charts" ref="charts"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import * as echarts from "echarts";

const charts = ref();

onMounted(() => {
  const myChart = echarts.init(charts.value);
  myChart.setOption({
    tooltip: {
      trigger: "item",
    },
    legend: {
      right: 30,
      top: 40,
      orient: "vertical", // 图例组件方向设置
      textStyle: {
        color: "white",
        fontSize: 14,
      },
    },
    series: [
      {
        name: "Access Form",
        radius: ["40%", "70%"],
        type: "pie",
        avoidLabelOverlap: false,
        padAngle: -5,
        itemStyle: {
          borderRadius: 10,
          // borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          show: true,
          position: "inside",
          color: "white",
          formatter: "{d}%",
        },
        labelLine: {
          show: false,
        },
        data: [
          { value: 16, name: "10岁以下" },
          { value: 8, name: "10-18岁" },
          { value: 12, name: "10-30岁" },
          { value: 24, name: "30-40岁" },
          { value: 20, name: "40-60岁" },
          { value: 20, name: "60岁以上" },
        ],
      },
    ],
    //调整图形图标的位置
    grid: {
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
    },
  });
});
</script>

<style scoped lang="scss">
.box {
  height: 100%;
  background: url(../images/dataScreen-main-lb.png) no-repeat;
  background-size: 100% 100%;
  color: #fff;
  .title {
    font-size: 20px;

    .bg {
      width: 68px;
      height: 7px;
      background: url(../images/dataScreen-title.png) no-repeat;
      margin-top: 10px;
    }
  }
  .age-charts {
    height: 260px;
  }
}
</style>
