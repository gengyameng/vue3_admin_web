import { createApp } from "vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import App from "@/App.vue";
// 引入全局样式
import "@/styles/index.scss";

//@ts-ignore忽略当前文件ts类型的检测否则有红色提示(打包会失败)
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
import globalComponent from "@/components/index";

// 暗黑模式需要的样式
import "element-plus/theme-chalk/dark/css-vars.css";

// svg插件需要配置代码
import "virtual:svg-icons-register";

// 引入路由
import router from "@/router/index";

// 引入 store
import store from "@/store/index";

// console.log(import.meta.env)

const app = createApp(App);

// 安装element-plus插件
app.use(ElementPlus, {
  locale: zhCn,
});
// 全局组件使用
app.use(globalComponent);

// 注册路由
app.use(router).use(store);

// 引入路由鉴权文件
import "@/permission";

// 引入自定义指令
import { isHasButton } from "@/directive/has";
isHasButton(app);

app.mount("#app");
