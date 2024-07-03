// 属性管理接口
import request from "@/utils/service/index";
import {
  BaseCategoryResponse,
  BaseCategory2Response,
  BaseCategory3Response,
  AttrResponse,
  AttrInfo,
} from "@/api/product/type";

// 项目相关接口地址
enum API {
  // category1 获取接口
  CATEGORY1_URL = "/admin/product/getCategory1",
  CATEGORY2_URL = "/admin/product/getCategory2/",
  CATEGORY3_URL = "/admin/product/getCategory3/",
  // 属性列表接口地址
  ATTR_INFO_LIST_URL = "/admin/product/attrInfoList/",
  // 属性保存接口地址
  SAVE_ATTR_INFO_URL = "/admin/product/saveAttrInfo",
  // 删除属性接口地址
  DELETE_ATTR_URL = "/admin/product/deleteAttr/",
}

// 获取category1 一级分类接口
export const reqCategory1List = () => {
  return request.get<any, BaseCategoryResponse>(API.CATEGORY1_URL);
};

// 获取二级分类即可
export const reqCategory2List = (category1Id: number | null) => {
  return request.get<any, BaseCategory2Response>(
    API.CATEGORY2_URL + category1Id,
  );
};

// 获取三级级分类即可
export const reqCategory3List = (category2Id: number | null) => {
  return request.get<any, BaseCategory3Response>(
    API.CATEGORY3_URL + category2Id,
  );
};

// 获取属性列表接口
export const reqAttrList = (
  category1Id: number | null,
  category2Id: number | null,
  category3Id: number | null,
) => {
  return request.get<any, AttrResponse>(
    API.ATTR_INFO_LIST_URL + `${category1Id}/${category2Id}/${category3Id}`,
  );
};

// 属性保存接口
export const reqSaveAttrInfo = (data: AttrInfo) => {
  return request.post<any, any>(API.SAVE_ATTR_INFO_URL, data);
};

// 删除属性接口
export const reqDeleteAttr = (attrId: number) => {
  return request.delete<any, any>(API.DELETE_ATTR_URL + attrId);
};
