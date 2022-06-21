<template>
  <a-upload
    :file-list="fileList"
    :before-upload="beforeUpload"
    @remove="handleRemove"
    :max-count="1"
  >
    <a-button>
      <upload-outlined></upload-outlined>
      Select File
    </a-button>
  </a-upload>
  <a-button
    type="primary"
    :disabled="fileList.length === 0"
    :loading="uploading"
    style="margin-top: 16px"
    @click="handleUpload"
  >
    {{ uploading ? "Uploading" : "Start Upload" }}
  </a-button>
</template>

<script setup>
import request from "umi-request";
import { ref, getCurrentInstance } from "vue";
import { UploadOutlined } from "@ant-design/icons-vue";
import { uploadWord } from "@/api/upload";
const { proxy } = getCurrentInstance();
const fileList = ref([]);
const uploading = ref(false);
const handleRemove = (file) => {
  const index = fileList.value.indexOf(file);
  const newFileList = fileList.value.slice();
  newFileList.splice(index, 1);
  fileList.value = newFileList;
};

const beforeUpload = (file) => {
  console.log(file);
  fileList.value[0] = file;
  // fileList.value = [...fileList.value, file];
  return false;
};

const handleUpload = async () => {
  let param = new FormData(); // 创建form对象
  param.append("file", fileList.value[0], fileList.value[0].name); // 通过append向form对象添加数据
  param.append("chunk", "0"); // 添加form表单中其他数据
  uploading.value = true;
  const res = await uploadWord(param);
  console.log(res);
  uploading.value = false;
};
</script>

<style scoped lang="scss"></style>
