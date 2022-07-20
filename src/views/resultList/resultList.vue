<template>
  <div class="w-3/4 mx-auto body bg-slate-200">
    <div class="result_list">
      <div class="title">成绩统计</div>
      <div class="flex login_result">
        <div class="text-center rounded type_count bg-gray-50">
          <div>打字记录</div>
          <div>
            <span class="text-lg font-bold">{{ loginResultCount }}</span> 次
          </div>
        </div>
        <div class="text-center rounded type_time bg-gray-50">
          <div>累计测试</div>
          <div>
            <span class="text-lg font-bold">
              {{
                proxy.dayjs(loginResultInfo.timeAll * 1000).format("mm:ss")
              }}</span
            >
          </div>
        </div>
        <div class="text-center rounded type_speed bg-gray-50">
          <div>打字速度</div>
          <div>
            <span class="text-lg font-bold">{{
              loginResultInfo.averageSpeed
            }}</span>
            字/分
          </div>
        </div>
      </div>
      <div class="content">
        <a-form name="basic" autocomplete="off" class="flex justify-between">
          <a-form-item label="用户名" name="username">
            <a-input-search
              v-model:value="searchAuthorName"
              placeholder="请输入用户名"
              style="width: 200px"
              @search="onSearch"
            />
          </a-form-item>
          <a-form-item>
            <a-button type="primary" html-type="submit" @click="resetSearch"
              >重置查询</a-button
            >
          </a-form-item>
        </a-form>
        <a-table
          :columns="columns"
          :data-source="resultList"
          bordered
          :pagination="true"
        >
          <template #bodyCell="{ column, record, text }">
            <template v-if="column.dataIndex === 'createdAt'">
              <span>{{ proxy.dayjs(text).format("YYYY-MM-DD HH:mm:ss") }}</span>
            </template>
            <template v-else-if="column.dataIndex === 'authorName'">
              <a @click="selectAuthor(record.authorName)">{{ text }}</a>
            </template>
            <template v-else-if="column.dataIndex === 'articleTitle'">
              <a @click="selectArticle(record.articleId)">{{ text }}</a>
            </template>
            <template v-else-if="column.dataIndex === 'time'">
              <span>{{ proxy.dayjs(text).format("mm:ss") }}</span>
            </template>
            <template v-else-if="column.dataIndex === 'speed'">
              <span>{{ text }} WPM</span>
            </template>
            <template v-else-if="column.dataIndex === 'correct'">
              <span>{{ text }} %</span>
            </template>
            <template v-else-if="column.dataIndex === 'operate'">
              <a @click="onView(record._id)">查 看</a>
            </template>
          </template>
        </a-table>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  onMounted,
  reactive,
  ref,
  getCurrentInstance,
  toRefs,
} from "@vue/runtime-core";
import { useRoute } from "vue-router";
import { getResultList, getTotal } from "@/api/result";
import router from "@/routes/routes";
import { storeToRefs } from "pinia";
import { mainStore } from "@/store/index";
const store = mainStore();
const route = useRoute();
const { proxy } = getCurrentInstance();

let searchAuthorName = ref("");
let searchArticleId = ref("");
let resultList = reactive([]);
let resultCount = ref(0);
let loginResultList = reactive([]);
let loginResultInfo = reactive({});
let loginResultCount = ref(0);
const columns = [
  {
    title: "时间",
    dataIndex: "createdAt",
  },
  {
    title: "用户名",
    dataIndex: "authorName",
  },
  {
    title: "文章名称",
    dataIndex: "articleTitle",
  },
  {
    title: "时间",
    dataIndex: "time",
  },
  {
    title: "速度",
    dataIndex: "speed",
  },
  {
    title: "正确率",
    dataIndex: "correct",
  },
  {
    title: "退格",
    dataIndex: "wordNum",
  },
  // {
  //   title: "成绩",
  //   dataIndex: "result",
  // },
  {
    title: "操作",
    dataIndex: "operate",
  },
];

let authorId = localStorage.getItem("userId");
const username = localStorage.getItem("username");
onMounted(() => {
  getResult();
  getLoginResult(username);
});
const getResult = async (authorName, articleId) => {
  resultList.length = 0;
  const res = await getResultList(authorName, articleId);
  res.resultList.map((item) => {
    resultList.push(item);
  });
  resultCount.value = res.resultCount;
};

const getLoginResult = async (authorName, articleId) => {
  resultList.length = 0;
  const res = await getResultList(authorName, articleId);
  loginResultCount.value = res.resultCount;
  const res2 = await getTotal(authorId);
  const temp = res2.resultAll[0];
  loginResultInfo = Object.assign(loginResultInfo, temp);
};

const selectAuthor = (id) => {
  searchAuthorName.value = id;
  getResult(searchAuthorName.value, searchArticleId.value);
};

const selectArticle = (id) => {
  searchArticleId.value = id;
  getResult(searchAuthorName.value, searchArticleId.value);
};
// 搜索
const onSearch = (name) => {
  getResult(searchAuthorName.value);
};
// 重置筛选
const resetSearch = () => {
  getResult();
};

const onView = (id) => {
  console.log(id);
  const resultId = id;
  store.resultId = resultId;
  router.push({
    name: "resultPage",
    params: { resultId },
  });
};
</script>
<style lang="scss" scoped>
.body {
  padding: 10px;
}
.result_list {
  .title {
    padding: 0 5px;
    font-size: 18px;
    font-weight: bold;
    border-left: 8px solid rgb(96, 165, 250);
  }
  .content {
    margin: 10px 0;
    :deep(.ant-table-cell) {
      font-size: 14px;
    }
  }
}
.login_result {
  margin: 10px;
  div {
    margin: 0 8px;
    padding: 5px;
  }
}
</style>
