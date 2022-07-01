import request from "./request";

// 上传成绩
export const uploadResult = (result) => {
  return request({
    url: "/result/upload",
    method: "POST",
    data: result,
  });
};

// 获取成绩
export const getResult = (resultId) => {
  return request({
    url: "/result/get",
    params: { resultId },
  });
};

// 获取成绩
export const getTotal = (authorId) => {
  return request({
    url: "/result/get/statistics",
    params: { authorId },
  });
};

// 获取所有成绩
export const getResultList = (authorName, articleId) => {
  return request({
    url: "/result/get/list",
    params: { authorName, articleId },
  });
};
