// 通过 vue-router插件实现模版路由配置
import { createRouter, createWebHistory } from "vue-router";
import routes from "@/router/routes";

const router = createRouter({
  // 路由模式
  history: createWebHistory(),
  routes: routes,
  // 滚动行为
  scrollBehavior() {
    return {
      left: 0,
      top: 0,
    };
  },
});

export default router;
