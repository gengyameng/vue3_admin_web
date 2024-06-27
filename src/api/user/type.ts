// 用户模块接口类型管理

// 用户登录请求参数
export interface loginForm {
  username: string;
  password: string;
}

export interface loginResponseDataType {
  token?: string;
  message?: string;
}

// 用户登录响应
export interface loginResponse {
  code: number;
  data: loginResponseDataType;
}

// 用户信息类型
export interface userInfoType {
  userId: number;
  avatar: string;
  username: string;
  password: string;
  desc: string;
  roles: string[];
  buttons: string[];
  routes: string[];
  token: string;
}

interface userType {
  checkUser: userInfoType;
}

// 用户信息响应类型
export interface userInfoResponse {
  code: number;
  data: userType;
}
