<template>
  <div class="body w-3/4 mx-auto bg-slate-200">
    <div class="result_list">
      <div class="title">成绩统计</div>
      <div class="content">
        <a-table
          :columns="columns"
          :data-source="resultList"
          bordered
          :pagination="false"
        >
          <template #bodyCell="{ column, text }">
            <template v-if="column.dataIndex === 'createdAt'">
              <span>{{ proxy.dayjs(text).format("YYYY-MM-DD HH:mm:ss") }}</span>
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
} from "@vue/runtime-core";
import { useRoute } from "vue-router";
import { getResultList } from "@/api/result";
import router from "@/routes/routes";
import { storeToRefs } from "pinia";
import { mainStore } from "@/store/index";
const store = mainStore();
const route = useRoute();
const { proxy } = getCurrentInstance();

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
  {
    title: "成绩",
    dataIndex: "result",
  },
];

let resultList = reactive([]);
let resultCount = ref(0);

let authorId = localStorage.getItem("userId");
onMounted(() => {
  getResult();
});
const getResult = async (authorId, articleId) => {
  const res = await getResultList(authorId, articleId);
  //   resultList = res.resultList;
  res.resultList.map((item) => {
    resultList.push(item);
  });
  resultCount.value = res.resultCount;
  console.log(resultList);
};
</script>
<style lang="scss" scoped>
.body {
  padding: 10px;
}
.result_body {
  margin: 10px 0;
  padding: 10px;
  background: white;
  border-radius: 10px;
  border: 1px solid rgba(199, 186, 186, 0.349);
  .title {
    padding: 0 5px;
    font-size: 18px;
    font-weight: bold;
    border-left: 8px solid rgb(96, 165, 250);
  }
  .content {
    margin: 10px 0;
    p {
      span {
        padding: 0 5px;
        font-size: 18px;
        color: rgb(225, 136, 3);
      }
    }
  }
}

.operate {
  text-align: center;
  margin: 10px 0;
  .btn {
    margin: 0 10px;
  }
}
</style>
