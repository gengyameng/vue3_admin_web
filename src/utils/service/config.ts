// service配置
import { AxiosRequestConfig } from "axios";

// axios.create config
export const axiosConfig: AxiosRequestConfig = {
  baseURL: import.meta.env.VITE_APP_BASE_API, // url = baseUrl + requestUrl
  timeout: 5000,
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
};

// 未知错误
export const defaultError = "未知错误";

// 网络请求响应状态
export const HTTPStatusTitle: any = {
  200: "服务器成功返回请求的参数",
  201: "新建或修改数据成功",
  202: "一个请求已经进入后台排队(已接收请求，但未处理完成)",
  400: "客户端发出请求有错误",
  401: "用户没有权限（令牌、用户名、密码错误）",
  403: "用户没有权限访问",
  404: "发出的请求针对的是不存在的记录，服务器没有进行操作",
  405: "请求方法不被允许",
  410: "请求资源不存在",
  500: "服务器发生错误",
  502: "网关错误",
  503: "服务不可用，服务器暂时过载或维护",
  504: "网关超时",
};
