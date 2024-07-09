// 商品分类小仓库
import { defineStore } from "pinia";

import {
  reqCategory1List,
  reqCategory2List,
  reqCategory3List,
} from "@/api/product/attr";
import type {
  BaseCategory,
  BaseCategory2,
  BaseCategory3,
} from "@/api/product/type";

interface categoryState {
  category1Arr: BaseCategory[];
  category1Id: number | null;
  category2Arr: BaseCategory2[];
  category2Id: number | null;
  category3Arr: BaseCategory3[];
  category3Id: number | null;
}

export const useCategoryStore = defineStore<
  "category",
  categoryState,
  {},
  {
    getCategory1: () => void;
    getCategory2: () => void;
    getCategory3: () => void;
  }
>("category", {
  state: () => {
    return {
      // 一级分类
      category1Arr: [],
      // 一级分类选中ID
      category1Id: null,
      // 二级分类
      category2Arr: [],
      category2Id: null,
      // 三级分类
      category3Arr: [],
      category3Id: null,
    };
  },
  getters: {},
  actions: {
    // 获取一级分类
    async getCategory1() {
      const res = await reqCategory1List();
      if (res.code === 200) {
        this.category1Arr = res.data;
      }
    },
    // 设置二级分类
    async getCategory2() {
      const res = await reqCategory2List(this.category1Id);
      if (res.code === 200) {
        this.category2Arr = res.data;
      }
    },

    // 三级分类
    async getCategory3() {
      const res = await reqCategory3List(this.category2Id);
      if (res.code === 200) {
        this.category3Arr = res.data;
      }
    },
  },
});
