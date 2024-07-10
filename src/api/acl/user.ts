// 用户管理接口
import request from '@/utils/service/index'
import type { 
  UserListResponseData,
  UserInfoResponseData,
  SaveUserFormData,
  UserAssignInfoResponseData,
  AssignRoleFormData
} from '@/api/acl/type'

// 接口地址
enum API {
  // 用户列表
  USER_LIST_URL = '/admin/acl/user/',
  // 用户详情
  USER_INFO_URL = '/admin/acl/user/get/',
  // 添加用户
  USER_SAVE_URL= '/admin/acl/user/save',
  // 用户更新
  USER_UPDATE_URL = '/admin/acl/user/update',
  // 用户删除
  USER_REMOVE_URL = '/admin/acl/user/remove/',
  // 用户批量删除
  USER_BATCH_REMOVE_URL = '/admin/acl/user/batchRemove',
  // 用户角色数据
  USER_ASSIGN_INFO_URL = '/admin/acl/user/toAssign/',
  // 用户分配橘色
  USER_ASSIGN_ROLE_URL = '/admin/acl/user/doAssignRole'
}

// 用户列表接口
export const reqUserList = (page: number, limit: number, keyword: string) => {
  return request.get<any, UserListResponseData>(API.USER_LIST_URL + `${page}/${limit}`, {params:{username: keyword}})
}

// 用户详情接口
export const reqUserInfo = (id:number) => {
  return request.get<any, UserInfoResponseData>(API.USER_INFO_URL + id)
}

// 添加用户
export const reqAddUser = (params: SaveUserFormData) => {
  return request.post<any, any>(API.USER_SAVE_URL, params) 
}

// 用户更新
export const reqUpdateUser = (params: SaveUserFormData) => {
  return request.put<any, any>(API.USER_UPDATE_URL, params)
}

export const reqAddOrUpdateUser = (params: SaveUserFormData) => {
  if (params.id) {
    return request.put<any, any>(API.USER_UPDATE_URL, params)
  } else {
    return request.post<any, any>(API.USER_SAVE_URL, params) 
  }
}

// 用户删除
export const reqUserRemove = (id: number) => {
  return request.delete<any, any>(API.USER_REMOVE_URL + id)
}

// 批量删除
export const reqUserBatchRemove = (idList: number[]) => {
  return request.delete<any, any>(API.USER_BATCH_REMOVE_URL, {data: idList})
}

// 获取用户角色数据
export const reqUserAssignInfo = (id: number) => {
  return request.get<any, UserAssignInfoResponseData>(API.USER_ASSIGN_INFO_URL + id)
}

// 用户分配橘色
export const reqAssignRole = (data: AssignRoleFormData) => {
  return request.post<any, any>(API.USER_ASSIGN_ROLE_URL, data)
}