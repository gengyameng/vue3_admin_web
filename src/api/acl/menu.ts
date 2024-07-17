// 权限管理
import request from "@/utils/service/index";
import type {
  MenuPermissionResponseData,
  SetRolePermissionForm,
  setMenuForm,
} from "@/api/acl/type";

// 接口地址

enum API {
  // 角色权限菜单
  ROLE_PERMISSION_URL = "/admin/acl/permission/toAssign/",
  // 角色分配权限
  ACL_ASSIGN_PERMISSION_URL = "/admin/acl/permission/doAssignAcl",
  // 菜单管理
  ACL_PERMISSION_URL = "/admin/acl/permission",
  // 删除菜单
  REMOVE_PERMISSION_URL = "/admin/acl/permission/remove/",
  // 新增菜单
  SAVE_PERMISSION_URL = "/admin/acl/permission/save",
  // 修改菜单
  UPDATE_PERMISSION_URL = "/admin/acl/permission/update",
}

// 根据角色获取菜单
export const reqAllMenuList = (roleId: number) => {
  return request.get<any, MenuPermissionResponseData>(
    API.ROLE_PERMISSION_URL + roleId,
  );
};

// 给角色分配权限
export const reqSetRolePermission = (data: SetRolePermissionForm) => {
  return request.post<any, any>(API.ACL_ASSIGN_PERMISSION_URL, data);
};

// 获取所有菜单权限
export const reqAllPermission = () => {
  return request.get<any, MenuPermissionResponseData>(API.ACL_PERMISSION_URL);
};

// 删除菜单
export const reqRemovePermission = (id: number) => {
  return request.delete<any, any>(API.REMOVE_PERMISSION_URL + id);
};

// 新增/添加权限
export const reqAddOrUpdatePermission = (data: setMenuForm) => {
  if (data.id) {
    return request.put<any, any>(API.UPDATE_PERMISSION_URL, data);
  } else {
    return request.post<any, any>(API.SAVE_PERMISSION_URL, data);
  }
};
