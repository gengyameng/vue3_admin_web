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
