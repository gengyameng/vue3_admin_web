// 路由规则
import { RouteRecordRaw } from "vue-router";
import Layout from "@/components/Layout/Index.vue";

const routes: Array<RouteRecordRaw> = [
  {
    // 登录
    path: "/login",
    component: () => import("@/views/Login/Index.vue"),
    name: "Login",
    meta: {
      title: "登录", // 菜单标题
      hidden: true, // 路由标题在菜单中是否隐藏，true：隐藏，false：显示,
      icon: "Promotion", // 菜单左侧图标，支持element-plus所有图标
    },
  },
  {
    // 登录成功后展示数据的路由
    path: "/",
    component: Layout,
    name: "Layout",
    redirect: "/home",
    meta: {
      title: "", // 菜单标题
      hidden: false,
      icon: "",
    },
    children: [
      {
        path: "/home",
        component: () => import("@/views/Home/Index.vue"),
        name: "Home",
        meta: {
          title: "首页", // 菜单标题
          hidden: false,
          icon: "HomeFilled",
        },
      },
    ],
  },
  {
    path: "/screen",
    component: () => import("@/views/Screen/Index.vue"),
    name: "Screen",
    meta: {
      title: "数据大屏",
      hidden: false,
      icon: "DataLine",
    },
  },
  {
    path: "/acl",
    component: Layout,
    name: "Acl",
    meta: {
      title: "权限管理",
      hidden: false,
      icon: "Lock",
    },
    redirect: "/acl/user",
    children: [
      {
        path: "/acl/user",
        component: () => import("@/views/Acl/User.vue"),
        name: "User",
        meta: {
          title: "用户管理",
          hidden: false,
          icon: "User",
        },
      },
      {
        path: "/acl/role",
        component: () => import("@/views/Acl/Role.vue"),
        name: "Role",
        meta: {
          title: "角色管理",
          hidden: false,
          icon: "UserFilled",
        },
      },
      {
        path: "/acl/permission",
        component: () => import("@/views/Acl/Permission.vue"),
        name: "Permission",
        meta: {
          title: "权限管理",
          hidden: false,
          icon: "Monitor",
        },
      },
    ],
  },
  {
    path: "/product",
    component: Layout,
    name: "Product",
    redirect: "/product/trademark",
    meta: {
      title: "商品管理",
      icon: "Goods",
      hidden: false,
    },
    children: [
      {
        path: "/product/trademark",
        component: () => import("@/views/Product/Trademark.vue"),
        name: "Trademark",
        meta: {
          title: "品牌管理",
          icon: "ShoppingCartFull",
        },
      },
      {
        path: "/product/attr",
        component: () => import("@/views/Product/Attr.vue"),
        name: "Attr",
        meta: {
          title: "属性管理",
          icon: "Tools",
        },
      },
      {
        path: "/product/spu",
        component: () => import("@/views/Product/Spu.vue"),
        name: "Spu",
        meta: {
          title: "Spu管理",
          icon: "Calendar",
        },
      },
      {
        path: "/product/sku",
        component: () => import("@/views/Product/Sku.vue"),
        name: "Sku",
        meta: {
          title: "Sku管理",
          icon: "Goods",
        },
      },
    ],
  },
  {
    // 404
    path: "/404",
    component: () => import("@/views/Exception/404.vue"),
    name: "404",
    meta: {
      title: "404", // 菜单标题
      hidden: true,
      icon: "QuestionFilled",
    },
  },
  {
    // 其他无法匹配的路由
    path: "/:pathMatch(.*)*",
    redirect: "/404",
    name: "any",
    meta: {
      title: "其他", // 菜单标题
      hidden: true,
      icon: "MoreFilled",
    },
  },
];

// 路由规则导出
export default routes;
