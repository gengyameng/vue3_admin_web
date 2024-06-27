// 小仓库：关于layout组件相关配置
import { defineStore } from "pinia";

// setting数据类型
interface layoutSettingState {
  fold: boolean;
  refresh: boolean;
}

export const useLayoutSettingStore = defineStore<"setting", layoutSettingState>(
  {
    id: "setting",
    state: () => {
      return {
        fold: false, // 是否折叠，控制折叠按钮和菜单折叠
        refresh: false, // 控制刷新按钮
      };
    },
  },
);
