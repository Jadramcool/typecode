// src/store/index.js
// 引入仓库定义函数
import { defineStore } from "pinia";
// 传入2个参数，定义仓库并导出
// 第一个参数唯一不可重复，字符串类型，作为仓库ID以区分仓库
// 第二个参数，以对象形式配置仓库的state,getters,actions
// 配置 state getters actions
export const mainStore = defineStore("main", {
  // state 类似组件的data选项，函数形式返回对象
  state: () => {
    return {
      // 注册登录同步
      email: "jdm@qq.com",
      // 神色模式
      isBgBlack: false,
      // 用户信息
      user: {},
      // 是否登录
      isLogin: false,
      // token
      token: localStorage.getItem("token") || "",
      isShowModal: false,
      articleId: "",
    };
  },
  //   compute修饰一些值
  getters: {},
  //   methods 可以做同步，异步，提交state
  actions: {
    // 设置token
    setToken(token) {
      this.token = token;
      localStorage.setItem("token", this.token);
    },
    // 设置用户信息
    setUser(user) {
      this.user = user;
      this.isLogin = true;
      // localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("userId", user._id);
      localStorage.setItem("username", user.username);
    },
  },
});
