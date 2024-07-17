<template>
  <!-- 数据大屏顶部Top -->
  <div class=top>
    <!-- 三部分 -->
    <div class="left">
      <!-- 首页按钮 -->
      <span class="lbtn" @click="goHome">首页</span>
    </div>
    <div class="center">
      <div class="title">智慧旅游可视化大数据平台</div>
    </div>
    <div class="right">
      <span class="rbtn">统计报告</span>
      <span class="time">当前时间：{{ time }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import moment from 'moment'

// 路由器对象
const router = useRouter()

// 存储当前时间
let time = ref(moment().format('YYYY年MM月DD日 hh:mm:ss'))
let timer = ref(0)  // 用于清除定时器


// 返回首页按钮
const goHome = () => {
  router.push('/home')
}

// 组件挂载完毕更新当前时间
onMounted(() => {
  timer.value = setInterval(() => {
    time.value = moment().format('YYYY年MM月DD日 hh:mm:ss')
  }, 1000)
}) 

// 组件销毁前清除定时器
onBeforeUnmount(() => {
  clearInterval(timer.value)
})


</script>

<style scoped lang="scss">
.top {
  display: flex;
  width: 100%;
  height: 40px;

  .left {
    flex: 1.5;
    display: flex;
    justify-content: flex-end;
    background: url(../images/dataScreen-header-left-bg.png) no-repeat;
    background-size: cover;
    
    .lbtn {
      width: 150px;
      height: 40px;
      background: url(../images/dataScreen-header-btn-bg-l.png) no-repeat;
      background-size: 100% 100%;
      text-align: center;
      line-height: 40px;
      font-size: 20px;
      color: #29fcff;
      cursor: pointer;
    }
  }
  .right {
    flex: 1.5;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: url(../images/dataScreen-header-right-bg.png) no-repeat;
    background-size: cover;
    font-size: 20px;
    color: #29fcff;

    .rbtn {
      width: 150px;
      height: 40px;
      background: url(../images/dataScreen-header-btn-bg-r.png) no-repeat;
      background-size: cover;
      text-align: center;
      line-height: 40px;
      
    }
    .time {
      // font-size: 20px;
      // color: #29fcff;
      margin-right: 30px;
    }
  }
  .center {
    flex: 2;
    .title {
      width: 100%;
      height: 74px;
      background: url(../images/dataScreen-header-center-bg.png) no-repeat;
      background-size: 100% 100%;
      text-align: center;
      line-height: 74px;
      color: #29fcff;
      font-size: 30px;
    }
   
  }
}
</style>