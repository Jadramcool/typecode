<template>
  <div class="body w-1/2 mx-auto bg-slate-200">
    <div class="result_body">
      <div class="title">本次成绩</div>
      <div class="content">
        <p>
          本次文章《<span>{{ theResult.articleTitle }}</span
          >》共<span>{{ theResult.wordNum }}</span
          >字，您完成<span>{{ theResult.inputNum }}</span
          >字。完成率为<span>{{ theResult.completion }}</span
          >%。
        </p>
        <p>
          共用时<span>{{ theResult.time }}</span
          >。速度：<span>{{ theResult.speed }}</span
          >字/分钟。正确率：<span>{{ theResult.correct }}</span
          >%
        </p>
      </div>
    </div>
    <div class="result_body">
      <div class="title">成绩统计</div>
      <div class="content">
        <!-- <a-table :columns="columns" :data-source="data">
          <template #bodyCell="{ column, text }">
            <template v-if="column.dataIndex === 'name'">
              <a>{{ text }}</a>
            </template>
          </template>
        </a-table> -->
      </div>
    </div>
    <a-divider />
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
import { getResult, getTotal } from "@/api/result";
const route = useRoute();
const { proxy } = getCurrentInstance();
let resultId = route.params.resultId;
let theResult = reactive({});
let resultAll = reactive({});

let authorId = localStorage.getItem("userId");
onMounted(() => {
  getTheRequest(resultId);
  getTotalResult(authorId);
});

const getTheRequest = async (id) => {
  const res = await getResult(id);
  let result = res.result;
  theResult.articleTitle = result.articleId.title;
  theResult.wordNum = result.wordNum;
  theResult.inputNum = result.inputNum;
  theResult.completion = ((result.inputNum / result.wordNum) * 100).toFixed(0);
  theResult.time = proxy.dayjs(result.time * 1000).format("mm:ss");
  theResult.speed = result.speed;
  theResult.correct = result.correct;
  console.log(theResult);
};

const getTotalResult = async (id) => {
  const res = await getTotal(id);
  const item = res.resultAll[0];
  console.log(item);
  resultAll.averageSpeed = item.averageSpeed;
  resultAll.correctNumAll = item.correctNumAll;
  resultAll.inputAllNum = item.inputAllNum;
  resultAll.maxSpeed = item.maxSpeed;
  resultAll.timeAll = item.timeAll;
  console.log(resultAll);
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
</style>
