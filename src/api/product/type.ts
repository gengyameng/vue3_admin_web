// 商品管理模块接口类型管理

import { InputNumberEmits } from "element-plus/lib/components/index.js";

// 定义全部接口返回数据都拥有的ts类型
export interface ResponseData {
  code: number;
  message: string;
  ok: boolean;
}

// 已有品牌ts数据类型
export interface Trademark {
  id?: number;
  tmName: string;
  logoUrl: string;
}

// 品牌记录类型
export type Records = Trademark[];
// 已有的品牌接口返回类型
export interface TrademarkResponseData extends ResponseData {
  data: {
    records: Records;
    total: number;
    size: number;
    current: number;
    orders: string[];
    optimizeCountSql: boolean;
    hitCount: boolean;
    countId: number | null;
    maxLimit: number | null;
    searchCount: boolean;
    pages: number;
  };
}

// 基础一级分类类型
export interface BaseCategory {
  id: number;
  name: string;
  createTime: string;
  updateTime: string;
}

// 二级分类类型
export interface BaseCategory2 extends BaseCategory {
  category1Id: InputNumberEmits;
}

// 三级分类类型
export interface BaseCategory3 extends BaseCategory {
  category2Id: number;
}

// 获取一级分类返回响应类型
export interface BaseCategoryResponse extends ResponseData {
  data: BaseCategory[];
}

// 获取二级分类返回响应类型
export interface BaseCategory2Response extends ResponseData {
  data: BaseCategory2[];
}

// 获取三级分类返回响应类型
export interface BaseCategory3Response extends ResponseData {
  data: BaseCategory3[];
}

// 属性值对象
export interface AttrValue {
  id?: number;
  createTime?: string | null;
  updateTime?: string | null;
  valueName: string;
  attrId?: number;
  flag?: boolean;
}

type AttrValueList = AttrValue[];

// 属性对象类型
export interface AttrInfo {
  id?: number;
  createTime?: string | null;
  updateTime?: string | null;
  attrName: string;
  categoryId: number | null; // 三级分类ID
  categoryLevel: number | null;
  attrValueList: AttrValueList;
}

// 分类列表响应类型
export interface AttrResponse extends ResponseData {
  data: AttrInfo[];
}
