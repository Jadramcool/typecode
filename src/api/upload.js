import request from "./request";
export const uploadWord = (file) => {
  return request({
    url: "/upload/word",
    method: "POST",
    data: file,
    headers: { "Content-Type": "multipart/form-data" },
  });
};
