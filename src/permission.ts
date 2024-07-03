//路由鉴权:鉴权,项目当中路由能不能被的权限的设置(某一个路由什么条件下可以访问、什么条件下不可以访问)
import router from "@/router";

import { WEB_TITLE } from "@/settings";

// 引入nprogress 设置进度条
import nprogress from "nprogress";
//引入进度条样式
import "nprogress/nprogress.css";

import { reqUserInfo } from "@/api/user/index";

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
          next();
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
