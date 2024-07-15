// 角色接口
import request from '@/utils/service/index'
import type {
  RoleListResponseData,
  RoleInfoResponseData,
  SaveRoleFormData,
} from '@/api/acl/type'

// 接口地址
enum API {
  // 角色分页列表
  ROLE_LIST_URL = '/admin/acl/role/',
  // 获取角色详情
  ROLE_INFO_URL = '/admin/acl/role/get/',
  // 新增角色
  SAVE_ROLE_URL = '/admin/acl/role/save',
  // 修改角色
  UPDATE_ROLE_URL = '/admin/acl/role/update',
  // 删除角色
  REMOVE_ROLE_URL = '/admin/acl/role/remove/',
  // 批量删除角色
  BATCH_REMOVE_ROLE_URL = '/admin/acl/role/batchRemove'
}

// 接口

// 角色分页数据接口
export const reqRoleList = (page: number, limit: number, keyword: string) => {
  return request.get<any, RoleListResponseData>(API.ROLE_LIST_URL + `${page}/${limit}` + `?roleName=${keyword}`)
}

// 角色详情接口
export const reqRoleInfo = (id: number) => {
  return request.get<any, RoleInfoResponseData>(API.ROLE_INFO_URL + id)
}

// 新增或更新角色
export const reqAddorUpdateRole = (data: SaveRoleFormData) => {
  if (data.id) {
    // 更新
    return request.put<any, any>(API.UPDATE_ROLE_URL, data)
  } else {
    // 新增
    return request.post<any, any>(API.SAVE_ROLE_URL, data)
  }
}

// 删除角色
export const reqRemoveRole = (id: number) => {
  return request.delete<any,any>(API.REMOVE_ROLE_URL + id)
}

// 批量删除
export const reqBatchRemoveRole = (idList: number[]) => {
  return request.delete(API.BATCH_REMOVE_ROLE_URL, {data: idList})
}