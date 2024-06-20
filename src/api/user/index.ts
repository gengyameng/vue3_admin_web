// 用户模块接口统一管理
import request from '@/utils/service/index'
import { loginForm, loginResponseDataType, userInfoResponse } from '@/api/user/type'

// 项目相关的请求地址
enum API {
  LOGIN_URL = '/user/login',
  USERINFO_URL = '/user/info'
}

// 登录接口
export const reqLogin = (data: loginForm) => {
  return request.post<any, loginResponseDataType>(API.LOGIN_URL, data)
}

// 获取用户信息接口
export const reqUserInfo = () => {
  return request.get<any, userInfoResponse>(API.USERINFO_URL)
}