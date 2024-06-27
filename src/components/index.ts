// 用于注册components文件夹下内部全部全局组件！
import SvgIcon from "@/components/SvgIcon/index.vue";
import type { App, Component } from "vue";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";

const components: { [name: string]: Component } = { SvgIcon };

export default {
  install(app: App) {
    Object.keys(components).forEach((key: string) => {
      app.component(key, components[key]);
    });
    // 将 element-plus提供的图标注册为全局组件
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component);
    }
  },
};
