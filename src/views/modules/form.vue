<template>
  <div class="ml-10">
    <span class="font-bold">选择文章：</span>
    <div class="ml-10 form_body">
      <div class="mb-4 select_user">
        <label for="user">用户：</label>
        <a-select
          id="user"
          ref="select"
          style="width: 200px"
          placeholder="请选择用户"
          @change="handleChange"
        >
          <a-select-option
            v-for="item in userList"
            :key="item._id"
            :value="item._id"
            >{{ item.username }}</a-select-option
          >
        </a-select>
      </div>
      <div class="select_article">
        <label for="article">文章：</label>
        <a-select
          id="article"
          ref="select"
          v-model:value="nowValue"
          style="width: 200px"
          placeholder="Select a person"
          @change="handleChangeArticle"
          @dropdownVisibleChange="handleGetArticle"
        >
          <a-select-option
            v-for="item in articleList"
            :key="item._id"
            :value="item._id"
            >{{ item.title }}</a-select-option
          >
        </a-select>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getUserList } from "@/api/user";
import { getArticleList, getArticleInfo } from "@/api/article";
import { reactive, ref } from "@vue/reactivity";
import { onMounted } from "@vue/runtime-core";
import { storeToRefs } from "pinia";
import { mainStore } from "@/store/index";
const store = mainStore();
let userList = ref([]);
let articleList = ref([]);
let form = reactive({
  limit: 20,
  offset: 0,
  category: "",
  authorId: "",
  title: "",
});

let articleContent = ref("");

const emit = defineEmits(["changeArticle"]);

let nowValue = ref("");
onMounted(() => {
  getUser();
  if (store.articleId) {
    getArticleDetail(store.articleId);
  }
});

const getUser = async () => {
  const res = await getUserList();
  userList.value = res.userList;
};
// 获取文章列表
const getArticle = async (limit, offset, category, authorId, title) => {
  const res = await getArticleList(limit, offset, category, authorId, title);
  articleList.value = res.articles;
  // console.log(articleList.value);
};
// 获取文章详情
const getArticleDetail = async (title) => {
  const res = await getArticleInfo(title);
  articleContent.value = res.data;
  emit("changeArticle", articleContent.value);
  //   console.log(articleContent.value);
};
// 选择创建人
const handleChange = (value) => {
  form.authorName = value;
  getArticle(form.limit, form.offset, form.category, value, form.title);
  articleList.value = [];
  nowValue.value = "";
};

const handleGetArticle = () => {
  console.log(userList.value.length);
  if (userList.value.length != 0) {
    getArticle(
      form.limit,
      form.offset,
      form.category,
      form.authorId,
      form.title
    );
  }
};

// 选择文章
const handleChangeArticle = (value) => {
  store.articleId = value;
  getArticleDetail(value);
};
</script>
<style lang="scss" scoped></style>
