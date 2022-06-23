<template>
  <div>
    <a-modal
      v-model:visible="store.isShowModal"
      width="700px"
      title="测试结果"
      @ok="handleOk"
      @cancel="cancel"
    >
      <div class="modal_body">
        <div class="title text-2xl text-center">恭喜你，完成了</div>
        <div class="time text-4xl text-center font-bold text-yellow-600 my-4">
          {{ proxy.dayjs(result.time * 1000).format("mm:ss") }}
        </div>
        <div class="progress_body flex justify-around">
          <div class="progress flex flex-col">
            <a-progress
              type="circle"
              :stroke-color="{
                '0%': '#108ee9',
                '80%': '#87d068',
              }"
              :percent="speedPer"
            />
            <span class="text-center text-lg my-4"
              >速度 {{ result.speed }} wpm</span
            >
          </div>
          <div class="progress flex flex-col">
            <a-progress
              type="circle"
              :stroke-color="{
                '0%': '#108ee9',
                '80%': '#87d068',
              }"
              :percent="result.correct"
            />
            <span class="text-center text-xl my-4"
              >正确率 {{ result.correct }} %</span
            >
          </div>
          <div class="progress flex flex-col">
            <a-progress
              type="circle"
              :stroke-color="{
                '0%': '#108ee9',
                '80%': '#87d068',
              }"
              :percent="wordPer"
            />
            <span class="text-center text-lg my-4">完成度 {{ wordPer }} %</span>
          </div>
        </div>
        <div class="appraise text-center text-xl my-4">{{ speedAppraise }}</div>
      </div>
      <template #footer>
        <a-button key="back" @click="watchResult">查看成绩详情</a-button>
        <a-button
          key="submit"
          type="primary"
          :loading="loading"
          @click="submitResult"
        >
          提交成绩并查看
        </a-button>
      </template>
    </a-modal>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref, watch, getCurrentInstance } from "vue";
import { storeToRefs } from "pinia";
import { mainStore } from "@/store/index";
import router from "@/routes/routes";
import { uploadResult } from "@/api/result";
const { proxy } = getCurrentInstance();

const store = mainStore();
const props = defineProps({
  completeResult: {
    type: Object,
  },
});
// 速度，正确率，用时
let result = reactive({
  speed: 0,
  correct: 0,
  correctNum: 0, //正确字数
  time: "00:00",
  inputNum: 0, //输入数字
  wordNum: 0, //总字数
  articleId: "62b1e9f8db6f4495ecc293fc",
});
// let speed = ref(0);
// let correct = ref(0);
// let time = ref("00:00");
// let inputNum = ref(0); //输入数字
// let wordNum = ref(0); //总字数
// 速度，正确率，用时 占比
let speedPer = ref(0);
let correctPer = ref(0);
let timePer = ref(0);
let wordPer = ref(0);
// 最大速度
let maxSpeed = ref(200);

let loading = ref(false);
const appraise = ref([
  "连40都没到，你是在摸鱼吗？",
  "超过60了，加油加油！",
  "打字小天才!",
  "建议提要求升职加薪！",
  "你是我的神！",
  "你是作弊了吧",
]);

let speedAppraise = ref("");

onMounted(() => {});

watch(props.completeResult, () => {
  result.speed = Number(props.completeResult.wpm);
  result.correct = Number(props.completeResult.accuracy);
  result.correctNum = Number(props.completeResult.correctNum);
  result.time = props.completeResult.time;
  result.inputNum = props.completeResult.totalNum;
  result.wordNum = props.completeResult.wordLength;
  result.articleId = store.articleId;
  if (result.speed < 40) {
    speedAppraise.value = appraise.value[0];
  } else if (result.speed <= 60) {
    speedAppraise.value = appraise.value[1];
  } else if (result.speed <= 80) {
    speedAppraise.value = appraise.value[2];
  } else if (result.speed <= 120) {
    speedAppraise.value = appraise.value[3];
  } else if (result.speed <= 200) {
    speedAppraise.value = appraise.value[4];
  } else {
    speedAppraise.value = appraise.value[5];
  }
  calculate();
});
// 计算百分比
const calculate = () => {
  // 速度占200的百分比
  speedPer.value = Number(((result.speed / maxSpeed.value) * 100).toFixed(0));
  // 输入字数占总字数百分比
  wordPer.value = Number(((result.inputNum / result.wordNum) * 100).toFixed(0));
};

const handleOk = () => {
  store.isShowModal = false;
};

const cancel = () => {
  store.isShowModal = false;
};

const watchResult = () => {
  router.push("/resultPage");
};

const submitResult = async () => {
  const res = await uploadResult({ result });
  const resultId = res.result._id;
  // 关闭弹窗
  store.isShowModal = false;
  router.push({
    name: "resultPage",
    params: { resultId },
  });
};
</script>
<style lang="scss" scoped></style>
