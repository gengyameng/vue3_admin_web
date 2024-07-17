// 自定义指令
import pinia from "@/store";
import { useUserStore } from "@/store/modules/user";

const userStore = useUserStore(pinia);

export const isHasButton = (app: any) => {
  // 全局自定义指令：实现按钮的权限
  app.directive("has", {
    mounted(el: any, options: any) {
      // 自定义指令右侧的数值：如果在用户信息buttons数组当中没有，则从DOM树上去掉

      if (!userStore.user.buttons.includes(options.value)) {
        el.parentNode.removeChild(el);
      }
    },
  });
};
