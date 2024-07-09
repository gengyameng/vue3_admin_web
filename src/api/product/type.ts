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

// 分类品牌接口返回类型
export interface TrademarkByCategoryResponseData extends ResponseData {
  data: Records
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
  attrIdAndValueId?: string;  // 用户select数据绑定
}

// 分类列表响应类型
export interface AttrResponse extends ResponseData {
  data: AttrInfo[];
}


// SPU 相关类型

// SPU Value
export interface SPUValue {
  id: number;
  spuName: string; // 名称
  description: string; // SPU 描述
  category3Id: number;  // 三级分类ID
  tmId: number;  // 品牌ID
}

// SpuRecords
type SpuRecords = SPUValue[]



// 销售属性值类型
export interface SpuSaleAttrValue {
  id?: number;
  spuId?: number;
  baseSaleAttrId: number;
  saleAttrValueName: string;
  saleAttrName?: string;
  isChecked?: null
}

// 销售属性值列表
type SpuSaleAttrValueList = SpuSaleAttrValue[]

// spu销售属性类型
export interface SpuSaleAttr {
  id?: number;
  spuId?: number;
  baseSaleAttrId: number;
  saleAttrName: string;
  spuSaleAttrValueList: SpuSaleAttrValueList;
  flag?: boolean;
  saleAttrValue?: string;  // 用于添加销售属性值时input数据绑定
}

// SPU Image类型
export interface SpuImage {
  id?: number;
  spuId?: number;
  imgName?: string;
  imgUrl?: string;
  name?: string; // 上传照片墙需要 name和url
  url?: string;
}

// Spu Poster类型
export interface SpuPoster {
  id: number;
  spuId: number;
  imgName: string;
  imgUrl: string
}

// SpuInfo 类型
export interface SpuInfo {
  id?: number | null;
  spuName: string;
  description: string;
  category3Id: number | null;
  tmId?: number;
  spuSaleAttrList: SpuSaleAttr[];
  spuImageList: SpuImage[];
  spuPosterList: SpuPoster[];
}

// 销售属性类型
export interface SaleAttr {
  id: number;
  name: string;
}

// Spu列表响应数据类型
export interface SpuValueResponseData extends ResponseData {
  data: {
    records: SpuRecords;
    total: number;
    size: number;
    current: number;
    pages: number
  }
}

// SpuInfoResponse 类型
export interface SpuInfoResponseData extends ResponseData {
  data: SpuInfo
}

// 销售属性列表响应类型
export interface SaleAttrResponseData extends ResponseData {
  data: SaleAttr[]
}

// spu销售属性列响应类型
export interface SpuSaleAttrResponseData extends ResponseData {
  data: SpuSaleAttr[]
}

// spu图片列表响应类型
export interface SpuImgListResponseData extends ResponseData {
  data: SpuImage[]
}

// SKU 相关类型
// sku attr value类型
export interface SkuAttrValue {
  attrId: number; // 属性ID1
  attrName?: string; // 属性名称
  id?: number;  // 属性值 ID
  skuId?: number; // skuId
  valueId: number | null; // 属性值ID 1
  valueName?: number | null; // 属性值name
}

// sku销售属性值类型
export interface SkuSaleAttrValue {
  id?: number;
  saleAttrId: number;
  saleAttrName?: string;
  saleAttrValueId: number;
  saleAttrValueName?: string;
  skuId?: number;
  spuId?: number;
}

// sku图片类型
export interface SkuImage {
  id: number;
  imgName: string;
  imgUrl: string;
  isDefault: string;
  skuId?: number;
  spuImgId: number
}

// sku info 类型
export interface SkuInfo {
  category3Id: number | null;
  id?: number;
  skuName: string;
  spuId: number | null;
  tmId: number | null;
  // isSale: number | null;
  price: number | null;
  weight: string;
  skuAttrValueList: SkuAttrValue[];
  skuDefaultImg: string;
  skuDesc: string;
  skuSaleAttrValueList: SkuSaleAttrValue[];
}

export interface SkuInfoResponseData extends ResponseData {
  data: SkuInfo[]
}