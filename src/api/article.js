import request from "./request";

// 获取用户
export const getArticleList = (limit, offset, category, authorId, title) => {
  return request({
    url: "/articles",
    params: { limit, offset, category, authorId, title },
  });
};
export const getArticleInfo = (articleId) => {
  return request({
    url: `/articles/getArticle/${articleId}`,
  });
};
