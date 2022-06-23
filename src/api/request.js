import axios from "axios";
import { message } from "ant-design-vue";
import "ant-design-vue/es/message/style/css"; //vite只能用 ant-design-vue/es 而非 ant-design-vue/lib
const service = axios.create({
  baseURL: import.meta.env.VITE_BASE_API,
  // baseURL: "http://124.223.89.194:4001/api",
  timeout: 5000,
});

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // if (localStorage.getItem('token')) {
    //   if (diffTokenTime()) {
    //     store.dispatch('app/logout')
    //     return Promise.reject(new Error('token 失效了'))
    //   }
    // }
    config.headers.authorization = "Bearer " + localStorage.getItem("token");
    return config;
  },
  (error) => {
    return Promise.reject(new Error(error));
  }
);

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    const { data, meta } = response.data;
    if (meta.status === 200 || meta.status === 201 || meta.status === 204) {
      if (meta.msg) {
        message.success(meta.msg);
      } else {
        return data;
      }
      return data;
    } else {
      message.error(meta.msg);
      return Promise.reject(new Error(meta.msg));
    }
  },
  (error) => {
    console.log(error.response.data.errors);
    error.response && message.error(error.response.data.errors[0].msg);
    return Promise.reject(new Error(error.response.data.errors[0].msg));
  }
);
export default service;
