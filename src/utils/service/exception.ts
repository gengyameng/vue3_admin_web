// 响应错误处理

export default class GlobalResponseError extends Error {
  data?: any;

  constructor(data?: any, msg?: string) {
    super(msg);
    this.data = data
  }

  toString() {
    if (typeof this.data === 'string' && this.data.trim() !== '') {
      return this.data;
    }
    return this.message
  }
}