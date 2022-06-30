<template>
  <div class="flex">
    <div class="w-1/4">
      <div class="control shadow-md bg-white">
        <div class="switch w-full py-4 ml-10">
          <span class="font-bold mr-2">是否展示拼音:</span>
          <a-switch v-model:checked="isShowPinYin" />
        </div>
        <Upload></Upload>
        <CommonForm @change-article="getArticle"></CommonForm>
        <Operate
          :isStart="isStart"
          @pause="pauseTime"
          @stop="stopTime"
          @reset="resetTime"
        ></Operate>
        <a-button type="warning" @click="showResult">测试</a-button>
      </div>
    </div>

    <div class="list_body w-1/2">
      <a-list item-layout="horizontal" :data-source="wordLine" class="list">
        <template #renderItem="{ item, index }">
          <a-list-item>
            <div class="flex flex-col">
              <div class="word_body" v-if="isShowPinYin">
                <span
                  class="pinyin_line text-left"
                  v-for="(singlePinYin, lineIndex) in item.pp"
                  :key="lineIndex"
                  :class="[
                    isTure[lineIndex + index * setLineNum] === 1
                      ? 'true'
                      : isTure[lineIndex + index * setLineNum] === 2
                      ? 'false'
                      : '',
                    item.ii[lineIndex] === 0 ? 'half_word' : '',
                    item.ii[lineIndex] === 1 ? 'half_word' : '',
                  ]"
                >
                  {{ singlePinYin }}
                </span>
              </div>
              <div class="word_body">
                <span
                  class="word_line text-left"
                  v-for="(singleWord, lineIndex) in item.ww"
                  :key="lineIndex"
                  :class="[
                    isTure[lineIndex + index * setLineNum] === 1
                      ? 'true'
                      : isTure[lineIndex + index * setLineNum] === 2
                      ? 'false'
                      : '',
                    item.ii[lineIndex] === 0 ? 'half_word' : '',
                    item.ii[lineIndex] === 1 ? 'half_word isblank' : '',
                  ]"
                >
                  {{ singleWord }}
                </span>
              </div>
            </div>
          </a-list-item>
          <a-list-item
            ><a-input
              class="inputCom"
              :ref="(el) => (input[index] = el)"
              v-model:value="inputValue[index]"
              size="large"
              :bordered="true"
              @change="inputCode(index), startTime()"
              @keydown.delete="backSpace(index)"
              :disabled="
                stopDisabled || totalNum === wordLength
                  ? true
                  : false || nowIndex === index
                  ? false
                  : true
              "
          /></a-list-item>
        </template>
      </a-list>
      <div
        v-if="data === ''"
        class="empty text-center text-xl font-sans font-semibold"
      >
        暂无文章，请通过左侧操作栏 “添加文章” 添加测试文章！
      </div>
    </div>
    <div class="w-1/4">
      <a-card title="计分板" class="result_card shadow-md">
        <div class="card_body flex flex-col">
          <div class="time">{{ timeShow }}</div>
          <div class="accuracy">
            正确率:&emsp;<span>{{ accuracy }}</span
            >&emsp;%
          </div>
          <div class="errorNum">
            错&emsp;误:&emsp;<span>{{ errorNum }}</span
            >&emsp;字
          </div>
          <div class="backSpaceNum">
            退&emsp;格:&emsp;<span>{{ backSpaceNum }}</span
            >&emsp;次
          </div>
          <div class="totalNum">
            总字数:&emsp;<span>{{ totalNum }}</span
            >&emsp;字
          </div>
          <div class="wpm">
            速&emsp;度:&emsp;<span>{{ wpm }}</span
            >&emsp;wpm
          </div>
        </div>
      </a-card>
    </div>
    <Result :completeResult="completeResult"></Result>
  </div>
</template>
<script setup>
import { onMounted, reactive, ref, watch, getCurrentInstance } from "vue";
import { Pinyin } from "../tool/ToolGood.Words.Pinyin.js";
import { isABCorNum } from "@/tool/isABCorNum.js";
// 左侧上传
import Upload from "./modules/upload.vue";
// 左侧文章选择表单
import CommonForm from "./modules/form.vue";
// 左侧操作菜单
import Operate from "./modules/operate.vue";
// 结果展示菜单
import Result from "./modules/result.vue";

import { storeToRefs } from "pinia";
import { mainStore } from "@/store/index";
const store = mainStore();
const { proxy } = getCurrentInstance();
onMounted(() => {
  cutWord(data.value, 0);
  getPinYin(data.value);
  combineWordLine(setLineNum.value);
});

// let data = ref(
//   "黑龙江省是冰灯的发源地，早期的冰灯是松嫩平原的农民和松花江流域的渔民冬季的照明工具。主要的制作过程是，把水倒入桶中进行冷冻形成桶状冰坨，再倒出中间未冻的清水，形成中空的“灯罩”，将灯（主要是油灯或蜡烛）放入，便不会被寒风吹灭。后来，人们在春节和元宵节期间也制做冰灯摆在门前，或烫孔穿绳让孩子提着玩，用以增加节日气氛，即形成了民间艺术的雏形。"
// );

let data = ref("");

// let data = ref(`你好你好你好123`);

let pinyinList = reactive([]);

// let data = ref("123");
// input ref
let input = ref([]);
// 输入的内容
let inputValue = reactive([""]);
// 存储拆分后的文章
let word = reactive([]);
// 存储拆分后的文章的长度
let wordLength = ref(0);
// 存储输入后拆分的文章
let inputWord = reactive([]);
// 每一行显示的文章
let wordLine = reactive([]);
// 当前所在行
let nowIndex = ref(0);
// 设置一行显示多少字
let setLineNum = ref(20);
// 判断该字是否输入正确
let isTure = reactive([]);
// 正确率
let accuracy = ref("0");
// 正确数
let correctNum = ref(0);
// 错误数
let errorNum = ref(0);
// 退格数
let backSpaceNum = ref(0);
// 总字数
let totalNum = ref(0);
// 计时器
let timer;
// 计时器起始为0
let now = ref(0);
// 每分钟打字数WPM
let wpm = ref(0);
// 计时器 秒 形式
let time = ref(0);
// 计时器展示
let timeShow = ref("00:00");
// 是否展示拼音
let isShowPinYin = ref(true);
// 是否停止全部禁止输入
let stopDisabled = ref(false);
// 判断是否开始计时，是显示开始/暂停按钮
let isStart = ref(false);
// 完成后，传递给 result 组件的数据
let completeResult = reactive({});
const showResult = () => {
  store.isShowModal = true;
};

const getArticle = (info) => {
  // 清除计时器
  resetTime(true);
  // 更新文章内容
  data.value = info;
  // 将单字数组清零
  word.length = 0;
  cutWord(data.value, 0);
  getPinYin(data.value);
  combineWordLine(setLineNum.value);
};

// 计时器清零
const resetTime = (isReset) => {
  if (isReset) {
    clearInterval(timer);
    // 输入框清除
    inputValue.length = 0;
    now.value = 0;
    startTiming.value = true;
    timeShow.value = "00:00";
    wpm.value = 0;
    stopDisabled.value = false;
    nowIndex.value = 0;
    setTimeout(() => {
      input.value[nowIndex.value].focus();
    }, 0);
  }
};
// 计时器暂停
const pauseTime = (isPause) => {
  if (isPause) {
    clearInterval(timer);
  } else {
    startTiming.value = true;
    startTime();
  }
};

// 计时器停止
const stopTime = (isStop) => {
  if (isStop) {
    stopDisabled.value = true;
    isStart.value = false;
    clearInterval(timer);
    completeResult.time = time.value;
    completeResult.accuracy = accuracy.value;
    completeResult.wpm = wpm.value;
    completeResult.totalNum = totalNum.value;
    completeResult.wordLength = word.length;
    completeResult.correctNum = correctNum.value;
    store.isShowModal = true;
    // console.log(completeResult);
  }
};

// 监听退格事件
const backSpace = (indexs) => {
  // 当输入内容不为空时，退格数加1
  if (inputValue[0].length != 0) {
    backSpaceNum.value++;
  }
  // 当该行内容为0，并且非第一行时，按下退格键，会自动定位至上一个输入框
  if (inputValue[indexs].length === 0 && indexs != 0) {
    nowIndex.value = indexs - 1;
    setTimeout(() => {
      input.value[nowIndex.value].focus();
    }, 0);
  }
};

// 监听输入事件
const inputCode = (indexs) => {
  if (inputValue[indexs].length >= setLineNum.value) {
    // 如果超过5字符，将超过部分分给下一个输入框
    inputValue[indexs + 1] = inputValue[indexs].slice(setLineNum.value);
    // 删除超出部分
    // inputValue[indexs] = inputValue[indexs].replace(
    //   inputValue[indexs].slice(setLineNum.value),
    //   ""
    // );
    // 去前setLineNum.value部分
    inputValue[indexs] = inputValue[indexs].slice(0, setLineNum.value);
    // console.log(inputValue[indexs]);
    // index表示当前所在行
    nowIndex.value = indexs + 1;
    // 自动切换输入框焦点
    setTimeout(() => {
      input.value[nowIndex.value].focus();
    }, 0);
  }
};
// 监听输入数据，大于设置数，则自动切换下一行
watch(inputValue, (newVal, oldVal) => {
  let result = inputValue.join("");
  cutWord(result, 1);
  contrast(word, inputWord);
  // 监听是否完成
  complete();
});

// 将文字拆分成单个数组
// type为0时拆分原文章，为1拆分输入的文章
const cutWord = (article, type) => {
  if (type === 0) {
    for (let i = 0; i < article.length; i++) {
      /**********************************
      暂时没打算做换行，先将换行符改成空格，之后再改！！！！！
      ************************/
      if (article[i] === "\n") {
        word[i] = " ";
      } else {
        word[i] = article[i];
      }
    }
    wordLength.value = word.length;
  } else {
    inputWord.length = 0;
    for (let i = 0; i < article.length; i++) {
      inputWord[i] = article[i];
    }
    totalNum.value = inputWord.length;
  }
};

// 给每行赋值
const combineWordLine = (wordage) => {
  wordLine.length = 0;
  // 按照设置的每行字数，计算处所需多少行
  const maxLine = word.length / wordage;

  // 给每行赋值
  for (let i = 0; i < maxLine; i++) {
    // wordLine[i] = word.slice(wordage * i, wordage * (i + 1)).join("");
    let lineWord = word.slice(wordage * i, wordage * (i + 1)).join("");
    let linePinyin = pinyinList.slice(wordage * i, wordage * (i + 1));
    // 确定每个字符的类型；0是字母或数字，1是空格，2是普通字符
    let isType = [];
    for (let j = 0; j < wordage; j++) {
      // 如果是字母或者数字
      if (isABCorNum(lineWord[j]) === 0) {
        isType[j] = 0;
        // 如果是空格
      } else if (isABCorNum(lineWord[j]) === 1) {
        isType[j] = 1;
      } else {
        isType[j] = 2;
      }
    }
    wordLine.push({
      ww: lineWord,
      pp: linePinyin,
      ii: isType,
    });
  }
  // console.log(wordLine);
};

const getPinYin = (words) => {
  let pinyin = new Pinyin();
  // 获取全拼
  for (let i = 0; i < words.length; i++) {
    pinyinList[i] = pinyin.GetPinyin(words[i]);
  }
};
// 比对方法
const contrast = (article, inputContent) => {
  correctNum.value = 0;
  errorNum.value = 0;
  for (let i = 0; i < inputContent.length; i++) {
    // 正确的输入
    if (article[i] === inputContent[i]) {
      isTure[i] = 1;
      correctNum.value++;
      // console.log(isTure[i]);
    }
    // 错误的输入
    else if (article[i] != inputContent[i]) {
      isTure[i] = 2;
      errorNum.value++;
      // console.log(inputContent[i], i);
    }
  }
  // 计算正确率
  if (totalNum.value != 0) {
    accuracy.value = ((correctNum.value / totalNum.value) * 100).toFixed(0);
  } else {
    accuracy.value = 0;
  }
  for (let j = inputContent.length; j < article.length; j++) {
    isTure[j] = 0;
  }
};
// 是否开始计时
// @change.once会触发两次，暂时不知道为什么，先用这种方法
let startTiming = ref(true);
// 开始计时
// const startTime = () => {
//   if (startTiming.value) {
//     startTiming.value = false;
//     let nowTime = new Date();
//     timer = setInterval(() => {
//       const now = timepiece(nowTime);
//       wpm.value = ((correctNum.value / now.totalSec) * 60).toFixed(0);
//       timeShow.value = now.time;
//       // console.log(now);
//     }, 1000);
//   }
// };

const startTime = () => {
  isStart.value = true;
  if (startTiming.value) {
    startTiming.value = false;
    timer = setInterval(() => {
      now.value += 1000;
      time.value = now.value / 1000;
      timeShow.value = proxy.dayjs(now.value).format("mm:ss");
      wpm.value = ((correctNum.value / now.value) * 1000 * 60).toFixed(0);
    }, 1000);
  }
};
// 计时器
const timepiece = (nowTime) => {
  const diffTime = proxy.dayjs.duration(proxy.dayjs() - nowTime);
  // const day = diffTime.days(); //天
  // const hours = diffTime.hours(); //小时
  // const minutes = diffTime.minutes(); //分钟
  // const seconds = diffTime.seconds(); //秒
  // let time = `${minutes}:${seconds}`;

  let time = proxy.dayjs(diffTime.$ms).format("mm:ss");
  const totalSec = diffTime.$ms / 1000;
  return { time, totalSec };
};
// 监听是否完成，完成则结束计时器
const complete = () => {
  if (inputWord.length == word.length) {
    console.log("stop");
    stopTime(true);
    // 隐藏开始/暂停按钮
    isStart.value = false;
    console.log(wpm.value);
    clearInterval(timer);
  }
};
</script>
<style lang="scss">
.control {
  width: 400px;
  padding: 10px;
  position: fixed;
  top: 80px;
  left: 20px;
  border-radius: 10px;
  border: 1px solid rgba(229, 231, 235, 1);
}
.list {
  margin: 10px auto;
  .ant-list-item {
    display: flex;
    justify-content: flex-start;
    .pinyin_line {
      display: inline-block;
      font-size: 14px;
      width: 36px;
      // margin: 0 7px;
      text-align: center;
    }
    .word_body {
      display: flex;
      .word_line {
        // display: inline-block;
        font-size: 22px;
        width: 36px;
        height: 36px;
        line-height: 36px;
        // margin: 0 7px;
        text-align: center;
      }
    }
  }
}

.inputCom {
  padding: 0;
  padding-left: 6px;
  font-size: 22px;
  letter-spacing: 14px;
  font-family: 幼圆;
  font-weight: bold;
}

.true {
  color: rgb(55, 207, 55);
}

.false {
  color: red;
}
// 占位半格
.half_word {
  width: 25px !important;
}
// 空格
.isblank {
}
.isblank:before {
  content: "·";
}

.result_card {
  width: 300px;
  position: fixed;
  top: 80px;
  right: 20px;
  .card_body {
    padding: 10px 30px;
    .time {
      font-size: 40px;
      font-weight: bold;
      color: rgb(245, 167, 27);
    }
    .accuracy,
    .errorNum,
    .backSpaceNum,
    .totalNum,
    .wpm {
      font-size: 20px;
      font-family: Arial, Helvetica, sans-serif;
    }
  }
}
</style>
