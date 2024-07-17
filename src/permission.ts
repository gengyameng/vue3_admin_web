//路由鉴权:鉴权,项目当中路由能不能被的权限的设置(某一个路由什么条件下可以访问、什么条件下不可以访问)
import router from "@/router";

import { WEB_TITLE } from "@/settings";

// 引入nprogress 设置进度条
import nprogress from "nprogress";
//引入进度条样式
import "nprogress/nprogress.css";

import { reqUserInfo } from "@/api/user/index";

import { constantRoutes, asyncRoutes, anyRoute } from "@/router/routes";

// 引入深拷贝方法
//@ts-expect-error
import cloneDeep from "lodash/cloneDeep";

nprogress.configure({ showSpinner: false });

//获取用户相关的小仓库内部token数据,去判断用户是否登录成功
import { useUserStore } from "@/store/modules/user";
import pinia from "./store";
const userStore = useUserStore(pinia);

//全局守卫:项目当中任意路由切换都会触发的钩子
//全局前置守卫
router.beforeEach(async (to: any, from: any, next: any) => {
  document.title = `${WEB_TITLE} - ${to.meta.title}`;
  //to:你将要访问那个路由
  //from:你从来个路由而来
  //next:路由的放行函数
  // 路由跳转前开启进度条
  nprogress.start();

  // 通过token判断是否登录
  const token = userStore.token;
  const username = userStore.user.name;
  if (token) {
    // 用户登录
    if (to.path === "/login") {
      // 不能访问登录页面
      next({ path: "/" });
    } else {
      // 其他页面可访问
      // 是否有用户信息
      if (username) {
        next();
      } else {
        // 没有用户信息-访问用户信息接口
        const { code, data } = await reqUserInfo();
        if (code === 200) {
          // 成功获取
          const user = data;

          // 保存User
          userStore.setUser(user);
          // 设置用户可访问路由（异步路由）
          const userAsyncRoutes = filterAsyncRoute(
            cloneDeep(asyncRoutes),
            data.routes,
          );
          // 设置userStore的menuRoutes 用于展示路由
          userStore.menuRoutes = [
            ...constantRoutes,
            ...userAsyncRoutes,
            anyRoute,
          ];
          // 异步路由、任意路由还未在路由器中注册
          [...userAsyncRoutes, anyRoute].forEach((route: any) => {
            router.addRoute(route);
          });

          // 刷新的时候是异步路由，有可能获取到用户信息，异步路由还没有加载完毕，出现
          // 空白效果

          next({ ...to });
        } else {
          // 获取用户信息失败
          // token失效
          // 数据清空
          // 退出登录
          userStore.setToken();
          userStore.setUser();
          next({ path: "/login", query: { redirect: to.path } });
        }
      }
    }
  } else {
    // 未登录
    if (to.path === "/login") {
      next();
    } else {
      next({ path: "/login", query: { redirect: to.path } });
    }
  }
});

//全局后置守卫
router.afterEach((to: any, from: any) => {
  // 路由跳转结束 结束进度条
  nprogress.done();
});

//全部路由组件:登录|404|任意路由|首页|数据大屏|权限管理(三个子路由)|商品管理(四个子路由)

//用户未登录:可以访问login,其余六个路由不能访问(指向login)
//用户登录成功:不可以访问login[指向首页],其余的路由可以访问

// 用于过滤当前用户需要展示的异步路由
function filterAsyncRoute(asyncRoutes: any, routes: any) {
  return asyncRoutes.filter((item: any) => {
    if (routes.includes(item.name)) {
      if (item.children && item.children.length > 0) {
        item.children = filterAsyncRoute(item.children, routes);
      }
      return true;
    }
  });
}
