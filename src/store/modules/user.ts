import { defineStore } from "pinia";

import { storage } from "@/utils/storage";
// 引入路由 - 动态生成菜单用
import routes from "@/router/routes";
import { RouteRecordRaw } from "vue-router";
import { userInfoType } from "@/api/user/type";

// userState 用户数据
interface userState {
  user: userInfoType;
  token: string | null;
  menuRoutes: RouteRecordRaw[];
}

// 设置默认user
const defaultUser: userState["user"] = {
  avatar: "",
  name: "",
  roles: [],
  buttons: [],
  routes: [],
};

export const useUserStore = defineStore<
  "user",
  userState,
  {},
  {
    setToken: (val?: string) => void;
    setUser: (val?: userInfoType) => void;
  }
>("user", {
  state: () => {
    return {
      token: storage.get("ATG-TOKEN"),
      menuRoutes: routes,
      user: defaultUser,
    };
  },

  getters: {},
  actions: {
    setToken(token) {
      if (token) {
        this.token = token;
        // token需要本地化存储
        storage.set("ATG-TOKEN", token);
      } else {
        this.token = null;
        storage.remove("ATG-TOKEN");
      }
    },
    setUser(val) {
      this.$state.user = val ?? defaultUser;
    },
  },
});
