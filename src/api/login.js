import request from "./request";

// 用户登录
export const login = (data) => {
  console.log(data);
  return request({
    url: "/users/login",
    method: "POST",
    data,
  });
};

// 用户注册
export const register = (data) => {
  return request({
    url: "/users/register",
    method: "POST",
    data,
  });
};
// 获取用户
export const getUser = () => {
  return request({
    url: "/user",
  });
};
