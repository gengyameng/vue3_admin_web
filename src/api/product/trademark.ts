// trademark品牌管理接口

import request from "@/utils/service/index";

import type { TrademarkResponseData, Trademark, TrademarkByCategoryResponseData } from "@/api/product/type";

// 项目相关接口地址
enum API {
  // 获取已有品牌接口
  TRADEMARK_URL = "/admin/product/baseTrademark/",
  // 添加
  ADD_TRADEMARK_URL = "/admin/product/baseTrademark/save",
  // 修改
  UPDATE_TRADEMARK_URL = "/admin/product/baseTrademark/update",
  // 删除
  DELETE_TRADEMARK_URL = "/admin/product/baseTrademark/remove/",
  // 分类品牌列表
  FIND_TRADEMARK_URL = '/admin/product/baseCategoryTrademark/findTrademarkList/',
  // 全部品牌列表
  ALL_TRADEMARK_URL = '/admin/product/baseTrademark/getTrademarkList'
}

// 获取已有品牌接口方法
//
export const reqHasTrademark = (page: number, limit: number) => {
  return request.get<any, TrademarkResponseData>(
    `${API.TRADEMARK_URL}${page}/${limit}`,
  );
};

// 更新或添加品牌接口
export const reqAddOrUpdateTrademark = (params: Trademark) => {
  if (params.id) {
    // 存在ID-更新
    return request.put<any, any>(API.UPDATE_TRADEMARK_URL, params);
  } else {
    // 不存在ID-添加
    return request.post<any, any>(API.ADD_TRADEMARK_URL, params);
  }
};

// 删除品牌接口
export const reqDeleteTrademark = (id: number) => {
  return request.delete<any, any>(API.DELETE_TRADEMARK_URL + id);
};

// 获取分类品牌列表
export const reqFindTrademarkList = (category3Id: number) => {
  return request.get<any, TrademarkByCategoryResponseData>(API.FIND_TRADEMARK_URL + category3Id)
}

// 获取全部品牌列表
export const reqAllTrademarkList = () => {
  return request.get<any, TrademarkByCategoryResponseData>(API.ALL_TRADEMARK_URL)
}