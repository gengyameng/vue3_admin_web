<template>
  <div class="box">
    <!-- 顶部message -->
    <div class="warn-message">平台高峰预警信息（2条）</div>
    <!-- 标题 -->
    <div class="title">景区实时客流量</div>
    <!-- 地图 -->
    <div class="charts" ref="map"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import * as echarts from "echarts";
// 引入中国地图的JSON数据
import chinaJSON from "./china.json";

// 获取DOM元素
const map = ref();
// 注册中国地图
echarts.registerMap("china", chinaJSON as any);

onMounted(() => {
  const myChart = echarts.init(map.value);
  myChart.setOption({
    //地图组件
    geo: {
      map: "china", //中国地图
      roam: true, //鼠标缩放的效果
      //地图的位置调试
      left: 150,
      top: 150,
      right: 150,
      zoom: 1.2,
      bottom: 0,
      //地图上的文字的设置
      label: {
        show: true, //文字显示出来
        color: "white",
        fontSize: 14,
      },

      itemStyle: {
        //每一个多边形的样式
        color: {
          type: "linear",
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: "red", // 0% 处的颜色
            },
            {
              offset: 1,
              color: "blue", // 100% 处的颜色
            },
          ],
          global: false, // 缺省为 false
        },
        opacity: 0.8,
      },
      //地图高亮的效果
      emphasis: {
        itemStyle: {
          color: "red",
        },
        label: {
          fontSize: 40,
        },
      },
    },
    //布局位置
    grid: {
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
    },
    series: [
      {
        type: "lines", //航线的系列
        data: [
          {
            coords: [
              [116.405285, 39.904989], // 起点
              [119.306239, 26.075302], // 终点
            ],
            // 统一的样式设置
            lineStyle: {
              color: "#fff",
              width: 2,
            },
          },
          {
            coords: [
              [116.405285, 39.904989], // 起点
              [114.298572, 30.584355], // 终点
            ],
            // 统一的样式设置
            lineStyle: {
              color: "#fff",
              width: 2,
            },
          },
        ],
        //开启动画特效
        effect: {
          show: true,
          symbol: "arrow",
          color: "black",
          symbolSize: 10,
        },
      },
    ],
  });
});
</script>

<style scoped lang="scss">
.box {
  .warn-message {
    width: 622px;
    height: 44px;
    margin: 32px auto;
    background: url(../images/dataScreen-header-warn-bg.png) no-repeat;
    color: #fff;
    font-size: 18px;
    text-align: center;
    line-height: 44px;
  }
  .title {
    width: 320px;
    height: 30px;
    background: url(../images/map-title-bg.png) no-repeat;
    background-size: 100% 100%;
    color: #fff;
    font-size: 18px;
    letter-spacing: 3px;
    line-height: 30px;
    padding-left: 30px;
  }
  .charts {
    height: calc(100% - 74px);
  }
}
</style>
