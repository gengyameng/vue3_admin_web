export const storage = {
  // 存储数据
  set(key: string, val: any) {
    localStorage.setItem(key, JSON.stringify(val));
  },
  // 获取数据
  get(key: string) {
    const value = localStorage.getItem(key);
    if (value && value != "undefined" && value != "null") {
      return JSON.parse(value);
    }
  },
  // 删除数据
  remove(key: string) {
    localStorage.removeItem(key);
  },
};
