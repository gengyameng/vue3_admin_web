<template>
  <!-- 左侧男女比例统计 -->
  <div class="box">
    <div class="title">
      <p>男女比例</p>
      <p class="bg"></p>
    </div>
    <div class="sex">
      <div class="man">
        <span>男士</span>
        <img src="../images/man.png" alt="">
      </div>
      <div class="women">
        <span>女士</span>
        <img src="../images/woman.png" alt="">
      </div>
    </div>
    <div class="rate">
      <p>男士60%</p>
      <p>女士40%</p>
    </div>
    <div class="sex-charts" ref="charts"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'

const charts = ref()

onMounted(() => {
  const myChart = echarts.init(charts.value)

  myChart.setOption({
    // title: {
    //   text: '男女比例',
    //   textStyle: {
    //     color: 'skyblue'
    //   }
    // },
    xAxis: {
      show: false,
      min: 0,
      max: 100
    },
    yAxis: {
      show: false,
      type: 'category'
    },
    series: [
      {
        type: 'bar',
        data:[60],
        barWidth: 20,
        z: 100,
        itemStyle: {
          color: 'skyblue',
          borderRadius: 20
        }
      },
      {
        type: 'bar',
        data:[100],
        barWidth: 20,
        barGap: '-100%',
        itemStyle: {
          color: 'hotpink',
          borderRadius: 20
        }
      }
    ],
    grid: {
      left: 0,
      top: 0,
      right: 0,
      bottom: 0
    }
  })
})

</script>

<style scoped lang="scss">
.box {
  box-sizing: border-box;
  // height: 100%;
  width: 100%;
  background: url(../images/dataScreen-main-lc.png) no-repeat;
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
  .sex {
    display: flex;
    justify-content: space-between;
    font-size: 18px;
    padding: 0 80px;
    padding-top: 40px;
    .man {
      width: 110px;
      height: 116px;
      background: url(../images/man-bg.png);
      display: flex;
      flex-direction: column;
      align-items: center;
      img {
        margin-top: 20px;
      }
    }
    .women {
      width: 110px;
      height: 115px;
      background: url(../images/woman-bg.png);
      display: flex;
      flex-direction: column;
      align-items: center;
      img {
        margin-top: 20px;
      }
    }
  }
  .rate {
    padding: 0 80px;
    margin-top: 15px;
    display: flex;
    justify-content: space-between;
  }
  .sex-charts {
    height: 100px;
    padding: 0 80px;
  }
 
}
</style>