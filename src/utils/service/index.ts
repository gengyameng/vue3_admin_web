// 进行axios二次封装，使用请求与响应拦截器
import axios from "axios";
import {
  axiosConfig,
  defaultError,
  HTTPStatusTitle,
} from "@/utils/service/config";

import GlobalResponseError from "@/utils/service/exception";
import { ElMessage } from "element-plus";

// 1.利用axios对象的create方法，创建axios实例(其他配置：基础路径、超时时间、header等。)
const instance = axios.create(axiosConfig);

// 2. 为instance添加请求与响应拦截器
// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    // config配置对象，headers属性请求头，经常给服务器端携带公共参数
    return config;
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error);
  },
);

// 响应拦截器
instance.interceptors.response.use(
  (response) => {
    console.log(response);
    
    return response.data;
  },
  (error) => {
    // 网络错误处理
    const response = error.response;
    if (response) {
      const { status, statusText, data } = response;
      const { errMsg, errCode } = data ?? {}; // ?? 非空运算符
      let message =
        errMsg || HTTPStatusTitle[status] || statusText || defaultError; // 错误提示
      // message是否需要重写取决于服务端提供的提示信息是否可以使用
      if (status === 401) {
        // 未登录
        message = "未登录，请先登录";
        // 去登录
      }
      if (status === 403) {
        // 无权访问
        message = "没有权限访问";
        //
      }
      if (status === 404) {
        // 请求不存在
      }
      if (status >= 500) {
        // 服务器异常
      }
      ElMessage({
        type: "error",
        message,
      });
      return Promise.reject(new GlobalResponseError(data, message));
    } else {
      // 网络问题
      ElMessage({
        type: "error",
        message: "网络链接失败",
      });
      return Promise.reject(new GlobalResponseError(null, "网络链接失败"));
    }
  },
);

// 导出instance
export default instance;
