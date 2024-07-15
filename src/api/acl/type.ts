// 定义全部接口返回数据都拥有的ts类型
export interface ResponseData {
  code: number;
  message: string;
  ok: boolean;
}

// user data
export interface UserData {
  id: number;
  createTime: string;
  updateTime: string;
  username: string;
  password: string;
  name: string;
  phone: string | null;
  roleName: string;
}

// 用户 INFO
export interface UserInfo {
  id: number;
  createTime: string;
  updateTime: string;
  username: string;
  password: string;
  name: string;
  phone: string | null;
  roleName: string;
}

export type SaveUserFormData = {
  id?: number;
  username: string; // 用户名称
  name: string; // 用户昵称
  password: string;
};

// role 数据
export interface UserRoleData {
  id: number;
  createTime: string;
  updateTime: string;
  roleName: string;
  remark: null;
}

// 分配角色参数
export interface AssignRoleFormData {
  roleIdList: number[];
  userId: number;
}

// 用户列表响应类型
export interface UserListResponseData extends ResponseData {
  data: {
    records: UserData[];
    total: number;
    size: number;
    current: number;
    pages: number;
  };
}

// 用户信息响应类型
export interface UserInfoResponseData extends ResponseData {
  data: UserInfo;
}

// 用户角色数据响应类型
export interface UserAssignInfoResponseData extends ResponseData {
  data: {
    assignRoles: UserRoleData[];
    allRolesList: UserRoleData[];
  };
}

// 角色管理数据类型
// 角色数据
export interface RoleData {
  id: number;
  roleName: string;
  remark: null;
  createTime: string;
  updateTime: string;
}

// 角色详情类型
export interface RoleInfo {
  id: number;
  roleName: string;
  remark: null;
  createTime: string;
  updateTime: string;
}

// 角色添加/更新表单参数
export interface SaveRoleFormData {
  id?: number; // 更新时用
  roleName: string;
}

// 批量删除参数
export interface BatchRemoveRoleData {
  idList: number[]
}


// 角色列表响应数据类型
export interface RoleListResponseData extends ResponseData {
  data: {
    records: RoleData[];
    total: number;
    size: number;
    current: number;
    pages: number
  }
}

// 角色详情响应数据类型
export interface RoleInfoResponseData extends ResponseData {
  data: RoleInfo;
}

// 权限管理类型
// 角色菜单权限
export interface MenuPermissionData {
  id?: number;
  createTime?: string;
  updateTime?: string;
  pid: number;  // 上一级ID
  name: string; // 当前权限名称
  code: string | null;
  toCode: string | null;
  type: number;
  status: string | null;
  level: number;  // 等级
  select: boolean;
  children: MenuPermissionData[]
}

// 设置角色菜单表单数据类型
export interface SetRolePermissionForm {
  permissionIdList: number[];
  roleId: number;
}

// 设置菜单表单保存数据类型
export interface setMenuForm {
  id?: number;
  name: string;
  code: string;
  level: number;
  pid: number
}

// 角色的权限菜单响应数据类型
export interface MenuPermissionResponseData extends ResponseData {
  data: MenuPermissionData[]
}
