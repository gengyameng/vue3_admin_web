import { createApp } from "vue";
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from "@/App.vue";

//@ts-ignore忽略当前文件ts类型的检测否则有红色提示(打包会失败)
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

// console.log(import.meta.env);

const app = createApp(App)

// 安装element-plus插件
app.use(ElementPlus, {
  locale: zhCn
})

// svg插件需要配置代码
import 'virtual:svg-icons-register'
app.mount("#app");
