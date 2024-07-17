<template>
  <div class="container">
    <!-- 数据大屏展示内容区域 -->
    <div class="screen" ref="screen">
      <!-- 数据大屏  上下两部分-->
      <!-- 头部 -->
      <div class="top">
        <Top/>
      </div>
      <!-- 底部 -->
      <div class="bottom">
        <!-- 三部分 left center right -->
        <div class="left">
          <!-- 三部分 tourist:游客 sex:性别 age: 年龄 -->
          <!-- <div class="tourist">
            <Tourist></Tourist>
          </div> -->
          <!-- <div class="sex">
            <Sex></Sex>
          </div> -->
          <!-- <div class="age">
            <Age></Age>
          </div> -->
          <Tourist class="tourist"></Tourist>
          <Sex class="sex"></Sex>
          <Age class="age"></Age>
        </div>
        <div class="center">
          <Map class="map"></Map>
          <Line class="line"></Line>
        </div>
        <div class="right">
          <Rank class="rank"></Rank>
          <!-- <div class="year">year</div>
          <div class="count">count</div> -->
          <Year class="year"></Year>
          <Counter class="count"></Counter>
        </div>
      </div>
    </div>
    
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

import Top from './components/Top.vue'
// 左侧三个组件
import Tourist from './components/Tourist.vue'
import Sex from './components/Sex.vue'
import Age from './components/Age.vue'
// 中间两个组件
import Map from './components/Map.vue'
import Line from './components/Line.vue'
// 右侧三个组件
import Rank from './components/Rank.vue'
import Year from './components/Year.vue'
import Counter from './components/Counter.vue'

// 获取数据大屏展示内容盒子的DOM元素
const screen = ref()

onMounted(() => {
  console.log(getScale());
  
  // screen.value.style.transform = `scale(${getScale()})`
  screen.value.style.transform = `scale(${getScale()}) translate(-50%, -50%)`
})

// 定义大屏缩放比例
function getScale (w = 1920, h = 1080) {
  const ww = window.innerWidth / w 
  const wh = window.innerHeight / h

  console.log(ww, wh);
  

  return ww < wh ? ww : wh
} 

// 监听视口变化
window.onresize = () => {
  screen.value.style.transform = `scale(${getScale()}) translate(-50%, -50%)`
}


</script>

<style scoped lang="scss">
.container {
  width: 100vw;
  height: 100vh;
  // background-color: green;
  background: url(./images/bg.png) no-repeat;
  background-size: cover;
  
  .screen {
    position: fixed;
    width: 1920px;
    height: 1080px;
    // background-color: skyblue;
    left: 50%;
    top: 50%;
    transform-origin: left top;

    // 头部 Top
    .top {
      width: 100%;
      height: 40px;
      // background-color: hotpink;
    }
    // Bottom
    .bottom {
      display: flex;
      // margin: 0 30px;
      .left {
        flex: 1;
        height: 1040px;
        display: flex;
        flex-direction: column;
        .ourist {
          flex: 1.5;
          // background-color: green;
        }
        .sex {
          flex: 1;
          // background-color: pink;
          margin: 20px 0;
        }
        .age {
          flex: 1;
          // background-color: orange;
        }
      }
      .right {
        flex: 1;
        display: flex;
        flex-direction: column;
        // margin-left: 40px;
        .rank {
          flex: 1.5;
        }

        .year {
          flex: 1;

        }
        .count {
          flex: 1;
        }
      }
      .center {
        flex: 2;
        display: flex;
        flex-direction: column;
        padding: 0 30px;
        .map {
          flex: 4;
        }
        .line {
          flex: 1.5;
        }
      }
    }
  }
}
</style>
