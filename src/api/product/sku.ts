// SKU接口管理
import request from '@/utils/service/index'
import { SkuInfo, SkuInfoResponseData } from '@/api/product/type'

// 接口地址
enum API {
  // 添加SKU 
  ADD_SKU_URL = '/admin/product/saveSkuInfo',
  // SPU的SKu列表
  SKUINFO_URL = '/admin/product/findBySpuId/',
}

// 添加SKU接口
export const reqAddSkuInfo = (params: SkuInfo) => {
  return request.post<any, any>(API.ADD_SKU_URL, params)
}

// 获取SKU
export const reqSkuList = (spuId: number) => {
  return request.get<any, SkuInfoResponseData>(API.SKUINFO_URL + spuId)
}
