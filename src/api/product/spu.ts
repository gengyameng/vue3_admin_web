// SPU接口管理
import request from '@/utils/service/index'
import type { 
  SpuValueResponseData,
  SpuInfoResponseData,
  SpuInfo,
  SaleAttrResponseData,
  SpuSaleAttrResponseData,
  SpuImgListResponseData
} from '@/api/product/type'

// 接口地址
enum API {
  // SPU商品列表
  SPU_LIST_URL = '/admin/product/',
  // SPU详情
  SPU_INFO_URL = '/admin/product/getSpuInfo/',
  // 销售属性列表
  SALE_ATTR_LIST_URL = '/admin/product/baseSaleAttrList',
  // 添加SPU
  ADD_SPU_URL = '/admin/product/saveSpuInfo',
  // 更细SPU
  UPDATE_SPU_URL = '/admin/product/updateSpuInfo',
  // 删除SPU
  DELETE_SPU_URL = '/admin/product/deleteSpu/',
  // 当前SPU 销售属性
  SPU_SALE_ATTR_URL = '/admin/product/spuSaleAttrList/',
  // 当前SPU的图片列表
  SPU_IMG_LIST_URL = '/admin/product/spuImageList/'
}

// 获取Spu列表
export const reqSpuList = (page: number, limit: number, category3Id: number) => {
  return request.get<any, SpuValueResponseData>(API.SPU_LIST_URL + `${page}/${limit}`, {params: {category3Id}})
}

// 获取SPU INFO
export const reqSpuInfo = (spuId: number) => {
  return request.get<any, SpuInfoResponseData>(API.SPU_INFO_URL + spuId)
}

// 添加或更新SPUInfo
export const reqAddOrUpdateSpuInfo = (params: SpuInfo) => {
  if (params.id) {
    return request.post<any, any>(API.UPDATE_SPU_URL, params)
  } else {
    return request.post<any, any>(API.ADD_SPU_URL, params)
  }
}

// 获取销售属性列表
export const reqSaleAttrList = () => {
  return request.get<any, SaleAttrResponseData>(API.SALE_ATTR_LIST_URL)
}

// 删除SPU
export const reqDeleteSpu = (spuId: number) => {
  return request.delete<any, any>(API.DELETE_SPU_URL + spuId)
}

// 获取SPU的销售属性
export const reqSpuSaleAttrList = (spuId: number) => {
  return request.get<any, SpuSaleAttrResponseData>(API.SPU_SALE_ATTR_URL + spuId)
}

// 获取SPU图片列表
export const reqSpuImgList = (spuId: number) => {
  return request.get<any, SpuImgListResponseData>(API.SPU_IMG_LIST_URL + spuId)
}