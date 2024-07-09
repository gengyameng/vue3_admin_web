// SKU接口管理
import request from "@/utils/service/index";
import type {
  SkuInfo,
  SkuListResponseData,
  AllSkuListResponseData,
  SkuInfoResponseData,
} from "@/api/product/type";

// 接口地址
enum API {
  // 添加SKU
  ADD_SKU_URL = "/admin/product/saveSkuInfo",
  // 更细你SKU
  UPDATE_SKU_URL = "/admin/product/updateSkuInfo",
  // SPU的SKu列表
  SKUINFO_BY_SPU_URL = "/admin/product/findBySpuId/",
  // SKU列表
  SKU_LIST_URL = "/admin/product/list/",
  // sku上架
  SKU_TO_SALE_URL = "/admin/product/onSale/",
  // SKU下架
  SKU_CANCEL_URL = "/admin/product/cancelSale/",
  // 删除sku
  DELETE_SKU_URL = "/admin/product/deleteSku/",
  // SKU详情
  SKU_INFO_URL = "/admin/product/getSkuInfo/",
}

// 添加SKU接口
export const reqAddSkuInfo = (params: SkuInfo) => {
  if (params.id) {
    // 更新
    return request.post(API.UPDATE_SKU_URL, params);
  } else {
    return request.post<any, any>(API.ADD_SKU_URL, params);
  }
};

// 获取SKU
export const reqSkuList = (spuId: number) => {
  return request.get<any, SkuListResponseData>(API.SKUINFO_BY_SPU_URL + spuId);
};

// 获取全部SKU列表
export const reqAllSkuList = (page: number, limit: number) => {
  return request.get<any, AllSkuListResponseData>(
    API.SKU_LIST_URL + `${page}/${limit}`,
  );
};

// SKU 上架
export const reqSaleSku = (skuId: number) => {
  return request.get<any, any>(API.SKU_TO_SALE_URL + skuId);
};

// SKU 下架
export const reqCancelSku = (skuId: number) => {
  return request.get<any, any>(API.SKU_CANCEL_URL + skuId);
};

// 删除SKu
export const reqDeleteSku = (skuId: number) => {
  return request.delete<any, any>(API.DELETE_SKU_URL + skuId);
};

// 获取指定SKU
export const reqFindSku = (skuId: number) => {
  return request.get<any, SkuInfoResponseData>(API.SKU_INFO_URL + skuId);
};
