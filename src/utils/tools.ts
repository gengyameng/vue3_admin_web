// 工具
import { ElNotification } from "element-plus";

// 失败提示
const errorNotice = (title?: string, message?: string, duration = 2000) => {
  ElNotification.error({
    title: title,
    message: message,
    duration,
  });
};

// 成功提示
const successNotice = (title?: string, message?: string, duration = 2000) => {
  ElNotification.success({
    title,
    message,
    duration,
  });
};

// 封装一个函数，获取一个结果：当天早上｜上午｜下午｜晚上
const getTimeStr = () => {
  let message = "";
  let hours = new Date().getHours();

  if (hours <= 9) {
    message = "早上";
  } else if (hours <= 12) {
    message = "上午";
  } else if (hours <= 18) {
    message = "下午";
  } else {
    message = "晚上";
  }
  return message;
};

export { errorNotice, successNotice, getTimeStr };
