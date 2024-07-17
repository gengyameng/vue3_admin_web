<template>
  <!-- 左侧游客统计 -->
  <div class="box">
    <div class="top">
      <p class="title">实时游客统计</p>
      <p class="bg"></p>
      <p class="right">可预约总量 <span>9999</span> 人</p>
    </div>
    <div class="number">
      <span v-for="(item, index) in people" :key="index">{{ item }}</span>
      
    </div>
    <!-- 盒子将来echarts展示图形图标的节点 -->
    <div class="charts" ref="charts">123</div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts';
import 'echarts-liquidfill'

const people = ref('215908人')

// 获取节点
let charts = ref()

onMounted(() => {
  // 获取echarts实例
  let myChart = echarts.init(charts.value)
  // 绘制图表
  myChart.setOption({
    // 标题组件
    title: {
      text: '水球图'
    },
    // X|Y轴组件
    // xAxis: {},
    // yAxis: {},
    // 系列组件：决定展示什么样的图形图标
    series: {
      type: 'liquidFill',
      data: [0.6],
      
      radius: '90%',
      // color: ['#29fcff'],
      // 动画
      waveAnimation: true,
      animationDuration: 3,
      animationDurationUpdate: 0,
      outline: {
        show: true,
        borderDistance: 10,
        itemStyle: {
            borderColor: '#23deec',
            borderWidth: 8,
            shadowBlur: 20,
            shadowColor: 'rgba(0, 0, 0, 0.25)'
        }
      },
    },
    // 布局组件
    grid: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0
    }
  })
})

</script>

<style scoped lang="scss">
.box {
  // width: 100%;
  // height: 100%;
  background: url(../images/dataScreen-main-lt.png) no-repeat;
  background-size: 100% 100%;
  margin-top: 10px;
  .top {
    .title {
      color: #fff;
      font-size: 20px;
    }
    .bg {
      width: 68px;
      height: 7px;
      background: url(../images/dataScreen-title.png) no-repeat;
      background-size: 100% 100%;
      margin-top: 10px;
    }
    .right {
      float: right;
      color: #fff;
      font-size: 20px;
      // padding-right: 5px;
      span {
        color: rgb(50, 205, 58);
      }
    }
  }

  .number {
    padding: 10px;
    margin-top: 50px;
    display: flex;

    span {
      flex: 1;
      height: 40px;
      text-align: center;
      line-height: 40px;
      background: url(../images/total.png) no-repeat;
      background-size: 100% 100%;
      color: #23deec;
      font-weight: 900;
    }
  }

  .charts {
    width: 100%;
    height: 270px;
    // background-color: hotpink;
  }
}
</style>