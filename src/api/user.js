import request from "./request";

// 获取用户列表
export const getUserList = () => {
  return request({
    url: "/user/list",
  });
};
