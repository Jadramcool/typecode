<template>
  <div class="body w-1/2 mx-auto bg-slate-200">
    <div class="result_body">
      <div class="title">本次成绩</div>
      <div class="content">
        <p>
          本次文章《<span class="result">{{ theResult.articleTitle }}</span
          >》共<span class="result">{{ theResult.wordNum }}</span
          >字，<span v-if="isLoginUser">您</span><span v-else>Ta</span>完成<span
            class="result"
            >{{ theResult.inputNum }}</span
          >字。完成率为<span class="result">{{ theResult.completion }}</span
          >%。
        </p>
        <p>
          共用时<span class="result">{{ theResult.time }}</span
          >。速度：<span class="result">{{ theResult.speed }}</span
          >字/分钟。正确率：<span class="result">{{ theResult.correct }}</span
          >%
        </p>
      </div>
    </div>
    <div class="result_body">
      <div class="title">成绩统计</div>
      <div class="content">
        <a-table
          :columns="columns"
          :data-source="data"
          bordered
          :pagination="false"
        >
        </a-table>
      </div>
    </div>
    <div class="operate">
      <a-button class="btn" type="primary" @click="jumpHome">继续打字</a-button>
      <a-button class="btn" @click="jumpResult">查看成绩</a-button>
      <a-button class="btn" type="dashed">上传文章</a-button>
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
import { getResult, getTotal } from "@/api/result";
import router from "@/routes/routes";
import { storeToRefs } from "pinia";
import { mainStore } from "@/store/index";
const store = mainStore();
const route = useRoute();
const { proxy } = getCurrentInstance();

const columns = [
  {
    title: " ",
    dataIndex: "type",
  },
  {
    title: "总输入正确字数",
    dataIndex: "correctNumAll",
  },
  {
    title: "总输入字数",
    dataIndex: "inputAllNum",
  },
  {
    title: "平均输入速度",
    dataIndex: "averageSpeed",
  },
  {
    title: "最高输入速度",
    dataIndex: "maxSpeed",
  },
];

let data = reactive([{}, {}]);

let resultId = route.params.resultId || store.resultId;
let theResult = reactive({});
let resultAll = reactive({});
// 判断是否是登录用户查看成绩
let isLoginUser = ref(true);

let authorId = localStorage.getItem("userId");
onMounted(async () => {
  // getTheRequest(resultId);
  await getTheRequest(resultId);
  await getTotalResult(authorId);
  await setTable();
});
// 表格数据
const setTable = () => {
  for (let i = 0; i < 2; i++) {
    if (i === 0) {
      data[i].type = "本次";
      data[i].correctNumAll = theResult.correctNum;
      data[i].inputAllNum = theResult.inputNum;
      data[i].averageSpeed = theResult.speed;
      data[i].maxSpeed = theResult.speed;
    } else if (i === 1) {
      data[i].type = "历史";
      data[i].correctNumAll = resultAll.correctNumAll;
      data[i].inputAllNum = resultAll.inputAllNum;
      data[i].averageSpeed = resultAll.averageSpeed;
      data[i].maxSpeed = resultAll.maxSpeed;
    }
  }
};
// 获取本次成绩
const getTheRequest = async (id) => {
  const res = await getResult(id);
  let result = res.result;
  if (result.authorId._id === localStorage.getItem("userId")) {
    isLoginUser.value = true;
  } else {
    isLoginUser.value = false;
  }
  theResult.articleTitle = result.articleId.title;
  theResult.wordNum = result.wordNum;
  theResult.inputNum = result.inputNum;
  theResult.correctNum = result.correctNum;
  theResult.completion = ((result.inputNum / result.wordNum) * 100).toFixed(0);
  theResult.time = proxy.dayjs(result.time * 1000).format("mm:ss");
  theResult.speed = result.speed;
  theResult.correct = result.correct;
};
// 获取历史成绩（包括本次一起计算）
const getTotalResult = async (id) => {
  const res = await getTotal(id);
  const item = res.resultAll[0];
  resultAll.averageSpeed = item.averageSpeed;
  resultAll.correctNumAll = item.correctNumAll;
  resultAll.inputAllNum = item.inputAllNum;
  resultAll.maxSpeed = item.maxSpeed;
  resultAll.timeAll = item.timeAll;
};
// 跳转首页
const jumpHome = () => {
  router.push("/");
};
// 跳转成绩统计
const jumpResult = () => {
  router.push("/resultList");
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
      .result {
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
